import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FamiGestLogo from '../components/FamiGestLogo';
import BottomNavBar from '../components/BottomNavBar';
import { COLORS, FONTS } from '../theme';

export default function SettingsScreen({ onTabChange, onResetProgress }) {
  const handleHowToUse = () => {
    Alert.alert(
      "Cómo usar la app",
      "1. Selecciona una lección.\n2. Identifica la seña en la opción múltiple.\n3. Coloca tu mano frente a la cámara dentro del marco.\n4. La app evaluará tu postura automáticamente.",
      [{ text: "Entendido" }]
    );
  };

  const handleChangeNickname = () => {
    Alert.alert("Cambiar Nickname", "Función disponible próximamente en Sprint III.");
  };

  const handleResetProgress = () => {
    Alert.alert(
      "Reiniciar Progreso",
      "¿Estás seguro de que deseas reiniciar tu progreso acumulado?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reiniciar",
          style: "destructive",
          onPress: () => {
            if (onResetProgress) onResetProgress();
            Alert.alert("Progreso reiniciado", "Tu avance ha sido restablecido a 0%.");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <FamiGestLogo fontSize={42} />
        </View>

        {/* Tarjeta de Opciones */}
        <View style={styles.settingsCard}>
          <TouchableOpacity
            style={[styles.btn, styles.cyanBtn]}
            onPress={handleHowToUse}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Cómo usar{'\n'}la app</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.navyBtn]}
            onPress={handleChangeNickname}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Cambiar{'\n'}Nickname</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.redBtn]}
            onPress={handleResetProgress}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Reiniciar{'\n'}Progreso</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de navegación inferior */}
      <BottomNavBar activeTab="settings" onTabChange={onTabChange} />
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
  },
  header: {
    marginBottom: 24,
  },
  settingsCard: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.borderGray,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  btn: {
    width: '80%',
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  cyanBtn: {
    backgroundColor: COLORS.primaryCyan, // #30AEBF
  },
  navyBtn: {
    backgroundColor: COLORS.darkNavy,    // #1D546C
  },
  redBtn: {
    backgroundColor: COLORS.errorRed,    // #D95D5D
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: FONTS.tiltNeon,
    textAlign: 'center',
    lineHeight: 26,
  },
});
