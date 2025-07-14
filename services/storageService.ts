import AsyncStorage from '@react-native-async-storage/async-storage';
import { WordDefinition, UserWordList, Language } from '@/types/dictionary';

const STORAGE_KEYS = {
  USER_WORDS: 'user_words',
  LANGUAGES: 'user_languages'
};

export class StorageService {
  // Get all user words organized by language and part of speech
  static async getUserWords(): Promise<UserWordList> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_WORDS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading user words:', error);
      return {};
    }
  }

  // Add a word to user's collection
  static async addWord(word: WordDefinition): Promise<void> {
    try {
      const userWords = await this.getUserWords();
      
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

      await AsyncStorage.setItem(STORAGE_KEYS.USER_WORDS, JSON.stringify(userWords));
    } catch (error) {
      console.error('Error saving word:', error);
      throw error;
    }
  }

  // Remove a word from user's collection
  static async removeWord(wordId: string, language: string): Promise<void> {
    try {
      const userWords = await this.getUserWords();
      
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

      await AsyncStorage.setItem(STORAGE_KEYS.USER_WORDS, JSON.stringify(userWords));
    } catch (error) {
      console.error('Error removing word:', error);
      throw error;
    }
  }

  // Get words for a specific language
  static async getWordsByLanguage(languageCode: string): Promise<WordDefinition[]> {
    try {
      const userWords = await this.getUserWords();
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

  // Get user's active languages
  static async getUserLanguages(): Promise<Language[]> {
    try {
      const userWords = await this.getUserWords();
      const languageCodes = Object.keys(userWords);
      
      // Map language codes to language objects
      const languages: Language[] = languageCodes.map(code => ({
        code,
        name: this.getLanguageName(code),
        flag: this.getLanguageFlag(code)
      }));

      return languages;
    } catch (error) {
      console.error('Error loading user languages:', error);
      return [];
    }
  }

  // Helper: Get language name from code
  private static getLanguageName(code: string): string {
    const languageNames: Record<string, string> = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'ru': 'Russian',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean'
    };
    return languageNames[code] || code.toUpperCase();
  }

  // Helper: Get language flag from code
  private static getLanguageFlag(code: string): string {
    const languageFlags: Record<string, string> = {
      'en': '🇺🇸',
      'es': '🇪🇸',
      'fr': '🇫🇷',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'pt': '🇵🇹',
      'ru': '🇷🇺',
      'zh': '🇨🇳',
      'ja': '🇯🇵',
      'ko': '🇰🇷'
    };
    return languageFlags[code] || '🌐';
  }

  // Clear all data (for development/testing)
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}