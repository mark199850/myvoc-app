import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { WordCard } from '@/components/WordCard';
import { useExpansionState } from '@/hooks/useExpansionState';
import { useTheme } from '@/hooks/useTheme';
import { Language, WordCategory, WordDefinition } from '@/types/dictionary';
import { AccessibilityHelper, mobileStyles } from '@/utils/accessibility';
import { HapticFeedback } from '@/utils/haptics';
import { capitalizeFirst } from '@/utils/languageUtils';
import { getTotalWordCount } from '@/utils/wordUtils';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface LanguageSectionProps {
  language: Language;
  wordsByCategory: WordCategory;
  onWordPress?: (word: WordDefinition) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function LanguageSectionComponent({ 
  language, 
  wordsByCategory, 
  onWordPress, 
  isExpanded, 
  onToggleExpand 
}: LanguageSectionProps) {
  const theme = useTheme();
  const { isExpanded: isCategoryExpanded, toggleItem: toggleCategory } = useExpansionState();

  const handleLanguageToggle = async () => {
    await HapticFeedback.light();
    onToggleExpand();
  };

  const handleCategoryToggle = async (category: string) => {
    await HapticFeedback.light();
    toggleCategory(category);
  };

  const totalWords = getTotalWordCount(wordsByCategory);

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity 
        style={[styles.languageHeader, { borderBottomColor: theme.borderOpacity }, mobileStyles.touchTarget]}
        onPress={handleLanguageToggle}
        {...AccessibilityHelper.createExpandableProps(
          `${language.name} language section`,
          isExpanded,
          `${totalWords} words available. ${isExpanded ? 'Collapse' : 'Expand'} to ${isExpanded ? 'hide' : 'show'} word categories.`
        )}
      >
        <View style={styles.languageInfo}>
          <ThemedText style={styles.flag}>{language.flag}</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.languageName}>
            {language.name}
          </ThemedText>
          <ThemedText style={styles.wordCount}>
            ({totalWords} words)
          </ThemedText>
        </View>
        <IconSymbol 
          name={isExpanded ? "chevron.up" : "chevron.down"} 
          size={20} 
          color={theme.tint} 
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.categoriesContainer}>
          {Object.entries(wordsByCategory).map(([category, words]) => (
            <View key={category} style={styles.categoryContainer}>
              <TouchableOpacity 
                style={[styles.categoryHeader, mobileStyles.touchTarget]}
                onPress={() => handleCategoryToggle(category)}
                {...AccessibilityHelper.createExpandableProps(
                  `${capitalizeFirst(category)} category`,
                  isCategoryExpanded(category),
                  `${words.length} ${category} words. ${isCategoryExpanded(category) ? 'Collapse' : 'Expand'} to ${isCategoryExpanded(category) ? 'hide' : 'show'} word list.`
                )}
              >
                <ThemedText type="subtitle" style={styles.categoryTitle}>
                  {capitalizeFirst(category)}
                </ThemedText>
                <View style={styles.categoryInfo}>
                  <ThemedText style={styles.categoryCount}>
                    {words.length}
                  </ThemedText>
                  <IconSymbol 
                    name={isCategoryExpanded(category) ? "chevron.up" : "chevron.down"} 
                    size={16} 
                    color={theme.tint} 
                  />
                </View>
              </TouchableOpacity>

              {isCategoryExpanded(category) && (
                <View style={styles.wordsContainer}>
                  {words.map((word) => (
                    <WordCard 
                      key={word.id} 
                      word={word} 
                      onPress={onWordPress ? () => onWordPress(word) : undefined} 
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

// Memoize the component with custom comparison function
export const LanguageSection = React.memo(LanguageSectionComponent, (prevProps, nextProps) => {
  if (prevProps.language.code !== nextProps.language.code) {
    return false;
  }
  
  if (prevProps.isExpanded !== nextProps.isExpanded) {
    return false;
  }
  
  if (prevProps.onToggleExpand !== nextProps.onToggleExpand) {
    return false;
  }
  
  if (prevProps.onWordPress !== nextProps.onWordPress) {
    return false;
  }
  
  const prevCategories = Object.keys(prevProps.wordsByCategory);
  const nextCategories = Object.keys(nextProps.wordsByCategory);
  
  if (prevCategories.length !== nextCategories.length) {
    return false;
  }
  
  for (const category of prevCategories) {
    if (!nextProps.wordsByCategory[category]) {
      return false;
    }
    
    const prevWords = prevProps.wordsByCategory[category];
    const nextWords = nextProps.wordsByCategory[category];
    
    if (prevWords.length !== nextWords.length) {
      return false;
    }
    
    for (let i = 0; i < prevWords.length; i++) {
      if (prevWords[i].id !== nextWords[i].id) {
        return false;
      }
    }
  }
  
  return true;
});