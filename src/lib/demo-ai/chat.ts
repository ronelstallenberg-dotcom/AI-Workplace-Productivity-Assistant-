import { pick, rotate, stripEndPunct, truncate, upperFirst } from "./shared";

export const CHAT_STYLES = ["Concise", "Detailed"] as const;
export type ChatStyle = (typeof CHAT_STYLES)[number];

export type ChatIntent =
  | "greeting"
  | "thanks"
  | "agenda"
  | "prioritise"
  | "focus"
  | "feedback"
  | "spreadsheet"
  | "project"
  | "presentation"
  | "conflict"
  | "email"
  | "research"
  | "general";

export const INTENT_LABELS: Record<ChatIntent, string> = {
  greeting: "Greeting",
  thanks: "Acknowledgement",
  agenda: "Meeting planning",
  prioritise: "Task prioritisation",
  focus: "Focus & productivity",
  feedback: "Feedback & performance",
  spreadsheet: "Spreadsheet help",
  project: "Project planning",
  presentation: "Presentation coaching",
  conflict: "Workplace communication",
  email: "Email drafting",
  research: "Research & summarising",
  general: "General workplace question",
};

const INTENTS: [ChatIntent, RegExp][] = [
  ["thanks", /^\s*(thanks|thank you|cheers|great,? thanks|perfect)\b/i],
  ["greeting", /^\s*(hi|hello|hey|good (morning|afternoon|evening)|howdy)\b[\s!.,?]*$/i],
  ["spreadsheet", /\b(excel|spreadsheet|formula|vlookup|xlookup|pivot|google sheets|sumif|countif)\b/i],
  ["agenda", /\b(agenda|meeting|stand-?up|retro|workshop|kick-?off meeting)\b/i],
  ["feedback", /\b(feedback|performance review|appraisal|one-on-one|1:1|1-on-1|underperform\w*)\b/i],
  ["conflict", /\b(conflict|difficult conversation|disagree\w*|tension|rude|toxic|argument)\b/i],
  ["presentation", /\b(presentation|slides?|deck|pitch|public speaking|present\b)/i],
  ["project", /\b(project plan|project|timeline|roadmap|milestones?|launch plan)\b/i],
  ["prioritise", /\b(prioriti[sz]\w*|overwhelm\w*|to-?do|too many tasks|tasks|deadlines?|workload|time management)\b/i],
  ["focus", /\b(focus|procrastinat\w*|productiv\w*|distract\w*|deep work|motivation|energy)\b/i],
  ["email", /\b(e-?mail|write a message|draft a message|reply to)\b/i],
  ["research", /\b(summari[sz]e|research|article|report on|insights on)\b/i],
];

export function detectIntent(message: string): ChatIntent {
  for (const [intent, re] of INTENTS) if (re.test(message)) return intent;
  return "general";
}

function extractTopic(msg: string): string {
  const m = msg.match(/\b(?:for|about|on|regarding|around)\s+(?:a |an |the |my |our )?(.+?)[?.!]*$/i);
  return m ? stripEndPunct(m[1].trim()) : "";
}

const LEADS = [
  "Here's a practical approach",
  "Great question — here's how I'd tackle it",
  "Sure! Here's a structured way to approach this",
];

type Reply = { core: string[]; extra: string[] };

const RESPONSES: Record<ChatIntent, (msg: string, seed: number) => Reply> = {
  greeting: (_m, seed) => ({
    core: [
      pick(
        [
          "Hi there! 👋 I'm Flowmate, your workplace assistant.",
          "Hello! 👋 Great to see you. I'm Flowmate, here to help with your workday.",
          "Hey! 👋 I'm Flowmate — ready when you are.",
        ],
        seed,
      ),
      "",
      "I can help you with things like:",
      "- **Planning** meeting agendas and project timelines",
      "- **Prioritising** a busy to-do list",
      "- **Writing** feedback, messages and presentation outlines",
      "- **Spreadsheet** formulas and quick how-tos",
      "",
      "What are you working on today?",
    ],
    extra: [],
  }),
  thanks: (_m, seed) => ({
    core: [
      pick(
        [
          "You're welcome! Happy to help. 😊",
          "Anytime! Glad that was useful.",
          "My pleasure — good luck with it!",
        ],
        seed,
      ),
      "",
      "Is there anything else you'd like to work on — perhaps turning this into an email or a checklist?",
    ],
    extra: [],
  }),
  agenda: (msg, seed) => {
    const topic = extractTopic(msg) || "your meeting";
    return {
      core: [
        `${pick(LEADS, seed)}. Here's a focused **45-minute agenda** for **${topic}**:`,
        "",
        "1. **Welcome & objective** (5 min) — confirm the purpose and the decision needed",
        "2. **Context & updates** (10 min) — key data and progress since last time",
        `3. **Main discussion: ${upperFirst(topic)}** (15 min) — options, trade-offs and open questions`,
        "4. **Decisions** (10 min) — agree on the way forward and who owns it",
        "5. **Actions & wrap-up** (5 min) — owners, deadlines and next check-in",
        "",
        "**Tips to keep it productive**",
        ...rotate(
          [
            "- Share the agenda and any pre-reads at least 24 hours ahead",
            "- Assign a timekeeper and a note-taker",
            "- Park off-topic items in a 'parking lot' to revisit later",
          ],
          seed,
        ),
      ],
      extra: [
        "",
        "**Follow-up template**",
        "- **Decisions made:** …",
        "- **Actions:** [Owner] — [Task] — [Due date]",
        "- **Open questions:** …",
        "- **Next meeting:** …",
      ],
    };
  },
  prioritise: (_m, seed) => ({
    core: [
      `${pick(LEADS, seed)}. When everything feels urgent, use the **Eisenhower Matrix**:`,
      "",
      "| | **Urgent** | **Not urgent** |",
      "- **Do now** — urgent + important (deadlines, critical issues)",
      "- **Schedule** — important, not urgent (strategy, learning, planning)",
      "- **Delegate** — urgent, not important (some requests, routine admin)",
      "- **Drop** — neither (low-value tasks, unnecessary meetings)",
      "",
      "**A quick daily routine**",
      "1. List everything on your plate (5 min brain-dump)",
      "2. Pick your **top 3** outcomes for today",
      "3. Block focused time in your calendar for #1 first",
      "4. Batch small tasks (email, approvals) into 2 short windows",
    ].filter((l) => !l.startsWith("|")),
    extra: [
      "",
      "**If you're overloaded**",
      "- Be transparent with your manager: *\"I can deliver A and B this week — which should C replace?\"*",
      "- Negotiate deadlines early, not on the due date",
      "- Protect at least one 90-minute focus block per day",
    ],
  }),
  focus: (_m, seed) => ({
    core: [
      `${pick(LEADS, seed)}. Here are proven techniques to improve focus:`,
      "",
      ...rotate(
        [
          "- **Time-blocking:** schedule 60–90 minute deep-work blocks and treat them like meetings",
          "- **Pomodoro:** 25 minutes on, 5 minutes off — great for getting started",
          "- **Single-tasking:** close unrelated tabs and pause notifications",
          "- **Two-minute rule:** if something takes under two minutes, do it now",
        ],
        seed,
      ),
      "",
      "Start with the hardest task when your energy is highest (for most people, mid-morning).",
    ],
    extra: [
      "",
      "**Set up your environment**",
      "1. Turn on *Do Not Disturb* in chat and email during focus blocks",
      "2. Keep a 'distraction list' to capture stray thoughts for later",
      "3. Review what you achieved at the end of the day — it builds momentum",
    ],
  }),
  feedback: (_m, seed) => ({
    core: [
      `${pick(LEADS, seed)}. Use the **SBI model** (Situation – Behaviour – Impact):`,
      "",
      "1. **Situation:** *\"In Tuesday's client meeting…\"*",
      "2. **Behaviour:** *\"…you presented the data clearly and handled tough questions calmly…\"*",
      "3. **Impact:** *\"…which gave the client confidence to approve the next phase.\"*",
      "",
      "**For constructive feedback**, add a forward-looking request:",
      "*\"Next time, could you share the deck a day earlier so the team can review it?\"*",
    ],
    extra: [
      "",
      "**Best practices**",
      "- Be specific and timely — within a few days of the event",
      "- Focus on behaviour, not personality",
      "- Ask for their perspective and agree next steps together",
      "- Balance recognition and development over time, not in a 'feedback sandwich'",
    ],
  }),
  spreadsheet: (msg, seed) => {
    const lookup = /lookup/i.test(msg);
    return {
      core: [
        `${pick(LEADS, seed)}. ${lookup ? "For lookups, **XLOOKUP** is the modern, more flexible option:" : "Here are the formulas that cover most workplace tasks:"}`,
        "",
        "- **Look up a value:** `=XLOOKUP(A2, Products!A:A, Products!C:C, \"Not found\")`",
        "- **Conditional sum:** `=SUMIFS(D:D, B:B, \"North\", C:C, \">=2026-01-01\")`",
        "- **Count matches:** `=COUNTIF(B:B, \"Completed\")`",
        "- **Handle errors:** `=IFERROR(A2/B2, 0)`",
        "- **Combine text:** `=TEXTJOIN(\", \", TRUE, A2:C2)`",
      ],
      extra: [
        "",
        "**Pro tips**",
        "1. Convert your range to a **Table** (Ctrl + T) so formulas expand automatically",
        "2. Use a **PivotTable** to summarise thousands of rows in seconds",
        "3. Use **Data Validation** dropdowns to keep inputs consistent",
      ],
    };
  },
  project: (msg, seed) => {
    const topic = extractTopic(msg) || "your project";
    return {
      core: [
        `${pick(LEADS, seed)}. Here's a lightweight project plan for **${topic}**:`,
        "",
        "1. **Define** (Week 1) — goal, scope, success metrics, stakeholders",
        "2. **Plan** (Week 2) — milestones, owners, risks, budget",
        "3. **Execute** (Weeks 3–6) — weekly check-ins and a visible task board",
        "4. **Review** (Week 7) — test, gather feedback, fix gaps",
        "5. **Launch & learn** (Week 8) — go live, measure results, run a retrospective",
        "",
        "**Must-haves:** a one-page project charter, a RACI chart and a simple risk log.",
      ],
      extra: [
        "",
        "**Common pitfalls to avoid**",
        "- Scope creep — agree a change process up front",
        "- Unclear ownership — every task needs one accountable person",
        "- Status updates that hide risks — reward early escalation",
      ],
    };
  },
  presentation: (msg, seed) => {
    const topic = extractTopic(msg) || "your presentation";
    return {
      core: [
        `${pick(LEADS, seed)}. A clear structure for **${topic}** (about 10 slides):`,
        "",
        "1. **Title & hook** — a question, statistic or story",
        "2. **The problem** — why this matters now",
        "3. **Your insight or solution** — the main idea in one sentence",
        "4. **Evidence** — 2–3 slides of data, examples or results",
        "5. **Plan & impact** — what happens next and what it delivers",
        "6. **The ask** — the decision or support you need",
        "",
        "Keep it to **one idea per slide** and practise out loud at least twice.",
      ],
      extra: [
        "",
        "**Delivery tips**",
        "- Open with the conclusion for senior audiences",
        "- Use visuals over bullet-heavy slides",
        "- Prepare answers to the three toughest questions you expect",
      ],
    };
  },
  conflict: (_m, seed) => ({
    core: [
      `${pick(LEADS, seed)}. For a difficult workplace conversation:`,
      "",
      "1. **Prepare** — clarify the facts, your goal and what a good outcome looks like",
      "2. **Choose the setting** — private, unhurried and ideally face-to-face or on video",
      "3. **Open neutrally** — *\"I'd like to talk about how we're working together on X.\"*",
      "4. **Use 'I' statements** — describe impact without blame",
      "5. **Listen to understand** — ask open questions and summarise what you hear",
      "6. **Agree next steps** — specific, written and followed up",
    ],
    extra: [
      "",
      "If the issue involves harassment, discrimination or safety, involve **HR** or your manager promptly rather than handling it alone.",
    ],
  }),
  email: (msg, seed) => {
    const topic = extractTopic(msg) || "your request";
    return {
      core: [
        `${pick(LEADS, seed)}. Here's a quick draft about **${topic}**:`,
        "",
        "**Subject:** " + upperFirst(topic),
        "",
        "Hi [Name],",
        "",
        `I hope you're well. I'm reaching out regarding ${topic}. [Add 1–2 sentences of context.]`,
        "",
        "Could you [specific request] by [date]? Happy to discuss if helpful.",
        "",
        "Best regards,",
        "[Your name]",
        "",
        "💡 For Formal, Friendly or Persuasive versions, try the **Smart Email Generator**.",
      ],
      extra: [],
    };
  },
  research: (msg, seed) => {
    const topic = extractTopic(msg) || truncate(msg, 60);
    return {
      core: [
        `${pick(LEADS, seed)}. For a solid summary of **${topic}**, I'd structure it as:`,
        "",
        "1. **Key takeaway** — the one thing the reader must remember",
        "2. **Context** — why it matters now",
        "3. **Evidence** — 3–5 insights with sources",
        "4. **Implications** — what it means for your team",
        "5. **Recommendations** — concrete next steps",
        "",
        "📚 For a full structured brief with insights and recommendations, open the **AI Research Assistant**.",
      ],
      extra: [],
    };
  },
  general: (msg, seed) => ({
    core: [
      `${pick(LEADS, seed)} for **"${truncate(msg, 90)}"**:`,
      "",
      "1. **Clarify the outcome** — what does 'done' look like, and who is it for?",
      "2. **Gather context** — relevant data, constraints, deadlines and stakeholders",
      "3. **Break it down** — split the work into 3–5 concrete steps with owners",
      "4. **Start with the highest-impact step** — aim for a quick, visible win",
      "5. **Review & communicate** — share progress and adjust based on feedback",
      "",
      "Tell me a bit more — your goal, audience and deadline — and I'll tailor this into a specific plan, message or checklist.",
    ],
    extra: [
      "",
      "**Helpful questions to ask yourself**",
      "- What would happen if I did nothing?",
      "- Who else needs to be involved or informed?",
      "- What's the smallest version of this I could deliver this week?",
    ],
  }),
};

export function generateChatReply(message: string, seed = 0, style: ChatStyle = "Detailed"): string {
  const intent = detectIntent(message);
  const { core, extra } = RESPONSES[intent](message, seed);
  return [...core, ...(style === "Detailed" ? extra : [])].join("\n");
}

export const CHAT_SYSTEM_PROMPT =
  "You are Flowmate, a helpful, accurate and friendly workplace productivity assistant. Give practical, structured answers using headings, numbered steps and examples.";

export function buildChatPrompt(opts: {
  message: string;
  historyCount: number;
  style: ChatStyle;
}): string {
  const intent = opts.message.trim() ? INTENT_LABELS[detectIntent(opts.message)] : "—";
  return [
    `SYSTEM: ${CHAT_SYSTEM_PROMPT}`,
    `RESPONSE STYLE: ${opts.style === "Detailed" ? "Detailed — structured steps plus tips and templates." : "Concise — the essentials only, in a short structured list."}`,
    `DETECTED INTENT: ${intent}`,
    `CONVERSATION CONTEXT: ${opts.historyCount} previous message${opts.historyCount === 1 ? "" : "s"}`,
    "GUARDRAILS: Be honest about uncertainty. No legal, medical or financial advice — suggest a qualified professional. Never request personal or confidential data.",
    `USER PROMPT: "${opts.message.trim() || "[waiting for your message]"}"`,
  ].join("\n");
}

export const CHAT_SUGGESTIONS = [
  "Create an agenda for our quarterly planning meeting",
  "I have too many tasks — help me prioritise",
  "How do I give constructive feedback to a team member?",
  "Which Excel formula should I use for a lookup?",
  "Outline a presentation for a new product launch",
  "Plan a project timeline for a website redesign",
];
