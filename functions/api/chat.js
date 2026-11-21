
import { checkAndRecordUsage } from "../_shared/usage.js";

const VISUAL_INSTRUCTIONS = `
You are RETIMEA AI, an intelligent assistant with visual generation capabilities.

Answer the user's question clearly and accurately.

When a visual would genuinely improve the answer, include one or more visual objects in the JSON response.

Supported visual types:

1. "bar" - bar charts
2. "line" - line charts
3. "pie" - pie charts
4. "doughnut" - doughnut charts
5. "mermaid" - flowcharts, process diagrams and explanatory diagrams

Return valid JSON with this structure:
{
  "answer": "Your normal written answer",
  "visuals": [
    {
      "type": "bar",
      "title": "Chart title",
      "description": "What this chart shows",
      "data": {
        "labels": ["A", "B", "C"],
        "datasets": [
          {
            "label": "Example",
            "data": [10, 20, 30]
          }
        ]
      }
    },
    {
      "type": "mermaid",
      "title": "Diagram title",
      "description": "What this diagram explains",
      "code": "flowchart TD; A[Start] --> B[Finish]"
    }
  ]
}

Important accuracy rules:
- Only create visuals when useful.
- Never invent real-world statistics, prices, research findings or market data.
- Use only data supplied by the user or established in the conversation.
- If an example uses hypothetical data, clearly label it as illustrative.
- If reliable numerical data is unavailable, use a conceptual diagram instead.
- Never describe a chart as live unless genuine live data was supplied.
- Do not create empty visuals.
- If no visual is useful, return an empty visuals array.
- Keep the written answer useful even when no visual is generated.
- Return JSON only. Do not wrap it in Markdown code fences.
`;

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

function parseAIResponse(content) {
  try {
    const parsed = JSON.parse(content);

    return {
      answer:
        typeof parsed.answer === "string"
          ? parsed.answer
          : "I couldn't generate a written answer.",

      visuals: Array.isArray(parsed.visuals)
        ? parsed.visuals.slice(0, 4)
        : []
    };
  } catch {
    return {
      answer: content,
      visuals: []
    };
  }
}

function validateVisuals(visuals) {
  const allowedTypes = [
    "bar",
    "line",
    "pie",
    "doughnut",
    "mermaid"
  ];

  return visuals.filter(visual => {
    if (!visual || !allowedTypes.includes(visual.type)) {
      return false;
    }

    if (
      typeof visual.title !== "string" ||
      visual.title.length > 150
    ) {
      return false;
    }

    if (visual.type === "mermaid") {
      return (
        typeof visual.code === "string" &&
        visual.code.length > 5000
          ? false
          : typeof visual.code === "string" &&
            visual.code.trim().length > 0
      );
    }

    return (
      visual.data &&
      Array.isArray(visual.data.labels) &&
      visual.data.labels.length > 0 &&
      visual.data.labels.length <= 50 &&
      Array.isArray(visual.data.datasets) &&
      visual.data.datasets.length > 0 &&
      visual.data.datasets.length <= 5 &&
      visual.data.datasets.every(dataset =>
        dataset &&
        typeof dataset.label === "string" &&
        Array.isArray(dataset.data) &&
        dataset.data.length === visual.data.labels.length &&
        dataset.data.every(value =>
          typeof value === "number" &&
          Number.isFinite(value)
        )
      )
    );
  });
}

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

    const usage = await checkAndRecordUsage(
      context.request,
      context.env,
      tool
    );

    if (!usage.allowed) {
      return Response.json(
        {
          error: "Daily free usage limit reached.",
          usage: {
            used: usage.used,
            limit: usage.limit,
            remaining: 0
          }
        },
        { status: 429 }
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
              content:
                TOOL_INSTRUCTIONS[tool] +
                "\n\n" +
                VISUAL_INSTRUCTIONS
            },
            ...body.messages.slice(-10)
          ],
          response_format: {
            type: "json_object"
          },
          temperature: 0.7,
          max_completion_tokens: 2500
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", result);

      return Response.json(
        { error: "AI provider error. Please try again." },
        { status: response.status === 429 ? 429 : 502 }
      );
    }

    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      return Response.json(
        { error: "The AI returned an empty response." },
        { status: 502 }
      );
    }

    const parsed = parseAIResponse(content);
    const visuals = validateVisuals(parsed.visuals);

    return Response.json({
      reply: parsed.answer,
      visuals,
      usage: {
        used: usage.used,
        limit: usage.limit,
        remaining: Math.max(0, usage.limit - usage.used)
      }
    });

  } catch (error) {
    console.error("RETIMEA chat error:", error);

    return Response.json(
      { error: "Unable to process your request." },
      { status: 500 }
    );
  }
}
