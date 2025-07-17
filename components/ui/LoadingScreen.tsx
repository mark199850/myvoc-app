import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { SIZES, OPACITY } from '@/constants/ui';

interface LoadingScreenProps {
  message?: string;
  size?: 'small' | 'large';
}

function LoadingScreenComponent({ message = 'Loading...', size = 'large' }: LoadingScreenProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ActivityIndicator size={size} color={theme.tint} />
        <ThemedText style={styles.message}>{message}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: SIZES.SPACING.LG,
    opacity: OPACITY.SECONDARY,
  },
});

// Memoize LoadingScreen
export const LoadingScreen = React.memo(LoadingScreenComponent, (prevProps, nextProps) => {
  return (
    prevProps.message === nextProps.message &&
    prevProps.size === nextProps.size
  );
});