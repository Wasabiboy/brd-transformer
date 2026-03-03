import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";

const DEFAULT_VOICE_ID = "cV3ZSsO9NjgLjLK3FmNC"; // "Phil Wesley-Brown"

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export async function textToSpeech(
  text: string,
  apiKey?: string,
  voiceId?: string
): Promise<{ audio: Buffer; error?: string }> {
  const key = apiKey || process.env.ELEVENLABS_API_KEY;
  if (!key) {
    return {
      audio: Buffer.from([]),
      error:
        "ElevenLabs API key not configured. Set ELEVENLABS_API_KEY in your environment.",
    };
  }

  try {
    const client = new ElevenLabsClient({ apiKey: key });

    // ElevenLabs has a character limit per request (~5000 for turbo); chunk if needed
    const chunkSize = 4000;
    const textChunks: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      textChunks.push(text.slice(i, i + chunkSize));
    }

    const voice = voiceId || DEFAULT_VOICE_ID;
    const audioChunks: Buffer[] = [];
    for (const textChunk of textChunks) {
      const stream = await client.textToSpeech.convert(voice, {
        text: textChunk,
        model_id: "eleven_turbo_v2_5",
        output_format: "mp3_44100_128",
      });
      const buffer = await streamToBuffer(stream);
      audioChunks.push(buffer);
    }

    const audio = Buffer.concat(audioChunks);
    return { audio };
  } catch (err) {
    return {
      audio: Buffer.from([]),
      error: err instanceof Error ? err.message : "Text-to-speech failed",
    };
  }
}
