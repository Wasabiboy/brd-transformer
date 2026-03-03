import { getDocumentProxy, extractText } from "unpdf";
import mammoth from "mammoth";

export type ExtractResult = {
  text: string;
  error?: string;
};

export async function extractFromPDF(buffer: ArrayBuffer): Promise<ExtractResult> {
  try {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return { text: text || "" };
  } catch (err) {
    return {
      text: "",
      error: err instanceof Error ? err.message : "Failed to extract PDF text",
    };
  }
}

export async function extractFromWord(buffer: ArrayBuffer): Promise<ExtractResult> {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return { text: result.value || "" };
  } catch (err) {
    return {
      text: "",
      error: err instanceof Error ? err.message : "Failed to extract Word text",
    };
  }
}

export function extractFromPastedText(text: string): ExtractResult {
  return { text: text.trim() };
}
