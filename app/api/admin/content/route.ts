import { NextResponse } from 'next/server';
import { getSiteContent, saveSiteContent } from '@/lib/content';

export async function GET() {
  try {
    const data = getSiteContent();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'İçerik okunamadı' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = saveSiteContent(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ error: 'İçerik kaydedilemedi' }, { status: 500 });
  }
}
