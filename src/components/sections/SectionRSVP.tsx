import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { submitRsvp } from '../../utils/rsvp';
import { INVITATION_DATA } from '../../data/invitation';

interface FormState {
  name: string;
  message: string;
}

interface FormErrors {
  name?: string;
  message?: string;
}

export const SectionRSVP: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Scroll active input into view for mobile keyboards
  const handleInputFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.name.trim()) {
      errs.name = 'Please provide your name';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please leave your warm wishes or prayer';
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
        guests: 1,
        attending: 'yes',
        events: [],
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
      className="relative py-18 px-5 sm:px-6 paper-texture bg-gradient-to-b from-cream via-blush-50/60 to-cream min-h-[100dvh] flex flex-col justify-center select-none"
    >
      <div className="w-full max-w-[420px] mx-auto text-center">
        {/* Section Heading */}
        <Reveal delay={0.1} className="mb-8">
          <span className="font-cinzel text-xs tracking-loose-tracked text-gold uppercase block mb-1">
            Wishes &amp; Prayers
          </span>
          <h2 className="font-script text-5xl sm:text-6xl text-taupe-dark">
            Guestbook
          </h2>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <span className="h-[1px] w-8 bg-gold/40" />
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span className="h-[1px] w-8 bg-gold/40" />
          </div>
          <p className="font-serif italic text-xs sm:text-sm text-taupe/80 mt-2">
            Leave a heartfelt prayer or blessing for Marwa &amp; Omer.
          </p>
        </Reveal>

        {/* Translucent Frosted Blush Card */}
        <Reveal delay={0.2}>
          <div className="relative rounded-[24px] border border-gold/45 bg-blush-50/75 backdrop-blur-md p-6 sm:p-8 shadow-paper overflow-hidden text-left">
            {/* Inner Hairline Border */}
            <div className="absolute inset-2 rounded-[20px] border border-gold/25 pointer-events-none" />

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                /* Animated Thank You State */
                <motion.div
                  key="thank-you"
                  initial={{ opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="py-10 text-center flex flex-col items-center justify-center space-y-4"
                >
                  {/* Gold Check Drawing Itself */}
                  <div className="w-16 h-16 flex items-center justify-center mb-1">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 64 64"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Circle Drawing */}
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="#C9A24B"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                      />
                      {/* Checkmark Drawing */}
                      <motion.path
                        d="M 20 33 L 28 41 L 44 23"
                        stroke="#B8913A"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{
                          duration: 0.55,
                          delay: 0.45,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      />
                    </svg>
                  </div>

                  {/* Message */}
                  <h3 className="font-script text-4xl sm:text-5xl text-gold-gradient py-0.5">
                    Thank You, {formData.name}
                  </h3>

                  <p className="font-serif italic text-sm sm:text-base text-taupe leading-relaxed max-w-[280px]">
                    "Your beautiful words and prayers will be a treasured gift to us."
                  </p>

                  <div className="flex items-center gap-1.5 pt-4 text-xs font-serif text-gold-dark italic">
                    <Heart className="w-3.5 h-3.5 text-rose fill-rose/30" />
                    <span>Stored in guestbook · {INVITATION_DATA.couple.bride.firstName} &amp; {INVITATION_DATA.couple.groom.firstName}</span>
                  </div>
                </motion.div>
              ) : (
                /* RSVP Form with Underline-Style Inputs */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 1. YOUR NAME */}
                  <div>
                    <label className="block font-cinzel text-[10px] tracking-loose-tracked text-gold-dark uppercase font-semibold mb-1">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onFocus={handleInputFocus}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      placeholder="Name"
                      className="w-full border-0 border-b border-gold/40 bg-transparent focus:border-gold focus:outline-none focus:ring-0 rounded-none px-1 py-2 text-taupe-dark font-serif text-base placeholder:text-taupe/40 placeholder:italic transition-colors"
                    />
                    {errors.name && (
                      <p className="text-[11px] font-serif italic text-rose-dark mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* 2. WARM WISHES / MESSAGE */}
                  <div>
                    <label className="block font-cinzel text-[10px] tracking-loose-tracked text-gold-dark uppercase font-semibold mb-1">
                      WARM WISHES / MESSAGE *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onFocus={handleInputFocus}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      placeholder="Leave a heartfelt prayer or dua for the couple..."
                      className="w-full border-0 border-b border-gold/40 bg-transparent focus:border-gold focus:outline-none focus:ring-0 rounded-none px-1 py-2 text-taupe-dark font-serif text-base placeholder:text-taupe/40 placeholder:italic resize-none transition-colors"
                    />
                    {errors.message && (
                      <p className="text-[11px] font-serif italic text-rose-dark mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* 3. SUBMIT BUTTON */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full py-3.5 px-6 rounded-full border border-gold/70 bg-cream/90 text-taupe-dark font-cinzel text-xs tracking-loose-tracked uppercase shadow-xs hover:bg-gradient-to-r hover:from-gold-metallic hover:via-gold-shimmer hover:to-gold-metallic hover:text-cream hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span>{isSubmitting ? 'Sending...' : 'SEND MESSAGE'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gold-dark group-hover:text-cream group-hover:translate-x-1 transition-transform" />
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
