import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StorageService } from '@/services/storageService';
import { WordDefinition } from '@/types/dictionary';
import { Audio } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function WordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [word, setWord] = useState<WordDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioLoading, setAudioLoading] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'text');

  useEffect(() => {
    loadWord();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadWord = async () => {
    try {
      const userWords = await StorageService.getUserWords();
      let foundWord: WordDefinition | null = null;

      Object.values(userWords).forEach(languageWords => {
        Object.values(languageWords).forEach(categoryWords => {
          const word = categoryWords.find(w => w.id === id);
          if (word) {
            foundWord = word;
          }
        });
      });

      setWord(foundWord);
    } catch (error) {
      console.error('Error loading word:', error);
      Alert.alert('Error', 'Failed to load word details');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async () => {
    if (!word?.audioUrl) return;

    setAudioLoading(true);
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: word.audioUrl },
        { shouldPlay: true }
      );
      
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Audio Error', 'Failed to play pronunciation');
    } finally {
      setAudioLoading(false);
    }
  };

  const deleteWord = async () => {
    if (!word) return;

    Alert.alert(
      'Delete Word',
      `Are you sure you want to remove "${word.word}" from your vocabulary?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.removeWord(word.id, word.language);
              router.back();
            } catch (error) {
              console.error('Error deleting word:', error);
              Alert.alert('Error', 'Failed to delete word');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText style={styles.loadingText}>Loading word...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (!word) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText type="title">Word Not Found</ThemedText>
          <ThemedText style={styles.errorText}>
            The requested word could not be found.
          </ThemedText>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: tintColor }]}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.buttonText}>Go Back</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.headerContainer}>
          <ThemedView style={styles.wordHeader}>
            <ThemedText type="title" style={styles.wordTitle}>
              {word.word}
            </ThemedText>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={deleteWord}
            >
              <IconSymbol name="trash" size={24} color="#FF4444" />
            </TouchableOpacity>
          </ThemedView>

          {word.phonetic && (
            <ThemedView style={styles.phoneticContainer}>
              <ThemedText style={styles.phoneticText}>{word.phonetic}</ThemedText>
              {word.audioUrl && (
                <TouchableOpacity
                  style={[styles.audioButton, { borderColor }]}
                  onPress={playAudio}
                  disabled={audioLoading}
                >
                  {audioLoading ? (
                    <ActivityIndicator size="small" color={tintColor} />
                  ) : (
                    <IconSymbol name="speaker.wave.2" size={20} color={tintColor} />
                  )}
                </TouchableOpacity>
              )}
            </ThemedView>
          )}
        </ThemedView>

        <ThemedView style={styles.definitionsContainer}>
          {word.definitions.map((definition, defIndex) => (
            <ThemedView key={defIndex} style={styles.definitionSection}>
              <ThemedView style={[styles.partOfSpeechBadge, { backgroundColor: tintColor + '20' }]}>
                <ThemedText style={[styles.partOfSpeechText, { color: tintColor }]}>
                  {definition.partOfSpeech}
                </ThemedText>
              </ThemedView>

              {definition.meanings.map((meaning, meaningIndex) => (
                <ThemedView key={meaningIndex} style={styles.meaningContainer}>
                  <ThemedText style={styles.definitionText}>
                    {meaningIndex + 1}. {meaning.definition}
                  </ThemedText>

                  {meaning.example && (
                    <ThemedView style={[styles.exampleContainer, { borderLeftColor: tintColor }]}>
                      <ThemedText style={styles.exampleText}>
                        &ldquo;{meaning.example}&rdquo;
                      </ThemedText>
                    </ThemedView>
                  )}

                  {meaning.synonyms && meaning.synonyms.length > 0 && (
                    <ThemedView style={styles.synonymsContainer}>
                      <ThemedText style={styles.synonymsLabel}>Synonyms:</ThemedText>
                      <ThemedText style={styles.synonymsText}>
                        {meaning.synonyms.join(', ')}
                      </ThemedText>
                    </ThemedView>
                  )}

                  {meaning.antonyms && meaning.antonyms.length > 0 && (
                    <ThemedView style={styles.antonymsContainer}>
                      <ThemedText style={styles.antonymsLabel}>Antonyms:</ThemedText>
                      <ThemedText style={styles.antonymsText}>
                        {meaning.antonyms.join(', ')}
                      </ThemedText>
                    </ThemedView>
                  )}
                </ThemedView>
              ))}
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedText style={styles.dateAddedText}>
            Added on {new Date(word.dateAdded).toLocaleDateString()}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 16,
    opacity: 0.7,
  },
  headerContainer: {
    marginBottom: 24,
  },
  wordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  wordTitle: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  phoneticContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  phoneticText: {
    fontSize: 16,
    fontStyle: 'italic',
    opacity: 0.8,
    flex: 1,
  },
  audioButton: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 20,
    marginLeft: 12,
  },
  definitionsContainer: {
    marginBottom: 24,
  },
  definitionSection: {
    marginBottom: 24,
  },
  partOfSpeechBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  partOfSpeechText: {
    fontSize: 14,
    fontWeight: '600',
  },
  meaningContainer: {
    marginBottom: 16,
  },
  definitionText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  exampleContainer: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    marginVertical: 8,
  },
  exampleText: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.8,
  },
  synonymsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  synonymsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  synonymsText: {
    fontSize: 14,
    flex: 1,
  },
  antonymsContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  antonymsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  antonymsText: {
    fontSize: 14,
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#00000020',
    paddingTop: 16,
    alignItems: 'center',
  },
  dateAddedText: {
    fontSize: 12,
    opacity: 0.6,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});