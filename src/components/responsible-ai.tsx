import { Eye, Lock, Scale, ShieldCheck, UserCheck } from "lucide-react";

const PRINCIPLES = [
  { icon: UserCheck, title: "Human oversight", text: "You review, edit and approve every output before it is used." },
  { icon: Eye, title: "Accuracy & transparency", text: "AI can be wrong or out of date. Verify facts, figures and sources." },
  { icon: Lock, title: "Privacy", text: "Don't enter confidential, personal or sensitive company data." },
  { icon: Scale, title: "Fairness", text: "Check content for bias and use inclusive, respectful language." },
];

export function ResponsibleAINote() {
  return (
    <aside className="flex gap-3 rounded-2xl border border-sky/30 bg-sky-soft px-4 py-3.5 text-sm text-sky-foreground">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
      <p>
        <strong className="font-semibold">Responsible AI:</strong> This is a demo with simulated responses. AI-generated content may be inaccurate or
        incomplete — always review, fact-check and edit before sharing, and never enter confidential or personal data. You remain accountable for
        final decisions.
      </p>
    </aside>
  );
}

export function ResponsibleAICard() {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-soft sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-soft">
          <ShieldCheck className="h-5 w-5 text-sky-foreground" />
        </span>
        <div>
          <h2 className="text-lg font-semibold">Responsible AI disclaimer</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Flowmate runs in demo mode: responses are simulated in your browser and nothing is sent to a server. Treat every output as a starting
            draft — not professional, legal, financial or HR advice.
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {PRINCIPLES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-3 rounded-xl bg-muted p-3.5">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
