import { create } from 'zustand';
import { AppState, CandleType, Language } from '@/types';

export interface AppStore extends AppState {
  updateState: (updates: Partial<AppState>) => void;
  resetState: (lang: Language) => void;
}

// 默认状态值
const defaultState = (initialLang: Language): AppState => ({
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
});

export const useAppStore = create<AppStore>((set) => ({
  ...defaultState('en'), // 初始默认语言为英语
  
  updateState: (updates) => set((state) => ({ ...state, ...updates })),
  
  resetState: (lang: Language) => set(() => defaultState(lang)),
}));
