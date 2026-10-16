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

if __name__ == "__main__":
    unittest.main()
