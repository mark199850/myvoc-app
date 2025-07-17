export const APP_CONFIG = {
  NAME: 'MyDict',
  DEFAULT_LANGUAGE: 'en',
  MAX_SUGGESTIONS: 5,
  AUDIO_TIMEOUT: 10000,
} as const;

export const MESSAGES = {
  LOADING: {
    WORD: 'Loading word...',
    WORDS: 'Loading your words...',
    SAVING: 'Saving word...',
    DELETING: 'Deleting word...',
  },
  SUCCESS: {
    WORD_ADDED: 'Word added to your vocabulary!',
    WORD_DELETED: 'Word removed from your vocabulary',
  },
  ERROR: {
    WORD_NOT_FOUND: 'Word not found',
    WORD_LOAD_FAILED: 'Failed to load word details',
    WORD_SAVE_FAILED: 'Failed to save word',
    WORD_DELETE_FAILED: 'Failed to delete word',
    AUDIO_PLAY_FAILED: 'Failed to play pronunciation',
    GENERAL: 'Something went wrong. Please try again.',
  },
  EMPTY_STATES: {
    NO_WORDS: {
      TITLE: 'No words yet!',
      MESSAGE: 'Start building your vocabulary by searching for words in the Search tab.',
    },
    WORD_NOT_FOUND: {
      TITLE: 'Word Not Found',
      MESSAGE: 'The requested word could not be found.',
    },
  },
} as const;

export const STORAGE_KEYS = {
  USER_WORDS: 'user_words',
  LANGUAGES: 'user_languages',
  SETTINGS: 'app_settings',
} as const;