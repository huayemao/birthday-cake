import { useRef, useCallback, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { detectBlow, DEFAULT_BLOW_CONFIG, cleanupAudioResources } from "@/utils/blowDetection";

export const useBlowDetection = () => {
  const { isExtinguished, configCompleted, updateState } = useAppStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const blowState = useRef({ blowDuration: 0 });
  const spaceKeyDownTime = useRef<number>(0);
  const spaceKeyTimer = useRef<number | null>(null);

  // 初始化麦克风进行吹气检测
  const initMic = useCallback(async () => {
    if (isExtinguished || !configCompleted) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      analyser.fftSize = 256;
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const checkBlow = () => {
        if (!analyserRef.current || isExtinguished || !configCompleted) {
          cleanupAudioResources(audioContextRef.current);
          audioContextRef.current = null;
          analyserRef.current = null;
          updateState({ isBlowing: false, blowingProgress: 0 });
          return;
        }

        const result = detectBlow(analyserRef.current, DEFAULT_BLOW_CONFIG, blowState.current);

        if (result.isBlowing) {
          const progress = Math.min(
            Math.round((blowState.current.blowDuration / DEFAULT_BLOW_CONFIG.blowRequiredDuration) * 100),
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
  }, [isExtinguished, configCompleted, updateState]);

  // 处理蜡烛熄灭
  const handleExtinguish = () => {
    updateState({
      isExtinguished: true,
      isBlowing: false,
      blowingProgress: 100,
    });
    cleanupAudioResources(audioContextRef.current);
    audioContextRef.current = null;
    analyserRef.current = null;
  };

  // 处理空格键长按
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space" && configCompleted && !isExtinguished) {
      e.preventDefault();
      spaceKeyDownTime.current = Date.now();

      // 开始空格键长按检测
      spaceKeyTimer.current = window.setInterval(() => {
        const duration = (Date.now() - spaceKeyDownTime.current) / 10;
        const progress = Math.min(Math.round((duration / DEFAULT_BLOW_CONFIG.blowRequiredDuration) * 100), 100);
        console.log(duration)
        updateState({ isBlowing: true, blowingProgress: progress });

        // 达到吹灭所需时间
        if (duration >= DEFAULT_BLOW_CONFIG.blowRequiredDuration) {
          handleExtinguish();
          if (spaceKeyTimer.current) {
            clearInterval(spaceKeyTimer.current);
            spaceKeyTimer.current = null;
          }
        }
      }, 10);
    }
  }, [configCompleted, isExtinguished, updateState]);

  // 处理空格键释放
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      if (spaceKeyTimer.current) {
        clearInterval(spaceKeyTimer.current);
        spaceKeyTimer.current = null;
      }
      // 重置吹气状态
      updateState({ isBlowing: false, blowingProgress: 0 });
    }
  }, [updateState]);

  // 初始化和清理
  useEffect(() => {
    initMic();

    // 添加键盘事件监听
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
      }
      if (spaceKeyTimer.current) {
        clearInterval(spaceKeyTimer.current);
        spaceKeyTimer.current = null;
      }
      updateState({ isBlowing: false });
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [initMic, handleKeyDown, handleKeyUp, updateState]);

  return null;
};
