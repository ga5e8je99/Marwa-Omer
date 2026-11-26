'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

// Audio asset and configuration
import { MUSIC_CONFIG, getEffectiveMusicStartTime, getEffectiveMusicEndTime, fetchServerMusicConfig } from './config/audio';
const bgMusic = MUSIC_CONFIG.src;

// Context & Reusable components
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AudioPlayer } from './components/common/AudioPlayer';

// Sections in order
import { SectionEnvelopeIntro } from './components/sections/SectionEnvelopeIntro';
import { SectionHero } from './components/sections/SectionHero';
import { SectionEventCards } from './components/sections/SectionEventCards';
import { SectionLocation } from './components/sections/SectionLocation';
import { SectionCountdown } from './components/sections/SectionCountdown';
import { SectionRSVP } from './components/sections/SectionRSVP';
import { SectionOurStory } from './components/sections/SectionOurStory';
import { SectionClosing } from './components/sections/SectionClosing';

const SECTION_IDS = [
  'section-hero',
  'section-event-cards',
  'section-location',
  'section-countdown',
  'section-rsvp',
  'section-our-story',
  'section-closing',
] as const;

const SECTION_LABELS: Record<string, { ar: string; en: string }> = {
  'section-hero': { ar: 'الرئيسية', en: 'Hero' },
  'section-event-cards': { ar: 'المناسبة', en: 'Event' },
  'section-location': { ar: 'الموقع', en: 'Venue' },
  'section-countdown': { ar: 'العد التنازلي', en: 'Countdown' },
  'section-rsvp': { ar: 'تأكيد الحضور', en: 'RSVP' },
  'section-our-story': { ar: 'قصتنا', en: 'Our Story' },
  'section-closing': { ar: 'الخاتمة', en: 'Blessing' },
};

const MainAppContent: React.FC = () => {
  const { dir, isArabic } = useLanguage();
  const [isIntroDismissed, setIsIntroDismissed] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('opened')) {
      return true;
    }
    return false;
  });
  const [isHeroRevealed, setIsHeroRevealed] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('opened')) {
      return true;
    }
    return false;
  });
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const isAutoScrollingRef = useRef(false);
  isAutoScrollingRef.current = isAutoScrolling;

  const currentSectionIndexRef = useRef(0);
  currentSectionIndexRef.current = currentSectionIndex;

  const isScrollingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Smooth Native Section Jump (100% native smooth scroll)
  const goToSection = useCallback((index: number) => {
    if (index < 0 || index >= SECTION_IDS.length) return;
    setCurrentSectionIndex(index);
    currentSectionIndexRef.current = index;

    const targetId = SECTION_IDS[index];
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    fetchServerMusicConfig();
    // Query param support for instant preview/testing: ?opened=true
    if (typeof window !== 'undefined' && window.location.search.includes('opened')) {
      setIsIntroDismissed(true);
      setIsHeroRevealed(true);
    }
  }, []);

  // Lock document scroll while envelope is active
  useEffect(() => {
    if (!isIntroDismissed) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isIntroDismissed]);

  // Desktop Mouse Wheel Handler (1 wheel notch = 1 section jump)
  // On mobile touch, CSS scroll-snap handles 100% of gestures with native 120Hz physics!
  useEffect(() => {
    if (!isIntroDismissed) return;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      // Allow native scroll inside scrollable form elements
      if (target?.closest('input, textarea, select')) return;

      // Ignore small wheel jitters
      if (Math.abs(e.deltaY) < 18) return;

      e.preventDefault();

      if (isScrollingRef.current) return;
      isScrollingRef.current = true;

      if (isAutoScrollingRef.current) {
        setIsAutoScrolling(false);
      }

      if (e.deltaY > 0) {
        goToSection(currentSectionIndexRef.current + 1);
      } else {
        goToSection(currentSectionIndexRef.current - 1);
      }

      // Smooth throttle window between wheel notches
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 650);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) return;

      if (['ArrowDown', 'PageDown', 'Space'].includes(e.code) || e.key === 'ArrowDown') {
        e.preventDefault();
        if (isAutoScrollingRef.current) setIsAutoScrolling(false);
        goToSection(currentSectionIndexRef.current + 1);
      } else if (['ArrowUp', 'PageUp'].includes(e.code) || e.key === 'ArrowUp') {
        e.preventDefault();
        if (isAutoScrollingRef.current) setIsAutoScrolling(false);
        goToSection(currentSectionIndexRef.current - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isIntroDismissed, goToSection]);

  // Sync golden indicator dots with current visible section via IntersectionObserver
  useEffect(() => {
    if (!isIntroDismissed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SECTION_IDS.indexOf(entry.target.id as any);
            if (idx !== -1) {
              setCurrentSectionIndex(idx);
              currentSectionIndexRef.current = idx;
            }
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isIntroDismissed]);

  // Section-by-Section Auto-scroll: advances to next section every 5.5s
  useEffect(() => {
    if (!isIntroDismissed || !isAutoScrolling) return;

    const interval = setInterval(() => {
      if (currentSectionIndexRef.current < SECTION_IDS.length - 1) {
        goToSection(currentSectionIndexRef.current + 1);
      } else {
        setIsAutoScrolling(false);
      }
    }, 5500);

    return () => clearInterval(interval);
  }, [isIntroDismissed, isAutoScrolling, goToSection]);

  // Audio Playback Handlers
  const handleOpenStart = () => {
    if (audioRef.current) {
      const startSec = getEffectiveMusicStartTime();
      try {
        audioRef.current.currentTime = startSec;
        audioRef.current.volume = 0;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = startSec;
              }
            })
            .catch(() => {});
        }
      } catch (err) {
        console.warn('Audio prime error:', err);
      }
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      const startSec = getEffectiveMusicStartTime();
      const endSec = getEffectiveMusicEndTime();
      if (audioRef.current.currentTime < startSec || audioRef.current.currentTime >= endSec) {
        audioRef.current.currentTime = startSec;
      }
      audioRef.current.volume = MUSIC_CONFIG.volume;
      audioRef.current
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch((err) => console.warn('Could not resume audio:', err));
    }
  };

  // High-precision audio loop watcher: 1:39 (99s) to 2:19 (139s)
  useEffect(() => {
    if (!isAudioPlaying) return;

    const checkInterval = setInterval(() => {
      if (audioRef.current && !audioRef.current.paused) {
        const startSec = getEffectiveMusicStartTime();
        const endSec = getEffectiveMusicEndTime();
        if (audioRef.current.currentTime >= endSec) {
          audioRef.current.currentTime = startSec;
        }
      }
    }, 80);

    return () => clearInterval(checkInterval);
  }, [isAudioPlaying]);

  const toggleAutoScroll = () => {
    setIsAutoScrolling((prev) => !prev);
  };

  const handleOpenComplete = () => {
    setIsIntroDismissed(true);
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    // Play music strictly AFTER envelope has opened
    if (audioRef.current) {
      const startSec = getEffectiveMusicStartTime();
      try {
        audioRef.current.currentTime = startSec;
        audioRef.current.volume = MUSIC_CONFIG.volume;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsAudioPlaying(true))
            .catch((error) => {
              console.warn('Autoplay prevented by browser policy:', error);
              setIsAudioPlaying(false);
            });
        }
      } catch (err) {
        console.warn('Audio play error:', err);
      }
    }
  };

  return (
    <div
      dir={dir}
      className={`min-h-screen w-full relative bg-[#1E1815] flex justify-center selection:bg-rose/40 selection:text-taupe-dark ${
        isArabic ? 'font-cairo' : 'font-sans'
      }`}
    >
      {/* Hidden Audio Element with 1:39 to 2:19 loop boundary */}
      <audio
        ref={audioRef}
        src={bgMusic}
        preload="auto"
        onTimeUpdate={() => {
          if (audioRef.current) {
            const startSec = getEffectiveMusicStartTime();
            const endSec = getEffectiveMusicEndTime();
            if (audioRef.current.currentTime >= endSec) {
              audioRef.current.currentTime = startSec;
              if (audioRef.current.paused && isAudioPlaying) {
                audioRef.current.play().catch(() => {});
              }
            }
          }
        }}
        onEnded={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = getEffectiveMusicStartTime();
            audioRef.current.play().catch(() => {});
          }
        }}
      />

      {/* 1. Full Viewport Envelope Intro Screen */}
      {!isIntroDismissed && (
        <SectionEnvelopeIntro
          onOpenStart={handleOpenStart}
          onRevealHero={() => setIsHeroRevealed(true)}
          onOpenComplete={handleOpenComplete}
        />
      )}

      {/* Floating Controls: Music Player & Auto-Scroll & Language */}
      <AudioPlayer
        isPlaying={isAudioPlaying}
        onToggle={toggleAudio}
        isAutoScrolling={isAutoScrolling}
        onToggleAutoScroll={toggleAutoScroll}
        visible={isIntroDismissed}
      />

      {/* Floating Vertical Section Dots Indicator */}
      {isIntroDismissed && (
        <aside
          aria-label="Section navigation"
          className="fixed z-40 top-1/2 -translate-y-1/2 end-2.5 sm:end-5 flex flex-col items-center gap-2 p-1.5 sm:p-2 rounded-full bg-cream/85 backdrop-blur-md border border-gold/40 shadow-soft-float"
        >
          {SECTION_IDS.map((id, index) => {
            const isActive = currentSectionIndex === index;
            const label = isArabic ? SECTION_LABELS[id].ar : SECTION_LABELS[id].en;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  if (isAutoScrollingRef.current) setIsAutoScrolling(false);
                  goToSection(index);
                }}
                title={label}
                aria-label={label}
                className="group relative flex items-center justify-center p-0.5 cursor-pointer"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-2 sm:w-2.5 h-5 sm:h-6 bg-gradient-to-b from-[#B8913A] via-[#F1D98B] to-[#B8913A] shadow-[0_0_8px_rgba(201,162,75,0.7)]'
                      : 'w-2 h-2 bg-[#78550E]/30 hover:bg-[#78550E]/80 hover:scale-125'
                  }`}
                />
                {/* Tooltip on hover */}
                <span
                  className={`absolute pointer-events-none whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-bold text-[#78550E] bg-cream border border-gold/40 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 ${
                    isArabic ? 'left-full ml-2' : 'right-full mr-2'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </aside>
      )}

      {/* Desktop Ambient Dreamy Blurred Background */}
      <div className="fixed inset-0 pointer-events-none hidden md:block overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose/20 blur-[120px]" />
        <div className="absolute top-1/4 -right-32 w-[28rem] h-[28rem] rounded-full bg-lavender/20 blur-[130px]" />
        <div className="absolute bottom-1/3 -left-20 w-80 h-80 rounded-full bg-sky/20 blur-[120px]" />
        <div className="absolute -bottom-32 right-1/4 w-[30rem] h-[30rem] rounded-full bg-gold/15 blur-[140px]" />
      </div>

      {/* Mobile-First Centered Container (390px - 480px width) */}
      <main className="relative w-full max-w-[480px] min-h-screen bg-cream shadow-2xl md:border-x md:border-gold/30 flex flex-col overflow-x-hidden">
        {/* 1. Hero: The primary grand invitation */}
        <SectionHero isRevealed={isHeroRevealed} onScrollNext={() => goToSection(1)} />

        {/* 2. Wedding Event Card */}
        <SectionEventCards />

        {/* 3. Dedicated Venue Location & Interactive Map Section */}
        <SectionLocation />

        {/* 4. Countdown timer */}
        <SectionCountdown />

        {/* 5. RSVP / Guestbook form */}
        <SectionRSVP />

        {/* 6. Our Story */}
        <SectionOurStory />

        {/* 7. Closing blessing + footer credit */}
        <SectionClosing />
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <MainAppContent />
    </LanguageProvider>
  );
};

export default App;
