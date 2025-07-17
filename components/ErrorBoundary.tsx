import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { errorHandler, ErrorType, ErrorSeverity } from '@/utils/errorUtils';
import { SIZES } from '@/constants/ui';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to centralized error handler
    errorHandler.handleError(error, {
      component: 'ErrorBoundary',
      operation: 'componentDidCatch',
      metadata: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      },
    });

    // Call optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.retry} />;
      }

      return <DefaultErrorFallback error={this.state.error!} retry={this.retry} />;
    }

    return this.props.children;
  }
}

interface DefaultErrorFallbackProps {
  error: Error;
  retry: () => void;
}

function DefaultErrorFallback({ error, retry }: DefaultErrorFallbackProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Something went wrong
        </ThemedText>
        
        <ThemedText style={styles.message}>
          An unexpected error occurred. Please try again or restart the app.
        </ThemedText>
        
        {__DEV__ && (
          <ThemedView style={styles.errorDetails}>
            <ThemedText style={styles.errorTitle}>Error Details:</ThemedText>
            <ThemedText style={styles.errorMessage}>{error.message}</ThemedText>
            {error.stack && (
              <ThemedText style={styles.errorStack} numberOfLines={5}>
                {error.stack}
              </ThemedText>
            )}
          </ThemedView>
        )}
        
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.tint }]}
          onPress={retry}
        >
          <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.SPACING.XXL,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: SIZES.SPACING.LG,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SIZES.SPACING.XXL,
    lineHeight: 24,
    opacity: 0.8,
  },
  errorDetails: {
    marginBottom: SIZES.SPACING.XXL,
    padding: SIZES.SPACING.LG,
    backgroundColor: '#f5f5f5',
    borderRadius: SIZES.BORDER_RADIUS.MEDIUM,
    width: '100%',
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: SIZES.SPACING.SM,
    color: '#666',
  },
  errorMessage: {
    fontSize: 12,
    color: '#d32f2f',
    marginBottom: SIZES.SPACING.SM,
  },
  errorStack: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'monospace',
  },
  retryButton: {
    paddingHorizontal: SIZES.SPACING.XXL,
    paddingVertical: SIZES.SPACING.MD,
    borderRadius: SIZES.BORDER_RADIUS.MEDIUM,
    minWidth: 120,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ErrorBoundary;