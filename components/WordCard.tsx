import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { WordDefinition } from '@/types/dictionary';

interface WordCardProps {
  word: WordDefinition;
  onPress?: () => void;
}

export function WordCard({ word, onPress }: WordCardProps) {
  const router = useRouter();
  const borderColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const getMainDefinition = () => {
    const firstDef = word.definitions[0];
    if (firstDef && firstDef.meanings.length > 0) {
      return firstDef.meanings[0].definition;
    }
    return 'No definition available';
  };

  const getPartOfSpeech = () => {
    return word.definitions[0]?.partOfSpeech || 'unknown';
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/word/${word.id}`);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <ThemedView style={[styles.card, { borderColor: borderColor + '30' }]}>
        <View style={styles.header}>
          <ThemedText type="defaultSemiBold" style={styles.wordText}>
            {word.word}
          </ThemedText>
          <View style={[styles.partOfSpeechBadge, { backgroundColor: tintColor + '20' }]}>
            <ThemedText style={[styles.partOfSpeechText, { color: tintColor }]}>
              {getPartOfSpeech()}
            </ThemedText>
          </View>
        </View>
        
        {word.phonetic && (
          <ThemedText style={styles.phoneticText}>
            {word.phonetic}
          </ThemedText>
        )}
        
        <ThemedText style={styles.definitionText} numberOfLines={2}>
          {getMainDefinition()}
        </ThemedText>
        
        <View style={styles.footer}>
          <ThemedText style={styles.dateText}>
            Added {new Date(word.dateAdded).toLocaleDateString()}
          </ThemedText>
          {word.audioUrl && (
            <ThemedText style={[styles.audioIndicator, { color: tintColor }]}>
              🔊
            </ThemedText>
          )}
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  wordText: {
    fontSize: 18,
    flex: 1,
  },
  partOfSpeechBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  partOfSpeechText: {
    fontSize: 12,
    fontWeight: '600',
  },
  phoneticText: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.7,
    marginBottom: 8,
  },
  definitionText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 12,
    opacity: 0.6,
  },
  audioIndicator: {
    fontSize: 16,
  },
});