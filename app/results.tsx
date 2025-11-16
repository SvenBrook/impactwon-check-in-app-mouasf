
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors, buttonStyles } from '@/styles/commonStyles';
import TopBar from '@/components/TopBar';
import RadarChart from '@/components/RadarChart';
import RatingScale from '@/components/RatingScale';
import { useAssessment } from '@/contexts/AssessmentContext';
import { competencies, benchmarkProfile } from '@/data/competencies';
import { calculateAllAverages, getCompetencyStatus, getStatusColor } from '@/utils/assessmentUtils';
import { captureChartAsBase64 } from '@/utils/chartCapture';
import { sendAssessmentEmail, saveAssessmentToDatabase } from '@/utils/emailService';
import { isSupabaseConfigured } from '@/utils/supabaseClient';

export default function ResultsScreen() {
  const { responses, experienceRating, setExperienceRating, userInfo, resetAssessment } = useAssessment();
  const [showExperienceRating, setShowExperienceRating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chartRef = useRef(null);

  const competencyAverages = calculateAllAverages(competencies, responses);

  const chartData = competencies.map((comp) => ({
    label: comp.name,
    value: competencyAverages[comp.id] || 0,
  }));

  const benchmarkChartData = competencies.map((comp) => ({
    label: comp.name,
    value: benchmarkProfile[comp.id] || 4.0,
  }));

  const handleExperienceRating = (rating: number) => {
    setExperienceRating(rating);
    setShowExperienceRating(false);
  };

  const handleSubmit = async () => {
    if (!experienceRating) {
      Alert.alert('Rating Required', 'Please rate your experience before submitting');
      return;
    }

    if (!userInfo) {
      Alert.alert('Error', 'User information is missing');
      return;
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      Alert.alert(
        'Supabase Not Configured',
        'To send emails with assessment results, please enable Supabase:\n\n' +
        '1. Press the Supabase button in Natively\n' +
        '2. Connect to your Supabase project (create one at supabase.com if needed)\n' +
        '3. Create the assessments table and send-assessment-email Edge Function\n\n' +
        'See utils/supabaseSetup.ts for detailed instructions.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Still allow completing the assessment locally
              Alert.alert(
                'Assessment Complete',
                'Your assessment has been completed locally. Enable Supabase to send email reports.',
                [
                  {
                    text: 'Start New Assessment',
                    onPress: () => {
                      resetAssessment();
                      router.replace('/welcome');
                    },
                  },
                ]
              );
            },
          },
        ]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Capture the chart as base64 image
      console.log('Capturing chart...');
      const chartImageBase64 = await captureChartAsBase64(chartRef);
      
      if (!chartImageBase64) {
        console.warn('Failed to capture chart image, continuing without it');
      }

      // Save to database
      console.log('Saving assessment to database...');
      const saveResult = await saveAssessmentToDatabase({
        userInfo,
        competencyAverages,
        benchmarkProfile,
        experienceRating,
        chartImageBase64,
      });

      if (!saveResult.success) {
        console.error('Failed to save assessment:', saveResult.error);
      }

      // Send email
      console.log('Sending email...');
      const emailResult = await sendAssessmentEmail({
        userInfo,
        competencyAverages,
        benchmarkProfile,
        experienceRating,
        chartImageBase64,
      });

      setIsSubmitting(false);

      if (emailResult.success) {
        Alert.alert(
          'Assessment Complete',
          `Thank you for completing the assessment! Your results have been emailed to:\n\n• ${userInfo.email}\n• sven@impactwon.com`,
          [
            {
              text: 'Start New Assessment',
              onPress: () => {
                resetAssessment();
                router.replace('/welcome');
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Email Error',
          `Assessment saved but email failed: ${emailResult.error}\n\nPlease check your Supabase Edge Function configuration.`,
          [
            {
              text: 'OK',
              onPress: () => {
                resetAssessment();
                router.replace('/welcome');
              },
            },
          ]
        );
      }
    } catch (error: any) {
      setIsSubmitting(false);
      console.error('Error submitting assessment:', error);
      Alert.alert(
        'Submission Error',
        `An error occurred: ${error.message || 'Unknown error'}`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <TopBar />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={commonStyles.title}>Your Results</Text>
          <Text style={[commonStyles.text, styles.subtitle]}>
            {userInfo?.firstName} {userInfo?.surname}
          </Text>

          <View style={[commonStyles.panel, styles.chartContainer]} ref={chartRef} collapsable={false}>
            <RadarChart data={chartData} benchmarkData={benchmarkChartData} />
          </View>

          <Text style={[commonStyles.subtitle, styles.sectionTitle]}>
            Competency Breakdown
          </Text>

          {competencies.map((comp) => {
            const userScore = competencyAverages[comp.id] || 0;
            const benchmarkScore = benchmarkProfile[comp.id] || 4.0;
            const status = getCompetencyStatus(userScore, benchmarkScore);
            const statusColor = getStatusColor(status);

            return (
              <View key={comp.id} style={commonStyles.card}>
                <Text style={styles.competencyName}>{comp.name}</Text>
                <View style={styles.scoreRow}>
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>Your Score</Text>
                    <Text style={styles.scoreValue}>{userScore.toFixed(1)}</Text>
                  </View>
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>Benchmark</Text>
                    <Text style={styles.scoreValue}>{benchmarkScore.toFixed(1)}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusText}>{status}</Text>
                </View>
              </View>
            );
          })}

          {showExperienceRating && (
            <View style={[commonStyles.panelLilac, styles.experienceCard]}>
              <Text style={styles.experienceTitle}>
                How was your experience?
              </Text>
              <Text style={styles.experienceSubtitle}>
                Rate your experience with this assessment
              </Text>
              <RatingScale
                scale={5}
                value={experienceRating}
                onChange={handleExperienceRating}
              />
            </View>
          )}

          {!showExperienceRating && experienceRating && (
            <View style={[commonStyles.panelLilac, styles.experienceCard]}>
              <Text style={styles.experienceTitle}>
                Thank you for your feedback!
              </Text>
              <Text style={styles.experienceSubtitle}>
                You rated your experience: {experienceRating}/5
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[buttonStyles.primaryButton, styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color={colors.background} size="small" />
                <Text style={[buttonStyles.primaryButtonText, styles.buttonTextWithLoader]}>
                  Sending...
                </Text>
              </View>
            ) : (
              <Text style={buttonStyles.primaryButtonText}>
                Submit and Email My Report
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Your results will be emailed to {userInfo?.email} and sven@impactwon.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  chartContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    textAlign: 'left',
  },
  competencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.heading,
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primaryButton,
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    alignSelf: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.heading,
  },
  experienceCard: {
    marginTop: 24,
    marginBottom: 24,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.heading,
    textAlign: 'center',
    marginBottom: 8,
  },
  experienceSubtitle: {
    fontSize: 14,
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextWithLoader: {
    marginLeft: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.grey,
    textAlign: 'center',
    marginTop: 12,
  },
});
