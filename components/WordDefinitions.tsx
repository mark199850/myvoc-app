import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Meaning, WordDefinition } from "@/types/dictionary";
import React from "react";
import { StyleSheet, View } from "react-native";

interface WordDefinitionsProps {
  word: WordDefinition;
}

export function WordMeanings({ word }: WordDefinitionsProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      {word.meanings.map((meaning, mIndex) => {
        return <MeaningSection key={mIndex} meaning={meaning} theme={theme} />;
      })}
    </ThemedView>
  );
}

interface MeaningSectionProps {
  meaning: Meaning;
  theme: any;
}

function MeaningSection({ meaning, theme }: MeaningSectionProps) {
  return (
    <ThemedView style={styles.meaningSection}>
      <View
        style={[
          styles.partOfSpeechBadge,
          { backgroundColor: theme.tint + "20" },
        ]}
      >
        <ThemedText style={[styles.partOfSpeechText, { color: theme.tint }]}>
          {meaning.partOfSpeech}
        </ThemedText>
      </View>

      {meaning.definitions.map((definition, dIndex) => (
        <DefinitionItem
          key={dIndex}
          definition={definition}
          definitionIndex={dIndex}
          theme={theme}
        />
      ))}
    </ThemedView>
  );
}

interface DefinitionItemProps {
  definition: string;
  definitionIndex: number;
  theme: any;
}

function DefinitionItem({
  definition,
  definitionIndex,
  theme,
}: DefinitionItemProps) {
  return (
    <ThemedView style={styles.definitionContainer}>
      <ThemedText style={styles.definitionText}>
        {definitionIndex + 1}. {definition}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  meaningSection: {
    marginBottom: 24,
  },
  partOfSpeechBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  partOfSpeechText: {
    fontSize: 14,
    fontWeight: "600",
  },
  definitionContainer: {
    marginBottom: 16,
  },
  definitionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
});
