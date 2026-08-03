"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getMatches } from "@/lib/api/matches";

// Live match count for the reward panel/toast — never fabricated. Silently
// shows nothing if the call fails or the candidate isn't verified yet
// (PROFILE_NOT_VERIFIED paywall reason returns access with 0 matches) rather
// than displaying a wrong or placeholder number.
function useMatchCount(): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMatches({ page: 1, limit: 1 })
      .then((page) => {
        if (!cancelled) setCount(page.pagination.total);
      })
      .catch(() => {
        if (!cancelled) setCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return count;
}

// Persistent side panel for the tablet/desktop tabs shell — mirrors the
// mockup's "40+ jobs match so far" rail next to the active tab's form.
export function RewardSidePanel({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  const count = useMatchCount();

  if (count === null) return null;

  return (
    <div className={`shrink-0 text-center sm:text-left ${className}`}>
      <p className="font-serif text-3xl font-semibold text-jz-yellow-400">{t("profile.tabs.rewardCount", { count })}</p>
      <p className="mt-1 text-sm text-jz-white-400">{t("profile.tabs.rewardSubtitle")}</p>
    </div>
  );
}

// Inline banner for the mobile wizard — shown under a step's fields, same
// spot the mockup's "Ye 3 daalte hi 40+ Electrician jobs UAE mein turant
// dikhengi" reward box occupies. Falls back to a generic encouragement line
// when no live count is available yet (new candidate, nothing indexed).
export function RewardBanner({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  const count = useMatchCount();

  return (
    <div className={`rounded-xl border border-jz-yellow-400/30 bg-jz-yellow-400/10 px-4 py-3 text-sm text-jz-white-100 ${className}`}>
      {count !== null && count > 0 ? t("profile.wizard.rewardWithCount", { count }) : t("profile.wizard.rewardGeneric")}
    </div>
  );
}
