import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FamiGestLogo from '../components/FamiGestLogo';
import { FONTS, COLORS } from '../theme';

export default function LoadingScreen({ onLoaded, duration = 1400, message = null }) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      onLoaded();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        <FamiGestLogo fontSize={52} style={styles.logo} />
        
        {/* Spinner circular con gradiente visual simulado */}
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />

        {message ? (
          <Text style={styles.messageText}>{message}</Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 36,
  },
  spinner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 5,
    borderColor: '#E2F3F5',
    borderTopColor: '#2CA8B8',
    borderRightColor: '#58C2CE',
  },
  messageText: {
    marginTop: 28,
    fontSize: 16,
    fontFamily: FONTS.latoBold,
    color: COLORS.darkNavy, // #1D546C
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
