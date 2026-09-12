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
  readTime: string;
  coverImage: string;
  published: boolean;
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
  featureCards: FeatureCard[];
  blogPosts: BlogPostItem[];
}

export function getSiteContent(): SiteContent {
  try {
    if (!fs.existsSync(dataFilePath)) {
      throw new Error('site-content.json not found');
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading site content:', error);
    // Fallback default
    return {
      theme: 'emerald',
      general: {
        doctorName: 'Fzt. Şilan Kartal',
        title: 'Osteopati & Fizyoterapi',
        phone: '+90 555 555 55 55',
        whatsapp: '+905555555555',
        email: 'iletisim@silankartal.com',
        address: 'Valikonağı Cad. No:48, Nişantaşı, Şişli / İstanbul',
        city: 'Şişli / İstanbul',
        workingHours: 'Pzt - Cmt: 09:00 - 19:00'
      },
      images: {
        heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
        profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1000&q=80',
        clinicImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80'
      },
      hero: {
        badge: 'Nişantaşı Kliniği — Şişli / İstanbul',
        badgeSub: 'Bütüncül Osteopati & Ortopedik Manuel Terapi',
        titlePrefix: 'Bedeni bir bütün olarak dinliyor, ağrının',
        titleHighlight: 'gerçek kaynağını',
        titleSuffix: 'çözüyoruz.',
        description: 'Sadece semptomları baskılamak yerine omurga biyomekaniği, visseral gerilimler ve sinir sisteminin uyumunu değerlendiriyoruz.'
      },
      featureCards: [],
      blogPosts: []
    };
  }
}

export function saveSiteContent(content: Partial<SiteContent>): SiteContent {
  const current = getSiteContent();
  const updated = {
    ...current,
    ...content,
    general: { ...current.general, ...(content.general || {}) },
    images: { ...current.images, ...(content.images || {}) },
    hero: { ...current.hero, ...(content.hero || {}) },
    featureCards: content.featureCards || current.featureCards,
    blogPosts: content.blogPosts || current.blogPosts,
  };

  fs.writeFileSync(dataFilePath, JSON.stringify(updated, null, 2), 'utf8');
  return updated;
}
