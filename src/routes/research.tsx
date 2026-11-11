import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpenText, FileText, Lightbulb, Microscope, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldLabel, PageHeader, Segmented } from "@/components/page-header";
import { OutputPanel } from "@/components/ai/output-panel";
import { PromptPreview } from "@/components/ai/prompt-preview";
import { useAiGeneration } from "@/components/ai/use-ai-generation";
import { ResponsibleAINote } from "@/components/responsible-ai";
import {
  AUDIENCES,
  buildResearchPrompt,
  generateResearch,
  RESEARCH_DEPTHS,
  RESEARCH_TOPIC_SUGGESTIONS,
  SAMPLE_ARTICLE,
  type Audience,
  type ResearchInput,
} from "@/lib/demo-ai/research";
import { truncate, wordCount } from "@/lib/demo-ai/shared";
import { recordActivity } from "@/lib/activity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Flowmate AI" },
      { name: "description", content: "Summarise workplace topics and articles into structured insights, risks and recommendations you can edit and share." },
      { property: "og:title", content: "AI Research Assistant — Flowmate AI" },
      { property: "og:description", content: "Turn any topic or article into a structured research brief with insights and recommendations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [input, setInput] = useState<ResearchInput>({
    mode: "topic",
    topic: RESEARCH_TOPIC_SUGGESTIONS[1],
    article: "",
    depth: "Detailed",
    audience: "Executive",
  });
  const [seed, setSeed] = useState(0);
  const gen = useAiGeneration();
  const prompt = useMemo(() => buildResearchPrompt(input), [input]);
  const set = <K extends keyof ResearchInput>(k: K, v: ResearchInput[K]) => setInput((p) => ({ ...p, [k]: v }));

  const generate = (s = seed) => {
    if (input.mode === "topic" && !input.topic.trim()) return toast.error("Enter a topic to research.");
    if (input.mode === "article" && wordCount(input.article) < 40)
      return toast.error("Paste an article of at least 40 words — or load the sample article.");
    gen.run(generateResearch(input, s));
    recordActivity("research", input.mode === "topic" ? `Brief: ${input.topic.trim()}` : `Article: ${truncate(input.article, 48)}`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        icon={Microscope}
        title="AI Research Assistant"
        description="Summarise a topic or paste an article to get key insights, risks and practical recommendations."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border bg-card p-4 shadow-soft sm:p-5">
            <div role="tablist" aria-label="Research mode" className="mb-5 grid grid-cols-2 gap-2">
              {(
                [
                  { id: "topic", label: "Research a topic", icon: Search },
                  { id: "article", label: "Summarise an article", icon: FileText },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  role="tab"
                  type="button"
                  aria-selected={input.mode === m.id}
                  onClick={() => set("mode", m.id)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
                    input.mode === m.id ? "border-sky bg-sky-soft text-sky-foreground ring-2 ring-sky/20" : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <m.icon className="h-4 w-4" /> {m.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {input.mode === "topic" ? (
                <div>
                  <FieldLabel htmlFor="topic">Topic or question</FieldLabel>
                  <Input id="topic" value={input.topic} onChange={(e) => set("topic", e.target.value)} placeholder="e.g. Best practices for hybrid work" />
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {RESEARCH_TOPIC_SUGGESTIONS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => set("topic", t)}
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-xs transition-colors",
                          input.topic === t ? "border-sky bg-sky-soft text-sky-foreground" : "text-muted-foreground hover:bg-muted",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <FieldLabel htmlFor="article" hint={`${wordCount(input.article)} words`}>
                    Article text
                  </FieldLabel>
                  <Textarea
                    id="article"
                    rows={9}
                    value={input.article}
                    onChange={(e) => set("article", e.target.value)}
                    placeholder="Paste the article, report or document text you want summarised…"
                  />
                  <Button variant="link" size="sm" className="mt-1 h-auto px-0" onClick={() => set("article", SAMPLE_ARTICLE)}>
                    <BookOpenText className="h-3.5 w-3.5" /> Load a sample article
                  </Button>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel>Depth</FieldLabel>
                  <Segmented label="Depth" value={input.depth} options={RESEARCH_DEPTHS} onChange={(v) => set("depth", v)} />
                </div>
                <div>
                  <FieldLabel htmlFor="audience">Audience</FieldLabel>
                  <Select value={input.audience} onValueChange={(v) => set("audience", v as Audience)}>
                    <SelectTrigger id="audience" className="h-[2.6rem] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AUDIENCES.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button variant="hero" size="lg" className="w-full" disabled={gen.busy} onClick={() => generate()}>
                <Lightbulb className="h-4 w-4" /> {gen.busy ? "Analysing…" : input.mode === "topic" ? "Generate research brief" : "Summarise article"}
              </Button>
            </div>
          </section>

          <PromptPreview prompt={prompt} />
        </div>

        <div className="space-y-4">
          <OutputPanel
            title="Research brief"
            status={gen.status}
            text={gen.text}
            onChange={gen.setText}
            format="markdown"
            onRegenerate={() => {
              const s = seed + 1;
              setSeed(s);
              generate(s);
            }}
            empty={{ icon: Microscope, title: "Your research brief will appear here", text: "Choose a topic or paste an article, then generate a structured brief." }}
          />
          <ResponsibleAINote />
        </div>
      </div>
    </div>
  );
}
