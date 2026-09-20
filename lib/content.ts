import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'site-content.json');

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

export interface SiteContent {
  theme: 'emerald' | 'ocean' | 'terracotta' | 'slate';
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
    clinicImage: string;
  };
  hero: {
    badge: string;
    badgeSub: string;
    titlePrefix: string;
    titleHighlight: string;
    titleSuffix: string;
    description: string;
  };
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

export const defaultSiteContent: SiteContent = {
  theme: 'emerald',
  general: {
    doctorName: 'Fzt. Şilan Kartal',
    title: 'Fizyoterapi & Manuel Terapi',
    phone: '0545 190 10 60',
    whatsapp: '+905451901060',
    email: 'iletisim@silankartal.com.tr',
    address: 'Necmettin Erbakan Caddesi, Ebik İş Merkezi, Kat: 2, Daire: 10, Başakşehir / İstanbul',
    city: 'Başakşehir / İstanbul',
    workingHours: 'Her gün: 08:00 - 22:00',
  },
  header: {
    clinicName: 'Özel Sağlık Merkezi',
    credentials: 'Uzm. Fizyoterapist',
  },
  images: {
    heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
    profileImage: '/images/avatar-placeholder.png',
    clinicImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
  },
  hero: {
    badge: 'Başakşehir Kliniği — İstanbul',
    badgeSub: 'Fizyoterapi & Manuel Terapi',
    titlePrefix: 'Bedeni bir bütün olarak dinliyor, ağrının',
    titleHighlight: 'gerçek kaynağını',
    titleSuffix: 'çözüyoruz.',
    description: 'Sadece semptomları baskılamak yerine omurga biyomekaniği, kas-iskelet sistemi ve sinir sisteminin uyumunu değerlendiriyoruz.',
  },
  about: {
    title: 'Fzt. Şilan Kartal Kimdir?',
    subtitle: 'Klinik Deneyim & Bütüncül Manuel Terapi Yaklaşımı',
    bio: "2018 yılında İstanbul Üniversitesi Fizyoterapi ve Rehabilitasyon Bölümü'nden onur derecesiyle mezun olmuştur. Mezuniyeti sonrasında omurga biyomekaniği, manuel terapi, klinik ortopedi ve sporcu rehabilitasyonu alanlarında uluslararası akreditasyona sahip ileri düzey uzmanlık eğitimlerini tamamlamıştır.",
    clinicExperience: "İstanbul Başakşehir'deki Özel Sağlık Merkezi'nde bel ve boyun fıtığı, kas-iskelet sistemi rahatsızlıkları, ameliyat sonrası ortopedik rehabilitasyon ve sporcu sakatlıkları üzerine kanıta dayalı, kişiye özel fizyoterapi hizmeti sunmaktadır.",
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

export function getSiteContent(): SiteContent {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return defaultSiteContent;
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const parsed = JSON.parse(fileData);
    return {
      ...defaultSiteContent,
      ...parsed,
      general: { ...defaultSiteContent.general, ...(parsed.general || {}) },
      header: { ...defaultSiteContent.header, ...(parsed.header || {}) },
      images: { ...defaultSiteContent.images, ...(parsed.images || {}) },
      hero: { ...defaultSiteContent.hero, ...(parsed.hero || {}) },
      about: { ...defaultSiteContent.about, ...(parsed.about || {}) },
      footer: { ...defaultSiteContent.footer, ...(parsed.footer || {}) },
      seo: { ...defaultSiteContent.seo, ...(parsed.seo || {}) },
      featureCards: parsed.featureCards || defaultSiteContent.featureCards,
      blogPosts: parsed.blogPosts || defaultSiteContent.blogPosts,
      services: parsed.services || defaultSiteContent.services,
      faq: parsed.faq || defaultSiteContent.faq,
    };
  } catch (error) {
    console.error('Error reading site content:', error);
    return defaultSiteContent;
  }
}

export function saveSiteContent(content: Partial<SiteContent>): SiteContent {
  const current = getSiteContent();
  const updated: SiteContent = {
    ...current,
    ...content,
    general: { ...current.general, ...(content.general || {}) },
    header: { ...current.header, ...(content.header || {}) },
    images: { ...current.images, ...(content.images || {}) },
    hero: { ...current.hero, ...(content.hero || {}) },
    about: { ...current.about, ...(content.about || {}) },
    footer: { ...current.footer, ...(content.footer || {}) },
    seo: { ...current.seo, ...(content.seo || {}) },
    featureCards: content.featureCards !== undefined ? content.featureCards : current.featureCards,
    blogPosts: content.blogPosts !== undefined ? content.blogPosts : current.blogPosts,
    services: content.services !== undefined ? content.services : current.services,
    faq: content.faq !== undefined ? content.faq : current.faq,
  };

  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(updated, null, 2), 'utf8');
  } catch (err) {
    console.warn('Local file write error (read-only filesystem in serverless):', err);
  }

  return updated;
}
