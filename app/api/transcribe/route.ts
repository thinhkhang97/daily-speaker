import { NextResponse } from "next/server";
import OpenAI, { toFile } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      console.error("No audio file provided");
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    console.log("Audio file received:", audioFile);

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const transcript = await openai.audio.transcriptions.create({
      file: await toFile(buffer, "audio.wav", { type: "audio/wav" }),
      model: "whisper-1",
      response_format: "json",
    });

    console.log("Transcript received:", transcript.text);

    return NextResponse.json({ text: transcript.text });
  } catch (error) {
    console.error("Error processing audio:", error);
    return NextResponse.json(
      { error: "Error processing audio: " + JSON.stringify(error) },
      { status: 500 }
    );
  }
}
