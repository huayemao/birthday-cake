// 客户端组件来处理交互状态
"use client";

import CakeScene from "@/components/CakeScene";
import Celebrate from "@/components/Celebrate";
import ConfigModal from "@/components/ConfigModal";
import NavBar from "@/components/NavBar";
import { FullscreenManager } from "@/src/components/FullscreenManager";
import { ScrollManager } from "@/src/components/ScrollManager";
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
  const [isCheatPressed, setIsCheatPressed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // 使用 Zustand store
  const {
    lang,
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
    lang,
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
  
  // 设置初始语言
  useEffect(() => {
    useAppStore.setState({ lang: initialLang });
  }, [initialLang]);

  const t = getTranslation(lang);
  
  // 使用自定义hooks
  useBlowDetection();
  const { copyShareLink } = useShareLink();
  useUrlConfig();



  const isRTL = lang === "ar";

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
    <>
      <FullscreenManager />
      <ScrollManager />
      <NavBar lang={lang} configCompleted={configCompleted} />
      <main
        className={`min-h-screen relative flex flex-col md:flex-row py-8 px-4 sm:px-8 gap-12 transition-all duration-1500 ease-in-out ${isExtinguished ? "bg-[#020617]" : "bg-slate-950"
          } ${configCompleted ? "py-4 gap-4" : ""}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Celebrate active={isExtinguished} />


        {/* 核心内容区域 - 组合 header 和蛋糕场景 */}
        <div
          className={`w-full flex flex-col items-center mt-8 justify-around gap-8 transition-all duration-1800 ease-in-out ${configCompleted ? "fixed inset-0 animate-fade-in-up" : ""
            }`}
        >
          {/* Header - 与蛋糕场景组合 */}
          <header
            className={`flex-1 text-center flex flex-col justify-around gap-3 transition-all duration-1800 ease-in-out z-10 max-w-3xl ${configCompleted
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
            className={`w-full flex-2  relative transition-all duration-1800 ease-in-out`}
          >
            {/* 蛋糕场景 - 核心内容 */}
            <CakeScene state={state} t={t} updateState={updateState} />
            {/* 垂直进度条 - 侧边位置 */}

          </div>
          <div className="flex-1">
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

            {/* 配置完成后的操作按钮 - 更优雅的设计 */}
            {configCompleted && (
              <div className="flex justify-center gap-4 items-center transition-all duration-1200 ease-in-out opacity-100">
                <button
                  onClick={() => updateState({ configCompleted: false })}
                  className="text-xs text-pink-500 hover:text-pink-600 font-medium transition-colors"
                >
                  {t.backToConfig}
                </button>
                <button
                  onClick={() => updateState({ isBlowLocked: !isBlowLocked })}
                  className={`px-4 py-1.5 text-xs rounded-full transition-all shadow-lg transform hover:scale-105 ${
                    isBlowLocked
                      ? "bg-amber-500 hover:bg-amber-600 text-white"
                      : "bg-slate-600 hover:bg-slate-700 text-white"
                  }`}
                >
                  {isBlowLocked ? t.unlockBlow : t.lockBlow}
                </button>
                <button
                  onClick={copyShareLink}
                  className="px-4 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs rounded-full hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg transform hover:scale-105"
                >
                  {t.share}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 底部开始按钮区域 - 使用背景遮罩 */}
        {!configCompleted && (
          <div className="fixed bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent pointer-events-none flex flex-col justify-end pb-8 px-4 md:px-8 z-30">
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
        <div
          className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-all duration-1500 ease-in-out ${configCompleted ? "opacity-60" : "opacity-40"
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
      </main>

      <footer className="mt-auto py-12  text-center text-sm font-black   text-gray-400 dark:text-slate-600">
        <a href="https://huayemao.run/" target="_blank" className="hover:text-pink-500 transition-colors">
          {t.author}
        </a>  {t.footerText} {' '}
        &copy;{new Date().getFullYear()}
      </footer>

      {configCompleted && !isExtinguished && (
        <button
          onMouseDown={handleCheatStart}
          onMouseUp={handleCheatEnd}
          onMouseLeave={handleCheatEnd}
          onTouchStart={(e) => { e.preventDefault(); handleCheatStart(); }}
          onTouchEnd={handleCheatEnd}
          className={`fixed bottom-20 right-6 md:right-12 z-50 text-4xl transition-all duration-300 ${
            isCheatPressed ? "scale-150 rotate-12" : "scale-100 hover:scale-125"
          }`}
          title={t.cheatButton}
        >
          😊
        </button>
      )}

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
      />
    </>
  );
};
