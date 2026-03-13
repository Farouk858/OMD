import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors, typography, spacing, radius } from '../constants/theme';
import { APP_NAME, APP_TAGLINE } from '../constants/config';

const SUGGESTED_QUESTIONS = [
  { emoji: '📖', text: 'What does the Quran say about patience in hardship?' },
  { emoji: '🤲', text: 'How do I perform the five daily prayers?' },
  { emoji: '🌙', text: 'What is the significance of Ramadan?' },
  { emoji: '💚', text: 'How does Islam view forgiveness and repentance?' },
  { emoji: '🧠', text: 'What does Islam teach about mental health?' },
  { emoji: '✨', text: 'What are the 99 names of Allah?' },
];

interface Props {
  onSelectQuestion: (question: string) => void;
  onStartChat: () => void;
}

export function HomeScreen({ onSelectQuestion, onStartChat }: Props) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Logo */}
      <View style={styles.logoSection}>
        <Text style={styles.arabicLogo}>نور</Text>
        <Text style={styles.appName}>{APP_NAME}</Text>
        <Text style={styles.tagline}>{APP_TAGLINE}</Text>
      </View>

      {/* Welcome text */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>As-salamu alaykum</Text>
        <Text style={styles.welcomeText}>
          Ask me anything about Islam — from the meaning of a verse to guidance
          on daily life. All questions are welcome here, and everything you
          share is held with care.
        </Text>
      </View>

      {/* Suggested questions */}
      <View style={styles.suggestionsSection}>
        <Text style={styles.suggestionsLabel}>YOU MIGHT ASK ABOUT</Text>
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <TouchableOpacity
            key={i}
            style={styles.suggestionCard}
            onPress={() => onSelectQuestion(q.text)}
            activeOpacity={0.75}
          >
            <Text style={styles.suggestionEmoji}>{q.emoji}</Text>
            <Text style={styles.suggestionText}>{q.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Start chat button */}
      <TouchableOpacity style={styles.startBtn} onPress={onStartChat} activeOpacity={0.85}>
        <Text style={styles.startBtnText}>Ask your own question</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Noor provides guidance based on the Quran, Hadith, and Islamic
        scholarship. For critical matters, please consult a qualified scholar.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },

  // Logo
  logoSection: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xxl,
  },
  arabicLogo: {
    fontSize: 72,
    color: colors.accentGold,
    lineHeight: 88,
    marginBottom: spacing.sm,
  },
  appName: {
    fontSize: typography.fontSizeXl,
    fontWeight: typography.fontWeightSemibold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },

  // Welcome
  welcomeSection: {
    marginBottom: spacing.xxxl,
  },
  greeting: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightSemibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: typography.fontSizeMd,
    color: colors.textSecondary,
    lineHeight: typography.fontSizeMd * typography.lineHeightNormal,
    textAlign: 'center',
  },

  // Suggestions
  suggestionsSection: {
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  suggestionsLabel: {
    fontSize: typography.fontSizeXs,
    fontWeight: typography.fontWeightSemibold,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  suggestionEmoji: {
    fontSize: 20,
  },
  suggestionText: {
    flex: 1,
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    lineHeight: typography.fontSizeSm * typography.lineHeightNormal,
  },

  // Start button
  startBtn: {
    backgroundColor: colors.accentTeal,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  startBtnText: {
    color: colors.white,
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemibold,
  },

  // Disclaimer
  disclaimer: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: typography.fontSizeXs * 1.6,
    fontStyle: 'italic',
  },
});
