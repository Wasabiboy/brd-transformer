"use client";

import type { TransformOption } from "@/lib/transform";

const OPTIONS: { id: TransformOption; label: string; desc: string }[] = [
  {
    id: "tldr",
    label: "TL;DR",
    desc: "Condensed executive summary with core essence and key highlights",
  },
  {
    id: "podcast",
    label: "Podcast / audiobook style",
    desc: "Professional speaker tone, conversational, ideal for audio",
  },
  {
    id: "human-readable",
    label: "Human-readable",
    desc: "Remove AI jargon, plain English, natural phrasing",
  },
  {
    id: "bullets",
    label: "Bullet points",
    desc: "Convert tables to bullets, scannable structure",
  },
  {
    id: "remove-ai",
    label: "Remove AI indicators",
    desc: "Plain text, professional human tone—no AI-style or Markdown",
  },
];

type TransformOptionsProps = {
  selected: TransformOption[];
  onChange: (options: TransformOption[]) => void;
  disabled?: boolean;
};

export function TransformOptions({
  selected,
  onChange,
  disabled,
}: TransformOptionsProps) {
  const toggle = (id: TransformOption) => {
    if (disabled) return;
    if (selected.includes(id)) {
      onChange(selected.filter((o) => o !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-300">
        Transformation options (select any)
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className={`
              flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition
              ${selected.includes(opt.id) ? "border-cyan-500 bg-cyan-500/10" : "border-slate-600 bg-slate-900/50 hover:border-slate-500"}
              ${disabled ? "cursor-not-allowed opacity-50" : ""}
            `}
          >
            <input
              type="checkbox"
              checked={selected.includes(opt.id)}
              onChange={() => toggle(opt.id)}
              disabled={disabled}
              className="mt-0.5 h-4 w-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500"
            />
            <div>
              <span className="text-sm font-medium text-slate-200">
                {opt.label}
              </span>
              <p className="text-xs text-slate-500">{opt.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
