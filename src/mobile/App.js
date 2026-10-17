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

// Definición base de las 5 vocales de la Lección 1 (LSM: A, E, I, O, U)
const VOWEL_MODULES = [
  { letter: 'A', gestureId: 1 },
  { letter: 'E', gestureId: 2 },
  { letter: 'I', gestureId: 3 },
  { letter: 'O', gestureId: 4 },
  { letter: 'U', gestureId: 5 },
];

const ALL_VOWEL_LETTERS = VOWEL_MODULES.map((v) => v.letter);

// Función auxiliar Fisher-Yates para mezclar arreglos de forma uniforme e inmutable
function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Genera 4 opciones aleatorias para opción múltiple garantizando incluir la letra correcta
function buildRandomOptions(targetLetter) {
  const distractors = shuffleArray(
    ALL_VOWEL_LETTERS.filter((l) => l !== targetLetter)
  ).slice(0, 3);
  return shuffleArray([targetLetter, ...distractors]);
}

/**
 * Construye una cola verdaderamente aleatoria con restricción de precedencia (Topological Random Walk),
 * respetando la regla D-03 (nunca evaluar una letra que no haya sido introducida antes):
 * - El orden de las 5 vocales es aleatorio.
 * - Al introducir una vocal, sus 2 ejercicios (opción múltiple y cámara) entran a la bolsa general (unlockedPool).
 * - En cada paso se sortea libremente si presentar una nueva vocal o lanzar cualquier ejercicio desbloqueado,
 *   evitando repetir la misma letra en pasos consecutivos siempre que haya alternativas.
 */
function buildRandomizedLessonFlow() {
  const unintroduced = shuffleArray(VOWEL_MODULES);
  const unlockedPool = [];
  const queue = [];

  // Función auxiliar para introducir la siguiente vocal pendiente y desbloquear sus 2 ejercicios
  const introduceNextVowel = () => {
    const vowel = unintroduced.shift();
    const lower = vowel.letter.toLowerCase();

    queue.push({
      id: `intro_${lower}`,
      type: 'intro',
      letter: vowel.letter,
      skipAttempts: 0,
    });

    unlockedPool.push(
      {
        id: `mc_${lower}`,
        type: 'multiple_choice',
        letter: vowel.letter,
        options: buildRandomOptions(vowel.letter),
        skipAttempts: 0,
      },
      {
        id: `camera_${lower}`,
        type: 'camera_practice',
        letter: vowel.letter,
        gestureId: vowel.gestureId,
        skipAttempts: 0,
      }
    );
  };

  // Paso inicial: introducir las primeras 2 vocales al inicio (o 1 y luego sortear)
  // para que desde el primer ejercicio ya exista incertidumbre real entre distintas letras
  introduceNextVowel();
  if (Math.random() < 0.7) {
    introduceNextVowel();
  }

  // Sorteo paso a paso hasta vaciar tanto las vocales por introducir como los ejercicios desbloqueados
  while (unintroduced.length > 0 || unlockedPool.length > 0) {
    const lastItem = queue[queue.length - 1];

    // Decidir si en este turno introducimos una nueva vocal o sacamos un ejercicio de la bolsa
    // Si la bolsa está vacía, obligatoriamente introducimos una vocal nueva.
    const shouldIntroduceNew =
      unlockedPool.length === 0 ||
      (unintroduced.length > 0 &&
        lastItem.type !== 'intro' &&
        Math.random() < 0.42);

    if (shouldIntroduceNew) {
      introduceNextVowel();
    } else {
      // Buscar preferentemente un ejercicio cuya letra sea distinta a la del paso inmediatamente anterior
      const differentLetterCandidates = unlockedPool.filter(
        (ex) => ex.letter !== lastItem.letter
      );
      const candidateList =
        differentLetterCandidates.length > 0
          ? differentLetterCandidates
          : unlockedPool;

      const chosenEx =
        candidateList[Math.floor(Math.random() * candidateList.length)];
      const poolIndex = unlockedPool.findIndex((ex) => ex.id === chosenEx.id);
      unlockedPool.splice(poolIndex, 1);
      queue.push(chosenEx);
    }
  }

  return queue;
}

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

  // Iniciar lección: construye una cola aleatoria respetando precedencia pedagógica (D-03)
  const handleStartLesson = (lessonId) => {
    setActiveLessonId(lessonId);
    setSessionQueue(buildRandomizedLessonFlow());
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
    const totalEvaluableCount =
      sessionQueue.filter((ex) => ex.type !== 'intro').length || 10;
    const finalScore = calculateMasteryScore({
      totalEvaluable: totalEvaluableCount, // 5 de opción múltiple + 5 de cámara (A, E, I, O, U)
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
