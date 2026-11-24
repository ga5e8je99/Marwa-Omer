import { ASSETS } from '../config/assets';

export type Language = 'ar' | 'en';

export interface TranslationData {
  couple: {
    bride: string;
    groom: string;
    parentsTitle: string;
  };
  weddingDate: string;
  weddingDateFormatted: string;
  timeFormatted: string;
  targetDateISO: string;
  bismillah: {
    arabic: string;
    translation?: string;
    verse: string;
    surahReference: string;
  };
  intro: {
    badge: string;
    tapPrompt: string;
    tapSubtitle: string;
    welcomeMsg: string;
    cardTag: string;
  };
  hero: {
    blessing: string;
    verseBadge: string;
    invitationLine: string;
    scrollHint: string;
  };
  event: {
    tag: string;
    title: string;
    description: string;
    dateLabel: string;
    timeLabel: string;
    venueLabel: string;
    venueName: string;
    venueAddress: string;
    attireLabel: string;
    attireValue: string;
    mapButton: string;
  };
  location: {
    tag: string;
    title: string;
    subtitle: string;
    venueTitle: string;
    venueSubtitle: string;
    fullAddress: string;
    mapBadge: string;
    viewLarger: string;
    valetTitle: string;
    valetDesc: string;
    arrivalTitle: string;
    arrivalDesc: string;
    openMapsButton: string;
    copyAddressButton: string;
    copiedText: string;
    blessingFooter: string;
  };
  countdown: {
    tag: string;
    title: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    targetLine: string;
    passedTitle: string;
    passedDesc: string;
    passedFooter: string;
  };
  rsvp: {
    tag: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    attendingLabel: string;
    attendYes: string;
    attendNo: string;
    guestsLabel: string;
    guestOptions: { value: number; label: string }[];
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    submitting: string;
    whatsappButton: string;
    thankYouTitle: string;
    thankYouDesc: string;
    sendAnother: string;
    recentWishes: string;
    liveBadge: string;
    defaultEntries: { name: string; message: string; time: string }[];
  };
  story: {
    tag: string;
    title: string;
    badge: string;
    chapters: {
      number: string;
      label: string;
      title: string;
      date: string;
      text: string;
    }[];
    closingQuote: string;
  };
  gallery: {
    tag: string;
    title: string;
    photoCounter: (curr: number, total: number) => string;
    moments: {
      id: string;
      title: string;
      caption: string;
      image: string;
    }[];
    prevAria: string;
    nextAria: string;
  };
  closing: {
    inscription: string;
    familyBlessing: string;
    dateBadge: string;
    gratitude: string;
    weddingOf: string;
    rights: string;
  };
  controls: {
    autoScrollOn: string;
    autoScrollOff: string;
    musicPlay: string;
    musicMute: string;
    langName: string;
    switchLangPrompt: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationData> = {
  // 1. Egyptian Arabic (اللهجة المصرية الدافئة والأصيلة)
  ar: {
    couple: {
      bride: 'مروة',
      groom: 'عمر',
      parentsTitle: 'برضا الوالدين ودعوات الحبايب والأهل',
    },
    weddingDate: '1 يناير 2027',
    weddingDateFormatted: 'الجمعة، 1 يناير 2027',
    timeFormatted: '7:00 مساءً',
    targetDateISO: '2027-01-01T19:00:00+02:00',
    bismillah: {
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      verse: '﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾',
      surahReference: 'سورة الروم — آية ٢١',
    },
    intro: {
      badge: 'دعوة فرح خاصة للغاليين',
      tapPrompt: 'افتح ظرف الفرح',
      tapSubtitle: 'اضغط على الشمعة الذهبية عشان تفتح الدعوة',
      welcomeMsg: 'مستنيينكم تنورونا وتشاركونا أحلى ليلة',
      cardTag: 'دعوة فرح خاصة ✦ مرحباً بكم',
    },
    hero: {
      blessing: 'برضا الوالدين ودعوات الحبايب والأهل',
      verseBadge: 'آية المحبة والسكن',
      invitationLine: 'يسعدنا ويشرفنا حضوركم عشان فرحتنا متكملش غير بلمتكم الحلوة',
      scrollHint: 'انزل وشوف تفاصيل الفرح',
    },
    event: {
      tag: 'ليلة العمر',
      title: 'حفل الزفاف المبارك',
      description: 'مستنيينكم تنورونا وتشاركونا ليلة من أحلى ليالي العمر، والفرحة مش هتكمل غير بوجودكم جنبنا.',
      dateLabel: 'التاريخ',
      timeLabel: 'الميعاد',
      venueLabel: 'المكان',
      venueName: 'قاعة رويال للمناسبات',
      venueAddress: 'طريق البلاجات، الإسماعيلية، مصر',
      attireLabel: 'اللبس',
      attireValue: 'شيك وفورمال يليق بيكم وبفرحتنا',
      mapButton: 'الموقع على خريطة جوجل',
    },
    location: {
      tag: 'مكان الفرح والوصلة',
      title: 'خريطة الوصول',
      subtitle: 'مستنيينكم تنورونا، الطريق سالك ومباشر وما يتوهش',
      venueTitle: 'قاعة رويال للمناسبات',
      venueSubtitle: 'طريق البلاجات • الإسماعيلية',
      fullAddress: 'قاعة رويال للمناسبات - طريق البلاجات، الإسماعيلية، مصر',
      mapBadge: 'خريطة جوجل لايف',
      viewLarger: 'افتح الخريطة',
      valetTitle: 'ركن العربيات (فاليه مجاناً)',
      valetDesc: 'فيه خدمة ركن سيارات وفاليه متوفرة عشان راحتكم طول السهرة',
      arrivalTitle: 'ميعاد الحضور',
      arrivalDesc: 'بنستناكم تنورونا ونستقبلكم بحب من الساعة السابعة مساءً',
      openMapsButton: 'افتح في خرائط جوجل',
      copyAddressButton: 'انسخ عنوان القاعة',
      copiedText: 'تم نسخ العنوان بنجاح!',
      blessingFooter: 'توصلوا بألف سلامة يا رب ومستنيينكم بكل شوق ومحبة',
    },
    countdown: {
      tag: 'فاضل قد إيه على ليلة العمر',
      title: 'العد التنازلي',
      days: 'يوم',
      hours: 'ساعة',
      minutes: 'دقيقة',
      seconds: 'ثانية',
      targetLine: 'الجمعة، 1 يناير 2027 · الساعة 7:00 مساءً',
      passedTitle: 'الحمد لله الذي بنعمته تتم الصالحات',
      passedDesc: 'تم بحمد الله زفافنا المبارك ونورتونا يا أغلى الناس • نسأل الله دوام السعادة والمودة.',
      passedFooter: 'شكراً لكل اللي فرحنا بوجوده ودعواته الحلوة',
    },
    rsvp: {
      tag: 'كلمة حلوة ودعوة من القلب',
      title: 'دفتر التهاني والمباركات',
      subtitle: 'سيبوا كلمة طيبة أو دعوة تفرح قلب مروة وعمر في بداية مشوارهم.',
      nameLabel: 'اسمك الكريم *',
      namePlaceholder: 'اكتب اسمك هنا عشان نعرف مين منورنا...',
      attendingLabel: 'هتنورونا إن شاء الله؟',
      attendYes: 'جايين ونفرح معاكم أكيد',
      attendNo: 'هنعتذر بمحبة ودعواتنا ليكم',
      guestsLabel: 'عدد المرافقين',
      guestOptions: [
        { value: 1, label: 'أنا فقط (شخص واحد)' },
        { value: 2, label: 'شخصان (أنا ومرافق)' },
        { value: 3, label: '3 أشخاص' },
        { value: 4, label: '4 أشخاص أو أكثر (عيلة)' },
      ],
      messageLabel: 'دعوة حلوة أو كلمة للعروسين *',
      messagePlaceholder: 'اكتب دعوة مباركة أو كلمة من قلبك لمروة وعمر...',
      submitButton: 'سجل تهنئتك في دفتر الفرح',
      submitting: 'جارٍ التسجيل...',
      whatsappButton: 'ابعت التهنئة على واتساب للعروسين علطول',
      thankYouTitle: 'تسلم وتعيش يا {name}',
      thankYouDesc: 'كلامكم الحلو ودعواتكم الصادقة خلت فرحتنا أحلى وأكبر. تهنئتكم اتسجلت في الدفتر!',
      sendAnother: 'إرسال تهنئة تانية',
      recentWishes: 'أحدث التهاني في دفتر الفرح',
      liveBadge: 'مباشر',
      defaultEntries: [
        {
          name: 'أحمد ومي',
          message: 'ألف مليون مبروك لأحلى عريس وعروسة، ربنا يتمملكم على ألف خير ويسعد قلوبكم!',
          time: 'منذ قليل',
        },
        {
          name: 'سارة إبراهيم',
          message: 'ما شاء الله تبارك الله، قمرين ونورتم دنيانا. ألف مبروك يا مروة وعقبال كل الأيام الحلوة يا رب.',
          time: 'منذ قليل',
        },
      ],
    },
    story: {
      tag: 'حكايتنا خطوة بخطوة',
      title: 'قصتنا',
      badge: 'مروة & عمر',
      chapters: [
        {
          number: '٠١',
          label: 'الفصل الأول',
          title: 'بداية الحكاية',
          date: 'ربيع ٢٠٢٣',
          text: 'كلام هادي في يوم طيب ارتاحت فيه القلوب واتفقت فيه الأفكار، وبدأت الحكاية بصفاء نية وأمل كبير في بكرة.',
        },
        {
          number: '٠٢',
          label: 'الفصل الثاني',
          title: 'تآلف القلوب والمودة',
          date: 'خريف ٢٠٢٤',
          text: 'الأيام مشيت وكل يوم بيأكد إن خطوتنا سوا أحلى، المودة كبرت والتفاهم زاد، وعرفنا إننا لبعض وسند لبعض في كل خطوة.',
        },
        {
          number: '٠٣',
          label: 'الفصل الثالث',
          title: 'بداية المشوار سوا',
          date: 'شتاء ٢٠٢٥',
          text: 'برضا ربنا ودعوات الوالدين والأهل الطيبين، قررنا نكمل مشوار العمر سوا ونبني بيتنا على السكن والمودة والرحمة.',
        },
      ],
      closingQuote: 'وعشان كده عازمينكم، حبايبنا وأهلنا، تشاركونا أحلى ليلة ونبدأ سوا أجمل حكاية.',
    },
    gallery: {
      tag: 'أحلى الذكريات',
      title: 'ألبوم اللحظات',
      photoCounter: (curr, total) => `صورة ${curr} من ${total}`,
      moments: [
        {
          id: 'moment-1',
          title: 'مروة وعمر',
          caption: 'قلبين اتجمعوا على الخير والمودة والوفاء.',
          image: ASSETS.gallery[0],
        },
        {
          id: 'moment-2',
          title: 'وعد الأصيل',
          caption: 'أيام حلوة بنرسم فيها بكرة سوا بأمل وابتسامة.',
          image: ASSETS.gallery[1],
        },
        {
          id: 'moment-3',
          title: 'حديث المودة',
          caption: 'لحظات راحة وطمأنينة تملى القلوب بالرضا.',
          image: ASSETS.gallery[2],
        },
        {
          id: 'moment-4',
          title: 'ضحكة من القلب',
          caption: 'فرحة تسكن الأفق ونسائم مودة تدوم للأبد.',
          image: ASSETS.gallery[3],
        },
        {
          id: 'moment-5',
          title: 'سكينة الغروب',
          caption: 'لحظات هدوء وامتنان لنعم ربنا الواسعة.',
          image: ASSETS.gallery[4],
        },
        {
          id: 'moment-6',
          title: 'معاً نحو الغد',
          caption: 'خطوات ثابتة ومباركة نحو رحلة العمر سوا.',
          image: ASSETS.gallery[5],
        },
      ],
      prevAria: 'الصورة السابقة',
      nextAria: 'الصورة التالية',
    },
    closing: {
      inscription: 'فرحتنا متكملش إلا بوجودكم ولمة الحبايب، مستنيينكم تنورونا وتدعولنا من قلوبكم.',
      familyBlessing: 'برضا الوالدين ودعوات الأهل والأحباب',
      dateBadge: '١ · ١ · ٢٠٢٧',
      gratitude: 'بكل الحب والتقدير والامتنان',
      weddingOf: 'حفل زفاف مروة وعمر • قاعة رويال، الإسماعيلية',
      rights: 'جميع الحقوق محفوظة © ٢٠٢٧',
    },
    controls: {
      autoScrollOn: 'تمرير تلقائي',
      autoScrollOff: 'إيقاف التمرير',
      musicPlay: 'الموسيقى',
      musicMute: 'مكتوم',
      langName: 'English',
      switchLangPrompt: 'Switch to English',
    },
  },

  // 2. English (International & Elegant)
  en: {
    couple: {
      bride: 'Marwa',
      groom: 'Omer',
      parentsTitle: 'Together with their families',
    },
    weddingDate: '1 January 2027',
    weddingDateFormatted: 'Friday, 1 January 2027',
    timeFormatted: '7:00 PM',
    targetDateISO: '2027-01-01T19:00:00+02:00',
    bismillah: {
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
      verse: '“And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts.”',
      surahReference: 'Surah Ar-Rum — Verse 21',
    },
    intro: {
      badge: 'Wedding Invitation',
      tapPrompt: 'Open Invitation Envelope',
      tapSubtitle: 'Tap the gold wax seal to open',
      welcomeMsg: 'We look forward to celebrating together',
      cardTag: 'Wedding Invitation ✦ Welcome',
    },
    hero: {
      blessing: 'With the blessings of their families',
      verseBadge: 'A Bond of Love and Peace',
      invitationLine: 'Cordially invite you to celebrate our wedding day and the beginning of our forever',
      scrollHint: 'Scroll down to explore details',
    },
    event: {
      tag: 'The Auspicious Occasion',
      title: 'Wedding Celebration',
      description: 'We warmly invite you to celebrate with us the joyous union of our wedding day and share in our heartfelt happiness.',
      dateLabel: 'Date',
      timeLabel: 'Time',
      venueLabel: 'Venue',
      venueName: 'Royal Event Hall',
      venueAddress: 'El Balajat Road, Ismailia, Egypt',
      attireLabel: 'Attire',
      attireValue: 'Festive & Elegant / Formal',
      mapButton: 'View Location on Google Maps',
    },
    location: {
      tag: 'Venue & Directions',
      title: 'The Location',
      subtitle: 'We look forward to welcoming you to this picturesque setting',
      venueTitle: 'Royal Event Hall',
      venueSubtitle: 'El Balajat Road • Ismailia',
      fullAddress: 'Royal Event Hall - El Balajat Road, Ismailia, Egypt',
      mapBadge: 'Live Google Maps',
      viewLarger: 'View Larger',
      valetTitle: 'Valet Parking',
      valetDesc: 'Complimentary valet parking service is available for all guests',
      arrivalTitle: 'Guest Arrival',
      arrivalDesc: 'We look forward to welcoming you starting from 7:00 PM',
      openMapsButton: 'Open in Google Maps',
      copyAddressButton: 'Copy Venue Address',
      copiedText: 'Address Copied Successfully!',
      blessingFooter: 'May your journey to us be safe and blessed',
    },
    countdown: {
      tag: 'Until The Big Day',
      title: 'Counting Down',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      targetLine: 'Friday, 1 January 2027 · 7:00 PM',
      passedTitle: 'Alhamdulillah, We Are Married',
      passedDesc: 'Thank you for gracing our special day with your presence, warmth, and prayers.',
      passedFooter: 'With deepest gratitude to our cherished family and friends',
    },
    rsvp: {
      tag: 'Wishes & Prayers',
      title: 'Wedding Guestbook',
      subtitle: 'Leave a heartfelt prayer or sweet blessing for Marwa & Omer.',
      nameLabel: 'Your Name *',
      namePlaceholder: 'Please enter your full name...',
      attendingLabel: 'Will you attend?',
      attendYes: 'Joyfully Attending',
      attendNo: 'Regretfully Declining',
      guestsLabel: 'Number of Guests',
      guestOptions: [
        { value: 1, label: '1 Guest (Just me)' },
        { value: 2, label: '2 Guests (Me & +1)' },
        { value: 3, label: '3 Guests' },
        { value: 4, label: '4+ Guests (Family)' },
      ],
      messageLabel: 'Your Blessing or Message *',
      messagePlaceholder: 'Write a warm dua or congratulatory wish for the couple...',
      submitButton: 'Sign Wedding Guestbook',
      submitting: 'Saving...',
      whatsappButton: 'Send Wish to Couple via WhatsApp',
      thankYouTitle: 'Thank You, {name}',
      thankYouDesc: 'Your beautiful words and prayers mean the world to us. Your blessing is saved in our guestbook!',
      sendAnother: 'Send another wish',
      recentWishes: 'Recent Wishes in Guestbook',
      liveBadge: 'Live',
      defaultEntries: [
        {
          name: 'Ahmed & Mai',
          message: 'Warmest congratulations to the sweetest couple! May Allah bless your union with eternal happiness and joy.',
          time: 'Just now',
        },
        {
          name: 'Sara Ibrahim',
          message: 'Mabrouk Marwa & Omer! Wishing you a lifetime of love, laughter, and beautiful blessings.',
          time: 'Just now',
        },
      ],
    },
    story: {
      tag: 'Our Journey',
      title: 'Our Story',
      badge: 'Marwa & Omer',
      chapters: [
        {
          number: '01',
          label: 'Chapter One',
          title: 'The First Spark',
          date: 'Spring 2023',
          text: 'A serene conversation on a quiet evening where hearts felt immediately at peace, ideas aligned, and an earnest chapter began.',
        },
        {
          number: '02',
          label: 'Chapter Two',
          title: 'Growing Together',
          date: 'Autumn 2024',
          text: 'As the days blossomed, each moment reaffirmed how effortless and comforting every step is together, bounded by deep affection and trust.',
        },
        {
          number: '03',
          label: 'Chapter Three',
          title: 'Forever Begins',
          date: 'Winter 2025',
          text: 'With the gracious blessing of God and the prayers of our families, we take this sacred step into building a life of peace and everlasting love.',
        },
      ],
      closingQuote: 'And so we invite you — our dear family and friends — to celebrate with us the beginning of our forever.',
    },
    gallery: {
      tag: 'Memories',
      title: 'Our Moments',
      photoCounter: (curr, total) => `Photo ${curr} of ${total}`,
      moments: [
        {
          id: 'moment-1',
          title: 'Marwa & Omer',
          caption: 'Two souls united in faith, devotion, and love.',
          image: ASSETS.gallery[0],
        },
        {
          id: 'moment-2',
          title: 'A Promise',
          caption: 'Bright hopes welcoming a glorious tomorrow.',
          image: ASSETS.gallery[1],
        },
        {
          id: 'moment-3',
          title: 'Sweet Serenity',
          caption: 'Peaceful moments shared with quiet warmth.',
          image: ASSETS.gallery[2],
        },
        {
          id: 'moment-4',
          title: 'Joy & Radiance',
          caption: 'A happiness that fills the horizon with affection.',
          image: ASSETS.gallery[3],
        },
        {
          id: 'moment-5',
          title: 'Twilight Grace',
          caption: 'Quiet reflections and gratitude for abundant blessings.',
          image: ASSETS.gallery[4],
        },
        {
          id: 'moment-6',
          title: 'Hand in Hand',
          caption: 'Walking forward together into the adventure of a lifetime.',
          image: ASSETS.gallery[5],
        },
      ],
      prevAria: 'Previous photo',
      nextAria: 'Next photo',
    },
    closing: {
      inscription: 'Our celebration is only complete with the warmth of your presence and heartfelt prayers. We look forward to seeing you.',
      familyBlessing: 'With the Blessings of Their Families',
      dateBadge: '1 · 1 · 2027',
      gratitude: 'With Love & Gratitude',
      weddingOf: 'Wedding of Marwa & Omer • Royal Hall, Ismailia',
      rights: 'All Rights Reserved © 2027',
    },
    controls: {
      autoScrollOn: 'Auto Scroll',
      autoScrollOff: 'Pause Scroll',
      musicPlay: 'Music',
      musicMute: 'Muted',
      langName: 'عربي',
      switchLangPrompt: 'التبديل إلى اللهجة المصرية',
    },
  },
};
