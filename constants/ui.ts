export const COLORS = {
  ERROR: '#FF4444',
  BORDER_OPACITY: '30',
  BACKGROUND_OPACITY: '20',
} as const;

export const SIZES = {
  BORDER_RADIUS: {
    SMALL: 8,
    MEDIUM: 12,
    LARGE: 16,
    ROUND: 20,
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 12,
    LG: 16,
    XL: 20,
    XXL: 24,
    XXXL: 32,
    XXXXL: 40,
  },
  FONT: {
    SMALL: 12,
    MEDIUM: 14,
    LARGE: 16,
    XLARGE: 18,
  },
} as const;

export const OPACITY = {
  DISABLED: 0.6,
  SECONDARY: 0.7,
  TERTIARY: 0.8,
} as const;

export const ANIMATIONS = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
} as const;