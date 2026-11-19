
export async function onRequestPost(context) {
  const corsHeaders = {
    "Content-Type": "application/json"
  };

  try {
    const apiKey = context.env.GROQ_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Groq API key is not configured." },
        { status: 500 }
      );
    }

    const body = await context.request.json();

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return Response.json(
        { error: "Please provide a message." },
        { status: 400 }
      );
    }

    // Keep only the latest 10 messages.
    const messages = body.messages.slice(-10);

    const validMessages = messages.every(message =>
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

    const groqResponse = await fetch(
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
              content: "You are RETIMEA AI, a helpful, friendly and intelligent assistant. Give clear, accurate and useful answers. Be honest when you are uncertain."
            },
            ...messages
          ],
          temperature: 0.7,
          max_completion_tokens: 1500
        })
      }
    );

    const result = await groqResponse.json();

    if (!groqResponse.ok) {
      return Response.json(
        { error: "The AI provider could not process your request. Please try again." },
        { status: groqResponse.status === 429 ? 429 : 502 }
      );
    }

    const reply = result.choices?.[0]?.message?.content;

    if (!reply) {
      return Response.json(
        { error: "The AI returned an empty response." },
        { status: 502 }
      );
    }

    return Response.json({ reply }, { headers: corsHeaders });

  } catch (error) {
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
