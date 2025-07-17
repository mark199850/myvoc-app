import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SIZES } from "@/constants/ui";
import { useTheme } from "@/hooks/useTheme";
import { WordDefinition } from "@/types/dictionary";
import { AccessibilityHelper, mobileStyles } from "@/utils/accessibility";
import { HapticFeedback } from "@/utils/haptics";
import { getMainDefinition, getPartOfSpeech } from "@/utils/wordUtils";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface WordCardProps {
  word: WordDefinition;
  onPress?: () => void;
}

function WordCardComponent({ word, onPress }: WordCardProps) {
  const router = useRouter();
  const theme = useTheme();

  const handlePress = async () => {
    await HapticFeedback.light();
    onPress ? onPress() : router.push(`/word/${word.id}`);
  };

  const accessibilityProps = AccessibilityHelper.createWordCardProps(
    word.word,
    getMainDefinition(word),
    getPartOfSpeech(word),
    !!word.audioUrl
  );

  return (
    <ThemedView style={[styles.card, { borderColor: theme.borderOpacity }]}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.wordText}>
          {word.word}
        </ThemedText>
        <View
          style={[
            styles.haveBeenLearnedBadge,
            { backgroundColor: theme.tint + "20" },
          ]}
          {...AccessibilityHelper.createButtonProps(getPartOfSpeech(word))}
        >
          <TouchableOpacity>
            <ThemedText
              style={[styles.haveBeenLearnedText, { color: theme.tint }]}
            >
              {getPartOfSpeech(word)}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {word.phonetic && (
        <ThemedText
          style={styles.phoneticText}
          {...AccessibilityHelper.createTextProps(
            `Pronunciation: ${word.phonetic}`
          )}
        >
          {word.phonetic}
        </ThemedText>
      )}

      <ThemedText
        style={styles.definitionText}
        numberOfLines={2}
        {...AccessibilityHelper.createTextProps(getMainDefinition(word))}
      >
        {getMainDefinition(word)}
      </ThemedText>

      <View style={styles.footer}>
        <ThemedText
          style={styles.dateText}
          {...AccessibilityHelper.createTextProps(
            `Added on ${new Date(word.dateAdded).toLocaleDateString()}`
          )}
        >
          Added {new Date(word.dateAdded).toLocaleDateString()}
        </ThemedText>
        {word.audioUrl && (
          <TouchableOpacity
            onPress={handlePress}
            style={[styles.container, mobileStyles.touchTarget]}
            {...accessibilityProps}
          >
            <ThemedText
              style={[styles.audioIndicator, { color: theme.tint }]}
              {...AccessibilityHelper.createTextProps(
                "Audio pronunciation available"
              )}
            >
              More details -&gt;
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}

// Memoize WordCard with custom comparison
export const WordCard = React.memo(
  WordCardComponent,
  (prevProps, nextProps) => {
    // Check if word object changed
    if (prevProps.word.id !== nextProps.word.id) {
      return false;
    }

    // Check if word content changed
    if (prevProps.word.word !== nextProps.word.word) {
      return false;
    }

    // Check if phonetic changed
    if (prevProps.word.phonetic !== nextProps.word.phonetic) {
      return false;
    }

    // Check if audioUrl changed
    if (prevProps.word.audioUrl !== nextProps.word.audioUrl) {
      return false;
    }

    // Check if definitions changed (shallow comparison)
    if (
      prevProps.word.definitions.length !== nextProps.word.definitions.length
    ) {
      return false;
    }

    // Check if onPress function changed
    if (prevProps.onPress !== nextProps.onPress) {
      return false;
    }

    // For performance, we'll assume definitions don't change unless the word ID changes
    return true;
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.SPACING.MD,
    paddingTop: SIZES.SPACING.MD,
  },
  card: {
    padding: SIZES.SPACING.LG,
    paddingBottom: SIZES.SPACING.XS,
    borderRadius: SIZES.BORDER_RADIUS.MEDIUM,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SIZES.SPACING.SM,
  },
  wordText: {
    fontSize: SIZES.FONT.XLARGE,
    flex: 1,
  },
  haveBeenLearnedBadge: {
    paddingHorizontal: SIZES.SPACING.SM,
    paddingVertical: SIZES.SPACING.XS,
    borderRadius: SIZES.BORDER_RADIUS.MEDIUM,
  },
  haveBeenLearnedText: {
    fontSize: SIZES.FONT.SMALL,
    fontWeight: "600",
  },
  phoneticText: {
    fontSize: SIZES.FONT.MEDIUM,
    fontStyle: "italic",
    opacity: 0.7,
    marginBottom: SIZES.SPACING.SM,
  },
  definitionText: {
    fontSize: SIZES.FONT.MEDIUM,
    lineHeight: 20,
    marginBottom: SIZES.SPACING.MD,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: SIZES.FONT.SMALL,
    opacity: 0.6,
  },
  audioIndicator: {
    fontSize: SIZES.FONT.LARGE,
  },
});
