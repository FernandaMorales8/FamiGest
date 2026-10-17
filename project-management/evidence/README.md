# Evidencia Técnica y de Diseño UI/UX — FamiGest (Sprint II)

Esta carpeta concentra la evidencia visual y técnica que respalda las actividades ejecutadas durante el **Sprint II (`sprint-2-review-v1.0`)**.

---

## 1. Mockups de Diseño UI/UX en Figma (`project-management/evidence/figma-mockups/`)

* **Enlace directo al diseño interactivo en Figma:** [Abrir proyecto FamiGest en Figma](https://www.figma.com/design/YClQ7sWRluo7v2CWfkawCx/FamiGest?node-id=4-81&t=JIwKSSdXiPD93RNE-1) (`https://www.figma.com/design/YClQ7sWRluo7v2CWfkawCx/FamiGest?node-id=4-81&t=JIwKSSdXiPD93RNE-1`)

Previo y durante la implementación del **Hito 2 (`WBS 2.1 – 2.4`: Interfaz de Usuario y Navegación)**, se diseñaron en **Figma** los mockups que definieron la identidad visual, paleta cromática (`#1B4F65`, `#2DA3B5`, `#F4F5F7`), tipografía (`Tilt Neon` y `Lato`) y disposición de controles de la aplicación móvil:

| Archivo en `/evidence/figma-mockups/` | Pantalla / Componente | Tarea WBS Relacionada | Evidencia de Implementación en Código |
| :--- | :--- | :--- | :--- |
| [`01_Title_Page.png`](./figma-mockups/01_Title_Page.png) | Portada / Splash Inicial de FamiGest | `WBS 2.1` | `src/mobile/App.js` (Issue `#17` / PR `#18`) |
| [`02_Start.png`](./figma-mockups/02_Start.png) | Pantalla de Bienvenida (`Iniciar`) | `WBS 2.1` | `src/mobile/src/screens/WelcomeScreen.js` (Issue `#17` / PR `#18`) |
| [`03_Loading.png`](./figma-mockups/03_Loading.png) | Pantalla de Transición / Carga | `WBS 2.1` | `src/mobile/src/screens/LoadingScreen.js` (Issue `#17` / PR `#18`) |
| [`04_Lesson_Picker.png`](./figma-mockups/04_Lesson_Picker.png) | Menú Principal de Lecciones (Botones triangulares 1, 2 y 3) | `WBS 2.2` | `src/mobile/src/screens/LessonsScreen.js` (Issue `#17` / PR `#18`) |
| [`05_Profile.png`](./figma-mockups/05_Profile.png) | Pantalla de Perfil y Barras de Progreso por Lección | `WBS 2.2 / 4.1` | `src/mobile/src/screens/ProfileScreen.js` (Issues `#17`, `#23` / PRs `#18`, `#24`) |
| [`06_Settings.png`](./figma-mockups/06_Settings.png) | Pantalla de Configuración (*Cómo usar la app*, *Cambiar Nickname*, *Reiniciar Progreso*) | `WBS 2.1 / 2.2` | `src/mobile/src/screens/SettingsScreen.js` (Issues `#17`, `#23` / PRs `#18`, `#24`) |
| [`07_Question_1.png`](./figma-mockups/07_Question_1.png) | Reactivo de Identificación Visual (*Opción Múltiple*) | `WBS 2.2 / 2.4` | `src/mobile/src/screens/ExerciseMultipleChoiceScreen.js` (Issues `#17`, `#25`, `#27`) |
| [`08_Question_2.png`](./figma-mockups/08_Question_2.png) | Pantalla de Práctica con Cámara en Vivo | `WBS 2.3 / 2.4` | `src/mobile/src/screens/CameraPracticeScreen.js` (Issues `#17`, `#21`, `#23`) |
| [`09_Finish_Lesson.png`](./figma-mockups/09_Finish_Lesson.png) | Pantalla de Resumen de Desempeño (*¡Buen trabajo!*) | `WBS 2.4` | `src/mobile/src/screens/GoodJobScreen.js` (Issue `#17` / PR `#18`) |
| [`10_Figma_Interactive_Mockup_Demo_v1.0.mp4`](./figma-mockups/10_Figma_Interactive_Mockup_Demo_v1.0.mp4) | Video demostrativo del prototipo interactivo completo en Figma | `WBS 2.1 – 2.4` | Flujo completo de navegación e interacción implementado en `src/mobile/` |

---

## 2. Evidencia de Recursos Visuales (`src/mobile/assets/gestures/`)

En cumplimiento de la decisión **`D-06`** y como mitigación del riesgo **`R-06`**, las fotografías de referencia para las 5 vocales de la Lección 1 fueron estandarizadas en alta resolución con iluminación uniforme:
* `src/mobile/assets/gestures/1_a.jpg` — Vocal **A**
* `src/mobile/assets/gestures/2_e.jpg` — Vocal **E**
* `src/mobile/assets/gestures/3_i.jpg` — Vocal **I**
* `src/mobile/assets/gestures/4_o.jpg` — Vocal **O**
* `src/mobile/assets/gestures/5_u.jpg` — Vocal **U**

---

## 3. Evidencia de Pruebas en Dispositivo Físico e Integración (`project-management/evidence/mobile-testing/` y `tests/`)

* **Pruebas Automatizadas de API y Pipeline (`WBS 3.1 – 4.5`):** Documentadas en [`tests/Test_Report_v1.0.pdf`](../../tests/Test_Report_v1.0.pdf) y ejecutables mediante `python -m unittest discover -s tests -v` (`9/9 pruebas aprobadas`).
* **Capturas y Video de Ejecución Real en Dispositivo Físico (`project-management/evidence/mobile-testing/`):** Evidencia capturada directamente en un teléfono móvil real ejecutando la app en **Expo Go** conectada por Wi-Fi LAN al servidor **FastAPI + MediaPipe (`POST /api/v1/predict`)**:

| Archivo en `/evidence/mobile-testing/` | Pantalla / Flujo Validado en Dispositivo Físico | Tarea WBS Relacionada | Incremento Relacionado |
| :--- | :--- | :--- | :--- |
| [`01_Welcome_Screen.jpeg`](./mobile-testing/01_Welcome_Screen.jpeg) | Pantalla de Bienvenida (`Iniciar`) ejecutándose en teléfono físico | `WBS 2.1` | Issue `#17` / PR `#18` |
| [`02_Lessons_Menu_Initial.jpeg`](./mobile-testing/02_Lessons_Menu_Initial.jpeg) | Menú Principal de Lecciones (`Selecciona la lección`) | `WBS 2.2` | Issue `#17` / PR `#18` |
| [`03_User_Profile_Screen.jpeg`](./mobile-testing/03_User_Profile_Screen.jpeg) | Pantalla de Perfil de Usuario y barras de progreso | `WBS 2.2 / 4.1` | Issues `#17`, `#23` / PRs `#18`, `#24` |
| [`04_Settings_Screen.jpeg`](./mobile-testing/04_Settings_Screen.jpeg) | Pantalla de Configuración (*Cómo usar la app*, *Cambiar Nickname*, *Reiniciar Progreso*) | `WBS 2.1 / 2.2` | Issues `#17`, `#23` / PRs `#18`, `#24` |
| [`05_Sign_Introduction_Vowel_A.jpeg`](./mobile-testing/05_Sign_Introduction_Vowel_A.jpeg) | Tarjeta de Presentación de Seña (`Conoce la seña: A`) con fotografía HD | `WBS 2.2` | Issue `#25` / PR `#26` |
| [`06_Camera_Practice_Vowel_A_Success.jpeg`](./mobile-testing/06_Camera_Practice_Vowel_A_Success.jpeg) | Práctica Guiada con Cámara en Vivo reconociendo la vocal `A` (`¡Excelente! Seña correcta.`) | `WBS 2.3 / 3.4 / 4.2` | Issues `#19`, `#21` / PRs `#20`, `#22` |
| [`07_Multiple_Choice_Wrong_Attempt.jpeg`](./mobile-testing/07_Multiple_Choice_Wrong_Attempt.jpeg) | Ejercicio de Opción Múltiple mostrando retroalimentación visual de error (`✗` en rojo) | `WBS 2.4` | Issues `#17`, `#27` / PRs `#18`, `#28` |
| [`08_Multiple_Choice_Correct_Attempt.jpeg`](./mobile-testing/08_Multiple_Choice_Correct_Attempt.jpeg) | Ejercicio de Opción Múltiple mostrando validación de acierto (`✓` en verde) y orden aleatorio | `WBS 2.4` | Issues `#17`, `#25`, `#27` / PRs `#18`, `#26`, `#28` |
| [`09_Camera_Memory_Test_Vowel_E_Success.jpeg`](./mobile-testing/09_Camera_Memory_Test_Vowel_E_Success.jpeg) | Prueba de Memoria con Cámara en Vivo validando la vocal `E` vía API REST | `WBS 3.1 – 4.3` | Issues `#19`, `#21`, `#25` / PRs `#20`, `#22`, `#26` |
| [`10_Lesson_Completed_95_Percent.jpeg`](./mobile-testing/10_Lesson_Completed_95_Percent.jpeg) | Pantalla de Fin de Lección (*¡Buen trabajo!*) calculando `95%` de precisión real | `WBS 2.4 / 4.3` | Issue `#23` / PR `#24` |
| [`11_Lessons_Menu_Completed_Star.jpeg`](./mobile-testing/11_Lessons_Menu_Completed_Star.jpeg) | Menú de Lecciones actualizado con estrella dorada (`★`) en la Lección 1 | `WBS 4.3` | Issue `#23` / PR `#24` |
| [`12_User_Profile_Updated_Progress.jpeg`](./mobile-testing/12_User_Profile_Updated_Progress.jpeg) | Pantalla de Perfil reflejando el progreso persistido tras finalizar la lección | `WBS 4.3` | Issue `#23` / PR `#24` |
| [`13_Mobile_App_Live_Execution_Demo_v1.0.mp4`](./mobile-testing/13_Mobile_App_Live_Execution_Demo_v1.0.mp4) | Video demostrativo de la ejecución completa en tiempo real en dispositivo físico | `WBS 2.1 – 4.5` | Todos los incrementos del Sprint II (`#17`–`#28`) |
