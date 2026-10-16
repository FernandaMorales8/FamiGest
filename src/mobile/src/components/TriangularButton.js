import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { FONTS } from '../theme';

// Triángulo equilátero con esquinas redondeadas calculado matemáticamente:
// Lienzo: 170x170, Centroide exacto de rotación: (85, 85)
// Vértices a distancia R=80, radio de redondeo r=12, trazo 5px.
// Círculo inscrito inamovible de radio 37.5px centrado en (85, 85)
const ROUNDED_TRIANGLE_PATH = "M 74.61 23.00 A 12.00 12.00 0 0 1 95.39 23.00 L 143.89 107.00 A 12.00 12.00 0 0 1 133.50 125.00 L 36.50 125.00 A 12.00 12.00 0 0 1 26.11 107.00 L 74.61 23.00 Z";

export default function TriangularButton({
  number = '1',
  onPress,
  disabled = false,
  startOffset = 0, // Desfase inicial escalonado (0, 0.33, 0.66)
  rotationDuration = 7000 // 7000ms para un giro aún más pausado y fluido (+500ms)
}) {
  const rotateAnim = useRef(new Animated.Value(startOffset)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Animación continua a 7000ms
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: startOffset + 1,
        duration: rotationDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [rotationDuration, startOffset]);

  // Manejo de pulsación con rebote elástico y retardo
  const handlePress = () => {
    if (disabled || !onPress) return;

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 150,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      onPress();
    }, 320);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={handlePress}
        activeOpacity={0.85}
        disabled={disabled}
      >
        {/* Capa 1: Fondo con triángulo giratorio (7000ms) */}
        <Animated.View style={[styles.svgWrapper, { transform: [{ rotate: spin }] }]}>
          <Svg width="170" height="170" viewBox="0 0 170 170">
            <Defs>
              <LinearGradient id={`fillGrad_${number}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#38C6D9" />
                <Stop offset="100%" stopColor="#2597A6" />
              </LinearGradient>
              <LinearGradient id={`strokeGrad_${number}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#A2ECF5" />
                <Stop offset="100%" stopColor="#1D546C" />
              </LinearGradient>
            </Defs>

            <Path
              d={ROUNDED_TRIANGLE_PATH}
              fill={`url(#fillGrad_${number})`}
              stroke={`url(#strokeGrad_${number})`}
              strokeWidth="5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>

        {/* Capa 2: Número estático, erguido, siempre legible y centrado */}
        <View style={styles.staticNumberContainer} pointerEvents="none">
          <Text style={styles.numberText}>{number}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1D546C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  touchable: {
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svgWrapper: {
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  staticNumberContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 170,
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontFamily: FONTS.tiltNeon,
    includeFontPadding: false,
    textAlignVertical: 'center',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1.5 },
    textShadowRadius: 3,
  },
});
