import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { ContactFormData } from '@/lib/types';

// Basit rate limiting
const rateLimit = new Map<string, number>();
const RATE_LIMIT_DURATION = 60 * 1000; // 1 dakika

export async function POST(request: NextRequest) {
  try {
    // Rate limiting kontrolü
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const lastRequest = rateLimit.get(ip);
    if (lastRequest && Date.now() - lastRequest < RATE_LIMIT_DURATION) {
      return NextResponse.json(
        { error: 'Çok fazla istek gönderildi. Lütfen bir dakika bekleyin.' },
        { status: 429 }
      );
    }
    rateLimit.set(ip, Date.now());

    // Form verisini al
    const body: ContactFormData = await request.json();

    // Validasyon
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Ad, e-posta ve mesaj alanları zorunludur.' },
        { status: 400 }
      );
    }

    // E-posta doğrulama (basit)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz.' },
        { status: 400 }
      );
    }

    // SMTP ayarları varsa e-posta gönder
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
        subject: `Yeni İletişim Formu: ${body.name}`,
        html: `
          <h2>Yeni İletişim Formu Mesajı</h2>
          <p><strong>Ad Soyad:</strong> ${body.name}</p>
          <p><strong>E-posta:</strong> ${body.email}</p>
          <p><strong>Telefon:</strong> ${body.phone || 'Belirtilmedi'}</p>
          <p><strong>Mesaj:</strong></p>
          <p>${body.message}</p>
        `,
      });
    } else {
      // SMTP ayarları yoksa konsola logla (geliştirme modu)
      console.log('İletişim formu gönderimi (SMTP yapılandırılmamış):', body);
    }

    return NextResponse.json({ success: true, message: 'Mesajınız başarıyla gönderildi.' });
  } catch (error) {
    console.error('İletişim formu hatası:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
}
