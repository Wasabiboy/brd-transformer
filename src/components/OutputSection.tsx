"use client";

import { FileText, FileDown, Music, Loader2, FileEdit } from "lucide-react";

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
      <div className="rounded-xl border border-rilo-border bg-rilo-card/80 p-8">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="relative">
            <div className="absolute -inset-3 animate-pulse rounded-full bg-rilo-accent/10" />
            <div className="relative flex h-16 w-16 items-center justify-center">
              <FileEdit className="h-10 w-10 text-rilo-accent" />
              <Loader2 className="absolute h-7 w-7 text-rilo-accent animate-spin" />
            </div>
          </div>
          <p className="text-sm font-medium text-stone-300">Transforming document...</p>
          <div className="h-1.5 w-64 overflow-hidden rounded-full bg-rilo-border">
            <div className="h-full w-1/3 animate-shimmer rounded-full bg-rilo-accent" />
          </div>
        </div>
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
