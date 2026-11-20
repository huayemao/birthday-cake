"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { birthdayAudio, MusicStyle } from "@/utils/birthdayAudio";
import { CelebrationSfxStyle } from "@/types";

const CELEBRATION_STYLE_ORDER: CelebrationSfxStyle[] = [
  "grand-party",
  "fireworks-show",
  "fairy-chimes",
  "carnival-cheer",
  "warm-applause",
];

/**
 * 协调生日背景音乐（未吹灭时播放《生日快乐歌》）与吹灭后多款庆祝音效套件，
 * 自动处理浏览器首次交互解锁，并在麦克风吹气校准期间自动静音避让。
 */
export function useBirthdayAudio() {
  const {
    isExtinguished,
    isBlowing,
    isCalibratingBlow,
    musicEnabled,
    sfxEnabled,
    musicStyle,
    celebrationSfxStyle,
    setMusicEnabled,
    setSfxEnabled,
    setMusicStyle,
    setCelebrationSfxStyle,
  } = useAppStore();

  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const prevExtinguishedRef = useRef<boolean>(isExtinguished);
  const prevCalibratingRef = useRef<boolean>(isCalibratingBlow);

  useEffect(() => {
    birthdayAudio.setMusicStyle(musicStyle);
  }, [musicStyle]);

  useEffect(() => {
    birthdayAudio.setMusicEnabled(musicEnabled && !isCalibratingBlow);
  }, [musicEnabled, isCalibratingBlow]);

  useEffect(() => {
    birthdayAudio.setSfxEnabled(sfxEnabled && !isCalibratingBlow);
  }, [sfxEnabled, isCalibratingBlow]);

  useEffect(() => {
    birthdayAudio.setDucked(isBlowing);
  }, [isBlowing]);

  // 首次用户交互解锁 AudioContext
  useEffect(() => {
    const handleFirstGesture = async () => {
      const ok = await birthdayAudio.unlock();
      if (ok) {
        setAudioUnlocked(true);
        const state = useAppStore.getState();
        if (state.musicEnabled && !state.isExtinguished && !state.isCalibratingBlow) {
          birthdayAudio.startBirthdaySong();
        }
        window.removeEventListener("pointerdown", handleFirstGesture);
        window.removeEventListener("keydown", handleFirstGesture);
      }
    };

    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };
  }, []);

  // 监听吹灭/重新点亮，切换生日快乐歌与当前选中的庆祝音效套件
  useEffect(() => {
    const wasExtinguished = prevExtinguishedRef.current;
    prevExtinguishedRef.current = isExtinguished;

    if (!wasExtinguished && isExtinguished) {
        const activeStyle = useAppStore.getState().celebrationSfxStyle;
        birthdayAudio.playCelebrationSuite(activeStyle).then(() => {
          if (birthdayAudio.isUnlocked()) setAudioUnlocked(true);
        });
      } else if (wasExtinguished && !isExtinguished) {
        birthdayAudio.playRelightSfx().then(() => {
          if (birthdayAudio.isUnlocked()) setAudioUnlocked(true);
        });
        if (musicEnabled && !isCalibratingBlow) {
          window.setTimeout(() => {
            const s = useAppStore.getState();
            if (!s.isExtinguished && s.musicEnabled && !s.isCalibratingBlow) {
              birthdayAudio.startBirthdaySong();
            }
          }, 420);
        }
      }
    }, [isExtinguished, musicEnabled, isCalibratingBlow]);

  useEffect(() => {
    const wasCalibrating = prevCalibratingRef.current;
    prevCalibratingRef.current = isCalibratingBlow;

    if (!wasCalibrating && isCalibratingBlow) {
      birthdayAudio.stopBirthdaySong(0.1);
    } else if (wasCalibrating && !isCalibratingBlow && !isExtinguished && musicEnabled && audioUnlocked) {
      birthdayAudio.startBirthdaySong();
    }
  }, [isCalibratingBlow, isExtinguished, musicEnabled, audioUnlocked]);

  useEffect(() => {
    if (!audioUnlocked) return;
    if (musicEnabled && !isExtinguished && !isCalibratingBlow) {
      birthdayAudio.startBirthdaySong();
    } else if (!musicEnabled) {
      birthdayAudio.stopBirthdaySong(0.2);
    }
  }, [musicEnabled, audioUnlocked, isExtinguished, isCalibratingBlow]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        birthdayAudio.stopBirthdaySong(0.15);
        birthdayAudio.clearCelebrationTimers();
      } else {
        const s = useAppStore.getState();
        if (s.musicEnabled && !s.isExtinguished && !s.isCalibratingBlow && birthdayAudio.isUnlocked()) {
          birthdayAudio.startBirthdaySong();
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      birthdayAudio.stopBirthdaySong(0.15);
      birthdayAudio.clearCelebrationTimers();
    };
  }, []);

  const toggleMusic = useCallback(async () => {
    const next = !musicEnabled;
    setMusicEnabled(next);
    if (next) {
      const ok = await birthdayAudio.unlock();
      if (ok) {
        setAudioUnlocked(true);
        if (!isExtinguished && !isCalibratingBlow) {
          birthdayAudio.startBirthdaySong();
        }
      }
    } else {
      birthdayAudio.stopBirthdaySong(0.2);
    }
  }, [musicEnabled, setMusicEnabled, isExtinguished, isCalibratingBlow]);

  const cycleMusicStyle = useCallback(async () => {
    const order: MusicStyle[] = ["musicbox", "piano", "chimes"];
    const next = order[(order.indexOf(musicStyle) + 1) % order.length];
    setMusicStyle(next);
    if (!musicEnabled) {
      setMusicEnabled(true);
    }
    const ok = await birthdayAudio.unlock();
    if (ok) {
      setAudioUnlocked(true);
      if (!isExtinguished && !isCalibratingBlow) {
        birthdayAudio.startBirthdaySong();
      }
    }
  }, [musicStyle, musicEnabled, setMusicStyle, setMusicEnabled, isExtinguished, isCalibratingBlow]);

  const cycleCelebrationSfxStyle = useCallback(async () => {
    const next =
      CELEBRATION_STYLE_ORDER[
      (CELEBRATION_STYLE_ORDER.indexOf(celebrationSfxStyle) + 1) %
      CELEBRATION_STYLE_ORDER.length
      ];
    setCelebrationSfxStyle(next);
    if (!sfxEnabled) setSfxEnabled(true);
    const ok = await birthdayAudio.unlock();
    if (ok) setAudioUnlocked(true);
    birthdayAudio.previewCelebrationStyle(next);
  }, [celebrationSfxStyle, sfxEnabled, setCelebrationSfxStyle, setSfxEnabled]);

  const toggleSfx = useCallback(() => {
    setSfxEnabled(!sfxEnabled);
  }, [sfxEnabled, setSfxEnabled]);

  const triggerCheerBurst = useCallback(async () => {
    if (!sfxEnabled) setSfxEnabled(true);
    const ok = await birthdayAudio.unlock();
    if (ok) setAudioUnlocked(true);
    birthdayAudio.playExtraCheerBurst(useAppStore.getState().celebrationSfxStyle);
  }, [sfxEnabled, setSfxEnabled]);

  return {
    audioUnlocked,
    musicEnabled,
    sfxEnabled,
    musicStyle,
    celebrationSfxStyle,
    toggleMusic,
    cycleMusicStyle,
    cycleCelebrationSfxStyle,
    toggleSfx,
    triggerCheerBurst,
  };
}
