import { Fragment, type ReactNode } from "react";

function renderInline(text: string, key: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*)/g).filter(Boolean);
  return parts.map((p, i) => {
    const k = `${key}-${i}`;
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={k} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`"))
      return (
        <code key={k} className="rounded-md bg-violet-soft px-1.5 py-0.5 font-mono text-[0.82em] text-accent-foreground">
          {p.slice(1, -1)}
        </code>
      );
    if (p.length > 2 && p.startsWith("*") && p.endsWith("*")) return <em key={k}>{p.slice(1, -1)}</em>;
    return <Fragment key={k}>{p}</Fragment>;
  });
}

type Block =
  | { type: "h1" | "h2" | "h3" | "p" | "quote"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "space" };

function parse(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    const last = blocks.at(-1);
    const ul = line.match(/^\s*[-•]\s+(.*)$/);
    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    if (ul) {
      if (last?.type === "ul") last.items.push(ul[1]);
      else blocks.push({ type: "ul", items: [ul[1]] });
    } else if (ol) {
      if (last?.type === "ol") last.items.push(ol[1]);
      else blocks.push({ type: "ol", items: [ol[1]] });
    } else if (line.startsWith("### ")) blocks.push({ type: "h3", text: line.slice(4) });
    else if (line.startsWith("## ")) blocks.push({ type: "h2", text: line.slice(3) });
    else if (line.startsWith("# ")) blocks.push({ type: "h1", text: line.slice(2) });
    else if (line.startsWith("> ")) blocks.push({ type: "quote", text: line.slice(2) });
    else if (!line.trim()) {
      if (last && last.type !== "space") blocks.push({ type: "space" });
    } else blocks.push({ type: "p", text: line });
  }
  return blocks;
}

export function Markdown({ text, children }: { text: string; children?: ReactNode }) {
  const blocks = parse(text);
  return (
    <div className="space-y-2 text-[0.94rem] leading-relaxed text-foreground/85">
      {blocks.map((b, i) => {
        const k = `b${i}`;
        switch (b.type) {
          case "h1":
            return <h2 key={k} className="text-xl font-semibold text-foreground">{renderInline(b.text, k)}</h2>;
          case "h2":
            return (
              <h3 key={k} className="flex items-center gap-2 pt-3 text-base font-semibold text-foreground">
                <span className="h-4 w-1 rounded-full bg-gradient-brand" aria-hidden />
                {renderInline(b.text, k)}
              </h3>
            );
          case "h3":
            return <h4 key={k} className="pt-1 text-sm font-semibold text-accent-foreground">{renderInline(b.text, k)}</h4>;
          case "quote":
            return (
              <p key={k} className="rounded-lg border border-warning/20 bg-warning-soft px-3 py-2 text-xs text-warning">
                {renderInline(b.text, k)}
              </p>
            );
          case "ul":
            return (
              <ul key={k} className="space-y-1.5 pl-1">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden />
                    <span>{renderInline(it, `${k}-${j}`)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={k} className="space-y-1.5 pl-1">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-soft text-[0.7rem] font-semibold text-accent-foreground">
                      {j + 1}
                    </span>
                    <span>{renderInline(it, `${k}-${j}`)}</span>
                  </li>
                ))}
              </ol>
            );
          case "space":
            return <div key={k} className="h-1" />;
          default:
            return <p key={k}>{renderInline(b.text, k)}</p>;
        }
      })}
      {children}
    </div>
  );
}
