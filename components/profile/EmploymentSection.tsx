"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import Checkbox from "@/components/ui/Checkbox";
import { ApiError } from "@/lib/api/client";
import {
  getEmploymentHistory,
  addEmployment,
  updateEmployment,
  deleteEmployment,
  type EmploymentRecord,
  type EmploymentPayload,
  type EmploymentType,
} from "@/lib/api/candidate";

type FormState = {
  company_name: string;
  designation: string;
  employment_type: EmploymentType | "";
  start_date: string;
  end_date: string;
  is_current: boolean;
  location: string;
  description: string;
};

const emptyForm: FormState = {
  company_name: "",
  designation: "",
  employment_type: "",
  start_date: "",
  end_date: "",
  is_current: false,
  location: "",
  description: "",
};

const toDateInputValue = (value: string | null): string => (value ? value.slice(0, 10) : "");

const formFromRecord = (record: EmploymentRecord): FormState => ({
  company_name: record.company_name,
  designation: record.designation,
  employment_type: record.employment_type ?? "",
  start_date: toDateInputValue(record.start_date),
  end_date: toDateInputValue(record.end_date),
  is_current: record.is_current,
  location: record.location ?? "",
  description: record.description ?? "",
});

export default function EmploymentSection() {
  const { t } = useTranslation();

  const [records, setRecords] = useState<EmploymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

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
      setRecords(await getEmploymentHistory());
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch-on-mount — load's setState calls happen inside its own async
    // continuation, not synchronously in this effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const startAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setSaveError("");
    setEditingId("new");
  };

  const startEdit = (record: EmploymentRecord) => {
    setForm(formFromRecord(record));
    setErrors({});
    setSaveError("");
    setEditingId(record.id);
  };

  const cancel = () => setEditingId(null);

  const employmentTypeOptions = [
    { value: "FULL_TIME", label: t("profile.employment.employmentTypeOptions.fullTime") },
    { value: "PART_TIME", label: t("profile.employment.employmentTypeOptions.partTime") },
    { value: "CONTRACT", label: t("profile.employment.employmentTypeOptions.contract") },
    { value: "TEMPORARY", label: t("profile.employment.employmentTypeOptions.temporary") },
    { value: "INTERN", label: t("profile.employment.employmentTypeOptions.intern") },
    { value: "FREELANCE", label: t("profile.employment.employmentTypeOptions.freelance") },
    { value: "SELF_EMPLOYED", label: t("profile.employment.employmentTypeOptions.selfEmployed") },
  ];

  const employmentTypeLabel = (value: EmploymentType | null) =>
    employmentTypeOptions.find((o) => o.value === value)?.label ?? null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSaveError("");
    setSaving(true);

    const payload: EmploymentPayload = {
      company_name: form.company_name,
      designation: form.designation,
      employment_type: form.employment_type as EmploymentType,
      start_date: form.start_date,
      end_date: form.is_current ? null : form.end_date || null,
      is_current: form.is_current,
      location: form.location || null,
      description: form.description || null,
    };

    try {
      if (editingId === "new") {
        await addEmployment(payload);
      } else if (editingId !== null) {
        await updateEmployment(editingId, payload);
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
      await deleteEmployment(id);
      await load();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section id="employment" className="scroll-mt-24 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-jz-white-50">{t("profile.employment.heading")}</h2>
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
              <EmploymentForm
                key={record.id}
                form={form}
                setForm={setForm}
                errors={errors}
                saveError={saveError}
                saving={saving}
                employmentTypeOptions={employmentTypeOptions}
                onSubmit={submit}
                onCancel={cancel}
              />
            ) : (
              <div key={record.id} className="rounded-xl border border-jz-border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-jz-white-50">{record.designation}</p>
                    <p className="text-sm text-jz-white-200">{record.company_name}</p>
                    <p className="mt-1 text-xs text-jz-white-600">
                      {employmentTypeLabel(record.employment_type)} · {toDateInputValue(record.start_date)} –{" "}
                      {record.is_current ? t("profile.employment.current") : toDateInputValue(record.end_date)}
                      {record.location ? ` · ${record.location}` : ""}
                    </p>
                    {record.description && <p className="mt-2 text-sm text-jz-white-200">{record.description}</p>}
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
            <EmploymentForm
              form={form}
              setForm={setForm}
              errors={errors}
              saveError={saveError}
              saving={saving}
              employmentTypeOptions={employmentTypeOptions}
              onSubmit={submit}
              onCancel={cancel}
            />
          )}
        </div>
      )}
    </section>
  );
}

function EmploymentForm({
  form,
  setForm,
  errors,
  saveError,
  saving,
  employmentTypeOptions,
  onSubmit,
  onCancel,
}: {
  form: FormState;
  setForm: (form: FormState) => void;
  errors: Record<string, string>;
  saveError: string;
  saving: boolean;
  employmentTypeOptions: { value: string; label: string }[];
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
        <FormInput
          label={t("profile.employment.companyNameLabel")}
          value={form.company_name}
          onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          error={errors.company_name}
        />
        <FormInput
          label={t("profile.employment.designationLabel")}
          value={form.designation}
          onChange={(e) => setForm({ ...form, designation: e.target.value })}
          error={errors.designation}
        />
        <FormSelect
          label={t("profile.employment.employmentTypeLabel")}
          placeholder={t("profile.employment.employmentTypePlaceholder")}
          options={employmentTypeOptions}
          value={form.employment_type}
          onChange={(e) => setForm({ ...form, employment_type: e.target.value as EmploymentType })}
          error={errors.employment_type}
        />
        <FormInput
          label={t("profile.employment.locationLabel")}
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          error={errors.location}
        />
        <FormInput
          label={t("profile.employment.startDateLabel")}
          type="date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          error={errors.start_date}
        />
        {!form.is_current && (
          <FormInput
            label={t("profile.employment.endDateLabel")}
            type="date"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            error={errors.end_date}
          />
        )}
      </div>

      <Checkbox
        label={t("profile.employment.isCurrentLabel")}
        checked={form.is_current}
        onChange={(e) => setForm({ ...form, is_current: e.target.checked })}
        className="mt-4"
      />

      <div className="mt-4">
        <label className="mb-1.5 block text-sm text-jz-white-200">{t("profile.employment.descriptionLabel")}</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full rounded-xl border border-jz-border bg-jz-blue-900 px-3.5 py-2.5 text-sm text-jz-white-100 outline-none placeholder:text-jz-white-600 focus:border-jz-yellow-400 focus:ring-2 focus:ring-jz-yellow-400/20"
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
