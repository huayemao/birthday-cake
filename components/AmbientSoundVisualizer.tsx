"use client";

import React, { useEffect, useRef } from "react";
import { subscribeBlowVisual } from "@/utils/soundVisualBus";

interface SoundVisualizerProps {
  active: boolean;
}

// 15 根对称镜像波形柱，对应 5 个频段（由中心向两侧柔滑衰减）
const MIRROR_BAR_CONFIG: ReadonlyArray<{ bandIndex: number; weight: number }> = [
  { bandIndex: 4, weight: 0.45 },
  { bandIndex: 3, weight: 0.62 },
  { bandIndex: 2, weight: 0.78 },
  { bandIndex: 1, weight: 0.88 },
  { bandIndex: 0, weight: 0.94 },
  { bandIndex: 1, weight: 0.98 },
  { bandIndex: 2, weight: 1.0 },
  { bandIndex: 0, weight: 1.0 },
  { bandIndex: 2, weight: 1.0 },
  { bandIndex: 1, weight: 0.98 },
  { bandIndex: 0, weight: 0.94 },
  { bandIndex: 1, weight: 0.88 },
  { bandIndex: 2, weight: 0.78 },
  { bandIndex: 3, weight: 0.62 },
  { bandIndex: 4, weight: 0.45 },
];

/**
 * 蛋糕舞台内置环境声波可视化（零 React 重渲染，60fps 直接更新 DOM 样式）：
 * - 静默时隐形，保持画面纯净；
 * - 有任何“风吹草动”（说话、唱生日歌、拍手、微弱气流）时，蛋糕背后浮现暖金色呼吸声波光环，
 *   舞台底部浮现对称半透明声波律动条；
 * - 识别为有效吹气时，平滑切换为粉玫瑰气流色彩并增强幅度。
 */
export const CakeSoundAura: React.FC<SoundVisualizerProps> = ({ active }) => {
  const outerRingRef = useRef<HTMLDivElement>(null);
  const innerRingRef = useRef<HTMLDivElement>(null);
  const waveContainerRef = useRef<HTMLDivElement>(null);
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const resetDom = () => {
      if (outerRingRef.current) {
        outerRingRef.current.style.opacity = "0";
        outerRingRef.current.style.transform = "translate(-50%, -50%) scale(0.86)";
      }
      if (innerRingRef.current) {
        innerRingRef.current.style.opacity = "0";
        innerRingRef.current.style.transform = "translate(-50%, -50%) scale(0.9)";
      }
      if (waveContainerRef.current) {
        waveContainerRef.current.style.opacity = "0";
      }
      barRefs.current.forEach((bar) => {
        if (bar) {
          bar.style.transform = "scaleY(0.15)";
        }
      });
    };

    if (!active) {
      resetDom();
      return;
    }

    return subscribeBlowVisual((frame) => {
      const level = frame.active ? frame.soundLevel : 0;
      const isBlowing = frame.isBlowing;
      const visible = level > 0.02 || isBlowing;

      if (!visible) {
        resetDom();
        return;
      }

      const ringColor = isBlowing
        ? "rgba(244, 114, 182, 0.42)"
        : "rgba(251, 191, 36, 0.34)";
      const ringGlow = isBlowing
        ? "0 0 36px rgba(244, 114, 182, 0.32)"
        : "0 0 28px rgba(251, 191, 36, 0.22)";

      if (outerRingRef.current) {
        const outerScale = 0.86 + level * 0.24;
        const outerOpacity = Math.min(0.85, level * (isBlowing ? 1.1 : 0.78));
        outerRingRef.current.style.opacity = outerOpacity.toFixed(3);
        outerRingRef.current.style.transform = `translate(-50%, -50%) scale(${outerScale.toFixed(3)})`;
        outerRingRef.current.style.borderColor = ringColor;
        outerRingRef.current.style.boxShadow = ringGlow;
      }

      if (innerRingRef.current) {
        const innerScale = 0.88 + level * 0.14;
        const innerOpacity = Math.min(0.65, level * (isBlowing ? 0.9 : 0.55));
        innerRingRef.current.style.opacity = innerOpacity.toFixed(3);
        innerRingRef.current.style.transform = `translate(-50%, -50%) scale(${innerScale.toFixed(3)})`;
        innerRingRef.current.style.borderColor = isBlowing
          ? "rgba(251, 113, 133, 0.35)"
          : "rgba(253, 224, 71, 0.28)";
      }

      if (waveContainerRef.current) {
        const waveOpacity = Math.min(0.95, Math.max(0.18, level * 1.45));
        waveContainerRef.current.style.opacity = waveOpacity.toFixed(3);
      }

      const barGradient = isBlowing
        ? "linear-gradient(to top, rgba(244, 114, 182, 0.9), rgba(251, 146, 60, 0.95))"
        : "linear-gradient(to top, rgba(251, 191, 36, 0.65), rgba(254, 240, 138, 0.9))";

      for (let i = 0; i < MIRROR_BAR_CONFIG.length; i++) {
        const bar = barRefs.current[i];
        if (!bar) continue;
        const { bandIndex, weight } = MIRROR_BAR_CONFIG[i];
        const bandVal = Math.max(frame.bands[bandIndex], level * 0.45);
        const scaleY = Math.min(1, 0.14 + bandVal * weight * 0.86);
        bar.style.transform = `scaleY(${scaleY.toFixed(3)})`;
        bar.style.background = barGradient;
      }
    });
  }, [active]);

  if (!active) return null;

  return (
    <>
      {/* 蛋糕背后的同心声波光环（有声音时柔和扩散） */}
      <div
        ref={outerRingRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 w-[78%] h-[78%] rounded-full border transition-colors duration-200 will-change-transform"
        style={{
          opacity: 0,
          transform: "translate(-50%, -50%) scale(0.86)",
          borderColor: "rgba(251, 191, 36, 0.3)",
        }}
      />
      <div
        ref={innerRingRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 w-[62%] h-[62%] rounded-full border transition-colors duration-200 will-change-transform"
        style={{
          opacity: 0,
          transform: "translate(-50%, -50%) scale(0.9)",
          borderColor: "rgba(253, 224, 71, 0.24)",
        }}
      />

      {/* 蛋糕舞台底部半透明对称声波律动带 */}
      <div
        ref={waveContainerRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-end justify-center gap-1 h-7 px-3 transition-opacity duration-150"
        style={{ opacity: 0 }}
      >
        {MIRROR_BAR_CONFIG.map((_, idx) => (
          <span
            key={idx}
            ref={(el) => {
              barRefs.current[idx] = el;
            }}
            className="w-1 h-full rounded-full origin-bottom will-change-transform"
            style={{
              transform: "scaleY(0.15)",
              background:
                "linear-gradient(to top, rgba(251, 191, 36, 0.65), rgba(254, 240, 138, 0.9))",
            }}
          />
        ))}
      </div>
    </>
  );
};

const PROMPT_BAR_ORDER: ReadonlyArray<number> = [0, 2, 1, 3, 4];

/**
 * 底部吹气提示胶囊内的迷你 5 柱声波指示器：
 * 让用户在麦克风静默/听到环境声/识别为吹气之间一目了然。
 */
export const PromptSoundWave: React.FC<SoundVisualizerProps> = ({ active }) => {
  const barRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const setIdle = () => {
      barRefs.current.forEach((bar) => {
        if (bar) {
          bar.style.transform = "scaleY(0.24)";
          bar.style.backgroundColor = "rgba(148, 163, 184, 0.55)";
        }
      });
    };

    if (!active) {
      setIdle();
      return;
    }

    return subscribeBlowVisual((frame) => {
      const level = frame.active ? frame.soundLevel : 0;
      const isBlowing = frame.isBlowing;
      const hasAmbientSound = level > 0.03;

      const color = isBlowing
        ? "#ec4899"
        : hasAmbientSound
        ? "#f59e0b"
        : "rgba(148, 163, 184, 0.55)";

      for (let i = 0; i < PROMPT_BAR_ORDER.length; i++) {
        const bar = barRefs.current[i];
        if (!bar) continue;
        const bandVal = Math.max(frame.bands[PROMPT_BAR_ORDER[i]], level * 0.5);
        const scaleY = hasAmbientSound || isBlowing ? Math.min(1, 0.24 + bandVal * 0.76) : 0.24;
        bar.style.transform = `scaleY(${scaleY.toFixed(3)})`;
        bar.style.backgroundColor = color;
      }
    });
  }, [active]);

  if (!active) return null;

  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center justify-center gap-[2.5px] h-4 w-5 shrink-0"
    >
      {PROMPT_BAR_ORDER.map((_, idx) => (
        <span
          key={idx}
          ref={(el) => {
            barRefs.current[idx] = el;
          }}
          className="w-[2.5px] h-full rounded-full origin-center will-change-transform transition-colors duration-150"
          style={{
            transform: "scaleY(0.24)",
            backgroundColor: "rgba(148, 163, 184, 0.55)",
          }}
        />
      ))}
    </span>
  );
};
