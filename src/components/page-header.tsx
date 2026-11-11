import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export function PageHeader({ icon: Icon, title, description, actions }: { icon: LucideIcon; title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3.5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-brand shadow-glow">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold sm:text-[1.7rem]">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function FieldLabel({ htmlFor, children, hint }: { htmlFor?: string; children: ReactNode; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium">
      <span>{children}</span>
      {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: readonly T[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex w-full rounded-xl border bg-muted p-1">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={
            value === o
              ? "flex-1 rounded-lg bg-card px-3 py-1.5 text-sm font-semibold text-accent-foreground shadow-soft"
              : "flex-1 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          {o}
        </button>
      ))}
    </div>
  );
}
