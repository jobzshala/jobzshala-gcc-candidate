import { INCIDENTS } from "./data";

const ROWS = INCIDENTS.map((incident, i) => ({
  incident,
  showMonth: i === 0 || INCIDENTS[i - 1].month !== incident.month,
}));

export default function IncidentHistory() {
  return (
    <div>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-jz-white-600">Past Incidents</h2>
      {ROWS.length === 0 ? (
        <div className="rounded-xl border border-jz-border bg-jz-blue-900 px-4 py-6 text-center text-sm text-jz-white-600">
          No incidents reported in this history.
        </div>
      ) : (
      <div className="flex flex-col gap-3">
        {ROWS.map(({ incident, showMonth }, i) => {
          return (
            <div key={i}>
              {showMonth ? <p className="mb-2 mt-4 text-xs font-bold text-jz-white-600 first:mt-0">{incident.month}</p> : null}
              <div className="rounded-xl border border-jz-border bg-jz-blue-900 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-jz-white-50">{incident.title}</p>
                  <p className="text-xs font-semibold text-jz-white-600">{incident.date}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-jz-border bg-jz-blue-950 px-2 py-0.5 text-[10px] font-bold text-jz-white-400">
                    {incident.component}
                  </span>
                  <span className="rounded-full border border-jz-border bg-jz-blue-950 px-2 py-0.5 text-[10px] font-bold text-jz-white-400">
                    {incident.severity}
                  </span>
                  <span className="rounded-full border border-jz-border bg-jz-blue-950 px-2 py-0.5 text-[10px] font-bold text-jz-white-400">
                    Duration: {incident.duration}
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-1.5">
                  {incident.log.map((entry, j) => (
                    <div key={j} className="flex gap-3 text-xs">
                      <span className="min-w-[46px] flex-none font-semibold text-jz-white-600">{entry.time}</span>
                      <span className="text-jz-white-400">
                        <b className="text-jz-white-50">{entry.label}</b> — {entry.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
