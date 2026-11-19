
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
      image: "data:image/jpeg;base64," + result.image
    });

  } catch (error) {
    console.error("Image generation error:", error);

    return Response.json(
      { error: "Image generation failed. Please try again later." },
      { status: 500 }
    );
  }
}
