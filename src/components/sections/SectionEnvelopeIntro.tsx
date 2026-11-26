'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { INVITATION_DATA } from '../../data/invitation';
import { ASSETS } from '../../config/assets';
import { useLanguage } from '../../context/LanguageContext';

interface SectionEnvelopeIntroProps {
  onOpenStart?: () => void;
  onRevealHero?: () => void;
  onOpenComplete?: () => void;
}

/* ------------------------------------------------------------------ */
/* Botanical artwork (inline SVG, no external assets)                  */
/* ------------------------------------------------------------------ */

// Cubic bezier stem for the eucalyptus branch: (20,290) -> (150,20)
const P = [
  [20, 290],
  [40, 200],
  [70, 120],
  [150, 20],
];

const stemPoint = (t: number) => {
  const u = 1 - t;
  const x = u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0];
  const y = u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1];
  const dx = 3 * u * u * (P[1][0] - P[0][0]) + 6 * u * t * (P[2][0] - P[1][0]) + 3 * t * t * (P[3][0] - P[2][0]);
  const dy = 3 * u * u * (P[1][1] - P[0][1]) + 6 * u * t * (P[2][1] - P[1][1]) + 3 * t * t * (P[3][1] - P[2][1]);
  // rotation (clockwise from "up") of the stem tangent
  const a = (Math.atan2(dx, -dy) * 180) / Math.PI;
  return { x, y, a };
};

const LEAF_COLORS = ['#9DB8A0', '#B7CDB4', '#86A58C'];
const LEAF_PATH = 'M0 0 C 9 -10 9 -28 0 -40 C -9 -28 -9 -10 0 0 Z';

const LEAVES = [
  ...Array.from({ length: 13 }, (_, i) => {
    const t = 0.1 + i * 0.07;
    const { x, y, a } = stemPoint(t);
    const side = i % 2 === 0 ? 1 : -1;
    return {
      x,
      y,
      rot: a + side * 52,
      scale: 1.05 - t * 0.55,
      fill: LEAF_COLORS[i % 3],
    };
  }),
  (() => {
    const { x, y, a } = stemPoint(1);
    return { x, y, rot: a, scale: 0.5, fill: LEAF_COLORS[1] };
  })(),
];

const Branch: React.FC = () => (
  <g>
    <path d="M20 290 C 40 200 70 120 150 20" stroke="#7E9B84" strokeWidth="2" fill="none" strokeLinecap="round" />
    {LEAVES.map((l, i) => (
      <path
        key={i}
        d={LEAF_PATH}
        fill={l.fill}
        fillOpacity={0.92}
        transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.rot.toFixed(1)}) scale(${l.scale.toFixed(2)})`}
      />
    ))}
  </g>
);

const Rose: React.FC<{ x: number; y: number; s: number; r?: number }> = ({ x, y, s, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    {[0, 1, 2, 3, 4].map((i) => (
      <ellipse key={`o${i}`} cx="0" cy="-14" rx="11" ry="14" fill="#F8DDE0" stroke="#E3A9AE" strokeWidth="0.8" transform={`rotate(${i * 72})`} />
    ))}
    {[0, 1, 2, 3, 4].map((i) => (
      <ellipse key={`m${i}`} cx="0" cy="-9" rx="7.5" ry="10" fill="#F0C4C8" stroke="#DB9EA4" strokeWidth="0.6" transform={`rotate(${i * 72 + 36})`} />
    ))}
    <circle r="6.5" fill="#E8B4B8" />
    <path d="M-4 1 C -4 -5 4 -5 4 0 C 4 4 -2 5 -2 1" fill="none" stroke="#CF8E94" strokeWidth="1" strokeLinecap="round" />
    <circle cx="0" cy="-1" r="1.2" fill="#C9A24B" />
  </g>
);

const Bud: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <ellipse cx="0" cy="-7" rx="4.5" ry="8" fill="#F4D4D7" stroke="#E3A9AE" strokeWidth="0.6" />
    <path d="M-4 0 Q 0 -4 4 0 Q 0 6 -4 0 Z" fill="#A9BFA8" />
  </g>
);

const BotanicalCorner: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <svg
    viewBox="0 0 200 300"
    className="w-[116px] sm:w-[190px] h-auto"
    style={flip ? { transform: 'rotate(180deg)' } : undefined}
    aria-hidden="true"
    focusable="false"
  >
    {/* long branch, flipped so it grows from the top-left corner */}
    <g transform="translate(0 300) scale(1 -1)">
      <Branch />
    </g>
    {/* shorter parallel branch */}
    <g transform="translate(70 180) scale(0.6 -0.6)" opacity="0.9">
      <Branch />
    </g>
    <Bud x={96} y={62} r={40} />
    <Bud x={50} y={132} r={-30} />
    <Rose x={30} y={46} s={1.25} r={10} />
    <Rose x={76} y={30} s={0.8} r={-20} />
    <Rose x={26} y={102} s={0.8} r={30} />
    {[
      [58, 76],
      [102, 24],
      [14, 140],
      [118, 96],
    ].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="1.8" fill="#C9A24B" opacity="0.8" />
    ))}
  </svg>
);

/* Falling petals ---------------------------------------------------- */
const PETALS = [
  { left: '8%', size: 11, delay: 0, dur: 11, drift: 30 },
  { left: '22%', size: 9, delay: 3, dur: 13, drift: -24 },
  { left: '37%', size: 12, delay: 6, dur: 12, drift: 36 },
  { left: '51%', size: 8, delay: 1.5, dur: 14, drift: -30 },
  { left: '64%', size: 11, delay: 8, dur: 11.5, drift: 26 },
  { left: '78%', size: 9, delay: 4.5, dur: 13.5, drift: -34 },
  { left: '90%', size: 12, delay: 7, dur: 12.5, drift: 22 },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export const SectionEnvelopeIntro: React.FC<SectionEnvelopeIntroProps> = ({
  onOpenStart,
  onRevealHero,
  onOpenComplete,
}) => {
  const { t, isArabic } = useLanguage();
  // closed -> opening (flap lifts) -> rising (card slides out) -> expanding (fade to page) -> done
  const [phase, setPhase] = useState<'closed' | 'opening' | 'rising' | 'expanding' | 'done'>('closed');
  const interactionLockRef = useRef(false);
  const reduceMotion = useReducedMotion();

  // Keep the page from scrolling while the envelope is on screen
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
    };
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => document.removeEventListener('touchmove', handleTouchMove);
  }, []);

  const handleOpen = () => {
    if (interactionLockRef.current) return;
    interactionLockRef.current = true;

    onOpenStart?.(); // prime/start music inside the user gesture

    setPhase('opening');
    setTimeout(() => setPhase('rising'), 650);
    setTimeout(() => {
      setPhase('expanding');
      onRevealHero?.();
    }, 1650);
    setTimeout(() => {
      setPhase('done');
      onOpenComplete?.();
    }, 2700);
  };

  if (phase === 'done') return null;

  const isFlapOpen = phase !== 'closed';
  const isCardRising = phase === 'rising' || phase === 'expanding';
  const isCardExpanding = phase === 'expanding';

  const { bride, groom } = INVITATION_DATA.couple;
  const weddingDateAr = new Date(INVITATION_DATA.targetDateISO).toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const ease = [0.22, 1, 0.36, 1] as const;

  const brideDisplayName = t?.couple?.bride || (isArabic ? bride.arabicName : bride.fullName);
  const groomDisplayName = t?.couple?.groom || (isArabic ? groom.arabicName : groom.fullName);
  const weddingDateDisplay = isArabic ? weddingDateAr : INVITATION_DATA.weddingDateFormatted;

  return (
    <div
      id="envelope-intro-overlay"
      className="fixed inset-0 z-50 w-full h-[100dvh] flex items-center justify-center select-none overflow-hidden touch-none bg-cream"
      onClick={handleOpen}
    >
      {/* Soft morning-light backdrop (fades out as the page appears) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${isCardExpanding ? 'opacity-0' : 'opacity-100'}`}
        style={{ background: 'radial-gradient(ellipse at 50% 38%, #FFFFFF 0%, #FFF8F3 52%, #F9E9E5 100%)' }}
      >
        <div className="absolute -top-20 right-[-60px] w-72 h-72 rounded-full bg-rose/20 blur-[90px]" />
        <div className="absolute bottom-10 -left-16 w-72 h-72 rounded-full bg-[#CFE0D2]/50 blur-[90px]" />
      </div>

      {/* Botanical corners */}
      <motion.div
        className={`absolute top-0 left-0 pointer-events-none transition-opacity duration-700 ${isCardExpanding ? 'opacity-0' : 'opacity-100'}`}
        style={{ transformOrigin: '0% 0%' }}
        animate={reduceMotion ? undefined : { rotate: [0, 1.6, 0, -1.2, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      >
        <BotanicalCorner />
      </motion.div>
      <motion.div
        className={`absolute bottom-0 right-0 pointer-events-none transition-opacity duration-700 ${isCardExpanding ? 'opacity-0' : 'opacity-100'}`}
        style={{ transformOrigin: '100% 100%' }}
        animate={reduceMotion ? undefined : { rotate: [0, -1.6, 0, 1.2, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <BotanicalCorner flip />
      </motion.div>

      {/* Drifting petals */}
      {!reduceMotion &&
        !isCardExpanding &&
        PETALS.map((p, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute -top-6 pointer-events-none rounded-[60%_40%_60%_40%] bg-rose-light/80"
            style={{ left: p.left, width: p.size, height: p.size * 1.3 }}
            initial={{ y: -30, rotate: 0, opacity: 0 }}
            animate={{
              y: '105vh',
              x: [0, p.drift, -p.drift / 2, p.drift],
              rotate: [0, 160, 320],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}

      {/* Content */}
      <div className="relative z-10 w-full max-w-[420px] px-4 flex flex-col items-center">
        {/* Names */}
        <motion.div
          lang={isArabic ? 'ar' : 'en'}
          dir={isArabic ? 'rtl' : 'ltr'}
          className="text-center mb-7"
          animate={{ opacity: isFlapOpen ? 0 : 1, y: isFlapOpen ? -16 : 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="font-amiri text-[15px] text-[#6F5B50]">{t?.intro?.badge || 'ندعوكم لحضور حفل زفاف'}</p>
          <h1 className="font-amiri text-[40px] leading-tight text-taupe-dark mt-1">
            {brideDisplayName}
            <span className="font-script text-gold text-[34px] mx-3" aria-hidden="true">&amp;</span>
            <span className="sr-only">و</span>
            {groomDisplayName}
          </h1>
          <p className="font-amiri text-[15px] text-gold-dark mt-1">{weddingDateDisplay}</p>
        </motion.div>

        {/* Envelope stage */}
        <motion.div
          animate={
            isCardExpanding
              ? { scale: 0.95, y: 120, opacity: 0 }
              : { scale: 1, y: isCardRising ? 40 : 0, opacity: 1 }
          }
          transition={{ duration: 0.9, ease }}
          className="relative w-[min(340px,84vw)] aspect-[17/12]"
          style={{ filter: 'drop-shadow(0 18px 24px rgba(138,116,104,0.22))' }}
        >
          {/* 1. Inside / back of the envelope */}
          <div className="absolute inset-0 rounded-2xl bg-[#F3DAD4] border border-gold/40 overflow-hidden z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-[#F8E6DF] to-[#EBC9C1]" />
          </div>

          {/* 2. The card (slides up out of the pocket) */}
          <motion.div
            className="absolute z-20 left-[6%] right-[6%] top-[7%] bottom-[9%]"
            initial={{ y: 0 }}
            animate={
              isCardExpanding
                ? { y: '-70%', scale: 1.12, opacity: 0, transition: { duration: 0.85, ease } }
                : isCardRising
                  ? { y: '-58%', transition: { duration: 0.95, ease } }
                  : { y: 0 }
            }
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white to-[#FFF8F3] border border-gold/55 shadow-paper flex flex-col items-center justify-start pt-[9%] text-center px-3">
              <div className="absolute inset-1.5 rounded-lg border border-gold/30 pointer-events-none" />
              <p lang="ar" dir="rtl" className="font-amiri text-[15px] sm:text-base text-gold-dark leading-snug">
                {INVITATION_DATA.bismillah.arabic}
              </p>
              <p lang={isArabic ? 'ar' : 'en'} dir={isArabic ? 'rtl' : 'ltr'} className="font-amiri text-[14px] text-[#6F5B50] mt-2">
                {isArabic ? 'يتشرفان بدعوتكم' : 'Cordially Invite You'}
              </p>
              <p lang={isArabic ? 'ar' : 'en'} dir={isArabic ? 'rtl' : 'ltr'} className="font-amiri text-2xl text-taupe-dark mt-1">
                {brideDisplayName} <span className="font-script text-gold">&amp;</span> {groomDisplayName}
              </p>
            </div>
          </motion.div>

          {/* 3. Front pocket (the V-cut front of the envelope) */}
          <div className="absolute inset-0 z-30 rounded-2xl overflow-hidden pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
              <defs>
                <linearGradient id="pocketFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#FBEDE8" />
                </linearGradient>
              </defs>
              <polygon
                points="0,0 50,56 100,0 100,100 0,100"
                fill="url(#pocketFill)"
                stroke="#C9A24B"
                strokeOpacity="0.55"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {/* 4. Flap (lifts in 3D, then tucks behind the card) */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[56%] pointer-events-none"
            style={{
              transformOrigin: 'top',
              transformStyle: 'preserve-3d',
              transformPerspective: 1200,
              zIndex: isCardRising ? 15 : 40,
            }}
            animate={{ rotateX: isFlapOpen ? 180 : 0 }}
            transition={{ duration: 0.7, ease }}
          >
            {/* outside face */}
            <div className="absolute inset-0 rounded-t-2xl overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
                <defs>
                  <linearGradient id="flapFront" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFDFB" />
                    <stop offset="100%" stopColor="#F7E2DC" />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,0 100,0 50,100"
                  fill="url(#flapFront)"
                  stroke="#C9A24B"
                  strokeOpacity="0.55"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            {/* inside face */}
            <div
              className="absolute inset-0 rounded-t-2xl overflow-hidden"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
            >
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" aria-hidden="true">
                <polygon points="0,0 100,0 50,100" fill="#EFCFC7" stroke="#C9A24B" strokeOpacity="0.4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
          </motion.div>

          {/* 5. Wax seal (the only control) */}
          <div className="absolute z-50 left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2">
            {!reduceMotion && !isFlapOpen && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-gold"
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{ scale: 1.9, opacity: 0 }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <motion.button
              type="button"
              aria-label="افتح الدعوة"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              className="relative block w-[68px] h-[68px] rounded-full cursor-pointer focus-visible:outline-gold"
              animate={
                isFlapOpen
                  ? { scale: 0.2, opacity: 0, transition: { duration: 0.35 } }
                  : reduceMotion
                    ? { scale: 1 }
                    : { scale: [1, 1.06, 1] }
              }
              transition={{ duration: 2.2, repeat: isFlapOpen || reduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
              whileTap={{ scale: 0.92 }}
            >
              <img
                src={ASSETS.waxSeal}
                alt=""
                draggable={false}
                className="w-full h-full object-contain"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(88,70,61,0.35))' }}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Hint */}
        <motion.div
          lang={isArabic ? 'ar' : 'en'}
          dir={isArabic ? 'rtl' : 'ltr'}
          className="text-center mt-9"
          animate={{ opacity: isFlapOpen ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-gold/50" />
            <p className="font-amiri text-lg font-bold text-taupe-dark">
              {t?.intro?.badge || 'دعوة فرح خاصة للغالين'}
            </p>
            <span className="h-px w-10 bg-gold/50" />
          </div>
          <p className="font-amiri text-[15px] text-[#6F5B50] mt-1.5">
            {t?.intro?.tapSubtitle || 'دوس على الشمعة الذهبية عشان تفتح الدعوة'}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SectionEnvelopeIntro;
