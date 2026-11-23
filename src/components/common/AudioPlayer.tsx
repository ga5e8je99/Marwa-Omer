import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
  visible: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  isPlaying,
  onToggle,
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
          {/* Floating Action Button */}
          <button
            onClick={onToggle}
            type="button"
            className="group relative flex items-center gap-2.5 px-3 py-2.5 rounded-full bg-cream/90 backdrop-blur-md border border-gold/50 shadow-soft-float hover:border-gold hover:shadow-gold-glow transition-all duration-300 cursor-pointer"
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
            <span className="font-cinzel text-[10px] tracking-wider text-taupe-dark uppercase pr-1 hidden sm:inline-block">
              {isPlaying ? 'Music' : 'Muted'}
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AudioPlayer;
