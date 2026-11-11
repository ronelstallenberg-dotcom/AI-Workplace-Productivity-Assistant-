import { findTopicBrief, type TopicBrief } from "./research-kb";
import { pick, rotate, truncate, upperFirst, wordCount } from "./shared";

export const RESEARCH_DEPTHS = ["Overview", "Detailed"] as const;
export type ResearchDepth = (typeof RESEARCH_DEPTHS)[number];
export const AUDIENCES = ["Executive", "Team", "Technical"] as const;
export type Audience = (typeof AUDIENCES)[number];
export type ResearchMode = "topic" | "article";

export interface ResearchInput {
  mode: ResearchMode;
  topic: string;
  article: string;
  depth: ResearchDepth;
  audience: Audience;
}

const AUDIENCE_GUIDANCE: Record<Audience, string> = {
  Executive: "Executive leadership — focus on strategic impact, ROI, risk and decisions required.",
  Team: "Team members & managers — focus on practical actions and day-to-day implications.",
  Technical: "Technical / operations specialists — focus on implementation, data and systems.",
};

const AUDIENCE_SECTION: Record<Audience, { title: string; bullets: string[] }> = {
  Executive: {
    title: "What This Means for Leadership",
    bullets: [
      "Treat {t} as a strategic priority with a named executive sponsor and clear KPIs.",
      "Prioritise initiatives that can show measurable ROI within 2–3 quarters.",
      "Balance opportunity with risk: request a short risk register and mitigation plan.",
    ],
  },
  Team: {
    title: "What This Means for Your Team",
    bullets: [
      "Agree on 2–3 practical changes related to {t} that the team can trial in the next sprint.",
      "Share learnings openly — what worked and what didn't — in a short retrospective.",
      "Flag blockers early so managers can remove them quickly.",
    ],
  },
  Technical: {
    title: "Implementation Notes",
    bullets: [
      "Map current systems, data flows and integration points relevant to {t} before selecting tools.",
      "Define success metrics and logging up front so impact can be measured objectively.",
      "Build security, access control and privacy in by design.",
    ],
  },
};

const SUMMARY_LEADS: Record<Audience, string[]> = {
  Executive: ["**Bottom line:** ", "**In brief:** "],
  Team: ["**The short version:** ", "**Key takeaway:** "],
  Technical: ["**Overview:** ", "**Summary:** "],
};

function genericBrief(topic: string): TopicBrief {
  const t = topic.trim() || "this topic";
  return {
    id: "generic",
    label: upperFirst(t),
    keywords: /$^/,
    summary: [
      `${upperFirst(t)} is increasingly relevant for modern organisations as teams look to improve efficiency, resilience and employee experience. This brief outlines the core drivers, what leading organisations are doing, the main risks to manage and practical recommendations for getting started.`,
      `Organisations are paying closer attention to ${t} as it influences performance, cost and the experience of employees and customers. Below is a structured view of why it matters, what the evidence and practice suggest, and how to take practical first steps.`,
    ],
    insights: [
      `Strategic relevance: ${upperFirst(t)} links directly to goals such as productivity, cost efficiency and customer value — framing it this way helps secure leadership buy-in.`,
      `People factor: Success with ${t} depends as much on change management, skills and culture as on tools or processes.`,
      `Measurement gap: Many initiatives related to ${t} start without baseline metrics, making ROI hard to prove later.`,
      "Incremental wins: Pilots with a narrow scope and defined success criteria consistently outperform big-bang rollouts.",
      `Cross-functional ownership: ${upperFirst(t)} typically spans multiple teams; unclear ownership is a common cause of stalled progress.`,
    ],
    trends: [
      `Growing use of data and automation to support ${t}`,
      "Increased stakeholder expectations of transparency and accountability",
      "Shift from one-off projects to continuous improvement",
    ],
    risks: [
      "Unclear goals or ownership leading to stalled initiatives",
      "Underestimating the change-management and training effort",
      "Relying on assumptions instead of validated data",
      "Compliance, privacy or ethical considerations being overlooked",
    ],
    recommendations: [
      ["Define the objective", `Write a one-sentence goal for ${t} and 2–3 measurable success indicators.`],
      ["Establish a baseline", "Collect current-state data so progress and ROI can be demonstrated."],
      ["Run a focused pilot", "Test with one team for 4–6 weeks before scaling."],
      ["Engage stakeholders early", "Involve the people affected to surface risks and build ownership."],
      ["Review and iterate", "Hold a structured review at the end of the pilot and adjust the plan."],
    ],
    sources: [
      `Recent analyst reports (e.g. Gartner, Forrester, McKinsey) on ${t}`,
      "Peer-reviewed research via Google Scholar",
      "Case studies from organisations of a similar size and sector",
      "Your own internal KPIs, surveys and process data",
    ],
  };
}

function insightLine(s: string): string {
  const i = s.indexOf(": ");
  return i > 0 ? `- **${s.slice(0, i)}:** ${s.slice(i + 2)}` : `- ${s}`;
}

function detailedSection(label: string): string[] {
  return [
    "## Detailed Analysis",
    "### Key drivers",
    `- Pressure to improve efficiency and output is pushing ${label.toLowerCase()} up the agenda.`,
    "- Employee and customer expectations are changing faster than many processes.",
    "- New technology makes different ways of working practical and affordable.",
    "- Regulators, boards and investors increasingly expect evidence of good practice.",
    "### Stakeholder impact",
    "- **Leadership:** needs clear ROI, risk visibility and decision points.",
    "- **Managers:** carry most of the change effort and need tools and training.",
    "- **Employees:** want clarity on what changes for them and why.",
    "- **Customers:** should experience better service, speed or quality as a result.",
    "### 30-60-90 day roadmap",
    `1. **Days 1–30 — Discover:** baseline the current state, interview stakeholders and pick 2–3 priority opportunities.`,
    "2. **Days 31–60 — Pilot:** run a focused pilot with clear success metrics and a weekly feedback loop.",
    "3. **Days 61–90 — Scale:** review results, refine the approach and plan a phased rollout with training and communication.",
  ];
}

function closingSections(sources: string[]): string[] {
  return [
    "## Suggested Next Steps",
    "1. Share this brief with key stakeholders and gather their input.",
    "2. Validate the insights against your own internal data.",
    "3. Choose one recommendation to pilot this month and set a review date.",
    "## Sources to Consult & Verify",
    ...sources.map((s) => `- ${s}`),
    "> Demo output: verify facts, figures and sources against current, authoritative references before relying on them.",
  ];
}

function topicReport(input: ResearchInput, seed: number): string {
  const brief = findTopicBrief(input.topic) ?? genericBrief(input.topic);
  const isGeneric = brief.id === "generic";
  const label = brief.label;
  const count = input.depth === "Detailed" ? 6 : 4;
  const insights = rotate(brief.insights, seed).slice(0, count);
  const recs = rotate(brief.recommendations, seed).slice(0, input.depth === "Detailed" ? 5 : 4);
  const aud = AUDIENCE_SECTION[input.audience];

  const out: string[] = [
    `# Research Brief: ${upperFirst(input.topic.trim()) || label}`,
    isGeneric ? "" : `Matched knowledge area: **${label}** · Audience: **${input.audience}** · Depth: **${input.depth}**`,
    "## Executive Summary",
    `${pick(SUMMARY_LEADS[input.audience], seed)}${pick(brief.summary, seed, 1)}`,
    "## Key Insights",
    ...insights.map(insightLine),
    "## Trends & Signals",
    ...rotate(brief.trends, seed).map((t) => `- ${t}`),
    "## Risks & Considerations",
    ...brief.risks.map((r) => `- ${r}`),
    "## Recommendations",
    ...recs.map(([a, d], i) => `${i + 1}. **${a}** — ${d}`),
    `## ${aud.title}`,
    ...aud.bullets.map((b) => `- ${b.replaceAll("{t}", label.toLowerCase())}`),
  ];
  if (input.depth === "Detailed") out.push(...detailedSection(label));
  out.push(...closingSections(brief.sources));
  return out.filter((l) => l !== "").join("\n");
}

const STOPWORDS = new Set(
  "a about above after again against all also am an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers him his how i if in into is it its itself just me more most my no nor not now of off on once only or other our ours out over own same she should so some such than that the their them then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours new one two many much may might must per via however across within without make makes made use used using get gets like well even still said says".split(
    " ",
  ),
);

export function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"“])/)
    .map((s) => s.trim())
    .filter((s) => wordCount(s) >= 5);
}

export function extractKeywords(text: string, n = 6): string[] {
  const freq = new Map<string, number>();
  for (const w of text.toLowerCase().match(/[a-z][a-z-]{2,}/g) ?? []) {
    if (STOPWORDS.has(w)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, n)
    .map(([w]) => w);
}

function rankSentences(sentences: string[], text: string): number[] {
  const kws = extractKeywords(text, 15);
  const weight = new Map(kws.map((k, i) => [k, 15 - i]));
  const scores = sentences.map((s, idx) => {
    const words = s.toLowerCase().match(/[a-z][a-z-]{2,}/g) ?? [];
    const score = words.reduce((acc, w) => acc + (weight.get(w) ?? 0), 0) / Math.sqrt(words.length || 1);
    return { idx, score: score + (idx === 0 ? 3 : 0) };
  });
  return scores.sort((a, b) => b.score - a.score).map((s) => s.idx);
}

function articleReport(input: ResearchInput, seed: number): string {
  const text = input.article.trim();
  const sentences = splitSentences(text);
  const ranked = rankSentences(sentences, text);
  const summaryCount = input.depth === "Detailed" ? 4 : 3;
  const summaryIdx = ranked.slice(0, summaryCount).sort((a, b) => a - b);
  const insightIdx = ranked.slice(summaryCount, summaryCount + (input.depth === "Detailed" ? 5 : 3));
  const insightSource = insightIdx.length ? insightIdx : ranked.slice(0, 3);
  const keywords = extractKeywords(text, 6);
  const facts = sentences.filter((s) => /\d/.test(s)).slice(0, 4);
  const brief = findTopicBrief(text);
  const words = wordCount(text);
  const aud = AUDIENCE_SECTION[input.audience];
  const label = brief?.label ?? (keywords[0] ? upperFirst(keywords[0]) : "the article topic");

  const recs: [string, string][] = brief
    ? rotate(brief.recommendations, seed).slice(0, 3)
    : [];
  recs.push(
    ["Validate the core claims", `Cross-check statements about **${keywords[0] ?? "the main topic"}** with at least two independent, authoritative sources.`],
    ["Assess relevance", `Identify how the points on **${keywords[1] ?? "the key themes"}** apply to your team's goals, processes and customers.`],
  );
  if (input.depth === "Detailed")
    recs.push(["Define one experiment", "Choose a practical action inspired by the article, assign an owner and set a review date."]);

  const out: string[] = [
    "# Article Analysis",
    `Audience: **${input.audience}** · Depth: **${input.depth}**${brief ? ` · Related area: **${brief.label}**` : ""}`,
    "## Summary",
    `${pick(SUMMARY_LEADS[input.audience], seed)}${summaryIdx.map((i) => sentences[i]).join(" ")}`,
    "## Key Themes",
    keywords.map((k) => `\`${k}\``).join("  "),
    "## Key Insights",
    ...insightSource.map((i) => `- ${sentences[i]}`),
  ];
  if (facts.length) out.push("## Notable Facts & Figures", ...facts.map((f) => `- ${f}`));
  if (brief) {
    out.push("## Context & Wider Trends", ...rotate(brief.trends, seed).slice(0, 3).map((t) => `- ${t}`));
  }
  out.push(
    "## Recommendations",
    ...recs.map(([a, d], i) => `${i + 1}. **${a}** — ${d}`),
    `## ${aud.title}`,
    ...aud.bullets.map((b) => `- ${b.replaceAll("{t}", label.toLowerCase())}`),
    "## Article Snapshot",
    `- **Word count:** ${words}`,
    `- **Estimated reading time:** ${Math.max(1, Math.round(words / 230))} min`,
    `- **Sentences analysed:** ${sentences.length}`,
    `- **Compression:** ${words ? Math.round((1 - wordCount(summaryIdx.map((i) => sentences[i]).join(" ")) / words) * 100) : 0}% shorter summary`,
  );
  if (input.depth === "Detailed") out.push(...detailedSection(label));
  out.push(...closingSections(brief?.sources ?? ["The original article's cited sources", "Independent coverage of the same topic", "Your own internal data"]));
  return out.join("\n");
}

export function generateResearch(input: ResearchInput, seed = 0): string {
  return input.mode === "article" ? articleReport(input, seed) : topicReport(input, seed);
}

export function buildResearchPrompt(input: ResearchInput): string {
  const task =
    input.mode === "article"
      ? "Summarise the article provided below and extract detailed insights and recommendations."
      : `Research and summarise the topic "${input.topic.trim() || "[not specified]"}" and provide detailed insights and recommendations.`;
  const lines = [
    "ROLE: You are an expert research analyst supporting workplace decision-making.",
    `TASK: ${task}`,
    `AUDIENCE: ${AUDIENCE_GUIDANCE[input.audience]}`,
    `DEPTH: ${input.depth === "Detailed" ? "Detailed — include analysis of drivers, stakeholder impact and a 30-60-90 day roadmap." : "Overview — concise, scannable summary with the essentials."}`,
    "OUTPUT STRUCTURE:",
    "  1. Executive summary",
    "  2. Key insights",
    input.mode === "article" ? "  3. Key themes, facts & figures" : "  3. Trends & signals",
    "  4. Risks & considerations",
    "  5. Actionable recommendations",
    "  6. Next steps & sources to verify",
    "CONSTRAINTS: Be objective and balanced. Flag uncertainty. Do not fabricate statistics or citations. Recommend verification of key facts.",
  ];
  if (input.mode === "article")
    lines.push(`INPUT ARTICLE (${wordCount(input.article)} words): "${truncate(input.article, 160) || "[paste an article]"}"`);
  return lines.join("\n");
}

export const RESEARCH_TOPIC_SUGGESTIONS = [
  "Hybrid work best practices",
  "Generative AI adoption in the workplace",
  "Preventing employee burnout",
  "Phishing and cybersecurity awareness",
  "Reducing customer churn",
  "Improving meeting productivity",
];

export const SAMPLE_ARTICLE = `Generative AI tools are rapidly becoming part of everyday office work. In a recent internal survey of 1,200 employees across finance, marketing and customer service, 64% said they had used an AI assistant at least once a week to draft emails, summarise documents or prepare reports. Teams that received structured training reported saving an average of 3.5 hours per week, compared with 1.2 hours for teams that adopted the tools informally.

However, the benefits were not evenly distributed. Managers reported concerns about accuracy, with 38% saying they had found factual errors in AI-generated content that had been shared with clients or leadership. Legal and compliance teams also raised the risk of employees pasting confidential customer information into public AI tools that were not approved by the organisation.

The organisations that achieved the strongest results treated AI adoption as a change-management programme rather than a software rollout. They published clear usage guidelines, nominated AI champions in each department and required human review before any AI-assisted content was sent externally. Several also redesigned workflows, for example by using AI to produce a first draft of a report while analysts focused on interpretation and recommendations.

Looking ahead, leaders expect AI assistants to be embedded in most business applications within two years. Experts recommend that companies invest in AI literacy, establish governance that includes legal, security and HR, and measure both productivity gains and error rates so that the value of AI can be demonstrated responsibly.`;
