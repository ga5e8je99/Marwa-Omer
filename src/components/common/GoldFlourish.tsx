import React from 'react';

interface GoldFlourishProps {
  className?: string;
  flipped?: boolean;
}

export const GoldFlourish: React.FC<GoldFlourishProps> = ({
  className = '',
  flipped = false,
}) => {
  return (
    <div
      className={`w-full max-w-[280px] mx-auto flex items-center justify-center select-none pointer-events-none ${
        flipped ? 'rotate-180' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 280 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-2xs"
      >
        <defs>
          <linearGradient id="flourishGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8913A" stopOpacity="0.1" />
            <stop offset="25%" stopColor="#C9A24B" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F1D98B" />
            <stop offset="75%" stopColor="#C9A24B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#B8913A" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Center Medallion Diamond */}
        <path
          d="M 140 8 L 145 16 L 140 24 L 135 16 Z"
          fill="url(#flourishGold)"
        />
        <circle cx="140" cy="16" r="2" fill="#FFF8F3" />

        {/* Left Side Arabesque Filigree Scroll */}
        <path
          d="M 132 16 C 115 16, 100 8, 85 10 C 70 12, 60 24, 45 20 C 35 17, 25 21, 10 16"
          stroke="url(#flourishGold)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M 105 13 C 95 19, 82 22, 70 17"
          stroke="url(#flourishGold)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <circle cx="85" cy="10" r="1.8" fill="#F1D98B" />
        <circle cx="45" cy="20" r="1.5" fill="#F1D98B" />

        {/* Right Side Symmetrical Arabesque Filigree Scroll */}
        <path
          d="M 148 16 C 165 16, 180 8, 195 10 C 210 12, 220 24, 235 20 C 245 17, 255 21, 270 16"
          stroke="url(#flourishGold)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M 175 13 C 185 19, 198 22, 210 17"
          stroke="url(#flourishGold)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <circle cx="195" cy="10" r="1.8" fill="#F1D98B" />
        <circle cx="235" cy="20" r="1.5" fill="#F1D98B" />
      </svg>
    </div>
  );
};

export default GoldFlourish;
