-- ==========================================================
-- SILAN KARTAL KLINIK - SUPABASE VERITABANI VE STORAGE KURULUMU
-- ==========================================================
-- Bu scripti Supabase Dashboard -> SQL Editor alanına yapıştırıp "RUN" butonuna basın.

-- 1. Site İçerikleri Tablosu (Vercel Serverless Kalıcılığı İçin)
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY DEFAULT 'current',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Güvenlik) Etkinleştir
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Okuma Politikası (Canlı site ve admin anında okuyabilir)
DROP POLICY IF EXISTS "Public read site_content" ON public.site_content;
CREATE POLICY "Public read site_content" ON public.site_content
  FOR SELECT USING (true);

-- Yazma/Güncelleme Politikası (API route ve admin anında güncelleyebilir)
DROP POLICY IF EXISTS "Service write site_content" ON public.site_content;
CREATE POLICY "Service write site_content" ON public.site_content
  FOR ALL USING (true) WITH CHECK (true);

-- 2. Görsel Depolama Bucket'ı (images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Erişim Politikaları
DROP POLICY IF EXISTS "Public View Images" ON storage.objects;
CREATE POLICY "Public View Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Public Insert Images" ON storage.objects;
CREATE POLICY "Public Insert Images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Public Update Images" ON storage.objects;
CREATE POLICY "Public Update Images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Public Delete Images" ON storage.objects;
CREATE POLICY "Public Delete Images" ON storage.objects
  FOR DELETE USING (bucket_id = 'images');
