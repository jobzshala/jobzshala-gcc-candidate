"use client";

export interface TabItem<T extends string> {
  key: T;
  label: string;
  done?: boolean;
}

interface TabsNavProps<T extends string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
}

// Horizontal underline tab bar for the tablet/desktop profile shell — same
// {key,label}[] + activeTab/onChange shape as the admin app's TabsNav.tsx
// (a same-API sibling, not a cross-repo import, since these are separate
// apps), plus an optional `done` flag per tab so a completed section can
// show a checkmark instead of duplicating profileCompletion.ts's logic here.
export default function TabsNav<T extends string>({ tabs, activeTab, onChange }: TabsNavProps<T>) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-jz-border">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`relative shrink-0 whitespace-nowrap px-3.5 py-2.5 text-sm font-medium transition-colors ${
            activeTab === tab.key ? "text-jz-yellow-400" : "text-jz-white-400 hover:text-jz-white-100"
          }`}
        >
          <span className="inline-flex items-center gap-1.5">
            {tab.done && <span className="size-1.5 rounded-full bg-[#4ADE80]" aria-hidden="true" />}
            {tab.label}
          </span>
          {activeTab === tab.key && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-jz-yellow-400" aria-hidden="true" />
          )}
        </button>
      ))}
    </div>
  );
}
