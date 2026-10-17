import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Lato_400Regular, Lato_700Bold, Lato_700Bold_Italic } from '@expo-google-fonts/lato';
import { TiltNeon_400Regular } from '@expo-google-fonts/tilt-neon';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import LessonsScreen from './src/screens/LessonsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ExerciseMultipleChoiceScreen from './src/screens/ExerciseMultipleChoiceScreen';
import CameraPracticeScreen from './src/screens/CameraPracticeScreen';
import SignIntroductionScreen from './src/screens/SignIntroductionScreen';
import GoodJobScreen from './src/screens/GoodJobScreen';
import { calculateMasteryScore } from './src/services/scoring';
import { getUserProgress, saveUserProgress, resetUserProgress } from './src/services/api';

// Flujo pedagógico para la Lección 1 (Vocales en LSM: A, E, I, O, U):
// Regla (D-03): Nunca evaluar una seña sin haberla introducido primero.
const LESSON_1_FLOW = [
  // Bloque 1: Vocal A
  { id: 'intro_a', type: 'intro', letter: 'A' },
  { id: 'mc_a', type: 'multiple_choice', letter: 'A', options: ['E', 'I', 'O', 'A'] },
  { id: 'camera_a', type: 'camera_practice', letter: 'A', gestureId: 1 },
  // Bloque 2: Vocal E
  { id: 'intro_e', type: 'intro', letter: 'E' },
  { id: 'mc_e', type: 'multiple_choice', letter: 'E', options: ['A', 'O', 'E', 'U'] },
  { id: 'camera_e', type: 'camera_practice', letter: 'E', gestureId: 2 },
  // Bloque 3: Vocal I
  { id: 'intro_i', type: 'intro', letter: 'I' },
  { id: 'mc_i', type: 'multiple_choice', letter: 'I', options: ['I', 'A', 'U', 'E'] },
  { id: 'camera_i', type: 'camera_practice', letter: 'I', gestureId: 3 },
  // Bloque 4: Vocal O
  { id: 'intro_o', type: 'intro', letter: 'O' },
  { id: 'mc_o', type: 'multiple_choice', letter: 'O', options: ['U', 'O', 'A', 'I'] },
  { id: 'camera_o', type: 'camera_practice', letter: 'O', gestureId: 4 },
  // Bloque 5: Vocal U
  { id: 'intro_u', type: 'intro', letter: 'U' },
  { id: 'mc_u', type: 'multiple_choice', letter: 'U', options: ['E', 'I', 'O', 'U'] },
  { id: 'camera_u', type: 'camera_practice', letter: 'U', gestureId: 5 },
];

export default function App() {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Lato_700Bold_Italic,
    TiltNeon_400Regular,
  });

  // Estados de navegación:
  // 'welcome' | 'loading' | 'lessons' | 'profile' | 'settings' | 'lesson_session' | 'good_job'
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [activeLessonId, setActiveLessonId] = useState(1);

  // Estados de la sesión pedagógica (Cola de ejercicios y reintentos)
  const [sessionQueue, setSessionQueue] = useState([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [skippedQueue, setSkippedQueue] = useState([]);
  const [errorsCount, setErrorsCount] = useState(0);
  const [skipsCount, setSkipsCount] = useState(0);
  const [failedExercisesCount, setFailedExercisesCount] = useState(0);
  const [lastMasteryScore, setLastMasteryScore] = useState(100);

  // Progreso real acumulado del usuario
  const [userProgress, setUserProgress] = useState({
    overall: 0,
    lesson1: 0,
    lesson2: 0,
    lesson3: 0,
  });

  // Cargar el progreso persistente desde la API al iniciar la aplicación
  useEffect(() => {
    getUserProgress().then((saved) => {
      if (saved) {
        setUserProgress(saved);
      }
    });
  }, []);

  // Navegación de pestañas inferiores
  const handleTabChange = (tabName) => {
    if (tabName === 'profile') setCurrentScreen('profile');
    else if (tabName === 'settings') setCurrentScreen('settings');
    else setCurrentScreen('lessons');
  };

  // Iniciar lección: configura la cola de ejercicios e introduce la seña
  const handleStartLesson = (lessonId) => {
    setActiveLessonId(lessonId);
    setSessionQueue(LESSON_1_FLOW.map((item) => ({ ...item, skipAttempts: 0 })));
    setSessionIndex(0);
    setSkippedQueue([]);
    setErrorsCount(0);
    setSkipsCount(0);
    setFailedExercisesCount(0);
    setCurrentScreen('lesson_session');
  };

  // Registro de error en opción múltiple (penalización escalable Opción B)
  const handleRecordError = () => {
    setErrorsCount((prev) => prev + 1);
  };

  // Concluir lección: calcula maestría, guarda progreso y muestra pantalla de carga
  const finalizeLesson = (finalFailedCount = failedExercisesCount) => {
    const finalScore = calculateMasteryScore({
      totalEvaluable: 4, // 2 de opción múltiple ('A', 'E') + 2 de cámara ('A', 'E')
      errorsCount,
      skipsCount,
      failedExercisesCount: finalFailedCount,
    });

    setLastMasteryScore(finalScore);
    setUserProgress((prev) => {
      // Guardar la puntuación más alta histórica (high score) para la lección
      const key = `lesson${activeLessonId}`;
      const previousBest = prev[key] || 0;
      const newBest = Math.max(previousBest, finalScore);

      const updated = {
        ...prev,
        [key]: newBest,
      };

      // Recalcular el progreso general basado en las puntuaciones más altas
      const l1 = updated.lesson1 || 0;
      const l2 = updated.lesson2 || 0;
      const l3 = updated.lesson3 || 0;
      updated.overall = Math.round((l1 + l2 + l3) / 3);

      return updated;
    });

    // Persistir el progreso remotamente mediante la API (D-01)
    saveUserProgress(activeLessonId, finalScore);

    // Pantalla de carga transitoria con el spinner oficial antes de mostrar "¡Buen trabajo!"
    setCurrentScreen('lesson_calculating');
  };

  // Completar ejercicio con éxito y avanzar en la cola
  const handleExerciseCorrect = () => {
    const nextIndex = sessionIndex + 1;

    if (nextIndex < sessionQueue.length) {
      setSessionIndex(nextIndex);
    } else if (skippedQueue.length > 0) {
      // Si terminaron los ejercicios regulares pero hubo ejercicios saltados (1 vez),
      // se presentan nuevamente los saltados para la ronda de reintento.
      setSessionQueue([...skippedQueue]);
      setSkippedQueue([]);
      setSessionIndex(0);
    } else {
      finalizeLesson(failedExercisesCount);
    }
  };

  // Saltar ejercicio (ej. cámara):
  // - 1er salto: se posterga a la ronda de reintento (penalización leve por reintento).
  // - 2do salto: renuncia en la ronda de reintento -> se califica como fallido (pérdida total del valor de ese ejercicio).
  const handleExerciseSkip = () => {
    const currentEx = sessionQueue[sessionIndex];
    const prevAttempts = currentEx.skipAttempts || 0;
    const currentAttempts = prevAttempts + 1;
    const updatedEx = { ...currentEx, skipAttempts: currentAttempts };

    let updatedSkipped = [...skippedQueue];
    let newFailedCount = failedExercisesCount;

    if (currentAttempts >= 2) {
      // Segundo salto: penalización total de ejercicio fallido, se descarta de la cola
      newFailedCount = failedExercisesCount + 1;
      setFailedExercisesCount(newFailedCount);
    } else {
      // Primer salto: se añade a la cola de reintentos
      setSkipsCount((prev) => prev + 1);
      updatedSkipped.push(updatedEx);
      setSkippedQueue(updatedSkipped);
    }

    const nextIndex = sessionIndex + 1;
    if (nextIndex < sessionQueue.length) {
      setSessionIndex(nextIndex);
    } else if (updatedSkipped.length > 0) {
      // Pasar a la ronda de reintentos
      setSessionQueue(updatedSkipped);
      setSkippedQueue([]);
      setSessionIndex(0);
    } else {
      // Concluir lección con el cálculo final
      finalizeLesson(newFailedCount);
    }
  };

  const handleResetProgress = () => {
    setUserProgress({
      overall: 0,
      lesson1: 0,
      lesson2: 0,
      lesson3: 0,
    });
    setLastMasteryScore(0);
    resetUserProgress();
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#30AEBF" />
      </View>
    );
  }

  const currentExercise = sessionQueue[sessionIndex];
  const isMainTab =
    currentScreen === 'lessons' ||
    currentScreen === 'profile' ||
    currentScreen === 'settings';

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="dark" />

        {currentScreen === 'welcome' && (
          <WelcomeScreen onStart={() => setCurrentScreen('loading')} />
        )}

        {currentScreen === 'loading' && (
          <LoadingScreen onLoaded={() => setCurrentScreen('lessons')} />
        )}

        {/* Pestañas principales mantenidas en memoria para cambio instantáneo sin tirón */}
        {isMainTab && (
          <View style={styles.container}>
            <View style={{ flex: 1, display: currentScreen === 'lessons' ? 'flex' : 'none' }}>
              <LessonsScreen
                onSelectLesson={handleStartLesson}
                onTabChange={handleTabChange}
                progress={userProgress}
              />
            </View>
            <View style={{ flex: 1, display: currentScreen === 'profile' ? 'flex' : 'none' }}>
              <ProfileScreen onTabChange={handleTabChange} progress={userProgress} />
            </View>
            <View style={{ flex: 1, display: currentScreen === 'settings' ? 'flex' : 'none' }}>
              <SettingsScreen onTabChange={handleTabChange} onResetProgress={handleResetProgress} />
            </View>
          </View>
        )}

        {/* Sesión de Lección Interactiva (Intro -> Quiz -> Cámara -> Reintento de Saltados) */}
        {currentScreen === 'lesson_session' && currentExercise && (
          <>
            {currentExercise.type === 'intro' && (
              <SignIntroductionScreen
                key={`${currentExercise.id}_attempt_${currentExercise.skipAttempts || 0}`}
                letter={currentExercise.letter}
                onContinue={handleExerciseCorrect}
                onCancel={() => setCurrentScreen('lessons')}
              />
            )}

            {currentExercise.type === 'multiple_choice' && (
              <ExerciseMultipleChoiceScreen
                key={`${currentExercise.id}_attempt_${currentExercise.skipAttempts || 0}`}
                targetLetter={currentExercise.letter}
                options={currentExercise.options || ['E', 'I', 'O', 'A']}
                onCorrect={handleExerciseCorrect}
                onWrongAttempt={handleRecordError}
                onCancel={() => setCurrentScreen('lessons')}
              />
            )}

            {currentExercise.type === 'camera_practice' && (
              <CameraPracticeScreen
                key={`${currentExercise.id}_attempt_${currentExercise.skipAttempts || 0}`}
                letter={currentExercise.letter}
                gestureId={currentExercise.gestureId || 1}
                onCorrect={handleExerciseCorrect}
                onSkip={handleExerciseSkip}
                onCancel={() => setCurrentScreen('lessons')}
              />
            )}
          </>
        )}

        {/* Pantalla de Carga Transitoria con el spinner oficial de inicio */}
        {currentScreen === 'lesson_calculating' && (
          <LoadingScreen
            duration={1600}
            message="Calculando tus resultados..."
            onLoaded={() => setCurrentScreen('good_job')}
          />
        )}

        {/* Pantalla Final con Medidor y Porcentaje Real de Maestría */}
        {currentScreen === 'good_job' && (
          <GoodJobScreen
            percent={lastMasteryScore}
            onNext={() => setCurrentScreen('lessons')}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
