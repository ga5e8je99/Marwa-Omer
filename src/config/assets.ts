/**
 * Single configuration entry for all visual assets & illustration slots.
 * Served directly from public/assets in Next.js.
 */
export const ASSETS = {
  envelopeBg: '/assets/envelope-bg.svg',
  heroBg: '/assets/hero-bg.svg',
  heroArch: '/assets/hero-arch.svg',
  dividerLace: '/assets/divider-lace.svg',
  bgWatercolor1: '/assets/bg-watercolor-1.svg',
  bgWatercolor2: '/assets/bg-watercolor-2.svg',
  cardMehendi: '/assets/card-mehendi.svg',
  cardNikkah: '/assets/card-nikkah.svg',
  cardWalima: '/assets/card-walima.svg',
  closingBg: '/assets/closing-bg.svg',
  stripLandscape: '/assets/strip-landscape.svg',
  bgInvitationCard: '/assets/bg-invitation-card.svg',
  gallery: [
    '/assets/couple-cartoon.jpg',
    '/assets/gallery/moment-1.svg',
    '/assets/gallery/moment-2.svg',
    '/assets/gallery/moment-3.svg',
    '/assets/gallery/moment-4.svg',
    '/assets/gallery/moment-5.svg',
  ],
  coupleCartoon: '/assets/couple-cartoon.jpg',
  laceV: '/assets/lace-v.png',
  laceVSvg: '/assets/lace-v.svg',
  waxSeal: '/assets/wax-seal.png',
  waxSealSvg: '/assets/wax-seal.svg',
  paperTexture: '/assets/paper-texture.jpg',
} as const;

export type AssetKey = keyof typeof ASSETS;
