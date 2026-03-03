"use client";

import { useState } from "react";
import { DocumentDropzone } from "@/components/DocumentDropzone";
import { TransformOptions } from "@/components/TransformOptions";
import { OutputSection } from "@/components/OutputSection";
import type { TransformOption } from "@/lib/transform";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [options, setOptions] = useState<TransformOption[]>([]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const download = async (format: "text" | "pdf" | "mp3") => {
    if (!output) return;
    const res = await fetch("/api/output", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: output, format }),
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
        <p>
          Requires OpenAI (GPT-4) and ElevenLabs API keys for AI transformation
          and audio. Set{" "}
          <code className="rounded bg-slate-800 px-1">OPENAI_API_KEY</code> and{" "}
          <code className="rounded bg-slate-800 px-1">ELEVENLABS_API_KEY</code>{" "}
          in <code className="rounded bg-slate-800 px-1">.env.local</code>
        </p>
      </footer>
    </main>
  );
}
