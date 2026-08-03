"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import { FolderIcon, SparkleIcon, CheckIcon, CrossIcon } from "@/components/ui/icons";
import { ApiError } from "@/lib/api/client";
import {
  attachDocumentByKey,
  getDocuments,
  getDocumentTypes,
  type SplitDocument,
  type DocumentTypeOption,
} from "@/lib/api/candidate";

interface DocumentsGalleryProps {
  documents: SplitDocument[];
  // Reported after a successful attach by re-fetching the real total (this
  // component only ever sees the newly-split groups, not the candidate's
  // full document list) — mirrors DocumentsSection.tsx's own onCountChange.
  onDocumentsCountChange?: (count: number) => void;
}

type CardStatus = "pending" | "saving" | "saved" | "rejected" | "error";

const typeLabelKey: Record<SplitDocument["type"], string> = {
  resume: "profile.upload.documents.type.resume",
  certificate: "profile.upload.documents.type.certificate",
  passport: "profile.upload.documents.type.passport",
  education_degree: "profile.upload.documents.type.education_degree",
  id_proof: "profile.upload.documents.type.id_proof",
  other: "profile.upload.documents.type.other",
};

export default function DocumentsGallery({ documents, onDocumentsCountChange }: DocumentsGalleryProps) {
  const { t } = useTranslation();

  const [documentTypes, setDocumentTypes] = useState<DocumentTypeOption[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<Record<number, string>>({});
  const [label, setLabel] = useState<Record<number, string>>({});
  const [status, setStatus] = useState<Record<number, CardStatus>>({});
  const [error, setError] = useState<Record<number, string>>({});

  // Seeds each card's label from the backend's suggestion (populated when no
  // real document type matched — see suggestDocumentType's "Other" fallback)
  // once, the first time that document is seen.
  useEffect(() => {
    setLabel((prev) => {
      const next = { ...prev };
      documents.forEach((doc, index) => {
        if (next[index] === undefined) next[index] = doc.suggestedLabel ?? "";
      });
      return next;
    });
  }, [documents]);

  useEffect(() => {
    getDocumentTypes()
      .then(setDocumentTypes)
      .catch(() => setDocumentTypes([]));
  }, []);

  // Pre-select each group's dropdown to the backend's suggested type, once
  // the master list has loaded — a name match, since suggestedDocumentTypeId
  // comes from a different lookup pass than what's rendered here.
  useEffect(() => {
    if (documentTypes.length === 0) return;
    setSelectedTypeId((prev) => {
      const next = { ...prev };
      documents.forEach((doc, index) => {
        if (next[index] !== undefined) return;
        const bySuggestedId = doc.suggestedDocumentTypeId
          ? documentTypes.find((d) => d.id === doc.suggestedDocumentTypeId)
          : undefined;
        const byName = doc.suggestedDocumentTypeName
          ? documentTypes.find((d) => d.name.toLowerCase() === doc.suggestedDocumentTypeName!.trim().toLowerCase())
          : undefined;
        const match = bySuggestedId ?? byName;
        next[index] = match ? String(match.id) : "";
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentTypes, documents.length]);

  const documentTypeOptions = useMemo(
    () =>
      documentTypes.map((d) => ({
        value: String(d.id),
        label: d.mandatory ? `${d.name} (${t("profile.documents.mandatory")})` : d.name,
      })),
    [documentTypes, t]
  );

  const handleAccept = async (index: number) => {
    const doc = documents[index];
    const typeId = Number(selectedTypeId[index]);
    if (!typeId) return;

    setStatus((prev) => ({ ...prev, [index]: "saving" }));
    setError((prev) => ({ ...prev, [index]: "" }));

    try {
      // One page = one candidate_documents row server-side; a multi-page
      // group just means several calls sharing the same chosen type.
      for (const key of doc.s3Keys) {
        // eslint-disable-next-line no-await-in-loop
        await attachDocumentByKey(key, typeId, label[index]?.trim());
      }
      setStatus((prev) => ({ ...prev, [index]: "saved" }));
      const total = await getDocuments();
      onDocumentsCountChange?.(total.length);
    } catch (err) {
      setStatus((prev) => ({ ...prev, [index]: "error" }));
      setError((prev) => ({ ...prev, [index]: err instanceof ApiError ? err.message : t("profile.saveError") }));
    }
  };

  const handleReject = (index: number) => {
    setStatus((prev) => ({ ...prev, [index]: "rejected" }));
  };

  if (documents.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#4ADE80]/15 text-[#8FD13F]">
          <FolderIcon className="size-4" />
        </span>
        <div>
          <h3 className="font-serif text-base font-semibold text-jz-white-50">{t("profile.upload.documents.heading")}</h3>
          <p className="text-xs text-jz-white-600">{t("profile.upload.documents.subtitle", { count: documents.length })}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {documents.map((doc, index) => {
          const cardStatus = status[index] ?? "pending";
          if (cardStatus === "rejected") return null;

          return (
            <div
              key={`${doc.type}-${doc.pageNumbers.join("-")}`}
              className={`rounded-xl border p-4 ${
                doc.lowConfidence ? "border-jz-yellow-400/40 bg-jz-yellow-400/5" : "border-jz-border bg-jz-blue-900/60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-jz-white-50">{t(typeLabelKey[doc.type])}</p>
                  <p className="mt-0.5 text-xs text-jz-white-600">
                    {doc.pageNumbers.length > 1
                      ? t("profile.upload.documents.pagesCount", { count: doc.pageNumbers.length })
                      : t("profile.upload.documents.pageOne")}
                  </p>
                </div>
                {doc.lowConfidence && (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-jz-yellow-400/15 px-2 py-1 text-[11px] font-medium text-jz-yellow-400">
                    <SparkleIcon className="size-3" />
                    {t("profile.upload.lowConfidenceBadge")}
                  </span>
                )}
              </div>

              {cardStatus === "saved" ? (
                <p className="mt-3 flex items-center gap-1.5 text-sm text-[#8FD13F]">
                  <CheckIcon className="size-3.5" />
                  {t("profile.upload.documents.saved")}
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  <FormSelect
                    label={t("profile.documents.documentTypeLabel")}
                    placeholder={t("profile.documents.documentTypePlaceholder")}
                    options={documentTypeOptions}
                    value={selectedTypeId[index] ?? ""}
                    onChange={(e) => setSelectedTypeId((prev) => ({ ...prev, [index]: e.target.value }))}
                  />
                  <FormInput
                    label={t("profile.upload.documents.labelField")}
                    placeholder={t("profile.upload.documents.labelPlaceholder")}
                    value={label[index] ?? ""}
                    onChange={(e) => setLabel((prev) => ({ ...prev, [index]: e.target.value }))}
                  />
                  {error[index] && <p className="text-xs text-jz-red-600">{error[index]}</p>}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleAccept(index)}
                      disabled={!selectedTypeId[index] || cardStatus === "saving"}
                      className="rounded-lg bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-3.5 py-1.5 text-xs font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
                    >
                      {cardStatus === "saving" ? t("profile.saving") : t("profile.upload.documents.accept")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(index)}
                      disabled={cardStatus === "saving"}
                      className="flex items-center gap-1 text-xs text-jz-white-400 hover:text-jz-white-100 disabled:opacity-60"
                    >
                      <CrossIcon className="size-3.5" />
                      {t("profile.upload.documents.reject")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
