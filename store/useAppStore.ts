import { create } from 'zustand';
import { AppState, CandleType, Language } from '@/types';
import * as LZString from 'lz-string';

export interface AppStore extends AppState {
  updateState: (updates: Partial<AppState>) => void;
  resetState: (lang: Language) => void;
}

const getInitialState = (initialLang: Language): AppState => {
  const baseState: AppState = {
    lang: initialLang,
    selectedCakeId: 'elegant-strawberry',
    candleType: CandleType.CLASSIC,
    candleCount: 18,
    digits: '18',
    isExtinguished: false,
    configCompleted: false,
    isBlowing: false,
    blowingProgress: 0,
    customCakes: {},
    userName: '',
    customMessage: '',
    giverName: '',
    isBlowLocked: false,
    blowSensitivity: 60,
    controlsOpen: false,
  };

  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const configParam = urlParams.get('config');
    if (configParam) {
      try {
        const decompressedConfig = LZString.decompressFromEncodedURIComponent(configParam);
        if (decompressedConfig) {
          const parsedConfig = JSON.parse(decompressedConfig);
          return { ...baseState, ...parsedConfig, configCompleted: true };
        }
      } catch (err) {
        console.error('Failed to parse config from URL:', err);
      }
    }
  }

  return baseState;
};

export const useAppStore = create<AppStore>((set) => ({
  ...getInitialState('en'),
  
  updateState: (updates) => set((state) => ({ ...state, ...updates })),
  
  resetState: (lang: Language) => set(() => getInitialState(lang)),
}));
