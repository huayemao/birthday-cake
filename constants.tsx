'use client';

import React from 'react';
import { CakeOption } from './types';

// --- Refined, Luminous 2D SVG Cake Illustrations ---

const StrawberryCakeSVG = () => (
  <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="sb_pink" x1="250" y1="280" x2="250" y2="430" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFE4EC" />
        <stop offset="1" stopColor="#FBB6CE" />
      </linearGradient>
      <linearGradient id="sb_ivory" x1="250" y1="180" x2="250" y2="310" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#FFF1F5" />
      </linearGradient>
      <linearGradient id="sb_drip" x1="250" y1="170" x2="250" y2="270" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFADC7" />
        <stop offset="1" stopColor="#F472B6" />
      </linearGradient>
    </defs>
    {/* Sleek Gold Cake Board */}
    <ellipse cx="250" cy="426" rx="190" ry="22" fill="#E6C16D" />
    <ellipse cx="250" cy="422" rx="184" ry="18" fill="#FFFDF9" opacity="0.9" />

    {/* Bottom Tier */}
    <rect x="76" y="298" width="348" height="122" rx="26" fill="url(#sb_pink)" />
    <rect x="76" y="380" width="348" height="18" fill="#FB7185" opacity="0.85" />
    {/* Pearl Border */}
    {Array.from({ length: 13 }).map((_, i) => (
      <circle key={i} cx={92 + i * 26.5} cy={414} r="8" fill="#FFFDFB" />
    ))}

    {/* Top Tier */}
    <rect x="116" y="188" width="268" height="118" rx="24" fill="url(#sb_ivory)" />

    {/* Glossy Strawberry Drip */}
    <path d="M116 238C116 238 144 268 172 246C198 226 218 274 250 250C282 226 306 270 338 244C364 224 384 252 384 234V208C384 188 344 172 296 172H204C156 172 116 188 116 208V238Z" fill="url(#sb_drip)" />

    {/* Whipped Cream Rosettes */}
    {[140, 195, 250, 305, 360].map((cx, i) => (
      <g key={i}>
        <circle cx={cx} cy={186} r="18" fill="#FFFFFF" />
        <circle cx={cx} cy={176} r="10" fill="#FFF1F5" />
      </g>
    ))}

    {/* Fresh Strawberries */}
    {[166, 250, 334].map((cx, i) => (
      <g key={i} transform={`translate(${cx}, ${i === 1 ? 168 : 174})`}>
        <path d="M0 -18 C14 -14 16 10 0 18 C-16 10 -14 -14 0 -18 Z" fill="#F43F5E" />
        <path d="M-10 -14 L0 -6 L10 -14 L4 -18 L0 -12 L-4 -18 Z" fill="#22C55E" />
        <circle cx="-4" cy="-2" r="1.6" fill="#FEF3C7" />
        <circle cx="4" cy="2" r="1.6" fill="#FEF3C7" />
        <circle cx="0" cy="8" r="1.6" fill="#FEF3C7" />
      </g>
    ))}
  </svg>
);

const ChocolateCakeSVG = () => (
  <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="ch_body" x1="250" y1="190" x2="250" y2="430" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6F3920" />
        <stop offset="1" stopColor="#3F1D0E" />
      </linearGradient>
      <linearGradient id="ch_ganache" x1="250" y1="170" x2="250" y2="290" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B180A" />
        <stop offset="1" stopColor="#1E0C05" />
      </linearGradient>
      <linearGradient id="ch_gold" x1="80" y1="0" x2="420" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE047" />
        <stop offset="0.5" stopColor="#F59E0B" />
        <stop offset="1" stopColor="#FEF08A" />
      </linearGradient>
    </defs>
    {/* Sleek Gold Cake Board */}
    <ellipse cx="250" cy="426" rx="184" ry="20" fill="#E6C16D" />
    <ellipse cx="250" cy="422" rx="178" ry="16" fill="#FFFDF9" opacity="0.88" />

    {/* Bottom & Top Tiers */}
    <rect x="82" y="294" width="336" height="126" rx="20" fill="url(#ch_body)" />
    <rect x="116" y="198" width="268" height="106" rx="18" fill="url(#ch_body)" />

    {/* Gold Trim Bands */}
    <rect x="82" y="394" width="336" height="7" fill="url(#ch_gold)" />
    <rect x="116" y="296" width="268" height="5" fill="url(#ch_gold)" />

    {/* Glossy Ganache Drip */}
    <path d="M116 242C116 242 142 276 168 250C194 226 222 284 252 252C282 222 312 276 342 248C366 228 384 254 384 238V212C384 192 346 180 296 180H204C154 180 116 192 116 212V242Z" fill="url(#ch_ganache)" />

    {/* Specular Shine */}
    <rect x="134" y="206" width="16" height="84" rx="8" fill="#FFFFFF" opacity="0.1" />
    <rect x="100" y="310" width="18" height="80" rx="9" fill="#FFFFFF" opacity="0.08" />

    {/* Golden Truffles & Raspberries */}
    <circle cx="154" cy="292" r="14" fill="url(#ch_gold)" />
    <circle cx="346" cy="292" r="14" fill="url(#ch_gold)" />
    <circle cx="186" cy="186" r="14" fill="#E11D48" />
    <circle cx="250" cy="180" r="15" fill="url(#ch_gold)" />
    <circle cx="314" cy="186" r="14" fill="#E11D48" />
  </svg>
);

const RainbowCakeSVG = () => (
  <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="rb_body" x1="250" y1="190" x2="250" y2="420" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFC8DD" />
        <stop offset="22%" stopColor="#FFD8BE" />
        <stop offset="44%" stopColor="#FFF3B0" />
        <stop offset="66%" stopColor="#C7F9CC" />
        <stop offset="84%" stopColor="#BDE0FE" />
        <stop offset="100%" stopColor="#E0C3FC" />
      </linearGradient>
    </defs>
    {/* Sleek Gold Cake Board */}
    <ellipse cx="250" cy="426" rx="184" ry="20" fill="#E6C16D" />
    <ellipse cx="250" cy="422" rx="178" ry="16" fill="#FFFDF9" opacity="0.88" />

    {/* Tall Rainbow Body */}
    <rect x="98" y="196" width="304" height="224" rx="24" fill="url(#rb_body)" />

    {/* Cloud White Frosting Drip */}
    <path d="M98 242V208C98 186 140 170 250 170C360 170 402 186 402 208V242C402 242 374 282 340 250C306 218 278 286 244 248C210 212 174 280 142 248C118 224 98 256 98 242Z" fill="#FFFFFF" />

    {/* Colorful Sprinkles */}
    <rect x="148" y="192" width="14" height="5" rx="2.5" transform="rotate(-20 148 192)" fill="#F43F5E" />
    <rect x="206" y="182" width="14" height="5" rx="2.5" transform="rotate(24 206 182)" fill="#38BDF8" />
    <rect x="276" y="186" width="14" height="5" rx="2.5" transform="rotate(-15 276 186)" fill="#34D399" />
    <rect x="334" y="196" width="14" height="5" rx="2.5" transform="rotate(30 334 196)" fill="#FACC15" />
    <rect x="242" y="206" width="14" height="5" rx="2.5" transform="rotate(12 242 206)" fill="#A855F7" />

    {/* Bottom Pastel Puffs */}
    {['#FFB3C6', '#FFCBA4', '#FEF08A', '#A7F3D0', '#BAE6FD', '#DDD6FE', '#FFB3C6', '#FFCBA4', '#FEF08A', '#A7F3D0'].map((c, i) => (
      <circle key={i} cx={114 + i * 30} cy={416} r="13" fill={c} />
    ))}
  </svg>
);

const BlueberryCakeSVG = () => (
  <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="bb_body" x1="250" y1="200" x2="250" y2="420" gradientUnits="userSpaceOnUse">
        <stop stopColor="#DDD6FE" />
        <stop offset="1" stopColor="#F5F3FF" />
      </linearGradient>
      <linearGradient id="bb_glaze" x1="250" y1="175" x2="250" y2="330" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#5B21B6" />
      </linearGradient>
    </defs>
    {/* Sleek Gold Cake Board */}
    <ellipse cx="250" cy="426" rx="184" ry="20" fill="#E6C16D" />
    <ellipse cx="250" cy="422" rx="178" ry="16" fill="#FFFDF9" opacity="0.88" />

    {/* Double Velvet Tiers */}
    <rect x="84" y="296" width="332" height="124" rx="28" fill="url(#bb_body)" />
    <rect x="116" y="196" width="268" height="110" rx="26" fill="url(#bb_body)" />

    {/* Amethyst Glaze Drip */}
    <path d="M116 244V212C116 190 164 176 250 176C336 176 384 190 384 212V244C384 274 358 286 330 258C302 232 274 294 242 258C210 222 172 288 144 256C126 238 116 256 116 244Z" fill="url(#bb_glaze)" />

    {/* Plump Blueberries & Mint */}
    <ellipse cx="222" cy="186" rx="12" ry="6" transform="rotate(-25 222 186)" fill="#22C55E" />
    <ellipse cx="280" cy="186" rx="12" ry="6" transform="rotate(25 280 186)" fill="#22C55E" />
    <circle cx="192" cy="186" r="14" fill="#312E81" />
    <circle cx="250" cy="178" r="16" fill="#3730A3" />
    <circle cx="308" cy="186" r="14" fill="#312E81" />
    <circle cx="246" cy="173" r="4" fill="#BAE6FD" opacity="0.7" />

    {/* Silver Sparkles */}
    <circle cx="148" cy="340" r="3" fill="#FFFFFF" />
    <circle cx="352" cy="330" r="2.5" fill="#FFFFFF" />
    <circle cx="260" cy="370" r="3.5" fill="#FFFFFF" />
  </svg>
);

export const CAKES: CakeOption[] = [
  {
    id: 'elegant-strawberry',
    name: 'Strawberry Dream',
    Component: StrawberryCakeSVG,
    candleBaseY: 36,
    candleBaseWidth: 50,
  },
  {
    id: 'classic-chocolate',
    name: 'Midnight Cocoa',
    Component: ChocolateCakeSVG,
    candleBaseY: 38,
    candleBaseWidth: 48,
  },
  {
    id: 'rainbow-party',
    name: 'Rainbow Layer',
    Component: RainbowCakeSVG,
    candleBaseY: 35,
    candleBaseWidth: 46,
  },
  {
    id: 'blueberry-glaze',
    name: 'Purple Velvet',
    Component: BlueberryCakeSVG,
    candleBaseY: 36,
    candleBaseWidth: 46,
  },
];

export const FlameSVG: React.FC<{ isExtinguished: boolean; isBlowing?: boolean; delay?: number }> = ({
  isExtinguished,
  isBlowing = false,
  delay = 0,
}) => {
  const swayDir = (delay / 30) % 2 === 0 ? 1 : -1;
  return (
    <div
      className="absolute -top-8 lg:-top-10 left-1/2 -translate-x-1/2 w-5 h-8 lg:w-6 lg:h-10 origin-bottom will-change-transform"
      style={
        !isExtinguished && !isBlowing
          ? {
              transform: `rotate(calc(var(--sound-tremor, 0) * ${swayDir * 8}deg)) scaleY(calc(1 + var(--sound-tremor, 0) * 0.12))`,
              filter: `drop-shadow(0 0 calc(var(--sound-tremor, 0) * 10px) rgba(251, 191, 36, 0.85))`,
            }
          : undefined
      }
    >
      <svg
        viewBox="0 0 20 30"
        className={`w-full h-full transition-all duration-700 ${isExtinguished ? 'opacity-0 scale-0 translate-y-4' : 'opacity-100 scale-100'} ${isBlowing ? 'animate-blowing' : 'animate-flicker'}`}
        style={{ transformStyle: 'preserve-3d', transitionDelay: isExtinguished ? '0ms' : `${delay}ms` }}
      >
        <path
          className="flame"
          d="M10 0C10 0 16 10 16 20C16 25.5228 13.3137 30 10 30C6.68629 30 4 25.5228 4 20C4 10 10 0 10 0Z"
          fill="#ffb347"
          style={{ animationDelay: '0s' }}
        />
        <path
          className="flame"
          style={{
            animationDelay: '0.1s',
          }}
          d="M10 8C10 8 14 15 14 22C14 26 12 29 10 29C8 29 6 26 6 22C6 15 10 8 10 8Z"
          fill="#ff6b6b"
        />
      </svg>
    </div>
  );
};
