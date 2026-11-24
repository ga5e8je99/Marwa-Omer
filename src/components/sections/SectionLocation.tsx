'use client';

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
      aria-label="موقع حفل الزفاف وخريطة الوصول"
    >
      {/* Ambient background watercolor blooms */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-rose-light/40 blur-[80px]" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-gold/25 blur-[90px]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] mx-auto flex flex-col items-center text-center">
        {/* Top Tag */}
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream/90 border border-gold/40 shadow-xs mb-2">
            <MapPin className="w-4 h-4 text-[#78550E]" />
            <span className="font-cairo text-xs font-bold text-[#78550E] uppercase">
              موقع الحفل ومسار الطريق
            </span>
          </div>
        </Reveal>

        {/* Script Heading */}
        <Reveal delay={0.1}>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#78550E] py-1 drop-shadow-xs">
            خريطة الوصول
          </h2>
        </Reveal>

        {/* Sub-caption */}
        <Reveal delay={0.15}>
          <p className="font-serif italic text-sm text-taupe-dark/80 max-w-[320px] mb-6 leading-relaxed">
            يسعدنا ويشرفنا حضوركم ومشاركتكم لنا فرحة العمر في هذا المكان الجميل
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
            <span className="text-gold text-sm mb-1">✤</span>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-taupe-dark">
              {venue.title}
            </h3>
            <p className="font-cairo text-xs sm:text-sm font-semibold text-[#78550E] mt-1">
              {venue.subtitle}
            </p>
          </div>

          {/* Full Address Display (Copyable!) */}
          <div className="my-5 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blush flex items-center justify-center border border-gold/40 text-[#78550E] shadow-xs mb-3">
              <MapPin className="w-6 h-6 text-[#78550E]" />
            </div>
            <p className="font-cairo font-medium text-sm sm:text-base text-taupe-dark max-w-[300px] leading-relaxed select-text">
              {venue.fullAddress}
            </p>
          </div>

          {/* Map Preview Box */}
          <div className="w-full rounded-2xl overflow-hidden border border-gold/40 shadow-inner bg-[#FBF4EF] relative mb-5 h-[230px] sm:h-[260px]">
            <iframe
              title="خريطة موقع حفل الزفاف"
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
              <span className="font-cairo text-[11px] font-bold text-taupe-dark">
                خرائط جوجل المباشرة
              </span>
            </div>

            {/* Direct Open Overlay */}
            <a
              href={venue.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 z-20 px-3.5 py-2 min-h-[36px] rounded-full bg-cream/95 hover:bg-white text-taupe-dark border border-gold/40 shadow-xs flex items-center gap-1.5 font-cairo text-xs font-bold transition-transform active:scale-95"
            >
              <span>فتح الخريطة</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#78550E]" />
            </a>
          </div>

          {/* Venue Highlights: Valet Parking & Arrival Notice */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-right" dir="rtl">
            <div className="p-3.5 rounded-xl bg-blush/45 border border-gold/25 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center border border-gold/30 shrink-0">
                <Car className="w-4 h-4 text-[#78550E]" />
              </div>
              <div>
                <h4 className="font-cairo text-xs font-bold text-[#78550E]">
                  خدمة صف السيارات (فاليه)
                </h4>
                <p className="font-cairo text-xs text-taupe-dark leading-snug mt-0.5">
                  {venue.valetParking}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blush/45 border border-gold/25 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center border border-gold/30 shrink-0">
                <Clock className="w-4 h-4 text-[#78550E]" />
              </div>
              <div>
                <h4 className="font-cairo text-xs font-bold text-[#78550E]">
                  موعد الحضور
                </h4>
                <p className="font-cairo text-xs text-taupe-dark leading-snug mt-0.5">
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
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 min-h-[44px] rounded-full bg-gradient-to-r from-gold via-gold-shimmer to-gold-dark text-white font-cairo text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-shadow cursor-pointer select-none"
            >
              <Navigation className="w-4 h-4" />
              <span>الاتجاهات عبر خرائط جوجل</span>
            </motion.a>

            {/* Secondary Button: Copy Address */}
            <motion.button
              type="button"
              onClick={handleCopyAddress}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 py-3 px-5 min-h-[44px] rounded-full bg-cream border border-gold/60 text-taupe-dark font-cairo text-xs sm:text-sm font-bold hover:bg-blush transition-colors cursor-pointer select-none"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">تم نسخ العنوان بنجاح!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#78550E]" />
                  <span>نسخ العنوان</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Bottom subtle blessing */}
        <Reveal delay={0.3} className="mt-6 flex items-center justify-center gap-2 text-taupe-dark/80 text-xs sm:text-sm">
          <Sparkles className="w-4 h-4 text-gold shrink-0" />
          <span className="font-cairo font-medium">أنار الله دروبكم ورافقتكم السلامة • ننتظركم بكل محبة</span>
        </Reveal>
      </div>
    </section>
  );
};

export default SectionLocation;
