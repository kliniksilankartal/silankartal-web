/** Blog yazısı tipi */
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  content: string;
}

/** Blog yazısı frontmatter tipi */
export interface BlogFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  slug: string;
}

/** Hizmet tipi */
export interface Service {
  slug: string;
  title: string;
  category?: string;
  shortDescription: string;
  detailedDescription: string;
  image: string;
  benefits: string[];
  coverGradient?: string;
}

/** SSS öğesi tipi */
export interface FAQItem {
  question: string;
  answer: string;
}

/** İletişim formu veri tipi */
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

/** Navigasyon linki tipi */
export interface NavLink {
  label: string;
  href: string;
}
