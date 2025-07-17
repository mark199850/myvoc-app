import { WordDefinition, UserWordList } from '@/types/dictionary';

export function findWordById(userWords: UserWordList, wordId: string): WordDefinition | null {
  for (const languageWords of Object.values(userWords)) {
    for (const categoryWords of Object.values(languageWords)) {
      const word = categoryWords.find(w => w.id === wordId);
      if (word) return word;
    }
  }
  return null;
}

export function getTotalWordCount(wordsByCategory: Record<string, WordDefinition[]>): number {
  return Object.values(wordsByCategory).reduce((total, words) => total + words.length, 0);
}

export function getMainDefinition(word: WordDefinition): string {
  const firstDef = word.definitions[0];
  if (firstDef && firstDef.meanings.length > 0) {
    return firstDef.meanings[0].definition;
  }
  return "No definition available";
}

export function getPartOfSpeech(word: WordDefinition): string {
  return word.definitions[0]?.partOfSpeech || "unknown";
}

export function sortWordsByName(words: WordDefinition[]): WordDefinition[] {
  return words.sort((a, b) => a.word.localeCompare(b.word));
}