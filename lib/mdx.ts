import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogFrontmatter } from './types';

/** Blog içeriklerinin bulunduğu dizin */
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

/**
 * Tüm blog yazılarını tarih sırasına göre (yeniden eskiye) döndürür
 */
export function getAllPosts(): BlogPost[] {
  // content/blog dizini yoksa boş dizi döndür
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

  const posts: BlogPost[] = files.map((filename) => {
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const frontmatter = data as BlogFrontmatter;

    return {
      slug: frontmatter.slug || filename.replace('.mdx', ''),
      title: frontmatter.title,
      date: frontmatter.date,
      excerpt: frontmatter.excerpt,
      coverImage: frontmatter.coverImage || '',
      content,
    };
  });

  // Tarihe göre sırala (yeniden eskiye)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Slug'a göre tek bir blog yazısı döndürür
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug);
}

/**
 * Son N blog yazısını döndürür
 */
export function getLatestPosts(count: number = 3): BlogPost[] {
  return getAllPosts().slice(0, count);
}

/**
 * Tüm blog slug'larını döndürür (generateStaticParams için)
 */
export function getAllPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

/**
 * Tarih formatlama (Türkçe)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
