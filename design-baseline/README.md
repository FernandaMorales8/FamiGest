# Design Baseline — FamiGest

## Proyecto
FamiGest

## Procedencia
Laboratorio Abierto: Diseño

## Versión
Design Baseline v1.0

## Descripción
Esta carpeta contiene los documentos generados durante la fase de Diseño del proyecto FamiGest y establece la referencia documental para iniciar la fase de Construcción.

## Documentos incluidos

- Sprint 0 — Ficha de Arranque del Proyecto
- Sprint 1 — Documento de Diseño Conceptual
- Sprint 2 — Documento Técnico/Conceptual
- Sprint 3 — Plan de Construcción
- Sprint 4 — Avance Final de Laboratorio de Diseño
- Formato A3 de FamiGest

## Alcance del proyecto

FamiGest consiste en una aplicación móvil educativa para el aprendizaje inicial de Lengua de Señas Mexicana (LSM), dirigida principalmente a familiares oyentes de personas con discapacidad auditiva.

El MVP contempla:

- 3 lecciones iniciales.
- Práctica mediante cámara.
- Detección de mano y extracción de landmarks.
- Clasificación de señas estáticas.
- Retroalimentación inmediata: Correcto/Incorrecto.
- Registro local del progreso.
- Validación piloto con 2 usuarios.

## Arquitectura y funcionamiento

El flujo principal definido durante la fase de Diseño es:

Captura por cámara → detección de mano → extracción de landmarks → preprocesamiento → clasificación → retroalimentación → registro de progreso.

El reconocimiento se plantea para ejecutarse directamente en el dispositivo.

## Tecnologías previstas

- Expo / React Native
- JavaScript
- Python
- MediaPipe
- TensorFlow Lite
- GitHub
- Figma

## Restricciones conocidas

- El MVP se limita a señas estáticas.
- No contempla traducción completa en tiempo real.
- No contempla sincronización del progreso entre dispositivos.
- El alcance inicial se limita a 3 lecciones.
- La captura requiere condiciones adecuadas de iluminación y visibilidad de la mano.

## Responsable del proyecto

Maria Fernanda Morales Rios

## Estado

Baseline preparada para el inicio de la fase de Construcción.