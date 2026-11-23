import React from 'react';
import { motion, type MotionProps, useReducedMotion } from 'framer-motion';

export interface RevealProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  duration?: number;
  blur?: number;
  threshold?: number;
}

/**
 * Reusable Reveal component:
 * - Automatically respects prefers-reduced-motion for a11y & low-end devices
 * - fade (opacity 0 -> 1)
 * - translateY (default 24px -> 0)
 * - slight blur-to-sharp (blur(8px) -> blur(0px))
 * - duration 0.9s, ease: [0.22, 1, 0.36, 1], triggered when 20% in view
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  yOffset = 24,
  duration = 0.9,
  blur = 8,
  threshold = 0.2,
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              y: yOffset,
              filter: `blur(${blur}px)`,
            }
      }
      whileInView={
        shouldReduceMotion
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
            }
      }
      viewport={{
        once: true,
        amount: threshold,
      }}
      transition={{
        duration: shouldReduceMotion ? 0.35 : duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
