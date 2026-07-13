'use client';

import React from 'react';
import { Translation, Language } from '../types';

interface WelcomeOverlayProps {
  t: Translation;
  lang: Language;
  onPersonalize: () => void;
  onStartNow: () => void;
}

export const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({
  t,
  lang,
  onPersonalize,
  onStartNow,
}) => {
  const isRTL = lang === 'ar';

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-pink-900/95 via-slate-950/95 to-amber-900/95 backdrop-blur-xl"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-400/40 blur-[200px] rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-300/40 blur-[200px] rounded-full animate-pulse-slow delay-700"></div>
        <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-rose-400/20 blur-[150px] rounded-full animate-pulse-slow delay-300"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12 px-6 max-w-lg mx-auto text-center">
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
          <div className="text-8xl md:text-9xl animate-bounce">🎂</div>
          <div className="text-4xl md:text-6xl font-serif font-black text-white tracking-tight">
            {t.welcomeTitle}
          </div>
          <div className="text-lg md:text-xl text-slate-300 font-medium">
            {t.welcomeSubtitle}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <button
            onClick={onPersonalize}
            className="flex-1 py-5 px-8 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-black text-lg rounded-[2rem] shadow-2xl shadow-pink-200/30 hover:shadow-pink-200/50 hover:scale-[1.03] transition-all duration-300 active:scale-95 uppercase tracking-[0.15em]"
          >
            {t.welcomePersonalize}
          </button>
          <button
            onClick={onStartNow}
            className="flex-1 py-5 px-8 bg-white/10 backdrop-blur-md text-white font-black text-lg rounded-[2rem] border-2 border-white/20 hover:bg-white/20 hover:border-white/40 hover:scale-[1.03] transition-all duration-300 active:scale-95 uppercase tracking-[0.15em]"
          >
            {t.welcomeStartNow}
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium animate-in fade-in duration-1000 delay-500">
          {t.subtitle}
        </div>
      </div>
    </div>
  );
};

export default WelcomeOverlay;