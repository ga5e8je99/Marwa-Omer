'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      type="button"
      className={`group flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-full bg-cream/95 backdrop-blur-md border border-gold/50 shadow-soft-float hover:border-gold hover:shadow-gold-glow text-[#78550E] font-medium transition-all active:scale-95 cursor-pointer select-none text-xs ${className}`}
      aria-label={lang === 'ar' ? 'التبديل إلى اللغة الإنجليزية' : 'Switch to Egyptian Arabic'}
      title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى اللهجة المصرية'}
    >
      <Globe className="w-3.5 h-3.5 text-gold-dark group-hover:rotate-45 transition-transform duration-300" />
      <span className="font-semibold tracking-wide">
        {lang === 'ar' ? 'English' : 'عربي (مصري)'}
      </span>
    </button>
  );
};

export default LanguageToggle;
