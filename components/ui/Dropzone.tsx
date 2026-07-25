"use client";

import { useRef, useState, type DragEvent } from "react";
import { UploadIcon } from "./icons";

interface DropzoneProps {
  accept: string;
  onFileSelected: (file: File) => void;
  label: string;
  hint: string;
  disabled?: boolean;
  busy?: boolean;
  busyLabel?: string;
}

export default function Dropzone({ accept, onFileSelected, label, hint, disabled, busy, busyLabel }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (disabled || busy) return;
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  };

  return (
    <div
      onClick={() => !disabled && !busy && inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled && !busy) setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={disabled || busy ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled && !busy) inputRef.current?.click();
      }}
      className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
        disabled || busy ? "cursor-not-allowed opacity-60" : ""
      } ${dragActive ? "border-jz-yellow-400 bg-jz-yellow-400/5" : "border-jz-border hover:border-jz-white-600"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled || busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
          e.target.value = "";
        }}
      />
      <span className="flex size-10 items-center justify-center rounded-full bg-jz-yellow-400/10 text-jz-yellow-400">
        <UploadIcon className="size-5" />
      </span>
      <p className="text-sm font-medium text-jz-white-100">{busy ? busyLabel : label}</p>
      {!busy && <p className="text-xs text-jz-white-600">{hint}</p>}
    </div>
  );
}
