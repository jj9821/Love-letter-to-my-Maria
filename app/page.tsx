'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Envelope } from '@/components/Envelope';
import { Letter } from '@/components/Letter';
import { Memories } from '@/components/Memories';
import { AmbientBackground } from '@/components/AmbientBackground';
import { letters } from '@/data/letter';
import { soundEffects } from '@/components/AudioEffects';

type LetterStage = 'closed' | 'opening' | 'extracted' | 'unfolded' | 'reading' | 'memories';

export default function Home() {
  const [stage, setStage] = useState<LetterStage>('closed');
  // Default to the newly added letter (Letter II)
  const [activeLetterId, setActiveLetterId] = useState<string>('letter-2');
  
  // Fixed slow, intimate handwriting pace (multiplier 1.35)
  const slowSpeedMultiplier = 1.35;
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);
  const [isMusicOn, setIsMusicOn] = useState<boolean>(false);

  const currentLetter = letters.find((l) => l.id === activeLetterId) || letters[1];
  const alternateLetter = letters.find((l) => l.id !== activeLetterId);

  // Subscribe to sound effects music status
  useEffect(() => {
    const unsubscribe = soundEffects.subscribe((playing) => {
      setIsMusicOn(playing);
    });
    return () => unsubscribe();
  }, []);

  // Cinematic physical opening sequence
  const handleOpenEnvelope = () => {
    if (stage !== 'closed') return;

    // Start background music as soon as envelope is opened
    soundEffects.playBackgroundMusic(currentLetter.audioSrc);

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
    }, 2300);

    // Step 4: Ready to begin handwriting
    setTimeout(() => {
      setStage('reading');
    }, 3200);
  };

  // Physical folding interaction: letter folds away and returns to sealed envelope
  const handleFoldLetter = () => {
    soundEffects.playPaperRustle();
    setStage('extracted');

    setTimeout(() => {
      setStage('opening');
    }, 900);

    setTimeout(() => {
      setStage('closed');
      setIsSkipped(false);
      setIsPaused(false);
    }, 1900);
  };

  // Switch between letters seamlessly
  const handleSwitchLetter = () => {
    if (!alternateLetter) return;
    soundEffects.playPaperRustle();
    
    // If currently reading, fold down then unfold the alternate letter
    if (stage === 'reading' || stage === 'unfolded') {
      setStage('extracted');
      setTimeout(() => {
        setActiveLetterId(alternateLetter.id);
        soundEffects.playBackgroundMusic(alternateLetter.audioSrc);
        setStage('unfolded');
      }, 700);
      setTimeout(() => {
        setStage('reading');
      }, 1600);
    } else {
      setActiveLetterId(alternateLetter.id);
    }
  };

  // Select a letter directly from the envelope bundle on the desk
  const handleSelectLetterOnDesk = (id: string) => {
    setActiveLetterId(id);
  };

  // Transition to physical memories keepsakes
  const handleDiscoverMemories = () => {
    setStage('memories');
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth',
      });
    }, 300);
  };

  // Return from memories back to reading letter
  const handleCloseMemories = () => {
    setStage('reading');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle unobtrusive music in quiet corner
  const handleToggleMusic = () => {
    soundEffects.toggleBackgroundMusic();
  };

  const isReadingOrMemories = stage === 'unfolded' || stage === 'reading' || stage === 'memories';

  return (
    <main className="min-h-screen relative flex flex-col justify-center items-center px-4 py-8 sm:py-16 overflow-x-hidden">
      {/* Dynamic Candlelit Atmosphere with Reading Dimming */}
      <AmbientBackground isReading={isReadingOrMemories} />

      {/* Unobtrusive Minimal Sound Control (♫ in quiet top corner) */}
      <div className="fixed top-5 right-5 sm:top-7 sm:right-8 z-50">
        <button
          type="button"
          onClick={handleToggleMusic}
          aria-label={isMusicOn ? 'Mute music' : 'Play music'}
          className="p-2 text-sm sm:text-base font-serif transition-all duration-300 select-none text-[#d5c2a3]/40 hover:text-[#d5c2a3]/90 focus:outline-none cursor-pointer"
          title={isMusicOn ? 'Music playing • tap to pause' : 'Music paused • tap to play'}
        >
          <span className="inline-block relative">
            ♫
            {!isMusicOn && (
              <span className="absolute left-0 top-1/2 w-full h-[1.5px] bg-[#d5c2a3]/60 -rotate-45" />
            )}
          </span>
        </button>
      </div>

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
                isPeeking={stage === 'opening' || stage === 'extracted'}
                onOpen={handleOpenEnvelope}
                recipient={currentLetter.recipient}
                sender={currentLetter.sender}
                lettersList={letters}
                activeLetterId={activeLetterId}
                onSelectLetter={handleSelectLetterOnDesk}
                activeLetterSubtitle={currentLetter.subtitle || currentLetter.title}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 2: Emerged & Unfolded Letter with Smooth Cinematic Focus */}
        <AnimatePresence>
          {isReadingOrMemories && (
            <motion.div
              key={`letter-view-${currentLetter.id}`}
              className="w-full"
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.92 }}
              transition={{ duration: 1.4, ease: [0.25, 1, 0.4, 1] }}
            >
              <Letter
                stage={stage === 'memories' ? 'reading' : stage}
                data={currentLetter}
                speedMultiplier={slowSpeedMultiplier}
                isPaused={isPaused}
                isSkipped={isSkipped}
                onDiscoverMemories={handleDiscoverMemories}
                onFoldLetter={handleFoldLetter}
                onSwitchLetter={handleSwitchLetter}
                alternateLetterTitle={alternateLetter?.title}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 3: Tabletop Keepsakes & Memories */}
        <AnimatePresence>
          {stage === 'memories' && (
            <Memories
              isVisible={stage === 'memories'}
              onClose={handleCloseMemories}
              onFoldLetter={handleFoldLetter}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
