interface RateLimitRecord {
  failedAttempts: number;
  lockoutUntil: number; // timestamp in ms
  lastAttempt: number;
}

// Global in-memory store for failed login attempts
const attemptsMap = new Map<string, RateLimitRecord>();

function cleanupStaleRecords() {
  const now = Date.now();
  for (const [key, record] of attemptsMap.entries()) {
    if (now - record.lastAttempt > 60 * 60 * 1000 && record.lockoutUntil < now) {
      attemptsMap.delete(key);
    }
  }
}

export interface RateLimitStatus {
  locked: boolean;
  remainingSeconds: number;
  failedAttempts: number;
  remainingAttempts: number;
}

/**
 * Checks if a client identifier (e.g. IP) is currently blocked.
 */
export function checkLoginRateLimit(identifier: string): RateLimitStatus {
  cleanupStaleRecords();
  const record = attemptsMap.get(identifier);
  const now = Date.now();

  if (record && record.lockoutUntil > now) {
    const remainingSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
    return {
      locked: true,
      remainingSeconds,
      failedAttempts: record.failedAttempts,
      remainingAttempts: 0,
    };
  }

  const failedAttempts = record ? record.failedAttempts : 0;
  return {
    locked: false,
    remainingSeconds: 0,
    failedAttempts,
    remainingAttempts: Math.max(0, 3 - failedAttempts),
  };
}

/**
 * Records a failed login attempt and determines lockout.
 * - If failed attempts reach 3 or more:
 *   - 3rd attempt: 30 seconds
 *   - 4th attempt: 60 seconds
 *   - 5th attempt: 90 seconds
 *   - 6th+ attempt: 120 seconds
 */
export function recordFailedAttempt(identifier: string): RateLimitStatus {
  const now = Date.now();
  let record = attemptsMap.get(identifier);

  if (!record) {
    record = {
      failedAttempts: 1,
      lockoutUntil: 0,
      lastAttempt: now,
    };
    attemptsMap.set(identifier, record);
    return {
      locked: false,
      remainingSeconds: 0,
      failedAttempts: 1,
      remainingAttempts: 2,
    };
  }

  record.failedAttempts += 1;
  record.lastAttempt = now;

  if (record.failedAttempts >= 3) {
    // 3rd failure: 30s, 4th: 60s, 5th: 90s, 6th+: 120s
    const step = record.failedAttempts - 2; // 1, 2, 3...
    const lockoutDurationSec = Math.min(30 * step, 120);
    record.lockoutUntil = now + lockoutDurationSec * 1000;

    return {
      locked: true,
      remainingSeconds: lockoutDurationSec,
      failedAttempts: record.failedAttempts,
      remainingAttempts: 0,
    };
  }

  return {
    locked: false,
    remainingSeconds: 0,
    failedAttempts: record.failedAttempts,
    remainingAttempts: Math.max(0, 3 - record.failedAttempts),
  };
}

/**
 * Clears failed attempts upon successful login.
 */
export function resetLoginAttempts(identifier: string): void {
  attemptsMap.delete(identifier);
}

/**
 * Extracts client IP from incoming request headers.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
