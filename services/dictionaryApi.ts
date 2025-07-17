import { WordDefinition, SearchSuggestion } from '@/types/dictionary';
import { logError } from '@/utils/errorUtils';

// Dummy data for development - will be replaced with Oxford API
const DUMMY_WORDS: Record<string, WordDefinition> = {
  'hello': {
    id: '1',
    word: 'hello',
    language: 'en',
    phonetic: '/həˈloʊ/',
    audioUrl: 'https://audio.oxforddictionaries.com/en/mp3/hello_gb_1.mp3',
    definitions: [
      {
        partOfSpeech: 'exclamation',
        meanings: [
          {
            definition: 'Used as a greeting or to begin a phone conversation.',
            example: 'Hello there, Katie!',
            synonyms: ['hi', 'hey', 'greetings']
          }
        ]
      }
    ],
    dateAdded: new Date()
  },
  'beautiful': {
    id: '2',
    word: 'beautiful',
    language: 'en',
    phonetic: '/ˈbjuːtɪf(ə)l/',
    audioUrl: 'https://audio.oxforddictionaries.com/en/mp3/beautiful_gb_1.mp3',
    definitions: [
      {
        partOfSpeech: 'adjective',
        meanings: [
          {
            definition: 'Pleasing the senses or mind aesthetically.',
            example: 'Beautiful poetry',
            synonyms: ['attractive', 'pretty', 'lovely'],
            antonyms: ['ugly', 'hideous']
          }
        ]
      }
    ],
    dateAdded: new Date()
  },
  'freedom': {
    id: '3',
    word: 'freedom',
    language: 'en',
    phonetic: '/ˈfriːdəm/',
    audioUrl: 'https://audio.oxforddictionaries.com/en/mp3/freedom_gb_1.mp3',
    definitions: [
      {
        partOfSpeech: 'noun',
        meanings: [
          {
            definition: 'The power or right to act, speak, or think as one wants.',
            example: 'We do have some freedom of choice',
            synonyms: ['liberty', 'independence', 'autonomy']
          }
        ]
      }
    ],
    dateAdded: new Date()
  }
};

export class DictionaryService {
  // Search for word suggestions (autocomplete)
  static async searchSuggestions(query: string, language: string = 'en'): Promise<SearchSuggestion[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const suggestions = Object.keys(DUMMY_WORDS)
        .filter(word => word.toLowerCase().includes(query.toLowerCase()))
        .map(word => ({
          word,
          language,
          phonetic: DUMMY_WORDS[word].phonetic
        }));
      
      return suggestions.slice(0, 5); // Limit to 5 suggestions
    } catch (error) {
      logError(error, 'DictionaryService.searchSuggestions');
      return [];
    }
  }

  // Get full word definition
  static async getWordDefinition(word: string, language: string = 'en'): Promise<WordDefinition | null> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const definition = DUMMY_WORDS[word.toLowerCase()];
      if (!definition) {
        return null;
      }
      
      return {
        ...definition,
        id: Math.random().toString(36).substr(2, 9), // Generate unique ID
        dateAdded: new Date()
      };
    } catch (error) {
      logError(error, 'DictionaryService.getWordDefinition');
      return null;
    }
  }

  // INTEGRATION: Replace with actual Oxford API integration when API keys are available
  static async searchOxfordAPI(word: string, language: string = 'en'): Promise<WordDefinition | null> {
    try {
      // This will be implemented when Oxford API keys are available
      // const response = await fetch(`https://od-api.oxforddictionaries.com/api/v2/entries/${language}/${word}`, {
      //   headers: {
      //     'app_id': process.env.OXFORD_APP_ID,
      //     'app_key': process.env.OXFORD_APP_KEY
      //   }
      // });
      // return response.json();
      
      return this.getWordDefinition(word, language);
    } catch (error) {
      logError(error, 'DictionaryService.searchOxfordAPI');
      return null;
    }
  }
}