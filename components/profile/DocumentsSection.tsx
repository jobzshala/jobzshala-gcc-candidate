"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertIcon, DocumentIcon, FolderIcon, SpinnerIcon, TrashIcon } from "@/components/ui/icons";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import { ApiError } from "@/lib/api/client";
import {
  getDocuments,
  addDocument,
  deleteDocument,
  getDocumentTypes,
  type DocumentRecord,
  type DocumentTypeOption,
} from "@/lib/api/candidate";

interface DocumentsSectionProps {
  onCountChange?: (count: number) => void;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function isOtherType(name: string | undefined): boolean {
  return name?.trim().toLowerCase() === "other";
}

export default function DocumentsSection({ onCountChange }: DocumentsSectionProps = {}) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [records, setRecords] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeOption[]>([]);

  const [adding, setAdding] = useState(false);
  const [documentTypeId, setDocumentTypeId] = useState("");
  const [label, setLabel] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await getDocuments();
      setRecords(data);
      onCountChange?.(data.length);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    getDocumentTypes()
      .then(setDocumentTypes)
      .catch(() => setDocumentTypes([]));
  }, []);

  const documentTypeOptions = documentTypes.map((d) => ({
    value: String(d.id),
    label: d.mandatory ? `${d.name} (${t("profile.documents.mandatory")})` : d.name,
  }));

  const selectedType = documentTypes.find((d) => String(d.id) === documentTypeId);
  const showLabelField = isOtherType(selectedType?.name);

  const missingMandatory = useMemo(
    () =>
      documentTypes.filter(
        (d) => d.mandatory && !records.some((r) => r.document_type_id === d.id)
      ),
    [documentTypes, records]
  );

  const startAdd = () => {
    setDocumentTypeId("");
    setLabel("");
    setUploadError("");
    setAdding(true);
  };

  const handleFileChange = async (file: File | undefined) => {
    if (!file || !documentTypeId || (showLabelField && !label.trim())) return;
    setUploadError("");
    setUploading(true);
    try {
      await addDocument(Number(documentTypeId), file, showLabelField ? label.trim() : undefined);
      await load();
      setAdding(false);
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : t("profile.saveError"));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t("profile.common.deleteConfirm"))) return;
    setDeletingId(id);
    try {
      await deleteDocument(id);
      await load();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section id="documents" className="scroll-mt-24 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6 backdrop-blur-xl shadow-[0_1px_0_rgba(74,222,128,0.12),0_14px_30px_-22px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#4ADE80]/15 text-[#8FD13F]">
            <FolderIcon className="size-4" />
          </span>
          <h2 className="font-serif text-lg font-semibold text-jz-white-50">{t("profile.documents.heading")}</h2>
        </div>
        {!adding && (
          <button
            type="button"
            onClick={startAdd}
            className="rounded-xl border border-jz-white-600 px-3.5 py-1.5 text-sm text-jz-white-100 hover:opacity-90"
          >
            {t("profile.common.addNew")}
          </button>
        )}
      </div>

      {!loading && !loadError && missingMandatory.length > 0 && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-jz-yellow-400/30 bg-jz-yellow-400/10 px-3.5 py-2.5 text-sm text-jz-white-100">
          <AlertIcon className="mt-0.5 size-4 shrink-0 text-jz-yellow-400" />
          <span>{t("profile.documents.missingMandatory", { names: missingMandatory.map((d) => d.name).join(", ") })}</span>
        </div>
      )}

      {loading ? (
        <div className="mt-5 space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-[62px] animate-pulse rounded-xl border border-jz-border bg-jz-white-600/5" />
          ))}
        </div>
      ) : loadError ? (
        <p className="mt-5 text-sm text-jz-white-400">{t("profile.common.loadError")}</p>
      ) : (
        <div className="mt-5 space-y-3">
          {records.length === 0 && !adding && <p className="text-sm text-jz-white-400">{t("profile.common.empty")}</p>}

          {records.map((record) => {
            const other = isOtherType(record.document_type.name);
            const title = other && record.label ? record.label : record.document_type.name;

            return (
              <div key={record.id} className="flex items-center justify-between gap-3 rounded-xl border border-jz-border p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-jz-white-600/10 text-jz-white-200">
                    <DocumentIcon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="truncate text-sm font-semibold text-jz-white-50">{title}</p>
                      {other && (
                        <span className="shrink-0 rounded-full bg-jz-white-600/15 px-2 py-0.5 text-[11px] text-jz-white-400">
                          {record.document_type.name}
                        </span>
                      )}
                      {record.document_type.mandatory && (
                        <span className="shrink-0 rounded-full bg-jz-yellow-400/15 px-2 py-0.5 text-[11px] text-jz-yellow-400">
                          {t("profile.documents.mandatory")}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-jz-white-600">
                      <span>{t("profile.documents.uploadedOn", { date: formatDate(record.created_at) })}</span>
                      <span aria-hidden="true">·</span>
                      <a href={record.file_url} target="_blank" rel="noreferrer" className="text-jz-yellow-400 hover:underline">
                        {t("profile.documents.view")}
                      </a>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(record.id)}
                  disabled={deletingId === record.id}
                  aria-label={t("profile.common.delete")}
                  title={t("profile.common.delete")}
                  className="flex shrink-0 items-center justify-center rounded-lg p-2 text-jz-white-600 hover:bg-jz-red-600/10 hover:text-jz-red-600 disabled:opacity-60"
                >
                  {deletingId === record.id ? <SpinnerIcon className="size-4" /> : <TrashIcon className="size-4" />}
                </button>
              </div>
            );
          })}

          {adding && (
            <div className="rounded-xl border border-jz-yellow-400/30 bg-jz-blue-900/60 p-4">
              {uploadError && (
                <div className="mb-4 rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
                  {uploadError}
                </div>
              )}
              <FormSelect
                label={t("profile.documents.documentTypeLabel")}
                placeholder={t("profile.documents.documentTypePlaceholder")}
                options={documentTypeOptions}
                value={documentTypeId}
                onChange={(e) => setDocumentTypeId(e.target.value)}
              />
              {showLabelField && (
                <div className="mt-4">
                  <FormInput
                    label={t("profile.documents.labelField")}
                    placeholder={t("profile.documents.labelPlaceholder")}
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  disabled={!documentTypeId || (showLabelField && !label.trim()) || uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl bg-[var(--green-600)] px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {uploading ? t("profile.common.saving") : t("profile.common.save")}
                </button>
                <button
                  type="button"
                  onClick={() => setAdding(false)}
                  disabled={uploading}
                  className="rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 hover:opacity-90 disabled:opacity-60"
                >
                  {t("profile.common.cancel")}
                </button>
                <span className="text-xs text-jz-white-600">{t("profile.documents.fileHint")}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
