import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { INVITATION_DATA } from '../../data/invitation';

export const SectionTimeline: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);

  // Scroll progress for drawing the vertical gold line from top to bottom
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 75%'],
  });

  // Smooth spring for line drawing
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <section
      id="section-timeline"
      className="relative py-18 px-6 paper-texture bg-gradient-to-b from-cream via-blush-50/50 to-cream overflow-hidden"
    >
      <div className="max-w-[420px] mx-auto">
        {/* Header */}
        <Reveal delay={0.1} className="text-center mb-12">
          <span className="font-cinzel text-xs tracking-loose-tracked text-gold uppercase block mb-1">
            A Glimpse of the
          </span>
          <h2 className="font-script text-4xl sm:text-5xl text-taupe-dark">
            Celebration Journey
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-[1px] w-8 bg-gold/40" />
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="h-[1px] w-8 bg-gold/40" />
          </div>
        </Reveal>

        {/* Timeline Container with Animated Drawing Line */}
        <div ref={timelineRef} className="relative pl-10 sm:pl-12">
          {/* Static Background Guide Track (Faint Dashed Line) */}
          <div className="absolute left-[19px] sm:left-[23px] top-4 bottom-4 w-[1px] border-l border-dashed border-gold/30" />

          {/* Animated Gold Scroll-Drawn Line (scaleY tied to scroll progress) */}
          <motion.div
            style={{ scaleY, transformOrigin: 'top' }}
            className="absolute left-[18px] sm:left-[22px] top-4 bottom-4 w-[3px] rounded-full bg-gradient-to-b from-gold-metallic via-gold-shimmer to-gold-dark shadow-[0_0_10px_rgba(201,162,75,0.7)]"
          />

          {/* Three Timeline Events */}
          <div className="space-y-12">
            {INVITATION_DATA.events.map((event, idx) => {
              // Format compact date string (e.g. "FRI, 11 OCT 2026")
              const dateParts = event.date.split(', ');
              const dayOfWeek = dateParts[0].toUpperCase().slice(0, 3);
              const dateRest = dateParts[1] ? dateParts[1].toUpperCase() : event.date;
              const formattedDateLabel = `${dayOfWeek}, ${dateRest}`;

              return (
                <div key={event.id} className="relative group">
                  {/* Glowing Node Dot (Pops scale 0 -> 1 when reached) */}
                  <div className="absolute -left-[30px] sm:-left-[34px] top-1.5 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 18,
                        delay: 0.1,
                      }}
                      className="relative w-6 h-6 rounded-full bg-cream border-2 border-gold flex items-center justify-center shadow-gold-glow cursor-pointer group-hover:scale-115 transition-transform"
                    >
                      {/* Inner metallic core */}
                      <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-gold-metallic via-gold-shimmer to-gold-metallic shadow-xs" />

                      {/* Halo ring on hover */}
                      <div className="absolute inset-0 rounded-full border border-gold-shimmer opacity-0 group-hover:opacity-100 group-hover:scale-130 transition-all duration-300" />
                    </motion.div>
                  </div>

                  {/* Content Next to Node */}
                  <motion.div
                    initial={{ opacity: 0, x: 20, filter: 'blur(6px)' }}
                    whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{
                      duration: 0.85,
                      delay: 0.15 * (idx + 1),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border border-gold/35 rounded-2xl p-5 bg-cream/90 backdrop-blur-xs shadow-paper hover:shadow-soft-float transition-all duration-300"
                  >
                    {/* 1. Tiny Tracked Label with Date */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                      <span className="font-cinzel text-[10px] sm:text-[11px] tracking-loose-tracked text-gold-dark uppercase font-semibold">
                        {formattedDateLabel}
                      </span>
                    </div>

                    {/* 2. Event Name in Script */}
                    <h3 className="font-script text-3xl sm:text-4xl text-gold-gradient py-0.5 mb-1.5">
                      {event.name}
                    </h3>

                    {/* 3. Line with Venue + Time */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs font-serif text-taupe pt-2 border-t border-gold/20">
                      <div className="flex items-center gap-1 text-taupe-dark">
                        <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span className="font-medium">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-1 text-taupe/80">
                        <Clock className="w-3 h-3 text-gold shrink-0" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionTimeline;
