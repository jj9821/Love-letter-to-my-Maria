'use client';

import React from 'react';

export const Stamp: React.FC = () => {
  return (
    <div 
      className="relative select-none pointer-events-none"
      style={{
        transform: 'rotate(1.4deg)',
        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.18))',
      }}
    >
      {/* Physical Stamp Card with Serrated Perforated Edges */}
      <div 
        className="w-20 h-24 sm:w-24 sm:h-28 p-1 bg-[#fdfaf3] shadow-[0_2px_8px_rgba(0,0,0,0.2)] relative overflow-hidden"
        style={{
          boxShadow: '0 3px 8px rgba(0,0,0,0.2), inset 0 0 10px rgba(185,155,115,0.3)',
          border: '1px dashed rgba(190, 165, 130, 0.75)',
        }}
      >
        {/* Inner engraved border */}
        <div className="w-full h-full border border-[#80603c] p-1 flex flex-col justify-between items-center bg-[#f8f3e6] relative overflow-hidden">
          
          {/* Subtle paper grain texture inside stamp */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#6d4c2b 0.6px, transparent 0.6px)',
              backgroundSize: '4px 4px',
            }}
          />

          {/* Top Stamp Header */}
          <div className="flex justify-between items-center w-full px-1 text-[8px] sm:text-[9px] font-serif text-[#694b2a] tracking-widest uppercase relative z-10">
            <span className="opacity-90">POSTAGE</span>
            <span className="font-bold text-[#8a2222] tracking-wider">LOVE</span>
          </div>

          {/* Center Illustration - Vintage Botanical Wild Rose */}
          <div className="relative w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center opacity-90 z-10">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full fill-none stroke-[#5e3d22]"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Petal layers with slight vintage print fading */}
              <circle cx="50" cy="45" r="14" fill="#a83232" fillOpacity="0.22" stroke="#8a2020" strokeWidth="1.9" />
              <path d="M 42 35 C 46 28 54 28 58 35 C 64 36 68 44 65 50 C 60 58 50 62 40 56 C 35 50 36 40 42 35 Z" fill="#b83b3b" fillOpacity="0.32" stroke="#781d1d" strokeWidth="1.7" />
              <path d="M 48 42 C 52 38 56 40 55 45 C 53 48 47 48 46 45 Z" fill="#541010" fillOpacity="0.4" stroke="#541010" strokeWidth="1.4" />
              {/* Stem and leaves */}
              <path d="M 50 60 C 48 70 52 82 50 90" stroke="#3d4f2f" strokeWidth="2.4" />
              <path d="M 50 68 C 42 66 38 72 40 76 C 44 76 48 72 50 68 Z" fill="#4a5f39" fillOpacity="0.38" stroke="#3d4f2f" strokeWidth="1.4" />
              <path d="M 50 74 C 58 72 62 76 60 81 C 56 82 52 78 50 74 Z" fill="#4a5f39" fillOpacity="0.38" stroke="#3d4f2f" strokeWidth="1.4" />
            </svg>
          </div>

          {/* Stamp Bottom Value */}
          <div className="flex justify-between items-center w-full px-1 text-[8px] sm:text-[9px] font-serif text-[#694b2a] relative z-10">
            <span className="italic opacity-85">Special Delivery</span>
            <span className="font-bold text-[#8a2222]">∞</span >
          </div>
        </div>

        {/* Vintage Paper Aging Wash with light corner fading */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/5 via-transparent to-amber-950/20 pointer-events-none" />
      </div>

      {/* Postmark Ink Cancellation Stamp (Circular rubber mark + wavy lines) */}
      {/* Slightly uneven ink density for an authentic physical rubber stamp look */}
      <div 
        className="absolute -top-3 -left-7 sm:-left-9 w-28 h-20 sm:w-32 sm:h-24 pointer-events-none opacity-65 mix-blend-multiply select-none"
        style={{ transform: 'rotate(-10.5deg)' }}
      >
        <svg viewBox="0 0 160 100" className="w-full h-full stroke-[#1c1714]">
          {/* Circular Postmark - Slightly irregular hand-inked line */}
          <circle cx="45" cy="50" r="32" strokeWidth="1.7" fill="none" strokeDasharray="95 3 40 2" />
          <circle cx="45" cy="50" r="26" strokeWidth="1.1" fill="none" strokeDasharray="70 2 30" />
          
          <text
            x="45"
            y="36"
            textAnchor="middle"
            fill="#1c1714"
            fontSize="6.5"
            fontFamily="serif"
            letterSpacing="1.2"
            fontWeight="bold"
            opacity="0.95"
          >
            PAR AVION
          </text>
          
          <text
            x="45"
            y="52"
            textAnchor="middle"
            fill="#1c1714"
            fontSize="7"
            fontFamily="serif"
            letterSpacing="1"
            opacity="0.85"
          >
            FOREVER
          </text>

          <text
            x="45"
            y="66"
            textAnchor="middle"
            fill="#1c1714"
            fontSize="6"
            fontFamily="serif"
            letterSpacing="0.8"
            opacity="0.9"
          >
            JOEL & MARIA
          </text>

          {/* Wavy Cancellation Postal Lines with ink breakages */}
          <path
            d="M 80 36 Q 95 31 110 36 T 140 36 T 160 36"
            strokeWidth="1.7"
            fill="none"
            strokeDasharray="28 1 45 2"
          />
          <path
            d="M 78 50 Q 95 45 110 50 T 140 50 T 160 50"
            strokeWidth="1.7"
            fill="none"
            strokeDasharray="40 2 30 1"
          />
          <path
            d="M 80 64 Q 95 59 110 64 T 140 64 T 160 64"
            strokeWidth="1.7"
            fill="none"
            strokeDasharray="35 1 25"
          />
        </svg>
      </div>
    </div>
  );
};
