'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ASSETS } from '../../config/assets';
import { useLanguage } from '../../context/LanguageContext';

interface AnimatedWordProps {
  word: string;
  startDelay?: number;
  className?: string;
  isRevealed?: boolean;
}

const AnimatedWord: React.FC<AnimatedWordProps> = ({
  word,
  startDelay = 0.4,
  className = '',
  isRevealed = true,
}) => {
  return (
    <span className={`inline-flex justify-center ${className}`}>
      {word.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={
            isRevealed
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 20, filter: 'blur(10px)' }
          }
          transition={{
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
            delay: isRevealed ? startDelay + index * 0.05 : 0,
          }}
          className="inline-block transform-gpu"
          style={{ willChange: 'transform, opacity, filter' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

interface FlyingDoveProps {
  initialX: number | string;
  targetX: number | string;
  yRange: number[];
  duration: number;
  delay: number;
  scale?: number;
  flip?: boolean;
  isRevealed?: boolean;
}

const FlyingDove: React.FC<FlyingDoveProps> = ({
  initialX,
  targetX,
  yRange,
  duration,
  delay,
  scale = 1,
  flip = false,
  isRevealed = true,
}) => {
  if (!isRevealed) return null;
  return (
    <motion.div
      initial={{ x: initialX, y: yRange[0], opacity: 0 }}
      animate={{
        x: [initialX, targetX],
        y: yRange,
        opacity: [0, 0.85, 0.9, 0.85, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
      style={{
        transform: `scale(${scale}) ${flip ? 'scaleX(-1)' : ''}`,
        willChange: 'transform, opacity',
      }}
      className="absolute top-12 pointer-events-none z-15"
    >
      <svg
        viewBox="0 0 42 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-6 filter drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)]"
      >
        <path
          d="M 3 16 
             C 8 13, 14 6, 23 2 
             C 21 8, 23 14, 29 14 
             C 35 14, 39 11, 41 9 
             C 38 15, 31 18, 26 18 
             C 23 23, 17 29, 13 29 
             C 15 25, 14 21, 10 21 
             C 6 21, 4 18, 3 16 Z"
          fill="#FFFFFF"
          fillOpacity="0.92"
        />
        <path
          d="M 12 16 C 18 10, 22 7, 26 5 C 24 9, 23 13, 21 16 Z"
          fill="#FFF4F1"
          fillOpacity="0.8"
        />
      </svg>
    </motion.div>
  );
};

const PARTICLES = [
  { id: 1, type: 'petal', left: '8%', delay: 0.2, duration: 8.5, size: 12 },
  { id: 2, type: 'sparkle', left: '18%', delay: 1.5, duration: 6.2, size: 5 },
  { id: 3, type: 'petal', left: '28%', delay: 3.1, duration: 9.0, size: 14 },
  { id: 4, type: 'sparkle', left: '38%', delay: 0.8, duration: 5.8, size: 4 },
  { id: 5, type: 'petal', left: '48%', delay: 4.2, duration: 8.0, size: 11 },
  { id: 6, type: 'sparkle', left: '58%', delay: 2.2, duration: 6.5, size: 6 },
  { id: 7, type: 'petal', left: '68%', delay: 1.0, duration: 9.5, size: 13 },
  { id: 8, type: 'sparkle', left: '78%', delay: 3.6, duration: 6.0, size: 5 },
  { id: 9, type: 'petal', left: '88%', delay: 2.7, duration: 8.2, size: 12 },
  { id: 10, type: 'petal', left: '16%', delay: 5.0, duration: 7.8, size: 10 },
  { id: 11, type: 'sparkle', left: '52%', delay: 4.8, duration: 5.5, size: 4 },
  { id: 12, type: 'petal', left: '82%', delay: 0.5, duration: 8.7, size: 13 },
];

interface SectionHeroProps {
  isRevealed?: boolean;
}

export const SectionHero: React.FC<SectionHeroProps> = ({ isRevealed = false }) => {
  const { t, isArabic, dir } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const scrollBgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const scrollContentY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const backgroundY = shouldReduceMotion ? '0%' : scrollBgY;
  const contentY = shouldReduceMotion ? '0%' : scrollContentY;
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const scrollToNext = () => {
    const nextSection = document.getElementById('section-event-cards');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="section-hero"
      className="relative w-full h-screen min-h-[640px] max-h-[960px] flex flex-col items-center justify-between text-center overflow-hidden select-none"
      dir={dir}
    >
      <motion.div
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                scale: 1.18,
                filter: 'blur(6px) brightness(1.4)',
              }
        }
        animate={
          isRevealed
            ? shouldReduceMotion
              ? { opacity: 1 }
              : {
                  opacity: 1,
                  scale: 1,
                  filter: 'blur(0px) brightness(1.0)',
                }
            : shouldReduceMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                scale: 1.18,
                filter: 'blur(6px) brightness(1.4)',
              }
        }
        transition={{
          duration: shouldReduceMotion ? 0.6 : 1.4,
          ease: [0.25, 1, 0.5, 1],
        }}
        style={{
          transformOrigin: '50% 35%',
          willChange: 'transform, opacity, filter',
        }}
        className="relative w-full h-full flex flex-col items-center justify-between px-6 py-10"
      >
        {/* 1. Background */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 w-full h-[120%] -top-[10%] bg-cover bg-center pointer-events-none z-0"
        >
          <img
            src={ASSETS.heroBg}
            alt="خلفية زفاف مائية"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center filter brightness-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-sky/15 via-transparent to-blush/30 pointer-events-none" />
        </motion.div>

        {/* 2. Light flare */}
        {!shouldReduceMotion && (
          <div className="absolute -top-24 -right-24 w-[380px] h-[380px] sm:w-[500px] sm:h-[500px] pointer-events-none overflow-hidden z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={
                isRevealed
                  ? {
                      opacity: [0, 0.8, 0.5],
                      rotate: [0, 360],
                    }
                  : { opacity: 0 }
              }
              transition={{
                opacity: {
                  duration: 1.8,
                  delay: 0.3,
                  times: [0, 0.45, 1],
                  ease: 'easeOut',
                },
                rotate: {
                  duration: 75,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
              style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background:
                  'conic-gradient(from 135deg at 75% 25%, rgba(255, 238, 179, 0.6) 0deg, transparent 18deg, rgba(255, 248, 220, 0.75) 35deg, transparent 55deg, rgba(255, 225, 140, 0.5) 75deg, transparent 95deg, rgba(255, 245, 210, 0.7) 120deg, transparent 145deg, rgba(255, 230, 160, 0.5) 175deg, transparent 205deg, rgba(255, 240, 190, 0.65) 235deg, transparent 265deg, rgba(255, 225, 140, 0.5) 295deg, transparent 325deg, rgba(255, 245, 210, 0.65) 350deg, transparent 360deg)',
                filter: 'blur(8px)',
                mixBlendMode: 'screen',
                transformOrigin: '75% 25%',
                willChange: 'transform, opacity',
              }}
            />
          </div>
        )}

        {/* 3. Flying Doves */}
        {!shouldReduceMotion && (
          <>
            <FlyingDove
              initialX="-50px"
              targetX="480px"
              yRange={[25, 12, 32, 18, 28]}
              duration={16}
              delay={0.3}
              scale={0.9}
              isRevealed={isRevealed}
            />
            <FlyingDove
              initialX="-85px"
              targetX="480px"
              yRange={[45, 60, 38, 55, 42]}
              duration={19}
              delay={1.3}
              scale={0.75}
              isRevealed={isRevealed}
            />
          </>
        )}

        {/* 4. Floating Particles */}
        {!shouldReduceMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {PARTICLES.map((p) => (
              <motion.div
                key={p.id}
                initial={{
                  y: '-10%',
                  x: 0,
                  opacity: 0,
                  rotate: 0,
                }}
                animate={
                  isRevealed
                    ? {
                        y: ['0%', '110%'],
                        x: [0, p.id % 2 === 0 ? 25 : -25, 0],
                        opacity: [0, 0.75, 0.85, 0.6, 0],
                        rotate: [0, 180, 360],
                      }
                    : { opacity: 0 }
                }
                transition={{
                  duration: p.duration,
                  delay: isRevealed ? p.delay + 0.3 : 0,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: p.left,
                  willChange: 'transform, opacity',
                }}
              >
                {p.type === 'petal' ? (
                  <svg
                    width={p.size}
                    height={p.size * 1.3}
                    viewBox="0 0 20 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="opacity-75 drop-shadow-xs"
                  >
                    <path
                      d="M10 0 C16 4, 20 12, 17 20 C14 26, 6 26, 3 20 C0 12, 4 4, 10 0 Z"
                      fill="#F4C2C6"
                      fillOpacity="0.8"
                    />
                  </svg>
                ) : (
                  <div
                    style={{
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                    }}
                    className="rounded-full bg-gold-shimmer shadow-[0_0_8px_#F1D98B] opacity-80"
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* 5. Foreground Content */}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-20 w-full flex flex-col items-center justify-between h-full pt-3 pb-2"
        >
          {/* Top Block */}
          <div className="flex flex-col items-center w-full max-w-sm px-4">
            <motion.span
              initial={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
              animate={
                isRevealed
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : { opacity: 0, y: -16, filter: 'blur(8px)' }
              }
              transition={{
                duration: 0.6,
                delay: isRevealed ? 0.3 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ willChange: 'transform, opacity, filter' }}
              className="font-amiri text-lg sm:text-xl text-white font-bold select-none tracking-wide drop-shadow-[0_0_14px_rgba(255,255,255,0.85)] drop-shadow-[0_2px_4px_rgba(78,62,55,0.4)] block mb-0.5"
            >
              {t.bismillah.arabic}
            </motion.span>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={
                isRevealed
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 10 }
              }
              transition={{
                duration: 0.6,
                delay: isRevealed ? 0.8 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ willChange: 'transform, opacity' }}
              className="text-xs sm:text-sm font-semibold text-white/95 drop-shadow-[0_1px_4px_rgba(78,62,55,0.5)]"
            >
              {t.hero.blessing}
            </motion.p>

            {/* Verse */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={
                isRevealed
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.95 }
              }
              transition={{
                duration: 0.7,
                delay: isRevealed ? 0.55 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ willChange: 'transform, opacity' }}
              className="mt-1.5 px-4 py-1.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/40 shadow-sm text-center max-w-sm"
            >
              <p
                className="font-serif text-xs sm:text-sm text-white font-bold leading-relaxed tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] select-none"
              >
                {t.bismillah.verse}
              </p>
              <span className="block text-[11px] text-white/90 font-medium tracking-wider mt-0.5">
                {t.bismillah.surahReference}
              </span>
            </motion.div>

            {/* Couple Names */}
            <div className="mt-3 flex flex-col items-center transform-gpu">
              <h1 className="font-script text-4xl sm:text-5xl md:text-6xl text-white tracking-wide py-0 drop-shadow-[0_4px_18px_rgba(255,255,255,0.9)] drop-shadow-[0_2px_8px_rgba(78,62,55,0.4)] leading-tight">
                <AnimatedWord
                  word={t.couple.bride}
                  startDelay={0.35}
                  isRevealed={isRevealed}
                />
              </h1>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(6px)' }}
                animate={
                  isRevealed
                    ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
                    : { opacity: 0, scale: 0.8, filter: 'blur(6px)' }
                }
                transition={{
                  duration: 0.5,
                  delay: isRevealed ? 0.55 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ willChange: 'transform, opacity, filter' }}
                className="flex items-center justify-center -my-1"
              >
                <span className="h-[1px] w-8 bg-white/60 drop-shadow-xs" />
                <span className="mx-2 font-serif italic text-base sm:text-lg text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]">
                  &amp;
                </span>
                <span className="h-[1px] w-8 bg-white/60 drop-shadow-xs" />
              </motion.div>

              <h1 className="font-script text-4xl sm:text-5xl md:text-6xl text-white tracking-wide py-0 drop-shadow-[0_4px_18px_rgba(255,255,255,0.9)] drop-shadow-[0_2px_8px_rgba(78,62,55,0.4)] leading-tight">
                <AnimatedWord
                  word={t.couple.groom}
                  startDelay={0.75}
                  isRevealed={isRevealed}
                />
              </h1>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={
                  isRevealed
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 10 }
                }
                transition={{
                  duration: 0.6,
                  delay: isRevealed ? 1.0 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ willChange: 'transform, opacity' }}
                className="mt-2 px-4 py-1 rounded-full bg-cream/90 backdrop-blur-xs border border-white/60 shadow-xs"
              >
                <p className="text-xs sm:text-sm font-bold text-taupe-dark">
                  {t.weddingDateFormatted}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Bottom Inscription & Scroll-Down Chevron */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={
              isRevealed
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 15 }
            }
            transition={{
              duration: 0.7,
              delay: isRevealed ? 1.8 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{ willChange: 'transform, opacity' }}
            className="flex flex-col items-center gap-3 pb-2"
          >
            <p className="text-xs sm:text-sm text-white font-medium max-w-xs leading-relaxed drop-shadow-[0_1px_4px_rgba(78,62,55,0.6)]">
              {t.hero.invitationLine}
            </p>

            <button
              onClick={scrollToNext}
              type="button"
              className="group flex flex-col items-center cursor-pointer mt-1 focus:outline-none min-h-[44px] min-w-[44px] justify-center"
              aria-label={t.hero.scrollHint}
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 2.0,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs border border-white/40 flex items-center justify-center text-white shadow-xs group-hover:bg-white/30 transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </motion.div>
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SectionHero;
