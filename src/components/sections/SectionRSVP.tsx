'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Check } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { CustomSelect } from '../common/CustomSelect';
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

    try {
      await submitRsvp({
        name: formData.name.trim(),
        guests: formData.guests,
        attending: formData.attending,
        events: ['wedding'],
        message: formData.message.trim(),
        submittedAt: new Date().toISOString(),
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };



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
          <div className="flex items-center justify-center mt-2">
            <span className="h-[1px] w-16 bg-gold/40" />
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
                        className={`py-2 px-3 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${formData.attending === 'yes'
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
                        className={`py-2 px-3 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${formData.attending === 'no'
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
                    <CustomSelect
                      label={t.rsvp.guestsLabel}
                      value={formData.guests}
                      onChange={(val) => setFormData({ ...formData, guests: val })}
                      options={t.rsvp.guestOptions}
                      dir={dir}
                    />
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

                  {/* 5. Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full py-3.5 px-6 min-h-[44px] rounded-full border border-gold/70 bg-gradient-to-r from-gold via-gold-shimmer to-gold text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span>{isSubmitting ? t.rsvp.submitting : t.rsvp.submitButton}</span>
                    </button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default SectionRSVP;
