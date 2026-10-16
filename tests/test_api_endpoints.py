import unittest
import sys
from pathlib import Path
from fastapi.testclient import TestClient

sys.path.append(str(Path(__file__).resolve().parent.parent / "src"))

from api.main import app

class TestAPIEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "operational")

    def test_get_lessons(self):
        response = self.client.get("/api/v1/lessons")
        self.assertEqual(response.status_code, 200)
        lessons = response.json()
        self.assertGreaterEqual(len(lessons), 1)

    def test_get_lesson_1(self):
        response = self.client.get("/api/v1/lessons/1")
        self.assertEqual(response.status_code, 200)
        lesson = response.json()
        self.assertEqual(lesson["id"], 1)
        self.assertIn("vocabulary", lesson)
        self.assertGreaterEqual(len(lesson["vocabulary"]), 1)

    def test_get_gesture_1(self):
        response = self.client.get("/api/v1/gestures/1")
        self.assertEqual(response.status_code, 200)
        gesture = response.json()
        self.assertEqual(gesture["id"], 1)
        self.assertEqual(gesture["word"].lower(), "a")

    def test_user_progress_persistence_and_high_score(self):
        # 1. Reiniciar progreso
        res_reset = self.client.post("/api/v1/progress/reset")
        self.assertEqual(res_reset.status_code, 200)
        self.assertEqual(res_reset.json()["lesson1"], 0)

        # 2. Guardar calificación del 100% en Lección 1
        res_save1 = self.client.post("/api/v1/progress", json={"lesson_id": 1, "score": 100})
        self.assertEqual(res_save1.status_code, 200)
        self.assertEqual(res_save1.json()["lesson1"], 100)
        self.assertEqual(res_save1.json()["overall"], 33)

        # 3. Si repite la lección y obtiene menor calificación (75%), conserva el 100%
        res_save2 = self.client.post("/api/v1/progress", json={"lesson_id": 1, "score": 75})
        self.assertEqual(res_save2.status_code, 200)
        self.assertEqual(res_save2.json()["lesson1"], 100)

        # 4. Consultar progreso guardado y luego limpiar
        res_get = self.client.get("/api/v1/progress")
        self.assertEqual(res_get.status_code, 200)
        self.assertEqual(res_get.json()["lesson1"], 100)
        self.client.post("/api/v1/progress/reset")

if __name__ == "__main__":
    unittest.main()

