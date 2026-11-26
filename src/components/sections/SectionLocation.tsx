'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Copy, Check, Car, Clock, ExternalLink } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { useLanguage } from '../../context/LanguageContext';

export const SectionLocation: React.FC = () => {
  const { t, dir } = useLanguage();
  const [copied, setCopied] = useState(false);

  const googleMapsUrl = 'https://maps.google.com/?q=Riviera+Hall+Ismailia+Egypt';
  const embedMapUrl = 'https://maps.google.com/maps?q=Riviera+Hall+Ismailia+Egypt&t=&z=14&ie=UTF8&iwloc=&output=embed';

  const handleCopyAddress = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(t.location.fullAddress);
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
      className="relative w-full min-h-[100dvh] py-6 sm:py-8 px-4 flex flex-col items-center justify-center bg-cream/70 overflow-hidden snap-start snap-always"
      aria-label={t.location.title}
      dir={dir}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-rose-light/40 blur-[80px]" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-gold/25 blur-[90px]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] mx-auto flex flex-col items-center text-center">
        {/* Top Tag & Title */}
        <Reveal>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream/90 border border-gold/40 shadow-xs mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#78550E]" />
            <span className="text-[11px] font-bold text-[#78550E] uppercase">
              {t.location.tag}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#78550E] py-0.5 drop-shadow-xs">
            {t.location.title}
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="font-serif italic text-xs text-taupe-dark/80 max-w-[300px] mb-3 leading-relaxed">
            {t.location.subtitle}
          </p>
        </Reveal>

        {/* Main Venue Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full bg-cream/95 backdrop-blur-md rounded-2xl border border-gold/45 shadow-paper p-4 sm:p-5 flex flex-col items-center"
        >
          {/* Header Inscription */}
          <div className="w-full pb-2.5 border-b border-gold/25 flex flex-col items-center">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-taupe-dark">
              {t.location.venueTitle}
            </h3>
            <p className="text-xs font-semibold text-[#78550E] mt-0.5">
              {t.location.fullAddress}
            </p>
          </div>

          {/* Map Preview Box (Compact) */}
          <div className="w-full rounded-xl overflow-hidden border border-gold/40 shadow-inner bg-[#FBF4EF] relative my-3 h-[135px] sm:h-[160px]">
            <iframe
              title="خريطة موقع حفل الزفاف"
              src={embedMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full relative z-10 opacity-95 filter saturate-[0.85] contrast-[1.05]"
            />

            {/* Live Navigation Badge Pill */}
            <div className="absolute top-2 left-2 z-20 px-2.5 py-0.5 rounded-full bg-cream/95 backdrop-blur-xs border border-gold/45 shadow-xs flex items-center gap-1.5 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-taupe-dark">
                {t.location.mapBadge}
              </span>
            </div>

            {/* Direct Open Overlay */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 right-2 z-20 px-2.5 py-1 rounded-full bg-cream/95 hover:bg-white text-taupe-dark border border-gold/40 shadow-xs flex items-center gap-1 text-[11px] font-bold transition-transform active:scale-95"
            >
              <span>{t.location.viewLarger}</span>
              <ExternalLink className="w-3 h-3 text-[#78550E]" />
            </a>
          </div>

          {/* Highlights: Valet Parking & Arrival Notice (Compact) */}
          <div className="w-full grid grid-cols-2 gap-2 mb-3.5 text-start">
            <div className="p-2 rounded-lg bg-blush/45 border border-gold/25 flex items-center gap-2">
              <Car className="w-3.5 h-3.5 text-[#78550E] shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-[#78550E] block leading-tight">
                  {t.location.valetTitle}
                </span>
                <span className="text-[10px] text-taupe-dark leading-tight block truncate">
                  {t.location.valetDesc}
                </span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-blush/45 border border-gold/25 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#78550E] shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-[#78550E] block leading-tight">
                  {t.location.arrivalTitle}
                </span>
                <span className="text-[10px] text-taupe-dark leading-tight block truncate">
                  {t.location.arrivalDesc}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex gap-2">
            <motion.a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-gradient-to-r from-gold via-gold-shimmer to-gold-dark text-white text-xs font-bold shadow-xs hover:shadow-sm transition-shadow cursor-pointer select-none"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{t.location.openMapsButton}</span>
            </motion.a>

            <motion.button
              type="button"
              onClick={handleCopyAddress}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-cream border border-gold/60 text-taupe-dark text-xs font-bold hover:bg-blush transition-colors cursor-pointer select-none"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">{t.location.copiedText}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#78550E]" />
                  <span>{t.location.copyAddressButton}</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SectionLocation;
