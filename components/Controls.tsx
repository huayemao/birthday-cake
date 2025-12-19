'use client';

import React, { useRef } from 'react';
import { AppState, CandleType, Translation } from '../types';
import { CAKES } from '../constants';

interface ControlsProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  t: Translation;
}

const Controls: React.FC<ControlsProps> = ({ state, updateState, t }) => {
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
      onPaste={onPaste}
      className={`glass-panel p-6 sm:p-10 rounded-[3.5rem] shadow-2xl w-full max-w-xl flex flex-col gap-10 transition-all duration-700 dark:bg-slate-900/80 dark:border-slate-700 ${isRTL ? 'text-right' : 'text-left'}`} 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Cake Selection */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 dark:text-slate-500">{t.chooseCake}</h3>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] font-bold uppercase tracking-widest text-pink-500 hover:text-pink-600 transition-colors"
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
              className={`relative overflow-hidden aspect-square rounded-[1.8rem] border-2 transition-all duration-500 p-2 ${
                state.selectedCakeId === cake.id 
                ? 'border-pink-400 bg-white dark:bg-slate-800 scale-110 shadow-2xl z-10' 
                : 'border-transparent bg-gray-50/50 dark:bg-slate-800/40 opacity-50 hover:opacity-100'
              }`}
            >
              <div className="w-full h-full scale-125">
                <cake.Component />
              </div>
            </button>
          ))}
          {/* Custom Cakes */}
          {Object.entries(state.customCakes).map(([id, url]) => (
            <button
              key={id}
              onClick={() => updateState({ selectedCakeId: id })}
              className={`relative overflow-hidden aspect-square rounded-[1.8rem] border-2 transition-all duration-500 ${
                state.selectedCakeId === id 
                ? 'border-pink-400 bg-white scale-110 shadow-2xl z-10' 
                : 'border-transparent opacity-50'
              }`}
            >
              <img src={url} className="w-full h-full object-cover" alt="Custom" />
            </button>
          ))}
        </div>
      </section>

      {/* Candle Settings */}
      <section className="space-y-8">
        <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 dark:text-slate-500">{t.chooseCandle}</h3>
        <div className="flex bg-gray-100/50 dark:bg-slate-800/50 p-1.5 rounded-3xl">
          <button
            onClick={() => updateState({ candleType: CandleType.CLASSIC })}
            className={`flex-1 py-3.5 rounded-[1.2rem] text-sm font-black transition-all ${state.candleType === CandleType.CLASSIC ? 'bg-white dark:bg-slate-700 shadow-xl text-pink-600' : 'text-gray-400'}`}
          >
            {t.classic}
          </button>
          <button
            onClick={() => updateState({ candleType: CandleType.DIGITS })}
            className={`flex-1 py-3.5 rounded-[1.2rem] text-sm font-black transition-all ${state.candleType === CandleType.DIGITS ? 'bg-white dark:bg-slate-700 shadow-xl text-pink-600' : 'text-gray-400'}`}
          >
            {t.digits}
          </button>
        </div>

        <div className="px-1">
          {state.candleType === CandleType.CLASSIC ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end mb-6">
                <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{t.numberOfCandles}</label>
                <span className="text-4xl font-serif font-black text-pink-500">{state.candleCount}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                value={state.candleCount}
                onChange={(e) => updateState({ candleCount: parseInt(e.target.value) })}
                className="w-full accent-pink-500 cursor-none h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none transition-all"
              />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">{t.digitValue}</label>
              <input 
                type="text" 
                value={state.digits}
                maxLength={4}
                onChange={(e) => updateState({ digits: e.target.value.replace(/[^0-9]/g, '') })}
                className="w-full px-8 py-5 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-[2rem] focus:border-pink-400 focus:outline-none text-center text-5xl tracking-[0.2em] font-serif font-black text-pink-500 shadow-inner"
              />
            </div>
          )}
        </div>
      </section>

      {/* Customization Section */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 dark:text-slate-500 mb-6">{state.lang === 'zh' ? '个性化设置' : 'Customize'}</h3>
        
        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">{state.lang === 'zh' ? '姓名' : 'Name'}</label>
          <input 
            type="text" 
            value={state.userName}
            onChange={(e) => updateState({ userName: e.target.value })}
            placeholder={state.lang === 'zh' ? '输入姓名' : 'Enter name'}
            className="w-full px-8 py-4 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-[2rem] focus:border-pink-400 focus:outline-none text-center text-xl font-serif font-black text-pink-500 shadow-inner"
          />
        </div>
        
        {/* Custom Message Input */}
        <div>
          <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">{state.lang === 'zh' ? '祝福语' : 'Message'}</label>
          <input 
            type="text" 
            value={state.customMessage}
            onChange={(e) => updateState({ customMessage: e.target.value })}
            placeholder={state.lang === 'zh' ? '输入祝福语' : 'Enter message'}
            className="w-full px-8 py-4 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-[2rem] focus:border-pink-400 focus:outline-none text-center text-xl font-serif font-black text-pink-500 shadow-inner"
          />
        </div>
      </section>

      {/* 移动端配置完成按钮 */}
      <div className="lg:hidden">
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('configCompleted'))}
          className="w-full py-6 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:scale-[1.02] text-white font-black rounded-[2rem] shadow-2xl shadow-pink-200/50 transition-all active:scale-95 animate-in zoom-in duration-500 uppercase tracking-[0.3em] text-xs"
        >
          {t.completeConfig}
        </button>
      </div>

      {/* Reset State Button */}
      {state.isExtinguished && (
        <button 
          onClick={() => updateState({ isExtinguished: false })}
          className="w-full py-6 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:scale-[1.02] text-white font-black rounded-[2rem] shadow-2xl shadow-pink-200/50 transition-all active:scale-95 animate-in zoom-in duration-500 uppercase tracking-[0.3em] text-xs"
        >
          {t.reset}
        </button>
      )}
    </div>
  );
};

export default Controls;