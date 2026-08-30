"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { AwardIcon } from "@/components/ui/icons";
import FormSelect from "@/components/ui/FormSelect";
import { ApiError } from "@/lib/api/client";
import {
  getSkills,
  addSkill,
  deleteSkill,
  getSkillsMaster,
  findOrCreateSkill,
  type CandidateSkillRecord,
  type LookupRef,
} from "@/lib/api/candidate";

interface SkillsSectionProps {
  onCountChange?: (count: number) => void;
}

export default function SkillsSection({ onCountChange }: SkillsSectionProps = {}) {
  const { t } = useTranslation();

  const [records, setRecords] = useState<CandidateSkillRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [skillsMaster, setSkillsMaster] = useState<LookupRef[]>([]);

  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [otherName, setOtherName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await getSkills();
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
    getSkillsMaster()
      .then(setSkillsMaster)
      .catch(() => setSkillsMaster([]));
  }, []);

  const addedSkillIds = new Set(records.map((r) => r.skill_id));
  const skillOptions = skillsMaster
    .filter((s) => !addedSkillIds.has(s.id))
    .map((s) => ({ value: String(s.id), label: s.name }));

  const persistSkill = async (skill: LookupRef) => {
    setError("");
    setSaving(true);
    try {
      await addSkill(skill.id);
      setSkillsMaster((prev) => (prev.some((s) => s.id === skill.id) ? prev : [...prev, skill]));
      setSelectedSkillId("");
      setOtherName("");
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("profile.saveError"));
    } finally {
      setSaving(false);
    }
  };

  const submitSelected = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSkillId) return;
    const skill = skillsMaster.find((s) => String(s.id) === selectedSkillId);
    if (skill) await persistSkill(skill);
  };

  const submitOther = async (e: FormEvent) => {
    e.preventDefault();
    const name = otherName.trim();
    if (!name) return;
    setError("");
    setSaving(true);
    try {
      const skill = await findOrCreateSkill(name);
      await persistSkill(skill);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("profile.saveError"));
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteSkill(id);
      await load();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section
      id="skills"
      className="scroll-mt-24 rounded-2xl border border-jz-border bg-jz-blue-900/40 p-6 backdrop-blur-xl shadow-[0_1px_0_rgba(74,222,128,0.12),0_14px_30px_-22px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#4ADE80]/15 text-[#8FD13F]">
          <AwardIcon className="size-4" />
        </span>
        <h2 className="font-serif text-lg font-semibold text-jz-white-50">{t("profile.skills.heading")}</h2>
      </div>

      {loading ? null : loadError ? (
        <p className="mt-5 text-sm text-jz-white-400">{t("profile.common.loadError")}</p>
      ) : (
        <div className="mt-5 space-y-5">
          {records.length === 0 ? (
            <p className="text-sm text-jz-white-400">{t("profile.common.empty")}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {records.map((record) => (
                <span
                  key={record.id}
                  className="inline-flex items-center gap-2 rounded-full border border-jz-border bg-jz-blue-900/60 px-3.5 py-1.5 text-sm text-jz-white-100"
                >
                  {record.skill.name}
                  <button
                    type="button"
                    onClick={() => handleDelete(record.id)}
                    disabled={deletingId === record.id}
                    aria-label={t("profile.common.delete")}
                    className="text-jz-white-600 hover:text-jz-red-600 disabled:opacity-60"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-jz-red-600/40 bg-jz-red-600/10 px-3.5 py-2.5 text-sm text-jz-white-100">
              {error}
            </div>
          )}

          <form onSubmit={submitSelected} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <FormSelect
                label={t("profile.skills.skillLabel")}
                placeholder={t("profile.skills.skillPlaceholder")}
                options={skillOptions}
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={saving || !selectedSkillId}
              className="rounded-xl bg-[var(--green-600)] px-4 py-2.5 text-sm font-semibold text-jz-ink-on-accent transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {saving ? t("profile.common.saving") : t("profile.skills.add")}
            </button>
          </form>

          <form onSubmit={submitOther} className="flex flex-col gap-2">
            <p className="text-xs text-jz-white-600">{t("profile.skills.notFound")}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={otherName}
                onChange={(e) => setOtherName(e.target.value)}
                placeholder={t("profile.skills.addOtherPlaceholder")}
                className="h-11 w-full flex-1 rounded-xl border border-jz-border bg-jz-blue-900 px-3.5 text-sm text-jz-white-100 outline-none focus:border-jz-yellow-400 focus:ring-2 focus:ring-jz-yellow-400/20"
              />
              <button
                type="submit"
                disabled={saving || !otherName.trim()}
                className="rounded-xl border border-jz-white-600 px-4 py-2.5 text-sm text-jz-white-100 hover:opacity-90 disabled:opacity-60"
              >
                {t("profile.skills.addOther")}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
