"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import FormSelect from "@/components/ui/FormSelect";
import Checkbox from "@/components/ui/Checkbox";
import { ApiError } from "@/lib/api/client";
import {
  getLanguages,
  addLanguage,
  updateLanguage,
  deleteLanguage,
  getLanguagesMaster,
  type CandidateLanguageRecord,
  type LanguagePayload,
  type LanguageProficiency,
  type LookupRef,
} from "@/lib/api/candidate";

type FormState = {
  language_id: string;
  proficiency: LanguageProficiency | "";
  can_read: boolean;
  can_write: boolean;
  can_speak: boolean;
};

const emptyForm: FormState = { language_id: "", proficiency: "", can_read: true, can_write: true, can_speak: true };

const formFromRecord = (record: CandidateLanguageRecord): FormState => ({
  language_id: String(record.language_id),
  proficiency: record.proficiency,
  can_read: record.can_read,
  can_write: record.can_write,
  can_speak: record.can_speak,
});

export default function LanguagesSection() {
  const { t } = useTranslation();

  const [records, setRecords] = useState<CandidateLanguageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [languages, setLanguages] = useState<LookupRef[]>([]);

  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      setRecords(await getLanguages());
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
    if (editingId === null || languages.length > 0) return;
    getLanguagesMaster()
      .then(setLanguages)
      .catch(() => setLanguages([]));
  }, [editingId, languages.length]);

  const languageOptions = languages.map((l) => ({ value: String(l.id), label: l.name }));

  const proficiencyOptions = [
    { value: "BEGINNER", label: t("profile.languages.proficiencyOptions.beginner") },
    { value: "INTERMEDIATE", label: t("profile.languages.proficiencyOptions.intermediate") },
    { value: "ADVANCED", label: t("profile.languages.proficiencyOptions.advanced") },
    { value: "FLUENT", label: t("profile.languages.proficiencyOptions.fluent") },
    { value: "NATIVE", label: t("profile.languages.proficiencyOptions.native") },
  ];

  const proficiencyLabel = (value: LanguageProficiency) => proficiencyOptions.find((o) => o.value === value)?.label ?? value;

  const startAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setSaveError("");
    setEditingId("new");
  };

  const startEdit = (record: CandidateLanguageRecord) => {
    setForm(formFromRecord(record));
    setErrors({});
    setSaveError("");
    setEditingId(record.id);
  };

  const cancel = () => setEditingId(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSaveError("");
    setSaving(true);

    const payload: LanguagePayload = {
      language_id: Number(form.language_id),
      proficiency: form.proficiency as LanguageProficiency,
      can_read: form.can_read,
      can_write: form.can_write,
      can_speak: form.can_speak,
    };

    try {
      if (editingId === "new") {
        await addLanguage(payload);
      } else if (editingId !== null) {
        await updateLanguage(editingId, payload);
      }
      await load();
      setEditingId(null);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fieldErrors ?? {});
        setSaveError(err.message);
      } else {
        setSaveError(t("profile.saveError"));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t("profile.common.deleteConfirm"))) return;
    setDeletingId(id);
    try {
      await deleteLanguage(id);
      await load();
    } finally {
      setDeletingId(null);
    }
  };

  const skillsSummary = (record: CandidateLanguageRecord) => {
    const skills = [
      record.can_read && t("profile.languages.canRead"),
      record.can_write && t("profile.languages.canWrite"),
      record.can_speak && t("profile.languages.canSpeak"),
    ].filter(Boolean);
    return skills.join(", ");
  };

  return (
    <section id="languages" className="scroll-mt-24 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-jz-white-50">{t("profile.languages.heading")}</h2>
        {editingId === null && (
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
          {records.length === 0 && editingId !== "new" && (
            <p className="text-sm text-jz-white-400">{t("profile.common.empty")}</p>
          )}

          {records.map((record) =>
            editingId === record.id ? (
              <LanguageForm
                key={record.id}
                form={form}
                setForm={setForm}
                errors={errors}
                saveError={saveError}
                saving={saving}
                languageOptions={languageOptions}
                proficiencyOptions={proficiencyOptions}
                onSubmit={submit}
                onCancel={cancel}
              />
            ) : (
              <div key={record.id} className="flex items-center justify-between gap-3 rounded-xl border border-jz-border p-4">
                <div>
                  <p className="text-sm font-semibold text-jz-white-50">{record.language.name}</p>
                  <p className="mt-1 text-xs text-jz-white-600">
                    {proficiencyLabel(record.proficiency)} · {skillsSummary(record)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={() => startEdit(record)} className="text-sm text-jz-yellow-400 hover:underline">
                    {t("profile.common.edit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(record.id)}
                    disabled={deletingId === record.id}
                    className="text-sm text-jz-red-600 hover:underline disabled:opacity-60"
                  >
                    {deletingId === record.id ? t("profile.common.deleting") : t("profile.common.delete")}
                  </button>
                </div>
              </div>
            )
          )}

          {editingId === "new" && (
            <LanguageForm
              form={form}
              setForm={setForm}
              errors={errors}
              saveError={saveError}
              saving={saving}
              languageOptions={languageOptions}
              proficiencyOptions={proficiencyOptions}
              onSubmit={submit}
              onCancel={cancel}
            />
          )}
        </div>
      )}
    </section>
  );
}

function LanguageForm({
  form,
  setForm,
  errors,
  saveError,
  saving,
  languageOptions,
  proficiencyOptions,
  onSubmit,
  onCancel,
}: {
  form: FormState;
  setForm: (form: FormState) => void;
  errors: Record<string, string>;
  saveError: string;
  saving: boolean;
  languageOptions: { value: string; label: string }[];
  proficiencyOptions: { value: string; label: string }[];
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-jz-yellow-400/30 bg-jz-blue-900/60 p-4">
      {saveError && (
        <div className="mb-4 rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
          {saveError}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormSelect
          label={t("profile.languages.languageLabel")}
          placeholder={t("profile.languages.languagePlaceholder")}
          options={languageOptions}
          value={form.language_id}
          onChange={(e) => setForm({ ...form, language_id: e.target.value })}
          error={errors.language_id}
        />
        <FormSelect
          label={t("profile.languages.proficiencyLabel")}
          placeholder={t("profile.languages.proficiencyPlaceholder")}
          options={proficiencyOptions}
          value={form.proficiency}
          onChange={(e) => setForm({ ...form, proficiency: e.target.value as LanguageProficiency })}
          error={errors.proficiency}
        />
      </div>

      <div className="mt-4 flex items-center gap-5">
        <Checkbox label={t("profile.languages.canRead")} checked={form.can_read} onChange={(e) => setForm({ ...form, can_read: e.target.checked })} />
        <Checkbox label={t("profile.languages.canWrite")} checked={form.can_write} onChange={(e) => setForm({ ...form, can_write: e.target.checked })} />
        <Checkbox label={t("profile.languages.canSpeak")} checked={form.can_speak} onChange={(e) => setForm({ ...form, can_speak: e.target.checked })} />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-gradient-to-b from-[#ffe795] to-jz-yellow-400 px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? t("profile.common.saving") : t("profile.common.save")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 hover:opacity-90 disabled:opacity-60"
        >
          {t("profile.common.cancel")}
        </button>
      </div>
    </form>
  );
}
