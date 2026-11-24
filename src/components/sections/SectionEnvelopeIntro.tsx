'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { INVITATION_DATA } from '../../data/invitation';
import { ASSETS } from '../../config/assets';

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
  // Phases: 'closed' -> 'opening' (flap flips up) -> 'rising' (card comes out) -> 'expanding' (card becomes page) -> 'done'
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

    // 1. Start audio immediately
    if (onOpenStart) {
      onOpenStart();
    }

    // Phase 1: Flap flips open in 3D (0.0s - 0.7s)
    setPhase('opening');

    // Phase 2: Card rises up out of envelope pocket (0.65s - 1.6s)
    setTimeout(() => {
      setPhase('rising');
    }, 650);

    // Phase 3: Card expands to fill screen & envelope fades out (1.6s - 2.6s)
    setTimeout(() => {
      setPhase('expanding');
      if (onRevealHero) {
        onRevealHero();
      }
    }, 1650);

    // Phase 4: Sequence complete & unmount envelope overlay (2.7s)
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
      className={`fixed inset-0 z-50 w-full h-[100dvh] flex items-center justify-center select-none overflow-hidden touch-none transition-colors duration-1000 ${isCardExpanding ? 'bg-cream' : 'bg-[#181311]'
        }`}
      style={{ perspective: '1400px' }}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      aria-label="Tap to open wedding invitation envelope"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleOpen();
      }}
    >
      {/* Ambient Dreamy Background Glow */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${isCardExpanding ? 'opacity-0' : 'opacity-100'
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
            {/* Satin Lining Pattern inside the envelope */}
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

          {/* 2. THE WEDDING INVITATION CARD (Layer 2 - slides out of envelope!) */}
          <motion.div
            initial={{ y: 25, scale: 0.96 }}
            animate={
              isCardExpanding
                ? {
                  y: -110,
                  scale: 1.15,
                  opacity: 0,
                  transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
                }
                : isCardRising
                  ? {
                    y: -190,
                    scale: 1.02,
                    opacity: 1,
                    transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
                  }
                  : { y: 25, scale: 0.96, opacity: 1 }
            }
            className={`absolute left-3 right-3 top-2 h-[340px] sm:h-[360px] rounded-2xl bg-cream border-2 border-gold/60 shadow-2xl p-5 flex flex-col items-center justify-between overflow-hidden cursor-pointer ${isCardRising ? 'z-35' : 'z-15'
              }`}
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 30%, #FFFFFF 0%, #FFF8F3 60%, #FAECE1 100%)',
            }}
          >
            {/* Fine Inner Gold Border */}
            <div className="absolute inset-2 rounded-xl border border-gold/30 pointer-events-none" />

            {/* Top: Quranic Verse Preview */}
            <div className="text-center pt-2 z-10">
              <span className="font-amiri text-xs text-taupe-dark tracking-wide block">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
              <p className="font-serif italic text-[10px] text-taupe/80 mt-1 max-w-[240px] mx-auto leading-tight">
                "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا"
              </p>
            </div>

            {/* Center: Grand Couple Names */}
            <div className="text-center my-auto z-10 flex flex-col items-center">
              <span className="font-cinzel text-[9px] tracking-loose-tracked text-gold uppercase block mb-1">
                TOGETHER WITH THEIR FAMILIES
              </span>
              <h2 className="font-script text-4xl sm:text-5xl text-gold-gradient py-1">
                {INVITATION_DATA.couple.bride.firstName} &amp; {INVITATION_DATA.couple.groom.firstName}
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream/80 border border-gold/40 shadow-2xs mt-2">
                <Sparkles className="w-3 h-3 text-gold" />
                <span className="font-cinzel text-[9px] tracking-wider text-taupe-dark uppercase font-semibold">
                  MONDAY, 12TH OF OCTOBER 2026
                </span>
              </div>
            </div>

            {/* Bottom: Couple Illustration Thumbnail & Venue */}
            <div className="w-full text-center pb-2 z-10 flex flex-col items-center">
              <p className="font-cinzel text-[9px] tracking-wider text-taupe/80 uppercase">
                {INVITATION_DATA.venue.address}
              </p>
              <div className="w-12 h-[1px] bg-gold/40 mt-1 mb-1.5" />
              <span className="font-serif italic text-[10px] text-gold-dark">
                Tap to enter the celebration ✦
              </span>
            </div>

            {/* Background subtle watermark couple cartoon */}
            <div className="absolute bottom-0 right-0 w-32 h-32 opacity-15 pointer-events-none">
              <img
                src={ASSETS.coupleCartoon}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* 3. Envelope Pocket (Layer 3 - Front flaps covering bottom & sides of card) */}
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-2xl">
            {/* SVG Pocket Flaps: Left, Right & Bottom */}
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

              {/* Left Triangular Flap */}
              <polygon
                points="0,0 185,130 0,250"
                fill="url(#pocketLeft)"
                stroke="#E5C1B8"
                strokeWidth="1"
              />

              {/* Right Triangular Flap */}
              <polygon
                points="370,0 185,130 370,250"
                fill="url(#pocketRight)"
                stroke="#E5C1B8"
                strokeWidth="1"
              />

              {/* Bottom Triangular Flap overlapping left & right */}
              <polygon
                points="0,250 185,115 370,250"
                fill="url(#pocketBottom)"
                stroke="#DBAF9C"
                strokeWidth="1.2"
                filter="url(#pocketShadow)"
              />

              {/* Subtle Gold Outline on the bottom flap edge */}
              <polyline
                points="0,250 185,115 370,250"
                fill="none"
                stroke="#C9A24B"
                strokeWidth="1"
                strokeOpacity="0.45"
              />
            </svg>
          </div>

          {/* 4. Top Triangular Flap with 3D Flip (Layer 4 in closed state, flips up to -180deg) */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={isFlapOpen ? { rotateX: -180 } : { rotateX: 0 }}
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
            className={`absolute top-0 left-0 right-0 h-[135px] pointer-events-none origin-top ${isFlapOpen ? 'z-5' : 'z-40'
              }`}
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            {/* Front of Flap (pointing down when closed) */}
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

                {/* Triangle pointing downwards */}
                <polygon
                  points="0,0 370,0 185,130"
                  fill="url(#flapFront)"
                  stroke="#E2B7AE"
                  strokeWidth="1"
                  filter="url(#flapEdgeShadow)"
                />

                {/* Gold Lace/Filigree V-line */}
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

            {/* Back / Inside of Flap (revealed when flipped 180deg upwards) */}
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
                {/* Inside gold sheen */}
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

          {/* 5. GOLDEN WAX SEAL (Centered at flap tip, pops/fades when opened) */}
          <AnimatePresence>
            {!isFlapOpen && (
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.25, opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="absolute z-50 pointer-events-auto cursor-pointer"
                style={{
                  top: '125px',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* 3D Wax Seal with Arabic Bismillah */}
                <div className="relative w-20 h-20 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(70,30,8,0.45)] group">
                  {/* Organic Gold Seal SVG */}
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

                    {/* Outer wavy wax pool */}
                    <circle cx="40" cy="40" r="37" fill="url(#sealGoldGrad)" />
                    <circle cx="40" cy="40" r="34" fill="none" stroke="url(#rimGoldGrad)" strokeWidth="2.5" />
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#FFEBA1" strokeWidth="1" strokeDasharray="2 3" opacity="0.8" />
                    <circle cx="40" cy="40" r="28" fill="#B38022" />

                    {/* Center Arabic Calligraphy */}
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 6. "TAP TO OPEN" Call to action */}
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
                <span className="font-cinzel text-xs tracking-loose-tracked text-gold-shimmer uppercase font-semibold">
                  TAP TO OPEN
                </span>
                <span className="w-6 h-[1px] bg-gold/50" />
              </div>
              <p className="font-serif italic text-xs text-taupe-light/90">
                انقر على الشمع لفتح ظرف الدعوة
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SectionEnvelopeIntro;
