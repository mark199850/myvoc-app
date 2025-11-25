import { SearchInput } from '@/components/SearchInput';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Section } from '@/components/ui/Section';
import { SIZES } from '@/constants/ui';
import { useWordOperations } from '@/hooks/useWordOperations';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const { addWord, loading } = useWordOperations();

  const handleWordSelect = async (word: string) => {
    await addWord(word);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <Section
          title="MyDict"
          subtitle="Discover new words and build your vocabulary"
        >
          <ThemedView style={styles.searchContainer}>
            <SearchInput
              onWordSelect={handleWordSelect}
              placeholder="Search for a word..."
              disabled={loading}
            />
            {loading && (
              <ThemedView style={styles.loadingContainer}>
                <ThemedText style={styles.loadingText}>Adding word...</ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </Section>

        <Section title="How to use MyDict:">
          <InstructionStep
            number={1}
            text="Type a word in the search box above"
          />
          <InstructionStep
            number={2}
            text="Select from autocomplete suggestions or press search"
          />
          <InstructionStep
            number={3}
            text="View your saved words in the &ldquo;My Words&rdquo; tab"
          />
        </Section>
      </ThemedView>
    </ScrollView>
  );
}

interface InstructionStepProps {
  number: number;
  text: string;
}

function InstructionStep({ number, text }: InstructionStepProps) {
  return (
    <ThemedView style={styles.stepContainer}>
      <ThemedText style={styles.stepNumber}>{number}.</ThemedText>
      <ThemedText style={styles.stepText}>{text}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.SPACING.XL,
  },
  searchContainer: {
    marginBottom: SIZES.SPACING.XL,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.SPACING.MD,
  },
  stepNumber: {
    fontWeight: 'bold',
    marginRight: SIZES.SPACING.SM,
    minWidth: SIZES.SPACING.XL,
  },
  stepText: {
    flex: 1,
    lineHeight: 20,
  },
  loadingContainer: {
    marginTop: SIZES.SPACING.SM,
    alignItems: 'center',
  },
  loadingText: {
    opacity: 0.7,
    fontSize: SIZES.FONT.SMALL,
  },
});
