"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, CheckCircle2 } from "lucide-react";

type DocumentDropzoneProps = {
  onFile: (file: File | null) => void;
  onPaste?: (text: string) => void;
  acceptPaste?: boolean;
  disabled?: boolean;
  file?: File | null;
  pastedText?: string;
};

export function DocumentDropzone({
  onFile,
  onPaste,
  acceptPaste = true,
  disabled,
  file,
  pastedText = "",
}: DocumentDropzoneProps) {
  const hasFile = file && file.size > 0;
  const hasPasted = pastedText.trim().length > 0;
  const documentLoaded = hasFile || hasPasted;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const f = acceptedFiles[0];
      onFile(f || null);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/msword": [".doc"],
    },
    maxFiles: 1,
    disabled,
  });

  return (
    <div className="space-y-3">
      {documentLoaded && (
        <div className="flex items-center gap-2 rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-4 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-500" />
          <span className="text-sm font-medium text-cyan-200">
            {hasFile ? (
              <>
                Document loaded: <span className="text-white">{file!.name}</span>
                {" "}({(file!.size / 1024).toFixed(1)} KB)
              </>
            ) : (
              <>
                Text loaded: <span className="text-white">{pastedText.trim().length}</span> characters
              </>
            )}
          </span>
        </div>
      )}
      <div
        {...getRootProps()}
        className={`
          relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed
          px-6 py-10 transition-all
          ${isDragActive ? "border-cyan-500 bg-cyan-500/10" : "border-slate-600 bg-slate-900/50 hover:border-slate-500"}
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mb-3 h-10 w-10 text-slate-400" />
        <p className="mb-1 text-center text-sm font-medium text-slate-300">
          {isDragActive
            ? "Drop your document here"
            : "Drag & drop PDF or Word document"}
        </p>
        <p className="text-center text-xs text-slate-500">
          or click to browse — .pdf, .docx, .doc
        </p>
      </div>

      {acceptPaste && (
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <FileText className="h-4 w-4 text-slate-500" />
          </div>
          <textarea
            placeholder="Or paste your text here..."
            className="w-full rounded-lg border border-slate-600 bg-slate-900/50 px-10 py-3 text-sm text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
            rows={4}
            onChange={(e) => onPaste?.(e.target.value)}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
