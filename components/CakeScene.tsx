'use client';

import React, { useMemo } from 'react';
import { AppState, CandleType, Translation } from '../types';
import { CAKES, FlameSVG } from '../constants';

interface CakeSceneProps {
  state: AppState;
  t: Translation;
  updateState: (updates: Partial<AppState>) => void;
}

const CakeScene: React.FC<CakeSceneProps> = ({ state, t, updateState }) => {
  const selectedCake = useMemo(() => {
    if (state.selectedCakeId.startsWith('custom-')) {
      return {
        id: state.selectedCakeId,
        name: 'Custom Cake',
        customImage: state.customCakes[state.selectedCakeId],
        candleBaseY: 40,
        candleBaseWidth: 30
      };
    }
    return CAKES.find(c => c.id === state.selectedCakeId) || CAKES[0];
  }, [state.selectedCakeId, state.customCakes]);

  const candles = useMemo(() => {
    const baseWidth = selectedCake.candleBaseWidth;
    const baseY = selectedCake.candleBaseY;

    if (state.candleType === CandleType.CLASSIC) {
      const count = Math.max(1, Math.min(state.candleCount, 100));
      
      // Calculate number of circles: approximately sqrt(count/6) for natural distribution
      const numCircles = Math.max(1, Math.floor(Math.sqrt(count / 6)));
      
      // Calculate candles per circle: inner circles have fewer, outer circles more
      const candlesPerCircle = [];
      let remainingCandles = count;
      
      for (let circle = 0; circle < numCircles; circle++) {
        // First circle has 1-2 candles, others have approximately 6*circle
        const circleCandles = circle === 0 
          ? Math.min(2, remainingCandles) 
          : Math.min(Math.round(6 * circle), remainingCandles);
        candlesPerCircle.push(circleCandles);
        remainingCandles -= circleCandles;
        
        // Add any remaining candles to the last circle
        if (circle === numCircles - 1 && remainingCandles > 0) {
          candlesPerCircle[circle] += remainingCandles;
          remainingCandles = 0;
        }
      }
      
      const result = [];
      let candleIndex = 0;
      
      candlesPerCircle.forEach((circleCount, circleIndex) => {
        // Calculate circle radius: inner circles are smaller, outer circles larger
        const circleRadiusFactor = 0.3 + 0.4 * circleIndex;
        const circleRadius = (baseWidth / 2) * circleRadiusFactor;
        
        // Calculate vertical perspective depth: inner circles appear slightly higher
        const verticalOffset = circleIndex * 2;
        
        for (let i = 0; i < circleCount; i++) {
          const angle = (i / circleCount) * Math.PI * 2;
          // 使用确定性的偏移量计算，基于索引和圆圈位置
          // 这样在服务器和客户端渲染时会得到一致的结果
          const offsetX = (i * circleIndex) % 2 - 1;
          const offsetY = (circleIndex - i) % 2 - 1;
          const randomShiftX = offsetX * 0.75;
          const randomShiftY = offsetY * 0.75;
          
          const x = Math.cos(angle) * circleRadius + randomShiftX;
          const y = verticalOffset + randomShiftY;
          
          result.push({ 
            id: `c-${candleIndex}`, 
            x: 50 + x, 
            y: baseY + y, 
            label: '' 
          });
          candleIndex++;
        }
      });
      
      return result;
    } else {
      const digits = state.digits || '0';
      return digits.split('').map((char, i) => {
        const offset = (i - (digits.length - 1) / 2) * 12;
        return { id: `d-${i}`, x: 50 + offset, y: baseY - 4, label: char };
      });
    }
  }, [state.candleType, state.candleCount, state.digits, selectedCake]);

  return (
    <div className="relative w-full max-w-5xl aspect-square mx-auto overflow-hidden rounded-[4rem] shadow-2xl group transition-all duration-1000">
      {/* Background Ambience */}
      <div className={`absolute inset-0 transition-all duration-1000 ${state.isExtinguished ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-rose-50 to-amber-50 dark:from-slate-900 dark:to-slate-800'}`}></div>
      
      {/* Visual Canvas */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-12">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Cake Display - Scaled Up */}
          <div className="w-full h-full max-w-[650px] transition-transform duration-1000 group-hover:scale-[1.02]">
             {selectedCake.Component ? (
               <selectedCake.Component />
             ) : (
               <div className="w-full h-full flex items-center justify-center">
                 <img 
                   src={selectedCake.customImage} 
                   className="w-full h-full object-contain drop-shadow-2xl rounded-3xl" 
                   alt="Custom"
                 />
                 <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[80%] h-[10%] bg-black/10 blur-xl rounded-full -z-10"></div>
               </div>
             )}
          </div>
          
          {/* Candle Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {candles.map((candle) => (
              <div 
                key={candle.id}
                className="absolute"
                style={{ 
                  left: `${candle.x}%`, 
                  top: `${candle.y}%`,
                  transform: 'translate(-50%, -100%)',
                  // zIndex: Math.max(10, Math.floor(candle.y * 2)) // Improved z-sorting based on vertical depth.
                }}
              >
                {/* Flame */}
                <FlameSVG isExtinguished={state.isExtinguished} />
                
                {/* Candle Integration Shadow (Ambient Occlusion) */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-3 bg-black/15 blur-[3px] rounded-full -z-10"></div>
                
                {/* Candle Body */}
                <div className="relative animate-sway">
                  {candle.label ? (
                    <div className="text-2xl lg:text-6xl font-serif font-black text-pink-500 drop-shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl px-2 py-2 w-10 lg:w-16 text-center border-b-4 border-pink-200">
                      {candle.label}
                    </div>
                  ) : (
                    <div className="w-3 h-16 lg:w-5 lg:h-24 bg-gradient-to-t from-pink-400 via-pink-300 to-pink-200 rounded-full shadow-2xl border border-white/40">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-pink-100/50"></div>
                      <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,white_8px,white_16px)]"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Extinguished State Effects */}
      <div className={`absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] pointer-events-none transition-opacity duration-1500 ${state.isExtinguished ? 'opacity-100' : 'opacity-0'}`}></div>
      
      {/* Light Glow */}
      {!state.isExtinguished && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95%] bg-amber-200/15 blur-[180px] rounded-full animate-pulse pointer-events-none"></div>
      )}
      
      {/* Restart Prompt when candles are extinguished */}
      {state.isExtinguished && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <div className="text-xs text-pink-300 font-medium transition-colors animate-pulse">
            {t.restartPrompt}
          </div>
        </div>
      )}
      
      {/* Reset Button when candles are extinguished */}
      {state.isExtinguished && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-xs px-8">
          <button 
            onClick={() => updateState({ isExtinguished: false })}
            className="w-full py-6 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:scale-[1.02] text-white font-black rounded-[2rem] shadow-2xl shadow-pink-200/50 transition-all active:scale-95 animate-in zoom-in duration-500 uppercase tracking-[0.3em] text-xs"
          >
            {t.reset}
          </button>
        </div>
      )}
    </div>
  );
};

export default CakeScene;