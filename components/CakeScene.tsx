
import React, { useMemo } from 'react';
import { AppState, CandleType } from '../types';
import { CAKES, FlameSVG } from '../constants';

interface CakeSceneProps {
  state: AppState;
}

const CakeScene: React.FC<CakeSceneProps> = ({ state }) => {
  const selectedCake = useMemo(() => {
    if (state.selectedCakeId.startsWith('custom-')) {
      return {
        id: state.selectedCakeId,
        name: 'Custom Cake',
        customImage: state.customCakes[state.selectedCakeId],
        candleBaseY: 40,
        candleBaseWidth: 50
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
          // Add slight randomness for natural feel
          const randomShiftX = (Math.random() - 0.5) * 1.5;
          const randomShiftY = (Math.random() - 0.5) * 1.5;
          
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
        return { id: `d-${i}`, x: 50 + offset, y: baseY, label: char };
      });
    }
  }, [state.candleType, state.candleCount, state.digits, selectedCake]);

  return (
    <div className="relative w-full max-w-5xl aspect-square sm:aspect-[4/3] mx-auto overflow-hidden rounded-[4rem] shadow-2xl group transition-all duration-1000">
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
                  zIndex: Math.floor(candle.y * 100) // Improved z-sorting based on vertical depth
                }}
              >
                {/* Flame */}
                <FlameSVG isExtinguished={state.isExtinguished} />
                
                {/* Candle Integration Shadow (Ambient Occlusion) */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-3 bg-black/15 blur-[3px] rounded-full -z-10"></div>
                
                {/* Candle Body */}
                <div className="relative animate-sway">
                  {candle.label ? (
                    <div className="text-6xl font-serif font-black text-pink-500 drop-shadow-2xl bg-white/95 backdrop-blur-md rounded-[2rem] px-5 py-2 min-w-[75px] text-center border-b-[12px] border-pink-200">
                      {candle.label}
                    </div>
                  ) : (
                    <div className="w-4 h-28 bg-gradient-to-t from-pink-400 via-pink-300 to-pink-200 rounded-full shadow-2xl border border-white/40">
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
    </div>
  );
};

export default CakeScene;
