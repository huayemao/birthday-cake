"use client";

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { AppState, CandleType, Translation, Language } from "../types";
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
      <div className="w-12 h-12 rounded-full border-2 border-pink-400/30 border-t-pink-400 animate-spin" />
      <span className="text-xs tracking-widest uppercase">3D Cake</span>
    </div>
  ),
});

interface AudioControlActions {
  audioUnlocked: boolean;
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicStyle: MusicStyle;
  toggleMusic: () => void;
  cycleMusicStyle: () => void;
  toggleSfx: () => void;
  triggerCheerBurst: () => void;
}

interface CakeSceneProps {
  state: AppState;
  t: Translation;
  updateState: (updates: Partial<AppState>) => void;
  lang: Language;
  audio?: AudioControlActions;
}

const MUSIC_STYLE_LABELS: Record<MusicStyle, { zh: string; en: string }> = {
  musicbox: { zh: "八音盒", en: "Music Box" },
  piano: { zh: "钢琴", en: "Piano" },
  chimes: { zh: "梦幻风铃", en: "Chimes" },
};

const CakeScene: React.FC<CakeSceneProps> = ({ state, t, updateState, lang, audio }) => {
  const { blowingProgress, configCompleted, isExtinguished, isBlowing, isBlowLocked } = state;
  const { renderMode, setRenderMode } = useAppStore();

  const [showFireworks, setShowFireworks] = useState(false);
  const [showResetUI, setShowResetUI] = useState(false);
  const [webglInfo, setWebglInfo] = useState<WebGLSupportInfo | null>(null);
  const [runtime3DFailed, setRuntime3DFailed] = useState(false);
  const [cheerBurstKey, setCheerBurstKey] = useState(0);

  const candleOverlayRef = useRef<HTMLDivElement>(null);
  const ambientGlowRef = useRef<HTMLDivElement>(null);
  const isListeningSound = configCompleted && !isExtinguished && !isBlowLocked;
  const isZh = lang === "zh" || lang === "zh-Hant";

  // 客户端检测设备 WebGL 3D 支持情况
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

  // 将实时环境声强通过 CSS 变量传递给 2D 烛火与氛围光晕，零 React 重渲染实现 60fps 律动
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

  useEffect(() => {
    if (isExtinguished) {
      const fireworksTimer = setTimeout(() => {
        setShowFireworks(true);
      }, 380);
      const resetUITimer = setTimeout(() => {
        setShowResetUI(true);
      }, 3200);
      return () => {
        clearTimeout(fireworksTimer);
        clearTimeout(resetUITimer);
      };
    } else {
      setShowFireworks(false);
      setShowResetUI(false);
    }
  }, [isExtinguished]);

  const selectedCake = useMemo(() => {
    if (state.selectedCakeId.startsWith("custom-")) {
      return {
        id: state.selectedCakeId,
        name: "Custom Cake",
        customImage: state.customCakes[state.selectedCakeId],
        candleBaseY: 40,
        candleBaseWidth: 30,
      };
    }
    return CAKES.find((c) => c.id === state.selectedCakeId) || CAKES[0];
  }, [state.selectedCakeId, state.customCakes]);

  // 2D 模式下蜡烛排布
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
    if (!canUse3D) return;
    setRenderMode(use3D ? "2d" : "3d");
  };

  const handleCheerAction = () => {
    audio?.triggerCheerBurst();
    setShowFireworks(true);
    setCheerBurstKey((k) => k + 1);
  };

  const styleLabel = audio
    ? isZh
      ? MUSIC_STYLE_LABELS[audio.musicStyle].zh
      : MUSIC_STYLE_LABELS[audio.musicStyle].en
    : "";

  return (
    <>
      {/* Full-page Warm Ambient Lighting Overlay */}
      <div
        className={`fixed inset-0 pointer-events-none z-40 transition-all duration-[2000ms] ${
          isExtinguished ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at center bottom, rgba(251, 146, 60, 0.32) 0%, rgba(244, 114, 182, 0.22) 42%, rgba(168, 85, 247, 0.14) 72%, transparent 100%)",
        }}
      />

      <div className="relative w-full max-w-2xl aspect-square sm:aspect-[5/4.4] max-h-[62vh] sm:max-h-[66vh] mx-auto overflow-hidden rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border border-white/10 bg-gradient-to-b from-slate-900/55 via-slate-950/75 to-slate-950/90 group transition-all duration-1000">
        {/* 顶部轻量控制条：3D/2D 切换 + 生日歌音乐控制 + 音色切换 + 音效开关 */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-30 flex items-center justify-between gap-2 pointer-events-none">
          {/* 3D / 2D 渲染模式徽标与切换 */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              type="button"
              onClick={handleToggleRenderMode}
              disabled={!canUse3D}
              title={
                !canUse3D
                  ? isZh
                    ? "当前设备不支持 WebGL，已自动回退 2D 模式"
                    : "WebGL unavailable — automatically using 2D fallback"
                  : use3D
                    ? isZh
                      ? "切换到 2D 经典模式"
                      : "Switch to 2D Classic Mode"
                    : isZh
                      ? "切换到 3D 立体模式"
                      : "Switch to 3D Interactive Mode"
              }
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider backdrop-blur-md border transition-all flex items-center gap-1.5 ${
                use3D
                  ? "bg-pink-500/25 border-pink-300/40 text-pink-100 hover:bg-pink-500/35"
                  : canUse3D
                    ? "bg-slate-800/70 border-white/15 text-slate-200 hover:bg-slate-700/80"
                    : "bg-slate-800/60 border-white/10 text-slate-400 cursor-default"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  use3D ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <span>{use3D ? "3D" : canUse3D ? "2D" : isZh ? "2D 自适应" : "2D Auto"}</span>
            </button>
          </div>

          {/* 生日快乐歌 & 庆祝音效控制组 */}
          {audio && (
            <div className="flex items-center gap-1.5 pointer-events-auto">
              {/* 生日快乐歌播放/暂停 */}
              <button
                type="button"
                onClick={audio.toggleMusic}
                title={
                  isZh
                    ? audio.musicEnabled
                      ? "暂停生日快乐歌"
                      : "播放生日快乐歌"
                    : audio.musicEnabled
                      ? "Mute Happy Birthday song"
                      : "Play Happy Birthday song"
                }
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold backdrop-blur-md border transition-all flex items-center gap-1.5 ${
                  audio.musicEnabled && !isExtinguished
                    ? "bg-amber-400/20 border-amber-300/40 text-amber-100 hover:bg-amber-400/30"
                    : "bg-slate-900/65 border-white/15 text-slate-300 hover:bg-slate-800/80"
                }`}
              >
                {audio.musicEnabled ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                )}
                <span className="hidden sm:inline">
                  {audio.musicEnabled
                    ? isExtinguished
                      ? isZh
                        ? "庆祝中"
                        : "Party"
                      : audio.audioUnlocked
                        ? isZh
                          ? "生日歌"
                          : "Song On"
                        : isZh
                          ? "点此奏乐"
                          : "Play Song"
                    : isZh
                      ? "已静音"
                      : "Muted"}
                </span>
                {audio.musicEnabled && !isExtinguished && audio.audioUnlocked && (
                  <span className="inline-flex items-end gap-[2px] h-2.5">
                    <span className="w-[2px] h-1.5 bg-amber-300 rounded-full animate-bounce" />
                    <span
                      className="w-[2px] h-2.5 bg-pink-300 rounded-full animate-bounce"
                      style={{ animationDelay: "0.18s" }}
                    />
                    <span
                      className="w-[2px] h-2 bg-amber-200 rounded-full animate-bounce"
                      style={{ animationDelay: "0.35s" }}
                    />
                  </span>
                )}
              </button>

              {/* 切换生日歌乐器风格（八音盒 / 钢琴 / 梦幻风铃） */}
              {!isExtinguished && (
                <button
                  type="button"
                  onClick={audio.cycleMusicStyle}
                  title={isZh ? "切换生日快乐歌演奏乐器" : "Switch song instrument style"}
                  className="px-2.5 py-1.5 rounded-full text-[11px] font-medium backdrop-blur-md bg-slate-900/60 border border-white/15 text-pink-100/90 hover:bg-slate-800/80 transition-all"
                >
                  {styleLabel}
                </button>
              )}

              {/* 庆祝音效开关 */}
              <button
                type="button"
                onClick={audio.toggleSfx}
                title={
                  isZh
                    ? audio.sfxEnabled
                      ? "关闭庆祝音效"
                      : "开启庆祝音效"
                    : audio.sfxEnabled
                      ? "Disable celebration SFX"
                      : "Enable celebration SFX"
                }
                className={`w-8 h-7 rounded-full backdrop-blur-md border transition-all flex items-center justify-center ${
                  audio.sfxEnabled
                    ? "bg-slate-900/60 border-white/15 text-pink-200 hover:bg-slate-800/80"
                    : "bg-slate-900/60 border-white/10 text-slate-500 hover:text-slate-300"
                }`}
              >
                {audio.sfxEnabled ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                )}
              </button>

              {/* 吹灭后可手动再放一波礼花与欢呼音效 */}
              {isExtinguished && (
                <button
                  type="button"
                  onClick={handleCheerAction}
                  className="px-3 py-1.5 rounded-full text-[11px] font-bold backdrop-blur-md bg-gradient-to-r from-pink-500/80 to-amber-500/80 hover:from-pink-400 hover:to-amber-400 text-white border border-white/25 shadow-lg transition-all active:scale-95"
                >
                  🎉 {isZh ? "再放礼花" : "Cheer!"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* 环境声波可视化（有任意风吹草动时呈现声波光环与律动条） */}
        <CakeSoundAura active={isListeningSound} />

        {/* 核心视觉舞台：3D 优先，不支持 WebGL 或发生错误时平滑回退到 2D */}
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
                lang={lang}
                isExtinguished={state.isExtinguished}
                isBlowing={state.isBlowing}
                blowingProgress={state.blowingProgress}
                isListeningSound={isListeningSound}
                tier={webglInfo?.tier || "medium"}
                cheerBurstKey={cheerBurstKey}
                onFallbackTo2D={handleFallbackTo2D}
              />
            </CakeScene3DBoundary>

            {/* 赠送人署名 */}
            {state.giverName && (
              <p className="pointer-events-none absolute top-14 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950/45 backdrop-blur-sm text-white/85 text-xs sm:text-sm font-medium text-center border border-white/10">
                {lang === "zh" || lang === "zh-Hant"
                  ? `来自: ${state.giverName}`
                  : `From: ${state.giverName}`}
              </p>
            )}
          </div>
        ) : (
          /* 2D 回退 / 经典模式渲染 */
          <div className="w-full h-full flex items-center justify-center p-4 sm:p-8">
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className={`w-full h-full max-w-[650px] transition-transform duration-1000 group-hover:scale-[1.02] ${
                  isExtinguished ? "animate-breathing-glow" : ""
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
                    <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[80%] h-[10%] bg-black/10 blur-xl rounded-full -z-10" />
                  </div>
                )}

                {state.giverName && (
                  <p className="text-white/80 text-sm sm:text-base font-medium text-center">
                    {lang === "zh" || lang === "zh-Hant"
                      ? `来自: ${state.giverName}`
                      : `From: ${state.giverName}`}
                  </p>
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
                      isExtinguished={state.isExtinguished}
                      isBlowing={state.isBlowing}
                      delay={index * 30}
                    />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-3 bg-black/15 blur-[3px] rounded-full -z-10" />
                    <div className="relative animate-sway">
                      {candle.label ? (
                        <div className="text-2xl lg:text-6xl font-serif font-black text-pink-500 drop-shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl px-2 py-2 w-10 lg:w-16 text-center border-b-4 border-pink-200">
                          {candle.label}
                        </div>
                      ) : (
                        <div className="w-3 h-16 lg:w-5 lg:h-24 bg-gradient-to-t from-pink-400 via-pink-300 to-pink-200 rounded-full shadow-2xl border border-white/40">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-pink-100/50" />
                          <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,white_8px,white_16px)]" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 吹气进度条（3D 与 2D 模式通用） */}
        {configCompleted && !isExtinguished && blowingProgress > 0 && (
          <div className="absolute left-4 sm:left-6 w-5 sm:w-7 top-16 bottom-12 z-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-800/60 to-slate-700/35 rounded-full shadow-inner overflow-hidden border border-white/10">
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-500 via-rose-400 to-amber-300 rounded-full transition-all duration-150 ease-out"
                style={{
                  height: `${Math.min(100, blowingProgress)}%`,
                  boxShadow: isBlowing
                    ? "0 0 20px rgba(244, 114, 182, 0.85)"
                    : "0 0 10px rgba(244, 114, 182, 0.45)",
                }}
              />
            </div>
            <div className="absolute w-full text-center -bottom-6 text-white font-bold text-xs sm:text-sm drop-shadow">
              {blowingProgress}%
            </div>
          </div>
        )}

        {/* 2D 熄灭暗场与暖光晕（3D 模式下由真实三维动态光源处理） */}
        {!use3D && (
          <>
            <div
              className={`absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] pointer-events-none transition-opacity duration-1500 ${
                state.isExtinguished ? "opacity-100" : "opacity-0"
              }`}
            />
            {!state.isExtinguished && (
              <div
                ref={ambientGlowRef}
                className="absolute top-1/2 left-1/2 w-[95%] h-[95%] bg-amber-200/15 blur-[180px] rounded-full animate-pulse pointer-events-none will-change-transform"
                style={{ transform: "translate(-50%, -50%) scale(1)" }}
              />
            )}
          </>
        )}

        {/* Restart Prompt when candles are extinguished */}
        {showResetUI && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none">
            <div className="text-xs text-pink-200/90 font-medium transition-colors animate-pulse drop-shadow">
              {t.restartPrompt}
            </div>
          </div>
        )}

        {/* Reset Button when candles are extinguished */}
        {showResetUI && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-full max-w-[15rem] px-4 z-20">
            <button
              onClick={() => {
                setShowFireworks(false);
                setShowResetUI(false);
                updateState({ isExtinguished: false, blowingProgress: 0 });
              }}
              className="w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:scale-[1.03] text-white font-black rounded-[2rem] shadow-2xl shadow-pink-500/30 transition-all active:scale-95 animate-in zoom-in duration-500 uppercase tracking-[0.25em] text-xs"
            >
              {t.reset}
            </button>
          </div>
        )}
      </div>

      {/* Fireworks Effect */}
      <Fireworks key={cheerBurstKey} active={showFireworks} />
    </>
  );
};

export default CakeScene;
