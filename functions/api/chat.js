
const TOOL_INSTRUCTIONS = {
  assistant:
    "You are RETIMEA AI, a helpful general-purpose assistant. Answer clearly and accurately.",

  writer:
    "You are RETIMEA AI Writer. Help create original books, articles, stories, descriptions and professional content. Use clear structure and adapt to the requested tone.",

  research:
    "You are RETIMEA Research Studio. Analyze topics, explain evidence, identify uncertainty and distinguish established facts from assumptions. Do not invent sources.",

  trading:
    "You are RETIMEA Trading Research. Focus on gold (XAUUSD) and Bitcoin (BTC). Explain technical analysis, market structure, support and resistance, BOS, CHoCH, order blocks and risk management. Do not pretend to have live market data unless supplied. Never guarantee profits or present analysis as personalized financial advice.",

  translator:
    "You are RETIMEA Translator. Translate faithfully while preserving meaning, tone and formatting. Support Sinhala and English as well as other languages.",

  business:
    "You are RETIMEA Business AI. Help users develop business ideas, business plans, marketing strategies, digital products and practical startup plans. Be realistic about costs and risks."
};

export async function onRequestPost(context) {
  try {
    const apiKey = context.env.GROQ_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "AI service is not configured." },
        { status: 500 }
      );
    }

    const body = await context.request.json();
    const tool = body.tool || "assistant";

    if (!Object.hasOwn(TOOL_INSTRUCTIONS, tool)) {
      return Response.json(
        { error: "Unknown RETIMEA AI tool." },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(body.messages) ||
      body.messages.length === 0 ||
      body.messages.length > 20
    ) {
      return Response.json(
        { error: "Invalid conversation." },
        { status: 400 }
      );
    }

    const validMessages = body.messages.every(message =>
      message &&
      ["user", "assistant"].includes(message.role) &&
      typeof message.content === "string" &&
      message.content.trim().length > 0 &&
      message.content.length <= 4000
    );

    if (!validMessages) {
      return Response.json(
        { error: "Invalid message format." },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "system",
              content: TOOL_INSTRUCTIONS[tool]
            },
            ...body.messages.slice(-10)
          ],
          temperature: 0.7,
          max_completion_tokens: 1500
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: "AI provider error. Please try again." },
        { status: response.status === 429 ? 429 : 502 }
      );
    }

    const reply = result.choices?.[0]?.message?.content;

    if (!reply) {
      return Response.json(
        { error: "The AI returned an empty response." },
        { status: 502 }
      );
    }

    return Response.json({ reply });

  } catch (error) {
    return Response.json(
      { error: "Unable to process your request." },
      { status: 500 }
    );
  }
}
