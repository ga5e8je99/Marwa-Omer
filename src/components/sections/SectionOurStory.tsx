'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { ASSETS } from '../../config/assets';
import { useLanguage } from '../../context/LanguageContext';

export const SectionOurStory: React.FC = () => {
  const { t, dir } = useLanguage();

  return (
    <section
      id="section-our-story"
      className="relative py-16 px-5 sm:px-6 paper-texture bg-cream overflow-hidden"
      dir={dir}
    >
      <div className="max-w-[420px] mx-auto">
        {/* Header */}
        <Reveal delay={0.1} className="text-center mb-10">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-[#78550E] uppercase block mb-1">
            {t.story.tag}
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-taupe-dark">
            {t.story.title}
          </h2>

          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="h-[1px] w-14 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="w-5 h-5 rounded-full border border-gold/60 flex items-center justify-center">
              <span className="text-xs text-gold-metallic">✦</span>
            </div>
            <span className="h-[1px] w-14 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>
        </Reveal>

        {/* Featured Arched Couple Portrait */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-14"
        >
          <div className="relative p-2 rounded-t-full rounded-b-2xl bg-gradient-to-b from-gold/30 via-cream to-gold/20 shadow-paper border border-gold/40">
            <div className="relative w-48 sm:w-52 h-64 sm:h-68 rounded-t-full rounded-b-xl overflow-hidden border border-gold/30 bg-cream">
              <img
                src={ASSETS.coupleCartoon}
                alt={`${t.couple.bride} & ${t.couple.groom}`}
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cream border border-gold/50 shadow-xs whitespace-nowrap">
              <span className="font-serif text-sm sm:text-base text-[#78550E] font-bold">
                {t.story.badge}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Three Chapters */}
        <div className="space-y-10">
          {t.story.chapters.map((chapter, idx) => {
            const isEven = idx % 2 === 1;

            return (
              <motion.div
                key={chapter.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.9,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative rounded-3xl p-6 sm:p-7 border border-gold/35 bg-cream/85 backdrop-blur-xs shadow-paper overflow-hidden text-start ${
                  isEven ? 'sm:mr-4' : 'sm:ml-4'
                }`}
              >
                <div className="absolute inset-2 rounded-2xl border border-gold/20 pointer-events-none" />

                {/* Number Watermark */}
                <div className="absolute -top-3 end-4 pointer-events-none select-none">
                  <span className="font-serif text-6xl sm:text-7xl text-gold-metallic opacity-20 block leading-none font-bold">
                    {chapter.number}
                  </span>
                </div>

                <div className="relative z-10 pt-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-[#78550E]">
                      {chapter.label}
                    </span>
                    {chapter.date && (
                      <span className="text-xs text-taupe-dark/60">
                        • {chapter.date}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#78550E] mb-2.5">
                    {chapter.title}
                  </h3>

                  <p className="font-serif italic text-sm sm:text-base text-taupe-dark leading-relaxed">
                    "{chapter.text}"
                  </p>

                  {idx === t.story.chapters.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="mt-6 pt-5 border-t border-gold/30 text-center"
                    >
                      <Sparkles className="w-5 h-5 text-gold mx-auto mb-2" />
                      <p className="font-serif italic text-sm sm:text-base text-taupe-dark leading-relaxed font-bold">
                        "{t.story.closingQuote}"
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SectionOurStory;
