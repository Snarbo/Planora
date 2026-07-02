const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

// RTDB keys can't contain . # $ / [ ]
export function toSafeKey(ip: string): string {
  return ip.replace(/[.#$/[\]]/g, "_");
}

type RateLimitResult = {
  allowed: boolean;
  retryAfterMs?: number;
};

// Fixed-window counter: allows `limit` requests per `windowMs`, per key.
export async function checkAndIncrementRateLimit(
  path: string,
  safeIp: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const url = `${DB_URL}/${path}/${safeIp}.json`;
  const now = Date.now();

  const getRes = await fetch(url);
  const record: { count: number; windowStart: number } | null = await getRes.json();

  const isNewWindow = !record || now - record.windowStart > windowMs;

  if (isNewWindow) {
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: 1, windowStart: now }),
    });
    return { allowed: true };
  }

  if (record.count >= limit) {
    return { allowed: false, retryAfterMs: windowMs - (now - record.windowStart) };
  }

  await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count: record.count + 1, windowStart: record.windowStart }),
  });

  return { allowed: true };
}