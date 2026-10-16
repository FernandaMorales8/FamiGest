import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FamiGestLogo from '../components/FamiGestLogo';
import { COLORS, FONTS } from '../theme';

// Imágenes de referencia locales
const GESTURE_IMAGE_A = require('../../assets/gestures/1_a.jpg');
const GESTURE_IMAGE_E = require('../../assets/gestures/2_e.jpg');

const GESTURE_IMAGES = {
  A: GESTURE_IMAGE_A,
  E: GESTURE_IMAGE_E,
};

// Subcomponente para cada botón de opción: gestiona su propia animación y estado de error independientemente
function OptionButton({
  option,
  isCorrectOption,
  hasFoundCorrect,
  onSelectCorrect,
  onSelectWrong,
}) {
  const [isWrong, setIsWrong] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handlePress = () => {
    if (hasFoundCorrect || isWrong) return;

    if (isCorrectOption) {
      onSelectCorrect();
    } else {
      if (onSelectWrong) onSelectWrong(option);
      setIsWrong(true);
      fadeAnim.setValue(1); // Inmediatamente rojo con la X

      // Pausa de 800ms para registrar el error, luego desvanece suavemente a cyan (1 -> 0)
      timerRef.current = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false, // Requerido para interpolación de color de fondo
        }).start(() => {
          setIsWrong(false);
        });
      }, 800);
    }
  };

  const isThisCorrect = hasFoundCorrect && isCorrectOption;

  // Interpolación de color de fondo independiente
  const backgroundColor = isWrong
    ? fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.primaryCyan, COLORS.errorRed],
      })
    : isThisCorrect
    ? COLORS.successGreen
    : COLORS.primaryCyan;

  return (
    <Animated.View
      style={[
        styles.optionBtn,
        { backgroundColor },
      ]}
    >
      <TouchableOpacity
        style={styles.btnTouchable}
        activeOpacity={0.8}
        onPress={handlePress}
        disabled={hasFoundCorrect || isWrong}
      >
        {isThisCorrect ? (
          <Ionicons name="checkmark-circle-outline" size={28} color="#FFFFFF" />
        ) : isWrong ? (
          <View style={styles.contentHolder}>
            {/* Letra que reaparece conforme el rojo se desvanece */}
            <Animated.View
              style={[
                styles.centerAbsolute,
                {
                  opacity: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0],
                  }),
                },
              ]}
            >
              <Text style={styles.optionText}>{option}</Text>
            </Animated.View>

            {/* Ícono X blanca que se desvanece suavemente hacia el estado original */}
            <Animated.View
              style={[
                styles.centerAbsolute,
                { opacity: fadeAnim },
              ]}
            >
              <Ionicons name="close-circle-outline" size={28} color="#FFFFFF" />
            </Animated.View>
          </View>
        ) : (
          <Text style={styles.optionText}>{option}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ExerciseMultipleChoiceScreen({
  targetLetter = 'A',
  options = ['E', 'I', 'O', 'A'],
  imageSource = null,
  onCorrect,
  onWrongAttempt,
  onCancel,
}) {
  const [hasFoundCorrect, setHasFoundCorrect] = useState(false);

  const correctOption = targetLetter;
  const image = imageSource || GESTURE_IMAGES[targetLetter] || GESTURE_IMAGE_A;

  const handleSelectCorrect = () => {
    if (hasFoundCorrect) return;
    setHasFoundCorrect(true);
    setTimeout(() => {
      onCorrect();
    }, 700);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Encabezado */}
        <View style={styles.header}>
          <FamiGestLogo fontSize={40} />
          <Text style={styles.subtitle}>¿A qué letra corresponde?</Text>
        </View>

        {/* Tarjeta con Ilustración de la Seña */}
        <View style={styles.imageCard}>
          <Image
            source={image}
            style={styles.gestureImage}
            resizeMode="contain"
          />
        </View>

        {/* 4 Opciones Verticales independientes */}
        <View style={styles.optionsContainer}>
          {options.map((opt) => (
            <OptionButton
              key={opt}
              option={opt}
              isCorrectOption={opt === correctOption}
              hasFoundCorrect={hasFoundCorrect}
              onSelectCorrect={handleSelectCorrect}
              onSelectWrong={onWrongAttempt}
            />
          ))}
        </View>
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: FONTS.latoBold,
    color: COLORS.darkNavy, // #1D546C
    marginTop: 8,
  },
  imageCard: {
    width: '100%',
    height: 250,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: COLORS.darkNavy, // #1D546C
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 12,
  },
  gestureImage: {
    width: '100%',
    height: '100%',
  },
  optionsContainer: {
    gap: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  optionBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.primaryCyan,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  btnTouchable: {
    height: 56, // Altura fija: evita ensanchamientos o saltos de layout
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentHolder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerAbsolute: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: FONTS.tiltNeon,
    letterSpacing: 0.5,
  },
});
