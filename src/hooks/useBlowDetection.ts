import { useRef, useCallback, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import {
  detectBlow,
  createBlowDetectionState,
  cleanupAudioResources,
  getBlowConfigWithSensitivity,
  getRecommendedFftSize,
  loadBlowCalibrationProfile,
  requestRawMicStream,
  RECOMMENDED_SMOOTHING_TIME_CONSTANT,
  BlowDetectionState,
  BlowCalibrationProfile,
} from "@/utils/blowDetection";

export const useBlowDetection = () => {
  const {
    isExtinguished,
    configCompleted,
    isBlowLocked,
    blowSensitivity,
    blowCalibration,
    isCalibratingBlow,
    updateState,
    hydrateBlowCalibration,
  } = useAppStore();

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const blowStateRef = useRef<BlowDetectionState>(createBlowDetectionState());
  const blowSensitivityRef = useRef<number>(blowSensitivity);
  const blowCalibrationRef = useRef<BlowCalibrationProfile | null>(blowCalibration);
  const lastUiStateRef = useRef<{ isBlowing: boolean; progress: number }>({
    isBlowing: false,
    progress: 0,
  });
  const spaceKeyDownTime = useRef<number>(0);
  const spaceKeyTimer = useRef<number | null>(null);

  // 客户端首次挂载时加载本地保存的吹气采样校准配置
  useEffect(() => {
    const saved = loadBlowCalibrationProfile();
    if (saved) {
      hydrateBlowCalibration(saved);
    }
  }, [hydrateBlowCalibration]);

  // 实时同步灵敏度与采样校准配置，无需重启麦克风流
  useEffect(() => {
    blowSensitivityRef.current = blowSensitivity;
  }, [blowSensitivity]);

  useEffect(() => {
    blowCalibrationRef.current = blowCalibration;
  }, [blowCalibration]);

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

  // 初始化麦克风进行吹气检测（采样校准期间暂停，避免移动端双流冲突）
  useEffect(() => {
    if (isExtinguished || !configCompleted || isBlowLocked || isCalibratingBlow) {
      cleanup();
      return;
    }

    let cancelled = false;

    const initMic = async () => {
      try {
        const stream = await requestRawMicStream();

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
          const result = detectBlow(
            analyserRef.current,
            config,
            blowStateRef.current,
            undefined,
            blowCalibrationRef.current
          );

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
  }, [
    isExtinguished,
    configCompleted,
    isBlowLocked,
    isCalibratingBlow,
    updateState,
    cleanup,
    handleExtinguish,
  ]);

  // 处理空格键长按
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.code === "Space" &&
        !e.repeat &&
        configCompleted &&
        !isExtinguished &&
        !isBlowLocked &&
        !isCalibratingBlow
      ) {
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
    [configCompleted, isExtinguished, isBlowLocked, isCalibratingBlow, updateState, handleExtinguish]
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
