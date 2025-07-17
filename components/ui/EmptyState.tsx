import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { SIZES, OPACITY } from '@/constants/ui';

interface EmptyStateProps {
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

function EmptyStateComponent({ 
  title, 
  message, 
  actionText, 
  onAction, 
  icon 
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      {icon && (
        <ThemedView style={styles.iconContainer}>
          {icon}
        </ThemedView>
      )}
      
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      
      <ThemedText style={styles.message}>
        {message}
      </ThemedText>
      
      {actionText && onAction && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.tint }]}
          onPress={onAction}
        >
          <ThemedText style={styles.buttonText}>
            {actionText}
          </ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.SPACING.XXXXL,
  },
  iconContainer: {
    marginBottom: SIZES.SPACING.XXL,
  },
  title: {
    marginBottom: SIZES.SPACING.LG,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    opacity: OPACITY.TERTIARY,
    lineHeight: 22,
    marginBottom: SIZES.SPACING.XXL,
  },
  button: {
    paddingHorizontal: SIZES.SPACING.XXL,
    paddingVertical: SIZES.SPACING.MD,
    borderRadius: SIZES.BORDER_RADIUS.SMALL,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

// Memoize EmptyState
export const EmptyState = React.memo(EmptyStateComponent, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.message === nextProps.message &&
    prevProps.actionText === nextProps.actionText &&
    prevProps.onAction === nextProps.onAction &&
    prevProps.icon === nextProps.icon
  );
});