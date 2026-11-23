import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Copy, Check, Car, Clock, Sparkles, ExternalLink } from 'lucide-react';
import { INVITATION_DATA } from '../../data/invitation';
import { Reveal } from '../common/Reveal';

export const SectionLocation: React.FC = () => {
  const { venue } = INVITATION_DATA;
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(venue.fullAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      }
    } catch (err) {
      console.warn('Failed to copy address:', err);
    }
  };

  return (
    <section
      id="section-location"
      className="relative w-full py-16 px-4 sm:px-6 flex flex-col items-center bg-cream/70 overflow-hidden"
      aria-label="Wedding Venue & Location"
    >
      {/* Ambient background watercolor blooms */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-rose-light/40 blur-[80px]" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-gold/25 blur-[90px]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] mx-auto flex flex-col items-center text-center">
        {/* Top Tag */}
        <Reveal>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cream/90 border border-gold/40 shadow-xs mb-2">
            <MapPin className="w-3.5 h-3.5 text-gold-dark" />
            <span className="font-cinzel text-[10px] tracking-loose-tracked text-gold-dark uppercase font-semibold">
              VENUE &amp; DIRECTIONS
            </span>
          </div>
        </Reveal>

        {/* Script Heading */}
        <Reveal delay={0.1}>
          <h2 className="font-script text-5xl sm:text-6xl text-gold-gradient py-1 drop-shadow-xs">
            The Location
          </h2>
        </Reveal>

        {/* Sub-caption */}
        <Reveal delay={0.15}>
          <p className="font-serif italic text-sm text-taupe/80 max-w-[320px] mb-6 leading-relaxed">
            We look forward to celebrating together in this picturesque setting
          </p>
        </Reveal>

        {/* Main Venue Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full bg-cream/95 backdrop-blur-md rounded-3xl border border-gold/45 shadow-paper p-5 sm:p-7 flex flex-col items-center"
        >
          {/* Header Inscription */}
          <div className="w-full pb-4 border-b border-gold/25 flex flex-col items-center">
            <span className="text-gold text-xs mb-1">✤</span>
            <h3 className="font-serif font-semibold text-xl sm:text-2xl text-taupe-dark">
              {venue.title}
            </h3>
            <p className="font-cinzel text-[11px] tracking-loose-tracked text-gold-dark uppercase font-medium mt-1">
              {venue.subtitle}
            </p>
          </div>

          {/* Full Address Display */}
          <div className="my-5 flex flex-col items-center">
            <div className="w-11 h-11 rounded-full bg-blush flex items-center justify-center border border-gold/40 text-gold-dark shadow-xs mb-3">
              <MapPin className="w-5 h-5 text-gold-dark" />
            </div>
            <p className="font-serif italic text-sm sm:text-base text-taupe-dark max-w-[290px] leading-relaxed">
              {venue.fullAddress}
            </p>
          </div>

          {/* Map Preview Box (Stylized illustrated map + Google Maps Embed) */}
          <div className="w-full rounded-2xl overflow-hidden border border-gold/40 shadow-inner bg-[#FBF4EF] relative mb-5 h-[230px] sm:h-[260px]">
            {/* Illustrated map graphic backdrop */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <svg width="100%" height="100%" viewBox="0 0 400 260" preserveAspectRatio="none">
                <path d="M 0 50 Q 120 70 200 40 T 400 60" fill="none" stroke="#D9B77A" strokeWidth="1.5" strokeOpacity="0.4" />
                <path d="M 40 0 Q 80 120 180 150 T 360 260" fill="none" stroke="#D9B77A" strokeWidth="2" strokeOpacity="0.5" />
                <path d="M 0 180 Q 150 140 260 200 T 400 220" fill="none" stroke="#E2C58E" strokeWidth="1.2" strokeOpacity="0.3" strokeDasharray="4 4" />
                <circle cx="200" cy="120" r="45" fill="#F4E3DF" fillOpacity="0.5" />
                <circle cx="200" cy="120" r="28" fill="#E8D1CB" fillOpacity="0.6" />
              </svg>
            </div>

            {/* Embedded Interactive Google Map Iframe */}
            <iframe
              title="Wedding Venue Map"
              src={venue.embedMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full relative z-10 opacity-95 filter saturate-[0.85] contrast-[1.05]"
            />

            {/* Live Navigation Badge Pill */}
            <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-full bg-cream/95 backdrop-blur-xs border border-gold/45 shadow-xs flex items-center gap-1.5 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-cinzel text-[9px] tracking-wider text-taupe-dark uppercase font-semibold">
                Live Google Map
              </span>
            </div>

            {/* Direct Open Overlay in Bottom-Right */}
            <a
              href={venue.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-full bg-cream/95 hover:bg-white text-taupe-dark border border-gold/40 shadow-xs flex items-center gap-1.5 font-cinzel text-[9px] tracking-wider font-semibold transition-transform active:scale-95"
            >
              <span>View Larger</span>
              <ExternalLink className="w-3 h-3 text-gold-dark" />
            </a>
          </div>

          {/* Venue Highlights: Valet Parking & Arrival Notice */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-left">
            <div className="p-3.5 rounded-xl bg-blush/45 border border-gold/25 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-cream flex items-center justify-center border border-gold/30 shrink-0">
                <Car className="w-3.5 h-3.5 text-gold-dark" />
              </div>
              <div>
                <h4 className="font-cinzel text-[9px] tracking-wider text-gold-dark uppercase font-bold">
                  PARKING &amp; VALET
                </h4>
                <p className="font-serif text-xs text-taupe-dark leading-snug mt-0.5">
                  {venue.valetParking}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blush/45 border border-gold/25 flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-cream flex items-center justify-center border border-gold/30 shrink-0">
                <Clock className="w-3.5 h-3.5 text-gold-dark" />
              </div>
              <div>
                <h4 className="font-cinzel text-[9px] tracking-wider text-gold-dark uppercase font-bold">
                  GUEST ARRIVAL
                </h4>
                <p className="font-serif text-xs text-taupe-dark leading-snug mt-0.5">
                  {venue.arrivalNotice}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons: Open in Google Maps & Copy Address */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            {/* Primary Button: Open in Google Maps */}
            <motion.a
              href={venue.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-gradient-to-r from-gold via-gold-shimmer to-gold-dark text-white font-cinzel text-xs font-semibold tracking-wider shadow-md hover:shadow-lg transition-shadow cursor-pointer select-none"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>OPEN IN GOOGLE MAPS</span>
            </motion.a>

            {/* Secondary Button: Copy Address */}
            <motion.button
              type="button"
              onClick={handleCopyAddress}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full bg-cream border border-gold/60 text-taupe-dark font-cinzel text-xs font-medium tracking-wider hover:bg-blush transition-colors cursor-pointer select-none"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gold-dark" />
                  <span>COPY ADDRESS</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Bottom subtle blessing */}
        <Reveal delay={0.3} className="mt-6 flex items-center justify-center gap-2 text-taupe/65 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-gold/60" />
          <span className="font-serif italic">May your journey to us be safe and blessed</span>
        </Reveal>
      </div>
    </section>
  );
};

export default SectionLocation;
