'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AmbientBackgroundProps {
  isReading?: boolean;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ isReading = false }) => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Deep warm walnut wood desk base with rich grain */}
      <div 
        className="absolute inset-0 bg-[#0e0a07]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 50% 28%, rgba(65, 40, 24, 0.42) 0%, rgba(16, 11, 8, 0.95) 75%),
            linear-gradient(180deg, rgba(28, 18, 12, 0.55) 0%, rgba(10, 7, 5, 0.98) 100%)
          `,
        }}
      />

      {/* Gentle Candlelight Radial Glow behind the letter (subtle breathing animation) */}
      <motion.div
        className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[580px] rounded-full blur-3xl bg-amber-600/25 candle-glow pointer-events-none"
        animate={{
          opacity: isReading ? 0.16 : 0.24,
          scale: isReading ? 0.95 : 1,
        }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      />

      {/* Vignette around borders - subtly deepens during reading */}
      <motion.div 
        className="ambient-vignette absolute inset-0"
        animate={{
          opacity: isReading ? 0.98 : 0.85,
        }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      />
    </div>
  );
};
