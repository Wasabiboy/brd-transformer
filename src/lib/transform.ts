import OpenAI from "openai";

export type TransformOption =
  | "tldr"
  | "podcast"
  | "human-readable"
  | "bullets"
  | "remove-ai";

export type TransformConfig = {
  options: TransformOption[];
};

const TRANSFORM_PROMPTS: Record<TransformOption, string> = {
  tldr: `Rewrite this business requirement document as a concise "Too Long; Didn't Read" (TLDR) summary.
- Lead with the core essence: what the product/project is and why it matters in 2-3 sentences.
- Follow with key highlights as bullet points.
- Include a brief "Details" section for anything important that needs expansion.
- Keep the total length under 400 words.
- Use clear, direct language.`,

  podcast: `Rewrite this business requirement document as a script perfect for a professional speaker to read aloud.
- Use a warm, conversational tone as if explaining to a colleague.
- Structure it like a mini-podcast: opening hook, main points, closing takeaways.
- Avoid jargon; explain technical terms naturally.
- Use short sentences and natural phrasing.
- Add transitional phrases ("Now, let's look at...", "What this means in practice...", etc.)
- No tables—convert tables into narrative or bullet points.
- Length: aim for 3-5 minutes of spoken content (roughly 450-750 words).`,

  "human-readable": `Rewrite this business requirement document to make it more human-readable.
- Remove or simplify AI-sounding phrases (e.g., "leverage", "utilize", "streamline", "holistic", "synergy", "paradigm").
- Replace corporate jargon with plain English.
- Keep the structure logical but make it feel like a person wrote it.
- Preserve important details and requirements.`,

  bullets: `Convert this business requirement document to a bullet-point format.
- Remove all tables; express their content as bullet points.
- Use a clear hierarchy: main points as top-level bullets, details as sub-bullets.
- Keep it scannable and well-organized.
- Preserve all important information.`,

  "remove-ai": `Remove any indication that this document was written or assisted by AI.
- Strip phrases like "As an AI...", "I'll help you...", "Certainly!", "Here's...", "Let me...".
- Remove overly formal or templated openings and closings.
- Make it sound like a human analyst wrote it.
- Preserve all substantive content and requirements.`,
};

function buildSystemPrompt(config: TransformConfig): string {
  const parts = [
    "You are an expert at transforming business requirement documents (BRDs) and product requirement documents (PRDs) into audience-friendly formats.",
    "The user will provide a document and a set of transformation options. Apply ALL specified options in a logical order.",
    "Output only the transformed text—no commentary, no meta-explanation.",
  ];
  return parts.join("\n\n");
}

function buildUserPrompt(config: TransformConfig, document: string): string {
  const optionDescriptions = config.options.map((opt) => TRANSFORM_PROMPTS[opt]);
  const instructions = optionDescriptions.join("\n\n---\n\n");
  return `Apply these transformations to the following document:\n\n${instructions}\n\n---\n\nDOCUMENT:\n\n${document}`;
}

export async function transformDocument(
  document: string,
  config: TransformConfig,
  apiKey?: string
): Promise<{ text: string; error?: string }> {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key) {
    return {
      text: "",
      error: "OpenAI API key not configured. Set OPENAI_API_KEY in your environment.",
    };
  }

  try {
    const openai = new OpenAI({ apiKey: key });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildSystemPrompt(config) },
        { role: "user", content: buildUserPrompt(config, document) },
      ],
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      return { text: "", error: "No content returned from AI" };
    }
    return { text: content };
  } catch (err) {
    return {
      text: "",
      error: err instanceof Error ? err.message : "Transformation failed",
    };
  }
}
