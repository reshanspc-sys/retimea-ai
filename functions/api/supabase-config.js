// Cloudflare Pages Function: expose only Supabase's public client configuration.
export async function onRequestGet({ env }) {
  const url = env.SUPABASE_URL;
  const anonKey = env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return Response.json(
      { configured: false, error: "Supabase Preview environment variables are not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") throw new Error("HTTPS required");
  } catch {
    return Response.json(
      { configured: false, error: "SUPABASE_URL is not a valid HTTPS URL." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }

  return Response.json(
    { configured: true, url, anonKey },
    { headers: { "Cache-Control": "no-store" } }
  );
}
