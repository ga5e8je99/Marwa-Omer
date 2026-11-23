import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { LaceDivider } from '../common/LaceDivider';
import { INVITATION_DATA } from '../../data/invitation';
import { ASSETS } from '../../config/assets';

// 12-Lobed Scalloped (Cloud-Edged) Circle SVG
const ScallopedCircle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-[70px] sm:w-[82px] h-[70px] sm:h-[82px] flex items-center justify-center select-none">
      {/* SVG Scalloped Medallion Background */}
      <svg
        viewBox="0 0 80 80"
        className="absolute inset-0 w-full h-full filter drop-shadow-[0_4px_10px_rgba(201,162,75,0.2)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Soft Cream Radial Gradient with Golden Edge */}
          <radialGradient id="scallopFill" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#FFF9F5" />
            <stop offset="92%" stopColor="#F8EDE7" />
            <stop offset="100%" stopColor="#EED9C7" />
          </radialGradient>

          {/* Inner Glow Highlight */}
          <radialGradient id="innerLuster" cx="50%" cy="50%" r="48%">
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="95%" stopColor="#F1D98B" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#B8913A" stopOpacity="0.3" />
          </radialGradient>
        </defs>

        {/* 12-lobed Cloud/Scallop Perimeter */}
        <path
          d="M 73.0 40.0 A 10 10 0 0 1 68.58 56.5 A 10 10 0 0 1 56.5 68.58 A 10 10 0 0 1 40.0 73.0 A 10 10 0 0 1 23.5 68.58 A 10 10 0 0 1 11.42 56.5 A 10 10 0 0 1 7.0 40.0 A 10 10 0 0 1 11.42 23.5 A 10 10 0 0 1 23.5 11.42 A 10 10 0 0 1 40.0 7.0 A 10 10 0 0 1 56.5 11.42 A 10 10 0 0 1 68.58 23.5 A 10 10 0 0 1 73.0 40.0 Z"
          fill="url(#scallopFill)"
          stroke="#C9A24B"
          strokeWidth="1.2"
        />

        {/* Inner Luster Highlight Ring */}
        <circle cx="40" cy="40" r="30" fill="url(#innerLuster)" />

        {/* Subtle Inner Dotted Guide */}
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

      {/* Centered Flipping Number */}
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
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    // 12 Oct 2026 4:00 PM from data file
    const targetTime = new Date(INVITATION_DATA.targetDateISO).getTime();

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
  }, []);

  const countdownUnits = [
    { label: 'DAYS', value: timeRemaining.days },
    { label: 'HOURS', value: timeRemaining.hours },
    { label: 'MINUTES', value: timeRemaining.minutes },
    { label: 'SECONDS', value: timeRemaining.seconds },
  ];

  return (
    <div className="relative w-full">
      {/* Top Gold Lace Band */}
      <LaceDivider variant="subtle" />

      {/* Main Countdown Section */}
      <section
        id="section-countdown"
        className="relative py-14 px-4 sm:px-6 paper-texture bg-cream overflow-hidden text-center select-none"
      >
        {/* Faint Watercolor Landscape Background Underlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <img
            src={ASSETS.stripLandscape}
            alt="Muted landscape background"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover filter blur-[2px]"
          />
        </div>

        <div className="relative z-10 max-w-[420px] mx-auto">
          {/* Header */}
          <Reveal delay={0.1} className="mb-8">
            <span className="font-cinzel text-xs tracking-loose-tracked text-gold uppercase block mb-1">
              Until The Wedding Day
            </span>
            <h2 className="font-script text-4xl sm:text-5xl text-taupe-dark">
              Counting Down
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1.5">
              <span className="h-[1px] w-8 bg-gold/40" />
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="h-[1px] w-8 bg-gold/40" />
            </div>
          </Reveal>

          {/* Conditional Display: Countdown or Past Celebration Message */}
          {timeRemaining.isPassed ? (
            /* Passed Date State: Today we celebrate / Alhamdulillah, we are married */
            <Reveal delay={0.2}>
              <div className="border border-gold/45 rounded-2xl p-7 bg-cream/95 backdrop-blur-xs shadow-paper space-y-3">
                <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto text-gold">
                  <Heart className="w-6 h-6 fill-gold/20" />
                </div>
                <h3 className="font-script text-4xl text-gold-gradient py-0.5">
                  Alhamdulillah, We Are Married
                </h3>
                <p className="font-serif italic text-sm text-taupe max-w-xs mx-auto leading-relaxed">
                  "Today we celebrate this blessed union surrounded by love, warmth, and prayers."
                </p>
                <p className="font-cinzel text-[11px] tracking-loose-tracked text-gold-dark uppercase pt-2">
                  12 October 2026 • Insha'Allah
                </p>
              </div>
            </Reveal>
          ) : (
            /* Live 4 Scalloped Circles */
            <Reveal delay={0.2}>
              <div className="flex items-center justify-center gap-2.5 sm:gap-4 py-2">
                {countdownUnits.map((unit) => (
                  <div key={unit.label} className="flex flex-col items-center">
                    {/* Scalloped (Cloud-Edged) Circle Container */}
                    <ScallopedCircle>
                      {/* Vertical Flip / Slide Animation on change */}
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
                            className="font-serif font-bold text-2xl sm:text-3xl text-gold-metallic select-none leading-none"
                          >
                            {String(unit.value).padStart(2, '0')}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </ScallopedCircle>

                    {/* Tiny Tracked Label Below */}
                    <span className="font-cinzel text-[9px] sm:text-[10px] tracking-loose-tracked text-taupe-dark uppercase mt-2 font-semibold">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Ceremony Target Date Line */}
              <p className="font-serif italic text-xs text-taupe/70 mt-6">
                Monday, 12th of October 2026 · 4:00 PM
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* Bottom Gold Lace Band */}
      <LaceDivider variant="subtle" />
    </div>
  );
};

export default SectionCountdown;
