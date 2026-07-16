// 客户端组件来处理交互状态
"use client";

import CakeScene from "@/components/CakeScene";
import Celebrate from "@/components/Celebrate";
import ConfigModal from "@/components/ConfigModal";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { FullscreenManager } from "@/src/components/FullscreenManager";
import { ScrollManager } from "@/src/components/ScrollManager";
import { FULLSCREEN_LABELS } from "@/faq";
import { getTranslation } from "@/i18n";
import { Language } from "@/types";
import { useRef, useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useBlowDetection } from "@/src/hooks/useBlowDetection";
import { useShareLink } from "@/src/hooks/useShareLink";
import { useUrlConfig } from "@/src/hooks/useUrlConfig";

interface ClientPageProps {
  initialLang: Language;
}

export const ClientPage: React.FC<ClientPageProps> = ({ initialLang }) => {
  const controlsRef = useRef<HTMLDivElement>(null);
  const cheatTimerRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [isCheatPressed, setIsCheatPressed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const lang = initialLang;

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
    blowSensitivity: useAppStore.getState().blowSensitivity,
  };

  const t = getTranslation(lang);
  const fsLabels = FULLSCREEN_LABELS[lang] || FULLSCREEN_LABELS.en;

  // 使用自定义hooks
  useBlowDetection();
  const { copyShareLink } = useShareLink();
  useUrlConfig();



  const isRTL = lang === "ar";

  // 全屏状态监听：仅针对蛋糕场景舞台元素
  useEffect(() => {
    const handler = () => setIsFullscreen(!!(document.fullscreenElement || (document as any).webkitFullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler as EventListener);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler as EventListener);
    };
  }, []);

  const toggleFullscreen = () => {
    const el = stageRef.current;
    if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
    } else if (el) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
    }
  };

  const handleCheatStart = () => {
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

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <FullscreenManager />
      <ScrollManager />
      <NavBar lang={lang} configCompleted={configCompleted} />
      <main
        className={`relative flex flex-col md:flex-row px-4 sm:px-8 gap-12 transition-all duration-1500 ease-in-out flex-1 ${isExtinguished ? "bg-[#020617]" : "bg-slate-950"
          } ${configCompleted ? "py-4 gap-4" : ""}`}
      >
        {/* 蛋糕场景舞台：全屏目标容器，仅包含沉浸式蛋糕体验，FAQ/header/footer 均在此之外 */}
        <div
          id="cake-stage"
          ref={stageRef}
          className={`relative  py-8 pb-16 overflow-hidden w-full flex flex-col items-center justify-around gap-8 transition-all duration-1800 ease-in-out bg-slate-950 ${isExtinguished ? "bg-[#020617]" : ""
            } ${configCompleted
              ? "fixed inset-0 animate-fade-in-up"
              : " min-h-[calc(100vh_-_10rem)]"
            }`}
        >
          {/* 庆祝特效（置于舞台内，保证全屏时仍可见） */}
          <Celebrate active={isExtinguished} />

          {/* 氛围光晕背景（置于舞台内，全屏时同样可见） */}
          <div
            className={`absolute inset-0 -z-10 pointer-events-none overflow-hidden transition-all duration-1500 ease-in-out ${configCompleted ? "opacity-60" : "opacity-40"
              }`}
          >
            <div
              className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-300/30 blur-[180px] rounded-full transition-all duration-1500 ease-in-out ${configCompleted ? "scale-125 animate-pulse-slow" : ""
                }`}
            ></div>
            <div
              className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-200/30 blur-[180px] rounded-full transition-all duration-1500 ease-in-out ${configCompleted ? "scale-125 animate-pulse-slow delay-700" : ""
                }`}
            ></div>
          </div>

          {/* Header - 与蛋糕场景组合 */}
          <header
            className={`relative z-10  text-center flex flex-col justify-around gap-3 transition-all duration-1800 ease-in-out max-w-3xl ${configCompleted
              ? "transform opacity-95 translate-y-2"
              : "opacity-100"
              }`}
          >
            <h1
              className={`text-4xl md:text-6xl font-serif font-black tracking-tighter transition-all duration-1800 ease-in-out ${isExtinguished ? "text-white/80" : "text-white"
                }`}
            >
              {isExtinguished
                ? userName
                  ? `${t.celebrate} ${userName}!`
                  : t.celebrate
                : userName
                  ? `${userName}`
                  : t.title}
            </h1>
            <p
              className={`text-lg sm:text-xl md:text-2xl font-medium transition-all duration-1800 ease-in-out delay-300 ${isExtinguished ? "text-amber-400" : "text-slate-500"
                }`}
            >
              {isExtinguished
                ? customMessage
                  ? customMessage
                  : "✧ 🎂 🎊 🎉 ✨ ✧"
                : customMessage
                  ? customMessage
                  : t.subtitle}
            </p>
          </header>


          {/* 蛋糕场景容器 */}
          <div
            className={`relative   z-10 w-full transition-all duration-1800 ease-in-out`}
          >
            {/* 蛋糕场景 - 核心内容 */}
            <CakeScene state={state} t={t} updateState={updateState} lang={lang} />
            {/* 垂直进度条 - 侧边位置 */}

          </div>
          <div className="relative z-10">
            {/* 吹蜡烛提示和进度条 */}
            {!isExtinguished && (
              <div className="flex flex-col items-center gap-6 transition-all duration-1000">
                {/* 吹蜡烛提示文字 */}
                <div
                  className={`max-w-xs lg:max-w-lg px-8 py-3 rounded-full glass-panel shadow-2xl border-2 transition-all duration-500 ${isBlowing
                    ? "scale-125 bg-pink-50 border-pink-400 text-pink-600"
                    : configCompleted && isBlowLocked
                      ? "border-amber-400 bg-amber-50 text-amber-600"
                      : configCompleted
                        ? "border-white text-slate-500 dark:text-slate-400"
                        : "border-amber-400 bg-amber-50 text-amber-600"
                    }`}
                  onClick={() => {
                    if (!configCompleted) {
                      setCurrentStep(1);
                      setIsModalOpen(true);
                    }
                  }}
                >
                  <span className="text-xs font-black uppercase tracking-widest cursor-pointer">
                    {configCompleted && isBlowLocked
                      ? t.unlockBlow + " " + t.blowPrompt
                      : configCompleted
                        ? t.blowPrompt
                        : t.configCompleteToBlow}
                  </span>
                </div>
              </div>
            )}
          </div>


          {/* 配置完成后的操作按钮 - 右下角纵向排列 */}
          {configCompleted && (
            <div className="fixed bottom-12 right-6 md:right-12 z-50 flex flex-col gap-3 transition-all duration-1200 ease-in-out opacity-100">
              <button
                onClick={() => updateState({ configCompleted: false })}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-600 hover:bg-slate-500 text-white transition-all shadow-lg transform hover:scale-110"
                title={t.backToConfig}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 12h18" />
                  <path d="M9 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => updateState({ isBlowLocked: !isBlowLocked })}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all shadow-lg transform hover:scale-110 ${isBlowLocked
                  ? "bg-amber-500 hover:bg-amber-400 text-white"
                  : "bg-slate-600 hover:bg-slate-500 text-white"
                  }`}
                title={isBlowLocked ? t.unlockBlow : t.lockBlow}
              >
                {isBlowLocked ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    <path d="M15 15H9" />
                  </svg>
                )}
              </button>
              <button
                onClick={copyShareLink}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-400 hover:to-rose-400 transition-all shadow-lg transform hover:scale-110"
                title={t.share}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 5v14M5 12l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? fsLabels.exit : fsLabels.enter}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-600 hover:bg-slate-500 text-white transition-all shadow-lg transform hover:scale-110"
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
              {/* 作弊按钮 */}
              {!isExtinguished && (
                <button
                  onMouseDown={handleCheatStart}
                  onMouseUp={handleCheatEnd}
                  onMouseLeave={handleCheatEnd}
                  onTouchStart={(e) => { e.preventDefault(); handleCheatStart(); }}
                  onTouchEnd={handleCheatEnd}
                  className={`w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-rose-400 text-white hover:from-pink-300 hover:to-rose-300 transition-all shadow-lg transform ${isCheatPressed ? "scale-150 rotate-12" : "hover:scale-110"
                    }`}
                  title={t.cheatButton}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 0-10 10c0 5 3.5 8.5 8 9.5V17a2 2 0 0 1 4 0v4.5c4.5-1 8-4.5 8-9.5a10 10 0 0 0-10-10z" />
                    <path d="M10 15v-2a3 3 0 0 1 6 0v2" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* 底部开始按钮区域 - 使用背景遮罩（绝对定位于舞台，滚动查看 FAQ 时随之上移） */}
          {!configCompleted && (
            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent pointer-events-none flex flex-col justify-end pb-8 px-4 md:px-8 z-30">
              <div className="max-w-lg mx-auto w-full flex flex-col gap-3 pointer-events-auto animate-in slide-in-from-bottom-4 duration-700">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:scale-[1.02] text-white font-black rounded-[1.5rem] shadow-2xl shadow-pink-200/50 transition-all active:scale-95 uppercase tracking-[0.25em] text-xs"
                >
                  {t.arrangeCake}
                </button>
                <button
                  onClick={() => {
                    updateState({ configCompleted: true });
                  }}
                  className="w-full py-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-medium rounded-[1.25rem] border border-white/20 transition-all active:scale-95 uppercase tracking-[0.2em] text-xs"
                >
                  {t.startDirectly}
                </button>
              </div>
            </div>
          )}


        </div>
      </main>

      {/* 非功能区 / 文本区：FAQ，仅在未配置时展示，用户可向下滚动查看，内容随首屏 SSR 输出便于搜索引擎抓取 */}
      {!configCompleted && <FaqSection lang={lang} />}

      {!configCompleted && <Footer lang={lang} />}

      <ConfigModal
        state={state}
        updateState={updateState}
        t={t}
        isOpen={isModalOpen}
        currentStep={currentStep}
        onClose={() => setIsModalOpen(false)}
        onStepChange={setCurrentStep}
        onComplete={() => {
          setIsModalOpen(false);
          updateState({ configCompleted: true });
        }}
        lang={lang}
      />
    </div>
  );
};
