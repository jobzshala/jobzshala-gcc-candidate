"use client";

import { useState } from "react";
import { FolderIcon } from "@/components/ui/icons";
import DocumentsSection from "@/components/profile/DocumentsSection";

export default function DocumentsPage() {
  // Just for the header count — DocumentsSection tracks its own list/loading
  // state internally and reports back through this callback.
  const [count, setCount] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10 space-y-6">
      <header>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-jz-white-100">
          <FolderIcon className="size-5 text-jz-yellow-400" />
          Documents
        </h1>
        <p className="mt-1 text-sm text-jz-white-400">
          {count === null
            ? "Upload your passport, certificates and other KYC documents."
            : `${count} document${count === 1 ? "" : "s"} on file.`}
        </p>
      </header>

      <DocumentsSection onCountChange={setCount} />
    </div>
  );
}
