import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createServerClient, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Lütfen geçerli bir görsel dosyası seçin (PNG, JPG, WEBP).' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let savedUrl: string | null = null;

    // 1. Supabase Storage Kontrolü (Yapılandırılmışsa)
    if (isSupabaseConfigured()) {
      try {
        const supabase = createServerClient();
        if (supabase) {
          const ext = path.extname(file.name) || '.webp';
          const filename = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

          const { data, error } = await supabase.storage
            .from('images')
            .upload(filename, buffer, {
              contentType: file.type || 'image/webp',
              upsert: true,
            });

          if (!error && data) {
            const { data: publicData } = supabase.storage
              .from('images')
              .getPublicUrl(filename);
            savedUrl = publicData.publicUrl;
            console.log('Görsel Supabase Storage üzerine başarıyla yüklendi:', savedUrl);
          } else if (error) {
            console.warn('Supabase storage upload error:', error.message);
          }
        }
      } catch (supaErr) {
        console.warn('Supabase storage upload failed:', supaErr);
      }
    }

    // 2. Yerel Disk Depolama (Vercel ortamında değilse veya Supabase yoksa)
    if (!savedUrl && !process.env.VERCEL) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const ext = path.extname(originalName) || '.webp';
        const base = path.basename(originalName, ext);
        const uniqueName = `${base}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;

        const filePath = path.join(uploadDir, uniqueName);
        await writeFile(filePath, buffer);
        savedUrl = `/uploads/${uniqueName}`;
      } catch (fsErr: any) {
        console.warn('Filesystem write failed (falling back to data URI):', fsErr.message);
      }
    }

    // 3. Vercel / Serverless Salt-Okunur Sistem için Kesintisiz Fail-Safe: Base64 Data URI
    if (!savedUrl) {
      const mimeType = file.type || 'image/webp';
      savedUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({ success: true, url: savedUrl });
  } catch (error: any) {
    console.error('Görsel yükleme hatası:', error);
    return NextResponse.json(
      { error: error?.message || 'Görsel yüklenirken bir sorun oluştu.' },
      { status: 500 }
    );
  }
}
