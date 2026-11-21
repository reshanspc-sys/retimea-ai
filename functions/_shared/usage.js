const DAILY_LIMITS = {
  assistant: 20,
  writer: 10,
  research: 3,
  trading: 5,
  translator: 10,
  business: 5,
  image: 2,
  document: 3,
};

async function hashIdentifier(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function checkAndRecordUsage(request, env, tool) {
  const limit = DAILY_LIMITS[tool];

  if (!limit) {
    throw new Error("Unknown usage tool: " + tool);
  }

  if (!env.USAGE_KV) {
    throw new Error("USAGE_KV binding is not configured");
  }

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const identifier = await hashIdentifier(ip);

  const today = new Date().toISOString().slice(0, 10);
  const key = `usage:${today}:${identifier}:${tool}`;

  const stored = await env.USAGE_KV.get(key);
  const used = Number.parseInt(stored || "0", 10);

  if (!Number.isFinite(used) || used >= limit) {
    return {
      allowed: false,
      used: Number.isFinite(used) ? used : limit,
      limit,
    };
  }

  const newUsed = used + 1;

  await env.USAGE_KV.put(key, String(newUsed), {
    expirationTtl: 172800,
  });

  return {
    allowed: true,
    used: newUsed,
    limit,
  };
}
