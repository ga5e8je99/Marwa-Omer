import React, { useEffect, useRef, useState } from 'react';
import { useAnimate, useReducedMotion } from 'framer-motion';
import { ASSETS } from '../../config/assets';

/**
 * ENVELOPE_TIMINGS
 * Master timeline constants for the cinematic opening sequence (total duration: 4.2s)
 */
export const ENVELOPE_TIMINGS = {
  totalDuration: 4.2, // Total sequence duration in seconds

  // 0.00 - 0.45s: Wax Seal scales and fades with upward drift; TAP TO OPEN fades
  sealStart: 0.0,
  sealDuration: 0.45,
  sealScale: 1.12,
  sealDriftY: -8,
  tapFadeDuration: 0.25,

  // 0.30 - 1.40s: White lace V slides/retracts toward the tip (195, 422)
  laceStart: 0.3,
  laceDuration: 1.1, // 0.30 to 1.40s
  laceEndScale: 0.25,

  // 1.20 - 2.10s: Envelope group camera zoom-in toward folds center
  zoomStart: 1.2,
  zoomDuration: 0.9, // 1.20 to 2.10s
  zoomScale: 2.2,
  zoomEase: [0.65, 0, 0.35, 1], // cubic-bezier(0.65, 0, 0.35, 1)

  // 1.90 - 2.60s: Warm white light flash overlay & soft bloom
  flashStart: 1.9,
  flashFadeInDuration: 0.45, // reaches peak at 2.35s
  flashHoldDuration: 0.1, // peak hold 2.35s to 2.45s
  flashFadeOutStart: 2.6,
  flashFadeOutDuration: 0.9, // 2.60s to 3.50s

  // 2.30 - 3.70s: Hero Reveal & settle
  revealTime: 2.3, // unmount envelope, trigger hero reveal
  heroSettleDuration: 1.4, // 2.30s to 3.70s

  // 2.60 - 4.20s: Hero choreography (staggered text, sun flare, doves)
  heroChoreographyStart: 2.6,
  staggerInterval: 0.25,

  // 4.20s: Complete sequence & unlock scroll
  scrollUnlockTime: 4.2,
};

interface SectionEnvelopeIntroProps {
  onOpenStart?: () => void;
  onRevealHero?: () => void;
  onOpenComplete?: () => void;
}

export const SectionEnvelopeIntro: React.FC<SectionEnvelopeIntroProps> = ({
  onOpenStart,
  onRevealHero,
  onOpenComplete,
}) => {
  const [scope, animate] = useAnimate();
  const [envelopeHidden, setEnvelopeHidden] = useState(false);

  const hasTriggeredRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  // Preload Hero background and assets on mount
  useEffect(() => {
    const img = new Image();
    img.src = ASSETS.heroBg;
  }, []);

  // Hard scroll lock on iOS Safari & mobile touch devices
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Master Cinematic Timeline
  const handleEnvelopeTap = () => {
    // Skip safety: if user taps again during animation, ignore it
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // 0.00s: Start music immediately
    if (onOpenStart) {
      onOpenStart();
    }

    // Prefers-reduced-motion fallback: plain 0.6s crossfade
    if (shouldReduceMotion) {
      animate(scope.current, { opacity: 0 }, { duration: 0.6 }).then(() => {
        if (onRevealHero) onRevealHero();
        if (onOpenComplete) onOpenComplete();
      });
      return;
    }

    // ==========================================
    // MASTER TIMELINE CHOREOGRAPHY (Total 4.2s)
    // ==========================================

    // 0.00–0.45s: SEAL & TAP TO OPEN
    animate(
      '#tapToOpenText',
      { opacity: 0 },
      { duration: ENVELOPE_TIMINGS.tapFadeDuration, ease: 'easeOut' }
    );
    animate(
      '#waxSealGroup',
      { scale: ENVELOPE_TIMINGS.sealScale, opacity: 0, y: ENVELOPE_TIMINGS.sealDriftY },
      { duration: ENVELOPE_TIMINGS.sealDuration, ease: 'easeOut' }
    );

    // 0.30–1.40s: LACE retracts toward the tip (195, 422), scaling to ~0.25 and fading
    setTimeout(() => {
      animate(
        '#laceWings',
        { scale: ENVELOPE_TIMINGS.laceEndScale, opacity: 0 },
        { duration: ENVELOPE_TIMINGS.laceDuration, ease: [0.4, 0, 0.2, 1] }
      );
    }, ENVELOPE_TIMINGS.laceStart * 1000);

    // 1.20–2.10s: ZOOM-IN envelope group 1 -> 2.2 with transform-origin at the tip
    setTimeout(() => {
      animate(
        '#envelopeZoomGroup',
        { scale: ENVELOPE_TIMINGS.zoomScale },
        { duration: ENVELOPE_TIMINGS.zoomDuration, ease: [0.65, 0, 0.35, 1] }
      );
      // Tassel ornament fades out during zoom
      animate(
        '#tipLeafOrnament',
        { opacity: 0 },
        { duration: ENVELOPE_TIMINGS.zoomDuration * 0.7, ease: 'easeOut' }
      );
    }, ENVELOPE_TIMINGS.zoomStart * 1000);

    // 1.90–2.60s: Warm white light FLASH overlay & soft bloom
    setTimeout(() => {
      // Soft bloom scaling 0.2 -> 3
      animate(
        '#flashBloom',
        { scale: [0.2, 3], opacity: [0, 1] },
        { duration: ENVELOPE_TIMINGS.flashFadeInDuration, ease: 'easeIn' }
      );
      // Radial warm white light fading 0 -> 1
      animate(
        '#flashRadial',
        { opacity: [0, 1] },
        { duration: ENVELOPE_TIMINGS.flashFadeInDuration, ease: 'easeIn' }
      );
    }, ENVELOPE_TIMINGS.flashStart * 1000);

    // 2.30s: REVEAL Hero at flash peak & unmount/hide envelope
    setTimeout(() => {
      setEnvelopeHidden(true);
      if (onRevealHero) {
        onRevealHero();
      }
    }, ENVELOPE_TIMINGS.revealTime * 1000);

    // 2.60–3.50s: Flash overlay fades out 1 -> 0 over 0.9s
    setTimeout(() => {
      animate(
        '#flashRadial',
        { opacity: 0 },
        { duration: ENVELOPE_TIMINGS.flashFadeOutDuration, ease: 'easeOut' }
      );
      animate(
        '#flashBloom',
        { opacity: 0 },
        { duration: ENVELOPE_TIMINGS.flashFadeOutDuration, ease: 'easeOut' }
      );
    }, ENVELOPE_TIMINGS.flashFadeOutStart * 1000);

    // 4.20s: Complete sequence & unlock scroll
    setTimeout(() => {
      if (onOpenComplete) {
        onOpenComplete();
      }
    }, ENVELOPE_TIMINGS.scrollUnlockTime * 1000);
  };

  return (
    <div
      ref={scope}
      id="envelope-intro-overlay"
      onClick={handleEnvelopeTap}
      className="fixed inset-0 z-50 w-full h-[100dvh] overflow-hidden select-none touch-none overscroll-none cursor-pointer"
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Invitation Envelope"
    >
      {/* 1. Main Envelope SVG (Positioned edge-to-edge, hidden at 2.30s reveal) */}
      {!envelopeHidden && (
        <div
          id="envelope-wrapper"
          className="relative w-full h-full focus:outline-none"
          role="button"
          tabIndex={0}
          aria-label="Tap to open the wedding invitation"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleEnvelopeTap();
            }
          }}
        >
          {/* ONE absolutely-positioned inline <svg> filling 100vw x 100dvh with viewBox="0 0 390 844" and preserveAspectRatio="xMidYMax slice" */}
          <svg
            id="envelope-svg"
            viewBox="0 0 390 844"
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full select-none"
          >
            <defs>
              {/* Paper texture gradient (#F7DED7 top -> #F4D3CB bottom) */}
              <linearGradient id="blushPaper" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F7DED7" />
                <stop offset="100%" stopColor="#F4D3CB" />
              </linearGradient>

              {/* Metallic Gold Gradients for Wax Seal centered at (195, 422) */}
              <linearGradient id="goldMelt" x1="140" y1="370" x2="250" y2="475" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F5DE88" />
                <stop offset="20%" stopColor="#E2B344" />
                <stop offset="46%" stopColor="#FAF0B4" />
                <stop offset="74%" stopColor="#BA882A" />
                <stop offset="100%" stopColor="#6E4407" />
              </linearGradient>

              <linearGradient id="goldRim" x1="160" y1="385" x2="230" y2="455" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFF9D6" />
                <stop offset="35%" stopColor="#DFAC37" />
                <stop offset="70%" stopColor="#FFECA1" />
                <stop offset="100%" stopColor="#7A4C07" />
              </linearGradient>

              <radialGradient id="sealMatrix" cx="190" cy="416" r="44" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#D4A73B" />
                <stop offset="65%" stopColor="#B88624" />
                <stop offset="88%" stopColor="#8F6212" />
                <stop offset="100%" stopColor="#5E3C05" />
              </radialGradient>

              <linearGradient id="calligraphyGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFF6C2" />
                <stop offset="100%" stopColor="#D4A028" />
              </linearGradient>

              {/* Soft pink drop shadow for 3D embossed lace */}
              <filter id="laceShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#B4786E" floodOpacity="0.35" />
              </filter>

              {/* Wax Seal 3D Shadow */}
              <filter id="sealShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#461E08" floodOpacity="0.4" />
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#260D04" floodOpacity="0.3" />
              </filter>

              {/* Paper Grain & Emboss Texture Filter */}
              <filter id="paperGrain" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.95   0 0 0 0 0.86   0 0 0 0 0.83  0 0 0 0.08 0"
                  result="coloredNoise"
                />
                <feBlend mode="multiply" in="SourceGraphic" in2="coloredNoise" />
              </filter>

              {/* Gold Filigree Border Patterns */}
              <pattern id="goldFiligreeV" width="14" height="28" patternUnits="userSpaceOnUse">
                <path d="M 7,0 Q 1,7 7,14 Q 13,21 7,28" fill="none" stroke="#D4AE6A" strokeWidth="1.2" strokeOpacity="0.8" />
                <circle cx="7" cy="7" r="1.4" fill="#D4AE6A" fillOpacity="0.85" />
                <circle cx="7" cy="21" r="1.4" fill="#D4AE6A" fillOpacity="0.85" />
                <path d="M 2,0 L 2,28" stroke="#D4AE6A" strokeWidth="0.8" strokeOpacity="0.7" strokeDasharray="2 3" />
                <path d="M 12,0 L 12,28" stroke="#D4AE6A" strokeWidth="0.8" strokeOpacity="0.7" />
              </pattern>

              <pattern id="goldFiligreeH" width="28" height="14" patternUnits="userSpaceOnUse">
                <path d="M 0,7 Q 7,1 14,7 Q 21,13 28,7" fill="none" stroke="#D4AE6A" strokeWidth="1.2" strokeOpacity="0.8" />
                <circle cx="7" cy="7" r="1.4" fill="#D4AE6A" fillOpacity="0.85" />
                <circle cx="21" cy="7" r="1.4" fill="#D4AE6A" fillOpacity="0.85" />
                <path d="M 0,2 L 28,2" stroke="#D4AE6A" strokeWidth="0.8" strokeOpacity="0.7" />
                <path d="M 0,12 L 28,12" stroke="#D4AE6A" strokeWidth="0.8" strokeOpacity="0.7" strokeDasharray="2 3" />
              </pattern>
            </defs>

            {/* A. ENVELOPE ZOOM GROUP: scales 1 -> 2.2 with transform-origin at the tip (195, 422) */}
            <g
              id="envelopeZoomGroup"
              style={{
                transformOrigin: '195px 422px',
                willChange: 'transform',
              }}
            >
              {/* 1. Base Paper Rect */}
              <rect x="0" y="0" width="390" height="844" fill="url(#blushPaper)" filter="url(#paperGrain)" />

              {/* 2. Plain pink paper inside V */}
              <polygon points="-20,-20 410,-20 195,422" fill="#F7E4E1" />

              {/* 3. Lower flap fold lines meeting at (195, 422) */}
              <g id="foldLinesGroup">
                <line x1="0" y1="844" x2="195" y2="422" stroke="#E3B9B0" strokeWidth="1.2" />
                <line x1="0" y1="843" x2="195" y2="421" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.6" />
                <line x1="390" y1="844" x2="195" y2="422" stroke="#E3B9B0" strokeWidth="1.2" />
                <line x1="390" y1="843" x2="195" y2="421" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.6" />
              </g>

              {/* 4. Gold Lace Border along left, right, bottom */}
              <g id="goldBorderGroup">
                <rect x="4" y="0" width="14" height="844" fill="url(#goldFiligreeV)" />
                <rect x="372" y="0" width="14" height="844" fill="url(#goldFiligreeV)" />
                <rect x="4" y="826" width="382" height="14" fill="url(#goldFiligreeH)" />
              </g>

              {/* 5. Tassel Leaf Ornament at the tip (stays while wings retract, fades during zoom) */}
              <g
                id="tipLeafOrnament"
                transform="translate(195, 354)"
                style={{ willChange: 'opacity' }}
              >
                <path
                  d="M 0,-30 
                     C 24,-24 35,-10 35,12
                     C 35,32 22,50 12,58
                     C 6,63 2,66 0,70
                     C -2,66 -6,63 -12,58
                     C -22,50 -35,32 -35,12
                     C -35,-10 -24,-24 0,-30 Z"
                  fill="#FFFFFF"
                  stroke="#E6D3CB"
                  strokeWidth="2.0"
                />
                <path
                  d="M 0,-16 
                     C 16,-10 24,-2 24,14
                     C 24,28 15,40 8,48
                     C 4,52 1,55 0,58
                     C -1,55 -4,52 -8,48
                     C -15,40 -24,28 -24,14
                     C -24,-2 -16,-10 0,-16 Z"
                  fill="#FDFBFA"
                  stroke="#DBBEB2"
                  strokeWidth="1.4"
                />
                <circle cx="0" cy="14" r="10" fill="#FFFFFF" stroke="#D1B2A3" strokeWidth="1.6" />
                <circle cx="0" cy="14" r="6" fill="#F8EFEA" stroke="#B89486" strokeWidth="1.2" />
                <circle cx="0" cy="14" r="2.5" fill="#FFFFFF" />

                <circle cx="0" cy="73" r="2.4" fill="#FFFFFF" stroke="#D1B2A3" strokeWidth="1.0" />
                <circle cx="0" cy="78" r="1.8" fill="#FFFFFF" stroke="#D1B2A3" strokeWidth="0.8" />
                <circle cx="-28" cy="18" r="2.4" fill="#FFFFFF" stroke="#D1B2A3" strokeWidth="0.9" />
                <circle cx="28" cy="18" r="2.4" fill="#FFFFFF" stroke="#D1B2A3" strokeWidth="0.9" />
                <circle cx="-18" cy="42" r="2.0" fill="#FFFFFF" stroke="#D1B2A3" strokeWidth="0.8" />
                <circle cx="18" cy="42" r="2.0" fill="#FFFFFF" stroke="#D1B2A3" strokeWidth="0.8" />
              </g>
            </g>

            {/* B. LACE WINGS: retract toward the tip (195, 422), scale 1 -> 0.25 and fade */}
            <g
              id="laceWings"
              filter="url(#laceShadow)"
              style={{
                transformOrigin: '195px 422px',
                willChange: 'transform, opacity',
              }}
            >
              {/* Left Lace Band (Centerline: (32, -10) to (195, 414), angle = 68.97 deg, length ~454.2) */}
              <g id="singleLaceBand" transform="translate(32, -10) rotate(68.97)">
                <path d="M 0,31 L 455,31" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M 0,16 L 455,16" stroke="#F4EAE5" strokeWidth="1.3" strokeDasharray="3 2.5" />
                <path d="M 0,-16 L 455,-16" stroke="#F4EAE5" strokeWidth="1.3" strokeDasharray="3 2.5" />
                <path d="M 0,-31 L 455,-31" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />

                {/* 8 Dense Baroque Floral Lace Motifs */}
                {[45, 102, 159, 216, 273, 330, 387, 430].map((x, idx) => (
                  <g key={idx} transform={`translate(${x}, 0)`}>
                    {/* Outer Scalloped Lace Arch (curves to y = +38) */}
                    <path
                      d="M -28,15 C -25,32 -14,38 0,38 C 14,38 25,32 28,15"
                      fill="#FFFFFF"
                      fillOpacity="0.98"
                      stroke="#EFE5E0"
                      strokeWidth="1.8"
                    />
                    {/* Picot Pearl Rim */}
                    <circle cx="-22" cy="27" r="2.2" fill="#FFFFFF" stroke="#DECBC3" strokeWidth="1.0" />
                    <circle cx="-12" cy="35" r="2.6" fill="#FFFFFF" stroke="#DECBC3" strokeWidth="1.0" />
                    <circle cx="0" cy="38" r="3.2" fill="#FFFFFF" stroke="#CFB6AC" strokeWidth="1.2" />
                    <circle cx="12" cy="35" r="2.6" fill="#FFFFFF" stroke="#DECBC3" strokeWidth="1.0" />
                    <circle cx="22" cy="27" r="2.2" fill="#FFFFFF" stroke="#DECBC3" strokeWidth="1.0" />

                    {/* Outer delicate dots */}
                    <circle cx="-26" cy="20" r="1.3" fill="#EAD9D2" />
                    <circle cx="-17" cy="32" r="1.4" fill="#EAD9D2" />
                    <circle cx="-6" cy="37" r="1.4" fill="#EAD9D2" />
                    <circle cx="6" cy="37" r="1.4" fill="#EAD9D2" />
                    <circle cx="17" cy="32" r="1.4" fill="#EAD9D2" />
                    <circle cx="26" cy="20" r="1.3" fill="#EAD9D2" />

                    {/* Inward Scalloped Embroidery */}
                    <path
                      d="M -26,-15 C -22,-28 -12,-33 0,-33 C 12,-33 22,-28 26,-15"
                      fill="#FFFFFF"
                      fillOpacity="0.95"
                      stroke="#EFE5E0"
                      strokeWidth="1.4"
                    />
                    <circle cx="-15" cy="-28" r="1.6" fill="#FFFFFF" stroke="#DECBC3" strokeWidth="0.8" />
                    <circle cx="0" cy="-32" r="2.0" fill="#FFFFFF" stroke="#DECBC3" strokeWidth="0.8" />
                    <circle cx="15" cy="-28" r="1.6" fill="#FFFFFF" stroke="#DECBC3" strokeWidth="0.8" />

                    {/* Central Blooming Baroque Flower Rosette */}
                    <path d="M 0,16 C -8,10 -10,2 0,-4 C 10,2 8,10 0,16 Z" fill="#FDFBF9" stroke="#DBBEB2" strokeWidth="1.2" />
                    <path d="M -16,6 C -10,0 -4,5 0,-4 C -6,-10 -12,-6 -16,6 Z" fill="#FFFFFF" stroke="#DECBC3" strokeWidth="1.0" />
                    <path d="M 16,6 C 10,0 4,5 0,-4 C 6,-10 12,-6 16,6 Z" fill="#FFFFFF" stroke="#DECBC3" strokeWidth="1.0" />
                    <path d="M -12,-14 C -6,-9 -3,-4 0,-4 C -4,2 -9,1 -12,-14 Z" fill="#FFFFFF" stroke="#DECBC3" strokeWidth="1.0" />
                    <path d="M 12,-14 C 6,-9 3,-4 0,-4 C 4,2 9,1 12,-14 Z" fill="#FFFFFF" stroke="#DECBC3" strokeWidth="1.0" />

                    {/* Central pearl */}
                    <circle cx="0" cy="0" r="5.0" fill="#FFFFFF" stroke="#C9A89A" strokeWidth="1.4" />
                    <circle cx="0" cy="0" r="2.8" fill="#F8EFEA" stroke="#B89486" strokeWidth="1.0" />
                    <circle cx="-1.0" cy="-1.0" r="1.2" fill="#FFFFFF" />

                    {/* Acanthus scrolls & volutes */}
                    <path
                      d="M -26,-2 C -32,16 -16,24 -8,14 C 0,4 -14,-2 -26,-2 Z"
                      fill="#FFFFFF"
                      fillOpacity="0.9"
                      stroke="#E5D1C9"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M 26,-2 C 32,16 16,24 8,14 C 0,4 14,-2 26,-2 Z"
                      fill="#FFFFFF"
                      fillOpacity="0.9"
                      stroke="#E5D1C9"
                      strokeWidth="1.2"
                    />

                    {/* Tulle mesh eyelets */}
                    <circle cx="-12" cy="18" r="1.4" fill="#DEC7BD" />
                    <circle cx="12" cy="18" r="1.4" fill="#DEC7BD" />
                    <circle cx="-6" cy="26" r="1.4" fill="#DEC7BD" />
                    <circle cx="6" cy="26" r="1.4" fill="#DEC7BD" />

                    {/* Connecting stitch lines */}
                    <path d="M -28,12 Q 0,8 28,12" fill="none" stroke="#FFFFFF" strokeWidth="2.2" />
                    <path d="M -28,-6 Q 0,-10 28,-6" fill="none" stroke="#FFFFFF" strokeWidth="2.0" />
                    <path d="M -28,-22 Q 0,-26 28,-22" fill="none" stroke="#F4EAE4" strokeWidth="1.4" strokeDasharray="2.5 2" />
                  </g>
                ))}
              </g>

              {/* Right Lace Band: Symmetric reflection across x = 195 */}
              <use href="#singleLaceBand" transform="translate(390, 0) scale(-1, 1)" />
            </g>

            {/* C. WAX SEAL: Scales 1 -> 1.12 then fades with y: -8 drift in 0.45s */}
            <g
              id="waxSealGroup"
              filter="url(#sealShadow)"
              style={{
                transformOrigin: '195px 422px',
                willChange: 'transform, opacity',
              }}
            >
              {/* Organic melted gold wax puddle centered at (195, 422) */}
              <path
                d="M 246.6,426.9 Q 246.4,431.5 243.6,435.9 Q 240.7,440.4 237.4,444.4 Q 234.0,448.3 229.4,451.6 Q 224.8,455.0 219.8,457.7 Q 214.8,460.5 209.1,462.5 Q 203.4,464.4 198.8,467.7 Q 194.2,470.9 190.1,467.5 Q 186.0,464.0 180.8,461.4 Q 175.7,458.8 170.8,455.6 Q 165.9,452.5 161.4,448.6 Q 156.8,444.6 153.6,440.2 Q 150.3,435.8 147.5,431.3 Q 144.7,426.7 144.4,422.1 Q 144.0,417.5 144.6,412.9 Q 145.2,408.4 148.0,403.9 Q 150.8,399.4 153.9,395.4 Q 157.0,391.3 161.6,388.0 Q 166.2,384.6 171.0,382.0 Q 175.9,379.4 181.7,377.2 Q 187.5,375.0 193.0,373.9 Q 198.5,372.9 203.7,374.6 Q 208.9,376.4 213.9,378.5 Q 218.8,380.7 223.7,383.8 Q 228.6,387.0 232.8,390.8 Q 237.1,394.7 240.1,399.1 Q 243.1,403.6 245.2,408.1 Q 247.3,412.7 246.9,417.3 Q 246.5,421.9 246.6,426.9 Z"
                fill="url(#goldMelt)"
              />

              {/* Outer lip highlight ridge */}
              <path
                d="M 246.6,426.9 Q 246.4,431.5 243.6,435.9 Q 240.7,440.4 237.4,444.4 Q 234.0,448.3 229.4,451.6 Q 224.8,455.0 219.8,457.7 Q 214.8,460.5 209.1,462.5 Q 203.4,464.4 198.8,467.7 Q 194.2,470.9 190.1,467.5 Q 186.0,464.0 180.8,461.4 Q 175.7,458.8 170.8,455.6 Q 165.9,452.5 161.4,448.6 Q 156.8,444.6 153.6,440.2 Q 150.3,435.8 147.5,431.3 Q 144.7,426.7 144.4,422.1 Q 144.0,417.5 144.6,412.9 Q 145.2,408.4 148.0,403.9 Q 150.8,399.4 153.9,395.4 Q 157.0,391.3 161.6,388.0 Q 166.2,384.6 171.0,382.0 Q 175.9,379.4 181.7,377.2 Q 187.5,375.0 193.0,373.9 Q 198.5,372.9 203.7,374.6 Q 208.9,376.4 213.9,378.5 Q 218.8,380.7 223.7,383.8 Q 228.6,387.0 232.8,390.8 Q 237.1,394.7 240.1,399.1 Q 243.1,403.6 245.2,408.1 Q 247.3,412.7 246.9,417.3 Q 246.5,421.9 246.6,426.9 Z"
                fill="none"
                stroke="url(#goldRim)"
                strokeWidth="3"
                opacity="0.9"
              />

              {/* Recessed circular moat cavity (r ≈ 43) */}
              <circle cx="195" cy="422" r="43" fill="url(#sealMatrix)" />
              <circle cx="195" cy="422" r="43" fill="none" stroke="#523204" strokeWidth="2.2" opacity="0.8" />
              <circle cx="195" cy="422" r="41.5" fill="none" stroke="#FFEAA1" strokeWidth="1.2" opacity="0.5" />

              {/* Raised inner circular rim (r ≈ 37.5) */}
              <circle cx="195" cy="422" r="37.5" fill="none" stroke="url(#goldRim)" strokeWidth="3.2" />
              <circle cx="195" cy="422" r="34" fill="none" stroke="#5C3805" strokeWidth="1.4" opacity="0.9" />
              <circle cx="195" cy="422" r="32" fill="none" stroke="#FFF2B8" strokeWidth="1.0" opacity="0.9" />

              {/* Beaded inner perimeter ring (r ≈ 30) */}
              <circle cx="195" cy="422" r="30" fill="none" stroke="#FFEDB8" strokeWidth="1.8" strokeDasharray="2 3.5" opacity="0.8" />

              {/* Arabic Calligraphy: "بسم الله الرحمن الرحيم" */}
              <g
                transform="translate(0, 1.2)"
                fill="#4A2903"
                opacity="0.95"
                textAnchor="middle"
                fontFamily="'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif"
                fontWeight="bold"
              >
                <text x="195" y="410" fontSize="12">
                  بِسْمِ اللَّهِ
                </text>
                <text x="195" y="425" fontSize="13">
                  الرَّحْمَٰنِ
                </text>
                <text x="195" y="440" fontSize="13">
                  الرَّحِيمِ
                </text>
              </g>

              <g
                fill="url(#calligraphyGold)"
                textAnchor="middle"
                fontFamily="'Amiri', 'Traditional Arabic', 'Scheherazade New', 'Noto Naskh Arabic', serif"
                fontWeight="bold"
              >
                <text x="195" y="409" fontSize="12">
                  بِسْمِ اللَّهِ
                </text>
                <text x="195" y="424" fontSize="13">
                  الرَّحْمَٰنِ
                </text>
                <text x="195" y="439" fontSize="13">
                  الرَّحِيمِ
                </text>
              </g>

              {/* Glossy reflection sheen arc */}
              <path d="M 166,394 C 182,382 208,382 224,394 C 210,386 180,386 166,394 Z" fill="#FFFFFF" opacity="0.45" />
            </g>

            {/* D. "TAP TO OPEN": Center x = 195, baseline y = 510 */}
            <text
              id="tapToOpenText"
              x="195"
              y="510"
              textAnchor="middle"
              fontFamily="'Cinzel', 'Cormorant Garamond', serif"
              fontSize="11"
              fontWeight="500"
              letterSpacing="0.4em"
              fill="#B9A38F"
              style={{ willChange: 'opacity' }}
            >
              TAP TO OPEN
            </text>
          </svg>
        </div>
      )}

      {/* 2. WARM WHITE LIGHT FLASH OVERLAY (Fixed, pointer-events none, z-[60]) */}
      <div
        id="flashContainer"
        className="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center overflow-hidden"
      >
        {/* Soft bloom: a blurred white circle scaling from 0.2 to 3 */}
        <div
          id="flashBloom"
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '500px',
            height: '500px',
            background: '#FFFFFF',
            filter: 'blur(60px)',
            transformOrigin: '50% 50%',
            willChange: 'transform, opacity',
            opacity: 0,
            transform: 'scale(0.2)',
          }}
        />

        {/* Full-screen warm white light radial-gradient centered at the tip: #FFFFFF -> #FFF3DC -> rgba(255,232,190,0) */}
        <div
          id="flashRadial"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, #FFFFFF 0%, #FFF3DC 45%, rgba(255, 232, 190, 0) 80%)',
            willChange: 'opacity',
            opacity: 0,
          }}
        />
      </div>
    </div>
  );
};

export default SectionEnvelopeIntro;
