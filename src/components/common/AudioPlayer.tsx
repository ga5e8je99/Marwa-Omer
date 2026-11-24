'use client';

import React from 'react';
import { Volume2, VolumeX, Play, Pause, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

interface AudioPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
  isAutoScrolling?: boolean;
  onToggleAutoScroll?: () => void;
  visible: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  isPlaying,
  onToggle,
  isAutoScrolling = false,
  onToggleAutoScroll,
  visible,
}) => {
  const { lang, toggleLang, t, dir } = useLanguage();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 left-4 z-40 flex items-center gap-2"
          dir={dir}
        >
          {/* 1. Language Switcher Button */}
          <button
            onClick={toggleLang}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-full bg-cream/95 backdrop-blur-md border border-gold/50 shadow-soft-float hover:border-gold hover:shadow-gold-glow text-[#78550E] transition-all cursor-pointer select-none"
            title={t.controls.switchLangPrompt}
            aria-label={t.controls.switchLangPrompt}
          >
            <Globe className="w-3.5 h-3.5 text-gold-dark" />
            <span className="text-xs font-bold font-cairo">
              {t.controls.langName}
            </span>
          </button>

          {/* 2. Auto Scroll Button */}
          {onToggleAutoScroll && (
            <button
              onClick={onToggleAutoScroll}
              type="button"
              className={`group relative flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-full backdrop-blur-md border shadow-soft-float transition-all duration-300 cursor-pointer select-none ${
                isAutoScrolling
                  ? 'bg-cream border-gold shadow-gold-glow text-[#78550E]'
                  : 'bg-cream/95 border-gold/45 hover:border-gold text-taupe-dark'
              }`}
              aria-label={isAutoScrolling ? t.controls.autoScrollOff : t.controls.autoScrollOn}
              title={isAutoScrolling ? t.controls.autoScrollOff : t.controls.autoScrollOn}
            >
              {isAutoScrolling ? (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold-metallic"></span>
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-taupe/40" />
              )}

              {isAutoScrolling ? (
                <Pause className="w-4 h-4 text-[#78550E]" />
              ) : (
                <Play className="w-4 h-4 text-taupe/70 group-hover:text-gold-dark fill-current" />
              )}

              <span className="text-xs font-semibold">
                {isAutoScrolling ? t.controls.autoScrollOff : t.controls.autoScrollOn}
              </span>
            </button>
          )}

          {/* 3. Floating Music Button */}
          <button
            onClick={onToggle}
            type="button"
            className="group relative flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-full bg-cream/95 backdrop-blur-md border border-gold/60 shadow-soft-float hover:border-gold hover:shadow-gold-glow transition-all duration-300 cursor-pointer select-none"
            aria-label={isPlaying ? t.controls.musicMute : t.controls.musicPlay}
            title={isPlaying ? t.controls.musicMute : t.controls.musicPlay}
          >
            <div className="flex items-center gap-0.5 h-4 px-0.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={
                    isPlaying
                      ? {
                          height: ['4px', '16px', '6px', '14px', '4px'],
                        }
                      : { height: '3px' }
                  }
                  transition={
                    isPlaying
                      ? {
                          duration: 1.2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: i * 0.2,
                        }
                      : { duration: 0.2 }
                  }
                  className={`w-[2.5px] rounded-full ${
                    isPlaying ? 'bg-gold-metallic' : 'bg-taupe/40'
                  }`}
                />
              ))}
            </div>

            <div className="text-taupe-dark group-hover:text-gold-dark transition-colors">
              {isPlaying ? (
                <Volume2 className="w-4 h-4 text-[#78550E]" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-dark" />
              )}
            </div>

            <span className="text-xs font-semibold text-[#58463D] group-hover:text-gold-dark">
              {isPlaying ? t.controls.musicPlay : t.controls.musicMute}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AudioPlayer;
