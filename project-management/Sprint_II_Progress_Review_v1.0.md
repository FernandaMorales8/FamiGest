# Sprint II Progress Review — FamiGest

**Proyecto:** FamiGest — Aplicación móvil interactiva para el aprendizaje inicial de la Lengua de Señas Mexicana (LSM)  
**Curso:** Laboratorio Abierto: Construcción (Ciclo Escolar 2026)  
**Profesor Responsable:** Dr. Jairo Cain Sánchez Estrada  
**Mentor (Project Sponsor):** José Juan Meza Espinosa  
**Project Leader:** María Fernanda Morales Ríos  
**Versión de Entrega:** `sprint-2-review-v1.0`  
**Fecha de Corte:** Octubre 2026  

---

## 1. Actividades Planeadas para el Sprint II

De acuerdo con la línea base establecida en el Sprint I (`sprint-1-plan-baseline-v1.0`), durante el Sprint II se programó la ejecución técnica de los tres hitos centrales de construcción del sistema:

* **Hito 2 — Interfaz de Usuario y Navegación (`WBS 2.1 – 2.4`):**
  * `2.1` Configuración de estructura base con Expo y React Native.
  * `2.2` Diseño e implementación de la pantalla de Lecciones y flujo pedagógico.
  * `2.3` Implementación de pantalla de Práctica con vista de cámara.
  * `2.4` Componentes UI de retroalimentación (*Correcto / Incorrecto*).
* **Hito 3 — Visión por Computadora y Clasificación de Señas (`WBS 3.1 – 3.4`):**
  * `3.1` Configuración del pipeline de visión por computadora con MediaPipe.
  * `3.2` Extracción de 21 puntos clave mediante MediaPipe Hands.
  * `3.3` Normalización geométrica de coordenadas de la mano.
  * `3.4` Implementación e integración del clasificador de señas estáticas y base de datos de referencia.
* **Hito 4 — API e Integración del Procesamiento Remoto (`WBS 4.1 – 4.5`):**
  * `4.1` Diseño y configuración de la API REST.
  * `4.2` Integración del pipeline de visión por computadora en la API.
  * `4.3` Procesamiento de capturas y ejecución remota del pipeline.
  * `4.4` Envío de resultado de clasificación a la aplicación móvil.
  * `4.5` Integración de retroalimentación, persistencia de progreso y manejo de errores.

---

## 2. Actividades Realizadas y Trazabilidad en GitHub

Todas las actividades planeadas para los Hitos 2, 3 y 4 fueron concluidas al **100%** siguiendo estrictamente el flujo obligatorio `Issue → Branch → Commits → Pull Request → Review → Merge`:

| WBS ID | Actividad Realizada | Responsable | Issue | Rama (`Branch`) | Pull Request | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **2.1 – 2.4** | Diseño de mockups UI/UX de alta fidelidad en **Figma** (`project-management/evidence/figma-mockups/`) y construcción de la aplicación móvil en React Native (Expo), navegación de tres pestañas, flujo de lecciones, vista de cámara y componentes de retroalimentación visual. | María Fernanda Morales Ríos | **Issue `#17`** | `wbs-2-mobile` | **PR `#18`** | **Terminada (`Done`)** |
| **3.1 – 3.4** | Implementación del extractor `MediaPipeLandmarkExtractor` (21 puntos 3D / 63 coordenadas), normalización geométrica invariante a traslación y escala, clasificador KNN por similitud coseno y dataset `gestures_data.json`. | María Fernanda Morales Ríos | **Issue `#19`** | `feature/19-vision-pipeline` | **PR `#20`** | **Terminada (`Done`)** |
| **4.1 – 4.5** | Construcción del servidor FastAPI (`src/api/main.py`), endpoints de evaluación remota (`/api/v1/evaluate/frame`, `/api/v1/evaluate/landmarks`), cliente HTTP móvil (`src/mobile/src/services/api.js`) y suite de pruebas automatizadas (`tests/test_api_endpoints.py`). | María Fernanda Morales Ríos | **Issue `#21`** | `feature/21-api-integration` | **PR `#22`** | **Terminada (`Done`)** |
| **4.1 / 2.2** | Implementación de persistencia del progreso del usuario en servidor (`data/user_progress.json`), endpoints `GET/POST /api/v1/progress`, retención del puntaje máximo histórico y optimización de transiciones de estado en móvil. | María Fernanda Morales Ríos | **Issue `#23`** | `feature/23-progress-persistence` | **PR `#24`** | **Terminada (`Done`)** |
| **2.2 / 3.4** | Expansión de la Lección 1 con el módulo completo de las 5 vocales en LSM (`A`, `E`, `I`, `O`, `U`) e incorporación de fotografías de referencia en alta definición (`1_a.jpg` a `5_u.jpg`). | María Fernanda Morales Ríos | **Issue `#25`** | `feature/25-complete-vowels-lesson1` | **PR `#26`** | **Terminada (`Done`)** |
| **2.2** | Implementación del generador aleatorio de práctica intercalada (*Topological Random Walk* — `buildRandomizedLessonFlow()`) respetando la precedencia pedagógica `D-03`. | María Fernanda Morales Ríos | **Issue `#27`** | `feature/27-randomized-lesson-flow` | **PR `#28`** | **Terminada (`Done`)** |
| **2.1 – 2.4** | Incorporación de los 9 mockups UI/UX de alta fidelidad y video interactivo diseñados en **[Figma (Ver proyecto en línea)](https://www.figma.com/design/YClQ7sWRluo7v2CWfkawCx/FamiGest?node-id=4-81&t=JIwKSSdXiPD93RNE-1)** dentro de `project-management/evidence/figma-mockups/` junto con su matriz de trazabilidad. | María Fernanda Morales Ríos | **Issue `#29`** | `feature/29-figma-mockups` | **PR `#30`** | **Terminada (`Done`)** |
| **2.1 – 4.5** | Incorporación de evidencia de ejecución real en dispositivo móvil físico (12 capturas de pantalla y video demostrativo en vivo conectando Expo Go con el servidor FastAPI + MediaPipe) dentro de `project-management/evidence/mobile-testing/`. | María Fernanda Morales Ríos | **Issue `#31`** | `feature/31-mobile-testing-evidence` | **PR `#32`** | **Terminada (`Done`)** |
| **1.1 – 4.5** | Consolidación del `Sprint_II_Progress_Review_v1.0.md`, actualización de documentos vivos a versión `v1.1` (`WBS`, `Gantt`, `RiskRegister`), bitácora `Decision_Log.xlsx`, especificación técnica y reporte de pruebas. | María Fernanda Morales Ríos | **Issue `#33`** | `docs/33-sprint2-progress-review` | **PR `#34`** | **Terminada (`Done`)** |

---

## 3. Hitos Alcanzados

1. **Hito 1 (Sprint I):** Planificación y Gestión del Proyecto (`WBS 1.1 – 1.4`) — **100% Completado**.
2. **Hito 2 (Sprint II):** Interfaz de Usuario y Navegación (`WBS 2.1 – 2.4`, incluyendo mockups en Figma y vistas en React Native) — **100% Completado**.
3. **Hito 3 (Sprint II):** Visión por Computadora y Clasificación de Señas (`WBS 3.1 – 3.4`) — **100% Completado**.
4. **Hito 4 (Sprint II):** API e Integración del Procesamiento Remoto (`WBS 4.1 – 4.5`) — **100% Completado**.

---

## 4. Actividades Pendientes (Programadas para el Sprint III)

Conforme al cronograma original (`Gantt_Schedule_v1.1.xlsx`), quedan pendientes únicamente las actividades correspondientes al **Hito 5: Validación, Optimización y Entrega (`WBS 5.1 – 5.3`)**, programadas del **19 de octubre al 8 de noviembre de 2026**:

* **`WBS 5.1`:** Ejecución del protocolo de prueba piloto con 2 usuarios finales.
* **`WBS 5.2`:** Corrección de errores derivados de la prueba piloto, ajustes de rendimiento y habilitación en interfaz de las Lecciones 2 y 3 (cuyos vectores de referencia ya se encuentran cargados en `data/gestures_data.json`).
* **`WBS 5.3`:** Elaboración del paquete final de transferencia (*Construction Handover Package* — `construction-handover-v1.0`) hacia el *Laboratorio Abierto: Pruebas*.

---

## 5. Desviaciones Respecto de la Línea Base

* **Alcance Técnico y Cronograma:** No se presentaron retrasos en la entrega de los Hitos 2, 3 y 4 al cierre del Sprint II. Durante la fase de integración se aplicó una estrategia de corte vertical (*Vertical Slice* — Decisión `D-02`), validando primero el flujo de extremo a extremo con las vocales `A` y `E` (`Issues #17 a #23`) e incorporando inmediatamente después las vocales restantes `I`, `O`, `U` (`Issue #25`), cerrando el Sprint II con las 5 vocales operativas al 100%.
* **Dimensionalidad de Landmarks (`WBS 3.3`):** Mientras que la descripción preliminar de la tarea `3.3` mencionaba coordenadas `(x, y)`, durante la construcción de `MediaPipeLandmarkExtractor` se preservaron las **3 coordenadas espaciales `(x, y, z)`** de los 21 puntos clave (63 características normalizadas), mejorando la discriminación de profundidad entre señas frontales como `A` y `E`.

---

## 6. Recursos Planeados y Utilizados

| Recurso | Planeado en Sprint I | Utilizado en Sprint II | Observaciones |
| :--- | :--- | :--- | :--- |
| **Diseño UI/UX** | Prototipado de pantallas móviles | **[Figma](https://www.figma.com/design/YClQ7sWRluo7v2CWfkawCx/FamiGest?node-id=4-81&t=JIwKSSdXiPD93RNE-1)** (`project-management/evidence/figma-mockups/`) | 9 mockups de alta fidelidad y prototipo interactivo en línea (`node-id=4-81`). |
| **Entorno Móvil** | React Native + Expo SDK 54 + `expo-camera` | React Native `0.81` + Expo `54.0` + `expo-camera` | Ejecutado y validado en dispositivo físico real mediante Expo Go en red local. |
| **Servidor / API** | Python + FastAPI + Uvicorn | Python `3.12` + FastAPI `0.110+` + Uvicorn + Pydantic | Desplegado en servidor local (`0.0.0.0:8000`) accesible vía Wi-Fi LAN. |
| **Visión Artificial** | MediaPipe Hands + NumPy + OpenCV | `mediapipe`, `opencv-python-headless`, `numpy` | Procesamiento remoto de imágenes Base64 y extracción de 21 landmarks 3D. |
| **Almacenamiento** | Archivo estructurado JSON en servidor | `data/gestures_data.json` y `data/user_progress.json` | Persistencia ligera sin requerir motor de base de datos relacional externo. |

---

## 7. Riesgos Materializados

Durante el desarrollo y las pruebas en dispositivo físico se materializaron parcialmente tres riesgos previstos en el `RiskRegister_v1.0.xlsx`, activándose exitosamente sus planes de respuesta y contingencia:

1. **`R-02` (Extracción imprecisa de puntos clave por encuadre o iluminación):** Durante las pruebas con cámara frontal, algunas posturas tardaban en ser reconocidas si el usuario acercaba demasiado la mano. Se mitigó incorporando la guía de encuadre en pantalla, normalización invariante a escala y el botón **"Saltar"** con cola de segunda oportunidad al final de la lección (`D-04`).
2. **`R-05` (Complejidad durante la fase de integración entre Expo Camera, API y clasificador):** Para evitar bloqueos al integrar simultáneamente todos los módulos, se ejecutó la contingencia `D-02` (*Vertical Slice*), conectando primero el flujo completo con un subconjunto controlado y expandiéndolo posteriormente a las 5 vocales completas.
3. **`R-06` (Dificultad de usabilidad por instrucciones o imágenes poco claras):** Se detectó que los recortes originales del diccionario tenían baja resolución y que el usuario no debía ser evaluado en cámara sin conocer antes la seña. Se mitigó creando la pantalla previa `SignIntroductionScreen` (`D-03`) y reemplazando las imágenes por fotografías de referencia en alta definición (`D-06`, `Issue #25`).

---

## 8. Nuevos Riesgos Identificados (`R-08`)

Se incorporó en `RiskRegister_v1.1.xlsx` el siguiente riesgo detectado durante las pruebas iterativas del Sprint II:

* **`R-08` — Memorización mecánica del orden de ejercicios o bloqueo de estado entre capturas consecutivas de cámara:**
  * **Causa:** Una secuencia fija de ejercicios permite adivinar qué letra sigue al repetir la lección; adicionalmente, cuando dos ejercicios de cámara seguidos ocurrían al reintentar ejercicios saltados, React reutilizaba la instancia visual si no existía una llave única por intento.
  * **Acción tomada:** Se implementó el generador de sorteo topológico `buildRandomizedLessonFlow()` (`Issue #27`) y se asignaron llaves únicas por intento (`key`) junto con reinicio explícito de estado en `CameraPracticeScreen.js` (`Issue #23`). **Estado actual:** *Mitigado / Cerrado*.

---

## 9. Incidencias Registradas y Resueltas

Durante las pruebas de integración en dispositivo físico se identificaron y corrigieron tres incidencias técnicas (documentadas y resueltas en el **Issue `#23` / PR `#24`**):

1. **Incidencia `INC-01` (Salto visual al alternar entre pestañas inferiores):** Desmontar y volver a montar `SafeAreaView` y las animaciones SVG de los botones triangulares generaba un tirón visual al cambiar entre *Perfil*, *Lecciones* y *Configuración*. **Solución:** Se mantuvieron las tres vistas principales montadas en memoria dentro de un contenedor común y se homologó el tamaño del encabezado.
2. **Incidencia `INC-02` (Persistencia de estado en ejercicios de cámara consecutivos):** Al pasar del último ejercicio normal de cámara a un ejercicio de cámara previamente saltado, la pantalla conservaba el estado `isCorrect = true`. **Solución:** Se agregó una `key` única por ejercicio e intento y un `useEffect` de limpieza al cambiar de letra o `gestureId`.
3. **Incidencia `INC-03` (Cierre obsoleto en el auto-avance de cámara):** El temporizador de auto-avance a los 800 ms tras detectar una seña correcta invocaba una referencia anterior de `onCorrect`. **Solución:** Se sincronizó el callback mediante `useRef` (`onCorrectRef.current`).

---

## 10. Registro de Decisiones (`Decision_Log.xlsx`)

Se encuentran documentadas 6 decisiones arquitectónicas y de producto en `project-management/decisions/Decision_Log.xlsx`:

* **`D-01` (26/08/2026):** Incorporar una API REST para el procesamiento de visión por computadora y gestión remota de datos de FamiGest.
* **`D-02` (13/10/2026):** Priorizar la integración de extremo a extremo (*Vertical Slice*) con la Lección 1 (Vocales) durante el Sprint II en apego a la contingencia del riesgo `R-05`.
* **`D-03` (13/10/2026):** Incorporar pantalla de introducción anatómica (`SignIntroductionScreen`) y ejercicio de opción múltiple previos a la práctica con cámara, garantizando que nunca se evalúe una seña no presentada (`R-06`).
* **`D-04` (14/10/2026):** Implementar botón de salto con cola de segunda oportunidad al final de la lección y conservar siempre la puntuación histórica más alta (`Math.max`) en el perfil (`R-02`).
* **`D-05` (15/10/2026):** Implementar persistencia del progreso del usuario en el servidor mediante los endpoints `GET/POST /api/v1/progress` y `/api/v1/progress/reset` respaldados por `data/user_progress.json` (`R-04`).
* **`D-06` (17/10/2026):** Incorporar fotografías de referencia en alta definición para las 5 vocales (`A, E, I, O, U`) y un generador aleatorio de práctica intercalada (*Topological Random Walk*) que evita la memorización mecánica respetando `D-03` (`R-06`, `R-08`).

---

## 11. Cambios Realizados Durante la Construcción

1. **Adición de módulo de persistencia de progreso en la API REST (`GET /api/v1/progress`, `POST /api/v1/progress`, `POST /api/v1/progress/reset`).**
2. **Estructuración pedagógica en 3 etapas por vocal (Introducción → Opción Múltiple → Cámara) con ordenamiento aleatorio con restricción de precedencia (`buildRandomizedLessonFlow()`).**
3. **Sustitución de recortes de baja resolución por fotografías de estudio en alta definición (`1_a.jpg` a `5_u.jpg`) sin etiquetas de texto que revelen la respuesta.**

---

## 12. Justificación de los Cambios

* **Persistencia en API (`D-05`):** Garantiza que el usuario conserve su avance real y sus mejores calificaciones al cerrar y reabrir la aplicación, cumpliendo con la arquitectura cliente-servidor establecida en `D-01` y en el *Project Charter*.
* **Flujo aleatorio con precedencia (`D-03`, `D-06`):** En aplicaciones de aprendizaje gamificado (como Duolingo), presentar los ejercicios en un orden fijo fomenta que el usuario responda por memoria de posición y no por reconocimiento real de la seña. El sorteo topológico introduce variabilidad en cada partida sin infringir la regla pedagógica de presentar primero cada letra.
* **Imágenes en alta definición (`D-06`):** Permite distinguir con total claridad la posición de cada falange y del pulgar en señas visualmente cercanas como `A` y `E`.

---

## 13. Impacto sobre el Proyecto

* **Impacto en Calidad y Usabilidad:** Positivo; la experiencia de aprendizaje en la Lección 1 es fluida, sin bloqueos de cámara, con imágenes nítidas y rejugabilidad real gracias a la aleatorización.
* **Impacto en Tiempo y Alcance:** Nulo sobre la fecha de entrega final; los Hitos 2, 3 y 4 se completaron dentro de la ventana del Sprint II (18 de octubre de 2026) y las 9 pruebas automatizadas de la API pasan al 100%.

---

## 14. WBS Actualizada

* Archivo actualizado en el repositorio: [`project-management/wbs/WBS_v1.1.xlsx`](file:///D:/Documents/Sem8/Laboratorio_Abierto_Construccion/FamiGest/project-management/wbs/WBS_v1.1.xlsx).
* Todas las tareas de los bloques **1 (`1.1–1.4`)**, **2 (`2.1–2.4`)**, **3 (`3.1–3.4`)** y **4 (`4.1–4.5`)** cuentan con estado **Terminada** y referencia cruzada a sus respectivos Issues y Pull Requests.

---

## 15. Matriz RACI

* Archivo vigente en el repositorio: [`project-management/raci/RACI_v1.0.xlsx`](file:///D:/Documents/Sem8/Laboratorio_Abierto_Construccion/FamiGest/project-management/raci/RACI_v1.0.xlsx).
* No requirió modificaciones estructurales dado que las responsabilidades de ejecución (`R`), aprobación (`A`), consulta al mentor (`C`) e información (`I`) se mantuvieron sin cambios durante el Sprint II.

---

## 16. Risk Register Actualizado

* Archivo actualizado en el repositorio: [`project-management/risks/RiskRegister_v1.1.xlsx`](file:///D:/Documents/Sem8/Laboratorio_Abierto_Construccion/FamiGest/project-management/risks/RiskRegister_v1.1.xlsx).
* Incluye la actualización de estado y evidencia en GitHub para los riesgos `R-01` a `R-07` y la incorporación del riesgo `R-08`.

---

## 17. Project Schedule / Gantt Actualizado

* Archivo actualizado en el repositorio: [`project-management/schedule/Gantt_Schedule_v1.1.xlsx`](file:///D:/Documents/Sem8/Laboratorio_Abierto_Construccion/FamiGest/project-management/schedule/Gantt_Schedule_v1.1.xlsx).
* Las actividades `1.1` a `4.5` se encuentran marcadas como **Terminada**, restando únicamente las actividades `5.1` a `5.3` para el cierre del proyecto.

---

## 18. Ruta Restante hacia el Sprint III (`Construction Handover`)

Para el **Sprint III (Consolidación y transición hacia Pruebas)** se ejecutarán las tres actividades finales del cronograma:

1. **Habilitación en UI de las Lecciones 2 y 3 (`WBS 5.2`):** Conectar en el flujo móvil las 5 consonantes (`B, C, D, F, G`, cuyos vectores e imágenes ya están integrados en `data/gestures_data.json` y `src/mobile/assets/gestures/`).
2. **Prueba Piloto con 2 Usuarios Finales (`WBS 5.1`):** Ejecutar el protocolo de validación funcional y de usabilidad registrando métricas de precisión y tiempos de respuesta.
3. **Construction Handover Package (`WBS 5.3`):** Consolidar el reporte final de estado, limitaciones conocidas, matriz de preparación para pruebas y generar la etiqueta final **`construction-handover-v1.0`**.
