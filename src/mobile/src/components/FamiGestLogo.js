import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

export default function FamiGestLogo({ fontSize = 42, style = {} }) {
  return (
    <Text style={[styles.logoText, { fontSize }, style]}>
      <Text style={styles.darkText}>Fam</Text>
      <Text style={styles.cyanText}>i</Text>
      <Text style={styles.darkText}>Gest</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  logoText: {
    fontFamily: FONTS.latoBold,
    letterSpacing: 0.5,
  },
  darkText: {
    color: COLORS.darkNavy, // #1D546C
  },
  cyanText: {
    color: COLORS.primaryCyan, // #30AEBF
    fontFamily: FONTS.latoBoldItalic,
  },
});
