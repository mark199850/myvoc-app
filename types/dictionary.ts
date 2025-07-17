export interface WordDefinition {
  id: string;
  word: string;
  language: string;
  phonetic?: string;
  audioUrl?: string;
  definitions: Definition[];
  dateAdded: Date;
}

export interface Definition {
  partOfSpeech: string;
  meanings: Meaning[];
}

export interface Meaning {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface WordCategory {
  [partOfSpeech: string]: WordDefinition[];
}

export interface UserWordList {
  [languageCode: string]: WordCategory;
}

export interface SearchSuggestion {
  word: string;
  language: string;
  phonetic?: string;
}
