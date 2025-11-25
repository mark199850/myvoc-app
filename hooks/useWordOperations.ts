import { useCallback } from 'react';
import { Alert } from 'react-native';
import { DictionaryService } from '@/services/dictionaryApi';
import { WordService } from '@/services/wordService';
import { WordDefinition } from '@/types/dictionary';
import { useAsyncOperation } from './useAsyncOperation';
import { MESSAGES } from '@/constants/app';
import { HapticFeedback } from '@/utils/haptics';
import { AccessibilityHelper } from '@/utils/accessibility';

interface UseWordOperationsOptions {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export function useWordOperations(options: UseWordOperationsOptions = {}) {
  const { execute: executeAddWord, loading: addingWord } = useAsyncOperation<WordDefinition | null>();
  const { execute: executeRemoveWord, loading: removingWord } = useAsyncOperation<void>();

  const addWord = useCallback(async (word: string) => {
    try {
      const definition = await executeAddWord(() => DictionaryService.getWordDefinition(word));
      if (definition) {
        await WordService.addWord(definition);
        await HapticFeedback.success();
        
        const message = `"${definition.word}" has been added to your vocabulary list.`;
        AccessibilityHelper.announceSuccess(message);
        
        if (options.onSuccess) {
          options.onSuccess(message);
        } else {
          Alert.alert('Word Added!', message, [{ text: 'OK' }]);
        }
        
        return definition;
      } else {
        await HapticFeedback.error();
        
        const errorMessage = `Sorry, we could not find a definition for "${word}".`;
        AccessibilityHelper.announceError(errorMessage);
        
        if (options.onError) {
          options.onError(errorMessage);
        } else {
          Alert.alert(MESSAGES.ERROR.WORD_NOT_FOUND, errorMessage, [{ text: 'OK' }]);
        }
        
        return null;
      }
    } catch (error) {
      await HapticFeedback.error();
      
      const errorMessage = MESSAGES.ERROR.GENERAL;
      AccessibilityHelper.announceError(errorMessage);
      
      if (options.onError) {
        options.onError(errorMessage);
      } else {
        Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
      }
      
      return null;
    }
  }, [executeAddWord, options]);

  const removeWord = useCallback(async (wordId: string, language: string, wordText: string) => {
    return new Promise<void>((resolve, reject) => {
      Alert.alert(
        'Delete Word',
        `Are you sure you want to remove "${wordText}" from your vocabulary?`,
        [
          { 
            text: 'Cancel', 
            style: 'cancel', 
            onPress: async () => {
              await HapticFeedback.light();
              reject(new Error('Cancelled'));
            }
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await executeRemoveWord(() => WordService.removeWord(wordId, language));
                await HapticFeedback.success();
                
                const message = `"${wordText}" has been removed from your vocabulary.`;
                AccessibilityHelper.announceSuccess(message);
                
                resolve();
              } catch (error) {
                await HapticFeedback.error();
                
                const errorMessage = MESSAGES.ERROR.WORD_DELETE_FAILED;
                AccessibilityHelper.announceError(errorMessage);
                
                if (options.onError) {
                  options.onError(errorMessage);
                } else {
                  Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
                }
                
                reject(error);
              }
            },
          },
        ]
      );
    });
  }, [executeRemoveWord, options]);

  return {
    addWord,
    removeWord,
    addingWord,
    removingWord,
    loading: addingWord || removingWord,
  };
}