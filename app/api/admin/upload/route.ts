import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Güvenli dosya adı üret (timestamp + sanitize)
    const ext = path.extname(file.name) || '.jpg';
    const cleanName = Date.now() + '-' + Math.random().toString(36).substring(2, 8) + ext;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, cleanName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = '/uploads/' + cleanName;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Görsel yükleme hatası:', error);
    return NextResponse.json({ error: 'Dosya yüklenemedi' }, { status: 500 });
  }
}
