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
  onDiscoverMemories?: () => void;
  onFoldLetter?: () => void;
}

export const Letter: React.FC<LetterProps> = ({
  stage,
  speedMultiplier,
  isPaused,
  isSkipped,
  onComplete,
  onDiscoverMemories,
  onFoldLetter,
}) => {
  const isWritingStarted = stage === 'unfolded' || stage === 'reading';
  const [isLetterCompleted, setIsLetterCompleted] = useState(false);
  
  // Scene 6: Hidden Pressed Flower & Secret Note
  const [flowerHintActive, setFlowerHintActive] = useState(false);
  const [isSecretNoteRevealed, setIsSecretNoteRevealed] = useState(false);

  // Scene 7: Photograph Corner Peek
  const [photoCornerRevealed, setPhotoCornerRevealed] = useState(false);

  // Read Aloud intimate state
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  const handleLetterComplete = () => {
    setIsLetterCompleted(true);
    if (onComplete) onComplete();
  };

  // 4.5 seconds after letter completes, the pressed flower edge subtly shifts
  useEffect(() => {
    if (isLetterCompleted && !isSecretNoteRevealed) {
      const timer = setTimeout(() => {
        setFlowerHintActive(true);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isLetterCompleted, isSecretNoteRevealed]);

  // When secret note is opened, wait 2 seconds then reveal the photo corner peek
  useEffect(() => {
    if (isSecretNoteRevealed && !photoCornerRevealed) {
      const timer = setTimeout(() => {
        setPhotoCornerRevealed(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSecretNoteRevealed, photoCornerRevealed]);

  // Handle touching the pressed flower
  const handleTouchFlower = () => {
    soundEffects.playPaperRustle();
    setIsSecretNoteRevealed(true);
    setFlowerHintActive(false);
  };

  // Handle touching the photo corner
  const handleTouchPhotoCorner = () => {
    soundEffects.playPaperRustle();
    if (onDiscoverMemories) {
      onDiscoverMemories();
    }
  };

  // Handle "Hear me read this."
  const handleToggleReadAloud = () => {
    soundEffects.playPaperRustle();
    setIsReadingAloud(!isReadingAloud);
    // Plays custom background music softly or enhances audio ambiance
    soundEffects.playBackgroundMusic();
  };

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto my-6 sm:my-10 perspective-1000 relative"
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
        className="parchment-paper relative rounded-sm p-6 sm:p-12 md:p-16 overflow-visible transition-all duration-700"
        style={{
          boxShadow: '0 25px 65px -12px rgba(8, 5, 3, 0.75), 0 0 1px 1px rgba(170, 140, 95, 0.3)',
          border: '1px solid rgba(215, 190, 145, 0.5)',
        }}
      >
        {/* Natural Paper Aging Edge Vignette */}
        <div className="absolute inset-0 pointer-events-none rounded-sm bg-gradient-to-r from-amber-950/[0.04] via-transparent to-amber-950/[0.05]" />
        <div className="absolute inset-0 pointer-events-none rounded-sm bg-gradient-to-b from-amber-950/[0.04] via-transparent to-amber-950/[0.07]" />

        {/* PROPS ON LETTER: Delicate Pressed Botanical Wildflower in upper right margin */}
        <div 
          className="absolute top-8 right-8 sm:top-12 sm:right-12 opacity-80 pointer-events-none select-none"
          title="A pressed forget-me-not flower"
          style={{ transform: 'rotate(18deg)' }}
        >
          <svg viewBox="0 0 50 60" className="w-8 h-10 sm:w-10 sm:h-12">
            <path d="M 24 55 Q 26 35 24 22" stroke="#5a6845" strokeWidth="1.2" fill="none" opacity="0.6" />
            <path d="M 25 36 Q 32 32 36 34" stroke="#5a6845" strokeWidth="1" fill="none" opacity="0.6" />
            <circle cx="24" cy="18" r="4.5" fill="#7a8bb0" opacity="0.45" />
            <circle cx="19" cy="22" r="4.5" fill="#8898ba" opacity="0.4" />
            <circle cx="29" cy="22" r="4.5" fill="#7a8bb0" opacity="0.45" />
            <circle cx="21" cy="28" r="4.5" fill="#8898ba" opacity="0.4" />
            <circle cx="27" cy="28" r="4.5" fill="#7a8bb0" opacity="0.45" />
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
          {/* Faint "J ♥ M" lightly penciled into the crease */}
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

        {/* Letter Date/Place Header & Natural "Hear me read this." note */}
        <div className="flex flex-wrap justify-between items-center mb-8 sm:mb-10 text-xs sm:text-sm font-serif italic text-[#6e5133] opacity-85 border-b border-[#ddceb0]/55 pb-3 gap-2">
          <span>Late at night • Thinking only of you</span>
          
          <div className="flex items-center gap-3">
            {/* Intimate "Hear me read this." marginal note */}
            <button
              type="button"
              onClick={handleToggleReadAloud}
              className="font-handwriting text-sm sm:text-base text-[#755535] hover:text-[#2a1d12] transition-colors cursor-pointer select-none underline decoration-[#755535]/30 underline-offset-2"
              title="Intimate narration"
            >
              {isReadingAloud ? '♪ Reading along with you' : 'Hear me read this.'}
            </button>
            <span className="opacity-40">•</span>
            <span className="font-handwriting text-base text-[#523922]">For Maria Mathew</span>
          </div>
        </div>

        {/* Dynamic Live Handwriting Engine */}
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

        {/* SCENE 6: Physical Pressed Flower peeking from beneath bottom edge */}
        <div className="relative mt-8">
          {/* The Hidden Pressed Flower Anchor */}
          <AnimatePresence>
            {!isSecretNoteRevealed && (
              <motion.div
                onClick={handleTouchFlower}
                className="absolute -bottom-10 sm:-bottom-12 left-10 sm:left-16 z-20 cursor-pointer group select-none"
                initial={{ y: 0, opacity: 0.8 }}
                animate={
                  flowerHintActive
                    ? {
                        y: [-2, -12, -2],
                        rotate: [-2, 3, -2],
                        opacity: 1,
                        transition: {
                          repeat: Infinity,
                          duration: 3.2,
                          ease: 'easeInOut',
                        },
                      }
                    : { y: 0, opacity: 0.85 }
                }
                whileHover={{ y: -8, scale: 1.05 }}
              >
                {/* Physical pressed flower stem & petals peeking */}
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 45 45" className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-md">
                    {/* Dried flower stem */}
                    <path d="M 22 42 Q 25 24 22 10" stroke="#4d5a3a" strokeWidth="2" fill="none" opacity="0.85" />
                    <path d="M 24 26 Q 32 20 35 22" stroke="#4d5a3a" strokeWidth="1.5" fill="none" opacity="0.75" />
                    {/* Dried delicate crimson/rose petals */}
                    <circle cx="22" cy="12" r="5.5" fill="#a84343" opacity="0.75" />
                    <circle cx="16" cy="15" r="5" fill="#933636" opacity="0.7" />
                    <circle cx="28" cy="15" r="5" fill="#a84343" opacity="0.75" />
                    <circle cx="18" cy="21" r="4.5" fill="#822b2b" opacity="0.65" />
                    <circle cx="26" cy="21" r="4.5" fill="#933636" opacity="0.7" />
                    <circle cx="22" cy="17" r="3" fill="#d9b657" opacity="0.85" />
                  </svg>

                  {/* Subtle handwritten hint text appearing after the stillness */}
                  {flowerHintActive && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs sm:text-sm font-handwriting text-[#6e4e31] italic opacity-85 group-hover:opacity-100 underline decoration-[#6e4e31]/30 underline-offset-2"
                    >
                      a whisper tucked beneath...
                    </motion.span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unfolded Secret Handwritten Note directly on paper (No popup, pure paper object) */}
          <AnimatePresence>
            {isSecretNoteRevealed && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 15 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
                className="overflow-hidden mt-8 pt-6 border-t border-[#ddceb0]/60 relative z-20"
              >
                <div 
                  className="p-6 sm:p-8 rounded-[2px] bg-[#faf4e8] border border-[#d2be9d] shadow-[0_12px_28px_rgba(0,0,0,0.18)] relative"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 50% 50%, #fefcf7 0%, #f5ebd5 100%)',
                  }}
                >
                  {/* Dried pressed flower resting on the note's top-left corner */}
                  <div className="absolute -top-3 left-4 opacity-90 pointer-events-none select-none rotate-12">
                    <svg viewBox="0 0 45 45" className="w-8 h-8">
                      <path d="M 22 42 Q 25 24 22 10" stroke="#4d5a3a" strokeWidth="1.8" fill="none" opacity="0.8" />
                      <circle cx="22" cy="12" r="4.5" fill="#a84343" opacity="0.7" />
                      <circle cx="16" cy="15" r="4.2" fill="#933636" opacity="0.65" />
                      <circle cx="28" cy="15" r="4.2" fill="#a84343" opacity="0.7" />
                      <circle cx="22" cy="17" r="2.5" fill="#d9b657" opacity="0.85" />
                    </svg>
                  </div>

                  {/* Secret Note Intimate Text */}
                  <div className="pl-6 sm:pl-8">
                    <div className="text-[11px] uppercase tracking-[0.2em] font-serif text-[#7e5c38] mb-2 flex items-center gap-2 opacity-80">
                      <span>P.S. For Maria alone</span>
                      <span className="h-[1px] flex-1 bg-[#7e5c38]/20" />
                    </div>

                    <p 
                      className="font-handwriting text-xl sm:text-2xl text-[#1a1410] leading-relaxed italic"
                      style={{ fontFamily: 'var(--font-handwriting), cursive' }}
                    >
                      &ldquo;Whenever you feel the distance between us, close your eyes and remember: every second apart is just counting down to the moment I get to hold you again. I love you, Maria. Always.&rdquo;
                    </p>

                    <div className="mt-3 text-right">
                      <span className="font-calligraphy text-2xl sm:text-3xl text-[#1a1410]">
                        Forever yours, Joel
                      </span>
                    </div>

                    {/* Subtle option to tuck whisper away */}
                    <div className="mt-3 pt-2 border-t border-[#8a6845]/15 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          soundEffects.playPaperRustle();
                          setIsSecretNoteRevealed(false);
                        }}
                        className="text-[11px] font-serif italic text-[#8a6845] hover:text-[#2d1e12] transition-colors cursor-pointer select-none"
                      >
                        Tuck note back under
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SCENE 7: Photograph Corner Peek underneath bottom edge */}
        <AnimatePresence>
          {photoCornerRevealed && (
            <motion.div
              onClick={handleTouchPhotoCorner}
              initial={{ x: 30, opacity: 0 }}
              animate={{
                x: [0, -6, 0],
                opacity: 1,
                transition: {
                  repeat: Infinity,
                  duration: 3.5,
                  ease: 'easeInOut',
                },
              }}
              whileHover={{ scale: 1.08, y: -4 }}
              className="absolute -bottom-8 sm:-bottom-10 right-8 sm:right-14 z-30 cursor-pointer select-none group"
              title="A photograph tucked behind the letter..."
            >
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-handwriting text-[#6e4e31] italic opacity-85 group-hover:opacity-100 underline decoration-[#6e4e31]/30 underline-offset-2">
                  a photograph tucked behind...
                </span>

                {/* Peeking Polaroid Corner */}
                <div 
                  className="w-12 h-14 sm:w-14 sm:h-16 bg-[#faf6ee] p-1 shadow-[0_8px_18px_rgba(0,0,0,0.45)] border border-[#d8c3a1] rotate-12 relative overflow-hidden"
                >
                  {/* Photo area */}
                  <div className="w-full h-8 bg-gradient-to-tr from-[#633526] via-[#a35e39] to-[#db9c6b] flex items-center justify-center">
                    <span className="text-[9px] text-[#fff2cc] opacity-80">📷</span>
                  </div>
                  {/* Bottom caption border of polaroid */}
                  <div className="h-4 bg-[#faf6ee]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom subtle stationery imprint & Physical "Fold this letter." Instruction */}
        <div className="mt-14 sm:mt-18 pt-4 flex flex-col sm:flex-row justify-between items-center text-xs font-serif italic text-[#806345] opacity-75 border-t border-[#ddceb0]/35 gap-3">
          <span>Kept close to heart • Sent with all of me</span>

          {/* PHYSICAL INTERACTION: "Fold this letter." */}
          {isLetterCompleted && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playPaperRustle();
                if (onFoldLetter) onFoldLetter();
              }}
              className="font-handwriting text-lg sm:text-xl text-[#6b4e33] hover:text-[#1e150f] underline decoration-[#6b4e33]/30 underline-offset-4 transition-colors cursor-pointer select-none"
            >
              Fold this letter.
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
