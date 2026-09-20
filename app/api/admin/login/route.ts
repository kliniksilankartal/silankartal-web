import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, recordFailedAttempt, resetAttempts, verifyCredentials, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown-ip';
    
    // Check brute force limit
    const limitStatus = checkRateLimit(ip);
    if (!limitStatus.allowed) {
      const minutes = Math.ceil((limitStatus.retryAfterSeconds || 900) / 60);
      return NextResponse.json(
        {
          error: `Çok fazla hatalı giriş denemesi yapıldı. Güvenlik nedeniyle hesabınız ${minutes} dakika kilitlendi.`,
          isLocked: true,
          retryAfterSeconds: limitStatus.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre gereklidir.' },
        { status: 400 }
      );
    }

    const isValid = await verifyCredentials(username, password);

    if (!isValid) {
      const attemptResult = recordFailedAttempt(ip);
      if (attemptResult.isLocked) {
        return NextResponse.json(
          {
            error: '3 kez hatalı giriş yaptınız! Güvenlik nedeniyle sistem 15 dakika kilitlendi.',
            isLocked: true,
            remainingAttempts: 0,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: `Hatalı kullanıcı adı veya şifre! Kalan deneme hakkınız: ${attemptResult.remainingAttempts}`,
          remainingAttempts: attemptResult.remainingAttempts,
          isLocked: false,
        },
        { status: 401 }
      );
    }

    // Success - reset failed attempts
    resetAttempts(ip);

    // Create JWT
    const token = await createToken({ username });

    const response = NextResponse.json({
      success: true,
      message: 'Giriş başarılı!',
    });

    // Set cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
