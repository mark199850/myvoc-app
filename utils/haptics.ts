import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export enum HapticFeedbackType {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  LIGHT = 'light',
  MEDIUM = 'medium',
  HEAVY = 'heavy',
  SELECTION = 'selection',
}

export class HapticFeedback {
  private static enabled = true;

  static setEnabled(enabled: boolean) {
    HapticFeedback.enabled = enabled;
  }

  static async trigger(type: HapticFeedbackType): Promise<void> {
    if (!HapticFeedback.enabled) return;

    // Only provide haptic feedback on iOS for now
    if (Platform.OS !== 'ios') return;

    try {
      switch (type) {
        case HapticFeedbackType.SUCCESS:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        
        case HapticFeedbackType.WARNING:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        
        case HapticFeedbackType.ERROR:
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        
        case HapticFeedbackType.LIGHT:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        
        case HapticFeedbackType.MEDIUM:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        
        case HapticFeedbackType.HEAVY:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        
        case HapticFeedbackType.SELECTION:
          await Haptics.selectionAsync();
          break;
        
        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      // Silently fail haptic feedback errors
      console.warn('Haptic feedback error:', error);
    }
  }

  // Convenience methods for common actions
  static async success(): Promise<void> {
    return HapticFeedback.trigger(HapticFeedbackType.SUCCESS);
  }

  static async error(): Promise<void> {
    return HapticFeedback.trigger(HapticFeedbackType.ERROR);
  }

  static async warning(): Promise<void> {
    return HapticFeedback.trigger(HapticFeedbackType.WARNING);
  }

  static async light(): Promise<void> {
    return HapticFeedback.trigger(HapticFeedbackType.LIGHT);
  }

  static async medium(): Promise<void> {
    return HapticFeedback.trigger(HapticFeedbackType.MEDIUM);
  }

  static async heavy(): Promise<void> {
    return HapticFeedback.trigger(HapticFeedbackType.HEAVY);
  }

  static async selection(): Promise<void> {
    return HapticFeedback.trigger(HapticFeedbackType.SELECTION);
  }
}