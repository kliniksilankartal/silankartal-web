import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET_STRING = process.env.JWT_SECRET || 'silankartal-secret-jwt-key-change-in-production-2026';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

// In-memory brute force protection: IP -> { attempts: number, lockedUntil: number }
interface AttemptRecord {
  attempts: number;
  lockedUntil: number;
}

const loginAttempts = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  if (record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  if (record.lockedUntil <= now && record.attempts >= MAX_ATTEMPTS) {
    // Lockout expired, reset
    loginAttempts.delete(identifier);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  return { allowed: true, remainingAttempts: Math.max(0, MAX_ATTEMPTS - record.attempts) };
}

export function recordFailedAttempt(identifier: string): { remainingAttempts: number; isLocked: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(identifier) || { attempts: 0, lockedUntil: 0 };

  record.attempts += 1;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    loginAttempts.set(identifier, record);
    return {
      remainingAttempts: 0,
      isLocked: true,
      retryAfterSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000)
    };
  }

  loginAttempts.set(identifier, record);
  return {
    remainingAttempts: MAX_ATTEMPTS - record.attempts,
    isLocked: false
  };
}

export function resetAttempts(identifier: string) {
  loginAttempts.delete(identifier);
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'silan123!';
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;

  if (username !== expectedUsername) {
    return false;
  }

  if (expectedHash) {
    return await bcrypt.compare(password, expectedHash);
  }

  // Direct comparison with configured plain password (for simple setup)
  return password === expectedPassword;
}

export async function createToken(payload: { username: string }): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload && typeof payload.username === 'string') {
      return { username: payload.username };
    }
    return null;
  } catch {
    return null;
  }
}
