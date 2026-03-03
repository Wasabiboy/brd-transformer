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
      <div className="rounded-xl border border-slate-600 bg-slate-900/50 p-6">
        <p className="text-slate-400">Transforming document...</p>
        <div className="mt-3 h-2 w-48 animate-pulse rounded-full bg-slate-700" />
      </div>
    );
  }

  if (!text) return null;

  const handleDownload = async (format: "text" | "pdf" | "mp3") => {
    await onDownload(format);
  };

  return (
    <div className="rounded-xl border border-slate-600 bg-slate-900/50 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Transformed output</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleDownload("text")}
            className="flex items-center gap-1.5 rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-600"
          >
            <FileText className="h-3.5 w-3.5" />
            TXT
          </button>
          <button
            onClick={() => handleDownload("pdf")}
            className="flex items-center gap-1.5 rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-600"
          >
            <FileDown className="h-3.5 w-3.5" />
            PDF
          </button>
          <button
            onClick={() => handleDownload("mp3")}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-cyan-500"
          >
            <Music className="h-3.5 w-3.5" />
            MP3
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto rounded-lg border border-slate-700 bg-slate-950/50 p-4 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}
