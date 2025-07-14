import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DictionaryService } from '@/services/dictionaryApi';
import { SearchSuggestion } from '@/types/dictionary';

interface SearchInputProps {
  onWordSelect: (word: string) => void;
  placeholder?: string;
  language?: string;
}

export function SearchInput({ onWordSelect, placeholder = "Search for words...", language = 'en' }: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const borderColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  useEffect(() => {
    const searchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      try {
        const results = await DictionaryService.searchSuggestions(query, language);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchSuggestions, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [query, language]);

  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.word);
    setShowSuggestions(false);
    onWordSelect(suggestion.word);
  };

  const handleSubmit = () => {
    if (query.trim()) {
      setShowSuggestions(false);
      onWordSelect(query.trim());
    }
  };

  const renderSuggestion = ({ item }: { item: SearchSuggestion }) => (
    <TouchableOpacity
      style={[styles.suggestionItem, { borderBottomColor: borderColor }]}
      onPress={() => handleSuggestionPress(item)}
    >
      <View style={styles.suggestionContent}>
        <ThemedText style={styles.suggestionWord}>{item.word}</ThemedText>
        {item.phonetic && (
          <ThemedText style={styles.phoneticText}>{item.phonetic}</ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { borderColor, backgroundColor }]}>
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={textColor + '80'}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {loading && <ActivityIndicator size="small" style={styles.loadingIndicator} />}
      </View>
      
      {showSuggestions && suggestions.length > 0 && (
        <ThemedView style={[styles.suggestionsContainer, { borderColor }]}>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item, index) => `${item.word}-${index}`}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
          />
        </ThemedView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  suggestionsContainer: {
    borderWidth: 1,
    borderRadius: 12,
    maxHeight: 200,
    overflow: 'hidden',
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  suggestionWord: {
    fontSize: 16,
    fontWeight: '500',
  },
  phoneticText: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
  },
});