'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  FastForward, 
  RotateCcw,
  Music
} from 'lucide-react';
import { soundEffects } from './AudioEffects';

interface ControlsProps {
  isStarted: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
  onSkip: () => void;
  onReplay: () => void;
  isCompleted: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  isStarted,
  isPaused,
  onTogglePause,
  onSkip,
  onReplay,
  isCompleted,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = soundEffects.subscribe((playing) => {
      setIsMusicPlaying(playing);
    });
    return () => unsubscribe();
  }, []);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEffects.setMuted(nextMuted);
  };

  const toggleAmbientMusic = () => {
    soundEffects.toggleBackgroundMusic();
  };

  if (!isStarted) return null;

  return (
    <motion.aside
      aria-label="Letter reading controls"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-3 px-4 py-2 sm:py-2.5 rounded-full bg-[#201813]/85 backdrop-blur-md border border-[#8f6d48]/40 shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-[#e2d5c3] text-xs sm:text-sm select-none"
    >
      {/* Sound Effects Toggle */}
      <button
        onClick={toggleSound}
        className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-[#d5c2a5]"
        title={isMuted ? 'Unmute paper sounds' : 'Mute paper sounds'}
        aria-label={isMuted ? 'Unmute paper sounds' : 'Mute paper sounds'}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>

      {/* Gentle Music Pad Toggle */}
      <button
        onClick={toggleAmbientMusic}
        className={`p-1.5 rounded-full transition-colors ${
          isMusicPlaying
            ? 'bg-[#8a1818]/60 text-amber-200 shadow-sm'
            : 'hover:bg-white/10 text-[#d5c2a5]'
        }`}
        title={isMusicPlaying ? 'Pause music' : 'Play music'}
        aria-label={isMusicPlaying ? 'Pause music' : 'Play music'}
      >
        <Music size={16} />
      </button>

      <span className="h-4 w-[1px] bg-white/15" />

      {/* Play / Pause Toggle (Only active while writing) */}
      {!isCompleted && (
        <button
          onClick={onTogglePause}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-white/10 transition-colors text-[#e8dac7]"
          title={isPaused ? 'Resume reading' : 'Pause writing'}
          aria-label={isPaused ? 'Resume reading' : 'Pause writing'}
        >
          {isPaused ? <Play size={14} /> : <Pause size={14} />}
          <span className="hidden sm:inline text-xs">{isPaused ? 'Resume' : 'Pause'}</span>
        </button>
      )}

      {/* Skip to complete */}
      {!isCompleted && (
        <button
          onClick={onSkip}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-white/10 transition-colors text-[#b09a80] hover:text-white"
          title="Read entire letter now"
        >
          <FastForward size={14} />
          <span className="hidden md:inline text-xs">Skip</span>
        </button>
      )}

      {/* Replay */}
      <button
        onClick={onReplay}
        className="flex items-center gap-1 px-2.5 py-1 rounded-full hover:bg-white/10 transition-colors text-[#d5c2a5] hover:text-white"
        title="Fold back and close envelope"
      >
        <RotateCcw size={14} />
        <span className="hidden sm:inline text-xs">Re-seal</span>
      </button>
    </motion.aside>
  );
};
