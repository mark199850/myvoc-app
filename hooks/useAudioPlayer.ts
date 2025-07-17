import { useState, useEffect, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { errorHandler, ErrorType, ErrorSeverity } from '@/utils/errorUtils';

export function useAudioPlayer() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);
  const currentOperationRef = useRef<Promise<void> | null>(null);

  const safeSetState = useCallback((updater: () => void) => {
    if (isMountedRef.current) {
      updater();
    }
  }, []);

  const cleanupSound = useCallback(async (soundToCleanup: Audio.Sound | null) => {
    if (soundToCleanup) {
      try {
        await soundToCleanup.unloadAsync();
      } catch (error) {
        errorHandler.handleError(error, {
          component: 'useAudioPlayer',
          operation: 'cleanupSound',
        });
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (sound) {
        sound.unloadAsync().catch(error => 
          errorHandler.handleError(error, {
            component: 'useAudioPlayer',
            operation: 'cleanup on unmount',
          })
        );
      }
    };
  }, [sound]);

  const playAudio = useCallback(async (audioUrl: string) => {
    if (!audioUrl || !isMountedRef.current) return;

    // Cancel any ongoing operation
    if (currentOperationRef.current) {
      return;
    }

    const operation = async () => {
      safeSetState(() => setLoading(true));
      
      try {
        // Cleanup existing sound
        if (sound) {
          await cleanupSound(sound);
          safeSetState(() => setSound(null));
        }

        if (!isMountedRef.current) return;

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true }
        );

        if (!isMountedRef.current) {
          await cleanupSound(newSound);
          return;
        }

        safeSetState(() => setSound(newSound));
        
        // Set up sound completion callback
        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            safeSetState(() => {
              cleanupSound(newSound);
              setSound(null);
            });
          }
        });

        await newSound.playAsync();
      } catch (error) {
        errorHandler.handleError(error, {
          component: 'useAudioPlayer',
          operation: 'playAudio',
          metadata: { audioUrl }
        });
      } finally {
        currentOperationRef.current = null;
        safeSetState(() => setLoading(false));
      }
    };

    currentOperationRef.current = operation();
    await currentOperationRef.current;
  }, [sound, cleanupSound, safeSetState]);

  const stopAudio = useCallback(async () => {
    if (sound && isMountedRef.current) {
      try {
        await sound.stopAsync();
        await cleanupSound(sound);
        safeSetState(() => setSound(null));
      } catch (error) {
        errorHandler.handleError(error, {
          component: 'useAudioPlayer',
          operation: 'stopAudio',
        });
      }
    }
  }, [sound, cleanupSound, safeSetState]);

  return {
    playAudio,
    stopAudio,
    loading,
    isPlaying: !!sound,
  };
}