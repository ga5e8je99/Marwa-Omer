import React from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2"
        >
          {/* 1. Auto Scroll Button */}
          {onToggleAutoScroll && (
            <button
              onClick={onToggleAutoScroll}
              type="button"
              className={`group relative flex items-center gap-1.5 px-3 py-2 rounded-full backdrop-blur-md border shadow-soft-float transition-all duration-300 cursor-pointer select-none ${
                isAutoScrolling
                  ? 'bg-cream border-gold shadow-gold-glow text-gold-dark'
                  : 'bg-cream/90 border-gold/45 hover:border-gold text-taupe-dark'
              }`}
              aria-label={isAutoScrolling ? 'Pause auto-scroll' : 'Start auto-scroll'}
              title={isAutoScrolling ? 'Pause Auto Scroll' : 'Start Auto Scroll'}
            >
              {isAutoScrolling ? (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-metallic"></span>
                </span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-taupe/40" />
              )}

              {isAutoScrolling ? (
                <Pause className="w-3.5 h-3.5 text-gold-dark" />
              ) : (
                <Play className="w-3.5 h-3.5 text-taupe/70 group-hover:text-gold-dark" />
              )}

              <span className="font-cinzel text-[10px] tracking-wider uppercase font-medium">
                {isAutoScrolling ? 'Auto' : 'Scroll'}
              </span>
            </button>
          )}

          {/* 2. Floating Music Button */}
          <button
            onClick={onToggle}
            type="button"
            className="group relative flex items-center gap-2 px-3 py-2 rounded-full bg-cream/90 backdrop-blur-md border border-gold/50 shadow-soft-float hover:border-gold hover:shadow-gold-glow transition-all duration-300 cursor-pointer select-none"
            aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
          >
            {/* Visualizer Waves */}
            <div className="flex items-center gap-0.5 h-3.5 px-0.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={
                    isPlaying
                      ? {
                          height: ['4px', '14px', '6px', '12px', '4px'],
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

            {/* Icon */}
            <div className="text-taupe-dark group-hover:text-gold-dark transition-colors">
              {isPlaying ? (
                <Volume2 className="w-4 h-4 text-gold-dark" />
              ) : (
                <VolumeX className="w-4 h-4 text-taupe/60" />
              )}
            </div>

            {/* Subtle text label */}
            <span className="font-cinzel text-[10px] tracking-wider text-taupe-dark uppercase pr-0.5 hidden sm:inline-block">
              {isPlaying ? 'Music' : 'Muted'}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AudioPlayer;
