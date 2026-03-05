"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, Loader2 } from "lucide-react";

export type Voice = {
  voice_id: string;
  name: string;
  preview_url: string | null;
};

type VoiceSelectorProps = {
  value: string;
  onChange: (voiceId: string) => void;
  disabled?: boolean;
};

export function VoiceSelector({
  value,
  onChange,
  disabled,
}: VoiceSelectorProps) {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/api/voices")
      .then((r) => r.json())
      .then((data) => {
        setVoices(data.voices || []);
        if (data.voices?.length && !value) {
          const phil = data.voices.find((v: Voice) => v.voice_id === "cV3ZSsO9NjgLjLK3FmNC");
          onChange(phil ? phil.voice_id : data.voices[0].voice_id);
        }
      })
      .catch(() => setVoices([]))
      .finally(() => setLoading(false));
  }, []);

  const playSample = async (voice: Voice) => {
    if (playingId) {
      audioRef.current?.pause();
      setPlayingId(null);
    }
    if (playingId === voice.voice_id) return;

    setPlayingId(voice.voice_id);
    if (voice.preview_url) {
      const audio = new Audio(voice.preview_url);
      audioRef.current = audio;
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => setPlayingId(null);
      audio.play().catch(() => setPlayingId(null));
    } else {
      try {
        const res = await fetch("/api/voice-sample", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ voice_id: voice.voice_id }),
        });
        if (!res.ok) throw new Error("Failed");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => {
          URL.revokeObjectURL(url);
          setPlayingId(null);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          setPlayingId(null);
        };
        audio.play().catch(() => setPlayingId(null));
      } catch {
        setPlayingId(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-rilo-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading voices...
      </div>
    );
  }

  if (!voices.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-stone-300">
        MP3 voice (for podcast/audiobook output)
      </p>
      <div className="flex flex-wrap gap-2">
        {voices.map((voice) => (
          <div
            key={voice.voice_id}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition ${
              value === voice.voice_id
                ? "border-rilo-accent bg-rilo-accent/10"
                : "border-rilo-border bg-rilo-card/80 hover:border-rilo-muted"
            } ${disabled ? "opacity-50" : ""}`}
          >
            <button
              type="button"
              onClick={() => !disabled && onChange(voice.voice_id)}
              className="text-left text-sm font-medium text-stone-200"
            >
              {voice.name}
            </button>
            <button
              type="button"
              onClick={() => !disabled && playSample(voice)}
              disabled={disabled}
              className="rounded p-1 text-rilo-muted hover:bg-rilo-card hover:text-rilo-accent"
              title="Play sample"
            >
              {playingId === voice.voice_id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
