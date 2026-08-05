import type { ComponentType } from "react";
import { IdCardIcon, AwardIcon, PaperclipIcon, DocumentIcon } from "@/components/ui/icons";

// document_type.name is free-text set by admins (see prisma/schema
// document_types seed data) — there's no type enum to switch on, so this is
// a best-effort keyword match purely for the icon, not a data claim.
export function getDocumentIcon(documentTypeName: string): ComponentType<{ className?: string }> {
  const name = documentTypeName.toLowerCase();
  if (name.includes("passport") || name.includes("id") || name.includes("visa")) return IdCardIcon;
  if (name.includes("certificate") || name.includes("degree") || name.includes("experience")) return AwardIcon;
  if (name.includes("other")) return PaperclipIcon;
  return DocumentIcon;
}
