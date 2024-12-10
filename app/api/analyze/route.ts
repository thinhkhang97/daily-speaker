import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "Analyze the following text and provide insights about: main topics, sentiment, key points, and any action items or follow-ups needed. Format the response as JSON.",
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    return completion.choices[0].message.content
      ? NextResponse.json(JSON.parse(completion.choices[0].message.content))
      : NextResponse.json({ error: "No content" }, { status: 400 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error analyzing text" },
      { status: 500 }
    );
  }
}
