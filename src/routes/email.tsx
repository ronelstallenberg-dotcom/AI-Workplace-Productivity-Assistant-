import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Mail, Smile, Sparkles, Target, Wand2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel, PageHeader, Segmented } from "@/components/page-header";
import { OutputPanel } from "@/components/ai/output-panel";
import { PromptPreview } from "@/components/ai/prompt-preview";
import { useAiGeneration } from "@/components/ai/use-ai-generation";
import { ResponsibleAINote } from "@/components/responsible-ai";
import {
  buildEmailPrompt,
  CATEGORY_LABELS,
  detectEmailCategory,
  EMAIL_EXAMPLES,
  EMAIL_LENGTHS,
  generateEmail,
  TONE_DETAILS,
  TONES,
  type EmailInput,
  type Tone,
} from "@/lib/demo-ai/email";
import { recordActivity } from "@/lib/activity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Flowmate AI" },
      { name: "description", content: "Generate professional workplace emails in Formal, Friendly or Persuasive tones, then edit, copy or regenerate." },
      { property: "og:title", content: "Smart Email Generator — Flowmate AI" },
      { property: "og:description", content: "Professional emails in Formal, Friendly or Persuasive tones in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const TONE_ICONS: Record<Tone, typeof Briefcase> = { Formal: Briefcase, Friendly: Smile, Persuasive: Target };
const TONE_TINTS: Record<Tone, string> = {
  Formal: "bg-violet-soft text-accent-foreground",
  Friendly: "bg-sky-soft text-sky-foreground",
  Persuasive: "bg-pink-soft text-pink-foreground",
};

function EmailPage() {
  const ex = EMAIL_EXAMPLES[0]!;
  const [input, setInput] = useState<EmailInput>({
    recipient: ex.recipient,
    sender: ex.sender,
    senderRole: ex.senderRole,
    subject: ex.subject,
    keyPoints: ex.keyPoints,
    tone: "Formal",
    length: "Standard",
  });
  const [seed, setSeed] = useState(0);
  const gen = useAiGeneration();
  const prompt = useMemo(() => buildEmailPrompt(input), [input]);
  const category = detectEmailCategory(input.subject, input.keyPoints);

  const set = <K extends keyof EmailInput>(k: K, v: EmailInput[K]) => setInput((p) => ({ ...p, [k]: v }));

  const generate = (next: EmailInput = input, nextSeed = seed) => {
    if (!next.subject.trim()) {
      toast.error("Add a subject or purpose so the AI knows what to write about.");
      return;
    }
    gen.run(generateEmail(next, nextSeed));
    recordActivity("email", `${next.tone} email: ${next.subject.trim()}`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe what you need to say and choose a tone. Get a polished, ready-to-edit email in seconds."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-4 shadow-soft sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">Email details</h2>
              <div className="flex flex-wrap gap-1.5">
                {EMAIL_EXAMPLES.map((e) => (
                  <button
                    key={e.label}
                    type="button"
                    onClick={() => setInput((p) => ({ ...p, recipient: e.recipient, sender: e.sender, senderRole: e.senderRole, subject: e.subject, keyPoints: e.keyPoints }))}
                    className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-violet-soft hover:text-accent-foreground"
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="recipient">Recipient name</FieldLabel>
                  <Input id="recipient" value={input.recipient} onChange={(e) => set("recipient", e.target.value)} placeholder="e.g. Sarah Mitchell" />
                </div>
                <div>
                  <FieldLabel htmlFor="sender">Your name</FieldLabel>
                  <Input id="sender" value={input.sender} onChange={(e) => set("sender", e.target.value)} placeholder="e.g. Alex Johnson" />
                </div>
              </div>
              <div>
                <FieldLabel htmlFor="role" hint="Optional">Your role / title</FieldLabel>
                <Input id="role" value={input.senderRole} onChange={(e) => set("senderRole", e.target.value)} placeholder="e.g. Operations Manager" />
              </div>
              <div>
                <FieldLabel htmlFor="subject" hint={`Detected: ${CATEGORY_LABELS[category]}`}>Subject or purpose</FieldLabel>
                <Input id="subject" value={input.subject} onChange={(e) => set("subject", e.target.value)} placeholder="e.g. Follow-up on the client proposal" />
              </div>
              <div>
                <FieldLabel htmlFor="points" hint="One per line">Key points to include</FieldLabel>
                <Textarea id="points" rows={4} value={input.keyPoints} onChange={(e) => set("keyPoints", e.target.value)} placeholder={"e.g. Thank them for their time\nConfirm the delivery date\nAsk for sign-off by Friday"} />
              </div>

              <div>
                <FieldLabel>Tone</FieldLabel>
                <div role="radiogroup" aria-label="Tone" className="grid gap-2 sm:grid-cols-3">
                  {TONES.map((t) => {
                    const Icon = TONE_ICONS[t];
                    const active = input.tone === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => set("tone", t)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-3 text-left transition-all sm:flex-col sm:items-start sm:gap-2",
                          active ? "border-primary bg-violet-soft/60 ring-2 ring-primary/20" : "hover:border-primary/30 hover:bg-muted",
                        )}
                      >
                        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", TONE_TINTS[t])}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold">{t}</span>
                          <span className="block text-xs text-muted-foreground">{TONE_DETAILS[t].description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <FieldLabel>Length</FieldLabel>
                <Segmented label="Length" value={input.length} options={EMAIL_LENGTHS} onChange={(v) => set("length", v)} />
              </div>

              <Button variant="hero" size="lg" className="w-full" disabled={gen.busy} onClick={() => generate()}>
                <Wand2 className="h-4 w-4" /> {gen.busy ? "Writing your email…" : "Generate email"}
              </Button>
            </div>
          </section>

          <PromptPreview prompt={prompt} />
        </div>

        <div className="space-y-4">
          <OutputPanel
            title="Generated email"
            status={gen.status}
            text={gen.text}
            onChange={gen.setText}
            format="plain"
            onRegenerate={() => {
              const s = seed + 1;
              setSeed(s);
              generate(input, s);
            }}
            empty={{ icon: Sparkles, title: "Your email will appear here", text: "Fill in the details, pick a tone and press Generate email." }}
            toolbarExtra={
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted-foreground">Try another tone:</span>
                {TONES.filter((t) => t !== input.tone).map((t) => (
                  <button
                    key={t}
                    type="button"
                    disabled={gen.busy}
                    onClick={() => {
                      const next = { ...input, tone: t };
                      setInput(next);
                      generate(next);
                    }}
                    className={cn("rounded-full px-2.5 py-1 font-medium transition-opacity hover:opacity-80 disabled:opacity-40", TONE_TINTS[t])}
                  >
                    {t}
                  </button>
                ))}
              </div>
            }
          />
          <ResponsibleAINote />
        </div>
      </div>
    </div>
  );
}
