import { Language } from '@/types/dictionary';
import { getLanguageInfo } from '@/utils/languageUtils';
import { StorageService } from './storageService';

export class LanguageService {
  // Get user's active languages
  static async getUserLanguages(): Promise<Language[]> {
    try {
      const userWords = await StorageService.getUserWords();
      const languageCodes = Object.keys(userWords);
      
      // Map language codes to language objects
      const languages: Language[] = languageCodes.map(code => {
        const { name, flag } = getLanguageInfo(code);
        return { code, name, flag };
      });

      return languages;
    } catch (error) {
      console.error('Error loading user languages:', error);
      return [];
    }
  }
}