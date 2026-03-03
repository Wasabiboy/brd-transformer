import { NextRequest, NextResponse } from "next/server";
import { textToSpeech } from "@/lib/tts";

const SAMPLE_TEXT =
  "Hello, this is a sample of my voice. Perfect for podcasts and audiobooks.";

export async function POST(req: NextRequest) {
  try {
    const { voice_id } = (await req.json()) as { voice_id: string };
    if (!voice_id) {
      return NextResponse.json(
        { error: "voice_id is required" },
        { status: 400 }
      );
    }

    const { audio, error } = await textToSpeech(SAMPLE_TEXT, undefined, voice_id);
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}
