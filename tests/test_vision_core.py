import unittest
import sys
from pathlib import Path

# Agregar src a sys.path
sys.path.append(str(Path(__file__).resolve().parent.parent / "src"))

from api.core.data_manager import DataManager
from api.core.evaluator import compare_landmarks, normalize_hand_landmarks

class TestVisionCore(unittest.TestCase):
    def setUp(self):
        self.dm = DataManager()

    def test_data_manager_loads_gestures(self):
        gestures = self.dm.get_all_gestures()
        self.assertGreaterEqual(len(gestures), 5, "Deberían cargarse al menos 5 gestos de referencia")
        vowel_a = self.dm.get_gesture(1)
        self.assertIsNotNone(vowel_a)
        self.assertEqual(vowel_a["word"].lower(), "a")
        self.assertEqual(len(vowel_a["coords"]), 63)

    def test_data_manager_loads_lessons(self):
        lessons = self.dm.get_lessons()
        self.assertGreaterEqual(len(lessons), 1)
        self.assertEqual(lessons[0]["id"], 1)
        self.assertIn(1, lessons[0]["vocabulary_ids"])

    def test_compare_landmarks_identical(self):
        coords = self.dm.get_gesture(1)["coords"]
        result = compare_landmarks(coords, coords)
        self.assertTrue(result["passed"])
        self.assertEqual(result["score"], 1.0)
        self.assertEqual(result["l2_distance"], 0.0)
        self.assertAlmostEqual(result["cosine_similarity"], 1.0, places=3)

    def test_compare_landmarks_different(self):
        coords_a = self.dm.get_gesture(1)["coords"]
        coords_i = self.dm.get_gesture(3)["coords"]
        result = compare_landmarks(coords_a, coords_i)
        # 'a' vs 'i' tienen configuraciones de dedos completamente opuestas
        self.assertFalse(result["passed"])
        self.assertGreater(result["l2_distance"], 1.5)

if __name__ == "__main__":
    unittest.main()
