import { AccessibilityInfo } from "react-native";

export interface AccessibilityProps {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?:
    | "button"
    | "text"
    | "image"
    | "header"
    | "link"
    | "search"
    | "none";
  accessible?: boolean;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
    busy?: boolean;
    expanded?: boolean;
  };
  accessibilityActions?: {
    name: string;
    label?: string;
  }[];
}

export class AccessibilityHelper {
  private static screenReaderEnabled = false;

  static async initialize(): Promise<void> {
    try {
      AccessibilityHelper.screenReaderEnabled =
        await AccessibilityInfo.isScreenReaderEnabled();

      // Listen for screen reader changes
      AccessibilityInfo.addEventListener("screenReaderChanged", (enabled) => {
        AccessibilityHelper.screenReaderEnabled = enabled;
      });
    } catch (error) {
      console.warn("Accessibility initialization error:", error);
    }
  }

  static isScreenReaderEnabled(): boolean {
    return AccessibilityHelper.screenReaderEnabled;
  }

  static createButtonProps(
    label: string,
    hint?: string,
    state?: { disabled?: boolean; selected?: boolean }
  ): AccessibilityProps {
    return {
      accessible: true,
      accessibilityRole: "button",
      accessibilityLabel: label,
      accessibilityHint: hint,
      accessibilityState: state,
    };
  }

  static createTextProps(
    label: string,
    role: "text" | "header" = "text"
  ): AccessibilityProps {
    return {
      accessible: true,
      accessibilityRole: role,
      accessibilityLabel: label,
    };
  }

  static createSearchProps(
    label: string,
    hint?: string,
    expanded?: boolean
  ): AccessibilityProps {
    return {
      accessible: true,
      accessibilityRole: "search",
      accessibilityLabel: label,
      accessibilityHint: hint,
      accessibilityState: { expanded },
    };
  }

  static createExpandableProps(
    label: string,
    expanded: boolean,
    hint?: string
  ): AccessibilityProps {
    return {
      accessible: true,
      accessibilityRole: "button",
      accessibilityLabel: label,
      accessibilityHint: hint || `${expanded ? "Collapse" : "Expand"} section`,
      accessibilityState: { expanded },
    };
  }

  static createWordCardProps(
    word: string,
    definition: string,
    partOfSpeech: string,
    hasAudio: boolean
  ): AccessibilityProps {
    const audioHint = hasAudio ? "Audio pronunciation available. " : "";
    const label = `${word}, ${partOfSpeech}`;
    const hint = `${audioHint}${definition}. Double tap to view details.`;

    return {
      accessible: true,
      accessibilityRole: "button",
      accessibilityLabel: label,
      accessibilityHint: hint,
    };
  }

  static announce(message: string): void {
    if (AccessibilityHelper.screenReaderEnabled) {
      AccessibilityInfo.announceForAccessibility(message);
    }
  }

  static announcePageChange(pageName: string): void {
    AccessibilityHelper.announce(`Navigated to ${pageName}`);
  }

  static announceLoadingComplete(itemCount?: number): void {
    const message =
      itemCount !== undefined
        ? `Loading complete. ${itemCount} items loaded.`
        : "Loading complete.";

    AccessibilityHelper.announce(message);
  }

  static announceError(error: string): void {
    AccessibilityHelper.announce(`Error: ${error}`);
  }

  static announceSuccess(message: string): void {
    AccessibilityHelper.announce(`Success: ${message}`);
  }
}

// Touch target size constants for mobile accessibility
export const TOUCH_TARGET = {
  MIN_SIZE: 44, // Minimum touch target size (iOS HIG & Android guidelines)
  RECOMMENDED_SIZE: 48, // Recommended touch target size
  PADDING: 12, // Minimum padding around touch targets
} as const;

// Mobile-specific styling helpers
export const mobileStyles = {
  touchTarget: {
    minHeight: TOUCH_TARGET.MIN_SIZE,
    minWidth: TOUCH_TARGET.MIN_SIZE,
  },
  recommendedTouchTarget: {
    minHeight: TOUCH_TARGET.RECOMMENDED_SIZE,
    minWidth: TOUCH_TARGET.RECOMMENDED_SIZE,
  },
  touchPadding: {
    padding: TOUCH_TARGET.PADDING,
  },
} as const;
