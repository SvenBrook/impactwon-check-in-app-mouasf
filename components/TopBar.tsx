
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { commonStyles, colors } from '@/styles/commonStyles';

export default function TopBar() {
  return (
    <View style={[commonStyles.topBar, styles.topBar]}>
      <Text style={styles.logo}>ImpactWon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingTop: Platform.OS === 'android' ? 48 : 16,
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.heading,
    letterSpacing: 0.5,
  },
});
