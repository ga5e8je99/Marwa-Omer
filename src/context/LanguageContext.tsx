'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS, type Language, type TranslationData } from '../data/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: TranslationData;
  dir: 'rtl' | 'ltr';
  isArabic: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'wedding_invitation_language_pref';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('ar'); // Default: Arabic for this Egyptian wedding

  // Language Preference Detection on mount
  useEffect(() => {
    try {
      // 1. URL Query Parameter takes highest priority (?lang=ar or ?lang=en)
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang === 'en' || urlLang === 'ar') {
          setLangState(urlLang);
          return;
        }
      }

      // 2. Saved preference in localStorage
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (savedLang === 'ar' || savedLang === 'en') {
        setLangState(savedLang);
        return;
      }

      // 3. Default to Arabic for Rahma & omar's wedding
      setLangState('ar');
    } catch (e) {
      console.warn('Language preference error:', e);
    }
  }, []);

  // Update DOM dir & lang whenever lang changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [lang]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch (e) {
      console.warn('Could not save language to localStorage:', e);
    }
  };

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const value: LanguageContextType = {
    lang,
    setLang,
    toggleLang,
    t: TRANSLATIONS[lang],
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    isArabic: lang === 'ar',
  };

  return (
    <LanguageContext.Provider value={value}>
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className={lang === 'ar' ? 'font-cairo' : 'font-sans'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
