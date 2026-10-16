import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { evaluateGesture } from '../services/api';

const VOCABULARY = [
  { id: 1, letter: 'A', name: 'Vocal A', description: 'Mano empuñada con el pulgar extendido apoyado lateralmente al índice.' },
  { id: 2, letter: 'E', name: 'Vocal E', description: 'Dedos flexionados mostrando las uñas, pulgar doblado debajo.' },
  { id: 3, letter: 'I', name: 'Vocal I', description: 'Mano empuñada con el dedo meñique levantado apuntando hacia arriba.' },
  { id: 4, letter: 'O', name: 'Vocal O', description: 'Forma un círculo uniendo la punta de todos los dedos con el pulgar.' },
  { id: 5, letter: 'U', name: 'Vocal U', description: 'Dedos índice y medio extendidos juntos hacia arriba, pulgar doblado.' },
];

export default function PracticeScreen({ onFinish, onCancel }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null); // { passed, message, hand_detected, score }
  const cameraRef = useRef(null);

  const currentVowel = VOCABULARY[currentIndex];
  const progressPercent = Math.round(((currentIndex) / VOCABULARY.length) * 100);

  const handleCaptureAndEvaluate = async () => {
    if (!cameraRef.current) return;

    try {
      setEvaluating(true);
      setResult(null);

      // Captura en Base64
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.6,
        base64: true,
      });

      if (!photo || !photo.base64) {
        throw new Error("No se pudo obtener la captura en Base64");
      }

      // Enviar a la API Backend
      const response = await evaluateGesture(currentVowel.id, photo.base64);
      setResult(response);
    } catch (error) {
      console.error("Error al capturar/evaluar:", error);
      Alert.alert(
        "Conexión con la API",
        "Asegúrate de que la API de Python esté ejecutándose (python src/api/run_api.py). ¿Deseas reintentar?",
        [{ text: "OK" }]
      );
    } finally {
      setEvaluating(false);
    }
  };

  const handleNext = () => {
    setResult(null);
    if (currentIndex + 1 < VOCABULARY.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra de Progreso Superior */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${Math.max(5, progressPercent)}%` }]} />
        </View>
        <Text style={styles.stepCounter}>{currentIndex + 1}/{VOCABULARY.length}</Text>
      </View>

      {/* Instrucción del Gesto Actual */}
      <View style={styles.instructionContainer}>
        <Text style={styles.goalLabel}>Haz la seña correspondiente a:</Text>
        <Text style={styles.targetLetter}>{currentVowel.letter}</Text>
        <Text style={styles.letterDesc}>{currentVowel.description}</Text>
      </View>

      {/* Visor de Cámara con Marco de Guía */}
      <View style={styles.cameraContainer}>
        {permission?.granted ? (
          <>
            <CameraView style={styles.camera} facing="front" ref={cameraRef} />
            <View style={styles.handGuideOverlay} pointerEvents="none">
              <View style={styles.handGuideFrame}>
                <Text style={styles.guideText}>Coloca tu mano aquí</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.permissionFallback}>
            <Text style={styles.fallbackTitle}>Se requiere acceso a la cámara</Text>
            <Text style={styles.fallbackText}>
              Para evaluar la seña con MediaPipe necesitamos habilitar el sensor de cámara.
            </Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>Permitir Cámara</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Panel de Retroalimentación o Botón de Acción */}
      <View style={styles.bottomBar}>
        {result ? (
          <View
            style={[
              styles.feedbackBanner,
              result.passed
                ? styles.feedbackSuccess
                : !result.hand_detected
                ? styles.feedbackWarning
                : styles.feedbackError,
            ]}
          >
            <Text style={styles.feedbackEmoji}>
              {result.passed ? '🎉' : !result.hand_detected ? '✋' : '⚠️'}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.feedbackTitle}>
                {result.passed ? '¡Excelente!' : !result.hand_detected ? 'Mano no detectada' : 'Ajusta tu postura'}
              </Text>
              <Text style={styles.feedbackDesc}>{result.message}</Text>
            </View>

            {result.passed ? (
              <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
                <Text style={styles.continueButtonText}>Continuar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.retryButton} onPress={() => setResult(null)}>
                <Text style={styles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.captureButton, evaluating && { opacity: 0.6 }]}
            onPress={handleCaptureAndEvaluate}
            disabled={evaluating || !permission?.granted}
          >
            {evaluating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.captureButtonText}>EVALUAR SEÑA</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closeBtn: {
    padding: 8,
  },
  closeBtnText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#94A3B8',
  },
  progressBarTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 6,
  },
  stepCounter: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  instructionContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  goalLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  targetLetter: {
    fontSize: 44,
    fontWeight: '900',
    color: '#2563EB',
    marginVertical: 4,
  },
  letterDesc: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  handGuideOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handGuideFrame: {
    width: 220,
    height: 220,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    borderStyle: 'dashed',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  guideText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  permissionFallback: {
    padding: 20,
    alignItems: 'center',
  },
  fallbackTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  fallbackText: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  bottomBar: {
    padding: 20,
    paddingBottom: 30,
  },
  captureButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#1D4ED8',
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  feedbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    gap: 10,
  },
  feedbackSuccess: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
    borderColor: '#22C55E',
  },
  feedbackError: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  feedbackWarning: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  feedbackEmoji: {
    fontSize: 24,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  feedbackDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  continueButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  retryButton: {
    backgroundColor: '#64748B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
});
