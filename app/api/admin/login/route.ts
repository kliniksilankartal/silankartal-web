import { NextResponse } from 'next/server';
import { checkCredentials, createSession, COOKIE_NAME } from '@/lib/auth';
import {
  checkLoginRateLimit,
  recordFailedAttempt,
  resetLoginAttempts,
  getClientIp,
} from '@/lib/rate-limit';

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const status = checkLoginRateLimit(ip);
  return NextResponse.json(status);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  // 1. Kilit kontrolü: Eğer IP şu an kilitliyse giriş denemesine izin verme
  const limitStatus = checkLoginRateLimit(ip);
  if (limitStatus.locked) {
    return NextResponse.json(
      {
        error: `Çok fazla hatalı giriş denemesi yapıldı. Lütfen ${limitStatus.remainingSeconds} saniye sonra tekrar deneyin.`,
        locked: true,
        remainingSeconds: limitStatus.remainingSeconds,
      },
      { status: 429 }
    );
  }

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Kullanıcı adı ve şifre gerekli.' }, { status: 400 });
    }

    // 2. Kimlik doğrulama
    if (!checkCredentials(username, password)) {
      // Hatalı denemeyi kaydet ve kilit durumunu güncelle
      const failedStatus = recordFailedAttempt(ip);

      if (failedStatus.locked) {
        return NextResponse.json(
          {
            error: `3'ten fazla hatalı giriş denemesi yaptınız! Güvenlik sebebiyle giriş ${failedStatus.remainingSeconds} saniye süreyle kilitlendi.`,
            locked: true,
            remainingSeconds: failedStatus.remainingSeconds,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: `Kullanıcı adı veya şifre hatalı. (Kalan deneme hakkı: ${failedStatus.remainingAttempts})`,
          locked: false,
          remainingAttempts: failedStatus.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 3. Giriş başarılı: Başarısız deneme sayacını sıfırla
    resetLoginAttempts(ip);

    const token = await createSession(username);

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Sunucu hatası. Lütfen tekrar deneyin.' }, { status: 500 });
  }
}
