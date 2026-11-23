import envelopeBg from '../assets/envelope-bg.svg';
import heroBg from '../assets/hero-bg.svg';
import heroArch from '../assets/hero-arch.svg';
import dividerLace from '../assets/divider-lace.svg';
import bgWatercolor1 from '../assets/bg-watercolor-1.svg';
import bgWatercolor2 from '../assets/bg-watercolor-2.svg';
import cardMehendi from '../assets/card-mehendi.svg';
import cardNikkah from '../assets/card-nikkah.svg';
import cardWalima from '../assets/card-walima.svg';
import closingBg from '../assets/closing-bg.svg';
import stripLandscape from '../assets/strip-landscape.svg';
import bgInvitationCard from '../assets/bg-invitation-card.svg';
import moment1 from '../assets/gallery/moment-1.svg';
import moment2 from '../assets/gallery/moment-2.svg';
import moment3 from '../assets/gallery/moment-3.svg';
import moment4 from '../assets/gallery/moment-4.svg';
import moment5 from '../assets/gallery/moment-5.svg';
import laceVPng from '../assets/lace-v.png';
import laceVSvg from '../assets/lace-v.svg';
import waxSealPng from '../assets/wax-seal.png';
import waxSealSvg from '../assets/wax-seal.svg';
import paperTextureJpg from '../assets/paper-texture.jpg';
import coupleCartoonJpg from '../assets/couple-cartoon.jpg';

/**
 * Single configuration entry for all visual assets & illustration slots.
 * Replace or customize any SVG or URL here to update the entire experience.
 */
export const ASSETS = {
  envelopeBg,
  heroBg,
  heroArch,
  dividerLace,
  bgWatercolor1,
  bgWatercolor2,
  cardMehendi,
  cardNikkah,
  cardWalima,
  closingBg,
  stripLandscape,
  bgInvitationCard,
  gallery: [coupleCartoonJpg, moment1, moment2, moment3, moment4, moment5],
  coupleCartoon: coupleCartoonJpg,
  laceV: laceVPng,
  laceVSvg: laceVSvg,
  waxSeal: waxSealPng,
  waxSealSvg: waxSealSvg,
  paperTexture: paperTextureJpg,
} as const;

export type AssetKey = keyof typeof ASSETS;
