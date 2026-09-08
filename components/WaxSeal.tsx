'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface WaxSealProps {
  isBroken?: boolean;
  onClick?: () => void;
}

export const WaxSeal: React.FC<WaxSealProps> = ({ isBroken = false, onClick }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    if (isBroken) return;
    setIsPressed(true);
    // Trigger callback which handles the 300ms anticipation sequence
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label="Open sealed letter"
      className="relative group focus:outline-none cursor-pointer select-none"
      whileHover={{ scale: isBroken ? 1 : 1.025 }}
      whileTap={{ scale: isBroken ? 1 : 0.96 }}
      animate={
        isBroken
          ? {
              scale: 0.88,
              opacity: 0,
              y: 18,
              rotate: -9,
              transition: { duration: 0.85, ease: [0.33, 1, 0.68, 1] },
            }
          : isPressed
          ? {
              scale: 0.96,
              transition: { duration: 0.25 },
            }
          : {
              scale: 1,
              opacity: 1,
              y: 0,
              rotate: 0,
            }
      }
    >
      {/* Outer irregular melted wax puddle shape with handcrafted depth */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] transition-all duration-300">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Radial gradient for realistic convex wax lighting */}
            <radialGradient id="waxGradient" cx="36%" cy="34%" r="66%">
              <stop offset="0%" stopColor="#bf3232" />
              <stop offset="30%" stopColor="#8d1717" />
              <stop offset="68%" stopColor="#5c0a0a" />
              <stop offset="100%" stopColor="#380404" />
            </radialGradient>

            {/* Specular shine */}
            <linearGradient id="waxShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
              <stop offset="35%" stopColor="rgba(255,255,255,0.06)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
            </linearGradient>

            {/* Crack shadow */}
            <filter id="crackShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" floodColor="#000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Melted organic wax base puddle with natural ripples & uneven edges */}
          <path
            d="M 50,4 C 64,2 78,9 86,21 C 94,33 98,51 92,66 C 87,79 78,92 64,96 C 50,99 35,97 22,90 C 10,83 3,69 3,54 C 2,39 12,24 24,14 C 34,6 42,4 50,4 Z"
            fill="url(#waxGradient)"
          />

          {/* Droplet drips around edge */}
          <path
            d="M 85,32 C 92,30 96,38 94,44 C 91,48 87,46 85,42 Z"
            fill="#5c0a0a"
            opacity="0.85"
          />
          <path
            d="M 12,58 C 7,62 6,70 12,74 C 18,76 19,68 15,62 Z"
            fill="#660d0d"
            opacity="0.75"
          />

          {/* Embossed inner circle rim */}
          <circle
            cx="50"
            cy="51"
            r="32"
            fill="none"
            stroke="#420606"
            strokeWidth="3.5"
            opacity="0.9"
          />
          <circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke="#b32929"
            strokeWidth="1.5"
            opacity="0.65"
          />

          {/* Inner embossed seal bed */}
          <circle cx="50" cy="50" r="29" fill="#721111" opacity="0.65" />

          {/* Embossed Monogram / Heart Motif */}
          <g transform="translate(50, 49) scale(0.9)" className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.22)]">
            {/* Elegant entwined Heart silhouette */}
            <path
              d="M 0,-10 C 2,-14 6,-16 10,-16 C 16,-16 20,-11 20,-5 C 20,4 12,12 0,20 C -12,12 -20,4 -20,-5 C -20,-11 -16,-16 -10,-16 C -6,-16 -2,-14 0,-10 Z"
              fill="#3e0505"
              transform="scale(0.85)"
            />
            <path
              d="M 0,-9 C 1.8,-13 5.5,-15 9,-15 C 14.5,-15 18,-10.5 18,-5 C 18,3 11,10.5 0,18 C -11,10.5 -18,3 -18,-5 C -18,-10.5 -14.5,-15 -9,-15 C -5.5,-15 -1.8,-13 0,-9 Z"
              fill="#991d1d"
              transform="scale(0.82)"
            />
            {/* Subtle initial M for Maria */}
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fill="#ebdcb9"
              fontSize="13"
              fontFamily="var(--font-calligraphy), serif"
              fontWeight="bold"
              className="select-none tracking-widest opacity-95"
              style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))' }}
            >
              M
            </text>
          </g>

          {/* Hairline separation fracture when broken */}
          {isBroken && (
            <path
              d="M 32 16 L 46 42 L 42 56 L 68 88"
              stroke="#260303"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
              filter="url(#crackShadow)"
            />
          )}

          {/* Highlight sheen across upper curved crest */}
          <ellipse
            cx="40"
            cy="26"
            rx="16"
            ry="7"
            transform="rotate(-20 40 26)"
            fill="url(#waxShine)"
            opacity="0.45"
          />
        </svg>

        {/* Quiet subtle hover highlight - not flashy */}
        {!isBroken && (
          <span className="absolute inset-0 rounded-full border border-amber-300/20 group-hover:border-amber-300/40 transition-colors pointer-events-none" />
        )}
      </div>
    </motion.button>
  );
};
