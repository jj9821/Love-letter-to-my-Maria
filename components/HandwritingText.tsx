'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LetterData } from '../data/letter';

interface HandwritingTextProps {
  data: LetterData;
  isStarted: boolean;
  speedMultiplier: number;
  isPaused: boolean;
  isSkipped: boolean;
  onComplete?: () => void;
}

export const HandwritingText: React.FC<HandwritingTextProps> = ({
  data,
  isStarted,
  speedMultiplier,
  isPaused,
  isSkipped,
  onComplete,
}) => {
  // Phase management
  // 0: not started, 1: salutation, 2: body paragraphs, 3: emotional pause, 4: closing, 5: signature, 6: finished stillness
  const [phase, setPhase] = useState<number>(0);
  const [salutationText, setSalutationText] = useState<string>('');
  const [completedParagraphs, setCompletedParagraphs] = useState<string[]>([]);
  const [currentParagraphText, setCurrentParagraphText] = useState<string>('');
  const [currentParaIdx, setCurrentParaIdx] = useState<number>(0);
  const [closingText, setClosingText] = useState<string>('');
  const [signatureText, setSignatureText] = useState<string>('');

  const activeAnchorRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll so Maria smoothly follows the active line without jarring jumps
  useEffect(() => {
    if (activeAnchorRef.current && phase > 0 && phase < 6 && !isPaused) {
      activeAnchorRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [currentParagraphText, currentParaIdx, phase, isPaused]);

  // Handle instant skip to end
  useEffect(() => {
    if (isSkipped) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setSalutationText(data.salutation);
      setCompletedParagraphs(data.paragraphs);
      setCurrentParagraphText('');
      setCurrentParaIdx(data.paragraphs.length);
      setClosingText(data.closing);
      setSignatureText(data.signature);
      setPhase(6);
      if (onComplete) onComplete();
    }
  }, [isSkipped, data, onComplete]);

  // Main handwriting loop with sentence-aware emotional timing
  useEffect(() => {
    if (!isStarted || isSkipped || isPaused) return;

    const baseCharDelay = 32 * speedMultiplier;
    const commaDelay = 240 * speedMultiplier;
    const periodDelay = 580 * speedMultiplier;
    const standardParaDelay = 950 * speedMultiplier;
    const emotionalParaDelay = 1550 * speedMultiplier;
    const finalLetterPauseDelay = 2400 * speedMultiplier; // Stillness before closing

    // Helper to calculate pause after char with organic human variance
    const getCharDelay = (char: string) => {
      if (char === ',' || char === ';' || char === ':') return commaDelay;
      if (char === '.' || char === '!' || char === '?') return periodDelay;
      // Slight natural variance between keystrokes/strokes (±8ms)
      return baseCharDelay + (Math.random() * 16 - 8);
    };

    // Phase 0 -> Phase 1: Start Salutation
    if (phase === 0) {
      timeoutRef.current = setTimeout(() => {
        setPhase(1);
      }, 700 * speedMultiplier);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    // Phase 1: Inking Salutation ("To Maria Mathew,")
    if (phase === 1) {
      if (salutationText.length < data.salutation.length) {
        const nextChar = data.salutation[salutationText.length];
        timeoutRef.current = setTimeout(() => {
          setSalutationText((prev) => prev + nextChar);
        }, getCharDelay(nextChar));
      } else {
        // Pause after salutation before first intimate words
        timeoutRef.current = setTimeout(() => {
          setPhase(2);
        }, 1200 * speedMultiplier);
      }
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    // Phase 2: Writing Body Paragraphs with sentence-dependent pacing
    if (phase === 2) {
      const targetPara = data.paragraphs[currentParaIdx];

      if (currentParagraphText.length < targetPara.length) {
        const nextChar = targetPara[currentParagraphText.length];
        timeoutRef.current = setTimeout(() => {
          setCurrentParagraphText((prev) => prev + nextChar);
        }, getCharDelay(nextChar));
      } else {
        // Finished this paragraph!
        // Determine if this is a short, emotionally heavy line
        const isEmotionalSentence = 
          targetPara.length < 40 ||
          targetPara.includes('My love') ||
          targetPara.includes('I miss you') ||
          targetPara.includes('love you terribly') ||
          targetPara.includes('ordinary things with you') ||
          targetPara.includes('In my thoughts') ||
          targetPara.includes('More than these words');

        const delayToNext = isEmotionalSentence ? emotionalParaDelay : standardParaDelay;

        if (currentParaIdx < data.paragraphs.length - 1) {
          timeoutRef.current = setTimeout(() => {
            setCompletedParagraphs((prev) => [...prev, targetPara]);
            setCurrentParagraphText('');
            setCurrentParaIdx((idx) => idx + 1);
          }, delayToNext);
        } else {
          // Finished all paragraphs! Enter stillness pause before closing
          timeoutRef.current = setTimeout(() => {
            setCompletedParagraphs((prev) => [...prev, targetPara]);
            setCurrentParagraphText('');
            setPhase(3);
          }, finalLetterPauseDelay);
        }
      }
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    // Phase 3: Emotional Pause of Stillness (Maria absorbs the final words)
    if (phase === 3) {
      timeoutRef.current = setTimeout(() => {
        setPhase(4);
      }, 1600 * speedMultiplier);
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    // Phase 4: Slowly writing the Closing ("Loving U always,")
    if (phase === 4) {
      if (closingText.length < data.closing.length) {
        const nextChar = data.closing[closingText.length];
        timeoutRef.current = setTimeout(() => {
          setClosingText((prev) => prev + nextChar);
        }, getCharDelay(nextChar) + 15);
      } else {
        // Intimate pause before the signature flourish
        timeoutRef.current = setTimeout(() => {
          setPhase(5);
        }, 1300 * speedMultiplier);
      }
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    // Phase 5: Writing Signature ("Joel")
    if (phase === 5) {
      if (signatureText.length < data.signature.length) {
        const nextChar = data.signature[signatureText.length];
        timeoutRef.current = setTimeout(() => {
          setSignatureText((prev) => prev + nextChar);
        }, (baseCharDelay + 50) * speedMultiplier);
      } else {
        // Visual stillness after signature
        timeoutRef.current = setTimeout(() => {
          setPhase(6);
          if (onComplete) onComplete();
        }, 1200);
      }
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }
  }, [
    isStarted,
    phase,
    salutationText,
    currentParagraphText,
    currentParaIdx,
    closingText,
    signatureText,
    data,
    speedMultiplier,
    isPaused,
    isSkipped,
    onComplete,
  ]);

  // Helper to render text with italic asterisks formatted cleanly
  const renderFormattedContent = (text: string) => {
    const parts = text.split(/(\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="italic text-[#140f0c] font-handwriting">
            {part.slice(1, -1)}
          </em>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="font-handwriting text-[#1c1713] selection:bg-[#ebdcb9] leading-[1.85] sm:leading-[1.95] text-xl sm:text-2xl md:text-[26px]">
      {/* 1. Salutation */}
      <div className="mb-6 sm:mb-8 min-h-[3rem]">
        {salutationText && (
          <h2
            className="font-calligraphy text-3xl sm:text-4xl md:text-5xl text-[#18120e] tracking-wide"
            style={{ fontFamily: 'var(--font-calligraphy), cursive' }}
          >
            {salutationText}
            {phase === 1 && (
              <span className="inline-block w-1.5 h-6 bg-[#2a201b]/60 ml-1 animate-pulse" />
            )}
          </h2>
        )}
      </div>

      {/* 2. Completed Paragraphs */}
      <div className="space-y-4 sm:space-y-5">
        {completedParagraphs.map((para, idx) => (
          <p key={idx} className="transition-opacity duration-500 opacity-95">
            {renderFormattedContent(para)}
          </p>
        ))}

        {/* Currently Writing Paragraph */}
        {phase === 2 && currentParagraphText && (
          <p className="relative">
            {renderFormattedContent(currentParagraphText)}
            <span
              className="inline-block w-1.5 h-5 sm:h-6 bg-[#2a201b]/70 ml-1 rounded-full animate-pulse"
              style={{ verticalAlign: 'middle' }}
            />
          </p>
        )}
      </div>

      {/* Anchor for auto-scroll tracking */}
      <div ref={activeAnchorRef} className="h-4" />

      {/* 3. Closing and Signature */}
      <div className="mt-10 sm:mt-14 pt-4 min-h-[8rem]">
        {closingText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-calligraphy text-[#1b1511]"
            style={{ fontFamily: 'var(--font-calligraphy), cursive' }}
          >
            {closingText}
            {phase === 4 && (
              <span className="inline-block w-1.5 h-6 bg-[#2a201b]/60 ml-1 animate-pulse" />
            )}
          </motion.div>
        )}

        {signatureText && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-3 sm:mt-4 pl-2"
          >
            <span
              className="block text-4xl sm:text-5xl md:text-6xl text-[#16100c] font-signature tracking-wider"
              style={{
                fontFamily: 'var(--font-signature), cursive',
                textShadow: '0 0.5px 1px rgba(0,0,0,0.15)',
              }}
            >
              {signatureText}
            </span>

            {/* Flourish underline beneath Joel's signature */}
            {phase >= 5 && (
              <svg
                viewBox="0 0 200 24"
                className="w-36 sm:w-48 h-6 text-[#221812] opacity-85 mt-1 stroke-current fill-none"
              >
                <path
                  d="M 10 12 Q 60 4, 110 14 T 190 8"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};
