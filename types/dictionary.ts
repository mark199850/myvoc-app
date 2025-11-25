export interface WordDefinition {
  id: string;
  dateAdded: Date;
  language: string;
  word: string;
  pronunciation: PronunciationGroup;
  meanings: Meaning[];
}

export interface PronunciationGroup {
  us: PronunciationVariant;
  uk: PronunciationVariant;
  au: PronunciationVariant;
  default: PronunciationVariant;
}

export interface PronunciationVariant {
  ipa: string | null;
  audioUrl: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: string[];
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
