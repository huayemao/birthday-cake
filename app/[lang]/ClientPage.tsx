// 客户端组件来处理交互状态
"use client";

import CakeScene from "@/components/CakeScene";
import Celebrate from "@/components/Celebrate";
import Controls from "@/components/Controls";
import { getTranslation } from "@/i18n";
import { Language, CandleType } from "@/types";
import { useState, useRef, useCallback, useEffect } from "react";
import * as LZString from "lz-string";
import { useAppStore } from "@/store/useAppStore";

interface ClientPageProps {
  initialLang: Language;
}

// 语言名称映射，使用对应语言的名称
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  fr: "Français",
  ar: "العربية",
};

export const ClientPage: React.FC<ClientPageProps> = ({ initialLang }) => {
  // 移动端配置完成状态管理
  // 语言下拉菜单状态
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const controlsRef = useRef<HTMLDivElement>(null);

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
    customCakes,
    userName,
    customMessage,
    giverName,
    updateState,
    resetState,
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
    customCakes,
    userName,
    customMessage,
    giverName,
  };
  // 设置初始语言
  useEffect(() => {
    useAppStore.setState({ lang: initialLang });
  }, [initialLang]);

  const t = getTranslation(lang);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const blowThreshold = 0.5; // 提高阈值，降低灵敏度
  const blowDurationRef = useRef<number>(0);
  const blowRequiredDuration = 8; // 增加所需持续时间

  // 生成分享链接
  const generateShareLink = () => {
    // 创建要分享的状态对象，排除不需要分享的临时状态
    const shareState = {
      lang,
      selectedCakeId,
      configCompleted: true,
      candleType,
      candleCount,
      digits,
      isExtinguished: false, // 重置蜡烛状态，让分享的人可以重新吹蜡烛
      isBlowing: false,
      customCakes,
      userName,
      customMessage,
      giverName,
    };

    // 将状态转换为 JSON 字符串，然后使用 lz-string 压缩
    const jsonState = JSON.stringify(shareState);
    const compressedState = LZString.compressToEncodedURIComponent(jsonState);

    // 构建分享链接
    const url = new URL(window.location.href);
    url.searchParams.set("config", compressedState);
    return url.toString();
  };

  // 复制分享链接到剪贴板
  const copyShareLink = async () => {
    try {
      const shareLink = generateShareLink();
      await navigator.clipboard.writeText(shareLink);
      // 可以添加一个成功提示
      alert(t.copyLink + " ✓");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const changeLanguage = (l: Language) => {
    window.location.href = `/${l}`;
  };

  const initMic = useCallback(async () => {
    if (isExtinguished || !configCompleted) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      analyser.fftSize = 256;
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkBlow = () => {
        if (!analyserRef.current || isExtinguished) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // 改进的吹气识别算法：
        // 1. 分析低频区域（10-100Hz），这是吹气声音的主要频率范围
        // 2. 同时分析中频区域，避免误识别其他声音
        const lowFreqStart = 5;
        const lowFreqEnd = 50;
        const midFreqStart = 50;
        const midFreqEnd = 150;

        let lowSum = 0;
        let midSum = 0;

        for (let i = lowFreqStart; i < lowFreqEnd; i++) {
          lowSum += dataArray[i];
        }

        for (let i = midFreqStart; i < midFreqEnd; i++) {
          midSum += dataArray[i];
        }

        const lowAverage = lowSum / (lowFreqEnd - lowFreqStart) / 255;
        const midAverage = midSum / (midFreqEnd - midFreqStart) / 255;

        // 吹气特征：低频能量高，中频能量相对较低
        const isBlowingSound =
          lowAverage > blowThreshold && midAverage < lowAverage * 0.7;

        if (isBlowingSound) {
          blowDurationRef.current += 1;
          updateState({ isBlowing: true });
          if (blowDurationRef.current > blowRequiredDuration) {
            updateState({ isExtinguished: true, isBlowing: false });
            if (audioContextRef.current) audioContextRef.current.close();
            return;
          }
        } else {
          blowDurationRef.current = 0;
          updateState({ isBlowing: false });
        }
        requestAnimationFrame(checkBlow);
      };
      checkBlow();
    } catch (err) {
      console.warn("Mic access denied:", err);
    }
  }, [isExtinguished, configCompleted]);

  // 从 URL 参数恢复配置
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const configParam = urlParams.get("config");

    if (configParam) {
      try {
        // 解压并解析配置
        const decompressedConfig =
          LZString.decompressFromEncodedURIComponent(configParam);
        if (decompressedConfig) {
          const parsedConfig = JSON.parse(decompressedConfig);
          // 应用配置到状态
          updateState({ ...parsedConfig, configCompleted: true });
          // 直接显示配置完成状态
        }
      } catch (err) {
        console.error("Failed to parse config from URL:", err);
      }
    }
  }, [updateState]);

  useEffect(() => {
    initMic();
    return () => {
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [initMic]);

  // 蛋糕吹灭时禁止页面滚动
  useEffect(() => {
    if (configCompleted) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // 组件卸载时恢复滚动
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [configCompleted]);

  // 配置完成后打开全屏
  useEffect(() => {
    if (configCompleted) {
      // 尝试进入全屏模式
      const enterFullscreen = async () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
          await (elem as any).msRequestFullscreen();
        }
      };
      enterFullscreen().catch((err) => {
        console.warn("无法进入全屏模式:", err);
      });
    }
  }, [configCompleted]);

  const isRTL = lang === "ar";

  return (
    <>
      <main
        className={`min-h-screen relative flex flex-col md:flex-row py-8 px-4 sm:px-8 gap-12 transition-all duration-1500 ease-in-out ${
          isExtinguished ? "bg-[#020617]" : "bg-slate-950"
        } ${configCompleted ? "py-4 gap-4" : ""}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <Celebrate active={isExtinguished} />

        <nav
          className={`fixed top-4 right-4 md:top-8 md:right-4 z-20 glass-panel p-1.5 rounded-2xl shadow-xl dark:bg-slate-900/50 transition-all duration-1000 ease-in-out ${
            configCompleted ? "scale-90 opacity-80" : ""
          }`}
        >
          {/* 语言下拉菜单 */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="px-4 py-1.5 rounded-[0.8rem] text-[10px] font-black uppercase transition-all flex items-center gap-2 bg-pink-500 text-white shadow-lg"
              aria-expanded={isLangMenuOpen}
              aria-haspopup="true"
            >
              {LANGUAGE_NAMES[lang]}
              <span className="text-sm">▼</span>
            </button>

            {/* 下拉菜单 */}
            {isLangMenuOpen && (
              <div className="absolute right-0 mt-1 w-40 rounded-[0.8rem] overflow-hidden shadow-xl glass-panel dark:bg-slate-900/80 z-50">
                {(["en", "zh", "ja", "fr", "ar"] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      changeLanguage(l);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase transition-all ${
                      lang === l
                        ? "bg-pink-500 text-white"
                        : "text-gray-500 hover:bg-pink-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {LANGUAGE_NAMES[l]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* 核心内容区域 - 组合 header 和蛋糕场景 */}
        <div
          className={`w-full flex flex-col items-center mt-8 justify-around gap-8 transition-all duration-1800 ease-in-out ${
            configCompleted ? "fixed inset-0 animate-fade-in-up" : ""
          }`}
        >
          {/* Header - 与蛋糕场景组合 */}
          <header
            className={`flex-1 text-center flex flex-col justify-around gap-3 transition-all duration-1800 ease-in-out z-10 max-w-3xl ${
              configCompleted
                ? "transform opacity-95 translate-y-2"
                : "opacity-100"
            }`}
          >
            <h1
              className={`text-4xl md:text-6xl font-serif font-black tracking-tighter transition-all duration-1800 ease-in-out ${
                isExtinguished ? "text-white/80" : "text-white"
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
              className={`text-lg sm:text-xl md:text-2xl font-medium transition-all duration-1800 ease-in-out delay-300 ${
                isExtinguished ? "text-amber-400" : "text-slate-500"
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
          </div>
          <div className="flex-1">
            {/* 吹蜡烛提示 */}
            {!isExtinguished && (
              <div className="flex flex-col items-center gap-4 animate-bounce transition-all duration-1000">
                <div
                  className={`px-8 py-3 rounded-full glass-panel shadow-2xl border-2 transition-all duration-500 ${
                    isBlowing
                      ? "scale-125 bg-pink-50 border-pink-400 text-pink-600"
                      : configCompleted
                      ? "border-white text-slate-500 dark:text-slate-400"
                      : "border-amber-400 bg-amber-50 text-amber-600"
                  }`}
                  onClick={() => {
                    if (!configCompleted && controlsRef.current) {
                      controlsRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }
                  }}
                >
                  <span className="text-xs font-black uppercase tracking-widest cursor-pointer">
                    {configCompleted ? t.blowPrompt : t.configCompleteToBlow}
                  </span>
                </div>
              </div>
            )}
            {/* 配置完成后的操作按钮 - 更优雅的设计 */}
            {configCompleted && (
              <div className="flex justify-center gap-6 items-center transition-all duration-1200 ease-in-out opacity-100">
                <button
                  onClick={() => updateState({ configCompleted: false })}
                  className="text-xs text-pink-500 hover:text-pink-600 font-medium transition-colors"
                >
                  {t.backToConfig}
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

        {/* 控制面板 - 保持在DOM流中以利于SEO，但在配置完成后隐藏 */}
        {!configCompleted && (
          <div
            className={`w-full flex flex-col items-center justify-center gap-6 transition-all duration-1200 ease-in-out ${
              configCompleted
                ? "opacity-0 pointer-events-none transform translate-y-0"
                : "opacity-100 transform -translate-y-24 md:translate-y-0"
            }`}
          >
            {/* 控制面板容器 - 移动端默认展开直到配置完成 */}
            <div
              id="controls-panel"
              ref={controlsRef}
              className={`w-full max-w-xl lg:max-w-none transition-all duration-1200 ease-in-out block opacity-100 ${
                !configCompleted ? "block opacity-100" : "hidden opacity-0"
              }`}
              role="region"
              aria-hidden={configCompleted}
            >
              <Controls state={state} updateState={updateState} t={t} />
            </div>
            )
          </div>
        )}
        <div
          className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-all duration-1500 ease-in-out ${
            configCompleted ? "opacity-60" : "opacity-40"
          }`}
        >
          <div
            className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-300/30 blur-[180px] rounded-full transition-all duration-1500 ease-in-out ${
              configCompleted ? "scale-125 animate-pulse-slow" : ""
            }`}
          ></div>
          <div
            className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-200/30 blur-[180px] rounded-full transition-all duration-1500 ease-in-out ${
              configCompleted ? "scale-125 animate-pulse-slow delay-700" : ""
            }`}
          ></div>
        </div>
      </main>

      <footer className="mt-auto py-12  text-center text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 dark:text-slate-600">
        花野猫匠心制作❤ &copy; {new Date().getFullYear()}
      </footer>
    </>
  );
};
