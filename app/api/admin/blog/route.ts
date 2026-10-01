import { NextResponse } from 'next/server';
import { getSiteContent, saveSiteContent } from '@/lib/content';
import { revalidatePath } from 'next/cache';

// Tüm blog yazılarını getir
export async function GET() {
  try {
    const content = getSiteContent();
    return NextResponse.json(content.blogPosts || []);
  } catch {
    return NextResponse.json({ error: 'Blog yazıları getirilemedi.' }, { status: 500 });
  }
}

// Yeni blog yazısı ekle
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, coverImage, date, published } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Başlık, slug ve içerik zorunludur.' }, { status: 400 });
    }

    const siteContent = getSiteContent();
    const posts = siteContent.blogPosts || [];

    // Slug benzersizlik kontrolü
    if (posts.some((p) => p.slug === slug)) {
      return NextResponse.json({ error: 'Bu slug zaten kullanılıyor.' }, { status: 400 });
    }

    const newPost = {
      id: `blog-${Date.now()}`,
      slug,
      title,
      excerpt: excerpt || '',
      content,
      coverImage: coverImage || '',
      date: date || new Date().toISOString().split('T')[0],
      readTime: `${Math.max(1, Math.ceil(content.split(' ').length / 200))} dk`,
      published: published !== false,
    };

    const updatedPosts = [newPost, ...posts];
    saveSiteContent({ ...siteContent, blogPosts: updatedPosts });

    // Sayfaları anında güncelle
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({ success: true, post: newPost });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
