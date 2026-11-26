'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { GoldFlourish } from '../common/GoldFlourish';
import { ASSETS } from '../../config/assets';
import { useLanguage } from '../../context/LanguageContext';



export const SectionClosing: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <footer
      id="section-closing"
      className="relative w-full min-h-[100dvh] py-6 sm:py-8 px-4 flex flex-col items-center justify-center paper-texture select-none overflow-hidden text-center bg-cream snap-start snap-always"
      dir={dir}
    >
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <img
          src={ASSETS.closingBg}
          alt=""
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-[420px] mx-auto flex flex-col items-center">
        {/* Gold Flourish */}
        <Reveal delay={0.1} className="w-full mb-3">
          <GoldFlourish />
        </Reveal>

        {/* Inscription */}
        <Reveal delay={0.25} className="mb-3 px-2">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#78550E] py-0.5 leading-relaxed max-w-[340px] mx-auto drop-shadow-xs">
            "{t.closing.inscription}"
          </h2>
        </Reveal>

        {/* Divider */}
        <Reveal delay={0.3} className="w-full my-2">
          <div className="flex items-center justify-center gap-3">
            <span className="h-[1px] w-14 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <span className="text-gold text-xs">✤</span>
            <span className="h-[1px] w-14 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          </div>
        </Reveal>

        {/* Blessings of families */}
        <Reveal delay={0.35} className="mb-2">
          <p className="text-xs sm:text-sm font-bold text-[#78550E]">
            {t.closing.familyBlessing}
          </p>
        </Reveal>

        {/* Couple Signature: Rahma & omar */}
        <Reveal delay={0.4} className="mb-1.5">
          <h1 className="font-ruqaa text-4xl sm:text-5xl text-gold-gradient py-0.5 drop-shadow-xs">
            {t.couple.bride} &amp; {t.couple.groom}
          </h1>
        </Reveal>

        {/* Date */}
        <Reveal delay={0.45} className="mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cream/90 border border-gold/40 shadow-xs">
            <span className="text-xs sm:text-sm font-bold text-taupe-dark">
              {t.closing.dateBadge}
            </span>
          </div>
        </Reveal>

        {/* Bottom Flourish */}
        <Reveal delay={0.5} className="w-full mb-3">
          <GoldFlourish flipped={true} />
        </Reveal>

        {/* Footer Credit */}
        <Reveal delay={0.55} className="w-full pt-3 border-t border-gold/25 space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-[#78550E] text-xs">
            <Heart className="w-3.5 h-3.5 text-rose fill-rose/30" />
            <span className="font-serif italic font-medium">{t.closing.gratitude}</span>
          </div>

          <p className="text-xs text-taupe-dark/80 font-bold">
            {t.closing.weddingOf}
          </p>

          <p className="text-[11px] text-taupe/60">
            {t.closing.rights}
          </p>
        </Reveal>
      </div>
    </footer>
  );
};

export default SectionClosing;
