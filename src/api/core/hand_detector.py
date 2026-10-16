import cv2
import mediapipe as mp
import numpy as np
from typing import Optional, List, Tuple
from pathlib import Path

class HandLandmarkExtractor:
    """
    Extractor de landmarks con MediaPipe robusto para móviles:
    - Umbral de confianza optimizado para cámaras de celulares (0.45).
    - Detección adaptativa de orientación: si el celular envía la imagen rotada (horizontal/vertical),
      prueba rotaciones automáticamente para garantizar que la mano sea detectada.
    """
    def __init__(
        self,
        static_image_mode: bool = True,
        max_num_hands: int = 1,
        min_detection_confidence: float = 0.45,
        min_tracking_confidence: float = 0.45,
    ):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=static_image_mode,
            max_num_hands=max_num_hands,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence,
        )

    def _extract_from_frame(self, frame_rgb: np.ndarray) -> Optional[List[float]]:
        results = self.hands.process(frame_rgb)
        if not results.multi_hand_landmarks:
            return None

        hand_landmarks = results.multi_hand_landmarks[0]
        coords = []
        for lm in hand_landmarks.landmark:
            coords.extend([float(lm.x), float(lm.y), float(lm.z)])

        if len(coords) == 63:
            return coords
        return None

    def extract_landmarks(self, image_rgb: np.ndarray) -> Optional[List[float]]:
        """
        Recibe una imagen RGB (numpy ndarray).
        1. Intenta en orientación normal.
        2. Si no detecta, prueba rotaciones de 90° CW, 90° CCW y espejo (corrección de sensores móviles).
        """
        # Intento 1: Orientación original
        coords = self._extract_from_frame(image_rgb)
        if coords:
            return coords

        # Intento 2: Rotación 90° Horario (típico en sensores de smartphone portrait guardados como landscape)
        rot_90_cw = cv2.rotate(image_rgb, cv2.ROTATE_90_CLOCKWISE)
        coords = self._extract_from_frame(rot_90_cw)
        if coords:
            return coords

        # Intento 3: Rotación 90° Antihorario
        rot_90_ccw = cv2.rotate(image_rgb, cv2.ROTATE_90_COUNTERCLOCKWISE)
        coords = self._extract_from_frame(rot_90_ccw)
        if coords:
            return coords

        # Intento 4: Espejo horizontal (para cámara frontal)
        flipped = cv2.flip(image_rgb, 1)
        coords = self._extract_from_frame(flipped)
        if coords:
            return coords

        return None

    def close(self):
        self.hands.close()
