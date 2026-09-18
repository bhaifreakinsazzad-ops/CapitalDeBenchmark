// Rate Limiter Service
// In-memory rate limiter for demo purposes
// In production, use Redis or database-backed rate limiting

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  
  let entry = rateLimitStore.get(key);
  
  if (!entry || now >= entry.resetAt) {
    entry = {
      count: 0,
      resetAt: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }
  
  entry.count++;
  
  const allowed = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);
  
  return {
    allowed,
    remaining,
    resetAt: entry.resetAt,
    retryAfter: allowed ? undefined : Math.ceil((entry.resetAt - now) / 1000),
  };
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // Authentication
  AUTH_LOGIN: { maxRequests: 10, windowMs: 15 * 60 * 1000 } as RateLimitConfig, // 10 per 15 min
  AUTH_REGISTER: { maxRequests: 5, windowMs: 60 * 60 * 1000 } as RateLimitConfig, // 5 per hour
  
  // OTP
  OTP_SEND: { maxRequests: 3, windowMs: 15 * 60 * 1000 } as RateLimitConfig, // 3 per 15 min
  OTP_VERIFY: { maxRequests: 10, windowMs: 15 * 60 * 1000 } as RateLimitConfig, // 10 per 15 min
  
  // Wallet operations
  RECHARGE_CREATE: { maxRequests: 10, windowMs: 60 * 60 * 1000 } as RateLimitConfig, // 10 per hour
  WITHDRAWAL_CREATE: { maxRequests: 5, windowMs: 60 * 60 * 1000 } as RateLimitConfig, // 5 per hour
  KYC_SUBMIT: { maxRequests: 3, windowMs: 24 * 60 * 60 * 1000 } as RateLimitConfig, // 3 per day
  
  // Trading
  INVEST: { maxRequests: 20, windowMs: 60 * 60 * 1000 } as RateLimitConfig, // 20 per hour
  ORDER_PLACE: { maxRequests: 30, windowMs: 60 * 60 * 1000 } as RateLimitConfig, // 30 per hour
  ORDER_CANCEL: { maxRequests: 10, windowMs: 60 * 60 * 1000 } as RateLimitConfig, // 10 per hour
  
  // Social
  COMMENT_POST: { maxRequests: 30, windowMs: 60 * 60 * 1000 } as RateLimitConfig, // 30 per hour
  REPORT_CREATE: { maxRequests: 10, windowMs: 24 * 60 * 60 * 1000 } as RateLimitConfig, // 10 per day
  
  // Search
  SEARCH: { maxRequests: 60, windowMs: 60 * 1000 } as RateLimitConfig, // 60 per minute
  
  // Ads
  AD_EVENT: { maxRequests: 5, windowMs: 1000 } as RateLimitConfig, // 5 per second
  
  // Payment
  PAYMENT_INTENT: { maxRequests: 10, windowMs: 60 * 60 * 1000 } as RateLimitConfig, // 10 per hour
  
  // Export
  EXPORT_CSV: { maxRequests: 5, windowMs: 60 * 60 * 1000 } as RateLimitConfig, // 5 per hour
};

// Helper to create rate limit identifier
export function createRateLimitId(prefix: string, ...parts: string[]): string {
  return `${prefix}:${parts.join(':')}`;
}
