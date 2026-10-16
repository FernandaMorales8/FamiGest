import base64
import io
from pathlib import Path
from typing import Optional

import cv2
import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from PIL import Image

from .core.data_manager import DataManager, ASSETS_DIR
from .core.evaluator import compare_landmarks
from .core.hand_detector import HandLandmarkExtractor

app = FastAPI(
    title="FamiGest API",
    description="API para reconocimiento y evaluación de señas estáticas de Lengua de Señas Mexicana (LSM)",
    version="1.0.0"
)

# Configuración de CORS para permitir conexiones desde React Native / Expo y navegadores
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicialización de recursos
data_manager = DataManager()
landmark_extractor = HandLandmarkExtractor(static_image_mode=True, max_num_hands=1)

# Montar imágenes estáticas de referencia si existen
reference_imgs_dir = ASSETS_DIR / "ReferenceImg_Display"
if reference_imgs_dir.exists():
    app.mount("/static/reference", StaticFiles(directory=str(reference_imgs_dir)), name="reference_images")


class EvaluateBase64Request(BaseModel):
    gesture_id: int
    image_base64: str


@app.get("/")
def root():
    return {
        "service": "FamiGest LSM API",
        "version": "1.0.0",
        "status": "operational",
        "docs_url": "/docs"
    }


@app.get("/api/v1/lessons")
def get_lessons():
    """Retorna el catálogo de lecciones disponibles en el MVP"""
    return data_manager.get_lessons()


@app.get("/api/v1/lessons/{lesson_id}")
def get_lesson(lesson_id: int):
    """Retorna los detalles y vocabulario de una lección específica"""
    lesson = data_manager.get_lesson(lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lección no encontrada")
    
    # Enriquecer vocabulario con palabras e imágenes
    vocab_details = []
    for gid in lesson.get("vocabulary_ids", []):
        g = data_manager.get_gesture(gid)
        if g:
            vocab_details.append({
                "id": g["id"],
                "word": g["word"],
                "image_url": g["image_url"]
            })
    
    return {
        **lesson,
        "vocabulary": vocab_details
    }


@app.get("/api/v1/gestures/{gesture_id}")
def get_gesture(gesture_id: int):
    """Retorna la información de una seña específica"""
    g = data_manager.get_gesture(gesture_id)
    if not g:
        raise HTTPException(status_code=404, detail="Gesto no encontrado")
    return {
        "id": g["id"],
        "word": g["word"],
        "image_url": g["image_url"]
    }


from PIL import Image, ImageOps

def _process_image_bytes(image_bytes: bytes) -> np.ndarray:
    """Convierte bytes de imagen a numpy array RGB corrigiendo orientación EXIF móvil"""
    img = Image.open(io.BytesIO(image_bytes))
    img = ImageOps.exif_transpose(img)
    img = img.convert("RGB")
    return np.array(img)


def _evaluate_gesture_internal(image_rgb: np.ndarray, gesture_id: int) -> dict:
    target_gesture = data_manager.get_gesture(gesture_id)
    if not target_gesture:
        raise HTTPException(status_code=404, detail=f"Gesto con ID {gesture_id} no registrado en la base de datos.")

    print(f"[INFO] Evaluando '{target_gesture['word']}' (ID: {gesture_id}) | Resolucion: {image_rgb.shape}")

    # 1. Extracción de landmarks
    live_landmarks = landmark_extractor.extract_landmarks(image_rgb)
    if live_landmarks is None:
        print("[WARN] Mano no detectada por MediaPipe")
        return {
            "hand_detected": False,
            "passed": False,
            "score": 0.0,
            "target_id": gesture_id,
            "target_word": target_gesture["word"],
            "message": "No se detectó la mano. Asegúrate de mostrar tu mano frente a la cámara con buena iluminación."
        }

    # 2. Comparación contra landmarks de referencia
    ref_coords = target_gesture["coords"]
    eval_result = compare_landmarks(ref_coords, live_landmarks)
    print(f"[RESULT] Passed: {eval_result['passed']} | Dist: {eval_result['l2_distance']} | Score: {eval_result['score']}")

    if eval_result["passed"]:
        message = f"¡Excelente! Has realizado la seña '{target_gesture['word'].upper()}' correctamente."
    else:
        message = f"Cerca, pero la postura no coincide del todo con '{target_gesture['word'].upper()}'. Revisa el ejemplo e inténtalo de nuevo."

    return {
        "hand_detected": True,
        "passed": eval_result["passed"],
        "score": eval_result["score"],
        "l2_distance": eval_result["l2_distance"],
        "cosine_similarity": eval_result.get("cosine_similarity", 1.0),
        "target_id": gesture_id,
        "target_word": target_gesture["word"],
        "message": message
    }


@app.post("/api/v1/evaluate/upload")
async def evaluate_gesture_upload(
    gesture_id: int = Form(...),
    file: UploadFile = File(...)
):
    """Evalúa un gesto a partir de una imagen enviada por Multipart Form Data"""
    contents = await file.read()
    image_rgb = _process_image_bytes(contents)
    return _evaluate_gesture_internal(image_rgb, gesture_id)


@app.post("/api/v1/evaluate/base64")
async def evaluate_gesture_base64(payload: EvaluateBase64Request):
    """Evalúa un gesto a partir de una imagen en formato Base64 (ideal para React Native)"""
    b64_data = payload.image_base64
    if "," in b64_data:
        b64_data = b64_data.split(",", 1)[1]
    
    try:
        image_bytes = base64.b64decode(b64_data)
        image_rgb = _process_image_bytes(image_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Imagen Base64 inválida: {str(e)}")

    return _evaluate_gesture_internal(image_rgb, payload.gesture_id)
