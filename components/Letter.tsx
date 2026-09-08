'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HandwritingText } from './HandwritingText';
import { letterData } from '../data/letter';
import { soundEffects } from './AudioEffects';

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
  const [isLetterCompleted, setIsLetterCompleted] = useState(false);
  const [showSecretNote, setShowSecretNote] = useState(false);
  const [cornerHintActive, setCornerHintActive] = useState(false);

  const handleLetterComplete = () => {
    setIsLetterCompleted(true);
    if (onComplete) onComplete();
  };

  // 5 seconds after the letter finishes completely, introduce the subtle corner lift hint
  useEffect(() => {
    if (isLetterCompleted && !showSecretNote) {
      const timer = setTimeout(() => {
        setCornerHintActive(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isLetterCompleted, showSecretNote]);

  const handleToggleSecretNote = () => {
    soundEffects.playPaperRustle();
    setShowSecretNote(!showSecretNote);
    setCornerHintActive(false);
  };

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto my-6 sm:my-10 perspective-1000"
      initial={{ opacity: 0, scale: 0.92, y: 40 }}
      animate={{
        opacity: stage !== 'closed' && stage !== 'opening' ? 1 : 0,
        scale: stage === 'unfolded' || stage === 'reading' ? 1 : 0.92,
        y: stage === 'unfolded' || stage === 'reading' ? 0 : 40,
      }}
      transition={{
        duration: 1.5,
        ease: [0.25, 1, 0.4, 1],
      }}
    >
      {/* Physical Parchment Sheet */}
      <div
        className="parchment-paper relative rounded-sm p-6 sm:p-12 md:p-16 overflow-hidden transition-all duration-700"
        style={{
          boxShadow: '0 25px 65px -12px rgba(8, 5, 3, 0.75), 0 0 1px 1px rgba(170, 140, 95, 0.3)',
          border: '1px solid rgba(215, 190, 145, 0.5)',
        }}
      >
        {/* Natural Paper Aging Edge Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-amber-950/[0.04] via-transparent to-amber-950/[0.05]" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-amber-950/[0.04] via-transparent to-amber-950/[0.07]" />

        {/* EASTER EGG 1: Delicate Pressed Wildflower / Forget-me-not in upper right margin */}
        <div 
          className="absolute top-8 right-8 sm:top-12 sm:right-12 opacity-80 pointer-events-none select-none"
          title="A pressed forget-me-not flower"
          style={{ transform: 'rotate(18deg)' }}
        >
          <svg viewBox="0 0 50 60" className="w-8 h-10 sm:w-10 sm:h-12">
            {/* Dried flower stem */}
            <path d="M 24 55 Q 26 35 24 22" stroke="#5a6845" strokeWidth="1.2" fill="none" opacity="0.6" />
            <path d="M 25 36 Q 32 32 36 34" stroke="#5a6845" strokeWidth="1" fill="none" opacity="0.6" />
            {/* Soft dried petals */}
            <circle cx="24" cy="18" r="4.5" fill="#7a8bb0" opacity="0.45" />
            <circle cx="19" cy="22" r="4.5" fill="#8898ba" opacity="0.4" />
            <circle cx="29" cy="22" r="4.5" fill="#7a8bb0" opacity="0.45" />
            <circle cx="21" cy="28" r="4.5" fill="#8898ba" opacity="0.4" />
            <circle cx="27" cy="28" r="4.5" fill="#7a8bb0" opacity="0.45" />
            {/* Flower core */}
            <circle cx="24" cy="24" r="2" fill="#d8b248" opacity="0.65" />
          </svg>
        </div>

        {/* Trifold Crease Line 1 (Upper Third) */}
        <div 
          className="absolute left-0 right-0 top-[33%] h-[2px] pointer-events-none opacity-40"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(140, 105, 65, 0.12) 8%, rgba(140, 105, 65, 0.26) 50%, rgba(140, 105, 65, 0.12) 92%, transparent 100%)',
            boxShadow: '0 1px 1px rgba(255, 255, 255, 0.45)',
          }}
        >
          {/* EASTER EGG 2: Faint "J ♥ M" lightly penciled into the crease */}
          <span className="absolute right-8 -top-3 text-[10px] font-handwriting text-[#785b3b]/35 tracking-widest select-none italic">
            J ♥ M
          </span>
        </div>

        {/* Trifold Crease Line 2 (Lower Third) */}
        <div 
          className="absolute left-0 right-0 top-[66%] h-[2px] pointer-events-none opacity-40"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(140, 105, 65, 0.12) 8%, rgba(140, 105, 65, 0.26) 50%, rgba(140, 105, 65, 0.12) 92%, transparent 100%)',
            boxShadow: '0 1px 1px rgba(255, 255, 255, 0.45)',
          }}
        />

        {/* EASTER EGG 3: Subtle aged tea drop / water mark in bottom-left margin */}
        <div className="tea-stain bottom-14 left-8 sm:left-14 opacity-75" />

        {/* Corner Fold with Gentle Interactive Lift Hint */}
        <div 
          onClick={handleToggleSecretNote}
          className={`absolute bottom-0 right-0 w-10 h-10 cursor-pointer z-30 transition-transform ${
            cornerHintActive ? 'corner-lift-hint opacity-80' : 'opacity-25 hover:opacity-60'
          }`}
          title="Something tucked beneath..."
          style={{
            background: 'linear-gradient(135deg, transparent 50%, #cca974 50%)',
            boxShadow: '-2px -2px 5px rgba(0,0,0,0.2)',
          }}
        />

        {/* Letter Date/Place Header */}
        <div className="flex justify-between items-center mb-8 sm:mb-10 text-xs sm:text-sm font-serif italic text-[#6e5133] opacity-80 border-b border-[#ddceb0]/55 pb-3">
          <span>Late at night • Thinking only of you</span>
          <span className="font-handwriting text-base text-[#523922]">For Maria Mathew</span>
        </div>

        {/* Dynamic Handwriting Engine */}
        <div className="relative z-10">
          <HandwritingText
            data={letterData}
            isStarted={isWritingStarted}
            speedMultiplier={speedMultiplier}
            isPaused={isPaused}
            isSkipped={isSkipped}
            onComplete={handleLetterComplete}
          />
        </div>

        {/* EASTER EGG 4: Hidden Final Message "P.S. Tap here when you miss me." */}
        <AnimatePresence>
          {isLetterCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1.2 }}
              className="mt-12 sm:mt-16 pt-6 border-t border-[#ddceb0]/50 relative z-20"
            >
              {/* Subtle trigger line */}
              <button
                type="button"
                onClick={handleToggleSecretNote}
                className="group flex items-center gap-2 text-left font-handwriting text-lg sm:text-xl text-[#6b4e33] hover:text-[#2a1d13] transition-colors cursor-pointer select-none focus:outline-none"
              >
                <span className="inline-block transition-transform duration-300 group-hover:scale-110 text-rose-800/70">
                  💌
                </span>
                <span className="underline decoration-[#ab8d68]/40 underline-offset-4 group-hover:decoration-rose-800/60">
                  P.S. Tap here when you miss me.
                </span>
                <span className="text-xs font-serif text-[#8f7050] opacity-70 group-hover:opacity-100 italic ml-1">
                  (for you alone)
                </span>
              </button>

              {/* Unfolded Secret Handwritten Note */}
              <AnimatePresence>
                {showSecretNote && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                    className="overflow-hidden mt-4"
                  >
                    <div 
                      className="p-5 sm:p-7 rounded bg-[#faf4e6] border border-[#d6c4a5] shadow-[0_8px_20px_rgba(0,0,0,0.15)] relative"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 50% 50%, #fdf9f0 0%, #f5ecd8 100%)',
                      }}
                    >
                      {/* Note Header */}
                      <div className="text-xs uppercase tracking-[0.2em] font-serif text-[#8a6845] mb-2 flex items-center gap-2">
                        <span>A whisper for your heart</span>
                        <span className="h-[1px] flex-1 bg-[#8a6845]/20" />
                      </div>

                      {/* Intimate Message */}
                      <p 
                        className="font-handwriting text-xl sm:text-2xl text-[#1f1814] leading-relaxed italic"
                        style={{ fontFamily: 'var(--font-handwriting), cursive' }}
                      >
                        &ldquo;Whenever you feel the distance between us, close your eyes and remember: every second apart is just counting down to the moment I get to hold you again. I love you, Maria. Always.&rdquo;
                      </p>

                      {/* Signature on Note */}
                      <div className="mt-3 text-right">
                        <span className="font-calligraphy text-2xl sm:text-3xl text-[#1c140f]">
                          Forever yours, Joel
                        </span>
                      </div>

                      {/* Subtle fold away button */}
                      <div className="mt-3 pt-2 border-t border-[#8a6845]/15 flex justify-end">
                        <button
                          type="button"
                          onClick={handleToggleSecretNote}
                          className="text-[11px] font-serif italic text-[#8a6845] hover:text-[#2d1e12] transition-colors"
                        >
                          Tap to fold away
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom subtle stationery imprint */}
        <div className="mt-10 pt-4 flex justify-between items-center text-[10px] sm:text-xs font-serif italic text-[#806345] opacity-65 border-t border-[#ddceb0]/35">
          <span>Kept close to heart</span>
          <span>Yours, always</span>
        </div>
      </div>
    </motion.div>
  );
};
