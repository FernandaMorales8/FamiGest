import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import FamiGestLogo from '../components/FamiGestLogo';
import { evaluateGesture } from '../services/api';
import { COLORS, FONTS } from '../theme';

export default function CameraPracticeScreen({
  letter = 'A',
  gestureId = 1,
  onCorrect,
  onSkip,
  onCancel
}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [statusMessage, setStatusMessage] = useState('Buscando mano en el encuadre...');
  const [isCorrect, setIsCorrect] = useState(false);
  const [handDetected, setHandDetected] = useState(false);
  const cameraRef = useRef(null);
  const isMountedRef = useRef(true);
  const isEvaluatingRef = useRef(false);

  // Solicitar permiso de cámara automáticamente al entrar
  useEffect(() => {
    isMountedRef.current = true;
    if (!permission?.granted) {
      requestPermission();
    }
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const updateStatus = (msg) => {
    if (isMountedRef.current) {
      setStatusMessage((prev) => (prev !== msg ? msg : prev));
    }
  };

  // Bucle de evaluación en tiempo real (cada 1.2 segundos captura y analiza)
  useEffect(() => {
    if (!permission?.granted || isCorrect) return;

    const intervalId = setInterval(async () => {
      if (!cameraRef.current || isEvaluatingRef.current || isCorrect) return;

      try {
        isEvaluatingRef.current = true;

        // Captura silenciosa sin obturador que resuelve la imagen con base64 para MediaPipe
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.35,
          base64: true,
          shutterSound: false,
        });

        if (photo?.base64 && isMountedRef.current) {
          const res = await evaluateGesture(gestureId, photo.base64);

          if (!isMountedRef.current) return;

          if (res.passed) {
            // ¡Seña correcta! Borde verde, detener bucle y pasar automáticamente
            setIsCorrect(true);
            setHandDetected(true);
            updateStatus('¡Excelente! Seña correcta.');
            clearInterval(intervalId);
            setTimeout(() => {
              if (isMountedRef.current && onCorrect) onCorrect();
            }, 800);
          } else if (res.hand_detected) {
            // Mano detectada pero postura incorrecta: Borde rojo reactivo
            setHandDetected(true);
            updateStatus('Mano detectada: ajusta la postura.');
          } else {
            // Buscando mano en el encuadre: Borde base azul oscuro
            setHandDetected(false);
            updateStatus('Coloca tu mano frente a la cámara.');
          }
        }
      } catch (err) {
        // Fallo de red silencioso para no interrumpir el flujo continuo
        if (isMountedRef.current) {
          updateStatus('Esperando conexión con la API...');
        }
      } finally {
        if (isMountedRef.current) {
          isEvaluatingRef.current = false;
        }
      }
    }, 1200);

    return () => {
      clearInterval(intervalId);
      isEvaluatingRef.current = false;
    };
  }, [permission?.granted, isCorrect]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Encabezado */}
        <View style={styles.header}>
          <FamiGestLogo fontSize={40} />
          <Text style={styles.subtitle}>Realiza la seña correspondiente</Text>
        </View>

        {/* Visor de Cámara con borde reactivo: Verde (acierto), Rojo (mano detectada / ajustando), Azul oscuro (buscando) */}
        <View
          style={[
            styles.cameraBox,
            isCorrect
              ? styles.cameraBoxSuccess
              : handDetected
              ? styles.cameraBoxAdjusting
              : null,
          ]}
        >
          {permission?.granted ? (
            <CameraView
              style={styles.camera}
              facing="front"
              ref={cameraRef}
              animateShutter={false}
              enableTorch={false}
            />
          ) : (
            <View style={styles.permissionFallback}>
              <Text style={styles.fallbackText}>Habilitando cámara...</Text>
              <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
                <Text style={styles.permBtnText}>Permitir acceso</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Letra Objetivo y Estado en Vivo con retroalimentación cromática */}
        <View style={styles.targetSection}>
          <Text
            style={[
              styles.targetLetter,
              isCorrect
                ? styles.targetLetterSuccess
                : handDetected
                ? styles.targetLetterAdjusting
                : null,
            ]}
          >
            {letter}
          </Text>
          <View style={styles.statusRow}>
            <Text
              style={[
                styles.statusText,
                isCorrect
                  ? styles.statusTextSuccess
                  : handDetected
                  ? styles.statusTextAdjusting
                  : null,
              ]}
            >
              {statusMessage}
            </Text>
          </View>
        </View>

        {/* Botón Saltar (posterga este ejercicio para intentarlo al final) o Completado */}
        <TouchableOpacity
          style={[styles.actionButton, isCorrect ? styles.actionButtonSuccess : styles.actionButtonSkip]}
          activeOpacity={0.85}
          onPress={isCorrect ? onCorrect : onSkip}
        >
          <View style={styles.btnContent}>
            <Text style={styles.actionButtonText}>
              {isCorrect ? '¡Completado!' : 'Saltar'}
            </Text>
            <Ionicons
              name={isCorrect ? 'checkmark-circle-outline' : 'play-skip-forward-outline'}
              size={26}
              color="#FFFFFF"
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: FONTS.latoBold,
    color: COLORS.darkNavy, // #1D546C
    marginTop: 8,
  },
  cameraBox: {
    width: '100%',
    height: 330,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: COLORS.darkNavy, // #1D546C
    backgroundColor: '#0F172A',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBoxAdjusting: {
    borderColor: COLORS.errorRed, // #D95D5D - Borde rojo cuando detecta la mano pero la postura es incorrecta
    borderWidth: 3.5,
  },
  cameraBoxSuccess: {
    borderColor: COLORS.successGreen, // #5DD982
    borderWidth: 3.5,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  permissionFallback: {
    alignItems: 'center',
    padding: 20,
  },
  fallbackText: {
    color: '#94A3B8',
    fontFamily: FONTS.lato,
    fontSize: 14,
    marginBottom: 12,
  },
  permBtn: {
    backgroundColor: COLORS.primaryCyan,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  permBtnText: {
    color: '#FFFFFF',
    fontFamily: FONTS.tiltNeon,
  },
  targetSection: {
    alignItems: 'center',
    marginVertical: 4,
  },
  targetLetter: {
    fontSize: 54,
    fontFamily: FONTS.tiltNeon,
    color: '#000000',
  },
  targetLetterAdjusting: {
    color: COLORS.errorRed, // #D95D5D
  },
  targetLetterSuccess: {
    color: COLORS.successGreen,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 26,
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    fontFamily: FONTS.lato,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  statusTextAdjusting: {
    color: COLORS.errorRed, // #D95D5D
    fontFamily: FONTS.latoBold,
  },
  statusTextSuccess: {
    color: COLORS.successGreen,
    fontFamily: FONTS.latoBold,
  },
  actionButton: {
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  actionButtonSkip: {
    backgroundColor: '#1D546C', // Azul oscuro elegante para "Saltar"
    borderWidth: 2,
    borderColor: COLORS.primaryCyan,
    shadowColor: '#1D546C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  actionButtonSuccess: {
    backgroundColor: COLORS.successGreen, // #5DD982
    shadowColor: COLORS.successGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: FONTS.tiltNeon,
    letterSpacing: 0.5,
  },
});
