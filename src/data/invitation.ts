import { ASSETS } from '../config/assets';

export interface WeddingEvent {
  id: string;
  name: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  description: string;
  attire: string;
  googleMapsUrl: string;
  image: string;
}

export interface StoryChapter {
  number: string;
  title: string;
  date?: string;
  text: string;
}

export interface PhotoMoment {
  id: string;
  title: string;
  caption: string;
  image: string;
}

export const INVITATION_DATA = {
  // Couple Information: Marwa & Omer
  couple: {
    bride: {
      firstName: 'Marwa',
      fullName: 'Marwa Khan',
      arabicName: 'مروة',
      parentsTitle: 'D/o Mr. Yusuf Khan & Mrs. Fatima Khan',
    },
    groom: {
      firstName: 'Omer',
      fullName: 'Omer Malik',
      arabicName: 'عمر',
      parentsTitle: 'S/o Mr. Idris Malik & Mrs. Aisha Malik',
    },
  },

  // Primary Wedding Date
  weddingDate: '12 Oct 2026',
  weddingDateFormatted: 'Monday, 12th of October 2026',
  // ISO string for live countdown
  targetDateISO: '2026-10-12T16:00:00',

  // Spiritual Inscription
  bismillah: {
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
    verseArabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    verseArabicFormatted: '﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾',
    surahReferenceArabic: 'سورة الروم — آية ٢١',
    verse: '“And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy.”',
    reference: 'Surah Ar-Rum (30:21)',
  },

  // Invitation Message Body
  invitationText: {
    welcome: 'With immense joy and gratitude in our hearts, we invite you to celebrate the blessed union of our children',
    honor: 'Your gracious presence and heartfelt prayers are our greatest blessings as they embark on this sacred journey together.',
  },

  // Comprehensive Venue / Location Information
  venue: {
    title: 'The Wedding Celebration',
    subtitle: 'Ismailia · Egypt',
    estate: 'Ismailia',
    address: 'Ismailia, Egypt',
    city: 'Ismailia',
    fullAddress: 'Ismailia, Egypt (الإسماعيلية)',
    valetParking: 'Complimentary Valet Parking Available',
    arrivalNotice: 'Please arrive 30 minutes prior to the ceremony',
    googleMapsUrl: 'https://maps.google.com/?q=Ismailia+Egypt',
    embedMapUrl: 'https://maps.google.com/maps?q=Ismailia+Egypt&t=&z=13&ie=UTF8&iwloc=&output=embed',
  },

  // Events & Celebrations (Single Wedding Event)
  events: [
    {
      id: 'wedding',
      name: 'The Wedding Ceremony',
      subtitle: 'The Sacred Vows & Celebration Feast',
      date: 'Monday, 12 October 2026',
      time: '7:00 PM',
      venue: 'The Grand Ballroom',
      address: 'Ismailia, Egypt',
      description: 'The celebration of our wedding and sacred vows, followed by dinner, music, and joyful festivities.',
      attire: 'Formal / Evening Glamour',
      googleMapsUrl: 'https://maps.google.com/?q=Ismailia+Egypt',
      image: ASSETS.cardNikkah,
    },
  ] as WeddingEvent[],

  // "Our Story" in 3 Chapters
  story: [
    {
      number: '01',
      title: 'A Quiet Introduction',
      date: 'Spring 2023',
      text: 'What began across a quiet garden courtyard with warm tea blossomed into hours of effortless conversation, discovering shared values, kindness, and dreams for tomorrow.',
    },
    {
      number: '02',
      title: 'A Shared Dinner',
      date: 'Autumn 2024',
      text: 'Under a canopy of amber lights and autumn leaves, an evening of laughter turned into an unspoken realization: every future felt brighter and sweeter together.',
    },
    {
      number: '03',
      title: 'And So We Begin',
      date: 'Winter 2025',
      text: 'With our families’ warmest blessings and dua, two paths softly aligned into one. Now, with pure hearts, we prepare to step hand-in-hand into forever.',
    },
  ] as StoryChapter[],

  // "Our Moments" Photo Gallery
  moments: [
    {
      id: 'moment-1',
      title: 'Marwa & Omer',
      caption: 'Two souls united in love and faith.',
      image: ASSETS.gallery[0],
    },
    {
      id: 'moment-2',
      title: 'The Golden Hour Promise',
      caption: 'A quiet stroll as twilight touched the hills.',
      image: ASSETS.gallery[1],
    },
    {
      id: 'moment-3',
      title: 'A Quiet Conversation',
      caption: 'Warm tea, shared laughter, and quiet discoveries.',
      image: ASSETS.gallery[2],
    },
    {
      id: 'moment-4',
      title: 'Under the Jasmine Canopy',
      caption: 'Fragrant summer breezes and unspoken promises.',
      image: ASSETS.gallery[3],
    },
    {
      id: 'moment-5',
      title: 'Laughter & Sunset',
      caption: 'Reflections by the lake as day gave way to twilight.',
      image: ASSETS.gallery[4],
    },
    {
      id: 'moment-6',
      title: 'Together Toward Tomorrow',
      caption: 'Stepping softly and joyfully into our new dawn.',
      image: ASSETS.gallery[5],
    },
  ] as PhotoMoment[],

  // With Best Compliments Family List
  compliments: [
    { name: 'The Khan Family', relation: 'Family of the Bride' },
    { name: 'The Malik Family', relation: 'Family of the Groom' },
    { name: 'The Rahman Family', relation: 'Elders & Extended Relations' },
  ],

  // RSVP Configuration & Info
  rsvp: {
    deadline: 'Kindly reply by 15 September 2026',
    storageKey: 'wedding_rsvp_submission_v1',
    // TODO: Connect external backend here (Google Sheets API or Formspree endpoint)
    externalEndpointPlaceholder: 'https://formspree.io/f/your_form_id_here',
  },

  // Footer & Credits
  footer: {
    blessing: 'May Allah bless this union and grant them love, harmony, and eternal peace.',
    credit: 'Designed with love for Marwa & Omer',
  },
} as const;
