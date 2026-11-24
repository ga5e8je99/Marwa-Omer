'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type PanInfo, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { INVITATION_DATA } from '../../data/invitation';

export const SectionGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const moments = INVITATION_DATA.moments;
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % moments.length);
  }, [moments.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + moments.length) % moments.length);
  }, [moments.length]);

  // Autoplay every 4s, pause on touch/hover or if reduced motion is preferred
  useEffect(() => {
    if (isPaused || shouldReduceMotion) return;

    autoplayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isPaused, nextSlide, shouldReduceMotion]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  const currentMoment = moments[currentIndex];

  return (
    <section
      id="section-gallery"
      className="relative py-16 px-5 sm:px-6 paper-texture bg-gradient-to-b from-cream via-blush-50/40 to-cream overflow-hidden select-none"
      dir="rtl"
    >
      <div className="max-w-[420px] mx-auto text-center">
        {/* Header */}
        <Reveal delay={0.1} className="mb-10">
          <span className="font-cairo text-xs sm:text-sm font-bold tracking-wider text-[#78550E] uppercase block mb-1">
            أجمل الذكريات
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-taupe-dark">
            ألبوم اللحظات
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-[1px] w-10 bg-gold/40" />
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="h-[1px] w-10 bg-gold/40" />
          </div>
        </Reveal>

        {/* Swipeable Arch-Shaped Frame Carousel */}
        <Reveal delay={0.2}>
          <div
            className="relative mx-auto w-full max-w-[320px] touch-pan-y"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* The Signature ARCH-Shaped Frame */}
            <div
              style={{ borderRadius: '999px 999px 28px 28px' }}
              className="relative w-full h-[440px] sm:h-[460px] border-2 border-gold/55 bg-cream shadow-soft-float p-2.5 overflow-hidden flex flex-col items-center justify-center"
            >
              <div
                style={{ borderRadius: '999px 999px 22px 22px' }}
                className="absolute inset-2 border border-gold/30 pointer-events-none z-20"
              />

              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={handleDragEnd}
                className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
                style={{ borderRadius: '999px 999px 20px 20px' }}
              >
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentMoment.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={currentMoment.image}
                      alt={currentMoment.title}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Photo Caption Overlay at Bottom */}
                    <div className="absolute bottom-5 left-4 right-4 text-center text-white z-10 pointer-events-none">
                      <span className="font-cairo text-xs font-semibold text-gold-shimmer block mb-1">
                        صورة {currentIndex + 1} من {moments.length}
                      </span>
                      <h4 className="font-serif font-bold text-2xl sm:text-3xl text-white drop-shadow-md leading-tight">
                        {currentMoment.title}
                      </h4>
                      <p className="font-cairo text-xs sm:text-sm text-white/95 mt-1 max-w-[240px] mx-auto drop-shadow-sm font-medium">
                        "{currentMoment.caption}"
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Prev / Next Circular Arrow Buttons (Min 44x44px for Touch) */}
              <button
                onClick={prevSlide}
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-cream/90 backdrop-blur-xs border border-gold/50 flex items-center justify-center text-taupe-dark hover:text-gold-dark hover:border-gold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="الصورة السابقة"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={nextSlide}
                type="button"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-cream/90 backdrop-blur-xs border border-gold/50 flex items-center justify-center text-taupe-dark hover:text-gold-dark hover:border-gold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="الصورة التالية"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default SectionGallery;
