import { NextResponse } from 'next/server';
import { getSiteContent, saveSiteContent } from '@/lib/content';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const data = getSiteContent();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'İçerik okunamadı' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = saveSiteContent(body);

    // Tüm sayfaları anında güncelle
    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/hakkimda');
    revalidatePath('/iletisim');
    revalidatePath('/sss');
    revalidatePath('/hizmetler');

    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ error: 'İçerik kaydedilemedi' }, { status: 500 });
  }
}
