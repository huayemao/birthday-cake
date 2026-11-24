// 客户端组件来处理交互状态
"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CakeScene from "@/components/CakeScene";
import Celebrate from "@/components/Celebrate";
import FaqSection from "@/components/FaqSection";
import HomeBlogSection from "@/components/HomeBlogSection";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import BlowCalibrationCard from "@/components/BlowCalibrationCard";
import FloatingScenePill from "@/components/FloatingScenePill";
import ShareModal from "@/components/ShareModal";
import { PromptSoundWave } from "@/components/AmbientSoundVisualizer";
import { FullscreenManager } from "@/src/components/FullscreenManager";
import { ScrollManager } from "@/src/components/ScrollManager";
import { FULLSCREEN_LABELS } from "@/faq";
import { getTranslation } from "@/i18n";
import { isRtlLanguage, Language } from "@/types";
import type { BlogPost } from "@/utils/blog";
import { useAppStore } from "@/store/useAppStore";
import { useBlowDetection } from "@/src/hooks/useBlowDetection";
import { useBirthdayAudio } from "@/src/hooks/useBirthdayAudio";
import { useShareLink } from "@/src/hooks/useShareLink";
import { useUrlConfig } from "@/src/hooks/useUrlConfig";

interface ClientPageProps {
  initialLang: Language;
  latestPosts?: BlogPost[];
}

export const ClientPage: React.FC<ClientPageProps> = ({
  initialLang,
  latestPosts = [],
}) => {
  const router = useRouter();
  const cheatTimerRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const menuHideTimerRef = useRef<number | null>(null);
  const lastMoveRevealRef = useRef<number>(0);

  const [isCheatPressed, setIsCheatPressed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
  // 场景页菜单默认隐藏，首次进入短暂展示后收起；点击屏幕后浮现一段时间
  const [sceneControlsVisible, setSceneControlsVisible] = useState(false);

  const lang = initialLang;
  const isZh = lang === "zh" || lang === "zh-Hant";

  const {
    selectedCakeId,
    configCompleted,
    candleType,
    candleCount,
    digits,
    isExtinguished,
    isBlowing,
    blowingProgress,
    customCakes,
    userName,
    customMessage,
    giverName,
    isBlowLocked,
    blowSensitivity,
    cardStyle,
    sceneTheme,
    blowCalibration,
    updateState,
  } = useAppStore();

  const state = {
    selectedCakeId,
    configCompleted,
    candleType,
    candleCount,
    digits,
    isExtinguished,
    isBlowing,
    blowingProgress,
    customCakes,
    userName,
    customMessage,
    giverName,
    isBlowLocked,
    blowSensitivity,
    cardStyle,
    sceneTheme,
  };

  const t = getTranslation(lang);
  const fsLabels = FULLSCREEN_LABELS[lang] || FULLSCREEN_LABELS.en;

  // 核心互动 hooks
  useBlowDetection();
  const birthdayAudio = useBirthdayAudio();
  const {
    copyShareLink,
    shareFeedback,
    shareModalOpen,
    shareUrl,
    openShareDialog,
    closeShareDialog,
  } = useShareLink();
  useUrlConfig();

  const isRTL = isRtlLanguage(lang);

  // 唤出场景菜单并在指定毫秒后自动隐藏
  const revealSceneControls = useCallback((durationMs = 3800) => {
    setSceneControlsVisible(true);
    if (menuHideTimerRef.current !== null) {
      clearTimeout(menuHideTimerRef.current);
    }
    menuHideTimerRef.current = window.setTimeout(() => {
      setSceneControlsVisible(false);
      menuHideTimerRef.current = null;
    }, durationMs);
  }, []);

  // 鼠标移动、触屏滑动、点击/轻触任意位置均实时浮现菜单，静止后自动收起
  const handleStageActivity = useCallback(() => {
    if (!configCompleted) return;
    const now = performance.now();
    if (now - lastMoveRevealRef.current < 180) return;
    lastMoveRevealRef.current = now;
    revealSceneControls(3800);
  }, [configCompleted, revealSceneControls]);

  const handleStageTap = useCallback(() => {
    if (!configCompleted) return;
    lastMoveRevealRef.current = performance.now();
    revealSceneControls(4200);
  }, [configCompleted, revealSceneControls]);

  // 进入正式庆生场景时，短暂显示菜单 3.2 秒提示位置，随后自动隐藏保持画面纯净
  useEffect(() => {
    if (configCompleted) {
      revealSceneControls(3200);
    } else {
      setSceneControlsVisible(false);
      if (menuHideTimerRef.current !== null) {
        clearTimeout(menuHideTimerRef.current);
        menuHideTimerRef.current = null;
      }
    }
    return () => {
      if (menuHideTimerRef.current !== null) {
        clearTimeout(menuHideTimerRef.current);
        menuHideTimerRef.current = null;
      }
    };
  }, [configCompleted, revealSceneControls]);

  // 全屏状态监听：仅针对蛋糕场景舞台元素
  useEffect(() => {
    const handler = () =>
      setIsFullscreen(
        !!(document.fullscreenElement || (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement)
      );
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler as EventListener);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler as EventListener);
    };
  }, []);

  const toggleFullscreen = () => {
    revealSceneControls();
    const el = stageRef.current as (HTMLDivElement & { webkitRequestFullscreen?: () => void }) | null;
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      webkitExitFullscreen?: () => void;
    };
    if (document.fullscreenElement || doc.webkitFullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    } else if (el) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    }
  };

  // 返回主页预览：重置吹灭状态，保证主页永远是清新的预览状态（不出现“重新点亮”）
  const handleBackToHome = () => {
    setIsCalibrationOpen(false);
    closeShareDialog();
    updateState({
      configCompleted: false,
      isExtinguished: false,
      isBlowing: false,
      blowingProgress: 0,
    });
  };

  const handleGoConfigure = () => {
    setIsCalibrationOpen(false);
    closeShareDialog();
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => { });
    }
    router.push(`/${lang}/configure`);
  };

  const handleCheatStart = () => {
    revealSceneControls();
    if (!configCompleted || isExtinguished || isBlowLocked) return;
    setIsCheatPressed(true);
    updateState({ isBlowing: true, blowingProgress: 0 });

    let progress = 0;
    cheatTimerRef.current = window.setInterval(() => {
      progress += 3;
      if (progress >= 100) {
        updateState({
          isExtinguished: true,
          isBlowing: false,
          blowingProgress: 100,
        });
        if (cheatTimerRef.current) {
          clearInterval(cheatTimerRef.current);
          cheatTimerRef.current = null;
        }
        setIsCheatPressed(false);
      } else {
        updateState({ blowingProgress: progress });
      }
    }, 30);
  };

  const handleCheatEnd = () => {
    setIsCheatPressed(false);
    if (cheatTimerRef.current) {
      clearInterval(cheatTimerRef.current);
      cheatTimerRef.current = null;
    }
    updateState({ isBlowing: false, blowingProgress: 0 });
  };

  useEffect(() => {
    return () => {
      if (cheatTimerRef.current) {
        clearInterval(cheatTimerRef.current);
        cheatTimerRef.current = null;
      }
    };
  }, []);

  // 主页预览模式下，标题始终呈现未吹灭的温馨预览状态
  const displayExtinguished = configCompleted && isExtinguished;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-950" dir={isRTL ? "rtl" : "ltr"}>
      <FullscreenManager />
      <ScrollManager />

      <main className="relative flex-1 w-full bg-slate-950">
        {/*
          蛋糕场景舞台：
          - 主页模式：精确占满一个视口 (h-[100dvh] w-full)，3D/2D 场景铺满整屏，不阻塞垂直下滑查看 FAQ/Footer；
          - 正式场景模式：全屏沉浸 (fixed inset-0 h-[100dvh] w-screen)，支持 360° 交互与点击唤出菜单。
        */}
        <div
          id="cake-stage"
          ref={stageRef}
          onMouseMove={configCompleted ? handleStageActivity : undefined}
          onPointerMove={configCompleted ? handleStageActivity : undefined}
          onTouchStart={configCompleted ? handleStageActivity : undefined}
          onTouchMove={configCompleted ? handleStageActivity : undefined}
          className={`relative w-full overflow-hidden transition-colors duration-1500 ease-in-out ${displayExtinguished ? "bg-[#040718]" : "bg-[#070b1a]"
            } ${configCompleted ? "fixed inset-0 h-[100dvh] z-30" : "h-[100dvh]"}`}
        >
          {/* 顶部导航栏：仅主页悬浮在首屏最上方，不挤占 100dvh 高度 */}
          <NavBar lang={lang} configCompleted={configCompleted} />

          {/* 全屏柔光背景氛围（随 sceneTheme 动态呼应） */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000">
            {sceneTheme === "starry-night" ? (
              <>
                <div className="absolute -top-[18%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/22 blur-[170px] rounded-full animate-pulse-slow" />
                <div className="absolute -bottom-[18%] -right-[10%] w-[58%] h-[58%] bg-cyan-400/14 blur-[170px] rounded-full animate-pulse-slow" />
              </>
            ) : sceneTheme === "warm-candlelight" ? (
              <>
                <div className="absolute -top-[15%] -left-[10%] w-[58%] h-[58%] bg-amber-400/20 blur-[170px] rounded-full animate-pulse-slow" />
                <div className="absolute -bottom-[15%] -right-[10%] w-[58%] h-[58%] bg-orange-400/16 blur-[170px] rounded-full animate-pulse-slow" />
              </>
            ) : sceneTheme === "cherry-blossom" ? (
              <>
                <div className="absolute -top-[18%] -left-[12%] w-[60%] h-[60%] bg-pink-400/24 blur-[170px] rounded-full animate-pulse-slow" />
                <div className="absolute -bottom-[18%] -right-[12%] w-[60%] h-[60%] bg-rose-300/18 blur-[170px] rounded-full animate-pulse-slow" />
              </>
            ) : sceneTheme === "minimal-studio" ? (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[45%] bg-slate-400/8 blur-[150px] rounded-full" />
            ) : (
              <>
                <div className="absolute -top-[18%] -left-[12%] w-[58%] h-[58%] bg-pink-400/20 blur-[170px] rounded-full animate-pulse-slow" />
                <div className="absolute -bottom-[18%] -right-[12%] w-[58%] h-[58%] bg-amber-300/16 blur-[170px] rounded-full animate-pulse-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[42%] bg-violet-400/12 blur-[150px] rounded-full" />
              </>
            )}
          </div>

          {/* 全屏 3D / 2D 蛋糕渲染层（铺满整屏，无容器方框限制） */}
          <div className="absolute inset-0 z-10">
            <CakeScene
              state={state}
              t={t}
              updateState={updateState}
              lang={lang}
              mode={configCompleted ? "active-stage" : "home-preview"}
              audio={birthdayAudio}
              controlsVisible={sceneControlsVisible}
              onStageTap={handleStageTap}
              onControlsInteract={() => revealSceneControls()}
            />
          </div>

          {/* 庆祝五彩纸屑（仅正式场景吹灭时激活） */}
          <Celebrate active={displayExtinguished} />

          {/* 顶部浮动文字层（自然悬浮在全屏场景之中，不阻塞 3D 交互） */}
          <header
            className={`pointer-events-none absolute inset-x-0 z-20 flex flex-col items-center text-center px-5 transition-all duration-1000 ${configCompleted ? "top-14 sm:top-12" : "top-20"
              }`}
          >
            <h1
              className={`text-3xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight drop-shadow-[0_4px_24px_rgba(2,6,23,0.75)] transition-all duration-1000 ${displayExtinguished ? "text-white/95" : "text-white"
                }`}
            >
              {displayExtinguished
                ? userName
                  ? `${t.celebrate} ${userName}!`
                  : t.celebrate
                : userName
                  ? userName
                  : t.title}
            </h1>
            <p
              className={`mt-2 text-sm sm:text-lg md:text-xl font-medium max-w-2xl drop-shadow-[0_2px_14px_rgba(2,6,23,0.8)] transition-all duration-1000 ${displayExtinguished ? "text-amber-300" : "text-slate-200/80"
                }`}
            >
              {displayExtinguished
                ? customMessage || "✧ 🎂 🎊 🎉 ✨ ✧"
                : customMessage || t.subtitle}
            </p>
            {giverName && configCompleted && (
              <p className="mt-1.5 text-xs sm:text-sm text-pink-200/80 font-medium drop-shadow">
                {isZh ? `来自: ${giverName}` : `From: ${giverName}`}
              </p>
            )}
          </header>

          {/* 正式场景底部吹蜡烛提示：统一使用与“拖动 360° 欣赏蛋糕”一致的 FloatingScenePill 胶囊组件 */}
          {configCompleted && !isExtinguished && (
            <div className="pointer-events-none absolute bottom-6 sm:bottom-8 inset-x-0 z-30 flex justify-center px-4 pb-[env(safe-area-inset-bottom)]">
              <FloatingScenePill
                variant={
                  isBlowing ? "blowing" : isBlowLocked ? "locked" : "default"
                }
                className="pointer-events-auto max-w-[92vw]"
                onClick={() => revealSceneControls()}
              >
                <PromptSoundWave active={!isBlowLocked} />
                <span className="truncate">
                  {isBlowLocked ? `${t.unlockBlow} · ${t.blowPrompt}` : t.blowPrompt}
                </span>
              </FloatingScenePill>
            </div>
          )}

          {/* 正式场景右侧悬浮菜单栏：平时隐藏，用户点击屏幕后优雅浮现一段时间；全套标准矢量图标 */}
          {configCompleted && (
            <div
              onMouseEnter={() => revealSceneControls()}
              className={`fixed bottom-20 right-4 sm:right-8 z-50 flex flex-col gap-2.5 p-2 rounded-full bg-slate-900/65 backdrop-blur-md border border-white/15 shadow-2xl transition-all duration-300 ${sceneControlsVisible
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 translate-x-4 pointer-events-none"
                }`}
            >
              {/* 返回主页（标准 Home 房屋图标） */}
              <button
                type="button"
                onClick={handleBackToHome}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95"
                title={t.backToHome || (isZh ? "返回首页" : "Home")}
                aria-label={t.backToHome || "Home"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </button>

              {/* 进入配置页（标准 SlidersHorizontal 调节图标） */}
              <button
                type="button"
                onClick={handleGoConfigure}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95"
                title={t.backToConfig}
                aria-label={t.backToConfig}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="21" x2="14" y1="4" y2="4" />
                  <line x1="10" x2="3" y1="4" y2="4" />
                  <line x1="21" x2="12" y1="12" y2="12" />
                  <line x1="8" x2="3" y1="12" y2="12" />
                  <line x1="21" x2="16" y1="20" y2="20" />
                  <line x1="12" x2="3" y1="20" y2="20" />
                  <line x1="14" x2="14" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="10" y2="14" />
                  <line x1="16" x2="16" y1="18" y2="22" />
                </svg>
              </button>

              {/* 麦克风吹气校准（标准 Mic 麦克风图标） */}
              {!isExtinguished && (
                <button
                  type="button"
                  onClick={() => {
                    revealSceneControls();
                    setIsCalibrationOpen(true);
                  }}
                  className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 ${blowCalibration
                    ? "bg-emerald-500/85 hover:bg-emerald-400 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  title={t.blowCalibrationButton || t.blowCalibrationTitle || "Calibrate Mic"}
                  aria-label={t.blowCalibrationButton || "Calibrate Mic"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                  </svg>
                  {blowCalibration && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-300 ring-2 ring-slate-950" />
                  )}
                </button>
              )}

              {/* 锁定 / 解锁吹气（标准 Lock 闭锁 / LockOpen 开锁图标） */}
              <button
                type="button"
                onClick={() => {
                  revealSceneControls();
                  updateState({ isBlowLocked: !isBlowLocked });
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 ${isBlowLocked
                  ? "bg-amber-500 hover:bg-amber-400 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                title={isBlowLocked ? t.unlockBlow : t.lockBlow}
                aria-label={isBlowLocked ? t.unlockBlow : t.lockBlow}
              >
                {isBlowLocked ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                  </svg>
                )}
              </button>

              {/* 分享链接（标准 Share2 节点分享图标） */}
              <button
                type="button"
                onClick={() => {
                  revealSceneControls();
                  setIsCalibrationOpen(false);
                  openShareDialog();
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:brightness-110 transition-all hover:scale-105 active:scale-95 shadow-lg"
                title={t.share}
                aria-label={t.share}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                  <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                </svg>
              </button>

              {/* 全屏 / 退出全屏（标准 Maximize / Minimize 图标） */}
              <button
                type="button"
                onClick={toggleFullscreen}
                title={isFullscreen ? fsLabels.exit : fsLabels.enter}
                aria-label={isFullscreen ? fsLabels.exit : fsLabels.enter}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95"
              >
                {isFullscreen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                    <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                    <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                    <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
                  </svg>
                )}
              </button>

              {/* 长按一键吹灭作弊按钮（标准 Wind 吹风图标） */}
              {!isExtinguished && (
                <button
                  type="button"
                  onMouseDown={handleCheatStart}
                  onMouseUp={handleCheatEnd}
                  onMouseLeave={handleCheatEnd}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    handleCheatStart();
                  }}
                  onTouchEnd={handleCheatEnd}
                  className={`w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-white transition-all shadow-lg ${isCheatPressed ? "scale-125 ring-4 ring-pink-400/40" : "hover:scale-105"
                    }`}
                  title={t.cheatButton}
                  aria-label={t.cheatButton}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
                    <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
                    <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* 主页底部操作区：精准贴合 100dvh 视口底部，按钮浮于全屏蛋糕场景之上 */}
          {!configCompleted && (
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent pt-16 pb-[max(1.25rem,env(safe-area-inset-bottom))] px-5">
              <div className="max-w-md mx-auto w-full flex flex-col gap-2.5 pointer-events-auto">
                <Link
                  href={`/${lang}/configure`}
                  className="w-full py-3.5 sm:py-4 text-center bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:brightness-105 hover:scale-[1.01] text-white font-black rounded-2xl shadow-2xl shadow-pink-500/25 transition-all active:scale-95 uppercase tracking-[0.22em] text-xs"
                >
                  {t.arrangeCake}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    updateState({
                      configCompleted: true,
                      isExtinguished: false,
                      isBlowing: false,
                      blowingProgress: 0,
                    });
                  }}
                  className="w-full py-3 bg-slate-900/55 backdrop-blur-md hover:bg-slate-800/75 text-white font-semibold rounded-2xl border border-white/15 transition-all active:scale-95 uppercase tracking-[0.2em] text-xs"
                >
                  {t.startDirectly}
                </button>
                {/* 向下滑动提示（引导用户浏览下方的 FAQ 与介绍文案，兼顾 SEO 与体验） */}
                <div className="pt-1 flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/40 animate-bounce"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
          )}
          {/* 分享链接对话框（置于舞台内部，全屏模式同样清晰可见） */}
          <ShareModal
            isOpen={shareModalOpen}
            shareUrl={shareUrl}
            copyStatus={shareFeedback}
            onCopy={() => copyShareLink({ persistFeedback: true, explicitUrl: shareUrl })}
            onClose={closeShareDialog}
            lang={lang}
            t={t}
            summary={{
              userName,
              giverName,
              customMessage,
              isCustomCake: selectedCakeId.startsWith("custom-"),
            }}
          />

          {/* 场景内快捷麦克风校准弹窗（置于舞台内部，确保全屏模式下依然可见） */}
          {isCalibrationOpen && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
              role="dialog"
              aria-modal="true"
            >
              <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-white/15 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-white">
                    {t.blowCalibrationTitle || (isZh ? "麦克风吹气校准" : "Blow Calibration")}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsCalibrationOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                    aria-label={t.closeControls}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
                <BlowCalibrationCard t={t} active={isCalibrationOpen} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 非功能区 / SEO 文案区：下滑自然浏览，SSR 完整输出 */}
      {!configCompleted && <FaqSection lang={lang} />}
      {!configCompleted && <HomeBlogSection lang={lang} posts={latestPosts} />}
      {!configCompleted && <Footer lang={lang} />}
    </div>
  );
};
