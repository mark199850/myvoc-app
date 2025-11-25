import { UserWordList, WordDefinition } from "@/types/dictionary";

export function findWordById(
  userWords: UserWordList,
  wordId: string
): WordDefinition | null {
  for (const languageWords of Object.values(userWords)) {
    for (const categoryWords of Object.values(languageWords)) {
      const word = categoryWords.find((w) => w.id === wordId);
      if (word) return word;
    }
  }
  return null;
}

export function getTotalWordCount(
  wordsByCategory: Record<string, WordDefinition[]>
): number {
  return Object.values(wordsByCategory).reduce(
    (total, words) => total + words.length,
    0
  );
}

export function getMainDefinition(word: WordDefinition): string {
  return word.meanings[0].definitions[0];
}

export function getPartOfSpeech(word: WordDefinition): string {
  return word.meanings.map((m) => m.partOfSpeech).join("/");
}

export function sortWordsByName(words: WordDefinition[]): WordDefinition[] {
  return words.sort((a, b) => a.word.localeCompare(b.word));
}
