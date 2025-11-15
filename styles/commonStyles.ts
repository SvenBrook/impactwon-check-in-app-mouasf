
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  background: '#FFFDF9',        // Off White
  heading: '#1F2B73',           // Focus Blue
  primaryText: '#1F2B73',       // Focus Blue
  primaryButton: '#0D95FF',     // Clarity Blue
  positiveTags: '#A6E0C5',      // Insight Teal
  attentionTags: '#FF810C',     // Beacon Orange
  skyBlue: '#C1E6FF',           // Sky Blue
  lilac: '#E3D8FF',             // Reliable Lilac
  text: '#1F2B73',              // Focus Blue for text
  white: '#FFFFFF',
  grey: '#666666',
  // Level-specific brand colors
  level1: '#C1E6FF',            // Sky Blue
  level2: '#A6E0C5',            // Insight Teal
  level3: '#E3D8FF',            // Reliable Lilac
  level4: '#FF810C',            // Beacon Orange
  level5: '#0D95FF',            // Clarity Blue
};

export const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primaryButton,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.skyBlue,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.heading,
    fontSize: 16,
    fontWeight: '600',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.heading,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.heading,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.primaryText,
    marginBottom: 8,
    lineHeight: 24,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 20,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  panel: {
    backgroundColor: colors.skyBlue,
    borderRadius: 25,
    padding: 20,
    marginVertical: 8,
    width: '100%',
  },
  panelLilac: {
    backgroundColor: colors.lilac,
    borderRadius: 25,
    padding: 20,
    marginVertical: 8,
    width: '100%',
  },
  topBar: {
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.primaryText,
    borderWidth: 1,
    borderColor: colors.skyBlue,
    marginBottom: 12,
  },
});
