import OpenAI from "openai";

const SYSTEM_PROMPT =
  "You are Nova, a helpful AI assistant. Answer clearly, warmly, and practically. Keep responses concise unless the user asks for more detail.";

function toInputItems(messages) {
  return messages
    .filter(
      (message) =>
        message &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim()
    )
    .map((message) => ({
      role: message.role,
      content: [
        {
          type: message.role === "assistant" ? "output_text" : "input_text",
          text: message.content.trim()
        }
      ]
    }));
}

export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "OPENAI_API_KEY is missing. Add it to your environment variables." },
      { status: 500 }
    );
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const input = [
      {
        role: "system",
        content: [{ type: "input_text", text: SYSTEM_PROMPT }]
      },
      ...toInputItems(messages)
    ];

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      input
    });

    return Response.json({
      message: response.output_text || "I could not generate a reply."
    });
  } catch (error) {
    console.error("Chat route failed:", error);

    return Response.json(
      {
        error:
          error?.message || "Something went wrong while contacting the model."
      },
      { status: 500 }
    );
  }
}
