import { WordDefinition, UserWordList } from '@/types/dictionary';
import { StorageService } from './storageService';

export class WordService {
  // Add a word to user's collection
  static async addWord(word: WordDefinition): Promise<void> {
    try {
      const userWords = await StorageService.getUserWords();
      
      // Initialize language if it doesn't exist
      if (!userWords[word.language]) {
        userWords[word.language] = {};
      }

      // Organize by part of speech
      word.definitions.forEach(def => {
        const partOfSpeech = def.partOfSpeech;
        
        if (!userWords[word.language][partOfSpeech]) {
          userWords[word.language][partOfSpeech] = [];
        }

        // Check if word already exists
        const existingIndex = userWords[word.language][partOfSpeech]
          .findIndex(w => w.word.toLowerCase() === word.word.toLowerCase());

        if (existingIndex >= 0) {
          // Update existing word
          userWords[word.language][partOfSpeech][existingIndex] = word;
        } else {
          // Add new word
          userWords[word.language][partOfSpeech].push(word);
        }
      });

      await StorageService.saveUserWords(userWords);
    } catch (error) {
      console.error('Error saving word:', error);
      throw error;
    }
  }

  // Remove a word from user's collection
  static async removeWord(wordId: string, language: string): Promise<void> {
    try {
      const userWords = await StorageService.getUserWords();
      
      if (userWords[language]) {
        Object.keys(userWords[language]).forEach(partOfSpeech => {
          userWords[language][partOfSpeech] = userWords[language][partOfSpeech]
            .filter(word => word.id !== wordId);
          
          // Remove empty categories
          if (userWords[language][partOfSpeech].length === 0) {
            delete userWords[language][partOfSpeech];
          }
        });

        // Remove empty languages
        if (Object.keys(userWords[language]).length === 0) {
          delete userWords[language];
        }
      }

      await StorageService.saveUserWords(userWords);
    } catch (error) {
      console.error('Error removing word:', error);
      throw error;
    }
  }

  // Get words for a specific language
  static async getWordsByLanguage(languageCode: string): Promise<WordDefinition[]> {
    try {
      const userWords = await StorageService.getUserWords();
      const languageWords = userWords[languageCode] || {};
      
      const allWords: WordDefinition[] = [];
      Object.values(languageWords).forEach(categoryWords => {
        allWords.push(...categoryWords);
      });

      return allWords.sort((a, b) => a.word.localeCompare(b.word));
    } catch (error) {
      console.error('Error loading words by language:', error);
      return [];
    }
  }
}