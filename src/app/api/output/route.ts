import { NextRequest, NextResponse } from "next/server";
import { generatePDF, generateTextFile } from "@/lib/output";
import { textToSpeech } from "@/lib/tts";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, format } = body as { text: string; format: "text" | "pdf" | "mp3" };

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    if (!["text", "pdf", "mp3"].includes(format)) {
      return NextResponse.json(
        { error: "Format must be text, pdf, or mp3" },
        { status: 400 }
      );
    }

    if (format === "text") {
      const buffer = generateTextFile(text);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="brd-transformed.txt"`,
        },
      });
    }

    if (format === "pdf") {
      const buffer = generatePDF(text);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="brd-transformed.pdf"`,
        },
      });
    }

    if (format === "mp3") {
      const { audio, error } = await textToSpeech(text);
      if (error) {
        return NextResponse.json({ error }, { status: 500 });
      }
      return new NextResponse(audio, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Disposition": `attachment; filename="brd-transformed.mp3"`,
        },
      });
    }

    return NextResponse.json({ error: "Unknown format" }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    const safeMsg = msg.replace(/sk-[a-zA-Z0-9-]+/g, "[REDACTED]");
    console.error("Output error:", safeMsg);
    return NextResponse.json(
      { error: "Output generation failed. Check your configuration." },
      { status: 500 }
    );
  }
}
