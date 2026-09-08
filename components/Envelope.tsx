'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Stamp } from './Stamp';
import { WaxSeal } from './WaxSeal';
import { soundEffects } from './AudioEffects';

interface EnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
  recipient: string;
  sender: string;
}

export const Envelope: React.FC<EnvelopeProps> = ({
  isOpen,
  onOpen,
  recipient,
  sender,
}) => {
  const handleOpenClick = () => {
    if (isOpen) return;
    soundEffects.playWaxSealBreak();
    soundEffects.playBackgroundMusic();
    onOpen();
  };

  return (
    <motion.div 
      className="relative w-full max-w-[580px] aspect-[1.5/1] mx-auto select-none perspective-1000"
      animate={{
        rotate: isOpen ? [-0.4, 0.4, 0] : 0,
        y: isOpen ? 6 : 0,
      }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      {/* Outer Envelope Ambient Shadow on Table */}
      <motion.div
        className="absolute inset-0 rounded-md bg-black/50 blur-xl translate-y-6 scale-95"
        animate={{
          scale: isOpen ? 0.9 : 0.96,
          opacity: isOpen ? 0.25 : 0.55,
          y: isOpen ? 30 : 20,
        }}
        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
      />

      {/* Main Envelope Body Container */}
      <div 
        className="relative w-full h-full rounded-sm overflow-visible envelope-paper transition-shadow duration-700"
        style={{
          boxShadow: '0 20px 45px -10px rgba(0,0,0,0.55), 0 5px 15px rgba(0,0,0,0.25), inset 0 0 50px rgba(175,145,110,0.35)',
          border: '1px solid rgba(185, 155, 115, 0.5)',
        }}
      >
        {/* Envelope Back Interior (Revealed when top flap flips open) */}
        <div className="absolute inset-0 bg-[#ebe2cf] rounded-sm overflow-hidden">
          {/* Vintage diamond interior lining */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(#8b5a2b 1px, transparent 1px), radial-gradient(#8b5a2b 1px, #ebe2cf 1px)`,
              backgroundSize: '18px 18px',
              backgroundPosition: '0 0, 9px 9px',
            }}
          />
          {/* Deep slot shadow */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/25" />

          {/* Letter Peeking Out from Slot when Flap Opens */}
          <motion.div
            className="absolute left-[10%] right-[10%] h-[55%] rounded-t-sm bg-[#faf5ea] shadow-md border-t border-l border-r border-[#d4c3a3]"
            initial={{ y: '20%', opacity: 0 }}
            animate={
              isOpen
                ? {
                    y: '-28%',
                    opacity: 1,
                    transition: { duration: 1.1, delay: 0.5, ease: [0.25, 1, 0.5, 1] },
                  }
                : { y: '20%', opacity: 0 }
            }
          >
            {/* Subtle stationery crease hint */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#8c6b45]/20 to-transparent mt-3" />
          </motion.div>
        </div>

        {/* ENVELOPE FACE BACKGROUND FOLDS (Soft, realistic paper creases) */}
        {/* Left Crease Shading */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-30"
          style={{
            clipPath: 'polygon(0 0, 0 100%, 50% 50%)',
            background: 'linear-gradient(135deg, rgba(230,220,200,0.8) 0%, rgba(200,185,160,0.6) 100%)',
          }}
        />

        {/* Right Crease Shading */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-30"
          style={{
            clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)',
            background: 'linear-gradient(225deg, rgba(230,220,200,0.8) 0%, rgba(200,185,160,0.6) 100%)',
          }}
        />

        {/* Bottom Flap Soft Contour */}
        <div
          className="absolute inset-0 pointer-events-none z-15 opacity-40"
          style={{
            clipPath: 'polygon(0 100%, 100% 100%, 50% 68%)',
            background: 'linear-gradient(0deg, rgba(245,238,225,0.7) 0%, rgba(215,200,175,0.4) 100%)',
            borderTop: '1px solid rgba(170,140,100,0.15)',
          }}
        />

        {/* TOP FLAP (3D Animated Fold with Wax Seal) */}
        {/* Tapered from 8% to 92% width so it never covers the Stamp or From address! */}
        <motion.div
          className="absolute top-0 left-[8%] right-[8%] h-[37%] origin-top preserve-3d cursor-pointer"
          style={{
            zIndex: isOpen ? 5 : 35,
          }}
          initial={{ rotateX: 0 }}
          animate={{
            rotateX: isOpen ? -175 : 0,
          }}
          transition={{
            duration: 1.5,
            ease: [0.35, 0, 0.2, 1],
            delay: isOpen ? 0.25 : 0,
          }}
          onClick={handleOpenClick}
        >
          {/* Top Flap Triangular Body */}
          <div
            className="w-full h-full relative"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              background: 'linear-gradient(180deg, #f8f2e6 0%, #e3d5bb 100%)',
              filter: 'drop-shadow(0 5px 9px rgba(0,0,0,0.25))',
              borderBottom: '1px solid rgba(175,145,105,0.4)',
            }}
          >
            {/* Subtle paper grain on flap */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15" />
          </div>

          {/* Wax Seal affixed at the apex of the top flap */}
          <div className="absolute left-1/2 -bottom-8 sm:-bottom-10 -translate-x-1/2 z-40">
            <WaxSeal isBroken={isOpen} onClick={handleOpenClick} />
          </div>
        </motion.div>

        {/* FRONT ADDRESSING & DETAILS LAYER */}
        <div className="absolute inset-0 z-30 p-5 sm:p-7 flex flex-col justify-between pointer-events-none">
          
          {/* TOP ROW: Sender & Stamp (Outside the flap fold, completely unobstructed) */}
          <div className="flex justify-between items-start w-full relative z-40">
            
            {/* SENDER NOTE (Top Left) */}
            <div className="text-left font-serif pt-1 pl-1 max-w-[210px] sm:max-w-[240px]">
              <span className="block text-[11px] sm:text-xs text-[#523924] tracking-[0.2em] uppercase font-bold">
                FROM:
              </span>
              <span 
                className="block text-2xl sm:text-3xl text-[#18110c] font-calligraphy tracking-wide mt-0.5"
                style={{ 
                  fontFamily: 'var(--font-calligraphy), cursive',
                  textShadow: '0 0.5px 1px rgba(0,0,0,0.15)',
                }}
              >
                {sender}
              </span>
              <span className="block text-[10px] sm:text-[11px] text-[#6b4e34] italic tracking-wide mt-0.5 leading-snug">
                Sent across distance • With all my heart
              </span>
            </div>

            {/* POSTAGE STAMP (Top Right) */}
            <div className="relative pt-0 pr-1">
              <Stamp />
            </div>
          </div>

          {/* LOWER SECTION: Recipient Calligraphy (Completely below the wax seal) */}
          <div className="flex flex-col items-center justify-center text-center mt-auto pb-4 sm:pb-6 relative z-30">
            
            {/* Subtle header above name */}
            <div className="flex items-center gap-2 mb-1.5 opacity-85">
              <span className="h-[1px] w-6 sm:w-10 bg-[#8c6b48]" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#5c4028] font-serif font-semibold">
                DELIVER TO MY LOVE
              </span>
              <span className="h-[1px] w-6 sm:w-10 bg-[#8c6b48]" />
            </div>

            {/* Recipient Name - Big, Bold, Crystal Clear Calligraphy */}
            <h1 
              className="text-3xl sm:text-5xl md:text-[54px] text-[#120d09] font-calligraphy tracking-wide py-0.5 leading-tight select-none drop-shadow-sm font-normal"
              style={{
                fontFamily: 'var(--font-calligraphy), cursive',
                textShadow: '0 0.5px 1px rgba(18,13,9,0.2)',
              }}
            >
              {recipient}
            </h1>

            {/* Subtle romantic tagline beneath name */}
            <div className="flex items-center gap-3 mt-1.5 opacity-80">
              <span className="h-[1px] w-8 sm:w-14 bg-[#91704c]" />
              <span className="text-xs sm:text-sm text-[#5c4129] font-serif italic">Only for her eyes</span>
              <span className="h-[1px] w-8 sm:w-14 bg-[#91704c]" />
            </div>
          </div>

          {/* BOTTOM CORNER FOOTERS */}
          <div className="w-full flex justify-between items-center text-[9px] sm:text-[10px] text-[#78593a] tracking-widest font-serif uppercase opacity-75 px-1 pt-1">
            <span>Confidential & Personal</span>
            <span>By Hand & Heart</span>
          </div>

        </div>

      </div>

      {/* Gentle Tap Hint when closed */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center mt-8 text-[#d5c3a3]/80 font-serif italic text-sm sm:text-base flex items-center justify-center gap-2 select-none"
        >
          <span className="inline-block w-6 h-[1px] bg-[#d5c3a3]/40" />
          <span>Tap the wax seal to open Maria&apos;s letter</span>
          <span className="inline-block w-6 h-[1px] bg-[#d5c3a3]/40" />
        </motion.div>
      )}
    </motion.div>
  );
};
