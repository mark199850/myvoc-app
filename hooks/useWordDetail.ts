import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { StorageService } from '@/services/storageService';
import { WordDefinition } from '@/types/dictionary';
import { findWordById } from '@/utils/wordUtils';

export function useWordDetail(wordId: string) {
  const [word, setWord] = useState<WordDefinition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWord();
  }, [wordId]);

  const loadWord = async () => {
    try {
      const userWords = await StorageService.getUserWords();
      const foundWord = findWordById(userWords, wordId);
      setWord(foundWord);
    } catch (error) {
      console.error('Error loading word:', error);
      Alert.alert('Error', 'Failed to load word details');
    } finally {
      setLoading(false);
    }
  };

  return {
    word,
    loading,
    reload: loadWord,
  };
}