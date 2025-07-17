import { useReducer, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StorageService } from '@/services/storageService';
import { LanguageService } from '@/services/languageService';
import { Language, UserWordList } from '@/types/dictionary';
import { errorHandler } from '@/utils/errorUtils';

interface UserWordsState {
  languages: Language[];
  userWords: UserWordList;
  loading: boolean;
  refreshing: boolean;
}

type UserWordsAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'SET_DATA'; payload: { languages: Language[]; userWords: UserWordList } }
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: { languages: Language[]; userWords: UserWordList } }
  | { type: 'LOAD_ERROR' }
  | { type: 'REFRESH_START' }
  | { type: 'REFRESH_END' };

const initialState: UserWordsState = {
  languages: [],
  userWords: {},
  loading: true,
  refreshing: false,
};

function userWordsReducer(state: UserWordsState, action: UserWordsAction): UserWordsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_REFRESHING':
      return { ...state, refreshing: action.payload };
    
    case 'SET_DATA':
      return {
        ...state,
        languages: action.payload.languages,
        userWords: action.payload.userWords,
      };
    
    case 'LOAD_START':
      return { ...state, loading: true };
    
    case 'LOAD_SUCCESS':
      return {
        ...state,
        loading: false,
        languages: action.payload.languages,
        userWords: action.payload.userWords,
      };
    
    case 'LOAD_ERROR':
      return { ...state, loading: false };
    
    case 'REFRESH_START':
      return { ...state, refreshing: true };
    
    case 'REFRESH_END':
      return { ...state, refreshing: false };
    
    default:
      return state;
  }
}

export function useUserWords() {
  const [state, dispatch] = useReducer(userWordsReducer, initialState);

  const loadData = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    
    try {
      const [userLanguages, words] = await Promise.all([
        LanguageService.getUserLanguages(),
        StorageService.getUserWords()
      ]);
      
      dispatch({
        type: 'LOAD_SUCCESS',
        payload: { languages: userLanguages, userWords: words }
      });
    } catch (error) {
      errorHandler.handleError(error, {
        component: 'useUserWords',
        operation: 'loadData',
      });
      dispatch({ type: 'LOAD_ERROR' });
    }
  }, []);

  const refresh = useCallback(async () => {
    dispatch({ type: 'REFRESH_START' });
    
    try {
      const [userLanguages, words] = await Promise.all([
        LanguageService.getUserLanguages(),
        StorageService.getUserWords()
      ]);
      
      dispatch({
        type: 'LOAD_SUCCESS',
        payload: { languages: userLanguages, userWords: words }
      });
    } catch (error) {
      errorHandler.handleError(error, {
        component: 'useUserWords',
        operation: 'refresh',
      });
    } finally {
      dispatch({ type: 'REFRESH_END' });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  return {
    languages: state.languages,
    userWords: state.userWords,
    loading: state.loading,
    refreshing: state.refreshing,
    refresh,
    reload: loadData,
  };
}