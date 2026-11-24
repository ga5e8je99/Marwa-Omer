'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Heart, Send, Check } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { submitRsvp } from '../../utils/rsvp';
import { useLanguage } from '../../context/LanguageContext';

interface FormState {
  name: string;
  attending: 'yes' | 'no';
  guests: number;
  message: string;
}

interface FormErrors {
  name?: string;
  message?: string;
}

interface GuestbookEntry {
  name: string;
  message: string;
  attending?: 'yes' | 'no';
  time: string;
}

export const SectionRSVP: React.FC = () => {
  const { t, isArabic, dir } = useLanguage();
  const [formData, setFormData] = useState<FormState>({
    name: '',
    attending: 'yes',
    guests: 1,
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [entries, setEntries] = useState<GuestbookEntry[]>(t.rsvp.defaultEntries);

  // Sync default entries if language changes
  useEffect(() => {
    setEntries(t.rsvp.defaultEntries);
    try {
      const stored = localStorage.getItem('rsvps');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted = parsed.map((item: any) => ({
            name: item.name || (isArabic ? 'محب للعروسين' : 'Well-wisher'),
            message: item.message || '',
            attending: item.attending || 'yes',
            time: item.submittedAt
              ? new Date(item.submittedAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : isArabic
              ? 'مؤخراً'
              : 'Recently',
          }));
          setEntries((prev) => [...formatted, ...prev]);
        }
      }
    } catch (e) {
      console.warn('Could not read guestbook from localStorage', e);
    }
  }, [t, isArabic]);

  const handleInputFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!formData.name.trim()) {
      errs.name = isArabic ? 'يرجى كتابة الاسم الكريم' : 'Please provide your name';
    }
    if (!formData.message.trim()) {
      errs.message = isArabic ? 'يرجى كتابة دعاء طيب أو تهنئة للعروسين' : 'Please leave a prayer or message';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const newEntry: GuestbookEntry = {
      name: formData.name.trim(),
      message: formData.message.trim(),
      attending: formData.attending,
      time: isArabic ? 'الآن' : 'Just now',
    };

    try {
      await submitRsvp({
        name: formData.name.trim(),
        guests: formData.guests,
        attending: formData.attending,
        events: ['wedding'],
        message: formData.message.trim(),
        submittedAt: new Date().toISOString(),
      });

      setEntries((prev) => [newEntry, ...prev]);
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappText = encodeURIComponent(
    isArabic
      ? `تهنئة ومباركة من: ${formData.name || 'أحد المهنئين'}\n` +
          `الحضور: ${formData.attending === 'yes' ? 'سأحضر بكل سرور إن شاء الله' : 'أعتذر بكل محبة ودعواتي لكما'}\n` +
          `الرسالة: ${formData.message || 'ألف مليون مبروك الزفاف المبارك لمروة وعمر، ربنا يتمملكم على خير وسعادة'}`
      : `Wedding Blessing from: ${formData.name || 'A Well-Wisher'}\n` +
          `Attendance: ${formData.attending === 'yes' ? 'Joyfully Attending' : 'Regretfully Declining'}\n` +
          `Message: ${formData.message || 'Warmest congratulations to Marwa & Omer! May Allah bless your union with eternal happiness'}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  return (
    <section
      id="section-rsvp"
      className="relative py-16 px-4 sm:px-6 paper-texture bg-gradient-to-b from-cream via-blush-50/60 to-cream flex flex-col justify-center"
      dir={dir}
    >
      <div className="w-full max-w-[420px] mx-auto text-center">
        {/* Section Heading */}
        <Reveal delay={0.1} className="mb-8">
          <span className="text-xs sm:text-sm font-bold tracking-wider text-[#78550E] uppercase block mb-1">
            {t.rsvp.tag}
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-taupe-dark">
            {t.rsvp.title}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-[1px] w-10 bg-gold/40" />
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="h-[1px] w-10 bg-gold/40" />
          </div>
          <p className="font-serif italic text-sm text-taupe-dark/85 mt-2 leading-relaxed">
            {t.rsvp.subtitle}
          </p>
        </Reveal>

        {/* Form Card */}
        <Reveal delay={0.2}>
          <div className="relative rounded-[28px] border border-gold/45 bg-blush-50/85 backdrop-blur-md p-6 sm:p-7 shadow-paper overflow-hidden text-start">
            <div className="absolute inset-2 rounded-[22px] border border-gold/25 pointer-events-none" />

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="thank-you"
                  initial={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="py-8 text-center flex flex-col items-center justify-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-sm mb-1">
                    <Check className="w-8 h-8" />
                  </div>

                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#78550E]">
                    {t.rsvp.thankYouTitle.replace('{name}', formData.name)}
                  </h3>

                  <p className="text-sm sm:text-base text-taupe-dark leading-relaxed max-w-[280px]">
                    {t.rsvp.thankYouDesc}
                  </p>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer mt-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.rsvp.whatsappButton}</span>
                  </a>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', attending: 'yes', guests: 1, message: '' });
                    }}
                    className="text-xs text-[#78550E] underline mt-3 cursor-pointer"
                  >
                    {t.rsvp.sendAnother}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* 1. Name Input */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-[#78550E] mb-1">
                      {t.rsvp.nameLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onFocus={handleInputFocus}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      placeholder={t.rsvp.namePlaceholder}
                      className="w-full border-0 border-b-2 border-gold/40 bg-transparent focus:border-gold focus:outline-none focus:ring-0 rounded-none px-2 py-2 text-taupe-dark text-sm sm:text-base placeholder:text-taupe/50 transition-colors"
                    />
                    {errors.name && (
                      <p className="text-xs text-rose-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* 2. Attendance Status */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-[#78550E] mb-2">
                      {t.rsvp.attendingLabel}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, attending: 'yes' })}
                        className={`py-2 px-3 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          formData.attending === 'yes'
                            ? 'bg-[#78550E] text-white border-[#78550E] shadow-xs'
                            : 'bg-cream/80 text-taupe-dark border-gold/40 hover:border-gold'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.rsvp.attendYes}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, attending: 'no' })}
                        className={`py-2 px-3 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          formData.attending === 'no'
                            ? 'bg-[#78550E] text-white border-[#78550E] shadow-xs'
                            : 'bg-cream/80 text-taupe-dark border-gold/40 hover:border-gold'
                        }`}
                      >
                        <span>{t.rsvp.attendNo}</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. Number of companions */}
                  {formData.attending === 'yes' && (
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-[#78550E] mb-1">
                        {t.rsvp.guestsLabel}
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) =>
                          setFormData({ ...formData, guests: Number(e.target.value) })
                        }
                        className="w-full bg-cream/90 border border-gold/45 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-taupe-dark focus:border-gold focus:outline-none min-h-[44px]"
                      >
                        {t.rsvp.guestOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* 4. Message */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-[#78550E] mb-1">
                      {t.rsvp.messageLabel}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onFocus={handleInputFocus}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      placeholder={t.rsvp.messagePlaceholder}
                      className="w-full border-0 border-b-2 border-gold/40 bg-transparent focus:border-gold focus:outline-none focus:ring-0 rounded-none px-2 py-2 text-taupe-dark text-sm sm:text-base placeholder:text-taupe/50 resize-none transition-colors"
                    />
                    {errors.message && (
                      <p className="text-xs text-rose-600 mt-1">{errors.message}</p>
                    )}
                  </div>

                  {/* 5. Submit Buttons */}
                  <div className="pt-2 flex flex-col gap-2.5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full py-3.5 px-6 min-h-[44px] rounded-full border border-gold/70 bg-gradient-to-r from-gold via-gold-shimmer to-gold text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span>{isSubmitting ? t.rsvp.submitting : t.rsvp.submitButton}</span>
                    </button>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 min-h-[44px] rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{t.rsvp.whatsappButton}</span>
                    </a>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        {/* Live Guestbook Wall */}
        <div className="mt-10 text-start">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-sm sm:text-base text-taupe-dark flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose fill-rose/40" />
              <span>
                {t.rsvp.recentWishes} ({entries.length})
              </span>
            </h3>
            <span className="text-xs text-[#78550E] font-semibold">{t.rsvp.liveBadge}</span>
          </div>

          <div className="space-y-3">
            {entries.slice(0, 4).map((entry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-4 rounded-2xl bg-cream/95 border border-gold/30 shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs sm:text-sm text-[#78550E]">
                    {entry.name}
                  </span>
                  <span className="text-[11px] text-taupe/60">{entry.time}</span>
                </div>
                <p className="font-serif italic text-xs sm:text-sm text-taupe-dark leading-relaxed">
                  "{entry.message}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionRSVP;
