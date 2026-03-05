"use client";

import type { TransformOption } from "@/lib/transform";

const MAIN_OPTIONS: { id: TransformOption; label: string; desc: string }[] = [
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
    desc: "Plain text, professional human tone—no AI-style writing",
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
  const mainSelected = selected.find((o) => o !== "markdown");
  const markdownSelected = selected.includes("markdown");

  const selectMain = (id: TransformOption) => {
    if (disabled) return;
    const newOptions: TransformOption[] = markdownSelected ? ([id, "markdown"] as TransformOption[]) : [id];
    onChange(newOptions);
  };

  const toggleMarkdown = () => {
    if (disabled) return;
    if (markdownSelected) {
      onChange(mainSelected ? [mainSelected] : []);
    } else {
      onChange(mainSelected ? [mainSelected, "markdown"] : (["markdown"] as TransformOption[]));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-medium text-stone-300">
          Transformation (select one)
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {MAIN_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={`
                flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition
                ${mainSelected === opt.id ? "border-rilo-accent bg-rilo-accent/10" : "border-rilo-border bg-rilo-card/80 hover:border-rilo-muted"}
                ${disabled ? "cursor-not-allowed opacity-50" : ""}
              `}
            >
              <input
                type="radio"
                name="transform-main"
                checked={mainSelected === opt.id}
                onChange={() => selectMain(opt.id)}
                disabled={disabled}
                className="mt-0.5 h-4 w-4 border-rilo-border text-rilo-accent focus:ring-rilo-accent"
              />
              <div>
                <span className="text-sm font-medium text-stone-200">
                  {opt.label}
                </span>
                <p className="text-xs text-rilo-muted">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label
          className={`
            flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition
            ${markdownSelected ? "border-rilo-accent bg-rilo-accent/10" : "border-rilo-border bg-rilo-card/80 hover:border-rilo-muted"}
            ${disabled ? "cursor-not-allowed opacity-50" : ""}
          `}
        >
          <input
            type="checkbox"
            checked={markdownSelected}
            onChange={toggleMarkdown}
            disabled={disabled}
            className="mt-0.5 h-4 w-4 rounded border-rilo-border text-rilo-accent focus:ring-rilo-accent"
          />
          <div>
            <span className="text-sm font-medium text-stone-200">
              + Markdown format
            </span>
            <p className="text-xs text-rilo-muted">
              Optional. Use Markdown (headers, bold, lists) in output.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
