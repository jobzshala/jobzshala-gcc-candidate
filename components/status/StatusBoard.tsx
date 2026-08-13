"use client";

import { useState } from "react";
import { getSystemStatus, type DayStatus, type SystemStatus } from "@/lib/api/system-status";

const RANGES = [30, 90] as const;

const DOT_CLASS: Record<DayStatus, string> = {
  operational: "bg-jz-green-500",
  degraded: "bg-jz-yellow-400",
  outage: "bg-jz-red-600",
  unknown: "bg-jz-grey-400",
};

const BADGE_CLASS: Record<DayStatus, string> = {
  operational: "bg-jz-green-500/10 text-jz-green-500",
  degraded: "bg-jz-yellow-400/10 text-jz-yellow-400",
  outage: "bg-jz-red-600/10 text-jz-red-600",
  unknown: "bg-jz-grey-400/10 text-jz-white-600",
};

const BADGE_LABEL: Record<DayStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  outage: "Outage",
  unknown: "Not yet monitored",
};

const OVERALL_LABEL: Record<DayStatus, string> = {
  operational: "All Systems Operational",
  degraded: "Degraded Performance",
  outage: "Active Outage",
  unknown: "Monitoring Not Yet Active",
};

export default function StatusBoard({ initialData }: { initialData: SystemStatus }) {
  const [range, setRange] = useState<(typeof RANGES)[number]>(90);
  const [data, setData] = useState<SystemStatus>(initialData);
  const [loading, setLoading] = useState(false);

  const handleRangeChange = async (next: (typeof RANGES)[number]) => {
    setRange(next);
    setLoading(true);
    try {
      const fresh = await getSystemStatus(next);
      setData(fresh);
    } catch {
      // Keep showing the last good data — a failed refetch shouldn't blank the page.
    } finally {
      setLoading(false);
    }
  };

  const monitoredCount = data.services.filter((s) => s.uptimePercent !== null).length;
  const overallUptime =
    monitoredCount > 0
      ? (
          data.services.reduce((sum, s) => sum + (s.uptimePercent ?? 0), 0) / monitoredCount
        ).toFixed(2)
      : null;

  return (
    <div className={loading ? "opacity-60 transition-opacity" : "transition-opacity"}>
      {/* Overall banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-jz-border bg-jz-blue-900 px-6 py-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="relative flex h-3.5 w-3.5">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${DOT_CLASS[data.overallStatus]}`}
            />
            <span className={`relative inline-flex h-3.5 w-3.5 rounded-full ${DOT_CLASS[data.overallStatus]}`} />
          </span>
          <div>
            <p className="text-base font-semibold text-jz-white-50">{OVERALL_LABEL[data.overallStatus]}</p>
            <p className="mt-0.5 text-xs text-jz-white-600">
              {/* Explicit locale — an implicit toLocaleString() picks up the
                  server's locale during SSR and the browser's during
                  hydration, which disagree often enough to throw a hydration
                  mismatch (CW-9). */}
              Last updated {new Date(data.generatedAt).toLocaleString("en-US")}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums text-jz-white-50">
            {overallUptime !== null ? `${overallUptime}%` : "—"}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-jz-white-600">Uptime · {range} days</p>
        </div>
      </div>

      {/* Stat row */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-jz-border bg-jz-blue-900 px-4 py-3">
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-jz-white-600">Avg Response</p>
          <p className="mt-1 text-lg font-bold text-jz-white-50">
            {data.avgResponseTimeMs !== null ? `${data.avgResponseTimeMs} ms` : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-jz-border bg-jz-blue-900 px-4 py-3">
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-jz-white-600">Open Incidents</p>
          <p className="mt-1 text-lg font-bold text-jz-white-50">{data.openIncidents}</p>
        </div>
        <div className="rounded-xl border border-jz-border bg-jz-blue-900 px-4 py-3">
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-jz-white-600">
            Incidents ({range}d)
          </p>
          <p className="mt-1 text-lg font-bold text-jz-white-50">{data.incidentsInWindow}</p>
        </div>
      </div>

      {/* Section header + range switch */}
      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-jz-white-600">Components</h2>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRangeChange(r)}
              className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
                range === r
                  ? "border-jz-white-50 bg-jz-white-50 text-jz-blue-950"
                  : "border-jz-border bg-jz-blue-900 text-jz-white-400"
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 mb-4 flex flex-wrap gap-4 text-[11px] font-medium text-jz-white-600">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-jz-green-500" /> Operational
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-jz-yellow-400" /> Degraded
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-jz-red-600" /> Outage
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-jz-grey-400" /> No data yet
        </span>
      </div>

      {/* Components */}
      <div className="flex flex-col gap-3">
        {data.services.map((service) => (
          <div key={service.service} className="rounded-xl border border-jz-border bg-jz-blue-900 px-4 py-4">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-jz-white-50">{service.label}</p>
                <p className="text-xs text-jz-white-600">{service.description}</p>
              </div>
              <span
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${BADGE_CLASS[service.currentStatus]}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASS[service.currentStatus]}`} />
                {BADGE_LABEL[service.currentStatus]}
              </span>
            </div>
            <div className="flex h-8 items-end gap-[2px]">
              {service.days.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.status}`}
                  className={`min-w-[2px] flex-1 rounded-sm ${
                    day.status === "operational"
                      ? "bg-jz-green-500"
                      : day.status === "degraded"
                        ? "bg-jz-yellow-400"
                        : day.status === "outage"
                          ? "bg-jz-red-600"
                          : "bg-jz-grey-400/40"
                  }`}
                />
              ))}
            </div>
            <div className="mt-1.5 flex justify-between text-[10.5px] text-jz-white-600">
              <span>{range} days ago</span>
              <span className="font-semibold text-jz-white-400 tabular-nums">
                {service.uptimePercent !== null ? `${service.uptimePercent}% uptime` : "Not yet monitored"}
              </span>
              <span>Today</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
