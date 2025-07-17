export interface LanguageInfo {
  name: string;
  flag: string;
}

const LANGUAGE_MAP: Record<string, LanguageInfo> = {
  'en': { name: 'English', flag: '🇺🇸' },
  'es': { name: 'Spanish', flag: '🇪🇸' },
  'fr': { name: 'French', flag: '🇫🇷' },
  'de': { name: 'German', flag: '🇩🇪' },
  'it': { name: 'Italian', flag: '🇮🇹' },
  'pt': { name: 'Portuguese', flag: '🇵🇹' },
  'ru': { name: 'Russian', flag: '🇷🇺' },
  'zh': { name: 'Chinese', flag: '🇨🇳' },
  'ja': { name: 'Japanese', flag: '🇯🇵' },
  'ko': { name: 'Korean', flag: '🇰🇷' },
};

export function getLanguageName(code: string): string {
  return LANGUAGE_MAP[code]?.name || code.toUpperCase();
}

export function getLanguageFlag(code: string): string {
  return LANGUAGE_MAP[code]?.flag || '🌐';
}

export function getLanguageInfo(code: string): LanguageInfo {
  return LANGUAGE_MAP[code] || { name: code.toUpperCase(), flag: '🌐' };
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}