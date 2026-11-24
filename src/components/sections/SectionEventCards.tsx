import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { INVITATION_DATA, type WeddingEvent } from '../../data/invitation';

// Symmetrical Hanging Golden Lantern SVG Component that gently sways
interface HangingLanternProps {
  align?: 'left' | 'right';
  delay?: number;
}

const HangingLantern: React.FC<HangingLanternProps> = ({
  align = 'left',
  delay = 0,
}) => {
  return (
    <motion.div
      style={{ transformOrigin: 'top center' }}
      animate={{
        rotate: align === 'left' ? [-3, 3, -3] : [3, -3, 3],
      }}
      transition={{
        duration: 4.0,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className={`absolute top-0 ${
        align === 'left' ? 'left-6' : 'right-6'
      } pointer-events-none z-20 flex flex-col items-center select-none`}
    >
      {/* Hanging Chain / Cord */}
      <div className="w-[1.2px] h-7 bg-gradient-to-b from-gold-metallic via-gold-shimmer to-gold-dark opacity-80" />

      {/* Top Ringlet */}
      <div className="w-2 h-2 rounded-full border border-gold bg-cream/40 shadow-2xs -mt-0.5" />

      {/* Intricate Hanging Moroccan Lantern SVG */}
      <svg
        width="26"
        height="38"
        viewBox="0 0 26 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_2px_6px_rgba(201,162,75,0.35)]"
      >
        <defs>
          <radialGradient
            id={`lanternLight-${align}`}
            cx="50%"
            cy="45%"
            r="55%"
          >
            <stop offset="0%" stopColor="#FFFDF0" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#F8E5A7" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#C9A24B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#9A772C" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Dome Cap */}
        <path
          d="M 13 2 L 19 9 L 7 9 Z"
          fill="#B8913A"
          stroke="#7A5618"
          strokeWidth="0.8"
        />

        {/* Lantern Glass Body */}
        <polygon
          points="7,9 19,9 22,25 13,32 4,25"
          fill={`url(#lanternLight-${align})`}
          stroke="#8D6B26"
          strokeWidth="0.9"
        />

        {/* Filigree Ribs */}
        <line
          x1="13"
          y1="9"
          x2="13"
          y2="32"
          stroke="#8D6B26"
          strokeWidth="0.8"
          opacity="0.65"
        />
        <line
          x1="7"
          y1="9"
          x2="4"
          y2="25"
          stroke="#8D6B26"
          strokeWidth="0.8"
          opacity="0.65"
        />
        <line
          x1="19"
          y1="9"
          x2="22"
          y2="25"
          stroke="#8D6B26"
          strokeWidth="0.8"
          opacity="0.65"
        />

        {/* Warm Candle Light Bead */}
        <circle cx="13" cy="18" r="3.2" fill="#FFF2BD" opacity="0.9" />

        {/* Base Tassel Drop */}
        <circle cx="13" cy="34" r="1.5" fill="#B8913A" />
        <line
          x1="13"
          y1="34"
          x2="13"
          y2="38"
          stroke="#B8913A"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
};

// Single Event Card with 3D Tilt Parallax & Arched Frame
const EventCardItem: React.FC<{ event: WeddingEvent; index: number }> = ({
  event,
  index,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Parse formatted uppercase date block (e.g. "SATURDAY 12 OCT 2026")
  const dateFormattedUpper = event.date.replace(/,/g, '').toUpperCase();

  // Parse clean time block
  const timeUpper = event.time.split(' ')[0] + ' ' + (event.time.split(' ')[1] || '').toUpperCase();

  // Subtle 3D tilt on mouse movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 5, y: -y * 5 }); // max subtle 2.5 deg
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 38, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{
        duration: 0.9,
        delay: index * 0.18,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateY: tilt.x,
        rotateX: tilt.y,
      }}
      style={{ perspective: '1000px' }}
      className="relative w-full max-w-[400px] mx-auto rounded-[28px] overflow-hidden shadow-soft-float border border-gold/40 paper-texture bg-cream select-none transition-shadow hover:shadow-gold-glow duration-500"
    >
      {/* 1. Pastel Illustrated Background Layer (Specific to each event) */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <img
          src={event.image}
          alt={event.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover filter brightness-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cream/60 via-cream/80 to-cream pointer-events-none" />
      </div>

      {/* 2. Hanging Golden Swaying Lanterns at Top Corners */}
      <HangingLantern align="left" delay={0} />
      <HangingLantern align="right" delay={1.5} />

      {/* 3. Outer Hairline Margin Border */}
      <div className="absolute inset-2.5 rounded-[22px] border border-gold/25 pointer-events-none" />

      {/* 4. Inside Centered Arched Frame with Thin Gold Outline */}
      <div className="relative z-10 pt-10 pb-8 px-6 sm:px-8 text-center flex flex-col items-center">
        {/* The Signature Arched Frame */}
        <div className="relative w-full rounded-t-[140px] rounded-b-2xl border border-gold/50 bg-cream/90 backdrop-blur-xs p-6 pt-9 shadow-paper flex flex-col items-center">
          {/* Top Delicate Diamond Emblem */}
          <div className="w-5 h-5 rounded-full bg-cream border border-gold/60 flex items-center justify-center mb-1">
            <span className="text-[10px] text-gold-metallic">✦</span>
          </div>

          {/* Event Name in Script */}
          <h3 className="font-script text-4xl sm:text-5xl text-gold-gradient py-1 mb-1">
            {event.name}
          </h3>

          <p className="font-serif italic text-xs text-taupe/80 max-w-[260px] leading-relaxed mb-6">
            "{event.description}"
          </p>

          {/* Structured Labelled Information Blocks in Tiny Tracked Caps */}
          <div className="w-full space-y-4 pt-2 border-t border-gold/25">
            {/* DATE BLOCK */}
            <div className="flex flex-col items-center">
              <span className="font-cinzel text-[9px] tracking-loose-tracked text-gold uppercase font-semibold">
                DATE
              </span>
              <p className="font-cinzel text-xs tracking-wider text-taupe-dark font-medium mt-0.5">
                {dateFormattedUpper}
              </p>
            </div>

            {/* TIME BLOCK */}
            <div className="flex flex-col items-center">
              <span className="font-cinzel text-[9px] tracking-loose-tracked text-gold uppercase font-semibold">
                TIME
              </span>
              <p className="font-serif text-sm font-semibold text-taupe-dark mt-0.5">
                {timeUpper}
              </p>
            </div>

            {/* VENUE BLOCK */}
            <div className="flex flex-col items-center">
              <span className="font-cinzel text-[9px] tracking-loose-tracked text-gold uppercase font-semibold">
                VENUE
              </span>
              <p className="font-cinzel text-xs tracking-wider text-taupe-dark font-semibold mt-0.5 uppercase">
                {event.venue}
              </p>
              <p className="font-serif italic text-xs text-taupe/75 mt-0.5">
                {event.address}
              </p>
            </div>

            {/* Attire note */}
            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] font-serif text-gold-dark italic">
              <Sparkles className="w-3 h-3 text-gold" />
              <span>Attire: {event.attire}</span>
            </div>
          </div>

          {/* Pill "View Map" Button with Pin Icon */}
          <div className="mt-6 w-full flex justify-center">
            <a
              href={event.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-gold/60 bg-cream/95 hover:bg-blush-50 text-taupe-dark hover:text-gold-dark font-cinzel text-xs tracking-tracked uppercase shadow-xs hover:shadow-gold-glow hover:border-gold transition-all duration-300 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-gold group-hover:scale-110 transition-transform" />
              <span>View Map</span>
              <ExternalLink className="w-3 h-3 text-taupe/50 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const SectionEventCards: React.FC = () => {
  return (
    <section
      id="section-event-cards"
      className="relative py-18 px-6 paper-texture bg-cream"
    >
      <div className="max-w-[420px] mx-auto text-center">
        {/* Section Heading */}
        <Reveal delay={0.1} className="mb-12">
          <span className="font-cinzel text-xs tracking-loose-tracked text-gold uppercase block mb-1">
            The Auspicious Occasion
          </span>
          <h2 className="font-script text-4xl sm:text-5xl text-taupe-dark mb-2">
            Wedding Celebration
          </h2>
          <p className="font-serif italic text-sm text-taupe/80 max-w-xs mx-auto">
            We warmly invite you to celebrate with us the joyous union of our wedding day.
          </p>
        </Reveal>

        {/* Stacked Illustrated Event Cards with Generous Spacing */}
        <div className="space-y-12">
          {INVITATION_DATA.events.map((event, index) => (
            <EventCardItem key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionEventCards;
