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
  // Fixed slow, intimate reading pace
  const slowSpeedMultiplier = 1.4;
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Orchestrate the physical opening sequence
  const handleOpenEnvelope = () => {
    if (stage !== 'closed') return;

    // Start background music as soon as person opens the letter
    soundEffects.playBackgroundMusic();

    // Step 1: Wax seal breaks, flap lifts
    setStage('opening');

    // Step 2: Letter slides out of the envelope
    setTimeout(() => {
      soundEffects.playPaperRustle();
      setStage('extracted');
    }, 900);

    // Step 3: Letter unfolds and centers on screen
    setTimeout(() => {
      setStage('unfolded');
    }, 1800);

    // Step 4: Ready to begin handwriting
    setTimeout(() => {
      setStage('reading');
    }, 2500);
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

  return (
    <main className="min-h-screen relative flex flex-col justify-center items-center px-4 py-8 sm:py-16">
      <AmbientBackground />

      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Stage 1: Closed or Opening Envelope */}
        <AnimatePresence>
          {(stage === 'closed' || stage === 'opening' || stage === 'extracted') && (
            <motion.div
              key="envelope-view"
              className="w-full flex justify-center items-center my-auto py-8 sm:py-16"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{
                opacity: stage === 'extracted' ? 0.3 : 1,
                scale: stage === 'extracted' ? 0.88 : 1,
                y: stage === 'extracted' ? 80 : 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.85,
                y: 100,
                transition: { duration: 0.8, ease: 'easeInOut' },
              }}
              transition={{ duration: 1.1, ease: [0.25, 1, 0.5, 1] }}
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

        {/* Stage 2: Emerged & Unfolded Letter */}
        <AnimatePresence>
          {(stage === 'extracted' || stage === 'unfolded' || stage === 'reading') && (
            <motion.div
              key="letter-view"
              className="w-full"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
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

      {/* Floating Controls Bar */}
      <Controls
        isStarted={stage === 'unfolded' || stage === 'reading'}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
        onSkip={handleSkip}
        onReplay={handleReplay}
        isCompleted={isCompleted}
      />
    </main>
  );
}
