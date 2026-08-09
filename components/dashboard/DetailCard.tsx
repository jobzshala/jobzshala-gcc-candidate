import Link from "next/link";
import type { ComponentType } from "react";
import { CheckCircleIcon, ClockIcon } from "@/components/ui/icons";

type DetailCardProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  editHref?: string;
  onEdit?: () => void;
  editLabel?: string;
  complete: boolean;
  footerLabel?: string;
  children: React.ReactNode;
  /** Anchor target for "Complete your profile" deep links (e.g. #resume) —
   *  those links only ever worked once something in the DOM actually had
   *  the matching id. */
  id?: string;
};

export default function DetailCard({
  icon: Icon,
  title,
  editHref,
  onEdit,
  editLabel = "Edit",
  complete,
  footerLabel,
  children,
  id,
}: DetailCardProps) {
  return (
    <div id={id} className="card">
      <div className="card-body">
        <div className="card-head">
          <div className="card-title">
            <span className="ic">
              <Icon className="icon" />
            </span>
            <h3>{title}</h3>
          </div>
          {editHref && (
            <Link href={editHref} className="link-btn">
              {editLabel}
            </Link>
          )}
          {!editHref && onEdit && (
            <button type="button" onClick={onEdit} className="link-btn">
              {editLabel}
            </button>
          )}
        </div>
        {children}
      </div>
      <div className={`completed-bar${complete ? "" : " pending"}`}>
        {complete ? <CheckCircleIcon className="icon" /> : <ClockIcon className="icon" />}
        {footerLabel ?? (complete ? "Completed" : "Not started")}
      </div>
    </div>
  );
}

export function Field({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="field">
      {Icon && <Icon className="icon fic" />}
      <div>
        <div className="k">{label}</div>
        <div className="v">{value}</div>
      </div>
    </div>
  );
}
