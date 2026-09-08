'use client';

import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Deep warm walnut wood desk base */}
      <div 
        className="absolute inset-0 bg-[#140e0b]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 50% 30%, rgba(68, 42, 28, 0.45) 0%, rgba(20, 14, 11, 0.95) 75%),
            linear-gradient(180deg, rgba(30, 20, 15, 0.6) 0%, rgba(12, 8, 6, 0.98) 100%)
          `,
        }}
      />

      {/* Gentle Candlelight Radial Glow behind the letter */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full blur-3xl opacity-20 bg-amber-600/30 pointer-events-none"
      />

      {/* Vignette around borders */}
      <div className="ambient-vignette absolute inset-0" />
    </div>
  );
};
