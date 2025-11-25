import { SearchSuggestion, WordDefinition } from "@/types/dictionary";
import { logError } from "@/utils/errorUtils";


export class DictionaryService {
  static async searchSuggestions(
    query: string,
    language: string = "en"
  ): Promise<SearchSuggestion[]> {
    try {

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

  static async getWordDefinition(
    word: string,
    language: string = "en"
  ): Promise<WordDefinition | null> {
    try {

      const wordToBeAdded = await fetch(
        `http://192.168.1.104:7058/api/Word/${word}`
      );

      const wordDetails = await wordToBeAdded.json();

      return {
        id: Date.now().toString(),
        dateAdded: new Date(),
        language: "en",
        ...wordDetails,
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
