const ALLOWED_INTERVALS = new Set([
  "1min", "5min", "15min", "30min", "1h", "4h", "1day", "1week", "1month"
]);

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

function validSymbol(value) {
  return /^[A-Za-z0-9._:/-]{1,30}$/.test(value);
}

export async function onRequestGet(context) {
  try {
    const apiKey = context.env.TWELVE_DATA_API_KEY;
    if (!apiKey) {
      return json({
        success: false,
        error: "Market data is not configured for this preview environment."
      }, 503);
    }

    const url = new URL(context.request.url);
    const action = url.searchParams.get("action") || "quote";
    const symbols = (url.searchParams.get("symbol") || "")
      .split(",")
      .map(value => value.trim())
      .filter(Boolean);

    if (!["quote", "time_series"].includes(action)) {
      return json({ success: false, error: "Unsupported market data action." }, 400);
    }

    if (
      symbols.length === 0 ||
      symbols.length > 8 ||
      !symbols.every(validSymbol)
    ) {
      return json({
        success: false,
        error: "Provide between 1 and 8 valid market symbols."
      }, 400);
    }

    const params = new URLSearchParams({
      symbol: symbols.join(","),
      apikey: apiKey
    });

    if (action === "time_series") {
      const interval = url.searchParams.get("interval") || "1day";
      if (!ALLOWED_INTERVALS.has(interval)) {
        return json({ success: false, error: "Unsupported chart interval." }, 400);
      }

      const outputsize = Number.parseInt(url.searchParams.get("outputsize") || "30", 10);
      if (!Number.isInteger(outputsize) || outputsize < 1 || outputsize > 100) {
        return json({ success: false, error: "Chart size must be between 1 and 100." }, 400);
      }

      params.set("interval", interval);
      params.set("outputsize", String(outputsize));
      params.set("format", "JSON");
    }

    const providerUrl = new URL(
      action === "quote"
        ? "https://api.twelvedata.com/quote"
        : "https://api.twelvedata.com/time_series"
    );
    providerUrl.search = params.toString();

    const upstream = await fetch(providerUrl.toString(), {
      headers: { "Accept": "application/json" }
    });

    const payload = await upstream.json();

    if (!upstream.ok || payload.status === "error" || payload.code) {
      console.error("Twelve Data response:", {
        status: upstream.status,
        code: payload.code || null,
        message: payload.message || null
      });

      return json({
        success: false,
        error: payload.message || "The market data provider could not complete the request.",
        providerCode: payload.code || null
      }, upstream.status === 429 ? 429 : 502);
    }

    return json({
      success: true,
      action,
      data: payload
    });
  } catch (error) {
    console.error("RETIMEA market data error:", error);
    return json({
      success: false,
      error: "Unable to retrieve market data right now."
    }, 502);
  }
}
