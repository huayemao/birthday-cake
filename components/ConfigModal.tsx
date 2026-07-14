'use client';

import React, { useRef } from 'react';
import { AppState, CandleType, Translation } from '../types';
import { CAKES } from '../constants';

interface ConfigModalProps {
  state: AppState;
  updateState: (updates: Partial<AppState>) => void;
  t: Translation;
  isOpen: boolean;
  currentStep: number;
  onClose: () => void;
  onStepChange: (step: number) => void;
  onComplete: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ 
  state, 
  updateState, 
  t, 
  isOpen, 
  currentStep, 
  onClose, 
  onStepChange, 
  onComplete 
}) => {
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

  const steps = [
    { id: 1, title: t.chooseCake },
    { id: 2, title: t.chooseCandle },
    { id: 3, title: t.customize },
    { id: 4, title: t.sensitivity }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      onStepChange(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1);
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 transition-all duration-500 ${
        isOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      aria-label={t.customize}
    >
      <div 
        className={`absolute inset-0 bg-slate-950/20 transition-all duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <div 
        className={`fixed inset-y-0 ${isRTL ? 'left-0' : 'right-0'} w-full max-w-lg shadow-2xl transition-all duration-500 transform overflow-hidden flex flex-col ${
          isOpen 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 translate-x-full'
        } ${isRTL ? 'translate-x-[-100%]' : ''}`}
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)'
        }}
      >
        <div className="flex justify-end pt-6 pr-6">
          <button
            onClick={onClose}
            className="p-3 text-gray-400 hover:text-white transition-colors"
            aria-label={t.closeControls}
          >
            <span className="text-2xl">✕</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          <ol className="flex justify-between items-center mb-10">
            {steps.map((step) => (
              <li 
                key={step.id} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => onStepChange(step.id)}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                    currentStep >= step.id
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200/50'
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-400'
                  }`}
                >
                  {step.id}
                </div>
                <span 
                  className={`text-[10px] font-black uppercase tracking-widest mt-3 transition-all duration-300 ${
                    currentStep === step.id
                      ? 'text-pink-500'
                      : 'text-gray-400 dark:text-slate-500'
                  }`}
                >
                  {step.title}
                </span>
              </li>
            ))}
          </ol>

          <div className="h-1 bg-gray-200 dark:bg-slate-700 rounded-full mb-10">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>

          <div className="relative" onPaste={onPaste}>
            <ol className="space-y-0">
              <li 
                className={`transition-all duration-500 overflow-hidden ${
                  currentStep === 1 
                    ? 'opacity-100 max-h-[800px] pointer-events-auto' 
                    : 'opacity-0 max-h-0 pointer-events-none'
                }`}
              >
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 dark:text-slate-500 mb-6">
                    {t.chooseCake}
                  </h2>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">
                      {t.selectCake}
                    </span>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[10px] font-bold uppercase tracking-widest text-pink-500 hover:text-pink-600 transition-colors"
                      aria-label={t.uploadCustom}
                    >
                      + {t.uploadCustom}
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="sr-only" 
                      accept="image/*" 
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
                      aria-label={t.uploadCustom}
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 p-2">
                    {CAKES.map((cake) => (
                      <button
                        key={cake.id}
                        onClick={() => updateState({ selectedCakeId: cake.id })}
                        className={`relative overflow-hidden aspect-square rounded-[1.8rem] border-2 transition-all duration-500 p-2 ${
                          state.selectedCakeId === cake.id 
                          ? 'border-pink-400 bg-white dark:bg-slate-800 scale-110 shadow-2xl z-10' 
                          : 'border-transparent bg-gray-50/50 dark:bg-slate-800/40 opacity-50 hover:opacity-100'
                        }`}
                        aria-label={cake.name}
                        aria-selected={state.selectedCakeId === cake.id}
                      >
                        <div className="w-full h-full scale-125">
                          <cake.Component />
                        </div>
                      </button>
                    ))}
                    {Object.entries(state.customCakes).map(([id, url]) => (
                      <button
                        key={id}
                        onClick={() => updateState({ selectedCakeId: id })}
                        className={`relative overflow-hidden aspect-square rounded-[1.8rem] border-2 transition-all duration-500 ${
                          state.selectedCakeId === id 
                          ? 'border-pink-400 bg-white scale-110 shadow-2xl z-10' 
                          : 'border-transparent opacity-50'
                        }`}
                        aria-label={t.customize}
                        aria-selected={state.selectedCakeId === id}
                      >
                        <img src={url} className="w-full h-full object-cover" alt={t.customize} />
                      </button>
                    ))}
                  </div>
                </section>
              </li>

              <li 
                className={`transition-all duration-500 overflow-hidden ${
                  currentStep === 2 
                    ? 'opacity-100 max-h-[800px] pointer-events-auto' 
                    : 'opacity-0 max-h-0 pointer-events-none'
                }`}
              >
                <section className="space-y-8">
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 dark:text-slate-500">
                    {t.chooseCandle}
                  </h2>
                  <div className="flex bg-gray-100/50 dark:bg-slate-800/50 p-1 rounded-2xl">
                    <button
                      onClick={() => updateState({ candleType: CandleType.CLASSIC })}
                      className={`flex-1 py-3 rounded-[1rem] text-xs font-black transition-all ${state.candleType === CandleType.CLASSIC ? 'bg-white dark:bg-slate-700 shadow-xl text-pink-600' : 'text-gray-400'}`}
                      aria-label={t.classic}
                      aria-selected={state.candleType === CandleType.CLASSIC}
                    >
                      {t.classic}
                    </button>
                    <button
                      onClick={() => updateState({ candleType: CandleType.DIGITS })}
                      className={`flex-1 py-3 rounded-[1rem] text-xs font-black transition-all ${state.candleType === CandleType.DIGITS ? 'bg-white dark:bg-slate-700 shadow-xl text-pink-600' : 'text-gray-400'}`}
                      aria-label={t.digits}
                      aria-selected={state.candleType === CandleType.DIGITS}
                    >
                      {t.digits}
                    </button>
                  </div>

                  <div className="px-1">
                    {state.candleType === CandleType.CLASSIC ? (
                      <div>
                        <div className="flex justify-between items-end mb-8">
                          <div className="flex items-center gap-2">
                            <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                              {t.numberOfCandles}
                            </label>
                            <span className="text-[8px] text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                              {t.optional}
                            </span>
                          </div>
                          <span className="text-5xl font-serif font-black text-pink-500">
                            {state.candleCount}
                          </span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="50" 
                          value={state.candleCount}
                          onChange={(e) => updateState({ candleCount: parseInt(e.target.value) })}
                          className="w-full accent-pink-500 cursor-none h-2 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none transition-all"
                          aria-label={t.numberOfCandles}
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                          {t.digitValue}
                          <span className="text-[8px] text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                            {t.optional}
                          </span>
                        </label>
                        <input 
                          type="text" 
                          value={state.digits}
                          maxLength={4}
                          onChange={(e) => updateState({ digits: e.target.value.replace(/[^0-9]/g, '') })}
                          className="w-full px-8 py-5 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-[1.5rem] focus:border-pink-400 focus:outline-none text-center text-4xl tracking-[0.15em] font-serif font-black text-pink-500 shadow-inner"
                          placeholder="00"
                          aria-label={t.digitValue}
                        />
                      </div>
                    )}
                  </div>
                </section>
              </li>

              <li 
                className={`transition-all duration-500 overflow-hidden ${
                  currentStep === 3 
                    ? 'opacity-100 max-h-[800px] pointer-events-auto' 
                    : 'opacity-0 max-h-0 pointer-events-none'
                }`}
              >
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 dark:text-slate-500 mb-8">
                    {t.customize}
                  </h2>

                  <div className="mb-6">
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                      {t.name}
                      <span className="text-[8px] text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                        {t.optional}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={state.userName}
                      onChange={(e) => updateState({ userName: e.target.value })}
                      placeholder={t.enterName}
                      className="w-full px-6 py-3 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-[1.5rem] focus:border-pink-400 focus:outline-none text-center text-lg font-serif font-black text-pink-500 shadow-inner"
                      aria-label={t.name}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                      {t.from}
                      <span className="text-[8px] text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                        {t.optional}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={state.giverName}
                      onChange={(e) => updateState({ giverName: e.target.value })}
                      placeholder={t.enterGiverName}
                      className="w-full px-6 py-3 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-[1.5rem] focus:border-pink-400 focus:outline-none text-center text-lg font-serif font-black text-pink-500 shadow-inner"
                      aria-label={t.from}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                      {t.message}
                      <span className="text-[8px] text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                        {t.optional}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={state.customMessage}
                      onChange={(e) => updateState({ customMessage: e.target.value })}
                      placeholder={t.enterMessage}
                      className="w-full px-6 py-3 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-[1.5rem] focus:border-pink-400 focus:outline-none text-center text-lg font-serif font-black text-pink-500 shadow-inner"
                      aria-label={t.message}
                    />
                  </div>
                </section>
              </li>

              <li 
                className={`transition-all duration-500 overflow-hidden ${
                  currentStep === 4 
                    ? 'opacity-100 max-h-[800px] pointer-events-auto' 
                    : 'opacity-0 max-h-0 pointer-events-none'
                }`}
              >
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 dark:text-slate-500 mb-8">
                    {t.sensitivity}
                  </h2>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-black text-pink-500">
                      {state.blowSensitivity}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 font-black">
                      {t.sensitivityLow}
                    </span>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={state.blowSensitivity}
                      onChange={(e) => updateState({ blowSensitivity: parseInt(e.target.value) })}
                      className="flex-1 accent-pink-500 cursor-none h-2 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none transition-all"
                      aria-label={t.sensitivity}
                    />
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 font-black">
                      {t.sensitivityHigh}
                    </span>
                  </div>
                </section>
              </li>
            </ol>
          </div>
        </div>

        <div className="p-8 pt-4 border-t border-gray-100 dark:border-slate-700 bg-slate-900/50 backdrop-blur-md">
          <div className="flex justify-between items-center gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`flex-1 py-4 rounded-[1rem] text-xs font-black uppercase tracking-widest transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 cursor-not-allowed'
                  : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'
              }`}
              aria-label={t.prevStep}
            >
              {t.prevStep}
            </button>
            <button
              onClick={handleNext}
              className="flex-1 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:scale-[1.02] text-white font-black rounded-[1rem] shadow-2xl shadow-pink-200/50 transition-all active:scale-95 uppercase tracking-[0.25em] text-xs"
              aria-label={currentStep === 4 ? t.completeConfig : t.nextStep}
            >
              {currentStep === 4 ? t.completeConfig : t.nextStep}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;