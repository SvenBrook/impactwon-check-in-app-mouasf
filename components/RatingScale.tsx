
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface RatingScaleProps {
  scale: 3 | 5;
  value: number | null;
  onChange: (rating: number) => void;
}

export default function RatingScale({ scale, value, onChange }: RatingScaleProps) {
  const options = Array.from({ length: scale }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.option,
            value === option && styles.optionSelected,
          ]}
          onPress={() => onChange(option)}
        >
          <Text
            style={[
              styles.optionText,
              value === option && styles.optionTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: colors.skyBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: colors.primaryButton,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.heading,
  },
  optionTextSelected: {
    color: colors.white,
  },
});
