"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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

export default function DocumentsSection() {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [records, setRecords] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeOption[]>([]);

  const [adding, setAdding] = useState(false);
  const [documentTypeId, setDocumentTypeId] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      setRecords(await getDocuments());
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  useEffect(() => {
    if (!adding || documentTypes.length > 0) return;
    getDocumentTypes()
      .then(setDocumentTypes)
      .catch(() => setDocumentTypes([]));
  }, [adding, documentTypes.length]);

  const documentTypeOptions = documentTypes.map((d) => ({
    value: String(d.id),
    label: d.mandatory ? `${d.name} (${t("profile.documents.mandatory")})` : d.name,
  }));

  const startAdd = () => {
    setDocumentTypeId("");
    setUploadError("");
    setAdding(true);
  };

  const handleFileChange = async (file: File | undefined) => {
    if (!file || !documentTypeId) return;
    setUploadError("");
    setUploading(true);
    try {
      await addDocument(Number(documentTypeId), file);
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
    <section id="documents" className="scroll-mt-24 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-jz-white-50">{t("profile.documents.heading")}</h2>
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

      {loading ? null : loadError ? (
        <p className="mt-5 text-sm text-jz-white-400">{t("profile.common.loadError")}</p>
      ) : (
        <div className="mt-5 space-y-3">
          {records.length === 0 && !adding && <p className="text-sm text-jz-white-400">{t("profile.common.empty")}</p>}

          {records.map((record) => (
            <div key={record.id} className="flex items-center justify-between gap-3 rounded-xl border border-jz-border p-4">
              <div>
                <p className="text-sm font-semibold text-jz-white-50">{record.document_type.name}</p>
                <a href={record.file_url} target="_blank" rel="noreferrer" className="text-xs text-jz-yellow-400 hover:underline">
                  {t("profile.documents.view")}
                </a>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(record.id)}
                disabled={deletingId === record.id}
                className="shrink-0 text-sm text-jz-red-600 hover:underline disabled:opacity-60"
              >
                {deletingId === record.id ? t("profile.common.deleting") : t("profile.common.delete")}
              </button>
            </div>
          ))}

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
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
              />
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  disabled={!documentTypeId || uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
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
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
