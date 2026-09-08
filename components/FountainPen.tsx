'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface FountainPenProps {
  isVisible?: boolean;
}

export const FountainPen: React.FC<FountainPenProps> = ({ isVisible = true }) => {
  return (
    <motion.div
      className="absolute -bottom-8 -right-6 sm:-right-14 md:-right-20 z-20 pointer-events-none select-none origin-bottom-left"
      initial={{ opacity: 0, x: 20, y: 10, rotate: -26 }}
      animate={{
        opacity: isVisible ? 1 : 0.35,
        x: isVisible ? 0 : 30,
        y: isVisible ? 0 : 20,
        rotate: -28,
      }}
      transition={{ duration: 1.4, ease: [0.25, 1, 0.4, 1] }}
    >
      {/* Contact shadow on desk */}
      <div 
        className="absolute top-12 left-6 w-48 sm:w-60 h-4 bg-black/60 blur-md rounded-full origin-left -rotate-2"
        style={{ transform: 'translateY(14px) scaleY(0.6)' }}
      />

      {/* SVG Fountain Pen */}
      <svg
        viewBox="0 0 320 60"
        className="w-48 sm:w-64 md:w-72 h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Black resin body gradient */}
          <linearGradient id="penBarrel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2c221b" />
            <stop offset="25%" stopColor="#44352b" />
            <stop offset="50%" stopColor="#19130f" />
            <stop offset="85%" stopColor="#0c0907" />
            <stop offset="100%" stopColor="#050403" />
          </linearGradient>

          {/* High gloss highlight on resin */}
          <linearGradient id="penSheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="15%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="70%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
          </linearGradient>

          {/* Gold trim gradient */}
          <linearGradient id="penGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#bf953f" />
            <stop offset="25%" stopColor="#fcf6ba" />
            <stop offset="50%" stopColor="#b38728" />
            <stop offset="75%" stopColor="#fbf5b7" />
            <stop offset="100%" stopColor="#aa771c" />
          </linearGradient>

          {/* Two-tone Nib Gradient */}
          <linearGradient id="nibGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5c158" />
            <stop offset="40%" stopColor="#fff2a8" />
            <stop offset="70%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#8f6e18" />
          </linearGradient>

          <linearGradient id="nibSilver" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="50%" stopColor="#f3f4f6" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
        </defs>

        {/* NIB (Pointing left-forward toward the envelope) */}
        {/* Nib base & feed */}
        <path d="M 68 28 L 30 30 L 68 32 Z" fill="#140f0c" />
        {/* Golden Nib Body */}
        <path
          d="M 65 24 C 55 24 38 28 10 30 C 38 32 55 36 65 36 L 70 30 Z"
          fill="url(#nibGold)"
          stroke="#7d5c14"
          strokeWidth="0.5"
        />
        {/* Silver inner scrollwork / inlay */}
        <path
          d="M 58 26 C 50 26 40 28 24 30 C 40 32 50 34 58 34 Z"
          fill="url(#nibSilver)"
          opacity="0.8"
        />
        {/* Nib center slit & breather hole */}
        <line x1="10" y1="30" x2="42" y2="30" stroke="#332410" strokeWidth="0.6" />
        <circle cx="43" cy="30" r="1.4" fill="#241a0e" />

        {/* Golden Nib Collar Ring */}
        <rect x="68" y="24" width="4" height="12" rx="1" fill="url(#penGold)" />

        {/* GRIP SECTION */}
        <path
          d="M 72 25 Q 92 26 105 24 L 105 36 Q 92 34 72 35 Z"
          fill="#1c1612"
        />
        <path
          d="M 72 25 Q 92 26 105 24 L 105 28 Q 92 28 72 27 Z"
          fill="url(#penSheen)"
        />

        {/* THREAD RING (Gold) */}
        <rect x="105" y="23" width="3" height="14" fill="url(#penGold)" />

        {/* MAIN BARREL */}
        <path
          d="M 108 23 L 265 24 Q 280 26 288 30 Q 280 34 265 36 L 108 37 Z"
          fill="url(#penBarrel)"
        />
        {/* Barrel top specular highlight */}
        <path
          d="M 108 23 L 265 24 Q 275 25 280 27 L 108 27 Z"
          fill="url(#penSheen)"
          opacity="0.75"
        />

        {/* CENTER GOLD ACCENT RINGS */}
        <rect x="180" y="23.5" width="2" height="13" fill="url(#penGold)" />
        <rect x="184" y="23.5" width="5" height="13" fill="url(#penGold)" />
        <rect x="191" y="23.5" width="1.5" height="13" fill="url(#penGold)" />

        {/* POSTED CAP ACCENTS & CLIP (Toward the end of the pen) */}
        <rect x="250" y="24" width="3" height="12" fill="url(#penGold)" />
        {/* Gold clip running along barrel */}
        <path
          d="M 252 23 L 195 24 C 193 24 191 26 193 27 C 195 28 198 26 202 26 L 252 25.5 Z"
          fill="url(#penGold)"
          filter="drop-shadow(0 1px 1px rgba(0,0,0,0.5))"
        />
        {/* End Finial (Gold stud) */}
        <path d="M 285 28 Q 291 30 285 32 Z" fill="url(#penGold)" />
      </svg>
    </motion.div>
  );
};
