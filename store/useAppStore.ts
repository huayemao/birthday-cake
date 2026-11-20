import { create } from 'zustand';
import { AppState, CandleType, CelebrationSfxStyle } from '@/types';
import {
  BlowCalibrationProfile,
  saveBlowCalibrationProfile,
  clearBlowCalibrationProfile,
} from '@/utils/blowDetection';
import { MusicStyle } from '@/utils/birthdayAudio';

export type RenderModePreference = 'auto' | '3d' | '2d';

export interface AppStore extends AppState {
  blowCalibration: BlowCalibrationProfile | null;
  isCalibratingBlow: boolean;
  renderMode: RenderModePreference;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicStyle: MusicStyle;
  celebrationSfxStyle: CelebrationSfxStyle;
  updateState: (updates: Partial<AppState>) => void;
  setBlowCalibration: (profile: BlowCalibrationProfile | null) => void;
  hydrateBlowCalibration: (profile: BlowCalibrationProfile | null) => void;
  setIsCalibratingBlow: (active: boolean) => void;
  setRenderMode: (mode: RenderModePreference) => void;
  setMusicEnabled: (enabled: boolean) => void;
  setSfxEnabled: (enabled: boolean) => void;
  setMusicStyle: (style: MusicStyle) => void;
  setCelebrationSfxStyle: (style: CelebrationSfxStyle) => void;
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
  cardStyle: 'cream-rose',
  sceneTheme: 'fairy-lights',
  celebrationSfxStyle: 'grand-party',
});

export const useAppStore = create<AppStore>((set) => ({
  ...defaultState(),
  blowCalibration: null,
  isCalibratingBlow: false,
  renderMode: 'auto',
  musicEnabled: true,
  sfxEnabled: true,
  musicStyle: 'musicbox',
  celebrationSfxStyle: 'grand-party',

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

  setRenderMode: (renderMode) => set({ renderMode }),

  setMusicEnabled: (musicEnabled) => set({ musicEnabled }),

  setSfxEnabled: (sfxEnabled) => set({ sfxEnabled }),

  setMusicStyle: (musicStyle) => set({ musicStyle }),

  setCelebrationSfxStyle: (celebrationSfxStyle) => set({ celebrationSfxStyle }),

  resetState: () =>
    set((state) => ({
      ...defaultState(),
      blowCalibration: state.blowCalibration,
      isCalibratingBlow: false,
      renderMode: state.renderMode,
      musicEnabled: state.musicEnabled,
      sfxEnabled: state.sfxEnabled,
      musicStyle: state.musicStyle,
      celebrationSfxStyle: state.celebrationSfxStyle,
    })),
}));
