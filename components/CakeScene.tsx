"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { AppState, CandleType, CelebrationSfxStyle, Translation, Language } from "../types";
import { CAKES, FlameSVG } from "../constants";
import Fireworks from "./Fireworks";
import { CakeSoundAura } from "./AmbientSoundVisualizer";
import { subscribeBlowVisual } from "@/utils/soundVisualBus";
import { detectWebGLSupport, WebGLSupportInfo } from "@/utils/webglSupport";
import { CakeScene3DBoundary } from "./CakeScene3DBoundary";
import { useAppStore } from "@/store/useAppStore";
import { MusicStyle } from "@/utils/birthdayAudio";

const CakeScene3D = dynamic(() => import("./CakeScene3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-pink-200/70">
      <div className="w-11 h-11 rounded-full border-2 border-pink-400/30 border-t-pink-400 animate-spin" />
      <span className="text-xs tracking-widest uppercase">3D Cake</span>
    </div>
  ),
});

export interface AudioControlActions {
  audioUnlocked: boolean;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicStyle: MusicStyle;
  celebrationSfxStyle: CelebrationSfxStyle;
  toggleMusic: () => void;
  cycleMusicStyle: () => void;
  cycleCelebrationSfxStyle: () => void;
  toggleSfx: () => void;
  triggerCheerBurst: () => void;
}

export type CakeSceneMode = "home-preview" | "active-stage" | "configure-preview";

interface CakeSceneProps {
  state: AppState;
  t: Translation;
  updateState: (updates: Partial<AppState>) => void;
  lang: Language;
  mode?: CakeSceneMode;
  audio?: AudioControlActions;
  /** 场景模式下菜单是否可见（点击屏幕唤出，一段时间后自动隐藏） */
  controlsVisible?: boolean;
  /** 用户点击/轻触画布时触发（用于唤出隐藏菜单） */
  onStageTap?: () => void;
  /** 与顶部按钮交互时刷新自动隐藏计时 */
  onControlsInteract?: () => void;
}

const MUSIC_STYLE_LABELS: Record<MusicStyle, { zh: string; en: string }> = {
  musicbox: { zh: "八音盒", en: "Music Box" },
  piano: { zh: "钢琴", en: "Piano" },
  chimes: { zh: "梦幻风铃", en: "Chimes" },
};

const CELEBRATION_SFX_LABELS: Record<CelebrationSfxStyle, { zh: string; en: string }> = {
  "grand-party": { zh: "盛大派对", en: "Grand Party" },
  "fireworks-show": { zh: "璀璨烟花", en: "Fireworks" },
  "fairy-chimes": { zh: "梦幻星铃", en: "Fairy Chimes" },
  "carnival-cheer": { zh: "欢呼彩炮", en: "Carnival" },
  "warm-applause": { zh: "温馨掌声", en: "Applause" },
};

const CakeScene: React.FC<CakeSceneProps> = ({
  state,
  t,
  updateState,
  lang,
  mode = "active-stage",
  audio,
  controlsVisible = true,
  onStageTap,
  onControlsInteract,
}) => {
  const { blowingProgress, configCompleted, isBlowing, isBlowLocked } = state;
  const { renderMode, setRenderMode } = useAppStore();

  const isHomePreview = mode === "home-preview";
  const isConfigurePreview = mode === "configure-preview";
  const isActiveStage = mode === "active-stage";

  // 主页预览与配置页预览始终保持新鲜点亮状态，不出现吹灭与“重新点亮”按钮
  const effectiveExtinguished = isActiveStage ? state.isExtinguished : false;
  const effectiveBlowing = isActiveStage ? isBlowing : false;
  const effectiveProgress = isActiveStage ? blowingProgress : 0;

  const [showFireworks, setShowFireworks] = useState(false);
  const [showResetUI, setShowResetUI] = useState(false);
  const [webglInfo, setWebglInfo] = useState<WebGLSupportInfo | null>(null);
  const [runtime3DFailed, setRuntime3DFailed] = useState(false);
  const [cheerBurstKey, setCheerBurstKey] = useState(0);

  const candleOverlayRef = useRef<HTMLDivElement>(null);
  const ambientGlowRef = useRef<HTMLDivElement>(null);
  const isListeningSound = isActiveStage && configCompleted && !effectiveExtinguished && !isBlowLocked;
  const isZh = lang === "zh" || lang === "zh-Hant";

  useEffect(() => {
    const info = detectWebGLSupport();
    setWebglInfo(info);
  }, []);

  const canUse3D = Boolean(webglInfo?.supported && !runtime3DFailed);
  const use3D = canUse3D && renderMode !== "2d";

  const handleFallbackTo2D = useCallback((reason?: string) => {
    if (reason) {
      console.warn("[CakeScene] Falling back to 2D cake scene:", reason);
    }
    setRuntime3DFailed(true);
  }, []);

  // 2D 模式下实时环境声波律动
  useEffect(() => {
    const resetVisual = () => {
      if (candleOverlayRef.current) {
        candleOverlayRef.current.style.setProperty("--sound-tremor", "0");
      }
      if (ambientGlowRef.current) {
        ambientGlowRef.current.style.transform = "translate(-50%, -50%) scale(1)";
        ambientGlowRef.current.style.opacity = "1";
      }
    };

    if (!isListeningSound) {
      resetVisual();
      return;
    }

    return subscribeBlowVisual((frame) => {
      const level = frame.active ? frame.soundLevel : 0;
      if (candleOverlayRef.current) {
        candleOverlayRef.current.style.setProperty("--sound-tremor", level.toFixed(3));
      }
      if (ambientGlowRef.current) {
        const scale = 1 + level * 0.14;
        ambientGlowRef.current.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
        ambientGlowRef.current.style.opacity = (0.85 + level * 0.35).toFixed(3);
      }
    });
  }, [isListeningSound]);

  // 仅在正式场景模式下触发吹灭烟花与“重新点亮”按钮
  useEffect(() => {
    if (!isActiveStage) {
      setShowFireworks(false);
      setShowResetUI(false);
      return;
    }
    if (effectiveExtinguished) {
      const fireworksTimer = setTimeout(() => {
        setShowFireworks(true);
      }, 360);
      const resetUITimer = setTimeout(() => {
        setShowResetUI(true);
      }, 3000);
      return () => {
        clearTimeout(fireworksTimer);
        clearTimeout(resetUITimer);
      };
    } else {
      setShowFireworks(false);
      setShowResetUI(false);
    }
  }, [isActiveStage, effectiveExtinguished]);

  const selectedCake = useMemo(() => {
    if (state.selectedCakeId.startsWith("custom-")) {
      return {
        id: state.selectedCakeId,
        name: "Custom Cake",
        customImage: state.customCakes[state.selectedCakeId],
        candleBaseY: 38,
        candleBaseWidth: 36,
      };
    }
    return CAKES.find((c) => c.id === state.selectedCakeId) || CAKES[0];
  }, [state.selectedCakeId, state.customCakes]);

  // 2D 蜡烛排布
  const candles = useMemo(() => {
    const baseWidth = selectedCake.candleBaseWidth;
    const baseY = selectedCake.candleBaseY;

    if (state.candleType === CandleType.CLASSIC) {
      const count = Math.max(1, Math.min(state.candleCount, 100));
      const numCircles = Math.max(1, Math.floor(Math.sqrt(count / 6)));
      const candlesPerCircle = [];
      let remainingCandles = count;

      for (let circle = 0; circle < numCircles; circle++) {
        const circleCandles =
          circle === 0
            ? Math.min(2, remainingCandles)
            : Math.min(Math.round(6 * circle), remainingCandles);
        candlesPerCircle.push(circleCandles);
        remainingCandles -= circleCandles;

        if (circle === numCircles - 1 && remainingCandles > 0) {
          candlesPerCircle[circle] += remainingCandles;
          remainingCandles = 0;
        }
      }

      const result = [];
      let candleIndex = 0;

      candlesPerCircle.forEach((circleCount, circleIndex) => {
        const circleRadiusFactor = 0.3 + 0.4 * circleIndex;
        const circleRadius = (baseWidth / 2) * circleRadiusFactor;
        const verticalOffset = circleIndex * 2;

        for (let i = 0; i < circleCount; i++) {
          const angle = (i / circleCount) * Math.PI * 2;
          const offsetX = ((i * circleIndex) % 2) - 1;
          const offsetY = ((circleIndex - i) % 2) - 1;
          const randomShiftX = offsetX * 0.75;
          const randomShiftY = offsetY * 0.75;

          const x = Math.cos(angle) * circleRadius + randomShiftX;
          const y = verticalOffset + randomShiftY;

          result.push({
            id: `c-${candleIndex}`,
            x: 50 + x,
            y: baseY + y,
            label: "",
          });
          candleIndex++;
        }
      });

      return result;
    } else {
      const digits = state.digits || "0";
      return digits.split("").map((char, i) => {
        const offset = (i - (digits.length - 1) / 2) * 12;
        return { id: `d-${i}`, x: 50 + offset, y: baseY - 4, label: char };
      });
    }
  }, [state.candleType, state.candleCount, state.digits, selectedCake]);

  const handleToggleRenderMode = () => {
    onControlsInteract?.();
    if (!canUse3D) return;
    setRenderMode(use3D ? "2d" : "3d");
  };

  const handleCheerAction = () => {
    onControlsInteract?.();
    audio?.triggerCheerBurst();
    setShowFireworks(true);
    setCheerBurstKey((k) => k + 1);
  };

  const styleLabel = audio
    ? isZh
      ? MUSIC_STYLE_LABELS[audio.musicStyle].zh
      : MUSIC_STYLE_LABELS[audio.musicStyle].en
    : "";

  const sfxStyleLabel = audio
    ? isZh
      ? CELEBRATION_SFX_LABELS[audio.celebrationSfxStyle].zh
      : CELEBRATION_SFX_LABELS[audio.celebrationSfxStyle].en
    : "";

  const showTopToolbar = !isHomePreview;
  const toolbarVisibleClass =
    isActiveStage && !controlsVisible
      ? "opacity-0 -translate-y-2 pointer-events-none"
      : "opacity-100 translate-y-0";

  return (
    <>
      {/* 吹灭后全屏暖色氛围光层 */}
      {isActiveStage && (
        <div
          className={`fixed inset-0 pointer-events-none z-30 transition-all duration-[2000ms] ${effectiveExtinguished ? "opacity-100" : "opacity-0"
            }`}
          style={{
            background:
              "radial-gradient(ellipse at center bottom, rgba(251, 146, 60, 0.28) 0%, rgba(244, 114, 182, 0.2) 44%, rgba(168, 85, 247, 0.12) 72%, transparent 100%)",
          }}
        />
      )}

      {/* 全屏无边框舞台容器：彻底占满父级（主页 100dvh / 场景 100dvh / 配置预览区 100%） */}
      <div className="relative w-full h-full overflow-hidden">
        {/* 顶部控制条（场景页随点击自动显隐；配置页常显 3D/2D 切换） */}
        {showTopToolbar && (
          <div
            onMouseEnter={onControlsInteract}
            className={`absolute top-4 left-4 right-4 z-40 flex items-center justify-between gap-2 transition-all duration-300 pointer-events-none ${toolbarVisibleClass}`}
          >
            {/* 3D / 2D 切换 */}
            <div className={`flex items-center gap-1.5 ${isActiveStage && !controlsVisible ? "pointer-events-none" : "pointer-events-auto"}`}>
              <button
                type="button"
                onClick={handleToggleRenderMode}
                disabled={!canUse3D}
                title={
                  !canUse3D
                    ? isZh
                      ? "当前设备不支持 WebGL，已自动回退 2D 模式"
                      : "WebGL unavailable — using 2D fallback"
                    : use3D
                      ? isZh
                        ? "切换到 2D 经典模式"
                        : "Switch to 2D Mode"
                      : isZh
                        ? "切换到 3D 立体模式"
                        : "Switch to 3D Mode"
                }
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wider backdrop-blur-md border transition-all flex items-center gap-1.5 ${use3D
                    ? "bg-slate-900/60 border-pink-300/35 text-pink-100 hover:bg-slate-800/80"
                    : canUse3D
                      ? "bg-slate-900/65 border-white/15 text-slate-200 hover:bg-slate-800/80"
                      : "bg-slate-900/55 border-white/10 text-slate-400 cursor-default"
                  }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${use3D ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                    }`}
                />
                <span>{use3D ? "3D" : canUse3D ? "2D" : isZh ? "2D 自适应" : "2D Auto"}</span>
              </button>
            </div>

            {/* 音乐与音效控制（仅场景页显示） */}
            {isActiveStage && audio && (
              <div className={`flex items-center gap-1.5 ${!controlsVisible ? "pointer-events-none" : "pointer-events-auto"}`}>
                <button
                  type="button"
                  onClick={() => {
                    onControlsInteract?.();
                    audio.toggleMusic();
                  }}
                  title={
                    isZh
                      ? audio.musicEnabled
                        ? "暂停生日快乐歌"
                        : "播放生日快乐歌"
                      : audio.musicEnabled
                        ? "Mute Happy Birthday song"
                        : "Play Happy Birthday song"
                  }
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold backdrop-blur-md border transition-all flex items-center gap-1.5 ${audio.musicEnabled && !effectiveExtinguished
                      ? "bg-amber-400/20 border-amber-300/40 text-amber-100 hover:bg-amber-400/30"
                      : "bg-slate-900/65 border-white/15 text-slate-300 hover:bg-slate-800/80"
                    }`}
                >
                  {audio.musicEnabled ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  )}
                  <span className="hidden sm:inline">
                    {audio.musicEnabled
                      ? effectiveExtinguished
                        ? isZh ? "庆祝中" : "Party"
                        : audio.audioUnlocked
                          ? isZh ? "生日歌" : "Song On"
                          : isZh ? "点此奏乐" : "Play Song"
                      : isZh ? "已静音" : "Muted"}
                  </span>
                  {audio.musicEnabled && !effectiveExtinguished && audio.audioUnlocked && (
                    <span className="inline-flex items-end gap-[2px] h-2.5">
                      <span className="w-[2px] h-1.5 bg-amber-300 rounded-full animate-bounce" />
                      <span className="w-[2px] h-2.5 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: "0.18s" }} />
                      <span className="w-[2px] h-2 bg-amber-200 rounded-full animate-bounce" style={{ animationDelay: "0.35s" }} />
                    </span>
                  )}
                </button>

                  {!effectiveExtinguished ? (
                <button
                  type="button"
                  onClick={() => {
                    onControlsInteract?.();
                    audio.cycleMusicStyle();
                  }}
                  title={isZh ? "切换演奏乐器" : "Switch instrument"}
                  className="px-2.5 py-1.5 rounded-full text-[11px] font-medium backdrop-blur-md bg-slate-900/60 border border-white/15 text-pink-100/90 hover:bg-slate-800/80 transition-all"
                >
                  {styleLabel}
                </button>
                ) : (
                <button
                  type="button"
                  onClick={() => {
                    onControlsInteract?.();
                    audio.cycleCelebrationSfxStyle();
                  }}
                  title={isZh ? "切换吹灭后庆祝音效" : "Switch celebration SFX"}
                  className="px-2.5 py-1.5 rounded-full text-[11px] font-medium backdrop-blur-md bg-pink-500/20 border border-pink-300/35 text-pink-100 hover:bg-pink-500/30 transition-all"
                >
                  ✨ {sfxStyleLabel}
                </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onControlsInteract?.();
                    audio.toggleSfx();
                  }}
                  title={
                    isZh
                      ? audio.sfxEnabled ? "关闭庆祝音效" : "开启庆祝音效"
                      : audio.sfxEnabled ? "Disable SFX" : "Enable SFX"
                  }
                  className={`w-8 h-7 rounded-full backdrop-blur-md border transition-all flex items-center justify-center ${audio.sfxEnabled
                      ? "bg-slate-900/60 border-white/15 text-pink-200 hover:bg-slate-800/80"
                      : "bg-slate-900/60 border-white/10 text-slate-500 hover:text-slate-300"
                    }`}
                >
                  {audio.sfxEnabled ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 环境声波可视化 */}
        <CakeSoundAura active={isListeningSound} />

        {/* 核心 3D / 2D 全屏视觉画布 */}
        {use3D ? (
          <div className="relative w-full h-full">
            <CakeScene3DBoundary onError={handleFallbackTo2D}>
              <CakeScene3D
                cakeId={state.selectedCakeId}
                customImage={
                  state.selectedCakeId.startsWith("custom-")
                    ? state.customCakes[state.selectedCakeId]
                    : undefined
                }
                candleType={state.candleType}
                candleCount={state.candleCount}
                digits={state.digits}
                userName={state.userName}
                customMessage={state.customMessage}
                giverName={state.giverName}
                cardStyle={state.cardStyle || "cream-rose"}
                sceneTheme={state.sceneTheme || "fairy-lights"}
                lang={lang}
                isExtinguished={effectiveExtinguished}
                isBlowing={effectiveBlowing}
                blowingProgress={effectiveProgress}
                isListeningSound={isListeningSound}
                tier={webglInfo?.tier || "medium"}
                interactive={!isHomePreview}
                showDragHint={isActiveStage}
                cameraDistanceScale={isConfigurePreview ? 1.24 : isHomePreview ? 1.56 : 1.5}
                targetYOffset={isHomePreview ? 0.14 : isConfigurePreview ? -0.02 : 0.12}
                cheerBurstKey={cheerBurstKey}
                onStageTap={isActiveStage ? onStageTap : undefined}
                onFallbackTo2D={handleFallbackTo2D}
              />
            </CakeScene3DBoundary>
          </div>
        ) : (
          /* 2D 全屏沉浸式渲染（同样不局限在卡片框内，文字浮于其上） */
          <div
            onClick={isActiveStage ? onStageTap : undefined}
            className="relative w-full h-full flex items-center justify-center p-6 sm:p-10"
          >
            <div className="relative w-[min(86vw,54vh,560px)] aspect-square flex items-center justify-center">
              <div
                className={`w-full h-full transition-transform duration-1000 ${effectiveExtinguished ? "animate-breathing-glow" : ""
                  }`}
              >
                {selectedCake.Component ? (
                  <selectedCake.Component />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={selectedCake.customImage}
                      className="w-full h-full object-contain drop-shadow-2xl rounded-3xl"
                      alt="Custom"
                    />
                  </div>
                )}
              </div>

              {/* 2D 蜡烛覆盖层 */}
              <div ref={candleOverlayRef} className="absolute inset-0 pointer-events-none">
                {candles.map((candle, index) => (
                  <div
                    key={candle.id}
                    className="absolute"
                    style={{
                      left: `${candle.x}%`,
                      top: `${candle.y}%`,
                      transform: "translate(-50%, -100%)",
                    }}
                  >
                    <FlameSVG
                      isExtinguished={effectiveExtinguished}
                      isBlowing={effectiveBlowing}
                      delay={index * 30}
                    />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-3 bg-black/15 blur-[3px] rounded-full -z-10" />
                    <div className="relative animate-sway">
                      {candle.label ? (
                        <div className="text-2xl lg:text-5xl font-serif font-black text-pink-500 drop-shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl px-2 py-2 w-10 lg:w-14 text-center border-b-4 border-pink-200">
                          {candle.label}
                        </div>
                      ) : (
                        <div className="w-2.5 h-14 lg:w-4 lg:h-20 bg-gradient-to-t from-pink-400 via-pink-300 to-pink-200 rounded-full shadow-2xl border border-white/40">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-pink-100/50" />
                          <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,white_8px,white_16px)]" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2D 熄灭暗场与暖光晕 */}
            <div
              className={`absolute inset-0 bg-slate-950/35 backdrop-blur-[1.5px] pointer-events-none transition-opacity duration-1500 ${effectiveExtinguished ? "opacity-100" : "opacity-0"
                }`}
            />
            {!effectiveExtinguished && (
              <div
                ref={ambientGlowRef}
                className="absolute top-1/2 left-1/2 w-[75%] h-[75%] bg-amber-200/12 blur-[160px] rounded-full animate-pulse pointer-events-none will-change-transform"
                style={{ transform: "translate(-50%, -50%) scale(1)" }}
              />
            )}
          </div>
        )}

        {/* 吹气进度条（仅正式场景模式） */}
        {isActiveStage && configCompleted && !effectiveExtinguished && effectiveProgress > 0 && (
          <div className="absolute left-4 sm:left-8 w-5 sm:w-6 top-1/2 -translate-y-1/2 h-48 sm:h-64 z-30 pointer-events-none">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md rounded-full shadow-inner overflow-hidden border border-white/15">
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-500 via-rose-400 to-amber-300 rounded-full transition-all duration-150 ease-out"
                style={{
                  height: `${Math.min(100, effectiveProgress)}%`,
                  boxShadow: effectiveBlowing
                    ? "0 0 20px rgba(244, 114, 182, 0.85)"
                    : "0 0 10px rgba(244, 114, 182, 0.45)",
                }}
              />
            </div>
            <div className="absolute w-full text-center -bottom-6 text-white font-bold text-xs drop-shadow">
              {effectiveProgress}%
            </div>
          </div>
        )}

        {/* 吹灭后的庆祝操作区（仅正式场景模式；主页预览绝不出现“重新点亮”按钮） */}
        {isActiveStage && showResetUI && (
          <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3 w-full max-w-xs px-4">
            <div className="flex items-center gap-2.5 w-full">
              {audio && (
                <button
                  type="button"
                  onClick={handleCheerAction}
                  className="shrink-0 px-4 py-3.5 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/20 hover:bg-slate-800/85 text-white font-bold text-xs shadow-xl transition-all active:scale-95"
                >
                  🎉 {isZh ? "再放礼花" : "Cheer!"}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowFireworks(false);
                  setShowResetUI(false);
                  updateState({ isExtinguished: false, blowingProgress: 0 });
                }}
                className="flex-1 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:scale-[1.02] text-white font-black rounded-full shadow-2xl shadow-pink-500/30 transition-all active:scale-95 uppercase tracking-[0.2em] text-xs"
              >
                {t.reset}
              </button>
            </div>
            <div className="text-[11px] text-pink-200/85 font-medium animate-pulse drop-shadow">
              {t.restartPrompt}
            </div>
          </div>
        )}
      </div>

      {/* 全屏烟花特效（仅正式场景模式；3D 模式下空中火花自然消散，落地面彩屑交由 3D 桌面渲染） */}
      {isActiveStage && (
        <Fireworks
          key={cheerBurstKey}
          active={showFireworks}
          settleOnBottom={!use3D}
        />
      )}
    </>
  );
};

export default CakeScene;
