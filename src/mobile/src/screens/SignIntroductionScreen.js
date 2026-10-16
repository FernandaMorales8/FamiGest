import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FamiGestLogo from '../components/FamiGestLogo';
import { COLORS, FONTS } from '../theme';

const GESTURE_IMAGE_A = require('../../assets/gestures/1_a.jpg');
const GESTURE_IMAGE_E = require('../../assets/gestures/2_e.jpg');

const GESTURE_IMAGES = {
  A: GESTURE_IMAGE_A,
  E: GESTURE_IMAGE_E,
};

const DEFAULT_DESCRIPTIONS = {
  A: 'Cierra la mano formando un puño relajado y apoya el pulgar contra el lateral exterior del dedo índice. La palma debe orientarse hacia el frente.',
  E: 'Dobla los cuatro dedos hacia adentro como una garra suave, apoyando las yemas de los dedos sobre la base de la palma o el pulgar, con la palma mirando hacia el frente.',
};

const DEFAULT_TIPS = {
  A: 'Asegúrate de que la cámara distinga la posición de tu pulgar y tus nudillos.',
  E: 'Mantén los dedos flexionados juntos y la palma orientada de frente a la cámara.',
};

export default function SignIntroductionScreen({
  letter = 'A',
  category = 'Vocal',
  description = null,
  tip = null,
  imageSource = null,
  onContinue,
  onCancel,
}) {
  const finalDesc = description || DEFAULT_DESCRIPTIONS[letter] || DEFAULT_DESCRIPTIONS['A'];
  const finalTip = tip || DEFAULT_TIPS[letter] || DEFAULT_TIPS['A'];
  const finalImg = imageSource || GESTURE_IMAGES[letter] || GESTURE_IMAGE_A;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Encabezado */}
        <View style={styles.header}>
          <FamiGestLogo fontSize={40} />
          <Text style={styles.subtitle}>Conoce la seña</Text>
        </View>

        {/* Tarjeta con Ilustración de la Seña */}
        <View style={styles.imageCard}>
          <Image
            source={finalImg}
            style={styles.gestureImage}
            resizeMode="contain"
          />
        </View>

        {/* Tarjeta Informativa de la Seña */}
        <View style={styles.infoCard}>
          <View style={styles.badgeRow}>
            <View style={styles.letterBadge}>
              <Text style={styles.letterText}>{letter}</Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          </View>

          <Text style={styles.descriptionText}>{finalDesc}</Text>

          <View style={styles.tipBox}>
            <Ionicons name="bulb-outline" size={20} color={COLORS.primaryCyan} style={{ marginRight: 8 }} />
            <Text style={styles.tipText}>{finalTip}</Text>
          </View>
        </View>

        {/* Botón Continuar */}
        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.85}
          onPress={onContinue}
        >
          <View style={styles.btnContent}>
            <Text style={styles.continueButtonText}>Continuar</Text>
            <Ionicons name="arrow-forward-circle-outline" size={28} color="#FFFFFF" />
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
    paddingHorizontal: 24,
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
    marginTop: 6,
  },
  imageCard: {
    width: '100%',
    height: 230,
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: COLORS.darkNavy, // #1D546C
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 10,
  },
  gestureImage: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    marginVertical: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  letterBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryCyan,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letterText: {
    fontSize: 24,
    fontFamily: FONTS.tiltNeon,
    color: '#FFFFFF',
  },
  categoryBadge: {
    backgroundColor: '#E6F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: FONTS.latoBold,
    color: COLORS.darkNavy,
  },
  descriptionText: {
    fontSize: 15,
    fontFamily: FONTS.lato,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 10,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primaryCyan,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.lato,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  continueButton: {
    backgroundColor: COLORS.primaryCyan, // #30AEBF
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primaryCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: FONTS.tiltNeon,
    letterSpacing: 0.5,
  },
});
