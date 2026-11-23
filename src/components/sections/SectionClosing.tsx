import React from 'react';
import { Heart } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { GoldFlourish } from '../common/GoldFlourish';
import { ASSETS } from '../../config/assets';
import { INVITATION_DATA } from '../../data/invitation';

// Small Gold Sparkle Star
const SparkleStar: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="filter drop-shadow-[0_0_8px_rgba(241,217,139,0.7)]"
  >
    <path
      d="M12 1 Q12 12 1 12 Q12 12 12 23 Q12 12 23 12 Q12 12 12 1 Z"
      fill="url(#closingStarGold)"
    />
    <defs>
      <linearGradient id="closingStarGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#B8913A" />
        <stop offset="50%" stopColor="#F1D98B" />
        <stop offset="100%" stopColor="#B8913A" />
      </linearGradient>
    </defs>
  </svg>
);

export const SectionClosing: React.FC = () => {
  return (
    <footer
      id="section-closing"
      className="relative pt-16 pb-12 px-6 paper-texture select-none overflow-hidden text-center bg-cream"
    >
      {/* Warm Gold/Cream Watercolor Background Wash */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <img
          src={ASSETS.closingBg}
          alt="Warm golden closing wash"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-[420px] mx-auto flex flex-col items-center">
        {/* Gold Flourish at the Top */}
        <Reveal delay={0.1} className="w-full mb-6">
          <GoldFlourish />
        </Reveal>

        {/* Small Gold Sparkle Star in the Middle */}
        <Reveal delay={0.2} className="mb-4">
          <div className="w-10 h-10 rounded-full bg-cream/80 border border-gold/40 flex items-center justify-center shadow-xs">
            <SparkleStar />
          </div>
        </Reveal>

        {/* Script Inscription */}
        <Reveal delay={0.25} className="mb-6 px-2">
          <h2 className="font-script text-3xl sm:text-4xl text-gold-gradient py-1 leading-snug max-w-[340px] mx-auto drop-shadow-xs">
            "We cannot wait to celebrate this beautiful occasion with your presence, love, and blessings."
          </h2>
        </Reveal>

        {/* Thin Divider */}
        <Reveal delay={0.3} className="w-full my-3">
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-16 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <span className="text-gold text-xs">✤</span>
            <span className="h-[1px] w-16 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          </div>
        </Reveal>

        {/* Tiny Caps: WITH THE BLESSINGS OF THEIR FAMILIES */}
        <Reveal delay={0.35} className="mb-4">
          <p className="font-cinzel text-[10px] sm:text-[11px] tracking-loose-tracked text-gold-dark uppercase font-semibold">
            With The Blessings of Their Families
          </p>
        </Reveal>

        {/* Script Signature: Marwa & Omer */}
        <Reveal delay={0.4} className="mb-1">
          <h1 className="font-script text-5xl sm:text-6xl text-gold-gradient py-0.5 drop-shadow-xs">
            {INVITATION_DATA.couple.bride.firstName} &amp; {INVITATION_DATA.couple.groom.firstName}
          </h1>
        </Reveal>

        {/* Date: 12 · 10 · 2026 */}
        <Reveal delay={0.45} className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cream/70 border border-gold/30">
            <span className="font-cinzel text-xs tracking-loose-tracked text-taupe-dark font-medium">
              12 · 10 · 2026
            </span>
          </div>
        </Reveal>

        {/* Bottom Ornamental Floral flourish */}
        <Reveal delay={0.5} className="w-full mb-10">
          <GoldFlourish flipped={true} />
        </Reveal>

        {/* Footer Credit at the Very Bottom */}
        <Reveal delay={0.55} className="w-full pt-8 border-t border-gold/25 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-gold-dark/80 text-xs">
            <Heart className="w-3.5 h-3.5 text-rose fill-rose/30" />
            <span className="font-serif italic text-taupe/70">With love &amp; gratitude</span>
          </div>

          <p className="font-cinzel text-[10px] tracking-loose-tracked text-taupe-dark uppercase font-semibold">
            DESIGNED BY [STUDIO NAME]
          </p>

          <p className="font-cinzel text-[9px] tracking-wider text-taupe/60 uppercase">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              @yourstudioname
            </a>{' '}
            • All Rights Reserved
          </p>
        </Reveal>
      </div>
    </footer>
  );
};

export default SectionClosing;
