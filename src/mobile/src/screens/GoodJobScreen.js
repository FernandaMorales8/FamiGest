import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme';

export default function GoodJobScreen({ onNext, percent = 100 }) {
  // Cálculo geométrico dinámico del arco según el porcentaje real (0 a 100%)
  const clampPercent = Math.min(100, Math.max(5, percent));
  // Ángulo en radianes: de pi (180°) a 0 (0°)
  const angle = Math.PI - (Math.PI * (clampPercent / 100));
  const r = 96;
  const cx = 120;
  const cy = 118;
  const endX = (cx + r * Math.cos(angle)).toFixed(2);
  const endY = (cy - r * Math.sin(angle)).toFixed(2);
  const progressPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${endX} ${endY}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Título Oficial ¡Buen trabajo! en formato hero extra-grande (100px) */}
        <View style={styles.titleWrapper}>
          <Text
            style={styles.titleLine1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            numberOfLines={1}
          >
            <Text style={styles.cyanExcl}>¡</Text>
            <Text style={styles.darkText}>Buen</Text>
          </Text>

          <Text
            style={styles.titleLine2}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            numberOfLines={1}
          >
            <Text style={styles.darkText}>trabajo</Text>
            <Text style={styles.cyanExcl}>!</Text>
          </Text>
        </View>

        {/* Medidor de Progreso en Semicírculo Dinámico */}
        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeSvgWrapper}>
            <Svg width="240" height="135" viewBox="0 0 240 135">
              {/* Arco base gris */}
              <Path
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill="none"
                stroke="#E2EEF1"
                strokeWidth="18"
                strokeLinecap="round"
              />
              {/* Arco de progreso celeste según el porcentaje real */}
              <Path
                d={progressPath}
                fill="none"
                stroke={COLORS.primaryCyan} // #30AEBF
                strokeWidth="18"
                strokeLinecap="round"
              />
            </Svg>

            {/* Texto de Porcentaje Central Real */}
            <View style={styles.percentTextContainer}>
              <Text style={styles.percentNumber}>
                {percent}
                <Text style={styles.percentSymbol}>%</Text>
              </Text>
              <Text style={styles.percentLabel}>Progreso</Text>
            </View>
          </View>
        </View>

        {/* Botón Siguiente */}
        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.85}
          onPress={onNext}
        >
          <View style={styles.nextBtnContent}>
            <Text style={styles.nextButtonText}>Siguiente</Text>
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
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  titleWrapper: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 6,
    overflow: 'visible',
  },
  titleLine1: {
    fontSize: 102,
    fontFamily: FONTS.latoBold,
    textAlign: 'left',
    letterSpacing: -1.5,
    paddingBottom: 2,
    overflow: 'visible',
  },
  titleLine2: {
    fontSize: 102,
    fontFamily: FONTS.latoBold,
    textAlign: 'left',
    letterSpacing: -1.5,
    marginTop: -14, // Interlineado compacto y ceñido de Figma
    paddingBottom: 26, // Margen inferior generoso para que el gancho de la 'j' NUNCA se corte
    overflow: 'visible',
  },
  cyanExcl: {
    color: COLORS.primaryCyan, // #30AEBF
  },
  darkText: {
    color: COLORS.darkNavy,    // #1D546C
  },
  gaugeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  gaugeSvgWrapper: {
    width: 240,
    height: 145,
    alignItems: 'center',
    position: 'relative',
  },
  percentTextContainer: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
  },
  percentNumber: {
    fontSize: 52,
    fontFamily: FONTS.latoBold,
    color: '#000000',
    textAlign: 'center',
  },
  percentSymbol: {
    fontSize: 32,
    fontFamily: FONTS.latoBold,
    color: '#000000',
  },
  percentLabel: {
    fontSize: 26,
    fontFamily: FONTS.latoBold,
    color: COLORS.darkNavy, // #1D546C
    marginTop: -2,
    textAlign: 'center',
  },
  nextButton: {
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
  nextBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: FONTS.tiltNeon,
    letterSpacing: 0.5,
  },
});
