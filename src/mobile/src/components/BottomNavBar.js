import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function BottomNavBar({ activeTab, onTabChange }) {
  return (
    <View style={styles.navWrapper}>
      <View style={styles.navCard}>
        {/* Tab 1: Perfil */}
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => onTabChange('profile')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="person-outline"
            size={28}
            color={activeTab === 'profile' ? COLORS.primaryCyan : '#708A96'}
          />
        </TouchableOpacity>

        {/* Tab 2: Lecciones (Mano) */}
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => onTabChange('lessons')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="hand-back-right-outline"
            size={32}
            color={activeTab === 'lessons' ? COLORS.primaryCyan : '#708A96'}
          />
        </TouchableOpacity>

        {/* Tab 3: Configuración (Engrane) */}
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => onTabChange('settings')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="settings-outline"
            size={28}
            color={activeTab === 'settings' ? COLORS.primaryCyan : '#708A96'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  navCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#C6E8ED',
    paddingVertical: 10,
    shadowColor: COLORS.primaryCyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  tabBtn: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
