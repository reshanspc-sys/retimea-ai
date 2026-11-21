
import { checkAndRecordUsage } from "../_shared/usage.js";

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // Basic request-size protection
    const contentLength = Number(
      request.headers.get("content-length") || 0
    );

    if (contentLength > 5000) {
      return Response.json(
        { error: "Request is too large." },
        { status: 413 }
      );
    }

    if (!env.AI) {
      return Response.json(
        { error: "Image service is not configured." },
        { status: 503 }
      );
    }

    const body = await request.json();

    const prompt = typeof body.prompt === "string"
      ? body.prompt.trim()
      : "";

    if (!prompt || prompt.length > 1200) {
      return Response.json(
        { error: "Enter a prompt between 1 and 1200 characters." },
        { status: 400 }
      );
    }

    // Check and record daily image usage.
    const usage = await checkAndRecordUsage(
      request,
      env,
      "image"
    );

    if (!usage.allowed) {
      return Response.json(
        {
          error: "Daily free image generation limit reached.",
          usage: {
            used: usage.used,
            limit: usage.limit,
            remaining: 0
          }
        },
        { status: 429 }
      );
    }

    const result = await env.AI.run(
      "@cf/black-forest-labs/flux-1-schnell",
      {
        prompt: prompt,
        steps: 4
      }
    );

    if (!result || !result.image) {
      throw new Error("No image returned");
    }

    return Response.json({
      success: true,
      image: "data:image/jpeg;base64," + result.image,
      usage: {
        used: usage.used,
        limit: usage.limit,
        remaining: Math.max(0, usage.limit - usage.used)
      }
    });

  } catch (error) {
    console.error("Image generation error:", error);

    return Response.json(
      { error: "Image generation failed. Please try again later." },
      { status: 500 }
    );
  }
}
