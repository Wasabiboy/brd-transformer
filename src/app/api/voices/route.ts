import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

// Curated voices including Phil - used as fallback or when API returns empty
const CURATED_VOICES = [
  { voice_id: "cV3ZSsO9NjgLjLK3FmNC", name: "Phil Wesley-Brown" },
  { voice_id: "pNInz6obpgDQGcFmaJgB", name: "Adam" },
  { voice_id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
  { voice_id: "EXAVITQu4vr4xnSDxMaL", name: "Bella" },
  { voice_id: "ErXwobaYiN019PkySvjV", name: "Antoni" },
  { voice_id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh" },
  { voice_id: "VR6AewLTigWG4xSOukaG", name: "Arnold" },
  { voice_id: "AZnzlk1XvdvUeBnXmlld", name: "Domi" },
];

export async function GET() {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const client = new ElevenLabsClient({ apiKey: key });
    const res = await client.voices.getAll({
      show_legacy: true,
    });

    const voices = (res.voices || []).map((v) => ({
      voice_id: v.voice_id,
      name: v.name || "Unknown",
      preview_url: v.preview_url ?? null,
    }));

    // Merge with curated list so Phil and others are always available
    const curatedIds = new Set(CURATED_VOICES.map((v) => v.voice_id));
    const fromApi = new Set(voices.map((v) => v.voice_id));
    for (const v of CURATED_VOICES) {
      if (!fromApi.has(v.voice_id)) {
        voices.push({
          voice_id: v.voice_id,
          name: v.name,
          preview_url: null, // No preview for custom/curated without API
        });
      }
    }

    // Phil Wesley-Brown first
    const philId = "cV3ZSsO9NjgLjLK3FmNC";
    voices.sort((a, b) =>
      a.voice_id === philId ? -1 : b.voice_id === philId ? 1 : 0
    );

    return NextResponse.json({ voices });
  } catch (err) {
    // Fallback to curated list if API fails
    return NextResponse.json({
      voices: CURATED_VOICES.map((v) => ({
        ...v,
        preview_url: null,
      })),
    });
  }
}
