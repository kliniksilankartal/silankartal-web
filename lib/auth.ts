import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'silan-kartal-klinik-super-secret-jwt-key-2026'
);

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'silankartalweb.123';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'LQeCfFgY70';

export const COOKIE_NAME = 'admin_session';

export function checkCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export async function createSession(username: string): Promise<string> {
  return await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(SECRET);
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}
