import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Clock, Mail, MessageSquare, Microscope, Sparkles } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDistanceToNow } from "date-fns";

import heroImage from "@/assets/dashboard-hero.jpg";
import { Button } from "@/components/ui/button";
import { ResponsibleAICard } from "@/components/responsible-ai";
import { MINUTES_SAVED, useActivity, type ToolId } from "@/lib/activity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Flowmate AI Workplace Assistant" },
      {
        name: "description",
        content: "Your AI workplace productivity hub: draft emails, research topics and chat with an assistant from one dashboard.",
      },
      { property: "og:title", content: "Dashboard — Flowmate AI Workplace Assistant" },
      { property: "og:description", content: "Draft emails, research topics and chat with a workplace AI assistant in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    url: "/email",
    title: "Smart Email Generator",
    text: "Professional emails in Formal, Friendly or Persuasive tones — ready to edit and send.",
    icon: Mail,
    tint: "bg-violet-soft text-accent-foreground",
    features: ["3 tones", "Length control", "Tone switcher"],
  },
  {
    url: "/research",
    title: "AI Research Assistant",
    text: "Summarise topics and articles into insights, risks and clear recommendations.",
    icon: Microscope,
    tint: "bg-sky-soft text-sky-foreground",
    features: ["Topic briefs", "Article summaries", "Audience-tailored"],
  },
  {
    url: "/chat",
    title: "AI Chatbot",
    text: "An interactive workplace assistant for agendas, priorities, feedback and more.",
    icon: Bot,
    tint: "bg-pink-soft text-pink-foreground",
    features: ["Conversational", "Edit replies", "Smart suggestions"],
  },
] as const;

const TOOL_META: Record<ToolId, { label: string; icon: typeof Mail; tint: string }> = {
  email: { label: "Email", icon: Mail, tint: "bg-violet-soft text-accent-foreground" },
  research: { label: "Research", icon: Microscope, tint: "bg-sky-soft text-sky-foreground" },
  chat: { label: "Chat", icon: MessageSquare, tint: "bg-pink-soft text-pink-foreground" },
};

const WEEKLY_SAMPLE = [
  { day: "Mon", emails: 4, research: 1, chats: 6 },
  { day: "Tue", emails: 6, research: 2, chats: 9 },
  { day: "Wed", emails: 5, research: 3, chats: 7 },
  { day: "Thu", emails: 8, research: 2, chats: 12 },
  { day: "Fri", emails: 7, research: 4, chats: 10 },
];

function Dashboard() {
  const activity = useActivity();
  const counts = { email: 0, research: 0, chat: 0 } as Record<ToolId, number>;
  for (const a of activity) counts[a.tool]++;
  const minutes = counts.email * MINUTES_SAVED.email + counts.research * MINUTES_SAVED.research + counts.chat * MINUTES_SAVED.chat;

  const stats = [
    { label: "Emails drafted", value: counts.email, icon: Mail, tint: "bg-violet-soft text-accent-foreground" },
    { label: "Research briefs", value: counts.research, icon: Microscope, tint: "bg-sky-soft text-sky-foreground" },
    { label: "Chat questions", value: counts.chat, icon: MessageSquare, tint: "bg-pink-soft text-pink-foreground" },
    {
      label: "Est. time saved",
      value: minutes >= 60 ? `${(minutes / 60).toFixed(1)}h` : `${minutes}m`,
      icon: Clock,
      tint: "bg-success-soft text-success",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <section className="relative overflow-hidden rounded-3xl border bg-mesh p-6 shadow-soft sm:p-8 lg:p-10">
        <img
          src={heroImage}
          alt=""
          width={1536}
          height={768}
          className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-auto max-w-none object-cover opacity-90 md:block"
        />
        <div className="relative max-w-xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-card/80 px-3 py-1 text-xs font-medium text-accent-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> AI-powered productivity
          </span>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            Work smarter with your <span className="text-gradient-brand">AI workplace co-pilot</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Draft emails, research any topic and get instant answers — all in one place, with every response fully editable.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Button asChild variant="hero" size="lg">
              <Link to="/email">
                <Mail className="h-4 w-4" /> Write an email
              </Link>
            </Button>
            <Button asChild variant="subtle" size="lg">
              <Link to="/chat">
                <Bot className="h-4 w-4" /> Ask the assistant
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4" aria-label="Your usage">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-4 shadow-soft sm:p-5">
            <div className="flex items-center justify-between">
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", s.tint)}>
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 font-display text-2xl font-semibold sm:text-3xl">{s.value}</p>
            <p className="text-xs text-muted-foreground sm:text-sm">{s.label}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">AI tools</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {TOOLS.map((t) => (
            <Link
              key={t.url}
              to={t.url}
              className="group flex flex-col rounded-2xl border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lift"
            >
              <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", t.tint)}>
                <t.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-semibold">{t.title}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{t.text}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {t.features.map((f) => (
                  <span key={f} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                    {f}
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                Open tool <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <section className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold">Team AI usage this week</h2>
            <span className="text-xs text-muted-foreground">Sample data</span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_SAMPLE} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  {[
                    ["g1", "var(--chart-1)"],
                    ["g2", "var(--chart-2)"],
                    ["g3", "var(--chart-3)"],
                  ].map(([id, c]) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={c} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }} />
                <Area type="monotone" dataKey="chats" name="Chat questions" stroke="var(--chart-3)" strokeWidth={2} fill="url(#g3)" />
                <Area type="monotone" dataKey="emails" name="Emails" stroke="var(--chart-1)" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="research" name="Research" stroke="var(--chart-2)" strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <Legend className="bg-chart-1" label="Emails" />
            <Legend className="bg-chart-2" label="Research" />
            <Legend className="bg-chart-3" label="Chat questions" />
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-soft">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          {activity.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed p-6 text-center">
              <p className="text-sm font-medium">No activity yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Try one of the AI tools — your recent work will show up here.</p>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {activity.slice(0, 6).map((a) => {
                const meta = TOOL_META[a.tool];
                return (
                  <li key={a.id} className="flex items-center gap-3">
                    <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", meta.tint)}>
                      <meta.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {meta.label} · {formatDistanceToNow(a.at, { addSuffix: true })}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <ResponsibleAICard />
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-2.5 w-2.5 rounded-full", className)} /> {label}
    </span>
  );
}
