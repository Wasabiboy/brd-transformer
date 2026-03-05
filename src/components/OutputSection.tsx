"use client";

import { FileText, FileDown, Music } from "lucide-react";

type OutputSectionProps = {
  text: string;
  loading?: boolean;
  onDownload: (format: "text" | "pdf" | "mp3") => Promise<void>;
};

export function OutputSection({
  text,
  loading,
  onDownload,
}: OutputSectionProps) {
  if (loading) {
    return (
      <div className="rounded-xl border border-rilo-border bg-rilo-card/80 p-6">
        <p className="text-rilo-muted">Transforming document...</p>
        <div className="mt-3 h-2 w-48 animate-pulse rounded-full bg-rilo-border" />
      </div>
    );
  }

  if (!text) return null;

  const handleDownload = async (format: "text" | "pdf" | "mp3") => {
    await onDownload(format);
  };

  return (
    <div className="rounded-xl border border-rilo-border bg-rilo-card/80 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-200">Transformed output</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleDownload("text")}
            className="flex items-center gap-1.5 rounded-lg bg-rilo-border px-3 py-1.5 text-xs font-medium text-stone-200 hover:bg-rilo-muted"
          >
            <FileText className="h-3.5 w-3.5" />
            TXT
          </button>
          <button
            onClick={() => handleDownload("pdf")}
            className="flex items-center gap-1.5 rounded-lg bg-rilo-border px-3 py-1.5 text-xs font-medium text-stone-200 hover:bg-rilo-muted"
          >
            <FileDown className="h-3.5 w-3.5" />
            PDF
          </button>
          <button
            onClick={() => handleDownload("mp3")}
            className="flex items-center gap-1.5 rounded-lg bg-rilo-accent px-3 py-1.5 text-xs font-medium text-stone-900 hover:bg-rilo-accent/90"
          >
            <Music className="h-3.5 w-3.5" />
            MP3
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto rounded-lg border border-rilo-border bg-black/20 p-4 text-sm leading-relaxed text-stone-300 whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}
