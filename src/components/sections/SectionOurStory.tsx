import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { INVITATION_DATA } from '../../data/invitation';
import { ASSETS } from '../../config/assets';

export const SectionOurStory: React.FC = () => {
  return (
    <section
      id="section-our-story"
      className="relative py-18 px-5 sm:px-6 paper-texture bg-cream select-none overflow-hidden"
    >
      <div className="max-w-[420px] mx-auto">
        {/* Header */}
        <Reveal delay={0.1} className="text-center mb-10">
          <span className="font-cinzel text-xs tracking-loose-tracked text-gold uppercase block mb-1">
            A Love Written Slowly
          </span>
          <h2 className="font-script text-5xl sm:text-6xl text-taupe-dark">
            Our Story
          </h2>

          {/* Thin Gold Divider */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <span className="h-[1px] w-14 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="w-4 h-4 rounded-full border border-gold/60 flex items-center justify-center">
              <span className="text-[9px] text-gold-metallic">✦</span>
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
                alt={`${INVITATION_DATA.couple.bride.firstName} & ${INVITATION_DATA.couple.groom.firstName}`}
                className="w-full h-full object-cover object-top"
                loading="lazy"
                decoding="async"
              />
            </div>
            {/* Delicate name badge beneath portrait */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-cream border border-gold/50 shadow-xs whitespace-nowrap">
              <span className="font-script text-base text-gold-dark font-medium">
                {INVITATION_DATA.couple.bride.firstName} &amp; {INVITATION_DATA.couple.groom.firstName}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Three Chapters with Alternating Alignment */}
        <div className="space-y-12">
          {INVITATION_DATA.story.map((chapter, idx) => {
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
                className={`relative rounded-2xl p-6 sm:p-7 border border-gold/35 bg-cream/80 backdrop-blur-xs shadow-paper overflow-hidden ${
                  isEven
                    ? 'sm:ml-6 sm:mr-0 text-left sm:text-right'
                    : 'sm:mr-6 sm:ml-0 text-left'
                }`}
              >
                {/* Inner Delicate Hairline */}
                <div className="absolute inset-2 rounded-xl border border-gold/20 pointer-events-none" />

                {/* Huge Faded Gold Script Numeral (Scales & Draws In First) */}
                <motion.div
                  initial={{ scale: 0.55, opacity: 0, filter: 'blur(8px)' }}
                  whileInView={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.85,
                    delay: 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`absolute -top-3 ${
                    isEven ? 'right-4 sm:left-4' : 'right-4'
                  } pointer-events-none select-none`}
                >
                  <span className="font-script text-7xl sm:text-8xl text-gold-gradient opacity-20 block leading-none">
                    {chapter.number}
                  </span>
                </motion.div>

                {/* Content */}
                <div className="relative z-10 pt-2">
                  {/* Small Tracked Title */}
                  <div
                    className={`flex items-center gap-2 mb-2 ${
                      isEven ? 'sm:justify-end' : 'justify-start'
                    }`}
                  >
                    <span className="font-cinzel text-[10px] tracking-loose-tracked text-gold-dark uppercase font-semibold">
                      Chapter {chapter.number}
                    </span>
                    {chapter.date && (
                      <span className="text-xs font-serif italic text-taupe/60">
                        • {chapter.date}
                      </span>
                    )}
                  </div>

                  {/* Chapter Heading in Script */}
                  <h3 className="font-script text-3xl sm:text-4xl text-gold-gradient py-0.5 mb-2.5">
                    {chapter.title}
                  </h3>

                  {/* Paragraph in Italic Serif */}
                  <p className="font-serif italic text-sm text-taupe/90 leading-relaxed">
                    "{chapter.text}"
                  </p>

                  {/* Last Chapter Ending Line */}
                  {idx === INVITATION_DATA.story.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="mt-6 pt-5 border-t border-gold/30 text-center"
                    >
                      <Sparkles className="w-4 h-4 text-gold mx-auto mb-2" />
                      <p className="font-serif italic text-sm text-taupe-dark leading-relaxed font-medium">
                        "And so we invite you — dear friends and family — to walk with us into the garden of our forever."
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
