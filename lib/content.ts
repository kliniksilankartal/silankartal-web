import fs from 'fs';
import path from 'path';
import {
  SiteContent,
  defaultSiteContent,
  defaultPhilosophy,
  defaultConditions,
  defaultHomeSections,
  defaultCustomColors,
  defaultContactPageData,
  ClinicPhilosophy,
  ClinicConditions,
  HomeSections,
  CustomColors,
  ContactPageData
} from './content-types';
import { createServerClient, isSupabaseConfigured } from './supabase';

export * from './content-types';

const dataFilePath = path.join(process.cwd(), 'data', 'site-content.json');

/**
 * In-memory cache:
 * Vercel gibi ortamlarda hızlı okuma ve tekil çalışma örneği için önbellek.
 */
let inMemoryCache: SiteContent | null = null;
let lastSupabaseFetchTime = 0;
const SUPABASE_CACHE_TTL_MS = 15000; // 15 saniye önbellek (her istekte DB yormamak için)

export function parseContent(parsed: Record<string, any>): SiteContent {
  const images = {
    ...defaultSiteContent.images,
    ...(parsed.images || {}),
  };

  // Kullanıcı açıkça görseli kaldırdıysa ('') veya değiştirdiyse varsayılana dönmesin
  if (parsed.images && parsed.images.heroImage !== undefined) {
    images.heroImage = parsed.images.heroImage;
  }
  if (parsed.images && parsed.images.profileImage !== undefined) {
    images.profileImage = parsed.images.profileImage;
  }


  return {
    ...defaultSiteContent,
    ...parsed,
    customColors: { ...defaultCustomColors, ...(parsed.customColors || {}) },
    contactPage: { ...defaultContactPageData, ...(parsed.contactPage || {}) },
    general: { ...defaultSiteContent.general, ...(parsed.general || {}) },
    header: { ...defaultSiteContent.header, ...(parsed.header || {}) },
    images,
    hero: { ...defaultSiteContent.hero, ...(parsed.hero || {}) },
    philosophy: { ...defaultPhilosophy, ...(parsed.philosophy || {}) },
    conditions: { 
      ...defaultConditions, 
      ...(parsed.conditions || {}),
      items: parsed.conditions?.items || defaultConditions.items 
    },
    homeSections: { ...defaultHomeSections, ...(parsed.homeSections || {}) },
    about: { ...defaultSiteContent.about, ...(parsed.about || {}) },
    footer: { ...defaultSiteContent.footer, ...(parsed.footer || {}) },
    seo: { ...defaultSiteContent.seo, ...(parsed.seo || {}) },
    featureCards: parsed.featureCards || defaultSiteContent.featureCards,
    blogPosts: parsed.blogPosts || defaultSiteContent.blogPosts,
    services: parsed.services || defaultSiteContent.services,
    faq: parsed.faq || defaultSiteContent.faq,
  };
}

/**
 * Yerel JSON dosyasından oku
 */
function readFromLocalFile(): SiteContent {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return defaultSiteContent;
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const parsed = JSON.parse(fileData);
    return parseContent(parsed);
  } catch (error) {
    console.error('Local content read error:', error);
    return defaultSiteContent;
  }
}

/**
 * Senkron getSiteContent():
 * Server component'lerde ve sayfalarda kesintisiz render sağlar.
 */
export function getSiteContent(): SiteContent {
  if (inMemoryCache) {
    return inMemoryCache;
  }

  const local = readFromLocalFile();
  inMemoryCache = local;
  return local;
}

/**
 * Asenkron getSiteContentAsync():
 * Eğer Supabase bağlıysa veritabanındaki en güncel veriyi çeker.
 * Vercel serverless ortamlarında verilerin kalıcı olmasını sağlar.
 */
export async function getSiteContentAsync(): Promise<SiteContent> {
  const now = Date.now();
  if (inMemoryCache && (now - lastSupabaseFetchTime < SUPABASE_CACHE_TTL_MS)) {
    return inMemoryCache;
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('site_content')
          .select('data')
          .eq('id', 'current')
          .maybeSingle();

        if (!error && data?.data) {
          const parsed = parseContent(data.data);
          inMemoryCache = parsed;
          lastSupabaseFetchTime = now;
          return parsed;
        }
      }
    } catch (supaErr) {
      console.warn('Supabase fetch error, fallback to local/cache:', supaErr);
    }
  }

  return getSiteContent();
}

/**
 * İçeriği kaydeder:
 * 1. InMemory cache'e yazar
 * 2. Yerel diske (site-content.json) yazmayı dener (lokal için)
 * 3. Supabase bağlıysa 'site_content' tablosuna kalıcı olarak kaydeder (Vercel için kritik!)
 */
export async function saveSiteContent(content: Partial<SiteContent>): Promise<SiteContent> {
  const current = getSiteContent();
  
  const updatedImages = {
    ...(current.images || defaultSiteContent.images),
    ...(content.images || {}),
  };

  // Açıkça boşaltılmış görsel değerlerini koru
  if (content.images && 'heroImage' in content.images) {
    updatedImages.heroImage = content.images.heroImage as string;
  }
  if (content.images && 'profileImage' in content.images) {
    updatedImages.profileImage = content.images.profileImage as string;
  }


  const updated: SiteContent = {
    ...current,
    ...content,
    customColors: { ...(current.customColors || defaultCustomColors), ...(content.customColors || {}) } as CustomColors,
    contactPage: { ...(current.contactPage || defaultContactPageData), ...(content.contactPage || {}) } as ContactPageData,
    general: { ...current.general, ...(content.general || {}) },
    header: { ...current.header, ...(content.header || {}) },
    images: updatedImages,
    hero: { ...current.hero, ...(content.hero || {}) },
    philosophy: { ...current.philosophy, ...(content.philosophy || {}) } as ClinicPhilosophy,
    conditions: { 
      ...current.conditions, 
      ...(content.conditions || {}),
      items: content.conditions?.items !== undefined ? content.conditions.items : current.conditions?.items || []
    } as ClinicConditions,
    homeSections: { ...current.homeSections, ...(content.homeSections || {}) } as HomeSections,
    about: { ...current.about, ...(content.about || {}) },
    footer: { ...current.footer, ...(content.footer || {}) },
    seo: { ...current.seo, ...(content.seo || {}) },
    featureCards: content.featureCards !== undefined ? content.featureCards : current.featureCards,
    blogPosts: content.blogPosts !== undefined ? content.blogPosts : current.blogPosts,
    services: content.services !== undefined ? content.services : current.services,
    faq: content.faq !== undefined ? content.faq : current.faq,
  };

  // 1. Önbelleğe anında kaydet
  inMemoryCache = updated;
  lastSupabaseFetchTime = Date.now();

  // 2. Yerel diske yazmayı dene (lokalde kalıcı olur)
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(updated, null, 2), 'utf8');
  } catch (err) {
    console.warn('Local file write error (read-only filesystem in serverless):', err);
  }

  // 3. Supabase bağlıysa 'site_content' tablosuna kaydet (Vercel'de kalıcı olması için asıl çözüm!)
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerClient();
      if (supabase) {
        const { error: upsertErr } = await supabase
          .from('site_content')
          .upsert({
            id: 'current',
            data: updated,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (upsertErr) {
          console.error('Supabase site_content upsert error:', upsertErr);
        } else {
          console.log('Site content successfully synchronized with Supabase DB.');
        }
      }
    } catch (dbErr) {
      console.error('Supabase database sync failed:', dbErr);
    }
  }

  return updated;
}
