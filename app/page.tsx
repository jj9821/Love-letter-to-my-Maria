'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Envelope } from '@/components/Envelope';
import { Letter } from '@/components/Letter';
import { Controls } from '@/components/Controls';
import { AmbientBackground } from '@/components/AmbientBackground';
import { letterData } from '@/data/letter';
import { soundEffects } from '@/components/AudioEffects';

type LetterStage = 'closed' | 'opening' | 'extracted' | 'unfolded' | 'reading';

export default function Home() {
  const [stage, setStage] = useState<LetterStage>('closed');
  // Fixed slow, intimate reading pace (multiplier 1.4 for natural handwriting)
  const slowSpeedMultiplier = 1.4;
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Cinematic physical opening sequence
  const handleOpenEnvelope = () => {
    if (stage !== 'closed') return;

    // Start background music as soon as envelope is clicked
    soundEffects.playBackgroundMusic();

    // Step 1: Wax seal breaks, flap lifts open, letter top becomes visible
    setStage('opening');

    // Step 2: Letter slowly slides upward out of the envelope
    setTimeout(() => {
      soundEffects.playPaperRustle();
      setStage('extracted');
    }, 1100);

    // Step 3: Letter unfolds along creases and expands to center
    setTimeout(() => {
      setStage('unfolded');
    }, 2200);

    // Step 4: Ready to begin handwriting
    setTimeout(() => {
      setStage('reading');
    }, 3100);
  };

  // Re-seal to experience again
  const handleReplay = () => {
    soundEffects.stopBackgroundMusic();
    setIsSkipped(false);
    setIsCompleted(false);
    setIsPaused(false);
    setStage('closed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSkip = () => {
    setIsSkipped(true);
    setIsCompleted(true);
  };

  const isReadingActive = stage === 'unfolded' || stage === 'reading';

  return (
    <main className="min-h-screen relative flex flex-col justify-center items-center px-4 py-8 sm:py-16 overflow-x-hidden">
      {/* Dynamic Candlelit Atmosphere with Reading Dimming */}
      <AmbientBackground isReading={isReadingActive} />

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Stage 1: Closed or Opening Envelope */}
        <AnimatePresence>
          {(stage === 'closed' || stage === 'opening' || stage === 'extracted') && (
            <motion.div
              key="envelope-view"
              className="w-full flex justify-center items-center my-auto py-8 sm:py-14"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{
                opacity: stage === 'extracted' ? 0.25 : 1,
                scale: stage === 'extracted' ? 0.86 : 1,
                y: stage === 'extracted' ? 90 : 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.82,
                y: 120,
                transition: { duration: 0.9, ease: [0.35, 0, 0.25, 1] },
              }}
              transition={{ duration: 1.3, ease: [0.25, 1, 0.5, 1] }}
            >
              <Envelope
                isOpen={stage !== 'closed'}
                onOpen={handleOpenEnvelope}
                recipient={letterData.recipient}
                sender={letterData.sender}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 2: Emerged & Unfolded Letter with Smooth Cinematic Camera Focus */}
        <AnimatePresence>
          {isReadingActive && (
            <motion.div
              key="letter-view"
              className="w-full"
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.25, 1, 0.4, 1] }}
            >
              <Letter
                stage={stage}
                speedMultiplier={slowSpeedMultiplier}
                isPaused={isPaused}
                isSkipped={isSkipped}
                onComplete={() => setIsCompleted(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Reading Controls */}
      <Controls
        isStarted={isReadingActive}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onSkip={handleSkip}
        onReplay={handleReplay}
        isCompleted={isCompleted}
      />
    </main>
  );
}
