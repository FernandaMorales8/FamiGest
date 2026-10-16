import csv
import json
from pathlib import Path
from typing import Dict, List, Optional, Any

# Ubicaciones absolutas basadas en la raíz del repositorio
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DATA_DIR = BASE_DIR / "data"
ASSETS_DIR = BASE_DIR / "assets"

class DataManager:
    def __init__(self, data_dir: Optional[Path] = None):
        self.data_dir = data_dir or DATA_DIR
        self.gesture_csv_path = self.data_dir / "gesture_data.csv"
        self.progress_json_path = self.data_dir / "user_progress.json"
        self._gestures_by_id: Dict[int, Dict[str, Any]] = {}
        self._lessons: List[Dict[str, Any]] = []
        self._load_gestures()
        self._load_lessons()

    def _load_gestures(self):
        """Carga las 63 coordenadas y palabras de gesture_data.csv"""
        if not self.gesture_csv_path.exists():
            return

        with open(self.gesture_csv_path, newline="", encoding="utf-8") as f:
            reader = csv.reader(f)
            for row in reader:
                if len(row) >= 65:
                    try:
                        gesture_id = int(row[63])
                        word = str(row[64]).strip()
                        coords = [float(x) for x in row[:63]]
                        self._gestures_by_id[gesture_id] = {
                            "id": gesture_id,
                            "word": word,
                            "coords": coords,
                            "image_url": f"/static/reference/{gesture_id}_{word.lower()}.jpg"
                        }
                    except (ValueError, IndexError):
                        continue

    def _load_lessons(self):
        """Carga el catálogo de lecciones iniciales"""
        lessons_json_path = self.data_dir / "lessons.json"
        if not lessons_json_path.exists():
            # Carga por defecto si no existe archivo
            self._lessons = [
                {
                    "id": 1,
                    "title": "Vocales (LSM)",
                    "description": "Aprende las 5 vocales básicas: A, E, I, O, U en Lengua de Señas Mexicana.",
                    "vocabulary_ids": [1, 2, 3, 4, 5],
                    "icon": "hand-peace"
                },
                {
                    "id": 2,
                    "title": "Abecedario 1 (B, C, D, F, G)",
                    "description": "Primer bloque del alfabeto dactilológico en señas estáticas.",
                    "vocabulary_ids": [6, 7, 8, 9, 10],
                    "icon": "book-alphabet"
                },
                {
                    "id": 3,
                    "title": "Emociones Básicas",
                    "description": "Señas iniciales para comunicar estados de ánimo básicos.",
                    "vocabulary_ids": [9, 10],
                    "icon": "emoticon-happy"
                }
            ]
        else:
            with open(lessons_json_path, "r", encoding="utf-8") as f:
                self._lessons = json.load(f)

    def get_gesture(self, gesture_id: int) -> Optional[Dict[str, Any]]:
        return self._gestures_by_id.get(gesture_id)

    def get_all_gestures(self) -> List[Dict[str, Any]]:
        return list(self._gestures_by_id.values())

    def get_lessons(self) -> List[Dict[str, Any]]:
        return self._lessons

    def get_lesson(self, lesson_id: int) -> Optional[Dict[str, Any]]:
        for l in self._lessons:
            if l["id"] == lesson_id:
                return l
        return None

    def get_user_progress(self) -> Dict[str, int]:
        """Obtiene el progreso persistente del usuario desde disco"""
        default_progress = {"overall": 0, "lesson1": 0, "lesson2": 0, "lesson3": 0}
        if not self.progress_json_path.exists():
            return default_progress
        try:
            with open(self.progress_json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return {
                    "overall": int(data.get("overall", 0)),
                    "lesson1": int(data.get("lesson1", 0)),
                    "lesson2": int(data.get("lesson2", 0)),
                    "lesson3": int(data.get("lesson3", 0)),
                }
        except Exception:
            return default_progress

    def save_lesson_progress(self, lesson_id: int, score: int) -> Dict[str, int]:
        """Actualiza el progreso conservando la puntuación más alta (D-04) y lo persiste en disco"""
        progress = self.get_user_progress()
        key = f"lesson{lesson_id}"
        clamped_score = max(0, min(100, int(score)))
        previous_best = progress.get(key, 0)
        progress[key] = max(previous_best, clamped_score)

        l1 = progress.get("lesson1", 0)
        l2 = progress.get("lesson2", 0)
        l3 = progress.get("lesson3", 0)
        progress["overall"] = round((l1 + l2 + l3) / 3)

        self.data_dir.mkdir(parents=True, exist_ok=True)
        with open(self.progress_json_path, "w", encoding="utf-8") as f:
            json.dump(progress, f, indent=2)

        return progress

    def reset_user_progress(self) -> Dict[str, int]:
        """Reinicia el progreso del usuario a cero en disco"""
        default_progress = {"overall": 0, "lesson1": 0, "lesson2": 0, "lesson3": 0}
        self.data_dir.mkdir(parents=True, exist_ok=True)
        with open(self.progress_json_path, "w", encoding="utf-8") as f:
            json.dump(default_progress, f, indent=2)
        return default_progress

