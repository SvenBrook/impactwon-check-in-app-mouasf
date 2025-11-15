
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
import RatingScale from '@/components/RatingScale';
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
  }, []);

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
            Please rate your level based on the descriptions below. Choose the level that is the closest match.
          </Text>

          {competency.questions.map((question, index) => (
            <View key={question.id} style={commonStyles.card}>
              <Text style={styles.questionNumber}>Question {index + 1}: {question.text}</Text>
              <Text style={styles.questionPrompt}>
                Please rate your level of {question.text.toLowerCase()} based on the following descriptions:
              </Text>
              
              {/* Display all level descriptions */}
              <View style={styles.levelsContainer}>
                {Object.entries(question.levels).map(([level, description]) => (
                  <View key={level} style={styles.levelItem}>
                    <Text style={styles.levelLabel}>Level {level}:</Text>
                    <Text style={styles.levelDescription}>{description}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.ratingPrompt}>Select your level:</Text>
              <RatingScale
                scale={question.scale}
                value={localResponses[question.id] || null}
                onChange={(rating) => handleRatingChange(question.id, rating)}
              />
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
    marginBottom: 20,
  },
  levelItem: {
    marginBottom: 12,
    paddingLeft: 8,
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryButton,
    marginBottom: 4,
  },
  levelDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    paddingLeft: 8,
  },
  ratingPrompt: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.heading,
    marginBottom: 8,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
