import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Check, Copy, Eraser, PencilLine, RefreshCw, SendHorizontal, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel, PageHeader, Segmented } from "@/components/page-header";
import { Markdown } from "@/components/ai/markdown";
import { copyText, ThinkingDots } from "@/components/ai/output-panel";
import { PromptPreview } from "@/components/ai/prompt-preview";
import { streamText } from "@/components/ai/use-ai-generation";
import { ResponsibleAINote } from "@/components/responsible-ai";
import { buildChatPrompt, CHAT_STYLES, CHAT_SUGGESTIONS, generateChatReply, type ChatStyle } from "@/lib/demo-ai/chat";
import { recordActivity } from "@/lib/activity";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Flowmate AI" },
      { name: "description", content: "Chat with an interactive workplace assistant for agendas, prioritisation, feedback, spreadsheets and more." },
      { property: "og:title", content: "AI Chatbot — Flowmate AI" },
      { property: "og:description", content: "An interactive workplace assistant that answers your everyday work questions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  seed: number;
  status: "thinking" | "streaming" | "done";
  edited?: boolean;
}

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [style, setStyle] = useState<ChatStyle>("Detailed");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const cancelRef = useRef<(() => void) | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const busy = messages.some((m) => m.status !== "done");

  useEffect(() => () => cancelRef.current?.(), []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const prompt = useMemo(
    () => buildChatPrompt({ message: draft || lastUser?.content || "", historyCount: messages.length, style }),
    [draft, lastUser?.content, messages.length, style],
  );

  const patch = (id: string, p: Partial<Message>) => setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, ...p } : m)));

  const respond = (assistantId: string, userText: string, seed: number) => {
    cancelRef.current?.();
    const full = generateChatReply(userText, seed, style);
    cancelRef.current = streamText(
      full,
      (t) => patch(assistantId, { content: t, status: "streaming" }),
      () => patch(assistantId, { status: "done" }),
      800,
    );
  };

  const send = (text = draft) => {
    const msg = text.trim();
    if (!msg || busy) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: msg, seed: 0, status: "done" };
    const seed = messages.length;
    const botMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: "", seed, status: "thinking" };
    setMessages((ms) => [...ms, userMsg, botMsg]);
    setDraft("");
    recordActivity("chat", msg);
    respond(botMsg.id, msg, seed);
  };

  const regenerate = (index: number) => {
    const bot = messages[index];
    const user = messages.slice(0, index).reverse().find((m) => m.role === "user");
    if (!user || busy) return;
    const seed = bot.seed + 1;
    patch(bot.id, { content: "", status: "thinking", seed, edited: false });
    respond(bot.id, user.content, seed);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <PageHeader
        icon={Bot}
        title="AI Chatbot"
        description="Ask anything about your workday — agendas, priorities, feedback, spreadsheets, presentations and more."
        actions={
          messages.length > 0 && (
            <Button variant="subtle" size="sm" disabled={busy} onClick={() => setMessages([])}>
              <Eraser className="h-3.5 w-3.5" /> Clear chat
            </Button>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="flex h-[calc(100svh-15rem)] min-h-[32rem] flex-col overflow-hidden rounded-2xl border bg-card shadow-soft">
          <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6" aria-live="polite">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </span>
                <h2 className="text-lg font-semibold">How can I help you today?</h2>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">Pick a suggestion or type your own question below.</p>
                <div className="mt-6 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
                  {CHAT_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-xl border bg-card px-3.5 py-3 text-left text-sm transition-all hover:border-pink/40 hover:bg-pink-soft"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={m.id} className="flex justify-end animate-fade-up">
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-gradient-brand px-4 py-2.5 text-sm text-primary-foreground shadow-glow">{m.content}</div>
                  </div>
                ) : (
                  <div key={m.id} className="flex gap-3 animate-fade-up">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-soft">
                      <Bot className="h-4 w-4 text-pink-foreground" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="rounded-2xl rounded-tl-md border bg-muted/50 px-4 py-3">
                        {m.status === "thinking" ? (
                          <ThinkingDots />
                        ) : editingId === m.id ? (
                          <div className="space-y-2">
                            <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={10} className="bg-card font-mono text-sm" aria-label="Edit response" />
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                <X className="h-3.5 w-3.5" /> Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  patch(m.id, { content: editText, edited: true });
                                  setEditingId(null);
                                }}
                              >
                                <Check className="h-3.5 w-3.5" /> Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Markdown text={m.content}>{m.status === "streaming" && <span className="inline-block h-4 w-0.5 bg-primary animate-caret" />}</Markdown>
                        )}
                      </div>
                      {m.status === "done" && editingId !== m.id && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" onClick={() => copyText(m.content)}>
                            <Copy className="h-3.5 w-3.5" /> Copy
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" disabled={busy} onClick={() => regenerate(i)}>
                            <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-muted-foreground"
                            onClick={() => {
                              setEditingId(m.id);
                              setEditText(m.content);
                            }}
                          >
                            <PencilLine className="h-3.5 w-3.5" /> Edit
                          </Button>
                          {m.edited && <span className="rounded-full bg-pink-soft px-2 py-0.5 text-[0.7rem] font-medium text-pink-foreground">Edited</span>}
                        </div>
                      )}
                    </div>
                  </div>
                ),
              )
            )}
          </div>

          <form
            className="border-t bg-card p-3 sm:p-4"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <div className="flex items-end gap-2 rounded-2xl border bg-background p-1.5 focus-within:ring-2 focus-within:ring-ring/40">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Ask your workplace assistant…"
                aria-label="Message"
                className="max-h-36 min-h-10 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button type="submit" variant="hero" size="icon" disabled={!draft.trim() || busy} aria-label="Send message" className="shrink-0 rounded-xl">
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 px-1 text-[0.7rem] text-muted-foreground">Enter to send · Shift + Enter for a new line</p>
          </form>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border bg-card p-4 shadow-soft">
            <FieldLabel>Response style</FieldLabel>
            <Segmented label="Response style" value={style} options={CHAT_STYLES} onChange={setStyle} />
            <p className="mt-3 text-xs text-muted-foreground">
              Need a full email or research brief? Try the{" "}
              <Link to="/email" className="font-medium text-primary hover:underline">
                Email Generator
              </Link>{" "}
              or{" "}
              <Link to="/research" className="font-medium text-primary hover:underline">
                Research Assistant
              </Link>
              .
            </p>
          </section>
          <PromptPreview prompt={prompt} />
          <ResponsibleAINote />
        </aside>
      </div>
    </div>
  );
}

