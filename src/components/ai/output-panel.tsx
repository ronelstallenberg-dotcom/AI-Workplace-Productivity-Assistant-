import { useEffect, useState, type ReactNode } from "react";
import { Check, Copy, Eye, PencilLine, RefreshCw, type LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { wordCount } from "@/lib/demo-ai/shared";
import { Markdown } from "./markdown";
import type { GenStatus } from "./use-ai-generation";

export async function copyText(text: string, label = "Copied to clipboard") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(label);
    return true;
  } catch {
    toast.error("Couldn't copy — please select the text and copy manually.");
    return false;
  }
}

export function ThinkingDots({ label = "Thinking" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-primary animate-dot" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </span>
      {label}…
    </span>
  );
}

interface OutputPanelProps {
  title: string;
  status: GenStatus;
  text: string;
  onChange: (t: string) => void;
  onRegenerate: () => void;
  format: "plain" | "markdown";
  empty: { icon: LucideIcon; title: string; text: string };
  toolbarExtra?: ReactNode;
  footerExtra?: ReactNode;
}

export function OutputPanel({ title, status, text, onChange, onRegenerate, format, empty, toolbarExtra, footerExtra }: OutputPanelProps) {
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [edited, setEdited] = useState(false);
  const [copied, setCopied] = useState(false);
  const busy = status === "thinking" || status === "streaming";

  useEffect(() => {
    if (status === "thinking") {
      setEdited(false);
      setMode("preview");
    }
  }, [status]);

  const words = wordCount(text);
  const EmptyIcon = empty.icon;

  return (
    <section className="flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border bg-card shadow-soft">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-gradient-soft px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">{title}</h2>
          {status === "done" && !edited && <Badge variant="outline" className="border-success/30 bg-success-soft text-success">AI draft</Badge>}
          {edited && <Badge variant="outline" className="border-pink/30 bg-pink-soft text-pink-foreground">Edited by you</Badge>}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex rounded-lg border bg-card p-0.5" role="group" aria-label="View mode">
            <button
              type="button"
              onClick={() => setMode("preview")}
              aria-pressed={mode === "preview"}
              className={cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors", mode === "preview" ? "bg-violet-soft text-accent-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
            <button
              type="button"
              disabled={busy || !text}
              onClick={() => setMode("edit")}
              aria-pressed={mode === "edit"}
              className={cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-40", mode === "edit" ? "bg-violet-soft text-accent-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <PencilLine className="h-3.5 w-3.5" /> Edit
            </button>
          </div>
          <Button
            variant="subtle"
            size="sm"
            disabled={busy || !text}
            onClick={async () => {
              if (await copyText(text)) {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }
            }}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="soft" size="sm" disabled={busy || status === "idle"} onClick={onRegenerate}>
            <RefreshCw className={cn("h-3.5 w-3.5", busy && "animate-spin")} /> Regenerate
          </Button>
        </div>
      </header>

      {toolbarExtra && status !== "idle" && <div className="border-b px-4 py-2.5 sm:px-5">{toolbarExtra}</div>}

      <div className="flex-1 p-4 sm:p-6">
        {status === "idle" && (
          <div className="flex h-full min-h-[20rem] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-soft">
              <EmptyIcon className="h-6 w-6 text-primary" />
            </div>
            <p className="font-display font-semibold">{empty.title}</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{empty.text}</p>
          </div>
        )}
        {status === "thinking" && (
          <div className="space-y-3">
            <ThinkingDots label="Generating" />
            {[90, 75, 82, 60].map((w, i) => (
              <div key={i} className="h-3 animate-pulse rounded-full bg-muted" style={{ width: `${w}%` }} />
            ))}
          </div>
        )}
        {(status === "streaming" || status === "done") &&
          (mode === "edit" ? (
            <Textarea
              value={text}
              onChange={(e) => {
                onChange(e.target.value);
                setEdited(true);
              }}
              aria-label="Edit response"
              className="min-h-[26rem] resize-y font-mono text-sm leading-relaxed"
            />
          ) : format === "markdown" ? (
            <Markdown text={text}>{status === "streaming" && <span className="inline-block h-4 w-0.5 bg-primary animate-caret" />}</Markdown>
          ) : (
            <div className="whitespace-pre-wrap text-[0.94rem] leading-relaxed text-foreground/90">
              {text}
              {status === "streaming" && <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-primary animate-caret" />}
            </div>
          ))}
      </div>

      {(status === "done" || status === "streaming") && (
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2.5 text-xs text-muted-foreground sm:px-5">
          <span>
            {words} words · ~{Math.max(1, Math.round(words / 230))} min read
            {mode === "preview" && status === "done" && " · Click Edit to refine the text"}
          </span>
          {footerExtra ?? <span>Review before you use it</span>}
        </footer>
      )}
    </section>
  );
}
