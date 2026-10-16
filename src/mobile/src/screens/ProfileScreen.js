import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FamiGestLogo from '../components/FamiGestLogo';
import BottomNavBar from '../components/BottomNavBar';
import { COLORS, FONTS } from '../theme';

export default function ProfileScreen({ onTabChange, progress = { overall: 20, lesson1: 60, lesson2: 0, lesson3: 0 } }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header con Logo */}
        <View style={styles.header}>
          <FamiGestLogo fontSize={42} />
        </View>

        {/* Sección de Usuario */}
        <View style={styles.userSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.userName}>User12345</Text>
        </View>

        {/* Tarjeta de Progreso General */}
        <View style={styles.progressCard}>
          <Text style={styles.cardTitle}>Progreso general</Text>

          {/* Barra general */}
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${progress.overall}%` }]} />
          </View>

          {/* Lección 1 */}
          <View style={styles.lessonRow}>
            <View style={styles.lessonPill}>
              <Text style={styles.lessonPillText}>Lección 1</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${progress.lesson1}%` }]} />
            </View>
          </View>

          {/* Lección 2 */}
          <View style={styles.lessonRow}>
            <View style={styles.lessonPill}>
              <Text style={styles.lessonPillText}>Lección 2</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${progress.lesson2}%` }]} />
            </View>
          </View>

          {/* Lección 3 */}
          <View style={styles.lessonRow}>
            <View style={styles.lessonPill}>
              <Text style={styles.lessonPillText}>Lección 3</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${progress.lesson3}%` }]} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Barra de navegación inferior */}
      <BottomNavBar activeTab="profile" onTabChange={onTabChange} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.profileGray, // #6D6577
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  userName: {
    fontSize: 24,
    fontFamily: FONTS.latoBold,
    color: COLORS.darkNavy, // #1D546C
  },
  progressCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.borderGray,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: FONTS.latoBold,
    color: COLORS.darkNavy,
    textAlign: 'center',
    marginBottom: 20,
  },
  lessonRow: {
    marginTop: 20,
  },
  lessonPill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryCyan, // #30AEBF
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 10,
  },
  lessonPillText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: FONTS.tiltNeon,
  },
  barTrack: {
    height: 8,
    backgroundColor: COLORS.trackGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.darkNavy, // #1D546C
    borderRadius: 4,
  },
});
