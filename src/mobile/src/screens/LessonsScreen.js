import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FamiGestLogo from '../components/FamiGestLogo';
import BottomNavBar from '../components/BottomNavBar';
import TriangularButton from '../components/TriangularButton';
import { COLORS, FONTS } from '../theme';

export default function LessonsScreen({ onSelectLesson, onTabChange, progress }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Encabezado */}
        <View style={styles.header}>
          <FamiGestLogo fontSize={42} />
          <Text style={styles.subtitle}>Selecciona la lección</Text>
        </View>

        {/* Nodos de lecciones en Zigzag distribuidos armónicamente */}
        <View style={styles.pathContainer}>
          {/* Lección 1: Vocales (Giro inicial a 0°) */}
          <View style={styles.rowNode}>
            <TriangularButton
              number="1"
              startOffset={0}
              onPress={() => onSelectLesson(1)}
            />
            <View style={styles.labelWrapperRight}>
              <View style={styles.titleWithStarRow}>
                <Text style={styles.lessonName}>Vocales</Text>
                {progress?.lesson1 >= 100 && (
                  <Ionicons name="star" size={24} color="#F59E0B" style={styles.starIcon} />
                )}
              </View>
            </View>
          </View>

          {/* Lección 2: Alfabeto estático (Giro inicial a 120°) */}
          <View style={[styles.rowNode, styles.rowNodeReverse]}>
            <TriangularButton
              number="2"
              startOffset={0.33}
              onPress={() => {}}
            />
            <View style={styles.labelWrapperLeft}>
              <Text style={styles.lessonName}>Alfabeto</Text>
              <Text style={styles.lessonSubName}>estático</Text>
            </View>
          </View>

          {/* Lección 3: Palabras simples (Giro inicial a 240°) */}
          <View style={styles.rowNode}>
            <TriangularButton
              number="3"
              startOffset={0.66}
              onPress={() => {}}
            />
            <View style={styles.labelWrapperRight}>
              <Text style={styles.lessonName}>Palabras</Text>
              <Text style={styles.lessonName}>simples</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Barra de navegación inferior */}
      <BottomNavBar activeTab="lessons" onTabChange={onTabChange} />
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
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: {
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  subtitle: {
    fontSize: 22,
    fontFamily: FONTS.latoBold,
    color: COLORS.darkNavy, // #1D546C
    marginTop: 6,
  },
  pathContainer: {
    flex: 1,
    justifyContent: 'space-evenly', // Distribución uniforme que aprovecha todo el alto de la pantalla
    paddingVertical: 10,
  },
  rowNode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  rowNodeReverse: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  labelWrapperRight: {
    marginLeft: 18,
    justifyContent: 'center',
  },
  labelWrapperLeft: {
    marginRight: 18,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  lessonName: {
    fontSize: 26,
    fontFamily: FONTS.tiltNeon,
    color: COLORS.textDark,
    lineHeight: 30,
  },
  lessonSubName: {
    fontSize: 18,
    fontFamily: FONTS.tiltNeon,
    color: COLORS.textMuted,
  },
  titleWithStarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starIcon: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
});
