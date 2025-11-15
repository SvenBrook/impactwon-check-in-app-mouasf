
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
            Rate yourself on each statement from 1 (lowest) to {competency.questions[0].scale} (highest)
          </Text>

          {competency.questions.map((question, index) => (
            <View key={question.id} style={commonStyles.card}>
              <Text style={styles.questionNumber}>Question {index + 1}</Text>
              <Text style={styles.questionText}>{question.text}</Text>
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
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryButton,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.heading,
    lineHeight: 24,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
