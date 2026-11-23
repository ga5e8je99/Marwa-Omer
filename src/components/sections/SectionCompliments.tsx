import React from 'react';
import { motion } from 'framer-motion';
import { Reveal } from '../common/Reveal';
import { GoldFlourish } from '../common/GoldFlourish';
import { INVITATION_DATA } from '../../data/invitation';

// Four-point Gold Star Ornament
const FourPointStar: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-2xs ${className}`}
  >
    <path
      d="M12 2 Q12 12 2 12 Q12 12 12 22 Q12 12 22 12 Q12 12 12 2 Z"
      fill="url(#starGold)"
    />
    <defs>
      <linearGradient id="starGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#B8913A" />
        <stop offset="50%" stopColor="#F1D98B" />
        <stop offset="100%" stopColor="#B8913A" />
      </linearGradient>
    </defs>
  </svg>
);

export const SectionCompliments: React.FC = () => {
  return (
    <section
      id="section-compliments"
      className="relative py-18 px-5 sm:px-6 paper-texture bg-gradient-to-b from-cream via-[#FFFBF5] to-cream select-none overflow-hidden text-center"
    >
      {/* Background Ambient Warmth */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gold/15 blur-[90px]" />
      </div>

      <div className="relative z-10 max-w-[420px] mx-auto">
        {/* Top Ornate Gold Flourish */}
        <Reveal delay={0.05} className="mb-4">
          <GoldFlourish />
        </Reveal>

        {/* Section Heading */}
        <Reveal delay={0.1} className="mb-10">
          <span className="font-cinzel text-xs tracking-loose-tracked text-gold uppercase block mb-1">
            With Love From
          </span>
          <h2 className="font-script text-5xl sm:text-6xl text-taupe-dark">
            Best Compliments
          </h2>
          <p className="font-serif italic text-xs sm:text-sm text-taupe/80 mt-1 max-w-xs mx-auto">
            Honoured wishes, endless love, and blessings from our families
          </p>
        </Reveal>

        {/* Stack of Frosted, Rounded Rectangular Cards with Staggered Fade-Up */}
        <div className="space-y-4 mb-10">
          {INVITATION_DATA.compliments.map((family, idx) => (
            <motion.div
              key={family.name}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.85,
                delay: 0.12 * (idx + 1),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative rounded-2xl border border-gold/45 bg-cream/85 backdrop-blur-md p-5 sm:p-6 shadow-paper hover:shadow-soft-float transition-all duration-300 overflow-hidden flex flex-col items-center justify-center group"
            >
              {/* Subtle Inner Highlight */}
              <div className="absolute inset-1.5 rounded-xl border border-gold/20 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

              {/* Family Name in Tracked Uppercase Serif */}
              <h3 className="font-cinzel text-sm sm:text-base tracking-loose-tracked text-taupe-dark uppercase font-semibold group-hover:text-gold-dark transition-colors">
                {family.name.toUpperCase()}
              </h3>

              {/* Subtitle / Relation */}
              <p className="font-serif italic text-xs text-taupe/70 mt-1">
                {family.relation}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Small Gold Four-Point Star Ornament Between List & Quote */}
        <Reveal delay={0.4} className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold/50" />
            <FourPointStar />
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold/50" />
          </div>
        </Reveal>

        {/* Italic Closing Message Below Cards */}
        <Reveal delay={0.45} className="mb-8">
          <p className="font-serif italic text-sm sm:text-base text-taupe leading-relaxed max-w-[340px] mx-auto">
            "May the warmth of family, the heartfelt prayers of our elders, and the boundless grace of the Almighty illuminate every step of their journey."
          </p>
        </Reveal>

        {/* Bottom Ornate Gold Flourish */}
        <Reveal delay={0.5}>
          <GoldFlourish flipped={true} />
        </Reveal>
      </div>
    </section>
  );
};

export default SectionCompliments;
