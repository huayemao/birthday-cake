import { create } from 'zustand';
import { AppState, CandleType, Language } from '@/types';

export interface AppStore extends AppState {
  updateState: (updates: Partial<AppState>) => void;
  resetState: () => void;
}

const defaultState = (): AppState => ({
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
});

export const useAppStore = create<AppStore>((set) => ({
  ...defaultState(),
  
  updateState: (updates) => set((state) => ({ ...state, ...updates })),
  
  resetState: () => set(() => defaultState()),
}));
