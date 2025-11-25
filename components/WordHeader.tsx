import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AudioButton } from "@/components/ui/AudioButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/hooks/useTheme";
import { WordDefinition } from "@/types/dictionary";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface WordHeaderProps {
  word: WordDefinition;
  onDelete: () => void;
  onPlayAudio: () => void;
  audioLoading?: boolean;
}

export function WordHeader({
  word,
  onDelete,
  onPlayAudio,
  audioLoading = false,
}: WordHeaderProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.wordHeader}>
        <ThemedText type="title" style={styles.wordTitle}>
          {word.word}
        </ThemedText>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <IconSymbol name="trash" size={24} color="#FF4444" />
        </TouchableOpacity>
      </ThemedView>

      {word.pronunciation.default.ipa && (
        <ThemedView style={styles.phoneticContainer}>
          <ThemedText style={styles.phoneticText}>{word.pronunciation.default.ipa}</ThemedText>
          {word.pronunciation.default.audioUrl && (
            <AudioButton
              onPress={onPlayAudio}
              loading={audioLoading}
              style={styles.audioButton}
            />
          )}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  wordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  wordTitle: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  phoneticContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  phoneticText: {
    fontSize: 16,
    fontStyle: "italic",
    opacity: 0.8,
    flex: 1,
  },
  audioButton: {
    marginLeft: 12,
  },
});
