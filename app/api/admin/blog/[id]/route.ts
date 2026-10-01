import { NextResponse } from 'next/server';
import { getSiteContent, saveSiteContent } from '@/lib/content';
import { revalidatePath } from 'next/cache';

// Tek blog yazısı getir
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const content = getSiteContent();
    const post = content.blogPosts?.find((p) => p.id === id);
    if (!post) return NextResponse.json({ error: 'Yazı bulunamadı.' }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}

// Blog yazısını güncelle
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const siteContent = getSiteContent();
    const posts = siteContent.blogPosts || [];
    const idx = posts.findIndex((p) => p.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Yazı bulunamadı.' }, { status: 404 });

    const oldSlug = posts[idx].slug;
    const updated = {
      ...posts[idx],
      ...body,
      id, // id değişmez
      readTime: body.content
        ? `${Math.max(1, Math.ceil(body.content.split(' ').length / 200))} dk`
        : posts[idx].readTime,
    };
    posts[idx] = updated;
    saveSiteContent({ ...siteContent, blogPosts: posts });

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${oldSlug}`);
    if (body.slug && body.slug !== oldSlug) revalidatePath(`/blog/${body.slug}`);

    return NextResponse.json({ success: true, post: updated });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}

// Blog yazısını sil
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const siteContent = getSiteContent();
    const posts = siteContent.blogPosts || [];
    const post = posts.find((p) => p.id === id);
    if (!post) return NextResponse.json({ error: 'Yazı bulunamadı.' }, { status: 404 });

    const filtered = posts.filter((p) => p.id !== id);
    saveSiteContent({ ...siteContent, blogPosts: filtered });

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
