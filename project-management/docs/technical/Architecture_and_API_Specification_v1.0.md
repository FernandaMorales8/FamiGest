# Especificación de Arquitectura y API REST — FamiGest (v1.0)

**Proyecto:** FamiGest  
**Versión:** `v1.0` (Sprint II — `sprint-2-review-v1.0`)  
**Responsable:** María Fernanda Morales Ríos  

---

## 1. Visión General de la Arquitectura

FamiGest implementa una arquitectura **Cliente-Servidor desacoplada** (Decisión `D-01`) diseñada para delegar el procesamiento intensivo de visión por computadora e inferencia geométrica hacia un servidor backend, permitiendo que la aplicación móvil funcione de manera fluida en dispositivos con recursos de hardware moderados.

```
+-------------------------------------------------------------------+
|                   CLIENTE MÓVIL (React Native / Expo)             |
|                                                                   |
|  [WelcomeScreen] -> [LessonsScreen / ProfileScreen / Settings]    |
|                            |                                      |
|              Generador Aleatorio (D-03 / D-06)                    |
|   [SignIntroduction] -> [MultipleChoice] -> [CameraPractice]      |
+---------------------------------------------------+---------------+
                                                    |
                                 HTTP / JSON (Wi-Fi LAN / REST API)
                                 Frames Base64 & Progreso Usuario
                                                    v
+-------------------------------------------------------------------+
|                     SERVIDOR BACKEND (FastAPI)                    |
|                                                                   |
|  1. MediaPipeLandmarkExtractor (Extracción de 21 puntos 3D)       |
|  2. Normalización Geométrica (Traslación a muñeca + Escala L2)    |
|  3. GestureClassifier (KNN por Similitud Coseno / distancia L2)   |
|  4. DataManager (Persistencia en gestures_data.json y progress)   |
+-------------------------------------------------------------------+
```

---

## 2. Pipeline de Visión por Computadora y Clasificación (`src/api/core/`)

El procesamiento de cada captura enviada desde la cámara móvil atraviesa cuatro etapas deterministas:

1. **Decodificación y Preprocesamiento (`landmark_extractor.py`):**
   - La imagen codificada en Base64 recibida en `/api/v1/evaluate/frame` se decodifica en memoria mediante OpenCV (`cv2.imdecode`) y se convierte del espacio de color BGR a RGB.
2. **Extracción de 21 Puntos Clave (`MediaPipe Hands`):**
   - Se localizan las 21 articulaciones tridimensionales $(x_i, y_i, z_i)$ de la mano, generando un vector crudo de $21 \times 3 = 63$ valores flotantes.
3. **Normalización Geométrica Invariante (`normalize_landmarks`):**
   - **Invarianza a la traslación:** Se toma la muñeca (landmark `0`) como origen del sistema de coordenadas restando $(x_0, y_0, z_0)$ a los 21 puntos:
     $$(x'_i, y'_i, z'_i) = (x_i - x_0,\; y_i - y_0,\; z_i - z_0)$$
   - **Invarianza a la escala (distancia a la cámara):** Se divide el vector centrado entre la distancia euclidiana máxima respecto a la muñeca:
     $$d_{\max} = \max_{i} \sqrt{{x'_i}^2 + {y'_i}^2 + {z'_i}^2}, \quad \hat{v}_i = \frac{(x'_i, y'_i, z'_i)}{d_{\max}}$$
4. **Clasificación por Similitud Coseno (`classifier.py`):**
   - El vector normalizado de 63 dimensiones se compara contra las muestras del catálogo `data/gestures_data.json` mediante similitud coseno reescalada al intervalo $[0, 1]$. Si la similitud respecto a la seña objetivo alcanza o supera el umbral configurado (`threshold = 0.85`), la ejecución se aprueba (`passed: true`).

---

## 3. Especificación de Endpoints de la API REST (`src/api/main.py`)

### 3.1. `GET /health`
Verifica la disponibilidad del servidor, el estado del clasificador y el estado de MediaPipe.
* **Respuesta `200 OK`:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "gestures_loaded": 10,
  "mediapipe_ready": true
}
```

### 3.2. `GET /api/v1/gestures`
Devuelve el catálogo público de señas registradas en la base de datos (`5` vocales y `5` consonantes).

### 3.3. `POST /api/v1/evaluate/landmarks`
Evalúa un vector de 63 coordenadas ya extraídas frente a un `target_gesture_id`.
* **Cuerpo de solicitud (`LandmarkEvaluationRequest`):**
```json
{
  "target_gesture_id": 1,
  "landmarks": [0.45, 0.72, 0.0, "... (63 valores float)"]
}
```

### 3.4. `POST /api/v1/evaluate/frame`
Recibe un fotograma en Base64 desde la cámara del dispositivo móvil, extrae los landmarks con MediaPipe, los normaliza y evalúa si corresponden a la seña solicitada.
* **Cuerpo de solicitud (`FrameEvaluationRequest`):**
```json
{
  "target_gesture_id": 1,
  "image_base64": "/9j/4AAQSkZJRgABAQAAAQABAAD..."
}
```
* **Respuesta `200 OK` (`EvaluationResponse`):**
```json
{
  "hand_detected": true,
  "passed": true,
  "target_gesture_id": 1,
  "target_gesture_name": "a",
  "predicted_gesture_id": 1,
  "predicted_gesture_name": "a",
  "similarity": 0.9412,
  "threshold": 0.85,
  "feedback_message": "¡Excelente! Seña 'A' reconocida correctamente."
}
```

### 3.5. `GET /api/v1/progress`
Obtiene el progreso persistente del usuario almacenado en `data/user_progress.json`.
* **Respuesta `200 OK`:**
```json
{
  "overall": 33,
  "lesson1": 100,
  "lesson2": 0,
  "lesson3": 0
}
```

### 3.6. `POST /api/v1/progress`
Actualiza el puntaje de una lección conservando siempre la calificación histórica más alta (`max(previous_best, score)` — Decisión `D-04` y `D-05`) y recalcula el promedio general (`overall`).
* **Cuerpo de solicitud:**
```json
{
  "lesson_id": 1,
  "score": 95
}
```

### 3.7. `POST /api/v1/progress/reset`
Reinicia a cero el progreso acumulado del usuario en el servidor.
