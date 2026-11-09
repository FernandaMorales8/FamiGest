# Informe de Consolidación y Estado de la Solución — Sprint III (Cierre de Construcción)

* **Proyecto:** FamiGest — Aplicación móvil interactiva para el aprendizaje inicial de la Lengua de Señas Mexicana (LSM)
* **Institución:** Universidad de Guadalajara — Centro Universitario de Ciencias Exactas e Ingenierías (CUCEI)
* **Carrera:** Ingeniería en Computación
* **Materia:** Laboratorio Abierto: Construcción
* **Profesor:** Dr. Jairo Cain Sánchez Estrada
* **Asesor:** José Juan Meza Espinosa
* **Project Leader:** María Fernanda Morales Ríos
* **Folio del Equipo:** A012-26A

---

## 1. Resumen Ejecutivo y Ficha Técnica del Estado Real

El presente documento constituye el Informe de consolidación y estado de la solución al cierre formal del Laboratorio Abierto: Construcción. En él se analiza el proceso de ingeniería de software desarrollado a lo largo de los tres Sprints de trabajo, contrastando la ejecución técnica contra la línea base original (`sprint-1-plan-baseline-v1.0`), registrando las decisiones de diseño tomadas, los recursos utilizados, las dificultades superadas y estableciendo formalmente el estado real de la solución para dar paso al siguiente laboratorio.

### Ficha Técnica de la Solución

| Parámetro | Detalle de la Solución Construida |
| :--- | :--- |
| **Nombre de la aplicación** | FamiGest |
| **Enfoque** | Microaprendizaje gamificado de Lengua de Señas Mexicana (LSM) enfocado en familiares de personas con discapacidad auditiva. |
| **Arquitectura de Software** | Cliente-Servidor desacoplado: Frontend Móvil en React Native + Backend de Procesamiento Remoto en FastAPI. |
| **Cliente Móvil** | React Native 0.81.4, Expo SDK 54.0.0, expo-camera, navegación por pestañas. |
| **Servidor API** | Python 3.12, FastAPI 0.110+, servidor asíncrono Uvicorn, esquemas Pydantic. |
| **Pipeline de Visión** | MediaPipe Hands, OpenCV Headless, NumPy. Extracción de 21 landmarks 3D normalizados. |
| **Persistencia de Datos** | Almacenamiento desacoplado en servidor en formato JSON reteniendo puntaje máximo histórico. |
| **Estado de Construcción** | Completado y Funcional en Corte Vertical: Módulo interactivo de la Lección 1 (Vocales) 100% operativo de extremo a extremo. |
| **Nivel de Madurez Tecnológica** | TRL 4 (Validación de componentes y flujo funcional en entorno de laboratorio / red local). |

---

## 2. Contraste Integral: Plan de Trabajo Inicial vs. Construcción Real

El proyecto se estructuró originalmente bajo una Estructura de Desglose del Trabajo (WBS) compuesta por 5 Hitos principales. A continuación, se detalla el análisis comparativo entre lo presupuestado en la línea base y lo construido al cierre del laboratorio:

### Tabla Comparativa del WBS

| Hito / Tarea WBS | Alcance Planificado Inicialmente | Resultado Realmente Construido | Variación / Justificación | Estado Final |
| :--- | :--- | :--- | :--- | :--- |
| **Hito 1: Planificación y Gestión (1.1 – 1.4)** | Elaboración de Project Charter, matriz RACI, registro de riesgos, cronograma Gantt y configuración de repositorio en GitHub con flujo de trabajo. | Documentos formales integrados en “/project-management”, repositorio configurado con tablero de control, branch protection y tags de versión. | Ninguna. Ejecutado al 100% en tiempo durante el Sprint I. | Concluido (100%) |
| **Hito 2: Interfaz de Usuario y Navegación (2.1 – 2.4)** | Configuración base en Expo, pantalla de lecciones, pantalla de práctica con cámara y componentes de retroalimentación. | 9 mockups de alta fidelidad en Figma, aplicación móvil construida en React Native con 3 pestañas (Lecciones, Perfil, Configuración), flujo guiado de aprendizaje y renderizado de cámara. | Positiva. Se añadió la pantalla anatómica previa (D-03) y botón de salto con cola de reintentos (D-04). | Concluido (100%) |
| **Hito 3: Visión por Computadora y Clasificación (3.1 – 3.4)** | Integración de MediaPipe Hands, extracción de 21 puntos clave en 2D (x, y), normalización y clasificador de señas estáticas. | Extractor `MediaPipeLandmarkExtractor` procesando 21 puntos clave en 3D (x, y, z) (63 coordenadas), normalización centrada en muñeca con escalado invariante y dataset `gestures_data.json`. | Mejora técnica. La inclusión de coordenadas de profundidad `z` permitió mayor precisión discriminando señas frontales similares. | Concluido (100%) |
| **Hito 4: API e Integración de Procesamiento Remoto (4.1 – 4.5)** | API REST para recibir capturas fotográficas, procesar mediante MediaPipe y responder a la aplicación el resultado. | Servidor FastAPI con endpoints “/api/v1/evaluate/frame”, “/api/v1/evaluate/landmarks”, y endpoints de progreso “/api/v1/progress” (GET/POST). Suite de pruebas con Pytest. | Positiva. Se integró persistencia de calificaciones históricas directamente en la API (D-05). | Concluido (100%) |
| **Hito 5: Validación, Optimización y Transferencia (5.1 – 5.3)** | Realización de prueba piloto con 2 usuarios finales (5.1), optimización técnica (5.2) y paquete de transferencia a Pruebas (5.3). | Se consolidó el software en corte vertical funcional, suite de pruebas automatizadas y la elaboración del presente Handover Package (5.3). | Adecuación pedagógica. Las pruebas de campo con usuarios externos (5.1) pasan formalmente a ejecutarse dentro del siguiente laboratorio. | Transferido a Pruebas |

---

## 3. Bitácora de Decisiones Técnicas y de Arquitectura

Durante el proceso se formalizaron 7 decisiones arquitectónicas críticas registradas en la bitácora `Decision_Log.xlsx`, alineadas con la resolución de riesgos identificados:

* **Decisión D-01 (Arquitectura Basada en API Remota):**
  * **Decisión:** Trasladar la carga computacional pesada (red neuronal MediaPipe y clasificador) a un servicio backend remoto en Python, dejando en el dispositivo móvil únicamente la captura y renderizado visual.
  * **Impacto:** Garantiza compatibilidad con dispositivos Android/iOS de gama media y baja sin sobrecalentamiento ni caídas de tasa de cuadros.

* **Decisión D-02 (Estrategia de Corte Vertical):**
  * **Decisión:** Priorizar la integración de extremo a extremo de la Lección 1 completa (Vocales LSM: A, E, I, O, U) conectando UI, Red, Visión, Clasificación y Progreso.
  * **Impacto:** Mitigó de manera temprana el Riesgo R-05 de fallos catastróficos durante la integración tardía.

* **Decisión D-03 (Precedencia Pedagógica Escalonada):**
  * **Decisión:** Dividir el aprendizaje de cada letra en un flujo estricto de tres etapas: 1) Introducción Anatómica (visualización guiada), 2) Discriminación Teórica (opción múltiple de 4 alternativas), y 3) Ejecución Práctica (evaluación con cámara en tiempo real).
  * **Impacto:** Evita la frustración del usuario novato al no exponerlo a evaluación en cámara sin antes conocer la postura correcta de la mano.

* **Decisión D-04 (Manejo de Frustración y Cola de Reintentos):**
  * **Decisión:** Añadir un botón de "Saltar" en la pantalla de cámara que envía la seña difícil a una cola de segunda oportunidad al final de la lección, conservando siempre la calificación histórica más alta en el perfil de usuario.
  * **Impacto:** Resuelve situaciones de bloqueo por condiciones momentáneas de mala luz o fatiga motriz.

* **Decisión D-05 (Persistencia del Progreso en Servidor):**
  * **Decisión:** Implementar los endpoints GET/POST `/api/v1/progress` comunicados con un repositorio JSON estructurado.
  * **Impacto:** Garantiza que los avances del estudiante persistan independientemente de reinicios de la aplicación móvil o cambio de terminal.

* **Decisión D-06 (Práctica Intercalada y Activos Visuales en Alta Definición):**
  * **Decisión:** Sustituir los gráficos de baja resolución por un banco fotográfico propio en alta definición (`1_a.jpg` a `5_u.jpg`) e implementar un algoritmo generador de secuencias aleatorias que intercala ejercicios dinámicamente.
  * **Impacto:** Eleva la calidad didáctica de la aplicación y previene la memorización por orden fijo de preguntas.

* **Decisión D-07 (Transferencia Formal al Laboratorio Abierto de Pruebas):**
  * **Decisión:** Transferir la ejecución de las pruebas piloto con usuarios finales (WBS 5.1) y las optimizaciones derivadas (WBS 5.2) al alcance inicial del Laboratorio Abierto: Pruebas, concluyendo el Hito 5 de Construcción con la entrega formal del Handover Package (WBS 5.3).
  * **Impacto:** Delimita la frontera entre ambos laboratorios. Construcción cierra con la verificación técnica interna demostrada (9/9 pruebas superadas, estabilidad LAN y Lección 1 funcional de extremo a extremo), transfiriendo el software al siguiente laboratorio para la validación psicopedagógica y de usabilidad de campo.

---

## 4. Recursos Empleados y Análisis de Rendimiento

### Tabla de Recursos de Hardware y Software

| Categoría | Recurso Especificado | Rol en la Construcción | Eficiencia / Observaciones |
| :--- | :--- | :--- | :--- |
| **Diseño UI/UX** | Figma Web & Desktop | Diseño de la guía de estilos, paleta de colores inclusiva, 9 pantallas de alta fidelidad y prototipo interactivo para pruebas de flujo. | Excelente. Permitió validar el recorrido de usuario antes de tirar líneas de código móvil. |
| **Frontend Móvil** | React Native 0.81 + Expo SDK 54 | Construcción de la aplicación cliente para iOS/Android con renderizado nativo y acceso al hardware de cámara. | Elevada productividad en el ciclo de pruebas en vivo usando la plataforma Expo Go. |
| **Cámara Móvil** | expo-camera | Módulo de captura fotográfica en resolución optimizada para transmisión de red. | Se configuró compresión de imagen antes de la transmisión para evitar latencia innecesaria. |
| **Backend API** | FastAPI + Uvicorn (Python 3.12) | Servidor asíncrono para recepción de peticiones HTTP multipart/JSON y procesamiento paralelo. | Tiempos de respuesta locales inferiores a 180 ms por evaluación completa de fotograma. |
| **Visión Artificial** | Google MediaPipe Hands | Extracción de coordenadas tridimensionales de 21 articulaciones de la mano. | Inferencia en CPU sumamente ágil (~35 ms en servidor local), sin requerir aceleración GPU dedicada. |
| **Control de Versiones** | GitHub (Git) | Gestión de ramas de características, Issues vinculados, Pull Requests y trazabilidad documental. | Trazabilidad del 100% desde la especificación del requerimiento hasta la fusión del código. |

---

## 5. Dificultades Enfrentadas y Aprendizajes Generados

Durante el desarrollo de la aplicación se presentaron algunos retos técnicos y metodológicos:

1. **Invarianza a la Escala y Posición de la Mano (Reto de Visión Computacional)**
   * **Dificultad:** Inicialmente, cuando el usuario acercaba o alejaba la mano de la lente, las coordenadas absolutas de MediaPipe variaban drásticamente, provocando falsos negativos en el clasificador a pesar de que la configuración de los dedos era anatómicamente correcta.
   * **Solución y Aprendizaje:** Se diseñó una función de normalización que toma la muñeca (Landmark 0) como origen de coordenadas (0, 0, 0) y escala todo el esqueleto dividiendo entre la distancia entre la muñeca y el nudillo medio (Landmark 9).

2. **Latencia de Red en Pruebas Físicas Locales (Reto de Integración)**
   * **Dificultad:** La transmisión de imágenes sin comprimir o en resoluciones de cámara nativas (4K/1080p) introducía retardos de hasta 1.8 segundos en la red Wi-Fi local antes de que el servidor pudiera responder.
   * **Solución y Aprendizaje:** Se redimensionó la captura fotográfica a un formato óptimo de inferencia previo al envío en base64, reduciendo el peso de carga a menos de 150 KB por petición y logrando retroalimentación visual en la aplicación en menos de 250 ms.

3. **Trazabilidad de Estados Asíncronos en Móvil (Reto Frontend)**
   * **Dificultad:** Manejar las respuestas concurrentes del servidor, la transición de pantallas al saltar ejercicios y la actualización inmediata de la barra de progreso en el perfil exigió sincronización precisa.
   * **Solución y Aprendizaje:** Se centralizó el estado de la lección mediante un manejador desacoplado, separando la lógica de evaluación en red del ciclo de vida visual de la vista de cámara.

---

## 6. Evidencias Verificables del Nivel de Avance

FamiGest cuenta con soporte físico, digital y audiovisual comprobable alojado en el repositorio:

### Evidencias Registradas

* **Prototipo UI/UX y Sistema de Diseño en Figma:**
  * Archivo de diseño con 9 pantallas completas: Bienvenida, Menú de Lecciones, Perfil de Usuario, Ajustes, Introducción a la Seña, Práctica con Cámara (Correcto), Evaluación Teórica de Opción Múltiple (Correcto/Incorrecto) y Pantalla de Fin de Lección con métricas.
  * Enlace: [Figma Prototype — FamiGest](https://www.figma.com/design/YClQ7sWRluo7v2CWfkawCx/FamiGest?node-id=4-81&t=JIwKSSdXiPD93RNE-1)
  * Video: `project-management/evidence/figma-mockups/10_Figma_Interactive_Mockup_Demo_v1.0.mp4`.

* **Ejecución Real en Dispositivo Móvil Físico:**
  * Registro fotográfico de 12 capturas de pantalla tomadas directamente desde un teléfono físico ejecutando la aplicación conectada vía Wi-Fi local con el backend: `project-management/evidence/mobile-testing/01_Welcome_Screen.jpeg` a `12_User_Profile_Updated_Progress.jpeg`.
  * Video de demostración funcional en vivo: `project-management/evidence/mobile-testing/13_Mobile_App_Live_Execution_Demo_v1.0.mp4`.

* **Suite de Pruebas Unitarias y de Integración Automatizadas:**
  * Script de validación de endpoints de evaluación y persistencia: `tests/test_api_endpoints.py`.
  * Script de verificación del pipeline de visión y extracción de landmarks: `tests/test_vision_core.py`.
  * Reporte formal de resultados de pruebas: `tests/Test_Report_v1.0.md`.

* **Ficha y Presentación de Consolidación:**
  * Presentación de diapositivas para la exposición y defensa técnica ante el comité evaluador: `project-management/evidence/presentation/FamiGest_Lab_Presentation.pdf`.

---

## 7. Handover Package

De acuerdo con las características mínimas del Sprint 3, se formaliza la entrega y estado de la solución para su transición al Laboratorio Abierto: Pruebas:

### 7.1. Componentes en Condiciones para pasar a Pruebas

* **Módulo Didáctico de la Lección 1:** Totalmente operativo con las 5 vocales en LSM, navegable mediante el flujo pedagógico de 3 pasos (Introducción → Opción Múltiple → Cámara).
* **Pipeline de Inferencia en Tiempo Real:** Servicio FastAPI funcional en el endpoint `/api/v1/evaluate/frame`, capaz de procesar imágenes de manos y retornar diagnóstico geométrico y acierto/fallo.
* **Mecanismo de Tolerancia a la Frustración:** Cola de segunda oportunidad mediante el botón "Saltar".
* **Persistencia de Perfil:** Guardado y recuperación del historial de puntuaciones máximas mediante `user_progress.json`.

### 7.2. Requerimientos y Condiciones de Entorno para Pruebas

Para que el equipo de pruebas ejecute la aplicación, debe cumplir con las siguientes especificaciones:

* **Entorno de Red:** La computadora host (servidor) y el dispositivo móvil de prueba deben estar conectados a la misma red Wi-Fi local.
* **Configuración del Servidor:**
  * Instalar dependencias backend: `pip install -r src/api/requirements.txt` (FastAPI, Uvicorn, MediaPipe, OpenCV-Headless, NumPy).
  * Iniciar la API exponiendo en la red: `uvicorn src.api.main:app --host 0.0.0.0 --port 8000`.
* **Configuración del Cliente Móvil:**
  * En `src/mobile/src/services/api.js`, actualizar la constante `API_BASE_URL` con la IP local asignada a la computadora host.
  * Ejecutar la aplicación con Expo: `npm start` en el directorio `src/mobile/` y escanear el código QR desde la app móvil Expo Go.
* **Condiciones Ambientales Recomendadas:**
  * Iluminación frontal adecuada (evitar contraluz directo hacia la lente).
  * Fondo contrastante con la mano del usuario para facilitar la segmentación de MediaPipe.

### 7.3. Limitaciones Conocidas y Alcance Excluido

* **Exclusión de Gestos Dinámicos:** El sistema actual está calibrado para señas estáticas. No incluye reconocimiento de movimiento continuo (ej. señas que requieren desplazamiento en el aire como la 'J' o 'Z').
* **Dependencia de Red Local:** Al procesar vía API remota, caídas en la conexión Wi-Fi suspenden temporalmente la evaluación en cámara.
* **Variabilidad Lumínica Extrema:** En condiciones de penumbra severa o sobreexposición lumínica, MediaPipe puede fallar en detectar los 21 puntos clave.

### 7.4. Ruta para Continuar Desarrollo y Validación (Roadmap)

| Fase de Pruebas | Actividad Específica | Objetivo de Calidad |
| :--- | :--- | :--- |
| **Prueba Piloto (WBS 5.1)** | Aplicación del protocolo formal de usabilidad a 2 usuarios finales. | Evaluar la claridad de las instrucciones visuales, ergonomía del encuadre y grado de satisfacción. |
| **Optimización de Modelo (WBS 5.2)** | Ajuste de hiperparámetros y matriz de confusión en el clasificador. | Reducir la tasa de falsos positivos entre las vocales A y E a menos del 5%. |
| **Habilitación de Lecciones 2 y 3** | Conectar en la interfaz de usuario los vectores de referencia de palabras de cortesía y números ya calculados en `gestures_data.json`. | Expandir el contenido educativo de la app manteniendo la misma arquitectura probada. |
| **Empaquetado Nativo Final** | Generación de compilado `.apk` optimizado mediante Expo EAS Build. | Independizar la aplicación de Expo Go para distribución a usuarios de prueba. |
| **Despliegue en Hosting Externo** | Migración de la API FastAPI a un servidor en la nube configurando variables de entorno, dependencias de producción y HTTPS. | Independizar el sistema de la red local, eliminando el requisito de red Wi-Fi compartida y permitiendo acceso desde cualquier conexión a internet. |

---

## 8. Conclusión

El proyecto FamiGest concluye su ciclo en el Laboratorio Abierto: Construcción habiendo alcanzado su objetivo: materializar un producto de software funcional, desacoplado, que resuelve la evaluación automática de señas estáticas en LSM.

La solución se declara apta y en condiciones técnicas favorables para ser transferida al Laboratorio Abierto: Pruebas.
