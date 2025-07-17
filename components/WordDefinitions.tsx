import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { WordDefinition } from '@/types/dictionary';

interface WordDefinitionsProps {
  word: WordDefinition;
}

export function WordDefinitions({ word }: WordDefinitionsProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      {word.definitions.map((definition, defIndex) => (
        <DefinitionSection 
          key={defIndex} 
          definition={definition} 
          theme={theme}
        />
      ))}
    </ThemedView>
  );
}

interface DefinitionSectionProps {
  definition: WordDefinition['definitions'][0];
  theme: any;
}

function DefinitionSection({ definition, theme }: DefinitionSectionProps) {
  return (
    <ThemedView style={styles.definitionSection}>
      <View
        style={[
          styles.partOfSpeechBadge,
          { backgroundColor: theme.tint + '20' },
        ]}
      >
        <ThemedText
          style={[styles.partOfSpeechText, { color: theme.tint }]}
        >
          {definition.partOfSpeech}
        </ThemedText>
      </View>

      {definition.meanings.map((meaning, meaningIndex) => (
        <MeaningItem
          key={meaningIndex}
          meaning={meaning}
          meaningIndex={meaningIndex}
          theme={theme}
        />
      ))}
    </ThemedView>
  );
}

interface MeaningItemProps {
  meaning: WordDefinition['definitions'][0]['meanings'][0];
  meaningIndex: number;
  theme: any;
}

function MeaningItem({ meaning, meaningIndex, theme }: MeaningItemProps) {
  return (
    <ThemedView style={styles.meaningContainer}>
      <ThemedText style={styles.definitionText}>
        {meaningIndex + 1}. {meaning.definition}
      </ThemedText>

      {meaning.example && (
        <ThemedView
          style={[
            styles.exampleContainer,
            { borderLeftColor: theme.tint },
          ]}
        >
          <ThemedText style={styles.exampleText}>
            &quot;{meaning.example}&quot;
          </ThemedText>
        </ThemedView>
      )}

      {meaning.synonyms && meaning.synonyms.length > 0 && (
        <RelatedWords
          label="Synonyms"
          words={meaning.synonyms}
        />
      )}

      {meaning.antonyms && meaning.antonyms.length > 0 && (
        <RelatedWords
          label="Antonyms"
          words={meaning.antonyms}
        />
      )}
    </ThemedView>
  );
}

interface RelatedWordsProps {
  label: string;
  words: string[];
}

function RelatedWords({ label, words }: RelatedWordsProps) {
  return (
    <ThemedView style={styles.relatedWordsContainer}>
      <ThemedText style={styles.relatedWordsLabel}>
        {label}:
      </ThemedText>
      <ThemedText style={styles.relatedWordsText}>
        {words.join(', ')}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  definitionSection: {
    marginBottom: 24,
  },
  partOfSpeechBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  partOfSpeechText: {
    fontSize: 14,
    fontWeight: '600',
  },
  meaningContainer: {
    marginBottom: 16,
  },
  definitionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  exampleContainer: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    marginVertical: 8,
  },
  exampleText: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  relatedWordsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  relatedWordsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  relatedWordsText: {
    fontSize: 14,
    flex: 1,
  },
});