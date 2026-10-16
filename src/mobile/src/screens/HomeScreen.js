import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ onSelectLesson }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Gamificado tipo Duolingo */}
      <View style={styles.header}>
        <View style={styles.statBadge}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={styles.statText}>1 Día</Text>
        </View>
        <Text style={styles.appTitle}>FamiGest</Text>
        <View style={styles.statBadge}>
          <Text style={styles.statEmoji}>❤️</Text>
          <Text style={styles.statText}>5</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Módulos de Lengua de Señas</Text>
        <Text style={styles.sectionSubtitle}>Selecciona una lección para comenzar a practicar frente a la cámara.</Text>

        {/* Lección 1: Activa */}
        <View style={styles.lessonCardActive}>
          <View style={styles.badgeActive}>
            <Text style={styles.badgeTextActive}>EN CURSO</Text>
          </View>
          <Text style={styles.lessonTitle}>Lección 1: Las Vocales (LSM)</Text>
          <Text style={styles.lessonDesc}>
            Aprende a realizar la postura manual de las 5 vocales: A, E, I, O y U.
          </Text>
          <View style={styles.vowelTags}>
            {['A', 'E', 'I', 'O', 'U'].map((v) => (
              <View key={v} style={styles.tag}>
                <Text style={styles.tagText}>{v}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity 
            style={styles.startButton} 
            activeOpacity={0.8}
            onPress={() => onSelectLesson(1)}
          >
            <Text style={styles.startButtonText}>EMPEZAR LECCIÓN</Text>
          </TouchableOpacity>
        </View>

        {/* Lección 2: Bloqueada (Para Sprint III) */}
        <View style={styles.lessonCardLocked}>
          <View style={styles.lockRow}>
            <Text style={styles.lessonTitleLocked}>Lección 2: Abecedario 1</Text>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
          <Text style={styles.lessonDescLocked}>
            Señas estáticas para consonantes B, C, D, F y G.
          </Text>
          <Text style={styles.lockedNote}>Se desbloquea al completar la Lección 1</Text>
        </View>

        {/* Lección 3: Bloqueada (Para Sprint III) */}
        <View style={styles.lessonCardLocked}>
          <View style={styles.lockRow}>
            <Text style={styles.lessonTitleLocked}>Lección 3: Emociones Básicas</Text>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
          <Text style={styles.lessonDescLocked}>
            Aprende a comunicar estados de ánimo y expresiones básicas.
          </Text>
          <Text style={styles.lockedNote}>Se desbloquea al completar la Lección 2</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 0.5,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  statText: {
    fontWeight: '700',
    fontSize: 13,
    color: '#475569',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    lineHeight: 20,
  },
  lessonCardActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  badgeActive: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeTextActive: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  lessonDesc: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 14,
  },
  vowelTags: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F1F5F9',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontWeight: '700',
    color: '#334155',
  },
  startButton: {
    backgroundColor: '#22C55E',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#16A34A',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  lessonCardLocked: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    opacity: 0.7,
  },
  lockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  lessonTitleLocked: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
  },
  lockIcon: {
    fontSize: 16,
  },
  lessonDescLocked: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 8,
  },
  lockedNote: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
});
