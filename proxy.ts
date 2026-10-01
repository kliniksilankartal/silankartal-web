import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'silan-kartal-klinik-super-secret-jwt-key-2026'
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/login her zaman doğrudan açılsın (otomatik yönlendirme yapılmasın)
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // /admin/* yollarını koru (login hariç)
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_session')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
