import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { INVITATION_DATA } from '../../data/invitation';

export const SectionGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  // Autoplay every 4s, pause on touch/hover
  useEffect(() => {
    if (isPaused) return;

    autoplayTimerRef.current = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isPaused, nextSlide]);

  // Swipe gesture handling
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
      className="relative py-18 px-5 sm:px-6 paper-texture bg-gradient-to-b from-cream via-blush-50/40 to-cream overflow-hidden select-none"
    >
      <div className="max-w-[420px] mx-auto text-center">
        {/* Header */}
        <Reveal delay={0.1} className="mb-10">
          <span className="font-cinzel text-xs tracking-loose-tracked text-gold uppercase block mb-1">
            Memories
          </span>
          <h2 className="font-script text-5xl sm:text-6xl text-taupe-dark">
            Our Moments
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-[1px] w-8 bg-gold/40" />
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="h-[1px] w-8 bg-gold/40" />
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
            {/* The Signature ARCH-Shaped Frame: border-radius: 999px 999px 24px 24px */}
            <div
              style={{ borderRadius: '999px 999px 24px 24px' }}
              className="relative w-full h-[440px] sm:h-[460px] border-2 border-gold/55 bg-cream shadow-soft-float p-2.5 overflow-hidden flex flex-col items-center justify-center"
            >
              {/* Inner Double Gold Hairline Frame */}
              <div
                style={{ borderRadius: '999px 999px 18px 18px' }}
                className="absolute inset-2 border border-gold/30 pointer-events-none z-20"
              />

              {/* Swipeable Image Container */}
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={handleDragEnd}
                className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
                style={{ borderRadius: '999px 999px 16px 16px' }}
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

                    {/* Gradient Overlay for Title & Caption Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-taupe-dark/80 via-transparent to-transparent pointer-events-none" />

                    {/* Photo Caption Overlay at Bottom */}
                    <div className="absolute bottom-5 left-4 right-4 text-center text-cream z-10 pointer-events-none">
                      <span className="font-cinzel text-[9px] tracking-loose-tracked text-gold-shimmer uppercase block mb-0.5">
                        Moment {currentIndex + 1} of {moments.length}
                      </span>
                      <h4 className="font-script text-3xl sm:text-4xl text-cream drop-shadow-md leading-tight">
                        {currentMoment.title}
                      </h4>
                      <p className="font-serif italic text-xs text-cream/90 mt-1 max-w-[240px] mx-auto drop-shadow-xs">
                        "{currentMoment.caption}"
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Prev / Next Circular Arrow Buttons Overlaid on Left and Right Edges */}
              <button
                onClick={prevSlide}
                type="button"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-cream/90 backdrop-blur-xs border border-gold/50 flex items-center justify-center text-taupe-dark hover:text-gold-dark hover:border-gold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextSlide}
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-cream/90 backdrop-blur-xs border border-gold/50 flex items-center justify-center text-taupe-dark hover:text-gold-dark hover:border-gold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Dashes Under Carousel (Active Dash is Gold & Longer) */}
            <div className="flex items-center justify-center gap-1.5 mt-5">
              {moments.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-400 cursor-pointer ${
                    i === currentIndex
                      ? 'w-8 bg-gradient-to-r from-gold-metallic via-gold-shimmer to-gold-metallic shadow-xs'
                      : 'w-2.5 bg-gold/30 hover:bg-gold/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default SectionGallery;
