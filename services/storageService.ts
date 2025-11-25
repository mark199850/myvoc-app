import { STORAGE_KEYS } from "@/constants/app";
import { UserWordList } from "@/types/dictionary";
import AsyncStorage from "@react-native-async-storage/async-storage";

export class StorageService {
  static async getUserWords(): Promise<UserWordList> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_WORDS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Error loading user words:", error);
      return {};
    }
  }

  static async saveUserWords(userWords: UserWordList): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_WORDS,
        JSON.stringify(userWords)
      );
    } catch (error) {
      console.error("Error saving user words:", error);
      throw error;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error("Error clearing data:", error);
      throw error;
    }
  }
}
