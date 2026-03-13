import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Message } from '../hooks/useChat';
import { colors, typography, spacing, radius } from '../constants/theme';

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const time = message.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isUser) {
    return (
      <View style={styles.userRow}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.content}</Text>
        </View>
        <Text style={styles.timestamp}>{time}</Text>
      </View>
    );
  }

  // Assistant message
  if (message.isLoading) {
    return (
      <View style={styles.assistantRow}>
        <Avatar />
        <View style={styles.assistantBubble}>
          <View style={styles.loadingDots}>
            <ActivityIndicator size="small" color={colors.accentTeal} />
          </View>
        </View>
      </View>
    );
  }

  // Parse the response to separate main content from source attribution
  const { mainContent, sourceSection } = parseResponse(message.content);

  return (
    <View style={styles.assistantRow}>
      <Avatar />
      <View style={styles.assistantBody}>
        <View style={styles.assistantBubble}>
          <FormattedText text={mainContent} />
          {sourceSection && (
            <View style={styles.sourceSection}>
              <View style={styles.sourceDivider} />
              <Text style={styles.sourceLabel}>SOURCE</Text>
              <FormattedText text={sourceSection} style={styles.sourceText} />
            </View>
          )}
        </View>
        <Text style={styles.timestamp}>{time}</Text>
      </View>
    </View>
  );
}

function Avatar() {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>ن</Text>
    </View>
  );
}

/**
 * Very simple inline formatter that handles **bold**, *italic*, and plain text.
 * For a production app, swap in react-native-markdown-display.
 */
function FormattedText({ text, style }: { text: string; style?: object }) {
  if (!text) return null;

  // Split text into lines and render each
  const lines = text.split('\n');

  return (
    <View>
      {lines.map((line, lineIndex) => {
        // Skip empty consecutive blank lines
        if (line.trim() === '' && lineIndex > 0 && lines[lineIndex - 1].trim() === '') {
          return null;
        }

        // Horizontal rule
        if (line.trim() === '---') {
          return <View key={lineIndex} style={styles.hr} />;
        }

        // Header lines (## or ###)
        if (line.startsWith('### ')) {
          return (
            <Text key={lineIndex} style={[styles.h3, style]}>
              {formatInline(line.slice(4))}
            </Text>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <Text key={lineIndex} style={[styles.h2, style]}>
              {formatInline(line.slice(3))}
            </Text>
          );
        }

        // Bullet list
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <View key={lineIndex} style={styles.bulletRow}>
              <Text style={[styles.bullet, style]}>•</Text>
              <Text style={[styles.bodyText, styles.bulletText, style]}>
                {formatInline(line.slice(2))}
              </Text>
            </View>
          );
        }

        // Regular paragraph
        if (line.trim() === '') {
          return <View key={lineIndex} style={styles.paragraphGap} />;
        }

        return (
          <Text key={lineIndex} style={[styles.bodyText, style]}>
            {formatInline(line)}
          </Text>
        );
      })}
    </View>
  );
}

/**
 * Convert **bold** and *italic* markdown to React Native Text spans.
 */
function formatInline(text: string): React.ReactNode {
  // Split on **bold** and *italic* markers
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Text key={i} style={styles.bold}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <Text key={i} style={styles.italic}>
          {part.slice(1, -1)}
        </Text>
      );
    }
    return part;
  });
}

/**
 * Separate main response from the trailing source attribution block.
 */
function parseResponse(text: string): {
  mainContent: string;
  sourceSection?: string;
} {
  // Look for the --- separator followed by **Source:**
  const sourceMatch = text.match(/\n---\n(\*\*Source:\*\*.*)/s);
  if (sourceMatch) {
    const splitIndex = text.indexOf('\n---\n' + sourceMatch[1]);
    return {
      mainContent: text.slice(0, splitIndex).trim(),
      sourceSection: sourceMatch[1].trim(),
    };
  }
  return { mainContent: text };
}

const styles = StyleSheet.create({
  // User message
  userRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  userBubble: {
    backgroundColor: colors.userBubble,
    borderColor: colors.userBubbleBorder,
    borderWidth: 1,
    borderRadius: radius.lg,
    borderBottomRightRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    maxWidth: '80%',
  },
  userText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizeMd,
    lineHeight: typography.fontSizeMd * typography.lineHeightNormal,
  },

  // Assistant message
  assistantRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'flex-start',
  },
  assistantBody: {
    flex: 1,
    gap: spacing.xs,
  },
  assistantBubble: {
    backgroundColor: colors.noorBubble,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    borderTopLeftRadius: radius.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  // Avatar
  avatar: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.accentGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  avatarText: {
    color: colors.bgPrimary,
    fontSize: 18,
    fontWeight: typography.fontWeightBold,
    lineHeight: 22,
  },

  // Timestamp
  timestamp: {
    fontSize: typography.fontSizeXs,
    color: colors.textMuted,
    paddingHorizontal: spacing.xs,
  },

  // Loading
  loadingDots: {
    paddingVertical: spacing.xs,
  },

  // Source section
  sourceSection: {
    marginTop: spacing.md,
  },
  sourceDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  sourceLabel: {
    fontSize: typography.fontSizeXs,
    fontWeight: typography.fontWeightSemibold,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  sourceText: {
    color: colors.textSecondary,
    fontSize: typography.fontSizeSm,
  },

  // Text formatting
  bodyText: {
    color: colors.textPrimary,
    fontSize: typography.fontSizeMd,
    lineHeight: typography.fontSizeMd * typography.lineHeightNormal,
  },
  bold: {
    fontWeight: typography.fontWeightSemibold,
    color: colors.accentGoldLight,
  },
  italic: {
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
  h2: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightSemibold,
    color: colors.accentGoldLight,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  h3: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightSemibold,
    color: colors.accentGoldLight,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: 2,
  },
  bullet: {
    color: colors.accentTeal,
    fontSize: typography.fontSizeMd,
    lineHeight: typography.fontSizeMd * typography.lineHeightNormal,
  },
  bulletText: {
    flex: 1,
  },
  hr: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  paragraphGap: {
    height: spacing.sm,
  },
});
