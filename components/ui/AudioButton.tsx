import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@/hooks/useTheme";
import { AccessibilityHelper, mobileStyles } from "@/utils/accessibility";
import { HapticFeedback } from "@/utils/haptics";
import React from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";

interface AudioButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  size?: number;
  style?: any;
}

function AudioButtonComponent({
  onPress,
  loading = false,
  disabled = false,
  size = 20,
  style,
}: AudioButtonProps) {
  const theme = useTheme();

  const handlePress = async () => {
    await HapticFeedback.light();
    onPress();
  };

  const accessibilityProps = AccessibilityHelper.createButtonProps(
    loading ? "Loading pronunciation" : "Play pronunciation",
    loading ? "Audio is loading" : "Double tap to play word pronunciation",
    { disabled: disabled || loading }
  );

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { borderColor: theme.borderOpacity },
        mobileStyles.touchTarget,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      {...accessibilityProps}
    >
      {loading ? (
        <ActivityIndicator size="small" color={theme.tint} />
      ) : (
        <IconSymbol name="speaker.3.fill" size={size} color={theme.tint} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

// Memoize AudioButton
export const AudioButton = React.memo(
  AudioButtonComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.onPress === nextProps.onPress &&
      prevProps.loading === nextProps.loading &&
      prevProps.disabled === nextProps.disabled &&
      prevProps.size === nextProps.size &&
      prevProps.style === nextProps.style
    );
  }
);
