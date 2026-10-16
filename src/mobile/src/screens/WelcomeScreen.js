import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FamiGestLogo from '../components/FamiGestLogo';
import { COLORS, FONTS } from '../theme';

export default function WelcomeScreen({ onStart }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        <FamiGestLogo fontSize={54} style={styles.logo} />
        
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.85}
          onPress={onStart}
        >
          <Text style={styles.startButtonText}>Iniciar</Text>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: COLORS.primaryCyan, // #30AEBF
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 22,
    shadowColor: COLORS.primaryCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: FONTS.tiltNeon,
    letterSpacing: 0.5,
  },
});
