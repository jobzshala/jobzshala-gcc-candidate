"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import { ApiError } from "@/lib/api/client";
import {
  getEducationHistory,
  addEducation,
  updateEducation,
  deleteEducation,
  getEducationQualifications,
  type EducationRecord,
  type EducationPayload,
  type EducationQualificationOption,
} from "@/lib/api/candidate";

type FormState = {
  education_qualification_id: string;
  institution_name: string;
  specialization: string;
  start_date: string;
  end_date: string;
  score: string;
};

const emptyForm: FormState = {
  education_qualification_id: "",
  institution_name: "",
  specialization: "",
  start_date: "",
  end_date: "",
  score: "",
};

const toDateInputValue = (value: string | null): string => (value ? value.slice(0, 10) : "");
const toDisplayValue = (value: number | string | null): string => (value === null || value === undefined ? "" : String(value));

const formFromRecord = (record: EducationRecord): FormState => ({
  education_qualification_id: String(record.education_qualification_id),
  institution_name: record.institution_name,
  specialization: record.specialization ?? "",
  start_date: toDateInputValue(record.start_date),
  end_date: toDateInputValue(record.end_date),
  score: toDisplayValue(record.score),
});

export default function EducationSection() {
  const { t } = useTranslation();

  const [records, setRecords] = useState<EducationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [qualifications, setQualifications] = useState<EducationQualificationOption[]>([]);

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
      setRecords(await getEducationHistory());
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
    if (editingId === null || qualifications.length > 0) return;
    getEducationQualifications()
      .then(setQualifications)
      .catch(() => setQualifications([]));
  }, [editingId, qualifications.length]);

  const qualificationOptions = qualifications.map((q) => ({ value: String(q.id), label: q.name }));

  const startAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setSaveError("");
    setEditingId("new");
  };

  const startEdit = (record: EducationRecord) => {
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

    const payload: EducationPayload = {
      education_qualification_id: Number(form.education_qualification_id),
      institution_name: form.institution_name,
      specialization: form.specialization || null,
      start_date: form.start_date,
      end_date: form.end_date || null,
      score: form.score ? Number(form.score) : null,
    };

    try {
      if (editingId === "new") {
        await addEducation(payload);
      } else if (editingId !== null) {
        await updateEducation(editingId, payload);
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
      await deleteEducation(id);
      await load();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section id="education" className="scroll-mt-24 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-jz-white-50">{t("profile.education.heading")}</h2>
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
              <EducationForm
                key={record.id}
                form={form}
                setForm={setForm}
                errors={errors}
                saveError={saveError}
                saving={saving}
                qualificationOptions={qualificationOptions}
                onSubmit={submit}
                onCancel={cancel}
              />
            ) : (
              <div key={record.id} className="rounded-xl border border-jz-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-jz-white-50">{record.education_qualification.name}</p>
                    <p className="text-sm text-jz-white-200">
                      {record.institution_name}
                      {record.specialization ? ` · ${record.specialization}` : ""}
                    </p>
                    <p className="mt-1 text-xs text-jz-white-600">
                      {toDateInputValue(record.start_date)} – {toDateInputValue(record.end_date) || "—"}
                      {record.score !== null ? ` · ${toDisplayValue(record.score)}%` : ""}
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
              </div>
            )
          )}

          {editingId === "new" && (
            <EducationForm
              form={form}
              setForm={setForm}
              errors={errors}
              saveError={saveError}
              saving={saving}
              qualificationOptions={qualificationOptions}
              onSubmit={submit}
              onCancel={cancel}
            />
          )}
        </div>
      )}
    </section>
  );
}

function EducationForm({
  form,
  setForm,
  errors,
  saveError,
  saving,
  qualificationOptions,
  onSubmit,
  onCancel,
}: {
  form: FormState;
  setForm: (form: FormState) => void;
  errors: Record<string, string>;
  saveError: string;
  saving: boolean;
  qualificationOptions: { value: string; label: string }[];
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
          label={t("profile.education.qualificationLabel")}
          placeholder={t("profile.education.qualificationPlaceholder")}
          options={qualificationOptions}
          value={form.education_qualification_id}
          onChange={(e) => setForm({ ...form, education_qualification_id: e.target.value })}
          error={errors.education_qualification_id}
        />
        <FormInput
          label={t("profile.education.institutionLabel")}
          value={form.institution_name}
          onChange={(e) => setForm({ ...form, institution_name: e.target.value })}
          error={errors.institution_name}
        />
        <FormInput
          label={t("profile.education.specializationLabel")}
          value={form.specialization}
          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
          error={errors.specialization}
        />
        <FormInput
          label={t("profile.education.scoreLabel")}
          type="number"
          min={0}
          max={100}
          value={form.score}
          onChange={(e) => setForm({ ...form, score: e.target.value })}
          error={errors.score}
        />
        <FormInput
          label={t("profile.education.startDateLabel")}
          type="date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          error={errors.start_date}
        />
        <FormInput
          label={t("profile.education.endDateLabel")}
          type="date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          error={errors.end_date}
        />
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
