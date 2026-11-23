import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Calendar, Download, Sparkles } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { ASSETS } from '../../config/assets';
import { INVITATION_DATA } from '../../data/invitation';

interface ScratchCardProps {
  id: string;
  label: string;
  value: string;
  isRevealed: boolean;
  onReveal: (id: string, rect: DOMRect) => void;
}

const STORAGE_KEY = 'wedding_scratch_cards_v1';
const BRUSH_RADIUS = 22; // requested ~22px round brush
const THRESHOLD = 55; // 55% cleared

const ScratchCard: React.FC<ScratchCardProps> = ({
  id,
  label,
  value,
  isRevealed,
  onReveal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const moveCountRef = useRef(0);
  const hasTriggeredRef = useRef(isRevealed);

  // Initialize Canvas Gold Foil
  const initFoil = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const size = 88;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    // 1. Draw circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    // 2. Rich Metallic Gold Foil Gradient
    const goldGrad = ctx.createLinearGradient(0, 0, size, size);
    goldGrad.addColorStop(0, '#B8913A');
    goldGrad.addColorStop(0.25, '#F1D98B');
    goldGrad.addColorStop(0.5, '#C9A24B');
    goldGrad.addColorStop(0.75, '#F7E6B5');
    goldGrad.addColorStop(1, '#B8913A');

    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, size, size);

    // 3. Subtle Concentric Guilloché Rings for Foil Texture
    ctx.strokeStyle = '#FFFFFF';
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1;

    for (let r = 8; r < size / 2; r += 8) {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 4. Center Gold Sparkle Icon & Foil Hint
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#6E4F18';
    ctx.font = 'bold 9px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ SCRATCH ✦', size / 2, size / 2);

    ctx.restore();
  }, [isRevealed]);

  useEffect(() => {
    initFoil();
  }, [initFoil]);

  // Check cleared percentage inside circle
  const checkPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || hasTriggeredRef.current) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    let total = 0;
    let cleared = 0;
    const cx = w / 2;
    const cy = h / 2;
    const rSq = (w / 2) * (w / 2);

    // Sample every 4th pixel for speed (<0.2ms)
    for (let y = 0; y < h; y += 4) {
      for (let x = 0; x < w; x += 4) {
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy <= rSq) {
          total++;
          const idx = (y * w + x) * 4 + 3;
          if (data[idx] < 128) {
            cleared++;
          }
        }
      }
    }

    const percent = total > 0 ? (cleared / total) * 100 : 0;

    if (percent >= THRESHOLD) {
      hasTriggeredRef.current = true;
      const rect = containerRef.current?.getBoundingClientRect() || canvas.getBoundingClientRect();
      onReveal(id, rect);
    }
  }, [id, onReveal]);

  // Erase at point
  const erase = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || hasTriggeredRef.current) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;

    ctx.globalCompositeOperation = 'destination-out';

    if (lastPosRef.current) {
      ctx.lineWidth = BRUSH_RADIUS * 2 * dpr;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, BRUSH_RADIUS * dpr, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPosRef.current = { x, y };

    moveCountRef.current += 1;
    if (moveCountRef.current % 4 === 0) {
      checkPercentage();
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (hasTriggeredRef.current) return;
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.setPointerCapture(e.pointerId);
    }
    lastPosRef.current = null;
    erase(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || hasTriggeredRef.current) return;
    erase(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPosRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if pointer capture was already released
    }
    checkPercentage();
  };

  return (
    <div className="flex flex-col items-center">
      {/* Circle Container (88px) */}
      <div
        ref={containerRef}
        className="relative w-[88px] h-[88px] rounded-full overflow-hidden shadow-paper select-none border border-gold/45"
      >
        {/* Underneath Layer: Cream circle with serif value */}
        <div className="absolute inset-0 rounded-full bg-cream flex flex-col items-center justify-center p-2 text-center pointer-events-none">
          <span className="font-serif font-bold text-2xl md:text-3xl text-taupe-dark tracking-wide leading-none">
            {value}
          </span>
          <span className="text-[9px] font-cinzel tracking-wider text-gold-dark uppercase mt-0.5">
            ✦ 2026 ✦
          </span>
        </div>

        {/* Scratchable Canvas Layer */}
        <AnimatePresence>
          {!isRevealed && (
            <motion.canvas
              ref={canvasRef}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: '88px',
                height: '88px',
                touchAction: 'none', // Touch-action: none ONLY on canvas!
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="absolute inset-0 cursor-grab active:cursor-grabbing z-10"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Tiny Tracked Label Below */}
      <span className="font-cinzel text-[10px] tracking-loose-tracked text-taupe-dark uppercase mt-2 font-semibold">
        {label}
      </span>
    </div>
  );
};

export const SectionSaveTheDate: React.FC = () => {
  // Load saved revealed state from sessionStorage
  const [revealed, setRevealed] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return { day: false, month: false, year: false };
  });

  const allRevealed = revealed.day && revealed.month && revealed.year;

  // Single card revealed handler
  const handleCardReveal = (id: string, rect: DOMRect) => {
    setRevealed((prev) => {
      if (prev[id]) return prev;
      const next = { ...prev, [id]: true };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });

    // 1. Sparkle Burst positioned at circle
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 28,
      spread: 60,
      origin: { x, y },
      colors: ['#B8913A', '#F1D98B', '#E8B4B8', '#FFF8F3'],
      ticks: 100,
      scalar: 0.75,
      disableForReducedMotion: true,
    });

    // 2. Light haptic feedback (15ms)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // Ignored
      }
    }
  };

  // Grand celebration when all three are revealed
  useEffect(() => {
    if (allRevealed) {
      confetti({
        particleCount: 45,
        spread: 80,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#B8913A', '#F1D98B', '#E8B4B8', '#CFC3DD'],
        ticks: 140,
        scalar: 0.85,
        disableForReducedMotion: true,
      });
    }
  }, [allRevealed]);

  // Download .ics calendar event
  const downloadIcs = () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      `PRODID:-//${INVITATION_DATA.couple.bride.firstName} & ${INVITATION_DATA.couple.groom.firstName} Wedding//EN`,
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:wedding-${INVITATION_DATA.couple.bride.firstName.toLowerCase()}-${INVITATION_DATA.couple.groom.firstName.toLowerCase()}-2026@invitation`,
      'DTSTAMP:20261012T120000Z',
      'DTSTART:20261012T160000',
      'DTEND:20261012T220000',
      `SUMMARY:The Wedding of ${INVITATION_DATA.couple.bride.firstName} & ${INVITATION_DATA.couple.groom.firstName}`,
      `DESCRIPTION:With immense joy and gratitude\\, celebrate the blessed wedding union of ${INVITATION_DATA.couple.bride.fullName} and ${INVITATION_DATA.couple.groom.fullName}.`,
      'LOCATION:Rose Valley Estate\\, Nowra Hills',
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'amaani-rayyan-wedding.ics');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      id="section-save-the-date"
      className="relative w-full paper-texture bg-cream overflow-hidden pb-12"
    >
      {/* 1. TOP STRIPS: Wide Lace/Damask Gold Band Strip + Muted Landscape Strip */}
      <div className="w-full flex flex-col pointer-events-none select-none">
        {/* Wide Gold Damask Lace Strip */}
        <div className="w-full h-9 bg-blush-50/70 border-y border-gold/40 flex items-center justify-center overflow-hidden">
          <img
            src={ASSETS.dividerLace}
            alt="Gold lace strip"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-85"
          />
        </div>

        {/* Muted Illustrated Landscape Strip */}
        <div className="w-full h-16 bg-cream/90 overflow-hidden relative border-b border-gold/25">
          <img
            src={ASSETS.stripLandscape}
            alt="Muted watercolor landscape strip"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      </div>

      {/* 2. Content Container */}
      <div className="max-w-[420px] mx-auto px-6 pt-8 text-center">
        {/* Tiny Tracked Label & Script Heading */}
        <Reveal delay={0.1}>
          <span className="font-cinzel text-xs tracking-loose-tracked text-gold uppercase block mb-1">
            Save The Date
          </span>
          <h2 className="font-script text-4xl sm:text-5xl text-taupe-dark mb-2">
            Scratch to Reveal
          </h2>
          <p className="font-serif italic text-xs text-taupe/80 max-w-xs mx-auto mb-8">
            Gently scratch the golden foil discs to unveil the auspicious celebration date.
          </p>
        </Reveal>

        {/* 3. Three Circular Scratch Cards in a Row: DAY, MONTH, YEAR */}
        <Reveal delay={0.2}>
          <div className="flex items-center justify-center gap-4 sm:gap-6 py-2">
            <ScratchCard
              id="day"
              label="DAY"
              value="12"
              isRevealed={revealed.day}
              onReveal={handleCardReveal}
            />
            <ScratchCard
              id="month"
              label="MONTH"
              value="OCT"
              isRevealed={revealed.month}
              onReveal={handleCardReveal}
            />
            <ScratchCard
              id="year"
              label="YEAR"
              value="2026"
              isRevealed={revealed.year}
              onReveal={handleCardReveal}
            />
          </div>
        </Reveal>

        {/* Quick reveal shortcut if user wants to reveal all at once */}
        {!allRevealed && (
          <button
            onClick={() => {
              const all = { day: true, month: true, year: true };
              setRevealed(all);
              sessionStorage.setItem(STORAGE_KEY, JSON.stringify(all));
            }}
            type="button"
            className="mt-4 text-[10px] font-cinzel tracking-wider text-taupe/60 hover:text-gold transition-colors underline cursor-pointer"
          >
            Reveal All
          </button>
        )}

        {/* 4. Revealed Celebration Date & Add to Calendar Button */}
        <AnimatePresence>
          {allRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 pt-6 border-t border-gold/30 flex flex-col items-center gap-4"
            >
              {/* Highlight Line: Saturday · 12 October 2026 */}
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <h3 className="font-serif font-medium text-lg sm:text-xl text-taupe-dark tracking-wide">
                  Saturday · 12 October 2026
                </h3>
                <Sparkles className="w-4 h-4 text-gold" />
              </div>

              <p className="font-cinzel text-[10px] tracking-wider text-taupe/80 uppercase">
                Rose Valley Estate • Nowra Hills
              </p>

              {/* Add to Calendar Button */}
              <button
                onClick={downloadIcs}
                type="button"
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold-metallic via-gold-shimmer to-gold-metallic text-cream font-cinzel text-xs tracking-tracked uppercase shadow-paper hover:shadow-gold-glow hover:opacity-95 transition-all duration-300 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-cream" />
                <span>Add to Calendar</span>
                <Download className="w-3.5 h-3.5 text-cream/80 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SectionSaveTheDate;
