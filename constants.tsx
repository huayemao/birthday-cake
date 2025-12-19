
import React from 'react';
import { CakeOption } from './types';

// --- Improved SVG Cake Illustrations ---

const StrawberryCakeSVG = () => (
  <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="pink_grad" x1="250" y1="200" x2="250" y2="450" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFF1F2" />
        <stop offset="1" stopColor="#FECDD3" />
      </linearGradient>
      <linearGradient id="cream_grad" x1="250" y1="180" x2="250" y2="300" gradientUnits="userSpaceOnUse">
        <stop stopColor="white" />
        <stop offset="1" stopColor="#FFF1F2" />
      </linearGradient>
    </defs>
    {/* Base Plate */}
    <ellipse cx="250" cy="440" rx="220" ry="50" fill="#E2E8F0" opacity="0.6" />
    <ellipse cx="250" cy="430" rx="200" ry="40" fill="white" />
    
    {/* Bottom Tier */}
    <rect x="70" y="300" width="360" height="120" rx="20" fill="url(#pink_grad)" />
    <path d="M70 340C70 340 160 360 250 360C340 360 430 340 430 340V420H70V340Z" fill="#FDA4AF" opacity="0.4" />
    
    {/* Top Tier */}
    <rect x="110" y="190" width="280" height="120" rx="20" fill="url(#pink_grad)" />
    
    {/* Cream Drip Top */}
    <path d="M110 240C110 240 140 265 180 250C220 235 250 270 300 255C350 240 390 260 390 240V210C390 187.909 350 170 300 170H200C150 170 110 187.909 110 210V240Z" fill="url(#cream_grad)" />
    
    {/* Berries and Decor */}
    <circle cx="160" cy="210" r="12" fill="#FB7185" />
    <circle cx="340" cy="205" r="14" fill="#F43F5E" />
    <circle cx="250" cy="195" r="10" fill="#E11D48" />
    <path d="M110 300H390" stroke="white" strokeWidth="2" strokeDasharray="5 10" opacity="0.5" />
  </svg>
);

const ChocolateCakeSVG = () => (
  <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="choc_base" x1="250" y1="200" x2="250" y2="450" gradientUnits="userSpaceOnUse">
        <stop stopColor="#451A03" />
        <stop offset="1" stopColor="#1C1917" />
      </linearGradient>
      <linearGradient id="ganache_top" x1="250" y1="180" x2="250" y2="280" gradientUnits="userSpaceOnUse">
        <stop stopColor="#27272A" />
        <stop offset="1" stopColor="#451A03" />
      </linearGradient>
    </defs>
    <ellipse cx="250" cy="440" rx="210" ry="45" fill="#1E293B" />
    
    {/* Thick Bottom Layer */}
    <rect x="80" y="280" width="340" height="140" rx="12" fill="url(#choc_base)" />
    
    {/* Gold Leaf Accents */}
    <rect x="80" y="320" width="340" height="6" fill="#FDE047" opacity="0.6" />
    <rect x="80" y="390" width="340" height="4" fill="#EAB308" opacity="0.4" />
    
    {/* Top Ganache Layer */}
    <rect x="80" y="280" width="340" height="30" rx="12" fill="url(#ganache_top)" />
    
    {/* Shiny Highlights */}
    <rect x="100" y="280" width="40" height="140" fill="white" opacity="0.03" />
    
    {/* Toppings: Dark Chocolate Curls */}
    <path d="M180 280C180 280 190 240 210 240C230 240 240 280 240 280" stroke="#1C1917" strokeWidth="12" strokeLinecap="round" />
    <path d="M260 280C260 280 270 230 290 230C310 230 320 280 320 280" stroke="#27272A" strokeWidth="15" strokeLinecap="round" />
  </svg>
);

const RainbowCakeSVG = () => (
  <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="vanilla_icing" x1="250" y1="200" x2="250" y2="450" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#F8FAFC" />
      </linearGradient>
    </defs>
    <ellipse cx="250" cy="440" rx="220" ry="50" fill="#CBD5E1" opacity="0.4" />
    
    {/* Multi-layered Tall Cake */}
    <rect x="90" y="200" width="320" height="220" rx="10" fill="url(#vanilla_icing)" />
    
    {/* Rainbow Layer Peeking Through */}
    <rect x="90" y="240" width="320" height="15" fill="#F87171" opacity="0.2" />
    <rect x="90" y="280" width="320" height="15" fill="#FBBF24" opacity="0.2" />
    <rect x="90" y="320" width="320" height="15" fill="#34D399" opacity="0.2" />
    <rect x="90" y="360" width="320" height="15" fill="#60A5FA" opacity="0.2" />
    
    {/* Thick Frosting Drip */}
    <path d="M90 230V200C90 180 130 160 250 160C370 160 410 180 410 200V230C410 230 380 270 340 240C300 210 270 280 230 240C190 200 140 270 90 230Z" fill="white" />
    
    {/* Colorful Sprinkles */}
    <circle cx="150" cy="190" r="4" fill="#F472B6" />
    <circle cx="210" cy="175" r="4" fill="#60A5FA" />
    <circle cx="280" cy="185" r="4" fill="#34D399" />
    <circle cx="340" cy="195" r="4" fill="#FBBF24" />
    <circle cx="250" cy="205" r="4" fill="#A78BFA" />
  </svg>
);

const BlueberryCakeSVG = () => (
  <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="berry_base" x1="250" y1="200" x2="250" y2="450" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F5F3FF" />
        <stop offset="1" stopColor="#EDE9FE" />
      </linearGradient>
      <linearGradient id="berry_glaze" x1="250" y1="160" x2="250" y2="350" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B5CF6" />
        <stop offset="1" stopColor="#4C1D95" />
      </linearGradient>
    </defs>
    <ellipse cx="250" cy="440" rx="200" ry="40" fill="#E9D5FF" opacity="0.5" />
    
    {/* Cake Body */}
    <rect x="100" y="240" width="300" height="180" rx="60" fill="url(#berry_base)" />
    
    {/* Vibrant Blueberry Glaze Drip */}
    <path d="M100 280V240C100 210 160 180 250 180C340 180 400 210 400 240V280C400 320 370 350 330 320C300 300 270 380 230 330C190 280 140 360 100 280Z" fill="url(#berry_glaze)" />
    
    {/* Floating Berries */}
    <circle cx="200" cy="200" r="12" fill="#1E1B4B" />
    <circle cx="280" cy="210" r="10" fill="#312E81" />
    <circle cx="240" cy="190" r="8" fill="#4338CA" />
    
    {/* Silver Dust */}
    <circle cx="150" cy="250" r="1.5" fill="white" opacity="0.8" />
    <circle cx="350" cy="280" r="1" fill="white" opacity="0.6" />
    <circle cx="250" cy="380" r="2" fill="white" opacity="0.4" />
  </svg>
);

export const CAKES: CakeOption[] = [
  {
    id: 'elegant-strawberry',
    name: 'Strawberry Dream',
    Component: StrawberryCakeSVG,
    candleBaseY: 38,
    candleBaseWidth: 55
  },
  {
    id: 'classic-chocolate',
    name: 'Midnight Cocoa',
    Component: ChocolateCakeSVG,
    candleBaseY: 52,
    candleBaseWidth: 50
  },
  {
    id: 'rainbow-party',
    name: 'Rainbow Layer',
    Component: RainbowCakeSVG,
    candleBaseY: 38,
    candleBaseWidth: 45
  },
  {
    id: 'blueberry-glaze',
    name: 'Purple Velvet',
    Component: BlueberryCakeSVG,
    candleBaseY: 45,
    candleBaseWidth: 40
  }
];

export const FlameSVG: React.FC<{ isExtinguished: boolean }> = ({ isExtinguished }) => (
  <svg 
    viewBox="0 0 20 30" 
    className={`w-6 h-10 transition-all duration-700 absolute -top-10 left-1/2 -translate-x-1/2 ${isExtinguished ? 'opacity-0 scale-0 translate-y-4' : 'opacity-100 scale-100'}`}
  >
    <path 
      className="flame"
      d="M10 0C10 0 16 10 16 20C16 25.5228 13.3137 30 10 30C6.68629 30 4 25.5228 4 20C4 10 10 0 10 0Z" 
      fill="#ffb347"
    />
    <path 
      className="flame"
      style={{ animationDelay: '0.1s' }}
      d="M10 8C10 8 14 15 14 22C14 26 12 29 10 29C8 29 6 26 6 22C6 15 10 8 10 8Z" 
      fill="#ff6b6b"
    />
  </svg>
);
