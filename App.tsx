
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, Language, CandleType } from './types';
import { getTranslation } from './i18n';
import CakeScene from './components/CakeScene';
import Controls from './components/Controls';
import Celebrate from './components/Celebrate';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const hash = window.location.hash.replace('#/', '');
    const validLangs: Language[] = ['zh', 'en', 'ja', 'fr', 'ar'];
    const lang = validLangs.includes(hash as Language) ? (hash as Language) : 'en';
    return {
      lang,
      selectedCakeId: 'elegant-strawberry',
      candleType: CandleType.CLASSIC,
      candleCount: 1,
      digits: '23',
      isExtinguished: false,
      isBlowing: false,
      customCakes: {},
      userName: '', // 默认空姓名
      customMessage: '' // 默认空祝福语
    };
  });

  const updateState = (updates: Partial<AppState>) => setState(prev => ({ ...prev, ...updates }));
  const t = getTranslation(state.lang);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const blowThreshold = 0.35;
  const blowDurationRef = useRef<number>(0);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      const validLangs: Language[] = ['zh', 'en', 'ja', 'fr', 'ar'];
      if (validLangs.includes(hash as Language)) {
        updateState({ lang: hash as Language });
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeLanguage = (l: Language) => {
    window.location.hash = `#/${l}`;
    updateState({ lang: l });
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

  useEffect(() => {
    initMic();
    return () => { if (audioContextRef.current) audioContextRef.current.close(); };
  }, [initMic]);

  const isRTL = state.lang === 'ar';

  return (
    <main className={`min-h-screen relative flex flex-col items-center py-8 px-4 sm:px-8 gap-12 transition-all duration-1000 ${state.isExtinguished ? 'bg-[#020617]' : 'bg-orange-50 dark:bg-slate-950'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Celebrate active={state.isExtinguished} />

      <nav className="fixed top-8 right-8 z-50 flex gap-1.5 glass-panel p-1.5 rounded-2xl shadow-xl dark:bg-slate-900/50">
        {(['en', 'zh', 'ja', 'fr', 'ar'] as Language[]).map(l => (
          <button 
            key={l}
            onClick={() => changeLanguage(l)}
            className={`px-4 py-1.5 rounded-[0.8rem] text-[10px] font-black transition-all uppercase ${state.lang === l ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-500 hover:text-pink-500'}`}
          >
            {l}
          </button>
        ))}
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

      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-12 max-w-7xl">
        <div className="flex-1 w-full max-w-3xl relative">
          <CakeScene state={state} />
          
          {!state.isExtinguished && (
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce">
              <div className={`px-8 py-3 rounded-full glass-panel shadow-2xl border-2 transition-all duration-500 ${state.isBlowing ? 'scale-125 bg-pink-50 border-pink-400 text-pink-600' : 'border-white text-slate-500 dark:text-slate-400'}`}>
                <span className="text-xs font-black uppercase tracking-widest">{t.blowPrompt}</span>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-auto shrink-0 flex items-start justify-center">
          <Controls state={state} updateState={updateState} t={t} />
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none opacity-40 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-300/30 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-200/30 blur-[180px] rounded-full"></div>
      </div>

      <footer className="mt-auto py-12 text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 dark:text-slate-600">
        Lumina Magical Experience &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
};

export default App;