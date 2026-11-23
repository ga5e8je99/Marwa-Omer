import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { INVITATION_DATA } from '../../data/invitation';
import { ASSETS } from '../../config/assets';

// Animated Butterfly Component with Fluttering Wings
interface FloatingButterflyProps {
  xRange: number[];
  yRange: number[];
  duration: number;
  delay: number;
  scale?: number;
}

const FloatingButterfly: React.FC<FloatingButterflyProps> = ({
  xRange,
  yRange,
  duration,
  delay,
  scale = 1,
}) => {
  return (
    <motion.div
      initial={{ x: xRange[0], y: yRange[0], opacity: 0 }}
      animate={{
        x: xRange,
        y: yRange,
        opacity: [0, 0.85, 0.95, 0.75, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{ transform: `scale(${scale})` }}
      className="absolute pointer-events-none z-15"
    >
      <motion.svg
        animate={{ scaleX: [1, 0.35, 1] }}
        transition={{ duration: 0.28, repeat: Infinity, ease: 'linear' }}
        viewBox="0 0 32 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-5 filter drop-shadow-xs"
      >
        {/* Upper Wings */}
        <path
          d="M16 13 C12 6, 4 3, 2 8 C0 13, 8 18, 14 14 Z"
          fill="#F4CBD0"
          stroke="#C9A24B"
          strokeWidth="0.6"
          opacity="0.9"
        />
        <path
          d="M16 13 C20 6, 28 3, 30 8 C32 13, 24 18, 18 14 Z"
          fill="#F4CBD0"
          stroke="#C9A24B"
          strokeWidth="0.6"
          opacity="0.9"
        />
        {/* Lower Wings */}
        <path
          d="M16 13 C13 16, 7 20, 6 23 C5 26, 12 25, 15 17 Z"
          fill="#FDEBEB"
          stroke="#C9A24B"
          strokeWidth="0.5"
          opacity="0.85"
        />
        <path
          d="M16 13 C19 16, 25 20, 26 23 C27 26, 20 25, 17 17 Z"
          fill="#FDEBEB"
          stroke="#C9A24B"
          strokeWidth="0.5"
          opacity="0.85"
        />
        {/* Golden Torso */}
        <line x1="16" y1="7" x2="16" y2="19" stroke="#B8913A" strokeWidth="1.2" strokeLinecap="round" />
      </motion.svg>
    </motion.div>
  );
};

export const SectionInvitationCard: React.FC = () => {
  const { bride, groom } = INVITATION_DATA.couple;
  const { bismillah } = INVITATION_DATA;

  // Stagger animation helper typed with Variants
  const textVariant: Variants = {
    hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.9,
        delay: 0.15 * i,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <section
      id="section-invitation-card"
      className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden paper-texture"
    >
      {/* 1. Soft Pink Watercolor Background with Framing Roses & Faded Gazebo */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src={ASSETS.bgInvitationCard}
          alt="Pink watercolor background with pastel roses and marble gazebo"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 2. Floating Butterflies & Gentle Petals */}
      <FloatingButterfly
        xRange={[30, 80, 50, 110, 140]}
        yRange={[140, 120, 160, 110, 150]}
        duration={14}
        delay={0.2}
        scale={0.9}
      />
      <FloatingButterfly
        xRange={[320, 270, 310, 250, 280]}
        yRange={[280, 250, 310, 270, 320]}
        duration={16}
        delay={3.5}
        scale={0.8}
      />

      {/* Delicate floating petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[
          { id: 1, left: '22%', delay: 1, dur: 9 },
          { id: 2, left: '72%', delay: 3, dur: 11 },
          { id: 3, left: '45%', delay: 5, dur: 10 },
        ].map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: '-10%', opacity: 0, rotate: 0 }}
            animate={{
              y: ['0%', '110%'],
              x: [0, p.id % 2 === 0 ? 20 : -20, 0],
              opacity: [0, 0.7, 0.8, 0.4, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: p.dur,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ position: 'absolute', top: 0, left: p.left }}
          >
            <div className="w-2.5 h-3.5 rounded-full bg-rose-light/75 shadow-xs" />
          </motion.div>
        ))}
      </div>

      {/* 3. Centered Invitation Content Card */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-20 w-full max-w-[390px] mx-auto py-10 px-6 sm:px-8 bg-cream/70 backdrop-blur-xs rounded-2xl border border-gold/45 shadow-paper flex flex-col items-center justify-center my-auto"
      >
        {/* Line 1: Arabic Bismillah in Radiant Gold */}
        <motion.div custom={1} variants={textVariant} className="mb-2">
          <span className="font-serif text-2xl sm:text-3xl font-medium select-none text-gold-gradient tracking-wide block drop-shadow-xs">
            {bismillah.arabic}
          </span>
          <p className="font-serif italic text-xs text-taupe/70 mt-1">
            "{bismillah.translation}"
          </p>
        </motion.div>

        {/* Delicate Golden Divider Ribbon */}
        <motion.div
          custom={2}
          variants={textVariant}
          className="flex items-center justify-center my-4 w-full"
        >
          <span className="h-[1px] w-12 bg-gold/40" />
          <span className="mx-2 text-gold text-xs">✤</span>
          <span className="h-[1px] w-12 bg-gold/40" />
        </motion.div>

        {/* Line 2: Requesting copy */}
        <motion.p
          custom={3}
          variants={textVariant}
          className="font-serif italic text-sm sm:text-base text-taupe leading-relaxed max-w-[310px] mb-6"
        >
          requesting the honour of your presence to celebrate the sacred union of
        </motion.p>

        {/* Line 3: Bride - Script Name + D/O Title */}
        <motion.div custom={4} variants={textVariant} className="mb-2">
          <h2 className="font-script text-5xl sm:text-6xl text-gold-gradient py-0.5">
            {bride.firstName}
          </h2>
          <p className="font-cinzel text-[10px] sm:text-[11px] tracking-loose-tracked text-taupe-dark uppercase font-semibold mt-1">
            {bride.parentsTitle}
          </p>
        </motion.div>

        {/* Line 4: Center Ampersand */}
        <motion.div custom={5} variants={textVariant} className="my-2">
          <span className="font-script text-3xl sm:text-4xl text-gold-metallic">
            &amp;
          </span>
        </motion.div>

        {/* Line 5: Groom - Script Name + S/O Title */}
        <motion.div custom={6} variants={textVariant} className="mt-1 mb-6">
          <h2 className="font-script text-5xl sm:text-6xl text-gold-gradient py-0.5">
            {groom.firstName}
          </h2>
          <p className="font-cinzel text-[10px] sm:text-[11px] tracking-loose-tracked text-taupe-dark uppercase font-semibold mt-1">
            {groom.parentsTitle}
          </p>
        </motion.div>

        {/* Line 6: Closing Honor Note */}
        <motion.p
          custom={7}
          variants={textVariant}
          className="font-serif italic text-xs text-taupe/80 max-w-[280px] leading-relaxed pt-2 border-t border-gold/30"
        >
          {INVITATION_DATA.invitationText.honor}
        </motion.p>
      </motion.div>
    </section>
  );
};

export default SectionInvitationCard;
