import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { WordDefinitions } from "@/components/WordDefinitions";
import { WordHeader } from "@/components/WordHeader";
import { OPACITY, SIZES } from "@/constants/ui";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useTheme } from "@/hooks/useTheme";
import { useWordDetail } from "@/hooks/useWordDetail";
import { useWordOperations } from "@/hooks/useWordOperations";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function WordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();

  const { word, loading } = useWordDetail(id!);
  const { playAudio, loading: audioLoading } = useAudioPlayer();
  const { removeWord } = useWordOperations();

  const handlePlayAudio = async () => {
    if (word?.audioUrl) {
      await playAudio(word.audioUrl);
    }
  };

  const handleDelete = async () => {
    if (!word) return;

    try {
      await removeWord(word.id, word.language, word.word);
      router.back();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Loading..." }} />
        <LoadingScreen message="Loading word details..." />
      </>
    );
  }

  if (!word) {
    return (
      <>
        <Stack.Screen options={{ title: "Word Not Found" }} />
        <EmptyState
          title="Word Not Found"
          message="The requested word could not be found."
          actionText="Go Back"
          onAction={() => router.back()}
        />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Word details" }} />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.content}>
          <WordHeader
            word={word}
            onDelete={handleDelete}
            onPlayAudio={handlePlayAudio}
            audioLoading={audioLoading}
          />

          <WordDefinitions word={word} />

          <ThemedView style={styles.footer}>
            <ThemedText style={styles.dateAddedText}>
              Added on {new Date(word.dateAdded).toLocaleDateString()}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SIZES.SPACING.XL,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#00000020",
    paddingTop: 16,
    alignItems: "center",
  },
  dateAddedText: {
    fontSize: SIZES.FONT.SMALL,
    opacity: OPACITY.DISABLED,
  },
});
