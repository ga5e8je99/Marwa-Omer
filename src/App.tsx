'use client';

import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';

// Audio asset and configuration
import { MUSIC_CONFIG, getEffectiveMusicStartTime, fetchServerMusicConfig } from './config/audio';
const bgMusic = MUSIC_CONFIG.src;

// Context & Reusable components
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LaceDivider } from './components/common/LaceDivider';
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

const MainAppContent: React.FC = () => {
  const { dir, isArabic } = useLanguage();
  const [isIntroDismissed, setIsIntroDismissed] = useState(false);
  const [isHeroRevealed, setIsHeroRevealed] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const isAutoScrollingRef = useRef(false);
  isAutoScrollingRef.current = isAutoScrolling;

  useEffect(() => {
    fetchServerMusicConfig();
    // Query param support for instant preview/testing: ?opened=true
    if (typeof window !== 'undefined' && window.location.search.includes('opened')) {
      setIsIntroDismissed(true);
      setIsHeroRevealed(true);
    }
  }, []);

  const lenisRef = useRef<Lenis | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Lenis smooth scroll and lock/unlock based on envelope
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Body & HTML scroll locked while envelope is active
    if (!isIntroDismissed) {
      lenis.stop();
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      lenis.start();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      document.body.style.overflow = '';
    };
  }, [isIntroDismissed]);

  // Start auto-scroll automatically 2.2s after envelope is opened
  useEffect(() => {
    if (!isIntroDismissed) return;

    const timer = setTimeout(() => {
      setIsAutoScrolling(true);
    }, 2200);

    return () => clearTimeout(timer);
  }, [isIntroDismissed]);

  // Smooth Auto-scroll RAF loop
  useEffect(() => {
    if (!isIntroDismissed || !isAutoScrolling) return;

    let rafId: number;
    let lastTime = performance.now();
    const speed = 46; // pixels per second

    const step = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const lenis = lenisRef.current;
      if (lenis && isAutoScrollingRef.current) {
        const maxScroll = lenis.limit || (document.documentElement.scrollHeight - window.innerHeight);
        if (lenis.scroll >= maxScroll - 4) {
          setIsAutoScrolling(false);
          return;
        }
        lenis.scrollTo(lenis.scroll + speed * delta, { immediate: true });
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);

    const handleUserInteraction = () => {
      if (isAutoScrollingRef.current) {
        setIsAutoScrolling(false);
      }
    };

    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [isIntroDismissed, isAutoScrolling]);

  // Audio Playback
  const handleOpenStart = () => {
    // Prime the audio element on user gesture to satisfy iOS/Android autoplay policy,
    // but keep silent until envelope opening completes.
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
      if (audioRef.current.currentTime < 1) {
        audioRef.current.currentTime = getEffectiveMusicStartTime();
      }
      audioRef.current.volume = MUSIC_CONFIG.volume;
      audioRef.current
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch((err) => console.warn('Could not resume audio:', err));
    }
  };

  const toggleAutoScroll = () => {
    setIsAutoScrolling((prev) => !prev);
  };

  const handleOpenComplete = () => {
    setIsIntroDismissed(true);
    if (lenisRef.current) {
      lenisRef.current.start();
    }
    document.body.style.overflow = '';

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
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={bgMusic}
        preload="auto"
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

      {/* Floating Controls: Music Player & Auto-Scroll & Language (Shown after opening) */}
      <AudioPlayer
        isPlaying={isAudioPlaying}
        onToggle={toggleAudio}
        isAutoScrolling={isAutoScrolling}
        onToggleAutoScroll={toggleAutoScroll}
        visible={isIntroDismissed}
      />

      {/* Desktop Ambient Dreamy Blurred Background */}
      <div className="fixed inset-0 pointer-events-none hidden md:block overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose/20 blur-[120px]" />
        <div className="absolute top-1/4 -right-32 w-[28rem] h-[28rem] rounded-full bg-lavender/20 blur-[130px]" />
        <div className="absolute bottom-1/3 -left-20 w-80 h-80 rounded-full bg-sky/20 blur-[120px]" />
        <div className="absolute -bottom-32 right-1/4 w-[30rem] h-[30rem] rounded-full bg-gold/15 blur-[140px]" />
      </div>

      {/* Mobile-First Centered Container (390px - 480px width) */}
      <main className="relative w-full max-w-[480px] min-h-screen bg-cream shadow-2xl md:border-x md:border-gold/30 flex flex-col overflow-x-hidden">
        {/* 2. Hero: The primary grand invitation */}
        <SectionHero isRevealed={isHeroRevealed} />

        <LaceDivider />

        {/* 3. Wedding Event Card */}
        <SectionEventCards />

        <LaceDivider variant="subtle" />

        {/* 5. Dedicated Venue Location & Interactive Map Section */}
        <SectionLocation />

        {/* 7. Countdown timer */}
        <SectionCountdown />

        {/* 8. RSVP / Guestbook form */}
        <SectionRSVP />

        <LaceDivider />

        {/* 9. Our Story */}
        <SectionOurStory />

        <LaceDivider />

        {/* 11. Closing blessing + footer credit */}
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
