import { SearchSuggestion, WordDefinition } from "@/types/dictionary";
import { logError } from "@/utils/errorUtils";

// Dummy data for development - will be replaced with Oxford API
const DUMMY_WORDS: Record<string, WordDefinition> = {
  hello: {
    id: "1",
    word: "hello",
    language: "en",
    phonetic: "/həˈloʊ/",
    audioUrl: "https://audio.oxforddictionaries.com/en/mp3/hello_gb_1.mp3",
    definitions: [
      {
        partOfSpeech: "exclamation",
        meanings: [
          {
            definition: "Used as a greeting or to begin a phone conversation.",
            example: "Hello there, Katie!",
            synonyms: ["hi", "hey", "greetings"],
          },
        ],
      },
    ],
    dateAdded: new Date(),
  },
  beautiful: {
    id: "2",
    word: "beautiful",
    language: "en",
    phonetic: "/ˈbjuːtɪf(ə)l/",
    audioUrl: "https://audio.oxforddictionaries.com/en/mp3/beautiful_gb_1.mp3",
    definitions: [
      {
        partOfSpeech: "adjective",
        meanings: [
          {
            definition: "Pleasing the senses or mind aesthetically.",
            example: "Beautiful poetry",
            synonyms: ["attractive", "pretty", "lovely"],
            antonyms: ["ugly", "hideous"],
          },
        ],
      },
    ],
    dateAdded: new Date(),
  },
  freedom: {
    id: "3",
    word: "freedom",
    language: "en",
    phonetic: "/ˈfriːdəm/",
    audioUrl: "https://audio.oxforddictionaries.com/en/mp3/freedom_gb_1.mp3",
    definitions: [
      {
        partOfSpeech: "noun",
        meanings: [
          {
            definition:
              "The power or right to act, speak, or think as one wants.",
            example: "We do have some freedom of choice",
            synonyms: ["liberty", "independence", "autonomy"],
          },
        ],
      },
    ],
    dateAdded: new Date(),
  },
};

export class DictionaryService {
  // Search for word suggestions (autocomplete)
  static async searchSuggestions(
    query: string,
    language: string = "en"
  ): Promise<SearchSuggestion[]> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const suggestions = await fetch(
        `https://api.datamuse.com/sug?s=${query}&max=50`
      );
      const data = await suggestions.json();

      return data.map((item) => ({
        word: item.word,
      }));
    } catch (error) {
      logError(error, "DictionaryService.searchSuggestions");
      return [];
    }
  }

  // Get full word definition
  static async getWordDefinition(
    word: string,
    language: string = "en"
  ): Promise<WordDefinition | null> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const wordToBeAdded = await fetch(
        `https://lingua-robot.p.rapidapi.com/language/v1/entries/${language}/${word}`,
        {
          headers: {
            "X-RapidAPI-Key":
              "5f424d23d8msh02b54760650380bp1d8d43jsnf6664ed3ee1e",
            "X-RapidAPI-Host": "lingua-robot.p.rapidapi.com",
          },
        }
      );
      const response = await wordToBeAdded.json();
      const wordDetails = response.entries;
      console.log(wordDetails);
      return {
        word: wordDetails[0].entry,
        language: "en",
        definitions: [
          {
            meanings: [{definition: wordDetails[0].lexemes[0].senses[0].definition}],
            partOfSpeech: wordDetails[0].lexemes[0].partOfSpeech,
          },
        ],
        phonetic:
          wordDetails[0].pronunciations[0].transcriptions[0].transcription,
        audioUrl: wordDetails[0].pronunciations[0].audio.url,
        id: Date.now().toString(),
        dateAdded: new Date(),
      };
    } catch (error) {
      logError(error, "DictionaryService.getWordDefinition");
      return null;
    }
  }

  // INTEGRATION: Replace with actual Oxford API integration when API keys are available
  static async searchOxfordAPI(
    word: string,
    language: string = "en"
  ): Promise<WordDefinition | null> {
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
      logError(error, "DictionaryService.searchOxfordAPI");
      return null;
    }
  }
}
