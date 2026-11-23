import React from 'react';
import { Reveal } from './Reveal';

interface LaceDividerProps {
  className?: string;
  variant?: 'default' | 'subtle' | 'compact';
}

export const LaceDivider: React.FC<LaceDividerProps> = ({
  className = '',
  variant = 'default',
}) => {
  const isCompact = variant === 'compact';

  return (
    <Reveal className={`w-full py-4 overflow-hidden select-none ${className}`} delay={0.1}>
      <div className="relative w-full flex items-center justify-center">
        {/* SVG Tileable Islamic/Damask Lace Pattern Band */}
        <div className="w-full relative h-10 flex items-center justify-center">
          <svg
            className="w-full h-full"
            viewBox="0 0 600 40"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="laceGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B8913A" stopOpacity="0" />
                <stop offset="15%" stopColor="#C9A24B" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#F1D98B" stopOpacity="0.95" />
                <stop offset="85%" stopColor="#C9A24B" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#B8913A" stopOpacity="0" />
              </linearGradient>

              {/* Damask / Islamic Lace Pattern Motif */}
              <pattern
                id="tileableLacePattern"
                x="0"
                y="0"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                {/* Geometric Star & Petal */}
                <path
                  d="M16 2 L19 11 L28 14 L20 18 L21 28 L16 22 L11 28 L12 18 L4 14 L13 11 Z"
                  stroke="#C9A24B"
                  strokeWidth="0.6"
                  strokeOpacity="0.4"
                  fill="#F1D98B"
                  fillOpacity="0.08"
                />
                <circle cx="16" cy="16" r="3" fill="#C9A24B" fillOpacity="0.3" />
                <path
                  d="M0 16 Q8 8 16 0 Q24 8 32 16 Q24 24 16 32 Q8 24 0 16 Z"
                  stroke="#E7CB84"
                  strokeWidth="0.5"
                  strokeOpacity="0.35"
                  fill="none"
                />
              </pattern>
            </defs>

            {/* Pattern Fill Band */}
            <rect x="0" y="4" width="600" height="32" fill="url(#tileableLacePattern)" />

            {/* Top Metallic Border Rule */}
            <line x1="20" y1="4" x2="580" y2="4" stroke="url(#laceGoldGradient)" strokeWidth="1" />
            <line
              x1="60"
              y1="7"
              x2="540"
              y2="7"
              stroke="url(#laceGoldGradient)"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />

            {/* Bottom Metallic Border Rule */}
            <line
              x1="60"
              y1="33"
              x2="540"
              y2="33"
              stroke="url(#laceGoldGradient)"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />
            <line x1="20" y1="36" x2="580" y2="36" stroke="url(#laceGoldGradient)" strokeWidth="1" />
          </svg>

          {/* Central Medallion Ornament */}
          {!isCompact && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-cream border border-gold/60 shadow-sm flex items-center justify-center rotate-45 transform">
                <div className="w-3.5 h-3.5 bg-gradient-to-br from-gold-metallic via-gold-shimmer to-gold-metallic rounded-sm opacity-90 shadow-xs" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
};

export default LaceDivider;
