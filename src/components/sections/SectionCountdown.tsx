'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { LaceDivider } from '../common/LaceDivider';
import { ASSETS } from '../../config/assets';
import { useLanguage } from '../../context/LanguageContext';

const ScallopedCircle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-[72px] sm:w-[84px] h-[72px] sm:h-[84px] flex items-center justify-center select-none">
      <svg
        viewBox="0 0 80 80"
        className="absolute inset-0 w-full h-full filter drop-shadow-[0_4px_10px_rgba(201,162,75,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="scallopFill" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#FFF9F5" />
            <stop offset="92%" stopColor="#F8EDE7" />
            <stop offset="100%" stopColor="#EED9C7" />
          </radialGradient>

          <radialGradient id="innerLuster" cx="50%" cy="50%" r="48%">
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="95%" stopColor="#F1D98B" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#B8913A" stopOpacity="0.3" />
          </radialGradient>
        </defs>

        <path
          d="M 73.0 40.0 A 10 10 0 0 1 68.58 56.5 A 10 10 0 0 1 56.5 68.58 A 10 10 0 0 1 40.0 73.0 A 10 10 0 0 1 23.5 68.58 A 10 10 0 0 1 11.42 56.5 A 10 10 0 0 1 7.0 40.0 A 10 10 0 0 1 11.42 23.5 A 10 10 0 0 1 23.5 11.42 A 10 10 0 0 1 40.0 7.0 A 10 10 0 0 1 56.5 11.42 A 10 10 0 0 1 68.58 23.5 A 10 10 0 0 1 73.0 40.0 Z"
          fill="url(#scallopFill)"
          stroke="#C9A24B"
          strokeWidth="1.2"
        />

        <circle cx="40" cy="40" r="30" fill="url(#innerLuster)" />

        <circle
          cx="40"
          cy="40"
          r="27"
          fill="none"
          stroke="#C9A24B"
          strokeWidth="0.6"
          strokeDasharray="2.5,2.5"
          strokeOpacity="0.45"
        />
      </svg>

      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPassed: boolean;
}

export const SectionCountdown: React.FC = () => {
  const { t, dir } = useLanguage();
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    const targetTime = new Date(t.targetDateISO).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPassed: true,
        });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({
          days,
          hours,
          minutes,
          seconds,
          isPassed: false,
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [t.targetDateISO]);

  const countdownUnits = [
    { label: t.countdown.days, value: timeRemaining.days },
    { label: t.countdown.hours, value: timeRemaining.hours },
    { label: t.countdown.minutes, value: timeRemaining.minutes },
    { label: t.countdown.seconds, value: timeRemaining.seconds },
  ];

  return (
    <div className="relative w-full">
      <LaceDivider variant="subtle" />

      <section
        id="section-countdown"
        className="relative py-14 px-4 sm:px-6 paper-texture bg-cream overflow-hidden text-center select-none"
        aria-label={t.countdown.title}
        dir={dir}
      >
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <img
            src={ASSETS.stripLandscape}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover filter blur-[2px]"
          />
        </div>

        <div className="relative z-10 max-w-[420px] mx-auto">
          {/* Header */}
          <Reveal delay={0.1} className="mb-8">
            <span className="text-xs sm:text-sm font-bold tracking-wider text-[#78550E] uppercase block mb-1">
              {t.countdown.tag}
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-taupe-dark">
              {t.countdown.title}
            </h2>
            <div className="flex items-center justify-center mt-2">
              <span className="h-[1px] w-16 bg-gold/40" />
            </div>
          </Reveal>

          {/* Conditional Display */}
          {timeRemaining.isPassed ? (
            <Reveal delay={0.2}>
              <div className="border border-gold/45 rounded-3xl p-7 bg-cream/95 backdrop-blur-xs shadow-paper space-y-3">
                <div className="w-14 h-14 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto text-[#78550E]">
                  <Heart className="w-7 h-7 fill-gold/25" />
                </div>
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#78550E] py-0.5">
                  {t.countdown.passedTitle}
                </h3>
                <p className="text-sm sm:text-base text-taupe-dark max-w-xs mx-auto leading-relaxed font-medium">
                  {t.countdown.passedDesc}
                </p>
                <p className="text-xs sm:text-sm font-bold text-[#78550E] pt-2">
                  {t.countdown.passedFooter}
                </p>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={0.2}>
              <div className="flex items-center justify-center gap-3 sm:gap-4 py-2">
                {countdownUnits.map((unit) => (
                  <div key={unit.label} className="flex flex-col items-center">
                    <ScallopedCircle>
                      <div className="relative h-8 sm:h-9 w-12 flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="popLayout">
                          <motion.span
                            key={unit.value}
                            initial={{ y: 16, opacity: 0, filter: 'blur(3px)' }}
                            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                            exit={{ y: -16, opacity: 0, filter: 'blur(3px)' }}
                            transition={{
                              duration: 0.35,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="font-serif font-bold text-2xl sm:text-3xl text-[#78550E] select-none leading-none"
                          >
                            {String(unit.value).padStart(2, '0')}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </ScallopedCircle>

                    <span className="text-xs sm:text-sm font-bold text-taupe-dark mt-2">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Target Line */}
              <p className="font-semibold text-xs sm:text-sm text-taupe-dark/85 mt-6">
                {t.countdown.targetLine}
              </p>
            </Reveal>
          )}
        </div>
      </section>

      <LaceDivider variant="subtle" />
    </div>
  );
};

export default SectionCountdown;
