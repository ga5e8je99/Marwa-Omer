'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { ASSETS } from '../../config/assets';
import { useLanguage } from '../../context/LanguageContext';

interface HangingLanternProps {
  align?: 'left' | 'right';
  delay?: number;
}

const HangingLantern: React.FC<HangingLanternProps> = ({
  align = 'left',
  delay = 0,
}) => {
  return (
    <motion.div
      style={{ transformOrigin: 'top center' }}
      animate={{
        rotate: align === 'left' ? [-3, 3, -3] : [3, -3, 3],
      }}
      transition={{
        duration: 4.0,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className={`absolute top-0 ${
        align === 'left' ? 'left-6' : 'right-6'
      } pointer-events-none z-20 flex flex-col items-center select-none`}
    >
      <div className="w-[1.2px] h-7 bg-gradient-to-b from-gold-metallic via-gold-shimmer to-gold-dark opacity-80" />
      <div className="w-2 h-2 rounded-full border border-gold bg-cream/40 shadow-2xs -mt-0.5" />

      <svg
        width="26"
        height="38"
        viewBox="0 0 26 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_2px_6px_rgba(201,162,75,0.35)]"
      >
        <defs>
          <radialGradient
            id={`lanternLight-${align}`}
            cx="50%"
            cy="45%"
            r="55%"
          >
            <stop offset="0%" stopColor="#FFFDF0" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#F8E5A7" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#C9A24B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#9A772C" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        <path
          d="M 13 2 L 19 9 L 7 9 Z"
          fill="#B8913A"
          stroke="#7A5618"
          strokeWidth="0.8"
        />

        <polygon
          points="7,9 19,9 22,25 13,32 4,25"
          fill={`url(#lanternLight-${align})`}
          stroke="#8D6B26"
          strokeWidth="0.9"
        />

        <line
          x1="13"
          y1="9"
          x2="13"
          y2="32"
          stroke="#8D6B26"
          strokeWidth="0.8"
          opacity="0.65"
        />
        <line
          x1="7"
          y1="9"
          x2="4"
          y2="25"
          stroke="#8D6B26"
          strokeWidth="0.8"
          opacity="0.65"
        />
        <line
          x1="19"
          y1="9"
          x2="22"
          y2="25"
          stroke="#8D6B26"
          strokeWidth="0.8"
          opacity="0.65"
        />

        <circle cx="13" cy="18" r="3.2" fill="#FFF2BD" opacity="0.9" />
        <circle cx="13" cy="34" r="1.5" fill="#B8913A" />
        <line
          x1="13"
          y1="34"
          x2="13"
          y2="38"
          stroke="#B8913A"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
};

export const SectionEventCards: React.FC = () => {
  const { t, dir } = useLanguage();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 5, y: -y * 5 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const googleMapsUrl = 'https://maps.google.com/?q=Royal+Hall+Ismailia+Egypt';

  return (
    <section
      id="section-event-cards"
      className="relative py-16 px-6 paper-texture bg-cream"
      dir={dir}
    >
      <div className="max-w-[420px] mx-auto text-center">
        {/* Section Heading */}
        <Reveal delay={0.1} className="mb-10">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-[#78550E] uppercase block mb-1">
            {t.event.tag}
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-taupe-dark mb-2">
            {t.event.title}
          </h2>
          <p className="font-serif italic text-sm sm:text-base text-taupe-dark/80 max-w-xs mx-auto leading-relaxed">
            {t.event.description}
          </p>
        </Reveal>

        {/* Wedding Event Card */}
        <motion.div
          initial={{ opacity: 0, y: 38, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{
            rotateY: tilt.x,
            rotateX: tilt.y,
          }}
          style={{ perspective: '1000px' }}
          className="relative w-full max-w-[400px] mx-auto rounded-[28px] overflow-hidden shadow-soft-float border border-gold/40 paper-texture bg-cream transition-shadow hover:shadow-gold-glow duration-500"
        >
          {/* Background Illustration */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <img
              src={ASSETS.cardNikkah}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover filter brightness-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-cream/60 via-cream/80 to-cream pointer-events-none" />
          </div>

          <HangingLantern align="left" delay={0} />
          <HangingLantern align="right" delay={1.5} />

          <div className="absolute inset-2.5 rounded-[22px] border border-gold/25 pointer-events-none" />

          {/* Card Body */}
          <div className="relative z-10 pt-10 pb-8 px-6 sm:px-8 text-center flex flex-col items-center">
            <div className="relative w-full rounded-t-[140px] rounded-b-2xl border border-gold/50 bg-cream/90 backdrop-blur-xs p-6 pt-9 shadow-paper flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-cream border border-gold/60 flex items-center justify-center mb-1">
                <span className="text-xs text-gold-metallic">✦</span>
              </div>

              <h3 className="font-serif font-bold text-3xl sm:text-4xl text-[#78550E] py-1 mb-1">
                {t.event.title}
              </h3>

              <p className="font-serif italic text-sm text-taupe-dark/85 max-w-[280px] leading-relaxed mb-6">
                "{t.event.description}"
              </p>

              <div className="w-full space-y-4 pt-3 border-t border-gold/25">
                {/* DATE */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-[#78550E] uppercase">
                    {t.event.dateLabel}
                  </span>
                  <p className="text-sm sm:text-base font-semibold text-taupe-dark mt-0.5">
                    {t.weddingDateFormatted}
                  </p>
                </div>

                {/* TIME */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-[#78550E] uppercase">
                    {t.event.timeLabel}
                  </span>
                  <p className="text-sm sm:text-base font-bold text-taupe-dark mt-0.5">
                    {t.timeFormatted}
                  </p>
                </div>

                {/* VENUE */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold text-[#78550E] uppercase">
                    {t.event.venueLabel}
                  </span>
                  <p className="text-sm sm:text-base font-bold text-taupe-dark mt-0.5">
                    {t.event.venueName}
                  </p>
                  <p className="text-xs sm:text-sm text-taupe-dark/80 mt-0.5 select-text">
                    {t.event.venueAddress}
                  </p>
                </div>

                {/* ATTIRE */}
                <div className="pt-2 flex items-center justify-center gap-1.5 text-xs sm:text-sm text-[#78550E] font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                  <span>
                    {t.event.attireLabel}: {t.event.attireValue}
                  </span>
                </div>
              </div>

              {/* Map Button */}
              <div className="mt-6 w-full flex justify-center">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-full border border-gold/60 bg-cream/95 hover:bg-blush-50 text-taupe-dark hover:text-gold-dark text-xs sm:text-sm font-bold shadow-xs hover:shadow-gold-glow hover:border-gold transition-all duration-300 cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                  <span>{t.event.mapButton}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-taupe/60 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SectionEventCards;
