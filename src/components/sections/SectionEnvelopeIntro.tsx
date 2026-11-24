'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ASSETS } from '../../config/assets';
import { useLanguage } from '../../context/LanguageContext';

interface SectionEnvelopeIntroProps {
  onOpenStart?: () => void;
  onRevealHero?: () => void;
  onOpenComplete?: () => void;
}

export const SectionEnvelopeIntro: React.FC<SectionEnvelopeIntroProps> = ({
  onOpenStart,
  onRevealHero,
  onOpenComplete,
}) => {
  const { t, isArabic, dir } = useLanguage();
  const [phase, setPhase] = useState<'closed' | 'opening' | 'rising' | 'expanding' | 'done'>('closed');
  const [hasInteracted, setHasInteracted] = useState(false);
  const interactionLockRef = useRef(false);

  // Prevent scroll during envelope phase
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
    };
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleOpen = () => {
    if (interactionLockRef.current) return;
    interactionLockRef.current = true;
    setHasInteracted(true);

    if (onOpenStart) {
      onOpenStart();
    }

    setPhase('opening');

    setTimeout(() => {
      setPhase('rising');
    }, 650);

    setTimeout(() => {
      setPhase('expanding');
      if (onRevealHero) {
        onRevealHero();
      }
    }, 1650);

    setTimeout(() => {
      setPhase('done');
      if (onOpenComplete) {
        onOpenComplete();
      }
    }, 2700);
  };

  if (phase === 'done') return null;

  const isFlapOpen = phase !== 'closed';
  const isCardRising = phase === 'rising' || phase === 'expanding';
  const isCardExpanding = phase === 'expanding';

  return (
    <div
      id="envelope-intro-overlay"
      className={`fixed inset-0 z-40 w-full h-[100dvh] flex items-center justify-center select-none overflow-hidden touch-none transition-colors duration-1000 ${
        isCardExpanding ? 'bg-cream' : 'bg-[#181311]'
      }`}
      style={{ perspective: '1400px' }}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      aria-label={t.intro.tapPrompt}
      dir={dir}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleOpen();
      }}
    >
      {/* Ambient Dreamy Background Glow */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          isCardExpanding ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-rose/20 blur-[130px]" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-gold/15 blur-[120px]" />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-[420px] px-4 flex flex-col items-center justify-center">

        {/* Envelope Stage */}
        <motion.div
          animate={
            isCardExpanding
              ? { scale: 0.95, y: 120, opacity: 0 }
              : { scale: 1, y: isCardRising ? 40 : 0, opacity: 1 }
          }
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-[330px] sm:w-[370px] h-[230px] sm:h-[250px] flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* 1. Envelope Back Base (Layer 1 - deepest) */}
          <div className="absolute inset-0 rounded-2xl bg-[#E8C7C0] border border-gold/40 shadow-2xl overflow-hidden z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-[#F5E2BE]/50 via-[#E8C7C0] to-[#DFB3A8] opacity-90">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
                <defs>
                  <pattern id="satinGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 0 10 L 10 0 L 20 10 L 10 20 Z" fill="none" stroke="#C9A24B" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#satinGrid)" />
              </svg>
            </div>
          </div>

          {/* 2. THE WEDDING INVITATION CARD (Layer 2) */}
          <motion.div
            initial={{ y: 0, scale: 0.98 }}
            animate={
              isCardExpanding
                ? {
                    y: -100,
                    scale: 1.15,
                    opacity: 0,
                    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                  }
                : isCardRising
                ? {
                    y: -120,
                    scale: 1.02,
                    opacity: 1,
                    transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
                  }
                : { y: 0, scale: 0.98, opacity: 1 }
            }
            className="absolute left-3.5 right-3.5 top-3.5 h-[215px] sm:h-[230px] rounded-xl bg-cream border border-gold/60 shadow-xl p-4 flex flex-col items-center justify-between overflow-hidden cursor-pointer"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 30%, #FFFFFF 0%, #FFF8F3 60%, #FAECE1 100%)',
              zIndex: isCardExpanding ? 50 : 20,
            }}
          >
            {/* Fine Inner Gold Border */}
            <div className="absolute inset-1.5 rounded-lg border border-gold/30 pointer-events-none" />

            {/* Top: Spiritual Inscription Preview */}
            <div className="text-center pt-1 z-10">
              <span className="font-amiri text-xs text-taupe-dark tracking-wide block font-bold">
                {t.bismillah.arabic}
              </span>
              <p className="font-serif italic text-[11px] text-taupe-dark/85 mt-0.5 max-w-[270px] mx-auto leading-tight font-medium">
                {isArabic ? t.bismillah.verse : t.bismillah.translation || t.bismillah.verse}
              </p>
            </div>

            {/* Center: Grand Couple Names */}
            <div className="text-center my-auto z-10 flex flex-col items-center">
              <span className="text-[11px] font-semibold text-[#78550E] block mb-0.5">
                {t.couple.parentsTitle}
              </span>
              <h2 className="font-script text-3xl sm:text-4xl text-gold-gradient py-0.5">
                {t.couple.bride} &amp; {t.couple.groom}
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cream/90 border border-gold/40 shadow-2xs mt-1">
                <Sparkles className="w-3 h-3 text-gold" />
                <span className="text-[11px] text-taupe-dark font-bold">
                  {t.weddingDateFormatted}
                </span>
              </div>
            </div>

            {/* Bottom: Venue & Invitation prompt */}
            <div className="w-full text-center pb-1 z-10 flex flex-col items-center">
              <p className="text-[11px] text-taupe-dark font-medium">
                {t.location.venueSubtitle}
              </p>
              <div className="w-12 h-[1px] bg-gold/40 mt-1 mb-1" />
              <span className="text-xs text-[#78550E] font-bold">
                {t.intro.cardTag}
              </span>
            </div>

            {/* Background subtle watermark couple cartoon */}
            <div className="absolute -bottom-2 -right-2 w-24 h-24 opacity-15 pointer-events-none">
              <img
                src={ASSETS.coupleCartoon}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* 3. Envelope Pocket */}
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-2xl">
            <svg
              viewBox="0 0 370 250"
              className="w-full h-full drop-shadow-md"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="pocketLeft" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F9E2DC" />
                  <stop offset="100%" stopColor="#ECD0C8" />
                </linearGradient>
                <linearGradient id="pocketRight" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F9E2DC" />
                  <stop offset="100%" stopColor="#ECD0C8" />
                </linearGradient>
                <linearGradient id="pocketBottom" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#E5C1B8" />
                  <stop offset="100%" stopColor="#F5D9D2" />
                </linearGradient>
                <filter id="pocketShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="-3" stdDeviation="4" floodColor="#8B5B52" floodOpacity="0.25" />
                </filter>
              </defs>

              <polygon
                points="0,0 185,130 0,250"
                fill="url(#pocketLeft)"
                stroke="#E5C1B8"
                strokeWidth="1"
              />

              <polygon
                points="370,0 185,130 370,250"
                fill="url(#pocketRight)"
                stroke="#E5C1B8"
                strokeWidth="1"
              />

              <polygon
                points="0,250 185,115 370,250"
                fill="url(#pocketBottom)"
                stroke="#DBAF9C"
                strokeWidth="1.2"
                filter="url(#pocketShadow)"
              />

              <polyline
                points="0,250 185,115 370,250"
                fill="none"
                stroke="#C9A24B"
                strokeWidth="1"
                strokeOpacity="0.45"
              />
            </svg>
          </div>

          {/* 4. Top Triangular Flap with 3D Flip */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={isFlapOpen ? { rotateX: -180 } : { rotateX: 0 }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
            className="absolute top-0 left-0 right-0 h-[135px] pointer-events-none origin-top"
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform',
              zIndex: isFlapOpen ? 5 : 40,
            }}
          >
            <div className="absolute inset-0 backface-hidden">
              <svg
                viewBox="0 0 370 135"
                className="w-full h-full drop-shadow-lg"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="flapFront" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FDEAE5" />
                    <stop offset="100%" stopColor="#F1D3CB" />
                  </linearGradient>
                  <filter id="flapEdgeShadow">
                    <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#663328" floodOpacity="0.3" />
                  </filter>
                </defs>

                <polygon
                  points="0,0 370,0 185,130"
                  fill="url(#flapFront)"
                  stroke="#E2B7AE"
                  strokeWidth="1"
                  filter="url(#flapEdgeShadow)"
                />

                <polyline
                  points="15,4 185,124 355,4"
                  fill="none"
                  stroke="#C9A24B"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  strokeOpacity="0.7"
                />
              </svg>
            </div>

            <div
              className="absolute inset-0 rounded-t-2xl backface-hidden"
              style={{ transform: 'rotateX(180deg)' }}
            >
              <svg
                viewBox="0 0 370 135"
                className="w-full h-full"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon
                  points="0,135 370,135 185,5"
                  fill="#E6C4BC"
                  stroke="#D9ACA1"
                  strokeWidth="1"
                />
                <polygon
                  points="10,130 360,130 185,15"
                  fill="none"
                  stroke="#C9A24B"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                />
              </svg>
            </div>
          </motion.div>

          {/* 5. GOLDEN WAX SEAL */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-auto cursor-pointer"
            style={{ top: '90px', width: '80px', height: '80px' }}
            onClick={handleOpen}
          >
            <AnimatePresence>
              {!isFlapOpen && (
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.25, opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="w-full h-full flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(70,30,8,0.45)] group"
                >
                  <svg
                    viewBox="0 0 80 80"
                    className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <radialGradient id="sealGoldGrad" cx="45%" cy="40%" r="55%">
                        <stop offset="0%" stopColor="#FFF2B8" />
                        <stop offset="35%" stopColor="#E2B344" />
                        <stop offset="70%" stopColor="#B88624" />
                        <stop offset="100%" stopColor="#6E4407" />
                      </radialGradient>
                      <linearGradient id="rimGoldGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFEAA1" />
                        <stop offset="50%" stopColor="#C99424" />
                        <stop offset="100%" stopColor="#5E3C05" />
                      </linearGradient>
                    </defs>

                    <circle cx="40" cy="40" r="37" fill="url(#sealGoldGrad)" />
                    <circle cx="40" cy="40" r="34" fill="none" stroke="url(#rimGoldGrad)" strokeWidth="2.5" />
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#FFEBA1" strokeWidth="1" strokeDasharray="2 3" opacity="0.8" />
                    <circle cx="40" cy="40" r="28" fill="#B38022" />

                    <text
                      x="40"
                      y="33"
                      textAnchor="middle"
                      fill="#FFF5C7"
                      fontFamily="'Amiri', serif"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      بِسْمِ اللَّهِ
                    </text>
                    <text
                      x="40"
                      y="44"
                      textAnchor="middle"
                      fill="#FFF5C7"
                      fontFamily="'Amiri', serif"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      الرَّحْمَٰنِ
                    </text>
                    <text
                      x="40"
                      y="54"
                      textAnchor="middle"
                      fill="#FFF5C7"
                      fontFamily="'Amiri', serif"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      الرَّحِيمِ
                    </text>
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* 6. Tap to open Call to action */}
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 text-center flex flex-col items-center gap-1.5 cursor-pointer pointer-events-auto"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-[1px] bg-gold/50" />
                <span className="text-sm tracking-wider text-gold-shimmer font-bold">
                  {t.intro.badge}
                </span>
                <span className="w-6 h-[1px] bg-gold/50" />
              </div>
              <p className="text-xs text-taupe-light/90 font-medium">
                {t.intro.tapSubtitle}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SectionEnvelopeIntro;
