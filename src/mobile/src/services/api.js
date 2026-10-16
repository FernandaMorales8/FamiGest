/**
 * Servicio de conexión con la API Backend de FamiGest (DEC-001)
 */
import { Platform } from 'react-native';

export const NETWORK_IP = "192.168.100.23"; // IP local de tu PC en la red Wi-Fi
export const LOCAL_API_URL = `http://${NETWORK_IP}:8000`;

const getBaseUrl = () => {
  if (Platform.OS === 'web' && typeof window !== "undefined" && window.location) {
    return `http://${window.location.hostname}:8000`;
  }
  return LOCAL_API_URL;
};

export async function checkApiHealth() {
  try {
    const res = await fetch(`${getBaseUrl()}/`);
    return await res.json();
  } catch (error) {
    console.warn("API health check failed:", error);
    return null;
  }
}

export async function getLessons() {
  try {
    const res = await fetch(`${getBaseUrl()}/api/v1/lessons`);
    if (!res.ok) throw new Error("Error al obtener lecciones");
    return await res.json();
  } catch (error) {
    console.error("Error en getLessons:", error);
    // Retorno fallback si la API no está encendida
    return [
      {
        id: 1,
        title: "Vocales (LSM)",
        description: "Aprende las 5 vocales básicas: A, E, I, O, U en Lengua de Señas Mexicana.",
        vocabulary_ids: [1, 2, 3, 4, 5],
        icon: "hand-peace"
      },
      {
        id: 2,
        title: "Abecedario 1 (B, C, D, F, G)",
        description: "Primer bloque del alfabeto dactilológico en señas estáticas.",
        vocabulary_ids: [6, 7, 8, 9, 10],
        icon: "book-alphabet"
      },
      {
        id: 3,
        title: "Emociones Básicas",
        description: "Señas iniciales para comunicar estados de ánimo básicos.",
        vocabulary_ids: [9, 10],
        icon: "emoticon-happy"
      }
    ];
  }
}

export async function evaluateGesture(gestureId, base64Image) {
  try {
    const res = await fetch(`${getBaseUrl()}/api/v1/evaluate/base64`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gesture_id: gestureId,
        image_base64: base64Image,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Error en la evaluación del gesto");
    }

    return await res.json();
  } catch (error) {
    console.error("Error al evaluar gesto:", error);
    throw error;
  }
}
