import { NextRequest, NextResponse } from "next/server";
import { extractFromPDF, extractFromWord, extractFromPastedText } from "@/lib/extract";
import { transformDocument, TransformOption } from "@/lib/transform";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const pastedText = formData.get("pastedText") as string | null;
    const optionsRaw = formData.get("options") as string;

    if (!optionsRaw) {
      return NextResponse.json(
        { error: "No transformation options specified" },
        { status: 400 }
      );
    }

    const options = JSON.parse(optionsRaw) as TransformOption[];
    if (!Array.isArray(options) || options.length === 0) {
      return NextResponse.json(
        { error: "Invalid transformation options" },
        { status: 400 }
      );
    }

    let extractedText = "";

    if (file && file.size > 0) {
      const buffer = await file.arrayBuffer();
      const ext = (file.name || "").toLowerCase();

      if (ext.endsWith(".pdf")) {
        const result = await extractFromPDF(buffer);
        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        extractedText = result.text;
      } else if (
        ext.endsWith(".docx") ||
        ext.endsWith(".doc") ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await extractFromWord(buffer);
        if (result.error) {
          return NextResponse.json({ error: result.error }, { status: 400 });
        }
        extractedText = result.text;
      } else {
        return NextResponse.json(
          { error: "Unsupported file type. Use PDF or Word (.docx)" },
          { status: 400 }
        );
      }
    } else if (pastedText && pastedText.trim()) {
      const result = extractFromPastedText(pastedText);
      extractedText = result.text;
    } else {
      return NextResponse.json(
        { error: "Provide either a file or pasted text" },
        { status: 400 }
      );
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "No text could be extracted from the document" },
        { status: 400 }
      );
    }

    const result = await transformDocument(
      extractedText,
      { options },
      undefined
    );

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ text: result.text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    // Never expose API keys or sensitive data in error responses
    const safeMsg = msg.replace(/sk-[a-zA-Z0-9-]+/g, "[REDACTED]");
    console.error("Transform error:", safeMsg);
    return NextResponse.json(
      { error: "Transformation failed. Check your API keys and try again." },
      { status: 500 }
    );
  }
}
