import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { WordCard } from '@/components/WordCard';
import { Language, WordDefinition, WordCategory } from '@/types/dictionary';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface LanguageSectionProps {
  language: Language;
  wordsByCategory: WordCategory;
  onWordPress: (word: WordDefinition) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function LanguageSection({ 
  language, 
  wordsByCategory, 
  onWordPress, 
  isExpanded, 
  onToggleExpand 
}: LanguageSectionProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'text');

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getTotalWords = () => {
    return Object.values(wordsByCategory).reduce((total, words) => total + words.length, 0);
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity 
        style={[styles.languageHeader, { borderBottomColor: borderColor + '30' }]}
        onPress={onToggleExpand}
      >
        <View style={styles.languageInfo}>
          <ThemedText style={styles.flag}>{language.flag}</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.languageName}>
            {language.name}
          </ThemedText>
          <ThemedText style={styles.wordCount}>
            ({getTotalWords()} words)
          </ThemedText>
        </View>
        <IconSymbol 
          name={isExpanded ? "chevron.up" : "chevron.down"} 
          size={20} 
          color={tintColor} 
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.categoriesContainer}>
          {Object.entries(wordsByCategory).map(([category, words]) => (
            <View key={category} style={styles.categoryContainer}>
              <TouchableOpacity 
                style={styles.categoryHeader}
                onPress={() => toggleCategory(category)}
              >
                <ThemedText type="subtitle" style={styles.categoryTitle}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </ThemedText>
                <View style={styles.categoryInfo}>
                  <ThemedText style={styles.categoryCount}>
                    {words.length}
                  </ThemedText>
                  <IconSymbol 
                    name={expandedCategories.has(category) ? "chevron.up" : "chevron.down"} 
                    size={16} 
                    color={tintColor} 
                  />
                </View>
              </TouchableOpacity>

              {expandedCategories.has(category) && (
                <View style={styles.wordsContainer}>
                  {words.map((word) => (
                    <WordCard 
                      key={word.id} 
                      word={word} 
                      onPress={() => onWordPress(word)} 
                    />
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  languageName: {
    fontSize: 18,
    marginRight: 8,
  },
  wordCount: {
    opacity: 0.7,
    fontSize: 14,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryContainer: {
    marginTop: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryCount: {
    fontSize: 14,
    opacity: 0.7,
    marginRight: 8,
  },
  wordsContainer: {
    marginTop: 8,
  },
});