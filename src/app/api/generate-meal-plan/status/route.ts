const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function toSafeKey(ip: string): string {
  return ip.replace(/[.#$/[\]]/g, "_");
}

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const safeIp = toSafeKey(ip);

  const res = await fetch(`${DB_URL}/rateLimits/${safeIp}.json`);
  const data = await res.json();
  const lastRequest: number | null = data?.lastRequest ?? null;

  const alreadyGeneratedToday = !!lastRequest && Date.now() - lastRequest < ONE_DAY_MS;

  return Response.json({ alreadyGeneratedToday });
}