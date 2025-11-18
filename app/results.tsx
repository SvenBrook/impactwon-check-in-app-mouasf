
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
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
import { sendAssessmentEmail, saveAssessmentToDatabase } from '@/utils/emailService';

export default function ResultsScreen() {
  const { responses, experienceRating, setExperienceRating, userInfo, resetAssessment } = useAssessment();
  const [showExperienceRating, setShowExperienceRating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

    try {
      // Save assessment to database
      console.log('Saving assessment to database...');
      const saveResult = await saveAssessmentToDatabase({
        userInfo,
        competencyAverages,
        benchmarkProfile,
        experienceRating,
        chartImageBase64: null, // We'll add chart capture later if needed
      });

      if (!saveResult.success) {
        console.error('Failed to save assessment:', saveResult.error);
        Alert.alert(
          'Warning',
          `Assessment could not be saved: ${saveResult.error}. Would you still like to send the email?`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setIsSubmitting(false) },
            { text: 'Send Email', onPress: () => sendEmail() },
          ]
        );
        return;
      }

      console.log('Assessment saved successfully');
      await sendEmail();
    } catch (error: any) {
      console.error('Error submitting assessment:', error);
      setIsSubmitting(false);
      Alert.alert('Error', `An unexpected error occurred: ${error.message}`);
    }
  };

  const sendEmail = async () => {
    if (!userInfo) return;

    try {
      console.log('Sending assessment email...');
      const emailResult = await sendAssessmentEmail({
        userInfo,
        competencyAverages,
        benchmarkProfile,
        experienceRating: experienceRating!,
        chartImageBase64: null, // We'll add chart capture later if needed
      });

      setIsSubmitting(false);

      if (!emailResult.success) {
        console.error('Failed to send email:', emailResult.error);
        Alert.alert(
          'Email Error',
          `Your assessment was saved, but the email could not be sent: ${emailResult.error}`,
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
        return;
      }

      console.log('Email sent successfully');
      const recipients = emailResult.recipients || [userInfo.email, 'sven@impactwon.com'];
      const recipientList = recipients.join(', ');
      
      Alert.alert(
        'Assessment Complete',
        `Thank you for completing the assessment!\n\nYour results have been saved and emailed to:\n${recipientList}`,
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
    } catch (error: any) {
      console.error('Error sending email:', error);
      setIsSubmitting(false);
      Alert.alert('Error', `Failed to send email: ${error.message}`);
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

          <View style={[commonStyles.panel, styles.chartContainer]}>
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
            style={[
              buttonStyles.primaryButton,
              styles.button,
              isSubmitting && styles.buttonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#FFFDF9" size="small" />
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
            Your results will be emailed to {userInfo?.email} and Sven (sven@impactwon.com)
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
    marginLeft: 10,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.grey,
    textAlign: 'center',
    marginTop: 12,
  },
});
