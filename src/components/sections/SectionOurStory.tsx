'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { ASSETS } from '../../config/assets';
import { useLanguage } from '../../context/LanguageContext';

export const SectionOurStory: React.FC = () => {
  const { t, dir, isArabic } = useLanguage();
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const chapters = t.story.chapters;
  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  const handleNext = () => {
    setActiveChapterIndex((prev) => (prev + 1) % chapters.length);
  };

  const handlePrev = () => {
    setActiveChapterIndex((prev) => (prev - 1 + chapters.length) % chapters.length);
  };

  return (
    <section
      id="section-our-story"
      className="relative w-full min-h-[100dvh] py-8 px-4 sm:px-6 flex flex-col items-center justify-center paper-texture bg-cream overflow-hidden snap-start snap-always"
      dir={dir}
    >
      <div className="w-full max-w-[420px] mx-auto flex flex-col items-center text-center">
        {/* Header */}
        <Reveal delay={0.1} className="text-center mb-4">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-[#78550E] uppercase block mb-1">
            {t.story.tag}
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-taupe-dark">
            {t.story.title}
          </h2>

          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="w-4 h-4 rounded-full border border-gold/60 flex items-center justify-center">
              <span className="text-[10px] text-gold-metallic">✦</span>
            </div>
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
        </Reveal>

        {/* Featured Arched Couple Portrait (Compact & Elegant) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-5"
        >
          <div className="relative p-1.5 rounded-t-full rounded-b-xl bg-gradient-to-b from-gold/30 via-cream to-gold/20 shadow-paper border border-gold/40">
            <div className="relative w-28 sm:w-32 h-36 sm:h-40 rounded-t-full rounded-b-lg overflow-hidden border border-gold/30 bg-cream">
              <img
                src={ASSETS.coupleCartoon}
                alt={`${t.couple.bride} & ${t.couple.groom}`}
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cream border border-gold/50 shadow-xs whitespace-nowrap">
              <span className="font-serif text-xs text-[#78550E] font-bold">
                {t.story.badge}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Chapter Tabs */}
        <div className="w-full flex items-center justify-center gap-2 mb-4">
          {chapters.map((chap, idx) => {
            const isActive = idx === activeChapterIndex;
            return (
              <button
                key={chap.number}
                type="button"
                onClick={() => setActiveChapterIndex(idx)}
                className={`relative px-3 py-1.5 rounded-full text-xs font-serif font-bold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#B8913A] via-[#F1D98B] to-[#B8913A] text-white shadow-[0_2px_8px_rgba(201,162,75,0.4)] scale-105'
                    : 'bg-cream/90 text-taupe-dark/70 border border-gold/30 hover:border-gold/60'
                }`}
              >
                <span>{chap.number}</span>
                <span className="hidden sm:inline ms-1.5">{chap.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Chapter Card */}
        <div className="w-full relative min-h-[170px] sm:min-h-[180px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter.number}
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-2xl p-5 border border-gold/35 bg-cream/90 backdrop-blur-xs shadow-paper overflow-hidden text-start"
            >
              <div className="absolute inset-1.5 rounded-xl border border-gold/20 pointer-events-none" />

              {/* Number Watermark */}
              <div className="absolute -top-2 end-3 pointer-events-none select-none">
                <span className="font-serif text-5xl sm:text-6xl text-gold-metallic opacity-20 block leading-none font-bold">
                  {currentChapter.number}
                </span>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#78550E]">
                    {currentChapter.label}
                  </span>
                  {currentChapter.date && (
                    <span className="text-xs text-taupe-dark/60">
                      • {currentChapter.date}
                    </span>
                  )}
                </div>

                <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#78550E] mb-2">
                  {currentChapter.title}
                </h3>

                <p className="font-serif italic text-sm text-taupe-dark leading-relaxed">
                  "{currentChapter.text}"
                </p>

                {activeChapterIndex === chapters.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="mt-3 pt-3 border-t border-gold/30 text-center"
                  >
                    <p className="font-serif italic text-xs sm:text-sm text-taupe-dark leading-relaxed font-bold">
                      "{t.story.closingQuote}"
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stepper Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous chapter"
            className="p-1.5 rounded-full border border-gold/40 bg-cream hover:bg-gold/10 text-taupe-dark transition-all cursor-pointer"
          >
            {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <span className="text-xs font-serif text-taupe-dark/70">
            {activeChapterIndex + 1} / {chapters.length}
          </span>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next chapter"
            className="p-1.5 rounded-full border border-gold/40 bg-cream hover:bg-gold/10 text-taupe-dark transition-all cursor-pointer"
          >
            {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </section>
  );
};

export default SectionOurStory;
