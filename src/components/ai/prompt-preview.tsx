import { useState } from "react";
import { Braces, ChevronDown, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { copyText } from "./output-panel";

export function PromptPreview({ prompt, defaultOpen = true }: { prompt: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="overflow-hidden rounded-2xl border bg-card shadow-soft">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <button type="button" onClick={() => setOpen((o) => !o)} className="flex flex-1 items-center gap-2.5 text-left" aria-expanded={open}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-soft">
            <Braces className="h-4 w-4 text-sky-foreground" />
          </span>
          <span>
            <span className="block text-sm font-semibold">Structured AI prompt</span>
            <span className="block text-xs text-muted-foreground">Updates live as you type — this is what the AI receives</span>
          </span>
          <ChevronDown className={cn("ml-auto h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>
        <Button variant="ghost" size="sm" onClick={() => copyText(prompt, "Prompt copied")} aria-label="Copy prompt">
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
      {open && (
        <pre className="max-h-80 overflow-auto bg-code px-4 py-3.5 font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap text-code-foreground">
          {prompt.split("\n").map((line, i) => {
            const m = line.match(/^([A-Z][A-Z /&-]+:)(.*)$/);
            return (
              <div key={i}>
                {m ? (
                  <>
                    <span className="font-semibold text-pink">{m[1]}</span>
                    <span>{m[2]}</span>
                  </>
                ) : (
                  <span className="opacity-85">{line || " "}</span>
                )}
              </div>
            );
          })}
        </pre>
      )}
    </section>
  );
}
