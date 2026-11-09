# FamiGest

## Descripción del proyecto

FamiGest es una aplicación móvil educativa orientada al aprendizaje inicial de Lengua de Señas Mexicana (LSM) dentro del entorno familiar.

El proyecto busca reducir la brecha de comunicación entre personas con discapacidad auditiva y sus familiares mediante una herramienta accesible que combine contenido educativo gamificado con retroalimentación automática durante la práctica de señas.

La solución utiliza una arquitectura cliente-servidor con reconocimiento de gestos estáticos basado en visión por computadora (MediaPipe Hands) para analizar la configuración tridimensional de la mano mediante 21 puntos clave (*landmarks*) y proporcionar evaluación en tiempo real.

---

## Objetivo general

Desarrollar un prototipo funcional de una aplicación móvil que permita a familiares de personas con discapacidad auditiva aprender y practicar señas básicas de LSM mediante lecciones guiadas y un sistema de retroalimentación automática.

---

## Información del proyecto

* **Proyecto:** FamiGest  
* **Área:** Desarrollo de software / Inteligencia artificial aplicada / Visión por computadora  
* **Laboratorio:** Laboratorio Abierto: Construcción (CUCEI - Universidad de Guadalajara)  
* **Profesor Responsable:** Dr. Jairo Cain Sánchez Estrada  
* **Asesor:** José Juan Meza Espinosa  
* **Project Leader:** María Fernanda Morales Ríos  
* **Integrantes del Equipo:** María Fernanda Morales Ríos  

---

## Estado actual

* **Sprint actual:** Sprint III — Informe de consolidación y estado de la solución (Cierre de Construcción)  
* **Versión actual:** `construction-handover-v1.0`  

### Avance consolidado al cierre del Laboratorio Abierto: Construcción:
* **Hito 1 (`WBS 1.1 – 1.4` — Planificación y Gestión):** 100% Completado (`sprint-1-plan-baseline-v1.0`).
* **Hito 2 (`WBS 2.1 – 2.4` — Interfaz Móvil y Navegación):** 100% Completado (Diseño UI/UX de alta fidelidad en **Figma** e implementación en React Native / Expo con navegación de 3 pestañas, Lección 1 completa con las 5 vocales `A, E, I, O, U` en alta definición, flujo aleatorio con restricción de precedencia `D-03` y cola de reintentos `D-04`).
* **Hito 3 (`WBS 3.1 – 3.4` — Visión por Computadora y Clasificador):** 100% Completado (Extracción de 21 landmarks 3D con MediaPipe, normalización geométrica invariante a traslación y escala, clasificador KNN por similitud coseno y dataset `data/gestures_data.json`).
* **Hito 4 (`WBS 4.1 – 4.5` — API REST e Integración Remota):** 100% Completado (Servidor FastAPI con evaluación de fotogramas Base64 en tiempo real, persistencia de progreso en `data/user_progress.json` y suite de 9 pruebas automatizadas aprobadas).
* **Hito 5 (`WBS 5.1 – 5.3` — Validación, Optimización y Transferencia):** Paquete de transferencia (`WBS 5.3` — *Handover Package*, informe de consolidación `Sprint_III_Consolidation_Report_v1.0.pdf/.md` y presentación ejecutiva `FamiGest_Lab_Presentation.pdf`) 100% completado; ejecución de prueba piloto con usuarios externos (`WBS 5.1`) y optimizaciones derivadas (`WBS 5.2`) transferidas formalmente al *Laboratorio Abierto: Pruebas* (`D-07`).

---

## Estructura general del repositorio

```text
FamiGest/
├── README.md                                        # Descripción general, estado actual e instrucciones
├── requirements.txt                                 # Dependencias del servidor Backend y Visión Artificial
├── design-baseline/                                 # Línea base de diseño recibida (design-baseline-v1.0)
├── project-management/                              # Documentos formales de gestión, evidencia y seguimiento
│   ├── Sprint_II_Progress_Review_v1.0.md            # Entregable de seguimiento intermedio (Sprint II)
│   ├── Sprint_III_Consolidation_Report_v1.0.md      # Informe de consolidación y Handover Package (Sprint III)
│   ├── Sprint_III_Consolidation_Report_v1.0.pdf     # Versión formal en PDF del informe de consolidación (Sprint III)
│   ├── charter/                                     # Project_Charter_v1.0.pdf y SMART_Goals_v1.0.pdf
│   ├── wbs/                                         # WBS_v1.0.xlsx, WBS_v1.1.xlsx y WBS_v1.2.xlsx
│   ├── raci/                                        # RACI_v1.0.xlsx
│   ├── risks/                                       # RiskRegister_v1.0.xlsx, v1.1.xlsx y v1.2.xlsx
│   ├── schedule/                                    # Gantt_Schedule_v1.0.xlsx, v1.1.xlsx y v1.2.xlsx
│   ├── decisions/                                   # Decision_Log.xlsx (Decisiones D-01 a D-07)
│   ├── docs/technical/                              # Especificación técnica (Architecture_and_API_Specification_v1.0.md)
│   └── evidence/                                    # Evidencia visual, funcional y ejecutiva del proyecto
│       ├── README.md                                # Índice de evidencias y trazabilidad con la WBS
│       ├── figma-mockups/                           # 9 Mockups PNG y video demo en Figma (WBS 2.1-2.4)
│       ├── mobile-testing/                          # 12 Capturas y video demo en dispositivo móvil físico
│       └── presentation/                            # Presentación ejecutiva de cierre (FamiGest_Lab_Presentation.pdf)
├── data/                                            # Base de datos de vectores de señas (gestures_data.json)
├── src/                                             # Código fuente del sistema integrado
│   ├── api/                                         # Servidor Backend FastAPI + MediaPipe + Clasificador
│   └── mobile/                                      # Aplicación móvil en React Native (Expo)
└── tests/                                           # Pruebas automatizadas y reportes de verificación
    ├── test_api_endpoints.py                        # Suite de 9 pruebas unitarias y de integración
    ├── test_vision_core.py                          # Pruebas unitarias del núcleo de visión computacional
    └── Test_Report_v1.0.pdf                         # Reporte de resultados de pruebas del Sprint II
```

---

## Instrucciones de ejecución y reproducción

### 1. Iniciar el Servidor Backend (API REST + MediaPipe)
Desde la raíz del repositorio (con Python 3.10+):
```bash
pip install -r requirements.txt
python -m uvicorn src.api.main:app --host 0.0.0.0 --port 8000
```
* La documentación interactiva de la API estará disponible en `http://localhost:8000/docs`.

### 2. Ejecutar las Pruebas Automatizadas
```bash
python -m unittest discover -s tests -v
```

### 3. Iniciar la Aplicación Móvil (Expo / React Native)
```bash
cd src/mobile
npm install
npx expo start
```
* Verifica que la constante `LOCAL_SERVER_IP` en `src/mobile/src/services/api.js` corresponda a la dirección IPv4 local de la computadora donde se ejecuta la API, y escanea el código QR con **Expo Go** desde el teléfono móvil conectado a la misma red Wi-Fi.
