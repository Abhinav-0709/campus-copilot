import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitStore>();

export interface RateLimitOptions {
  limit?: number; // max requests
  windowMs?: number; // window size in milliseconds
}

export function checkRateLimit(
  req: NextRequest,
  keyPrefix: string = 'general',
  options: RateLimitOptions = {}
): { isAllowed: boolean; response?: NextResponse } {
  const limit = options.limit || 30;
  const windowMs = options.windowMs || 60 * 1000; // default 1 minute

  // Derive client IP identifier
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  const record = memoryStore.get(key);

  if (!record || now > record.resetTime) {
    memoryStore.set(key, { count: 1, resetTime: now + windowMs });
    return { isAllowed: true };
  }

  if (record.count >= limit) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return {
      isAllowed: false,
      response: NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
          },
        }
      ),
    };
  }

  record.count += 1;
  return { isAllowed: true };
}
