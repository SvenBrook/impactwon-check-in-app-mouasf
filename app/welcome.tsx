
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles, colors, buttonStyles } from '@/styles/commonStyles';
import TopBar from '@/components/TopBar';
import { useAssessment } from '@/contexts/AssessmentContext';

export default function WelcomeScreen() {
  const { setUserInfo } = useAssessment();
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = () => {
    if (!firstName.trim()) {
      Alert.alert('Required Field', 'Please enter your first name');
      return;
    }
    if (!surname.trim()) {
      Alert.alert('Required Field', 'Please enter your surname');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Required Field', 'Please enter your email address');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setUserInfo({
      firstName: firstName.trim(),
      surname: surname.trim(),
      email: email.trim(),
      mobile: mobile.trim() || undefined,
    });

    router.push('/competency/0');
  };

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <TopBar />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={commonStyles.title}>
              ImpactWon Client Expert{'\n'}Check-in
            </Text>
            <Text style={[commonStyles.text, styles.description]}>
              Welcome! This assessment will help you evaluate your Client Expert Competencies
              using the ImpactWon framework.
            </Text>

            <View style={[commonStyles.panel, styles.infoPanel]}>
              <Text style={styles.infoBullet}>• 7 competency areas</Text>
              <Text style={styles.infoBullet}>• 35 questions total</Text>
              <Text style={styles.infoBullet}>• Takes approximately 10-15 minutes</Text>
              <Text style={styles.infoBullet}>• Results emailed to you upon completion</Text>
            </View>

            <View style={[commonStyles.card, styles.formCard]}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={commonStyles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor={colors.grey}
                autoCapitalize="words"
              />

              <Text style={styles.label}>Surname *</Text>
              <TextInput
                style={commonStyles.input}
                value={surname}
                onChangeText={setSurname}
                placeholder="Enter your surname"
                placeholderTextColor={colors.grey}
                autoCapitalize="words"
              />

              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={commonStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.grey}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Mobile (Optional)</Text>
              <TextInput
                style={commonStyles.input}
                value={mobile}
                onChangeText={setMobile}
                placeholder="Enter your mobile number"
                placeholderTextColor={colors.grey}
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity
              style={[buttonStyles.primaryButton, styles.button]}
              onPress={handleContinue}
            >
              <Text style={buttonStyles.primaryButtonText}>Start Assessment</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  description: {
    textAlign: 'center',
    marginBottom: 20,
  },
  infoPanel: {
    marginBottom: 24,
  },
  infoBullet: {
    fontSize: 14,
    color: colors.heading,
    marginBottom: 8,
    fontWeight: '500',
  },
  formCard: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.heading,
    marginBottom: 6,
    marginTop: 4,
  },
  button: {
    width: '100%',
  },
});
