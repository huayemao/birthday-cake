import { useRef, useCallback, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { detectBlow, DEFAULT_BLOW_CONFIG, cleanupAudioResources, getBlowConfigWithSensitivity } from "@/utils/blowDetection";

export const useBlowDetection = () => {
  const { isExtinguished, configCompleted, isBlowLocked, blowSensitivity, updateState } = useAppStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const blowState = useRef({ blowDuration: 0 });
  const spaceKeyDownTime = useRef<number>(0);
  const spaceKeyTimer = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (audioContextRef.current) {
      cleanupAudioResources(audioContextRef.current);
      audioContextRef.current = null;
      analyserRef.current = null;
    }
    updateState({ isBlowing: false, blowingProgress: 0 });
  }, [updateState]);

  // 初始化麦克风进行吹气检测
  const initMic = useCallback(async () => {
    if (isExtinguished || !configCompleted || isBlowLocked) return;

    if (audioContextRef.current) {
      cleanupAudioResources(audioContextRef.current);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      analyser.fftSize = 256;
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      blowState.current.blowDuration = 0;

      const checkBlow = () => {
        if (!analyserRef.current || isExtinguished || !configCompleted || isBlowLocked) {
          cleanup();
          return;
        }

        const config = getBlowConfigWithSensitivity(blowSensitivity);
        const result = detectBlow(analyserRef.current, config, blowState.current);

        if (result.isBlowing) {
          const progress = Math.min(
            Math.round((blowState.current.blowDuration / config.blowRequiredDuration) * 100),
            100
          );
          updateState({ isBlowing: true, blowingProgress: progress });
          if (result.isExtinguished) {
            handleExtinguish();
          }
        } else {
          updateState({ isBlowing: false, blowingProgress: 0 });
        }

        rafIdRef.current = requestAnimationFrame(checkBlow);
      };

      checkBlow();
    } catch (err) {
      console.warn("Mic access denied:", err);
    }
  }, [isExtinguished, configCompleted, isBlowLocked, blowSensitivity, updateState, cleanup]);

  // 处理蜡烛熄灭
  const handleExtinguish = useCallback(() => {
    updateState({
      isExtinguished: true,
      isBlowing: false,
      blowingProgress: 100,
    });
    cleanup();
  }, [updateState, cleanup]);

  // 处理空格键长按
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space" && configCompleted && !isExtinguished && !isBlowLocked) {
      e.preventDefault();
      spaceKeyDownTime.current = Date.now();

      spaceKeyTimer.current = window.setInterval(() => {
        const duration = (Date.now() - spaceKeyDownTime.current) / 10;
        const progress = Math.min(Math.round((duration / 30) * 100), 100);
        updateState({ isBlowing: true, blowingProgress: progress });

        if (duration >= 30) {
          updateState({
            isExtinguished: true,
            isBlowing: false,
            blowingProgress: 100,
          });
          cleanup();
          if (spaceKeyTimer.current) {
            clearInterval(spaceKeyTimer.current);
            spaceKeyTimer.current = null;
          }
        }
      }, 10);
    }
  }, [configCompleted, isExtinguished, isBlowLocked, updateState, cleanup]);

  // 处理空格键释放
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      if (spaceKeyTimer.current) {
        clearInterval(spaceKeyTimer.current);
        spaceKeyTimer.current = null;
      }
      updateState({ isBlowing: false, blowingProgress: 0 });
    }
  }, [updateState]);

  useEffect(() => {
    initMic();

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      cleanup();
      if (spaceKeyTimer.current) {
        clearInterval(spaceKeyTimer.current);
        spaceKeyTimer.current = null;
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [initMic, handleKeyDown, handleKeyUp, cleanup]);

  return null;
};
