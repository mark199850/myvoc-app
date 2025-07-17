import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: any;
}

function SectionComponent({ title, subtitle, children, style }: SectionProps) {
  return (
    <ThemedView style={[styles.container, style]}>
      {title && (
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText style={styles.subtitle}>
              {subtitle}
            </ThemedText>
          )}
        </ThemedView>
      )}
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.8,
    fontSize: 16,
  },
});

// Memoize Section
export const Section = React.memo(SectionComponent, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.subtitle === nextProps.subtitle &&
    prevProps.style === nextProps.style &&
    prevProps.children === nextProps.children
  );
});