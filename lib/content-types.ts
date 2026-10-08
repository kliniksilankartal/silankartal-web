export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon?: string;
  createdAt: string;
}

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  readTime?: string;
  coverImage: string;
  content?: string;
  published: boolean;
}

export interface ServiceItem {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  image: string;
  detailedDescription: string;
  benefits: string[];
}

export interface FAQItemData {
  question: string;
  answer: string;
}

export interface ConditionItemData {
  name: string;
  category: string;
}

export interface ClinicPhilosophy {
  badge: string;
  title: string;
  p1: string;
  p2: string;
  checklist: string[];
  subNote: string;
}

export interface ClinicConditions {
  badge: string;
  title: string;
  subtitle: string;
  cardBadge: string;
  cardTitle: string;
  cardDesc: string;
  quote: string;
  quoteAuthor: string;
  quoteRole: string;
  bottomNote: string;
  items: ConditionItemData[];
}

export interface HomeSections {
  servicesBadge: string;
  servicesTitle: string;
  servicesSubtitle: string;
  blogBadge: string;
  blogTitle: string;
  blogButtonText: string;
  locationBadge: string;
  sundayText: string;
  locationButtonText: string;
}

export interface CustomColors {
  primary: string;      // Birincil renk (Ana butonlar, marka rengi, vurgular)
  secondary: string;    // İkincil renk (Rozetler, açık arka planlar, hafif tonlar)
  accent: string;       // Üçüncül renk (Özel dikkat çekici vurgular, ikon detayları)
  dark: string;         // Dördüncül renk (Koyu başlıklar, derin zemin tonu)
}

export interface ContactPageData {
  formTitle: string;
  formSubtitle: string;
  formDescription: string;
  addressDetail: string;
  whatsappText: string;
  sundayNote: string;
}

export interface SiteContent {
  theme: 'emerald' | 'ocean' | 'terracotta' | 'slate';
  customColors?: CustomColors;
  contactPage?: ContactPageData;
  general: {
    doctorName: string;
    title: string;
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    city: string;
    workingHours: string;
  };
  header: {
    clinicName: string;
    credentials: string;
  };
  images: {
    heroImage: string;
    profileImage: string;
  };
  hero: {
    badge: string;
    badgeSub: string;
    titlePrefix: string;
    titleHighlight: string;
    titleSuffix: string;
    description: string;
    quoteTitle?: string;
    quoteText?: string;
  };
  philosophy?: ClinicPhilosophy;
  conditions?: ClinicConditions;
  homeSections?: HomeSections;
  about: {
    title: string;
    subtitle: string;
    bio: string;
    clinicExperience: string;
    education: string[];
    certifications: string[];
  };
  services: ServiceItem[];
  faq: FAQItemData[];
  footer: {
    description: string;
    copyright: string;
  };
  seo: {
    homeTitle: string;
    homeDescription: string;
  };
  featureCards: FeatureCard[];
  blogPosts: BlogPostItem[];
}

export const defaultHomeSections: HomeSections = {
  servicesBadge: 'YÖNTEMLER & UYGULAMALAR',
  servicesTitle: 'Klinik Fizyoterapi & Manuel Terapi',
  servicesSubtitle: 'Kas-iskelet sistemi, omurga biyomekaniği ve eklem sağlığı için uluslararası kanıta dayalı manuel terapi teknikleri.',
  blogBadge: 'BİLGİ MERKEZİ',
  blogTitle: 'Son Eklenen Sağlık Makaleleri',
  blogButtonText: 'Tüm Yazıları Gör',
  locationBadge: 'LOKASYON & RANDEVU',
  sundayText: 'Açık (08:00 - 22:00)',
  locationButtonText: 'İletişime Geç',
};

export const defaultPhilosophy: ClinicPhilosophy = {
  badge: 'KLİNİK FELSEFEMİZ',
  title: 'Ağrıyı Değil, Ağrıyı Ortaya Çıkaran Mekanizmayı Tedavi Ediyoruz.',
  p1: 'İnsan vücudu parçalardan oluşan bir makine değil, tüm kas-iskelet ve eklem sistemlerinin birbiriyle sürekli iletişim halinde olduğu entegre bir bütündür. Bir boyun ağrısını sadece boyun kaslarına masaj yaparak çözmek çoğu zaman geçici bir rahatlama sağlar.',
  p2: 'Kliniğimizde detaylı ortopedik ve postüral muayene ile omurganın mekanik dizilimini, eklem kısıtlılıklarını, sinir mobilizasyonunu ve kas kuvvet dengesini bir arada değerlendirerek kalıcı iyileşmeyi hedefliyoruz.',
  checklist: [
    'Kişiye özel birebir 50-60 dk seans',
    'Bilimsel ve kanıta dayalı manuel terapi',
    'Egzersiz ve ev reçetesi desteği',
    'Pazar dahil her gün 08:00 - 22:00'
  ],
  subNote: 'İstanbul Üniversitesi Fizik Tedavi & Rehabilitasyon',
};

export const defaultConditions: ClinicConditions = {
  badge: 'Klinik Tedavi Alanlarımız',
  title: 'Sık Karşılaştığımız Rahatsızlıklar & Çözümler',
  subtitle: 'Ağrıyı sadece baskılamak yerine; kök nedene inen biyomekanik ve manuel terapi odaklı klinik yaklaşım.',
  cardBadge: 'Bütüncül Manuel Terapi',
  cardTitle: 'Vücuttaki problemi sadece ağrı olan bölgede aramıyoruz.',
  cardDesc: 'Ağrının kaynağını tespit ederek kas-iskelet ve eklem biyomekaniğini kalıcı biçimde restore ediyoruz. Omurga hizalanması, miyofasyal gerginlikler ve hareket kısıtlılıkları üzerinde çalışarak fonksiyonel dengeyi yeniden kazandırıyoruz.',
  quote: 'Sadece semptomları geçici olarak rahatlatmak yerine; postüral zinciri, eklem biyomekaniğini ve kişiye özel klinik egzersizleri birleştirerek kalıcı ve ameliyatsız iyileşme sağlıyoruz.',
  quoteAuthor: 'Fzt. Şilan Kartal',
  quoteRole: 'Klinik Direktörü',
  bottomNote: '* Belirtilen rahatsızlıkların yanı sıra ameliyat öncesi/sonrası fizik tedavi, postür analizi ve kişiye özel klinik egzersiz programı uygulanmaktadır.',
  items: [
    { name: 'Bel Fıtığı (Lomber Disk Hernisi)', category: 'Omurga' },
    { name: 'Boyun Fıtığı (Servikal Disk Hernisi)', category: 'Omurga' },
    { name: 'Boyun Düzleşmesi & Sırt Ağrısı', category: 'Omurga' },
    { name: 'Siyatik & Piriformis Sendromu', category: 'Sinir Sıkışması' },
    { name: 'Baş Ağrısı ve Gerilim Tipi Migren', category: 'Nörolojik' },
    { name: 'Kulak Çınlaması (Somatosensoriyel Tinnitus)', category: 'Baş-Boyun' },
    { name: 'Diş Sıkma (Bruksizm)', category: 'Çene & TME' },
    { name: 'Çene Eklemi Rahatsızlıkları (TME)', category: 'Çene & TME' },
    { name: 'Donuk Omuz & Omuz Sıkışması', category: 'Eklem' },
    { name: 'Diz Kireçlenmesi (Gonartroz) & Menisküs', category: 'Eklem' },
    { name: 'Sporcu Yaralanmaları & Spora Dönüş', category: 'Sporcu' },
    { name: 'Fibromiyalji & Kronik Ağrı Sendromu', category: 'Miyofasyal' },
  ]
};

export const defaultCustomColors: CustomColors = {
  primary: '#155E54',
  secondary: '#EBF5F3',
  accent: '#0D9488',
  dark: '#192624',
};

export const defaultContactPageData: ContactPageData = {
  formTitle: 'İletişim ve Danışma Formu',
  formSubtitle: 'Özel Sağlık Meslek Hizmet Birimi',
  formDescription: 'Lütfen şikayetinizi ve uygun olduğunuz gün/saat aralığını belirtiniz. En kısa sürede geri dönüş yapılacaktır.',
  addressDetail: 'Ebik İş Merkezi Kat: 2 Daire: 10',
  whatsappText: 'WhatsApp üzerinden mesaj gönderin',
  sundayNote: 'Pazar günleri de dahil olmak üzere haftanın her günü açığız.',
};

export const defaultSiteContent: SiteContent = {
  theme: 'emerald',
  customColors: defaultCustomColors,
  contactPage: defaultContactPageData,
  general: {
    doctorName: 'Fzt. Şilan Kartal',
    title: 'Fizyoterapi & Manuel Terapi',
    phone: '0545 190 10 60',
    whatsapp: '+905451901060',
    email: 'info@silankartal.com.tr',
    address: 'Necmettin Erbakan Caddesi, Ebik İş Merkezi, Kat: 2, Daire: 10, Başakşehir / İstanbul',
    city: 'Başakşehir / İstanbul',
    workingHours: 'Her gün: 08:00 - 22:00',
  },
  header: {
    clinicName: 'Özel Sağlık Meslek Hizmet Birimi',
    credentials: 'Uzm. Fizyoterapist',
  },
  images: {
    heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    profileImage: '/images/avatar-placeholder.png',
  },
  hero: {
    badge: 'Başakşehir Kliniği — İstanbul',
    badgeSub: 'Fizyoterapi & Manuel Terapi',
    titlePrefix: 'Bedeni bir bütün olarak dinliyor,',
    titleHighlight: 'ağrının gerçek kaynağını',
    titleSuffix: 'çözüyoruz.',
    description: 'Sadece semptomları baskılamak yerine omurga biyomekaniği, kas-iskelet sistemi ve sinir sisteminin uyumunu değerlendiriyoruz.',
    quoteTitle: 'Bütüncül Yaklaşım',
    quoteText: '"Ağrı nerede olursa olsun, kaynak biyomekanik zincirin başka bir halkasında olabilir."',
  },
  philosophy: defaultPhilosophy,
  conditions: defaultConditions,
  homeSections: defaultHomeSections,
  about: {
    title: 'Fzt. Şilan Kartal Kimdir?',
    subtitle: 'Klinik Deneyim & Bütüncül Manuel Terapi Yaklaşımı',
    bio: "2018 yılında İstanbul Üniversitesi Fizyoterapi ve Rehabilitasyon Bölümü'nden onur derecesiyle mezun olmuştur. Mezuniyeti sonrasında omurga biyomekaniği, manuel terapi, klinik ortopedi ve sporcu rehabilitasyonu alanlarında uluslararası akreditasyona sahip ileri düzey uzmanlık eğitimlerini tamamlamıştır.",
    clinicExperience: "İstanbul Başakşehir'deki Özel Sağlık Meslek Hizmet Birimi'nde bel ve boyun fıtığı, kas-iskelet sistemi rahatsızlıkları, ameliyat sonrası ortopedik rehabilitasyon ve sporcu sakatlıkları üzerine kanıta dayalı, kişiye özel fizyoterapi hizmeti sunmaktadır.",
    education: [
      'İstanbul Üniversitesi — Fizyoterapi ve Rehabilitasyon (Lisans)',
      'Uluslararası Ortopedik Manuel Terapi (OMT) İleri Düzey Sertifikasyon',
      'Klinik Kuru İğneleme & Miyofasyal Tetik Nokta Tedavisi Eğitimi',
      'Klinik Pilates ve Omurga Biyomekaniği Eğitmenliği',
    ],
    certifications: [
      'Ortopedik Manuel Terapi & Eklem Mobilizasyonu',
      'Klinik Nörodinamik & Sinir Mobilizasyonu',
      'Miyofasyal Ağrı & Kuru İğneleme',
      'Klinik Bantlama & Kinesiotaping',
      'Sporcu Yaralanmaları ve Spora Dönüş Protokolleri',
    ],
  },
  footer: {
    description: "Fzt. Şilan Kartal Özel Sağlık Meslek Hizmet Birimi; Başakşehir'de bel ve boyun fıtığı, manuel terapi, sporcu rehabilitasyonu ve kas-iskelet sistemi rahatsızlıklarında kanıta dayalı, kişiye özel seanslar sunmaktadır.",
    copyright: '© 2026 Fzt. Şilan Kartal. Tüm hakları saklıdır.',
  },
  seo: {
    homeTitle: 'Fzt. Şilan Kartal | Başakşehir Manuel Terapi & Fizyoterapi Kliniği',
    homeDescription: "Başakşehir'de bel ve boyun fıtığı, omurga sağlığı, ortopedik manuel terapi ve sporcu rehabilitasyonu alanlarında uzman klinik fizyoterapi hizmeti.",
  },
  featureCards: [],
  blogPosts: [],
  services: [],
  faq: [],
};
