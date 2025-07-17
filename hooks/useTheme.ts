import { useThemeColor } from '@/hooks/useThemeColor';

export interface Theme {
  tint: string;
  text: string;
  background: string;
  tabIconDefault: string;
  tabIconSelected: string;
  border: string;
  borderOpacity: string;
}

export function useTheme(): Theme {
  const tint = useThemeColor({}, 'tint');
  const text = useThemeColor({}, 'text');
  const background = useThemeColor({}, 'background');
  const tabIconDefault = useThemeColor({}, 'tabIconDefault');
  const tabIconSelected = useThemeColor({}, 'tabIconSelected');
  
  return {
    tint,
    text,
    background,
    tabIconDefault,
    tabIconSelected,
    border: text,
    borderOpacity: text + '30',
  };
}