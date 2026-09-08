'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEffects } from './AudioEffects';

interface MemoriesProps {
  isVisible: boolean;
  onClose: () => void;
  onFoldLetter: () => void;
}

interface KeepsakeItem {
  id: string;
  type: 'polaroid' | 'ticket' | 'scrap';
  title?: string;
  date?: string;
  caption: string;
  rotation: number;
  imageVisual?: React.ReactNode;
}

export const Memories: React.FC<MemoriesProps> = ({
  isVisible,
  onClose,
  onFoldLetter,
}) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleInspect = (id: string) => {
    soundEffects.playPaperRustle();
    setActiveItem(activeItem === id ? null : id);
  };

  const keepsakes: KeepsakeItem[] = [
    {
      id: 'photo-1',
      type: 'polaroid',
      date: 'Oct 14',
      caption: 'The evening by the shore — you laughed until your stomach hurt.',
      rotation: -3.5,
      imageVisual: (
        <div className="w-full h-full bg-[#3a2c24] relative overflow-hidden flex items-center justify-center">
          {/* Sunset sky gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#8f4a38] via-[#cf8152] to-[#dfb175]" />
          {/* Sun setting */}
          <div className="absolute bottom-6 w-12 h-12 rounded-full bg-[#fff2cc] opacity-85 blur-[1px]" />
          {/* Water reflection */}
          <div className="absolute bottom-0 inset-x-0 h-8 bg-[#3d271c] opacity-80" />
          {/* Silhouettes */}
          <svg viewBox="0 0 100 40" className="absolute bottom-1 w-24 h-10 fill-[#1f130c]">
            <path d="M 38 40 C 38 28 42 22 45 18 C 47 15 50 15 52 18 C 55 22 58 28 58 40 Z" />
            <path d="M 48 40 C 48 30 52 24 55 20 C 57 17 60 17 62 20 C 65 24 68 30 68 40 Z" />
          </svg>
          {/* Film grain vignette */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/35" />
        </div>
      ),
    },
    {
      id: 'ticket-1',
      type: 'ticket',
      caption: 'ADMIT TWO • NON-REFUNDABLE',
      rotation: 4.2,
    },
    {
      id: 'photo-2',
      type: 'polaroid',
      date: 'Dec 02',
      caption: 'Our quiet corner table and talks that made midnight disappear.',
      rotation: 2.2,
      imageVisual: (
        <div className="w-full h-full bg-[#271d18] relative overflow-hidden flex items-center justify-center">
          {/* Warm cafe amber lighting */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#2d1b13] via-[#5c3a24] to-[#804f32]" />
          {/* Candle / Cup Silhouette */}
          <div className="w-14 h-14 rounded-full bg-[#fce39f]/20 blur-md absolute" />
          <svg viewBox="0 0 100 80" className="w-20 h-16 fill-[#140c08] opacity-90 relative z-10">
            {/* Coffee cup 1 */}
            <path d="M 25 35 L 30 65 Q 45 68 60 65 L 65 35 Z" fill="#ebdcb9" />
            <path d="M 64 42 Q 74 42 74 52 Q 74 60 63 60" stroke="#ebdcb9" strokeWidth="3" fill="none" />
            {/* Coffee steam */}
            <path d="M 40 28 Q 36 20 42 12" stroke="#ebdcb9" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />
            <path d="M 50 28 Q 54 20 48 12" stroke="#ebdcb9" strokeWidth="1.5" fill="none" opacity="0.6" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40" />
        </div>
      ),
    },
    {
      id: 'scrap-1',
      type: 'scrap',
      caption: 'I caught myself smiling today just remembering how your voice sounds when you say my name.',
      rotation: -2.8,
    },
    {
      id: 'photo-3',
      type: 'polaroid',
      date: 'Forever',
      caption: 'Every single mile apart is just counting down to you.',
      rotation: 3.8,
      imageVisual: (
        <div className="w-full h-full bg-[#251f1c] relative overflow-hidden flex items-center justify-center">
          {/* Starry evening sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#14121a] via-[#241a24] to-[#452835]" />
          {/* Tiny stars */}
          <div className="absolute top-4 left-6 w-1 h-1 bg-white/70 rounded-full" />
          <div className="absolute top-10 left-24 w-1 h-1 bg-white/80 rounded-full" />
          <div className="absolute top-6 right-10 w-1.5 h-1.5 bg-amber-100/80 rounded-full" />
          <div className="absolute top-14 right-20 w-0.5 h-0.5 bg-white/60 rounded-full" />
          {/* Moon crescent */}
          <div className="absolute top-4 right-6 w-6 h-6 rounded-full border-r-2 border-t-2 border-amber-100/85" />
          {/* Distant skyline / trees */}
          <svg viewBox="0 0 120 40" className="absolute bottom-0 w-full h-12 fill-[#0d090a]">
            <path d="M 0 40 L 0 24 L 20 18 L 40 26 L 60 14 L 80 22 L 100 16 L 120 22 L 120 40 Z" />
          </svg>
        </div>
      ),
    },
  ];

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 1.1, ease: [0.25, 1, 0.4, 1] }}
      className="w-full max-w-4xl mx-auto my-12 sm:my-16 px-4"
    >
      {/* Tabletop Keepsakes Ambient Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center gap-3 opacity-70 mb-2">
          <span className="w-8 sm:w-16 h-[1px] bg-[#91704c]" />
          <span className="font-serif italic text-xs sm:text-sm text-[#d5c2a3] tracking-widest uppercase">
            Tucked beside the letter
          </span>
          <span className="w-8 sm:w-16 h-[1px] bg-[#91704c]" />
        </div>
        <p className="font-handwriting text-2xl sm:text-3xl text-[#ecdac1] italic">
          Keepsakes carried across the distance
        </p>
      </div>

      {/* Tabletop Scatter: Physical keepsakes resting on the dark desk */}
      <div className="flex flex-wrap justify-center items-start gap-6 sm:gap-8 md:gap-10 relative">
        {keepsakes.map((item) => {
          const isInspected = activeItem === item.id;

          if (item.type === 'polaroid') {
            return (
              <motion.div
                key={item.id}
                onClick={() => handleInspect(item.id)}
                className="cursor-pointer select-none relative"
                style={{ zIndex: isInspected ? 40 : 10 }}
                animate={{
                  rotate: isInspected ? 0 : item.rotation,
                  scale: isInspected ? 1.08 : 1,
                  y: isInspected ? -10 : 0,
                }}
                whileHover={{ scale: isInspected ? 1.08 : 1.03 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {/* Physical Polaroid Frame */}
                <div 
                  className="w-56 sm:w-64 p-3.5 pb-5 bg-[#faf6ee] rounded-sm shadow-[0_16px_32px_rgba(0,0,0,0.65)] border border-[#dec9aa]/70 relative"
                  style={{
                    boxShadow: isInspected
                      ? '0 25px 50px rgba(0,0,0,0.8), 0 0 1px 1px rgba(210,185,145,0.4)'
                      : '0 12px 28px rgba(0,0,0,0.6)',
                  }}
                >
                  {/* Photo area */}
                  <div className="w-full aspect-square rounded-[1px] overflow-hidden shadow-inner border border-black/20">
                    {item.imageVisual}
                  </div>

                  {/* Polaroid caption & date */}
                  <div className="pt-3 px-1 text-center">
                    <p 
                      className="font-handwriting text-base sm:text-lg text-[#201814] leading-snug"
                      style={{ fontFamily: 'var(--font-handwriting), cursive' }}
                    >
                      {item.caption}
                    </p>
                    {item.date && (
                      <span className="block mt-1 text-[11px] font-serif italic text-[#7a5e3e] opacity-75">
                        {item.date}
                      </span>
                    )}
                  </div>

                  {/* Tape fragment on top edge */}
                  <div 
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-5 bg-[#eedbb8]/60 backdrop-blur-[1px] border-t border-b border-black/10 rotate-1 shadow-sm pointer-events-none"
                  />
                </div>
              </motion.div>
            );
          }

          if (item.type === 'ticket') {
            return (
              <motion.div
                key={item.id}
                onClick={() => handleInspect(item.id)}
                className="cursor-pointer select-none relative my-auto"
                style={{ zIndex: isInspected ? 40 : 10 }}
                animate={{
                  rotate: isInspected ? 0 : item.rotation,
                  scale: isInspected ? 1.08 : 1,
                  y: isInspected ? -10 : 0,
                }}
                whileHover={{ scale: isInspected ? 1.08 : 1.03 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {/* Physical Ticket Stub */}
                <div 
                  className="w-56 sm:w-64 p-4 bg-[#f4ebd9] border border-[#cfb692] shadow-[0_12px_24px_rgba(0,0,0,0.6)] relative overflow-hidden"
                  style={{
                    backgroundImage: 'radial-gradient(#ab875b 0.5px, transparent 0.5px)',
                    backgroundSize: '8px 8px',
                  }}
                >
                  {/* Perforated side notch */}
                  <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#120e0b] border border-[#cfb692]" />
                  <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#120e0b] border border-[#cfb692]" />

                  <div className="border border-dashed border-[#8d6840]/60 p-2.5 text-center">
                    <div className="flex justify-between items-center text-[9px] font-serif uppercase tracking-widest text-[#694825] mb-1">
                      <span>RAILWAY PASS</span>
                      <span>№ 0414-JM</span>
                    </div>

                    <div className="font-serif font-bold text-sm sm:text-base text-[#402712] tracking-wider my-1">
                      ONE-WAY TO MARIA
                    </div>

                    <div className="text-[10px] font-serif italic text-[#725232]">
                      Seat 14A • Direct to your side
                    </div>

                    <div className="mt-2 pt-1 border-t border-[#8d6840]/30 flex justify-between text-[8px] font-serif text-[#7e5c38]">
                      <span>Valid: Always</span>
                      <span className="font-bold text-[#8a2222]">NO RETURN</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }

          if (item.type === 'scrap') {
            return (
              <motion.div
                key={item.id}
                onClick={() => handleInspect(item.id)}
                className="cursor-pointer select-none relative my-auto"
                style={{ zIndex: isInspected ? 40 : 10 }}
                animate={{
                  rotate: isInspected ? 0 : item.rotation,
                  scale: isInspected ? 1.08 : 1,
                  y: isInspected ? -10 : 0,
                }}
                whileHover={{ scale: isInspected ? 1.08 : 1.03 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {/* Torn Scrap of Paper with Pencil Note */}
                <div 
                  className="w-56 sm:w-64 p-5 bg-[#faf2e3] shadow-[0_14px_28px_rgba(0,0,0,0.65)] border border-[#d8c3a1] relative"
                  style={{
                    clipPath: 'polygon(0% 4%, 100% 0%, 98% 96%, 3% 100%)',
                  }}
                >
                  <div className="text-[10px] uppercase font-serif tracking-widest text-[#856545] opacity-70 mb-2">
                    Scrap found in coat pocket
                  </div>
                  <p 
                    className="font-handwriting text-lg sm:text-xl text-[#2a221d] leading-relaxed italic"
                    style={{ fontFamily: 'var(--font-handwriting), cursive' }}
                  >
                    &ldquo;{item.caption}&rdquo;
                  </p>
                  <div className="mt-2 text-right">
                    <span className="font-signature text-xl text-[#3d2e24]">
                      — J.
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          }

          return null;
        })}
      </div>

      {/* Natural Physical Actions at Bottom (No big buttons, subtle handwritten links) */}
      <div className="mt-14 sm:mt-18 pt-6 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 text-center">
        {/* Return to letter */}
        <button
          type="button"
          onClick={() => {
            soundEffects.playPaperRustle();
            onClose();
          }}
          className="font-handwriting text-xl sm:text-2xl text-[#d4be9d] hover:text-[#f8ede0] underline decoration-[#9c7b55]/40 underline-offset-4 transition-colors cursor-pointer select-none"
        >
          Put keepsakes back under the letter
        </button>

        <span className="hidden sm:inline text-[#9c7b55]/40">•</span>

        {/* Fold letter completely away */}
        <button
          type="button"
          onClick={() => {
            soundEffects.playPaperRustle();
            onFoldLetter();
          }}
          className="font-serif italic text-sm sm:text-base text-[#b89f81] hover:text-[#f0e3d2] transition-colors cursor-pointer select-none"
        >
          Fold this letter & put everything away.
        </button>
      </div>
    </motion.div>
  );
};
