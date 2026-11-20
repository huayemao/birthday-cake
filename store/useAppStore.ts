import { create } from 'zustand';
import { AppState, CandleType } from '@/types';
import {
  BlowCalibrationProfile,
  saveBlowCalibrationProfile,
  clearBlowCalibrationProfile,
} from '@/utils/blowDetection';

export interface AppStore extends AppState {
  blowCalibration: BlowCalibrationProfile | null;
  isCalibratingBlow: boolean;
  updateState: (updates: Partial<AppState>) => void;
  setBlowCalibration: (profile: BlowCalibrationProfile | null) => void;
  hydrateBlowCalibration: (profile: BlowCalibrationProfile | null) => void;
  setIsCalibratingBlow: (active: boolean) => void;
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
  blowCalibration: null,
  isCalibratingBlow: false,

  updateState: (updates) => set((state) => ({ ...state, ...updates })),

  setBlowCalibration: (profile) => {
    if (profile) {
      saveBlowCalibrationProfile(profile);
    } else {
      clearBlowCalibrationProfile();
    }
    set({ blowCalibration: profile });
  },

  hydrateBlowCalibration: (profile) => set({ blowCalibration: profile }),

  setIsCalibratingBlow: (active) => set({ isCalibratingBlow: active }),

  resetState: () =>
    set((state) => ({
      ...defaultState(),
      blowCalibration: state.blowCalibration,
      isCalibratingBlow: false,
    })),
}));
