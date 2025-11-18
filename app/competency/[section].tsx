
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors, buttonStyles } from '@/styles/commonStyles';
import { useAssessment } from '@/contexts/AssessmentContext';
import { competencies } from '@/data/competencies';
import { IconSymbol } from '@/components/IconSymbol';

export default function CompetencyScreen() {
  const { section } = useLocalSearchParams();
  const sectionIndex = parseInt(section as string);
  const competency = competencies[sectionIndex];
  
  const { responses, updateResponse } = useAssessment();
  const [localResponses, setLocalResponses] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Load existing responses
    const existing: { [key: string]: number } = {};
    competency.questions.forEach((question) => {
      const response = responses.find((r) => r.questionId === question.id);
      if (response) {
        existing[question.id] = response.rating;
      }
    });
    setLocalResponses(existing);
  }, [competency.questions, responses]);

  const handleRatingChange = (questionId: string, rating: number) => {
    setLocalResponses((prev) => ({ ...prev, [questionId]: rating }));
  };

  const allQuestionsAnswered = competency.questions.every(
    (q) => localResponses[q.id] !== undefined
  );

  const handleNext = () => {
    // Save all responses
    Object.entries(localResponses).forEach(([questionId, rating]) => {
      updateResponse(questionId, rating);
    });

    if (sectionIndex < competencies.length - 1) {
      router.push(`/competency/${sectionIndex + 1}`);
    } else {
      router.push('/results');
    }
  };

  const handleBack = () => {
    // Save current responses before going back
    Object.entries(localResponses).forEach(([questionId, rating]) => {
      updateResponse(questionId, rating);
    });

    if (sectionIndex > 0) {
      router.back();
    } else {
      router.back();
    }
  };

  // Helper function to get the background color for each level
  const getLevelColor = (level: number): string => {
    switch (level) {
      case 1:
        return colors.level1; // Sky Blue
      case 2:
        return colors.level2; // Insight Teal
      case 3:
        return colors.level3; // Reliable Lilac
      case 4:
        return colors.level4; // Beacon Orange
      case 5:
        return colors.level5; // Clarity Blue
      default:
        return colors.skyBlue;
    }
  };

  // Helper function to get text color for each level (for better contrast)
  const getLevelTextColor = (level: number): string => {
    // For darker backgrounds (level 4 and 5), use white text
    if (level === 4 || level === 5) {
      return colors.white;
    }
    // For lighter backgrounds, use heading color
    return colors.heading;
  };

  // Helper function to get badge text color
  const getLevelBadgeTextColor = (level: number, isSelected: boolean): string => {
    if (isSelected) {
      return colors.white;
    }
    // For level 4 and 5, use the card background color for contrast
    if (level === 4 || level === 5) {
      return colors.heading;
    }
    return colors.heading;
  };

  const progress = ((sectionIndex + 1) / competencies.length) * 100;

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color={colors.heading}
          />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {sectionIndex + 1} of {competencies.length}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={commonStyles.title}>{competency.name}</Text>
          <Text style={[commonStyles.text, styles.instruction]}>
            Please rate your level based on the descriptions below. Tap the level statement that is the closest match to your current level.
          </Text>

          {competency.questions.map((question, index) => (
            <View key={question.id} style={commonStyles.card}>
              <Text style={styles.questionNumber}>Question {index + 1}: {question.text}</Text>
              <Text style={styles.questionPrompt}>
                Please rate your level of {question.text.toLowerCase()} by selecting the description that best matches:
              </Text>
              
              {/* Display all level descriptions as clickable cards */}
              <View style={styles.levelsContainer}>
                {Object.entries(question.levels).map(([level, description]) => {
                  const levelNum = parseInt(level);
                  const isSelected = localResponses[question.id] === levelNum;
                  const levelColor = getLevelColor(levelNum);
                  const textColor = getLevelTextColor(levelNum);
                  const badgeTextColor = getLevelBadgeTextColor(levelNum, isSelected);
                  
                  return (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.levelCard,
                        { backgroundColor: levelColor },
                        isSelected && styles.levelCardSelected,
                      ]}
                      onPress={() => handleRatingChange(question.id, levelNum)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.levelHeader}>
                        <View style={[
                          styles.levelBadge,
                          isSelected && styles.levelBadgeSelected,
                          { backgroundColor: isSelected ? colors.primaryButton : colors.white },
                        ]}>
                          <Text style={[
                            styles.levelBadgeText,
                            { color: badgeTextColor },
                          ]}>
                            Level {level}
                          </Text>
                        </View>
                        {isSelected && (
                          <View style={styles.checkmarkContainer}>
                            <IconSymbol
                              ios_icon_name="checkmark.circle.fill"
                              android_material_icon_name="check_circle"
                              size={24}
                              color={colors.primaryButton}
                            />
                          </View>
                        )}
                      </View>
                      <Text style={[
                        styles.levelDescription,
                        { color: textColor },
                        isSelected && styles.levelDescriptionSelected,
                      ]}>
                        {description}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[
              buttonStyles.primaryButton,
              styles.button,
              !allQuestionsAnswered && styles.buttonDisabled,
            ]}
            onPress={handleNext}
            disabled={!allQuestionsAnswered}
          >
            <Text style={buttonStyles.primaryButtonText}>
              {sectionIndex < competencies.length - 1 ? 'Next Section' : 'View Results'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
    backgroundColor: colors.white,
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.skyBlue,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primaryButton,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.grey,
    marginTop: 4,
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  instruction: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.heading,
    marginBottom: 12,
  },
  questionPrompt: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  levelsContainer: {
    gap: 12,
  },
  levelCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelCardSelected: {
    borderColor: colors.primaryButton,
    boxShadow: '0px 2px 8px rgba(13, 149, 255, 0.25)',
    elevation: 4,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelBadgeSelected: {
    backgroundColor: colors.primaryButton,
  },
  levelBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  checkmarkContainer: {
    marginLeft: 8,
  },
  levelDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  levelDescriptionSelected: {
    fontWeight: '500',
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
