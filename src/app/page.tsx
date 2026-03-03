"use client";

import { useState } from "react";
import { DocumentDropzone } from "@/components/DocumentDropzone";
import { TransformOptions } from "@/components/TransformOptions";
import { OutputSection } from "@/components/OutputSection";
import { VoiceSelector } from "@/components/VoiceSelector";
import type { TransformOption } from "@/lib/transform";

const OPTION_LABELS: Record<TransformOption, string> = {
  tldr: "TLDR",
  podcast: "Podcast / Audiobook",
  "human-readable": "Human Readable",
  bullets: "Bullet Points",
  "remove-ai": "Plain Text (No AI indicators)",
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [options, setOptions] = useState<TransformOption[]>([]);
  const [output, setOutput] = useState("");
  const [appliedOptions, setAppliedOptions] = useState<TransformOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceId, setVoiceId] = useState("cV3ZSsO9NjgLjLK3FmNC"); // Phil Wesley-Brown

  const hasInput = (file && file.size > 0) || pastedText.trim().length > 0;

  const transform = async () => {
    if (!hasInput || options.length === 0) return;
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      if (file && file.size > 0) {
        formData.append("file", file);
      } else if (pastedText.trim()) {
        formData.append("pastedText", pastedText.trim());
      }
      formData.append("options", JSON.stringify(options));

      const res = await fetch("/api/transform", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Transform failed");
      setOutput(data.text);
      setAppliedOptions(options);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const download = async (format: "text" | "pdf" | "mp3") => {
    if (!output) return;
    const header =
      appliedOptions.length > 0
        ? `Transformed to: ${appliedOptions.map((o) => OPTION_LABELS[o]).join(", ")}\n\n`
        : "";
    const textForDoc = format !== "mp3" ? header + output : output;
    const res = await fetch("/api/output", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: textForDoc,
        format,
        ...(format === "mp3" && voiceId ? { voice_id: voiceId } : {}),
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Download failed");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brd-transformed.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
          BRD Transformer
        </h1>
        <p className="text-slate-400">
          Turn template-driven business requirement documents into TLDR, podcast
          style, or human-readable formats
        </p>
      </header>

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Input
          </h2>
          <DocumentDropzone
            onFile={setFile}
            onPaste={setPastedText}
            acceptPaste
            disabled={loading}
            file={file}
            pastedText={pastedText}
          />
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Transformation options
          </h2>
          <TransformOptions
            selected={options}
            onChange={setOptions}
            disabled={loading}
          />
        </section>

        {options.includes("podcast") && (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Audio voice
            </h2>
            <VoiceSelector
              value={voiceId}
              onChange={setVoiceId}
              disabled={loading}
            />
          </section>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={transform}
            disabled={!hasInput || options.length === 0 || loading}
            className="w-full rounded-xl bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Transforming…" : "Transform document"}
          </button>
          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}
        </div>

        <section>
          <OutputSection
            text={output}
            loading={loading}
            onDownload={download}
          />
        </section>
      </div>

      <footer className="mt-16 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
        <p>Created by Phil Wesley-Brown</p>
      </footer>
    </main>
  );
}
