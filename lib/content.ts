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

export * from './content-types';

const dataFilePath = path.join(process.cwd(), 'data', 'site-content.json');

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
      customColors: { ...defaultCustomColors, ...(parsed.customColors || {}) },
      contactPage: { ...defaultContactPageData, ...(parsed.contactPage || {}) },
      general: { ...defaultSiteContent.general, ...(parsed.general || {}) },
      header: { ...defaultSiteContent.header, ...(parsed.header || {}) },
      images: { ...defaultSiteContent.images, ...(parsed.images || {}) },
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
    customColors: { ...(current.customColors || defaultCustomColors), ...(content.customColors || {}) } as CustomColors,
    contactPage: { ...(current.contactPage || defaultContactPageData), ...(content.contactPage || {}) } as ContactPageData,
    general: { ...current.general, ...(content.general || {}) },
    header: { ...current.header, ...(content.header || {}) },
    images: { ...current.images, ...(content.images || {}) },
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

  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(updated, null, 2), 'utf8');
  } catch (err) {
    console.warn('Local file write error (read-only filesystem in serverless):', err);
  }

  return updated;
}
