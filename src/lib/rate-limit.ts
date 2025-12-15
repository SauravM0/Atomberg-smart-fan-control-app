
interface RateLimitRecord {
    count: number;
    resetTime: number;
}

const store = new Map<string, RateLimitRecord>();

// Simple cleanup every minute to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
        if (now > record.resetTime) {
            store.delete(key);
        }
    }
}, 60 * 1000);

export function checkRateLimit(ip: string, limit: number = 20, windowMs: number = 60 * 1000): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const record = store.get(ip);

    if (!record) {
        store.set(ip, { count: 1, resetTime: now + windowMs });
        return { allowed: true, remaining: limit - 1 };
    }

    if (now > record.resetTime) {
        store.set(ip, { count: 1, resetTime: now + windowMs });
        return { allowed: true, remaining: limit - 1 };
    }

    if (record.count >= limit) {
        return { allowed: false, remaining: 0 };
    }

    record.count += 1;
    return { allowed: true, remaining: limit - record.count };
}
