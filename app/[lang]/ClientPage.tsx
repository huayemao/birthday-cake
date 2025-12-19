// 客户端组件来处理交互状态
'use client';

import CakeScene from "@/components/CakeScene";
import Celebrate from "@/components/Celebrate";
import Controls from "@/components/Controls";
import { getTranslation } from "@/i18n";
import { Language, AppState, CandleType } from "@/types";
import { useState, useRef, useCallback, useEffect } from "react";

interface ClientPageProps {
  initialLang: Language;
}

// 语言名称映射，使用对应语言的名称
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  fr: "Français",
  ar: "العربية"
};

export const ClientPage: React.FC<ClientPageProps> = ({ initialLang }) => {
  // 初始状态不依赖window
  const [state, setState] = useState<AppState>({
    lang: initialLang || 'en',
    selectedCakeId: 'elegant-strawberry',
    candleType: CandleType.CLASSIC,
    candleCount: 18,
    digits: '18',
    isExtinguished: false,
    isBlowing: false,
    customCakes: {},
    userName: '', // 默认空姓名
    customMessage: '' // 默认空祝福语
  });

  // 移动端配置完成状态管理
  const [isConfigCompleted, setIsConfigCompleted] = useState(false);
  // 语言下拉菜单状态
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const updateState = (updates: Partial<AppState>) => setState(prev => ({ ...prev, ...updates }));
  const t = getTranslation(state.lang);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const blowThreshold = 0.35;
  const blowDurationRef = useRef<number>(0);

  const changeLanguage = (l: Language) => {
    window.location.href = `/${l}`;
  };

  const initMic = useCallback(async () => {
    if (state.isExtinguished) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      analyser.fftSize = 256;
      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkBlow = () => {
        if (!analyserRef.current || state.isExtinguished) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < 20; i++) sum += dataArray[i];
        const average = sum / 20 / 255;

        if (average > blowThreshold) {
          blowDurationRef.current += 1;
          updateState({ isBlowing: true });
          if (blowDurationRef.current > 6) {
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
  }, [state.isExtinguished]);

  // 监听配置完成事件
  useEffect(() => {
    const handleConfigCompleted = () => {
      setIsConfigCompleted(true);
    };

    window.addEventListener('configCompleted', handleConfigCompleted);
    return () => {
      window.removeEventListener('configCompleted', handleConfigCompleted);
    };
  }, []);

  useEffect(() => {
    initMic();
    return () => { if (audioContextRef.current) audioContextRef.current.close(); };
  }, [initMic]);

  const isRTL = state.lang === 'ar';

  return (
    <main className={`min-h-screen relative flex flex-col items-center py-8 px-4 sm:px-8 gap-12 transition-all duration-1000 ${state.isExtinguished ? 'bg-[#020617]' : 'bg-orange-50 dark:bg-slate-950'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Celebrate active={state.isExtinguished} />

      <nav className="fixed top-4 right-4 md:top-8 md:right-4 z-20 glass-panel p-1.5 rounded-2xl shadow-xl dark:bg-slate-900/50">
        {/* 语言下拉菜单 */}
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="px-4 py-1.5 rounded-[0.8rem] text-[10px] font-black uppercase transition-all flex items-center gap-2 bg-pink-500 text-white shadow-lg"
            aria-expanded={isLangMenuOpen}
            aria-haspopup="true"
          >
            {LANGUAGE_NAMES[state.lang]}
            <span className="text-sm">▼</span>
          </button>
          
          {/* 下拉菜单 */}
          {isLangMenuOpen && (
            <div className="absolute right-0 mt-1 w-40 rounded-[0.8rem] overflow-hidden shadow-xl glass-panel dark:bg-slate-900/80 z-50">
              {(['en', 'zh', 'ja', 'fr', 'ar'] as Language[]).map(l => (
                <button
                  key={l}
                  onClick={() => {
                    changeLanguage(l);
                    setIsLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase transition-all ${state.lang === l ? 'bg-pink-500 text-white' : 'text-gray-500 hover:bg-pink-100 dark:hover:bg-slate-800'}`}
                >
                  {LANGUAGE_NAMES[l]}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <header className="text-center space-y-4 z-10 max-w-2xl mt-8">
        <h1 className={`text-6xl sm:text-8xl font-serif font-black tracking-tighter transition-all duration-1000 ${state.isExtinguished ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
          {state.isExtinguished ? 
            (state.userName ? `${t.celebrate} ${state.userName}!` : t.celebrate) : 
            (state.userName ? `${state.userName}` : t.title)
          }
        </h1>
        <p className={`text-xl sm:text-2xl font-medium transition-all duration-1000 ${state.isExtinguished ? 'text-amber-400' : 'text-slate-500'}`}>
          {state.isExtinguished ? 
            (state.customMessage ? state.customMessage : '✧ 🎂 🎊 🎉 ✨ ✧') : 
            (state.customMessage ? state.customMessage : t.subtitle)
          }
        </p>
      </header>

      <div className="w-full flex flex-col-reverse lg:flex-row items-center justify-center gap-12 max-w-7xl">
        {/* 蛋糕场景 - 移动端默认隐藏，配置完成后显示 */}
        <div className={`flex-1 w-full max-w-3xl relative transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isConfigCompleted ? 'block opacity-100 animate-in fade-in slide-in-from-bottom-4 duration-700' : 'lg:block lg:opacity-100 hidden opacity-0'}`}>
          <CakeScene state={state} t={t} updateState={updateState} />
          
          {!state.isExtinguished && (
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce">
              <div className={`px-8 py-3 rounded-full glass-panel shadow-2xl border-2 transition-all duration-500 ${state.isBlowing ? 'scale-125 bg-pink-50 border-pink-400 text-pink-600' : 'border-white text-slate-500 dark:text-slate-400'}`}>
                <span className="text-xs font-black uppercase tracking-widest">{t.blowPrompt}</span>
              </div>
            </div>
          )}
          
          {/* 配置完成后返回配置的小字提示 */}
          {isConfigCompleted && (
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2">
              <button 
                onClick={() => setIsConfigCompleted(false)}
                className="text-xs text-pink-500 hover:text-pink-600 font-medium transition-colors"
              >
                {t.backToConfig}
              </button>
            </div>
          )}
        </div>

        {/* 控制面板 - 保持在DOM流中以利于SEO */}
        <div className="w-full lg:w-auto shrink-0 flex flex-col items-center justify-center gap-4">
          {/* 控制面板容器 - 移动端默认展开直到配置完成 */}
          <div 
            id="controls-panel"
            className={`w-full max-w-xl lg:max-w-none transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${!isConfigCompleted ? 'block opacity-100' : 'lg:block lg:opacity-100 hidden opacity-0'}`}
            role="region"
            aria-hidden={isConfigCompleted}
          >
            <Controls state={state} updateState={updateState} t={t} />
          </div>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none opacity-40 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-300/30 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-200/30 blur-[180px] rounded-full"></div>
      </div>

      <footer className="mt-auto py-12 text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 dark:text-slate-600">
        花野猫匠心制作❤ &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
};