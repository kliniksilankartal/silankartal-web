import { NextResponse } from 'next/server';
import { getSiteContentAsync, saveSiteContent } from '@/lib/content';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const data = await getSiteContentAsync();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Content GET error:', error);
    return NextResponse.json({ error: 'İçerik okunamadı' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = await saveSiteContent(body);

    // Tüm sayfaları anında güncelle
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/hakkimda');
    revalidatePath('/iletisim');
    revalidatePath('/sss');
    revalidatePath('/hizmetler');
    revalidatePath('/admin/anasayfa');
    revalidatePath('/admin/gorseller');

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Content POST error:', error);
    return NextResponse.json({ error: 'İçerik kaydedilemedi' }, { status: 500 });
  }
}
