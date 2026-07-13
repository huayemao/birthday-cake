'use client';

import React, { useRef } from 'react';
import { AppState, CandleType, Translation } from '../types';
import { CAKES } from '../constants';

interface ControlsProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  t: Translation;
  isOpen: boolean;
  onClose: () => void;
}

const Controls: React.FC<ControlsProps> = ({ state, updateState, t, isOpen, onClose }) => {
  const isRTL = state.lang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const id = `custom-${Date.now()}`;
      updateState({
        customCakes: { ...state.customCakes, [id]: dataUrl },
        selectedCakeId: id
      });
    };
    reader.readAsDataURL(file);
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const item = e.clipboardData.items[0];
    if (item?.type.startsWith('image/')) {
      handleFile(item.getAsFile()!);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center p-4 transition-all duration-500 ${
        isOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-[3rem] shadow-2xl flex flex-col gap-6 transition-all duration-500 ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-8'
        } ${isRTL ? 'text-right' : 'text-left'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
        onPaste={onPaste}
      >
        <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95"></div>
        <div className="absolute inset-0 rounded-[3rem] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]"></div>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px] bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"></div>

        <button
          onClick={onClose}
          className="relative z-10 absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all duration-300"
        >
          ✕
        </button>

        <div className="relative z-10 flex flex-col items-center gap-2 mb-4">
          <div className="text-3xl">⚙️</div>
          <div className="text-xl font-serif font-black text-white tracking-tight">
            {t.openControls}
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-5">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 dark:text-slate-400">
                {t.chooseCake}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-bold uppercase tracking-widest text-pink-400 hover:text-pink-300 transition-colors"
              >
                + {t.uploadCustom}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
              />
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {CAKES.map((cake) => (
                <button
                  key={cake.id}
                  onClick={() => updateState({ selectedCakeId: cake.id })}
                  className={`relative overflow-hidden aspect-square rounded-[1.5rem] border-2 transition-all duration-500 p-2 ${
                    state.selectedCakeId === cake.id 
                    ? 'border-pink-400 bg-white/10 scale-110 shadow-2xl shadow-pink-500/20 z-10' 
                    : 'border-transparent bg-white/5 opacity-60 hover:opacity-100 hover:bg-white/10'
                  }`}
                >
                  <div className="w-full h-full scale-125">
                    <cake.Component />
                  </div>
                  {state.selectedCakeId === cake.id && (
                    <div className="absolute inset-0 rounded-[1.5rem] bg-pink-500/20 animate-pulse"></div>
                  )}
                </button>
              ))}
              {Object.entries(state.customCakes).map(([id, url]) => (
                <button
                  key={id}
                  onClick={() => updateState({ selectedCakeId: id })}
                  className={`relative overflow-hidden aspect-square rounded-[1.5rem] border-2 transition-all duration-500 ${
                    state.selectedCakeId === id 
                    ? 'border-pink-400 bg-white/10 scale-110 shadow-2xl shadow-pink-500/20 z-10' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} className="w-full h-full object-cover" alt="Custom" />
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 dark:text-slate-400 mb-5">
              {t.chooseCandle}
            </div>
            <div className="flex bg-white/5 p-1.5 rounded-2xl">
              <button
                onClick={() => updateState({ candleType: CandleType.CLASSIC })}
                className={`flex-1 py-3 rounded-[1rem] text-xs font-black transition-all duration-300 ${state.candleType === CandleType.CLASSIC ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                {t.classic}
              </button>
              <button
                onClick={() => updateState({ candleType: CandleType.DIGITS })}
                className={`flex-1 py-3 rounded-[1rem] text-xs font-black transition-all duration-300 ${state.candleType === CandleType.DIGITS ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                {t.digits}
              </button>
            </div>

            <div className="mt-6">
              {state.candleType === CandleType.CLASSIC ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                      <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{t.numberOfCandles}</div>
                      <span className="text-[8px] text-gray-500 uppercase tracking-widest">{t.optional}</span>
                    </div>
                    <span className="text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-400">
                      {state.candleCount}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={state.candleCount}
                    onChange={(e) => updateState({ candleCount: parseInt(e.target.value) })}
                    className="w-full accent-pink-500 h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{t.digitValue}</div>
                    <span className="text-[8px] text-gray-500 uppercase tracking-widest">{t.optional}</span>
                  </div>
                  <input 
                    type="text" 
                    value={state.digits}
                    maxLength={4}
                    onChange={(e) => updateState({ digits: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-[1.5rem] focus:border-pink-500 focus:outline-none text-center text-4xl tracking-[0.15em] font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-400 transition-all"
                  />
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 dark:text-slate-400 mb-6">
              {t.customize}
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{t.name}</div>
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest">{t.optional}</span>
                </div>
                <input
                  type="text"
                  value={state.userName}
                  onChange={(e) => updateState({ userName: e.target.value })}
                  placeholder={t.enterName}
                  className="w-full px-5 py-3 bg-white/5 border-2 border-white/10 rounded-[1.2rem] focus:border-pink-500 focus:outline-none text-center text-lg font-serif font-black text-white placeholder-gray-600 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{t.from}</div>
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest">{t.optional}</span>
                </div>
                <input
                  type="text"
                  value={state.giverName}
                  onChange={(e) => updateState({ giverName: e.target.value })}
                  placeholder={t.enterGiverName}
                  className="w-full px-5 py-3 bg-white/5 border-2 border-white/10 rounded-[1.2rem] focus:border-pink-500 focus:outline-none text-center text-lg font-serif font-black text-white placeholder-gray-600 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{t.message}</div>
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest">{t.optional}</span>
                </div>
                <input
                  type="text"
                  value={state.customMessage}
                  onChange={(e) => updateState({ customMessage: e.target.value })}
                  placeholder={t.enterMessage}
                  className="w-full px-5 py-3 bg-white/5 border-2 border-white/10 rounded-[1.2rem] focus:border-pink-500 focus:outline-none text-center text-lg font-serif font-black text-white placeholder-gray-600 transition-all"
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 dark:text-slate-400">{t.sensitivity}</div>
              <span className="text-sm font-black text-pink-400">{state.blowSensitivity}%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gray-500 font-black">{t.sensitivityLow}</span>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={state.blowSensitivity}
                onChange={(e) => updateState({ blowSensitivity: parseInt(e.target.value) })}
                className="flex-1 accent-pink-500 h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
              />
              <span className="text-[10px] text-gray-500 font-black">{t.sensitivityHigh}</span>
            </div>
          </section>

          <button 
            onClick={() => {
              updateState({ configCompleted: true, controlsOpen: false });
            }}
            className="w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:scale-[1.02] text-white font-black rounded-[1.5rem] shadow-2xl shadow-pink-500/30 transition-all duration-300 active:scale-95 uppercase tracking-[0.25em] text-sm"
          >
            {t.completeConfig}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;