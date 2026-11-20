"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { birthdayAudio, MusicStyle } from "@/utils/birthdayAudio";

/**
 * 协调生日背景音乐（未吹灭时播放《生日快乐歌》）与吹灭后庆祝音效套件，
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
    setMusicEnabled,
    setSfxEnabled,
    setMusicStyle,
  } = useAppStore();

  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const prevExtinguishedRef = useRef<boolean>(isExtinguished);
  const prevCalibratingRef = useRef<boolean>(isCalibratingBlow);

  // 同步音乐/音效开关与风格
  useEffect(() => {
    birthdayAudio.setMusicStyle(musicStyle);
  }, [musicStyle]);

  useEffect(() => {
    birthdayAudio.setMusicEnabled(musicEnabled && !isCalibratingBlow);
  }, [musicEnabled, isCalibratingBlow]);

  useEffect(() => {
    birthdayAudio.setSfxEnabled(sfxEnabled && !isCalibratingBlow);
  }, [sfxEnabled, isCalibratingBlow]);

  // 吹气时适度压低背景音乐音量，让体验更自然
  useEffect(() => {
    birthdayAudio.setDucked(isBlowing);
  }, [isBlowing]);

  // 首次用户交互时自动解锁 AudioContext 并按当前状态启动音乐
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

  // 监听吹灭/重新点亮状态变化，自动切换生日歌与庆祝音效交响
  useEffect(() => {
    const wasExtinguished = prevExtinguishedRef.current;
    prevExtinguishedRef.current = isExtinguished;

    if (!wasExtinguished && isExtinguished) {
      // 刚吹灭蜡烛 -> 淡出生日快乐歌并触发全套庆祝音效
      birthdayAudio.playCelebrationSuite().then(() => {
        if (birthdayAudio.isUnlocked()) setAudioUnlocked(true);
      });
    } else if (wasExtinguished && !isExtinguished) {
      // 重新点亮 -> 点火音效 + 恢复生日快乐歌
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

  // 校准麦克风时暂停音乐，结束后恢复
  useEffect(() => {
    const wasCalibrating = prevCalibratingRef.current;
    prevCalibratingRef.current = isCalibratingBlow;

    if (!wasCalibrating && isCalibratingBlow) {
      birthdayAudio.stopBirthdaySong(0.1);
    } else if (wasCalibrating && !isCalibratingBlow && !isExtinguished && musicEnabled && audioUnlocked) {
      birthdayAudio.startBirthdaySong();
    }
  }, [isCalibratingBlow, isExtinguished, musicEnabled, audioUnlocked]);

  // 开关音乐时立即启停
  useEffect(() => {
    if (!audioUnlocked) return;
    if (musicEnabled && !isExtinguished && !isCalibratingBlow) {
      birthdayAudio.startBirthdaySong();
    } else if (!musicEnabled) {
      birthdayAudio.stopBirthdaySong(0.2);
    }
  }, [musicEnabled, audioUnlocked, isExtinguished, isCalibratingBlow]);

  // 页面切后台时静音节能，回前台恢复
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

  const toggleSfx = useCallback(() => {
    setSfxEnabled(!sfxEnabled);
  }, [sfxEnabled, setSfxEnabled]);

  const triggerCheerBurst = useCallback(async () => {
    if (!sfxEnabled) setSfxEnabled(true);
    const ok = await birthdayAudio.unlock();
    if (ok) setAudioUnlocked(true);
    birthdayAudio.playExtraCheerBurst();
  }, [sfxEnabled, setSfxEnabled]);

  return {
    audioUnlocked,
    musicEnabled,
    sfxEnabled,
    musicStyle,
    toggleMusic,
    cycleMusicStyle,
    toggleSfx,
    triggerCheerBurst,
  };
}
