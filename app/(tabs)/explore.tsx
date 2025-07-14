import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LanguageSection } from '@/components/LanguageSection';
import { StorageService } from '@/services/storageService';
import { Language, UserWordList, WordDefinition } from '@/types/dictionary';
import { useFocusEffect } from '@react-navigation/native';

export default function MyWordsScreen() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [userWords, setUserWords] = useState<UserWordList>({});
  const [expandedLanguages, setExpandedLanguages] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [userLanguages, words] = await Promise.all([
        StorageService.getUserLanguages(),
        StorageService.getUserWords()
      ]);
      setLanguages(userLanguages);
      setUserWords(words);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const toggleLanguage = (languageCode: string) => {
    const newExpanded = new Set(expandedLanguages);
    if (newExpanded.has(languageCode)) {
      newExpanded.delete(languageCode);
    } else {
      newExpanded.add(languageCode);
    }
    setExpandedLanguages(newExpanded);
  };

  const handleWordPress = (_word: WordDefinition) => {
    // WordCard will handle navigation automatically
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.centerContainer}>
          <ThemedText>Loading your words...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (languages.length === 0) {
    return (
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ThemedView style={styles.emptyContainer}>
          <ThemedText type="title" style={styles.emptyTitle}>
            No words yet!
          </ThemedText>
          <ThemedText style={styles.emptyText}>
            Start building your vocabulary by searching for words in the Search tab.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.content}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="title" style={styles.title}>
            My Words
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Your vocabulary collection organized by language
          </ThemedText>
        </ThemedView>

        {languages.map((language) => (
          <LanguageSection
            key={language.code}
            language={language}
            wordsByCategory={userWords[language.code] || {}}
            onWordPress={handleWordPress}
            isExpanded={expandedLanguages.has(language.code)}
            onToggleExpand={() => toggleLanguage(language.code)}
          />
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.8,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
});
