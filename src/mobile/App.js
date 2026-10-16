import React, { useState } from 'react';
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

// Flujo pedagógico para la Lección 1 (Vocales: Señas 'A' y 'E'):
// Regla: Nunca evaluar una seña sin haberla introducido primero.
const LESSON_1_FLOW = [
  // Bloque 1: Vocal A
  { id: 'intro_a', type: 'intro', letter: 'A' },
  { id: 'mc_a', type: 'multiple_choice', letter: 'A', options: ['E', 'I', 'O', 'A'] },
  { id: 'camera_a', type: 'camera_practice', letter: 'A', gestureId: 1 },
  // Bloque 2: Vocal E
  { id: 'intro_e', type: 'intro', letter: 'E' },
  { id: 'mc_e', type: 'multiple_choice', letter: 'E', options: ['A', 'O', 'E', 'U'] },
  { id: 'camera_e', type: 'camera_practice', letter: 'E', gestureId: 2 },
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

  // Navegación de pestañas inferiores
  const handleTabChange = (tabName) => {
    if (tabName === 'profile') setCurrentScreen('profile');
    else if (tabName === 'settings') setCurrentScreen('settings');
    else setCurrentScreen('lessons');
  };

  // Iniciar lección: configura la cola de ejercicios e introduce la seña
  const handleStartLesson = (lessonId) => {
    setActiveLessonId(lessonId);
    setSessionQueue([...LESSON_1_FLOW]);
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
    currentEx.skipAttempts = currentAttempts;

    let updatedSkipped = [...skippedQueue];
    let newFailedCount = failedExercisesCount;

    if (currentAttempts >= 2) {
      // Segundo salto: penalización total de ejercicio fallido, se descarta de la cola
      newFailedCount = failedExercisesCount + 1;
      setFailedExercisesCount(newFailedCount);
    } else {
      // Primer salto: se añade a la cola de reintentos
      setSkipsCount((prev) => prev + 1);
      updatedSkipped.push(currentEx);
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
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#30AEBF" />
      </View>
    );
  }

  const currentExercise = sessionQueue[sessionIndex];

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

        {currentScreen === 'lessons' && (
          <LessonsScreen
            onSelectLesson={handleStartLesson}
            onTabChange={handleTabChange}
            progress={userProgress}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen onTabChange={handleTabChange} progress={userProgress} />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen onTabChange={handleTabChange} onResetProgress={handleResetProgress} />
        )}

        {/* Sesión de Lección Interactiva (Intro -> Quiz -> Cámara -> Reintento de Saltados) */}
        {currentScreen === 'lesson_session' && currentExercise && (
          <>
            {currentExercise.type === 'intro' && (
              <SignIntroductionScreen
                letter={currentExercise.letter}
                onContinue={handleExerciseCorrect}
                onCancel={() => setCurrentScreen('lessons')}
              />
            )}

            {currentExercise.type === 'multiple_choice' && (
              <ExerciseMultipleChoiceScreen
                targetLetter={currentExercise.letter}
                options={currentExercise.options || ['E', 'I', 'O', 'A']}
                onCorrect={handleExerciseCorrect}
                onWrongAttempt={handleRecordError}
                onCancel={() => setCurrentScreen('lessons')}
              />
            )}

            {currentExercise.type === 'camera_practice' && (
              <CameraPracticeScreen
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
