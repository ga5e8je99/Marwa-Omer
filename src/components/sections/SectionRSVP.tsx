'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Heart, Send, Check } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { submitRsvp } from '../../utils/rsvp';
import { INVITATION_DATA } from '../../data/invitation';

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

// Initial heartfelt seed wishes so the guestbook looks vibrant
const INITIAL_ENTRIES: GuestbookEntry[] = [
  {
    name: 'أحمد ومي',
    message: 'ألف مبروك لأجمل عروسين، بارك الله لكما وبارك عليكما وجمع بينكما في خير وسعادة دائمة يا رب!',
    time: 'منذ قليل',
  },
  {
    name: 'سارة إبراهيم',
    message: 'ما شاء الله تبارك الرحمن، فرحة قلوبنا بكم لا توصف. ألف مبروك مروة وعمر وعقبال كل الأيام الحلوة.',
    time: 'منذ قليل',
  },
];

export const SectionRSVP: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    attending: 'yes',
    guests: 1,
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [entries, setEntries] = useState<GuestbookEntry[]>(INITIAL_ENTRIES);

  // Load stored guestbook entries on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rsvps');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted = parsed.map((item: any) => ({
            name: item.name || 'محب للعروسين',
            message: item.message || '',
            attending: item.attending || 'yes',
            time: item.submittedAt
              ? new Date(item.submittedAt).toLocaleDateString('ar-EG', {
                  month: 'short',
                  day: 'numeric',
                })
              : 'مؤخراً',
          }));
          setEntries((prev) => [...formatted, ...prev]);
        }
      }
    } catch (e) {
      console.warn('Could not read guestbook from localStorage', e);
    }
  }, []);

  const handleInputFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!formData.name.trim()) {
      errs.name = 'يرجى كتابة الاسم الكريم';
    }
    if (!formData.message.trim()) {
      errs.message = 'يرجى كتابة دعاء طيب أو كلمة تهنئة للعروسين';
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
      time: 'الآن',
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

  // WhatsApp prefilled link for direct instant transmission to bride/groom
  const whatsappText = encodeURIComponent(
    `تهنئة مباركة من: ${formData.name || 'أحد المهنئين'}\n` +
      `الحضور: ${formData.attending === 'yes' ? 'سأحضر بكل سرور إن شاء الله' : 'أعتذر بكل محبة ودعواتي لكما'}\n` +
      `الرسالة: ${formData.message || 'ألف مبروك الزفاف المبارك لمروة وعمر، بارك الله لكما وجمع بينكما في خير'}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

  return (
    <section
      id="section-rsvp"
      className="relative py-16 px-4 sm:px-6 paper-texture bg-gradient-to-b from-cream via-blush-50/60 to-cream flex flex-col justify-center"
      dir="rtl"
    >
      <div className="w-full max-w-[420px] mx-auto text-center">
        {/* Section Heading */}
        <Reveal delay={0.1} className="mb-8">
          <span className="font-cairo text-xs sm:text-sm font-bold tracking-wider text-[#78550E] uppercase block mb-1">
            أجمل التهاني والدعوات
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-taupe-dark">
            دفتر التهاني والتبريكات
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-[1px] w-10 bg-gold/40" />
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="h-[1px] w-10 bg-gold/40" />
          </div>
          <p className="font-serif italic text-sm text-taupe-dark/85 mt-2 leading-relaxed">
            شاركونا فرحتنا بكلمة طيبة أو دعاء مبارك يسعد قلب مروة وعمر.
          </p>
        </Reveal>

        {/* Form Card */}
        <Reveal delay={0.2}>
          <div className="relative rounded-[28px] border border-gold/45 bg-blush-50/85 backdrop-blur-md p-6 sm:p-7 shadow-paper overflow-hidden text-right">
            <div className="absolute inset-2 rounded-[22px] border border-gold/25 pointer-events-none" />

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                /* Animated Thank You State */
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
                    شكراً لك، {formData.name}
                  </h3>

                  <p className="font-cairo text-sm sm:text-base text-taupe-dark leading-relaxed max-w-[280px]">
                    كلماتكم الطيبة ودعواتكم الصادقة تزيد فرحتنا نوراً وسعادة. تم حفظ التهنئة في دفتر الزفاف!
                  </p>

                  {/* Direct WhatsApp Share */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-cairo text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer mt-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>إرسال التهنئة عبر واتساب أيضاً</span>
                  </a>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', attending: 'yes', guests: 1, message: '' });
                    }}
                    className="text-xs text-[#78550E] underline font-cairo mt-3 cursor-pointer"
                  >
                    إرسال تهنئة أخرى
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* 1. Name Input */}
                  <div>
                    <label className="block font-cairo text-xs sm:text-sm font-bold text-[#78550E] mb-1">
                      الاسم الكريم *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onFocus={handleInputFocus}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      placeholder="اكتب اسمك الكريم هنا..."
                      className="w-full border-0 border-b-2 border-gold/40 bg-transparent focus:border-gold focus:outline-none focus:ring-0 rounded-none px-2 py-2 text-taupe-dark font-cairo text-sm sm:text-base placeholder:text-taupe/50 transition-colors"
                    />
                    {errors.name && (
                      <p className="text-xs font-cairo text-rose-600 mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* 2. Attendance Status */}
                  <div>
                    <label className="block font-cairo text-xs sm:text-sm font-bold text-[#78550E] mb-2">
                      تأكيد الحضور
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, attending: 'yes' })}
                        className={`py-2 px-3 min-h-[44px] rounded-xl font-cairo text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          formData.attending === 'yes'
                            ? 'bg-[#78550E] text-white border-[#78550E] shadow-xs'
                            : 'bg-cream/80 text-taupe-dark border-gold/40 hover:border-gold'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 shrink-0" />
                        <span>سأحضر بكل سرور</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, attending: 'no' })}
                        className={`py-2 px-3 min-h-[44px] rounded-xl font-cairo text-xs sm:text-sm font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          formData.attending === 'no'
                            ? 'bg-[#78550E] text-white border-[#78550E] shadow-xs'
                            : 'bg-cream/80 text-taupe-dark border-gold/40 hover:border-gold'
                        }`}
                      >
                        <span>أعتذر بكل محبة</span>
                      </button>
                    </div>
                  </div>

                  {/* 3. Number of companions */}
                  {formData.attending === 'yes' && (
                    <div>
                      <label className="block font-cairo text-xs sm:text-sm font-bold text-[#78550E] mb-1">
                        عدد المرافقين
                      </label>
                      <select
                        value={formData.guests}
                        onChange={(e) =>
                          setFormData({ ...formData, guests: Number(e.target.value) })
                        }
                        className="w-full bg-cream/90 border border-gold/45 rounded-xl px-3 py-2.5 font-cairo text-xs sm:text-sm text-taupe-dark focus:border-gold focus:outline-none min-h-[44px]"
                      >
                        <option value={1}>شخص واحد (أنا فقط)</option>
                        <option value={2}>شخصان (أنا ومرافق)</option>
                        <option value={3}>3 أشخاص</option>
                        <option value={4}>4 أشخاص أو أكثر (عائلة)</option>
                      </select>
                    </div>
                  )}

                  {/* 4. Warm Wishes / Message */}
                  <div>
                    <label className="block font-cairo text-xs sm:text-sm font-bold text-[#78550E] mb-1">
                      كلمة تهنئة أو دعاء طيب للعروسين *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onFocus={handleInputFocus}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      placeholder="اكتب دعاءك المبارك أو تهنئتك لمروة وعمر..."
                      className="w-full border-0 border-b-2 border-gold/40 bg-transparent focus:border-gold focus:outline-none focus:ring-0 rounded-none px-2 py-2 text-taupe-dark font-cairo text-sm sm:text-base placeholder:text-taupe/50 resize-none transition-colors"
                    />
                    {errors.message && (
                      <p className="text-xs font-cairo text-rose-600 mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* 5. Submit Buttons */}
                  <div className="pt-2 flex flex-col gap-2.5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full py-3.5 px-6 min-h-[44px] rounded-full border border-gold/70 bg-gradient-to-r from-gold via-gold-shimmer to-gold text-white font-cairo text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span>{isSubmitting ? 'جارٍ الإرسال...' : 'إضافة التهنئة إلى دفتر الحفل'}</span>
                    </button>

                    {/* Direct WhatsApp Share Option */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 min-h-[44px] rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-cairo text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>إرسال التهنئة عبر واتساب للعروسين مباشرة</span>
                    </a>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        {/* Live Guestbook Wall (Shows recent blessings and wishes) */}
        <div className="mt-10 text-right">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-cairo font-bold text-sm sm:text-base text-taupe-dark flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose fill-rose/40" />
              <span>أحدث التهاني في دفتر الزفاف ({entries.length})</span>
            </h3>
            <span className="font-cairo text-xs text-[#78550E] font-semibold">مباشر</span>
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
                  <span className="font-cairo font-bold text-xs sm:text-sm text-[#78550E]">
                    {entry.name}
                  </span>
                  <span className="font-cairo text-[11px] text-taupe/60">
                    {entry.time}
                  </span>
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
