import React from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { EmptyState } from '@/components/ui/EmptyState';
import { Section } from '@/components/ui/Section';
import { LanguageSection } from '@/components/LanguageSection';
import { useUserWords } from '@/hooks/useUserWords';
import { useExpansionState } from '@/hooks/useExpansionState';
import { WordDefinition } from '@/types/dictionary';
import { SIZES } from '@/constants/ui';

export default function MyWordsScreen() {
  const { languages, userWords, loading, refreshing, refresh } = useUserWords();
  const { isExpanded: isLanguageExpanded, toggleItem: toggleLanguage } = useExpansionState();


  if (loading) {
    return <LoadingScreen message="Loading your words..." />;
  }

  if (languages.length === 0) {
    return (
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <EmptyState
          title="No words yet!"
          message="Start building your vocabulary by searching for words in the Search tab."
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }
    >
      <ThemedView style={styles.content}>
        <Section
          title="My Words"
          subtitle="Your vocabulary collection organized by language"
        >
          {languages.map((language) => (
            <LanguageSection
              key={language.code}
              language={language}
              wordsByCategory={userWords[language.code] || {}}
              isExpanded={isLanguageExpanded(language.code)}
              onToggleExpand={() => toggleLanguage(language.code)}
            />
          ))}
        </Section>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SIZES.SPACING.XL,
  },
});
