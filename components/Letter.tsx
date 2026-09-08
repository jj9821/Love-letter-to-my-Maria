'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HandwritingText } from './HandwritingText';
import { letterData } from '../data/letter';

interface LetterProps {
  stage: 'closed' | 'opening' | 'extracted' | 'unfolded' | 'reading';
  speedMultiplier: number;
  isPaused: boolean;
  isSkipped: boolean;
  onComplete?: () => void;
}

export const Letter: React.FC<LetterProps> = ({
  stage,
  speedMultiplier,
  isPaused,
  isSkipped,
  onComplete,
}) => {
  const isWritingStarted = stage === 'unfolded' || stage === 'reading';

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto my-6 sm:my-10"
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      animate={{
        opacity: stage !== 'closed' && stage !== 'opening' ? 1 : 0,
        scale: stage === 'unfolded' || stage === 'reading' ? 1 : 0.94,
        y: stage === 'unfolded' || stage === 'reading' ? 0 : 30,
      }}
      transition={{
        duration: 1.4,
        ease: [0.25, 1, 0.5, 1],
      }}
    >
      {/* Physical Parchment Sheet */}
      <div
        className="parchment-paper relative rounded-sm p-6 sm:p-12 md:p-16 overflow-hidden transition-all duration-700"
        style={{
          boxShadow: '0 25px 65px -12px rgba(12, 8, 5, 0.65), 0 0 1px 1px rgba(160, 130, 90, 0.25)',
          border: '1px solid rgba(210, 185, 140, 0.45)',
        }}
      >
        {/* Natural Paper Aging Edge Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-amber-950/[0.04] via-transparent to-amber-950/[0.04]" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-amber-950/[0.04] via-transparent to-amber-950/[0.06]" />

        {/* Trifold Crease Line 1 (Upper Third) */}
        <div 
          className="absolute left-0 right-0 top-[33%] h-[2px] pointer-events-none opacity-45"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(140, 105, 65, 0.15) 10%, rgba(140, 105, 65, 0.28) 50%, rgba(140, 105, 65, 0.15) 90%, transparent 100%)',
            boxShadow: '0 1px 1px rgba(255, 255, 255, 0.4)',
          }}
        />

        {/* Trifold Crease Line 2 (Lower Third) */}
        <div 
          className="absolute left-0 right-0 top-[66%] h-[2px] pointer-events-none opacity-45"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(140, 105, 65, 0.15) 10%, rgba(140, 105, 65, 0.28) 50%, rgba(140, 105, 65, 0.15) 90%, transparent 100%)',
            boxShadow: '0 1px 1px rgba(255, 255, 255, 0.4)',
          }}
        />

        {/* Subtle Watermark or Embossed Crest at top right */}
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 opacity-15 pointer-events-none select-none">
          <svg viewBox="0 0 60 60" className="w-12 h-12 stroke-[#6e5032] fill-none" strokeWidth="1.5">
            <circle cx="30" cy="30" r="26" strokeDasharray="2 3" />
            <path d="M 30 18 C 33 14 40 14 43 19 C 46 24 40 32 30 38 C 20 32 14 24 17 19 C 20 14 27 14 30 18 Z" fill="#6e5032" fillOpacity="0.25" />
          </svg>
        </div>

        {/* Letter Date/Place Header (Vintage Touch) */}
        <div className="flex justify-between items-center mb-8 sm:mb-10 text-xs sm:text-sm font-serif italic text-[#785b3b] opacity-75 border-b border-[#ddceb0]/60 pb-3">
          <span>From across the miles</span>
          <span>Written for you</span>
        </div>

        {/* Dynamic Handwriting Engine */}
        <div className="relative z-10">
          <HandwritingText
            data={letterData}
            isStarted={isWritingStarted}
            speedMultiplier={speedMultiplier}
            isPaused={isPaused}
            isSkipped={isSkipped}
            onComplete={onComplete}
          />
        </div>

        {/* Bottom subtle edge wear */}
        <div className="mt-12 pt-6 border-t border-[#ddceb0]/40 flex justify-between items-center text-[10px] sm:text-xs font-serif italic text-[#8c6f4f] opacity-60">
          <span>Kept close to heart</span>
          <span>Yours, always</span>
        </div>
      </div>
    </motion.div>
  );
};
