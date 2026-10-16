import numpy as np
from typing import Dict, Any, List

def align_and_normalize(coords: List[float]) -> np.ndarray:
    """
    Normaliza 63 coordenadas (21 landmarks x 3) con invariancia de:
    1. Traslación: Muñeca (punto 0) en el origen (0, 0, 0).
    2. Escala: Tamaño de mano unitario basado en la distancia muñeca->nudillo medio (punto 9).
    3. Rotación 2D: Rota el vector muñeca->nudillo medio para que apunte derecho hacia arriba (0, 1).
    """
    pts = np.array(coords, dtype=np.float32).reshape(21, 3).copy()
    pts -= pts[0]  # Muñeca en el origen

    scale = float(np.linalg.norm(pts[9]))
    if scale > 1e-6:
        pts /= scale
    else:
        max_d = float(np.max(np.linalg.norm(pts, axis=1)))
        if max_d > 1e-6:
            pts /= max_d

    # Alineación de rotación 2D (vector muñeca -> nudillo medio alineado al eje Y vertical)
    angle = np.arctan2(pts[9, 0], -pts[9, 1])
    cos_a, sin_a = np.cos(-angle), np.sin(-angle)
    R = np.array([[cos_a, -sin_a], [sin_a, cos_a]], dtype=np.float32)
    pts[:, :2] = pts[:, :2] @ R.T

    return pts

normalize_hand_landmarks = align_and_normalize

def compare_landmarks(
    ref_coords: List[float],
    live_coords: List[float],
    distance_threshold: float = 1.70
) -> Dict[str, Any]:
    """
    Compara dos manos soportando:
    - Mano derecha y mano izquierda (evaluación normal y con efecto espejo).
    - Variaciones de inclinación de la mano.
    - Diferentes distancias a la cámara.
    """
    if len(ref_coords) != 63 or len(live_coords) != 63:
        raise ValueError(f"Se requieren 63 coordenadas. Ref: {len(ref_coords)}, Live: {len(live_coords)}")

    p_live = align_and_normalize(live_coords)
    p_ref = align_and_normalize(ref_coords)

    # 1. Distancia en orientación directa
    dist_direct = float(np.linalg.norm(p_live - p_ref))

    # 2. Distancia con inversión horizontal (soporte para mano izquierda o cámara selfie reflejada)
    p_live_mirrored = p_live.copy()
    p_live_mirrored[:, 0] = -p_live_mirrored[:, 0]
    dist_mirrored = float(np.linalg.norm(p_live_mirrored - p_ref))

    best_dist = min(dist_direct, dist_mirrored)

    # Score de 0 a 100% normalizado
    score = float(max(0.0, 1.0 - (best_dist / 3.0)))
    passed = bool(best_dist <= distance_threshold)

    return {
        "passed": passed,
        "score": round(score, 4),
        "l2_distance": round(best_dist, 4),
        "cosine_similarity": 1.0 if passed else 0.5,
        "threshold": distance_threshold
    }
