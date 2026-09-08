'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WaxSealProps {
  isBroken?: boolean;
  onClick?: () => void;
}

export const WaxSeal: React.FC<WaxSealProps> = ({ isBroken = false, onClick }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Open sealed letter"
      className="relative group focus:outline-none cursor-pointer select-none"
      whileHover={{ scale: isBroken ? 1 : 1.04 }}
      whileTap={{ scale: isBroken ? 1 : 0.96 }}
      animate={
        isBroken
          ? {
              scale: 0.9,
              opacity: 0,
              y: 20,
              rotate: -8,
              transition: { duration: 0.7, ease: [0.33, 1, 0.68, 1] },
            }
          : {
              scale: 1,
              opacity: 1,
              y: 0,
              rotate: 0,
            }
      }
    >
      {/* Outer irregular melted wax puddle shape */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.55)]">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Radial gradient for realistic convex wax lighting */}
            <radialGradient id="waxGradient" cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#bf3232" />
              <stop offset="35%" stopColor="#8a1818" />
              <stop offset="70%" stopColor="#5f0c0c" />
              <stop offset="100%" stopColor="#3d0505" />
            </radialGradient>

            {/* Specular shine */}
            <linearGradient id="waxShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="40%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
            </linearGradient>

            <filter id="waxInnerShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feComponentTransfer in="SourceAlpha">
                <feFuncA type="linear" slope="0.7" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feOffset dx="1" dy="2" />
              <feComposite operator="out" in2="SourceGraphic" />
              <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.8 0" />
              <feBlend mode="multiply" in2="SourceGraphic" />
            </filter>
          </defs>

          {/* Melted organic wax base puddle with natural ripples */}
          <path
            d="M 50,4 C 64,2 78,10 86,22 C 94,34 98,52 92,66 C 87,79 78,92 64,96 C 50,99 35,97 22,90 C 10,83 3,69 3,54 C 2,39 12,24 24,14 C 34,6 42,4 50,4 Z"
            fill="url(#waxGradient)"
          />

          {/* Droplet drips around edge */}
          <path
            d="M 85,32 C 92,30 96,38 94,44 C 91,48 87,46 85,42 Z"
            fill="#5f0c0c"
            opacity="0.8"
          />
          <path
            d="M 12,58 C 7,62 6,70 12,74 C 18,76 19,68 15,62 Z"
            fill="#6b1010"
            opacity="0.7"
          />

          {/* Embossed inner circle rim */}
          <circle
            cx="50"
            cy="51"
            r="32"
            fill="none"
            stroke="#450808"
            strokeWidth="3.5"
            opacity="0.9"
          />
          <circle
            cx="50"
            cy="50"
            r="32"
            fill="none"
            stroke="#b52c2c"
            strokeWidth="1.5"
            opacity="0.6"
          />

          {/* Inner embossed seal bed */}
          <circle cx="50" cy="50" r="29" fill="#751313" opacity="0.6" />

          {/* Embossed Monogram / Heart Motif */}
          <g transform="translate(50, 49) scale(0.9)" className="drop-shadow-[0_1px_1px_rgba(255,255,255,0.2)]">
            {/* Elegant entwined 'M & J' or Heart silhouette */}
            <path
              d="M 0,-10 C 2,-14 6,-16 10,-16 C 16,-16 20,-11 20,-5 C 20,4 12,12 0,20 C -12,12 -20,4 -20,-5 C -20,-11 -16,-16 -10,-16 C -6,-16 -2,-14 0,-10 Z"
              fill="#420606"
              transform="scale(0.85)"
            />
            <path
              d="M 0,-9 C 1.8,-13 5.5,-15 9,-15 C 14.5,-15 18,-10.5 18,-5 C 18,3 11,10.5 0,18 C -11,10.5 -18,3 -18,-5 C -18,-10.5 -14.5,-15 -9,-15 C -5.5,-15 -1.8,-13 0,-9 Z"
              fill="#9e2020"
              transform="scale(0.82)"
            />
            {/* Subtle initial M */}
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fill="#ebdcb9"
              fontSize="13"
              fontFamily="var(--font-calligraphy), serif"
              fontWeight="bold"
              className="select-none tracking-widest opacity-90"
              style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.7))' }}
            >
              M
            </text>
          </g>

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

        {/* Delicate pulse glow on hover when closed */}
        {!isBroken && (
          <span className="absolute inset-0 rounded-full border border-amber-300/20 group-hover:border-amber-300/40 transition-colors animate-pulse pointer-events-none" />
        )}
      </div>
    </motion.button>
  );
};
