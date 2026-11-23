import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';

// Audio asset
import bgMusic from './assets/music.mp3';

// Reusable components
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
import { SectionGallery } from './components/sections/SectionGallery';
import { SectionCompliments } from './components/sections/SectionCompliments';
import { SectionClosing } from './components/sections/SectionClosing';

export const App: React.FC = () => {
  // Query param support for instant preview/testing: ?opened=true
  const isPreviewOpened = typeof window !== 'undefined' && window.location.search.includes('opened');
  const [isIntroDismissed, setIsIntroDismissed] = useState(isPreviewOpened);
  const [isHeroRevealed, setIsHeroRevealed] = useState(isPreviewOpened);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

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

    // Body & HTML scroll locked while envelope is active (including iOS Safari)
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

  // Handle Audio Start on Tap
  const handleOpenStart = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.45;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsAudioPlaying(true);
          })
          .catch((error) => {
            console.warn('Autoplay prevented by browser policy:', error);
            setIsAudioPlaying(false);
          });
      }
    }
  };

  // Complete opening sequence: unmount overlay & unlock scroll
  const handleOpenComplete = () => {
    setIsIntroDismissed(true);
    if (lenisRef.current) {
      lenisRef.current.start();
    }
    document.body.style.overflow = '';
  };

  // Toggle audio play/mute
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch((err) => console.warn('Could not resume audio:', err));
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-[#1E1815] flex justify-center selection:bg-rose/40 selection:text-taupe-dark">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={bgMusic}
        loop
        preload="auto"
      />

      {/* 1. Full Viewport Envelope Intro Screen (Fixed on top until opened) */}
      {!isIntroDismissed && (
        <SectionEnvelopeIntro
          onOpenStart={handleOpenStart}
          onRevealHero={() => setIsHeroRevealed(true)}
          onOpenComplete={handleOpenComplete}
        />
      )}

      {/* Floating Mute/Unmute Music Button (Shown after opening) */}
      <AudioPlayer
        isPlaying={isAudioPlaying}
        onToggle={toggleAudio}
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
        {/* 2. Hero: The primary grand invitation with couple, arch, and verse */}
        <SectionHero isRevealed={isHeroRevealed} />

        <LaceDivider />

        {/* 3. Wedding Event Cards (Comprehensive details for Mehndi, Nikkah, Walima) */}
        <SectionEventCards />

        <LaceDivider variant="subtle" />

        {/* 5. Dedicated Venue Location & Interactive Map Section */}
        <SectionLocation />

        {/* 7. Countdown timer (enclosed between its two lace bands) */}
        <SectionCountdown />

        {/* 8. RSVP form */}
        <SectionRSVP />

        <LaceDivider />

        {/* 9. Our Story (3 numbered chapters) */}
        <SectionOurStory />

        <LaceDivider variant="subtle" />

        {/* 10. Our Moments photo gallery in an arch frame carousel */}
        <SectionGallery />

        <LaceDivider />

        {/* 11. With Best Compliments family list */}
        <SectionCompliments />

        <LaceDivider variant="subtle" />

        {/* 12. Closing blessing + footer credit */}
        <SectionClosing />
      </main>
    </div>
  );
};

export default App;
