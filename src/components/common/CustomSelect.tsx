'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, User, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CustomSelectOption {
  value: number;
  label: string;
}

interface CustomSelectProps {
  value: number;
  onChange: (value: number) => void;
  options: CustomSelectOption[];
  label?: string;
  dir?: 'rtl' | 'ltr';
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  label,
  dir = 'rtl',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const currentIndex = options.findIndex((opt) => opt.value === value);
      const nextIndex = (currentIndex + 1) % options.length;
      onChange(options[nextIndex].value);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const currentIndex = options.findIndex((opt) => opt.value === value);
      const prevIndex = (currentIndex - 1 + options.length) % options.length;
      onChange(options[prevIndex].value);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef} dir={dir}>
      {label && (
        <label className="block text-xs sm:text-sm font-bold text-[#78550E] mb-1.5 text-start">
          {label}
        </label>
      )}

      {/* Main Select Button Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-2xl bg-white/95 backdrop-blur-sm border transition-all duration-300 flex items-center justify-between shadow-soft-float text-start cursor-pointer focus:outline-none select-none ${
          isOpen
            ? 'border-gold shadow-gold-glow ring-2 ring-gold/20'
            : 'border-gold/50 hover:border-gold'
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-[#78550E] shrink-0">
            {value === 1 ? (
              <User className="w-4 h-4 text-gold-dark" />
            ) : (
              <Users className="w-4 h-4 text-gold-dark" />
            )}
          </div>

          <div className="flex flex-col text-start">
            <span className="text-xs sm:text-sm font-bold text-taupe-dark truncate font-cairo">
              {selectedOption.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-gold/15 text-[#78550E] border border-gold/30">
            {value === 1 ? 'فردي' : `${value} أفراد`}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gold-dark transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-[#78550E]' : ''
            }`}
          />
        </div>
      </button>

      {/* Quick Select Chips Bar */}
      <div className="flex items-center gap-1.5 mt-2 justify-between">
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`flex-1 py-1.5 px-1 min-h-[36px] rounded-xl text-[11px] sm:text-xs font-bold border transition-all duration-200 cursor-pointer text-center flex items-center justify-center gap-1 ${
                isSelected
                  ? 'bg-gradient-to-r from-gold via-gold-shimmer to-gold text-white border-gold shadow-xs scale-[1.02]'
                  : 'bg-white/80 hover:bg-white text-taupe-dark border-gold/30 hover:border-gold/70'
              }`}
            >
              <span>{opt.value === 4 ? '4+ عيلة' : opt.value === 1 ? '1 أنا' : `${opt.value} أفراد`}</span>
            </button>
          );
        })}
      </div>

      {/* Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-40 top-[52px] inset-x-0 rounded-2xl bg-cream/98 border border-gold/60 shadow-2xl backdrop-blur-md p-1.5 space-y-1 overflow-hidden"
            role="listbox"
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-start ${
                    isSelected
                      ? 'bg-gold/20 text-[#78550E] font-bold border border-gold/40 shadow-2xs'
                      : 'text-taupe-dark hover:bg-gold/10 hover:text-[#78550E] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'bg-[#78550E] text-white'
                          : 'bg-taupe/10 text-taupe-dark'
                      }`}
                    >
                      {opt.value}
                    </div>
                    <span>{opt.label}</span>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-[#78550E] shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
