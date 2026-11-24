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
  // Couple Information: Rahma & Omer
  couple: {
    bride: {
      name: 'Rahma',
      firstName: 'رحمة',
      fullName: 'رحمة',
      arabicName: 'رحمة',
      parentsTitle: 'كريمة الأستاذ / يوسف خان',
    },
    groom: {
      name: 'Omer',
      firstName: 'عمر',
      fullName: 'عمر',
      arabicName: 'عمر',
      parentsTitle: 'نجل الأستاذ / إدريس مالك',
    },
  },

  // Primary Wedding Date
  weddingDate: '1 يناير 2027',
  weddingDateFormatted: 'الجمعة، 1 يناير 2027',
  // ISO string for live countdown (Cairo Time UTC+2)
  targetDateISO: '2027-01-01T19:00:00+02:00',

  // Spiritual Inscription
  bismillah: {
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
    verseArabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
    verseArabicFormatted: '﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾',
    surahReferenceArabic: 'سورة الروم — آية ٢١',
    verse: '“ومن آياته أن خلق لكم من أنفسكم أزواجاً لتسكنوا إليها وجعل بينكم مودة ورحمة”',
    reference: 'سورة الروم (الآية ٢١)',
  },

  // Invitation Message Body
  invitationText: {
    welcome: 'بقلوب تفيض فرحاً ومحبة، وببركة من الله وتوفيقه، يسرنا ويشرفنا دعوتكم لحضور حفل زفافنا الميمون',
    honor: 'حضوركم يكتمل به أُنسنا، ودعواتكم الصادقة هي أغلى هدية تزين بداية رحلتنا المباركة.',
  },

  // Comprehensive Venue / Location Information
  venue: {
    title: 'حفل الزفاف المبارك',
    subtitle: 'قاعة رويال للمناسبات • الإسماعيلية',
    estate: 'قاعة رويال',
    address: 'طريق البلاجات، الإسماعيلية، مصر',
    city: 'الإسماعيلية',
    fullAddress: 'قاعة رويال للمناسبات - طريق البلاجات، الإسماعيلية، مصر',
    valetParking: 'خدمة صف السيارات متوفرة مجاناً',
    arrivalNotice: 'يسعدنا ويشرفنا حضوركم في تمام الساعة السابعة مساءً',
    googleMapsUrl: 'https://maps.google.com/?q=Royal+Hall+Ismailia+Egypt',
    embedMapUrl: 'https://maps.google.com/maps?q=Ismailia+Egypt&t=&z=13&ie=UTF8&iwloc=&output=embed',
  },

  // Events & Celebrations (Single Wedding Event)
  events: [
    {
      id: 'wedding',
      name: 'حفل الزفاف الميمون',
      subtitle: 'مراسم عقد القران والاحتفال بحضور الأحباب',
      date: 'الجمعة، 1 يناير 2027',
      time: '7:00 مساءً',
      venue: 'قاعة رويال للمناسبات',
      address: 'طريق البلاجات، الإسماعيلية، مصر',
      description: 'يسرنا دعوتكم لمشاركتنا فرحة العمر، متمنين أن يديم الله المحبة والبهجة في قلوبكم.',
      attire: 'ملابس رسمية / أنيقة',
      googleMapsUrl: 'https://maps.google.com/?q=Royal+Hall+Ismailia+Egypt',
      image: ASSETS.cardNikkah,
    },
  ] as WeddingEvent[],

  // "Our Story" in 3 Chapters (Arabic)
  story: [
    {
      number: '٠١',
      title: 'بداية اللقاء',
      date: 'ربيع ٢٠٢٣',
      text: 'حديث هادئ في أمسية طيبة تلاقت فيها القلوب والأفكار، لتولد المودة المشتركة وتتفق الرؤى والآمال الصادقة نحو الغد.',
    },
    {
      number: '٠٢',
      title: 'تآلف القلوب',
      date: 'خريف ٢٠٢٤',
      text: 'مع مرور الأيام تلاقت المشاعر الصادقة على الخير والوئام، وتأكدت القلوب أن كل خطوة قادمة ستكون أحلى وأجمل بالتعاون والمودة.',
    },
    {
      number: '٠٣',
      title: 'نبدأ الرحلة معاً',
      date: 'شتاء ٢٠٢٥',
      text: 'ببركة من الله ورضا الوالدين ودعوات الأهل والأحباب، تلاقت الدروب لنبدأ معاً عهداً أبدياً يملؤه السكن والرحمة والإخلاص.',
    },
  ] as StoryChapter[],

  // "Our Moments" Photo Gallery
  moments: [
    {
      id: 'moment-1',
      title: 'رحمة وعمر',
      caption: 'قلبان جمعهما الإيمان والمودة والوفاء.',
      image: ASSETS.gallery[0],
    },
    {
      id: 'moment-2',
      title: 'وعد الأصيل',
      caption: 'أمنيات مشرقة تبتسم لمستقبل واعد.',
      image: ASSETS.gallery[1],
    },
    {
      id: 'moment-3',
      title: 'حديث المودة',
      caption: 'أوقات طيبة تلاقت فيها الرؤى بطمأنينة وسرور.',
      image: ASSETS.gallery[2],
    },
    {
      id: 'moment-4',
      title: 'أزهار البهجة',
      caption: 'فرحة تسكن الأفق ونسائم مودة تدوم.',
      image: ASSETS.gallery[3],
    },
    {
      id: 'moment-5',
      title: 'سكينة الغروب',
      caption: 'لحظات هدوء وامتنان لنعم الله الواسعة.',
      image: ASSETS.gallery[4],
    },
    {
      id: 'moment-6',
      title: 'معاً نحو الغد',
      caption: 'خطوات مباركة وواثقة نحو رحلة العمر.',
      image: ASSETS.gallery[5],
    },
  ] as PhotoMoment[],

  // RSVP / Guestbook Configuration
  rsvp: {
    deadline: 'يسعدنا استقبال تهانيكم ودعواتكم العطرة',
    storageKey: 'wedding_guestbook_messages_v1',
    whatsappPhone: '+201000000000', // Egyptian phone format for direct blessings
  },

  // Footer & Credits
  footer: {
    blessing: 'بارك الله لهما وبارك عليهما وجمع بينهما في خير',
    credit: 'صُممت بكل حب لزفاف رحمة & عمر',
  },
} as const;
