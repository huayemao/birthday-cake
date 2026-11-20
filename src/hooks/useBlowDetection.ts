import { useRef, useCallback, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import {
  detectBlow,
  createBlowDetectionState,
  cleanupAudioResources,
  getBlowConfigWithSensitivity,
  getRecommendedFftSize,
  RECOMMENDED_SMOOTHING_TIME_CONSTANT,
  BlowDetectionState,
} from "@/utils/blowDetection";

export const useBlowDetection = () => {
  const { isExtinguished, configCompleted, isBlowLocked, blowSensitivity, updateState } = useAppStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const blowStateRef = useRef<BlowDetectionState>(createBlowDetectionState());
  const blowSensitivityRef = useRef<number>(blowSensitivity);
  const lastUiStateRef = useRef<{ isBlowing: boolean; progress: number }>({
    isBlowing: false,
    progress: 0,
  });
  const spaceKeyDownTime = useRef<number>(0);
  const spaceKeyTimer = useRef<number | null>(null);

  // 实时同步灵敏度，避免拖动滑块时重建麦克风流与底噪校准
  useEffect(() => {
    blowSensitivityRef.current = blowSensitivity;
  }, [blowSensitivity]);

  const cleanup = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (audioContextRef.current || mediaStreamRef.current) {
      cleanupAudioResources(audioContextRef.current, mediaStreamRef.current);
      audioContextRef.current = null;
      mediaStreamRef.current = null;
      analyserRef.current = null;
    }
    blowStateRef.current = createBlowDetectionState();
    if (lastUiStateRef.current.isBlowing || lastUiStateRef.current.progress !== 0) {
      lastUiStateRef.current = { isBlowing: false, progress: 0 };
      updateState({ isBlowing: false, blowingProgress: 0 });
    }
  }, [updateState]);

  // 处理蜡烛熄灭
  const handleExtinguish = useCallback(() => {
    lastUiStateRef.current = { isBlowing: false, progress: 100 };
    updateState({
      isExtinguished: true,
      isBlowing: false,
      blowingProgress: 100,
    });
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    if (audioContextRef.current || mediaStreamRef.current) {
      cleanupAudioResources(audioContextRef.current, mediaStreamRef.current);
      audioContextRef.current = null;
      mediaStreamRef.current = null;
      analyserRef.current = null;
    }
    blowStateRef.current = createBlowDetectionState();
  }, [updateState]);

  // 初始化麦克风进行吹气检测
  useEffect(() => {
    if (isExtinguished || !configCompleted || isBlowLocked) {
      cleanup();
      return;
    }

    let cancelled = false;

    const initMic = async () => {
      try {
        // 关闭浏览器默认的降噪、回声消除和自动增益，避免把吹气气流当噪音滤掉，
        // 或在安静环境下被 AGC 放大环境底噪导致误触发
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            },
          });
        } catch (constraintErr) {
          if (
            constraintErr instanceof DOMException &&
            constraintErr.name === "OverconstrainedError"
          ) {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          } else {
            throw constraintErr;
          }
        }

        if (cancelled) {
          cleanupAudioResources(null, stream);
          return;
        }

        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioContext = new AudioCtx();
        if (audioContext.state === "suspended") {
          await audioContext.resume().catch(() => {});
        }

        if (cancelled) {
          cleanupAudioResources(audioContext, stream);
          return;
        }

        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        analyser.fftSize = getRecommendedFftSize(audioContext.sampleRate);
        analyser.smoothingTimeConstant = RECOMMENDED_SMOOTHING_TIME_CONSTANT;
        source.connect(analyser);

        mediaStreamRef.current = stream;
        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        blowStateRef.current = createBlowDetectionState();

        const checkBlow = () => {
          if (cancelled || !analyserRef.current) {
            return;
          }

          const config = getBlowConfigWithSensitivity(blowSensitivityRef.current);
          const result = detectBlow(analyserRef.current, config, blowStateRef.current);

          if (result.isExtinguished) {
            handleExtinguish();
            return;
          }

          if (
            result.isBlowing !== lastUiStateRef.current.isBlowing ||
            result.progress !== lastUiStateRef.current.progress
          ) {
            lastUiStateRef.current = {
              isBlowing: result.isBlowing,
              progress: result.progress,
            };
            updateState({
              isBlowing: result.isBlowing,
              blowingProgress: result.progress,
            });
          }

          rafIdRef.current = requestAnimationFrame(checkBlow);
        };

        rafIdRef.current = requestAnimationFrame(checkBlow);
      } catch (err) {
        console.warn("Mic access denied:", err);
      }
    };

    initMic();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [isExtinguished, configCompleted, isBlowLocked, updateState, cleanup, handleExtinguish]);

  // 处理空格键长按
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat && configCompleted && !isExtinguished && !isBlowLocked) {
        e.preventDefault();
        if (spaceKeyTimer.current) {
          clearInterval(spaceKeyTimer.current);
        }
        spaceKeyDownTime.current = Date.now();

        spaceKeyTimer.current = window.setInterval(() => {
          const duration = (Date.now() - spaceKeyDownTime.current) / 10;
          const progress = Math.min(Math.round((duration / 30) * 100), 100);
          updateState({ isBlowing: true, blowingProgress: progress });

          if (duration >= 30) {
            handleExtinguish();
            if (spaceKeyTimer.current) {
              clearInterval(spaceKeyTimer.current);
              spaceKeyTimer.current = null;
            }
          }
        }, 10);
      }
    },
    [configCompleted, isExtinguished, isBlowLocked, updateState, handleExtinguish]
  );

  // 处理空格键释放
  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (spaceKeyTimer.current) {
          clearInterval(spaceKeyTimer.current);
          spaceKeyTimer.current = null;
        }
        updateState({ isBlowing: false, blowingProgress: 0 });
      }
    },
    [updateState]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      if (spaceKeyTimer.current) {
        clearInterval(spaceKeyTimer.current);
        spaceKeyTimer.current = null;
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return null;
};
