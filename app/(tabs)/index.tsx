import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SearchInput } from '@/components/SearchInput';
import { DictionaryService } from '@/services/dictionaryApi';
import { StorageService } from '@/services/storageService';

export default function HomeScreen() {
  const [, setLoading] = useState(false);

  const handleWordSelect = async (word: string) => {
    setLoading(true);
    try {
      const definition = await DictionaryService.getWordDefinition(word);
      
      if (definition) {
        await StorageService.addWord(definition);
        Alert.alert(
          'Word Added!',
          `&ldquo;${definition.word}&rdquo; has been added to your vocabulary list.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Word Not Found',
          `Sorry, we could not find a definition for &ldquo;${word}&rdquo;.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error adding word:', error);
      Alert.alert(
        'Error',
        'Something went wrong while adding the word. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="title" style={styles.title}>MyDict</ThemedText>
          <ThemedText style={styles.subtitle}>
            Discover new words and build your vocabulary
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.searchContainer}>
          <SearchInput
            onWordSelect={handleWordSelect}
            placeholder="Search for a word..."
          />
        </ThemedView>

        <ThemedView style={styles.instructionsContainer}>
          <ThemedText type="subtitle" style={styles.instructionTitle}>
            How to use MyDict:
          </ThemedText>
          <ThemedView style={styles.stepContainer}>
            <ThemedText style={styles.stepNumber}>1.</ThemedText>
            <ThemedText style={styles.stepText}>
              Type a word in the search box above
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText style={styles.stepNumber}>2.</ThemedText>
            <ThemedText style={styles.stepText}>
              Select from autocomplete suggestions or press search
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.stepContainer}>
            <ThemedText style={styles.stepNumber}>3.</ThemedText>
            <ThemedText style={styles.stepText}>
              View your saved words in the &ldquo;My Words&rdquo; tab
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    fontSize: 16,
  },
  searchContainer: {
    marginBottom: 40,
  },
  instructionsContainer: {
    marginTop: 20,
  },
  instructionTitle: {
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 20,
  },
  stepText: {
    flex: 1,
    lineHeight: 20,
  },
});
