'use client';

import React from 'react';

export const Stamp: React.FC = () => {
  return (
    <div className="relative select-none pointer-events-none">
      {/* Physical Stamp Card with Serrated Edges */}
      <div 
        className="w-20 h-24 sm:w-24 sm:h-28 p-1 bg-[#fbf8ee] shadow-[0_4px_12px_rgba(0,0,0,0.3)] relative overflow-hidden"
        style={{
          boxShadow: '0 4px 10px rgba(0,0,0,0.25), inset 0 0 10px rgba(180,150,110,0.35)',
          border: '1px dashed #d1c1a5',
        }}
      >
        {/* Inner engraved border */}
        <div className="w-full h-full border border-[#8c6b45] p-1 flex flex-col justify-between items-center bg-[#f7f2e5] relative">
          
          {/* Top Stamp Header */}
          <div className="flex justify-between items-center w-full px-1 text-[8px] sm:text-[9px] font-serif text-[#785938] tracking-widest uppercase">
            <span>POSTAGE</span>
            <span className="font-bold text-[#912b2b]">LOVE</span>
          </div>

          {/* Center Illustration - Vintage Botanical Rose */}
          <div className="relative w-12 h-14 sm:w-14 sm:h-16 flex items-center justify-center opacity-85">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full fill-none stroke-[#6b472a]"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Petal layers */}
              <circle cx="50" cy="45" r="14" fill="#a83232" fillOpacity="0.2" stroke="#8a2020" strokeWidth="2" />
              <path d="M 42 35 C 46 28 54 28 58 35 C 64 36 68 44 65 50 C 60 58 50 62 40 56 C 35 50 36 40 42 35 Z" fill="#b83b3b" fillOpacity="0.35" stroke="#781d1d" strokeWidth="1.8" />
              <path d="M 48 42 C 52 38 56 40 55 45 C 53 48 47 48 46 45 Z" fill="#541010" fillOpacity="0.4" stroke="#541010" strokeWidth="1.5" />
              {/* Stem and leaves */}
              <path d="M 50 60 C 48 70 52 82 50 90" stroke="#3d4f2f" strokeWidth="2.5" />
              <path d="M 50 68 C 42 66 38 72 40 76 C 44 76 48 72 50 68 Z" fill="#4a5f39" fillOpacity="0.4" stroke="#3d4f2f" strokeWidth="1.5" />
              <path d="M 50 74 C 58 72 62 76 60 81 C 56 82 52 78 50 74 Z" fill="#4a5f39" fillOpacity="0.4" stroke="#3d4f2f" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Stamp Bottom Value */}
          <div className="flex justify-between items-center w-full px-1 text-[8px] sm:text-[9px] font-serif text-[#785938]">
            <span className="italic">Special Delivery</span>
            <span className="font-bold text-[#912b2b]">∞</span>
          </div>
        </div>

        {/* Vintage Paper Aging Wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-900/5 to-amber-950/15 pointer-events-none" />
      </div>

      {/* Postmark Ink Stamp Overlay (Circular cancellation mark + wavy lines) */}
      <div 
        className="absolute -top-3 -left-6 sm:-left-8 w-28 h-20 sm:w-32 sm:h-24 pointer-events-none opacity-60 mix-blend-multiply select-none"
        style={{ transform: 'rotate(-12deg)' }}
      >
        <svg viewBox="0 0 160 100" className="w-full h-full stroke-[#1f1a17]">
          {/* Circular Postmark */}
          <circle cx="45" cy="50" r="32" strokeWidth="1.8" fill="none" strokeDasharray="180" />
          <circle cx="45" cy="50" r="26" strokeWidth="1" fill="none" />
          
          <text
            x="45"
            y="36"
            textAnchor="middle"
            fill="#1f1a17"
            fontSize="6.5"
            fontFamily="serif"
            letterSpacing="1.2"
            fontWeight="bold"
          >
            PAR AVION
          </text>
          
          <text
            x="45"
            y="52"
            textAnchor="middle"
            fill="#1f1a17"
            fontSize="7"
            fontFamily="serif"
            letterSpacing="1"
          >
            FOREVER
          </text>

          <text
            x="45"
            y="66"
            textAnchor="middle"
            fill="#1f1a17"
            fontSize="6"
            fontFamily="serif"
            letterSpacing="0.8"
          >
            JOEL & MARIA
          </text>

          {/* Wavy Cancellation Postal Lines */}
          <path
            d="M 80 36 Q 95 31 110 36 T 140 36 T 160 36"
            strokeWidth="1.8"
            fill="none"
          />
          <path
            d="M 78 50 Q 95 45 110 50 T 140 50 T 160 50"
            strokeWidth="1.8"
            fill="none"
          />
          <path
            d="M 80 64 Q 95 59 110 64 T 140 64 T 160 64"
            strokeWidth="1.8"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
};
