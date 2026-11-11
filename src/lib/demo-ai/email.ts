import { ensurePeriod, firstName, lowerFirst, pick, splitPoints, stripEndPunct, upperFirst } from "./shared";

export const TONES = ["Formal", "Friendly", "Persuasive"] as const;
export type Tone = (typeof TONES)[number];

export const EMAIL_LENGTHS = ["Concise", "Standard", "Detailed"] as const;
export type EmailLength = (typeof EMAIL_LENGTHS)[number];

export interface EmailInput {
  recipient: string;
  sender: string;
  senderRole: string;
  subject: string;
  keyPoints: string;
  tone: Tone;
  length: EmailLength;
}

export const TONE_DETAILS: Record<Tone, { description: string; guidance: string }> = {
  Formal: {
    description: "Polished, precise and respectful",
    guidance: "Formal — precise, courteous and professional; no slang or contractions.",
  },
  Friendly: {
    description: "Warm, upbeat and approachable",
    guidance: "Friendly — warm, conversational and positive while staying professional.",
  },
  Persuasive: {
    description: "Confident, benefit-led, action-driven",
    guidance: "Persuasive — lead with benefits, build confidence, end with one clear call to action.",
  },
};

const LENGTH_GUIDANCE: Record<EmailLength, string> = {
  Concise: "Concise (~80–120 words, 2 short paragraphs)",
  Standard: "Standard (~150–220 words)",
  Detailed: "Detailed (~250–350 words, includes supporting context and next steps)",
};

export type EmailCategory =
  | "meeting"
  | "followup"
  | "proposal"
  | "request"
  | "apology"
  | "thanks"
  | "introduction"
  | "update"
  | "leave"
  | "general";

export const CATEGORY_LABELS: Record<EmailCategory, string> = {
  meeting: "Meeting request",
  followup: "Follow-up",
  proposal: "Proposal / pitch",
  request: "Request / approval",
  apology: "Apology / issue resolution",
  thanks: "Thank-you note",
  introduction: "Introduction",
  update: "Status update",
  leave: "Leave request",
  general: "General correspondence",
};

const CATEGORY_KEYWORDS: [EmailCategory, RegExp][] = [
  ["leave", /\b(leave|vacation|time off|holiday|pto|sick day)\b/i],
  ["apology", /\b(apolog\w*|sorry|delay(ed)?|mistake|outage|missed)\b/i],
  ["thanks", /\b(thank\w*|appreciat\w*|gratitude)\b/i],
  ["followup", /\b(follow[- ]?up|following up|reminder|checking in)\b/i],
  ["meeting", /\b(meeting|call|catch[- ]?up|sync|workshop|kick-?off)\b/i],
  ["proposal", /\b(proposal|pitch|partnership|offer|quote|pricing|investment)\b/i],
  ["introduction", /\b(introduc\w*|welcome|onboard\w*|new hire|joining)\b/i],
  ["request", /\b(request|approval|approve|access|permission|resources|budget)\b/i],
  ["update", /\b(update|progress|status|report|launch|milestone|results)\b/i],
];

export function detectEmailCategory(subject: string, keyPoints = ""): EmailCategory {
  for (const [cat, re] of CATEGORY_KEYWORDS) if (re.test(subject)) return cat;
  for (const [cat, re] of CATEGORY_KEYWORDS) if (re.test(keyPoints)) return cat;
  return "general";
}

type ToneMap = Record<Tone, string>;
const T = (Formal: string, Friendly: string, Persuasive: string): ToneMap => ({
  Formal,
  Friendly,
  Persuasive,
});

const TEMPLATES: Record<EmailCategory, { subject: ToneMap; context: ToneMap; cta: ToneMap }> = {
  meeting: {
    subject: T("Meeting Request: {S}", "Quick catch-up on {s}?", "30 minutes to move {s} forward"),
    context: T(
      "I am writing to request a meeting to discuss {s}.",
      "I'd love to find some time for us to chat about {s}.",
      "I'd like to set up a short, focused meeting on {s} — a quick conversation now will save us significant time later.",
    ),
    cta: T(
      "Please let me know which dates and times would be convenient for you, and I will arrange the invitation accordingly.",
      "Let me know what times work for you and I'll send over an invite!",
      "Could you share two time slots that suit you this week? I'll prepare a concise agenda so we make every minute count.",
    ),
  },
  followup: {
    subject: T("Follow-Up: {S}", "Just following up on {s}", "Next steps on {s}"),
    context: T(
      "I am writing to follow up on our previous correspondence regarding {s}.",
      "Just circling back on {s} — I wanted to make sure this didn't slip through the cracks.",
      "I'm following up on {s} because we're close to a great outcome, and a quick decision will keep the momentum going.",
    ),
    cta: T(
      "I would be grateful for an update at your earliest convenience.",
      "Whenever you get a moment, let me know where things stand — no rush!",
      "Could you confirm the next step by Friday so we can keep everything on track?",
    ),
  },
  proposal: {
    subject: T("Proposal: {S}", "An idea about {s}", "{S}: a clear opportunity for measurable results"),
    context: T(
      "I am pleased to submit the following proposal regarding {s} for your consideration.",
      "I've been thinking about {s} and wanted to share an idea I'm really excited about.",
      "I'd like to share a proposal on {s} that I'm confident can deliver real, measurable value for your team.",
    ),
    cta: T(
      "I would welcome the opportunity to discuss this proposal further at a time convenient to you.",
      "I'd love to hear what you think — happy to talk it through anytime!",
      "Can we schedule 20 minutes this week to walk through the numbers? I'm confident you'll see the value quickly.",
    ),
  },
  request: {
    subject: T("Request: {S}", "Quick favour — {s}", "Request: {S} (a quick win for the team)"),
    context: T(
      "I am writing to formally request your assistance regarding {s}.",
      "I was hoping you might be able to help me out with {s}.",
      "I'm reaching out with a request regarding {s} — approving this will remove a key blocker and help us deliver faster.",
    ),
    cta: T(
      "I would greatly appreciate your consideration of this request and look forward to your response.",
      "Totally understand if you're busy — any help would be amazing!",
      "Could you approve this by the end of the week? It will keep our timelines intact and the team moving.",
    ),
  },
  apology: {
    subject: T("Regarding {S}", "Sorry about {s}", "Making things right: {s}"),
    context: T(
      "Please accept my sincere apologies regarding {s}.",
      "I wanted to reach out and say sorry about {s} — I really appreciate your patience.",
      "I want to take full ownership of {s} and share exactly how we are resolving it.",
    ),
    cta: T(
      "Thank you for your understanding. Please do not hesitate to contact me should you have any further concerns.",
      "Thanks so much for bearing with me — let me know if there's anything else I can do!",
      "I'd value the chance to walk you through the fix — would a quick call tomorrow work?",
    ),
  },
  thanks: {
    subject: T("Thank You — {S}", "Thank you so much!", "Thank you — and what's next for {s}"),
    context: T(
      "I would like to express my sincere gratitude regarding {s}.",
      "I just wanted to say a huge thank you for {s} — it really made a difference!",
      "Thank you for {s}. Your support has already created real momentum, and I'd love to build on it.",
    ),
    cta: T(
      "Once again, thank you for your support. It is greatly appreciated.",
      "Thanks again — you're a star!",
      "Would you be open to a quick conversation about how we can build on this success together?",
    ),
  },
  introduction: {
    subject: T("Introduction: {S}", "Nice to meet you — {s}", "Introducing {s}: how we can help"),
    context: T(
      "Please allow me to introduce myself in connection with {s}.",
      "I wanted to say hello and introduce myself as part of {s}.",
      "I'm reaching out regarding {s} because I see a strong opportunity for us to work together.",
    ),
    cta: T(
      "I look forward to the opportunity to work with you.",
      "Looking forward to working together — feel free to reach out anytime!",
      "Would you be open to a brief introductory call next week to explore this?",
    ),
  },
  update: {
    subject: T("Update: {S}", "Quick update on {s}", "{S}: progress and what we need next"),
    context: T(
      "I am writing to provide you with an update regarding {s}.",
      "Here's a quick update on how things are going with {s}.",
      "I'm pleased to share an update on {s} — we're making strong progress, and a few decisions now will accelerate results.",
    ),
    cta: T(
      "Please let me know if you require any additional information.",
      "Shout if you have any questions!",
      "Could you review and confirm the next steps by Thursday so we can keep this momentum?",
    ),
  },
  leave: {
    subject: T("Leave Request: {S}", "Time-off request — {s}", "Leave request: {s} (coverage fully planned)"),
    context: T(
      "I am writing to formally request leave in relation to {s}.",
      "I wanted to give you a heads-up and request some time off for {s}.",
      "I'd like to request leave for {s}, and I've already put a coverage plan in place so there's no disruption.",
    ),
    cta: T(
      "I would be grateful if you could confirm your approval at your earliest convenience.",
      "Let me know if that works — happy to adjust if needed!",
      "Could you confirm approval this week so I can finalise the handover with the team?",
    ),
  },
  general: {
    subject: T("{S}", "{S}", "{S}: why it matters"),
    context: T(
      "I am writing to you regarding {s}.",
      "I wanted to reach out about {s}.",
      "I'm reaching out about {s} because I believe it's an opportunity we shouldn't miss.",
    ),
    cta: T(
      "I look forward to hearing from you.",
      "Talk soon!",
      "Can we agree on a next step this week?",
    ),
  },
};

const OPENERS: Record<Tone, string[]> = {
  Formal: [
    "I hope this message finds you well.",
    "I trust this email finds you well.",
    "I hope you are having a productive week.",
  ],
  Friendly: [
    "Hope you're having a great week!",
    "I hope all is well on your end!",
    "Hope your day is off to a good start!",
  ],
  Persuasive: [
    "I know your time is valuable, so I'll get straight to the point.",
    "I'll keep this brief and focused.",
    "Thank you for taking a moment to read this.",
  ],
};

const POINT_INTROS: Record<Tone, string[]> = {
  Formal: [
    "Please find the key points outlined below:",
    "In particular, I would like to highlight the following:",
    "For your reference, the main considerations are as follows:",
  ],
  Friendly: ["Here's a quick rundown:", "Here are the main things:", "A few quick highlights:"],
  Persuasive: [
    "Here's what this means for you:",
    "Here's why this is worth acting on:",
    "The key reasons to move forward:",
  ],
};

const DETAIL_PARAGRAPHS: Record<Tone, [string, string]> = {
  Formal: [
    "Should you require any supporting documentation or further clarification, I would be pleased to provide it.",
    "I propose that we agree on next steps and responsibilities so that this matter can progress in a timely manner.",
  ],
  Friendly: [
    "If it would help, I'm happy to pull together more details or jump on a quick call.",
    "Once we're aligned, I'll put together the next steps so everyone knows what's happening.",
  ],
  Persuasive: [
    "To make this as easy as possible, I can share a one-page summary with timelines, costs and expected impact ahead of our conversation.",
    "Acting now means we stay ahead of the timeline, reduce risk and show early results to stakeholders.",
  ],
};

const SIGNOFFS: Record<Tone, string[]> = {
  Formal: ["Kind regards,", "Yours sincerely,", "Best regards,"],
  Friendly: ["Cheers,", "Thanks so much,", "Warm wishes,"],
  Persuasive: ["Looking forward to your reply,", "Best regards,", "With appreciation,"],
};

function conciseJoin(points: string[], tone: Tone): string {
  const items = points.map((p) => lowerFirst(stripEndPunct(p)));
  const list =
    items.length <= 1
      ? items.join("")
      : `${items.slice(0, -1).join(tone === "Formal" ? "; " : ", ")}${tone === "Formal" ? "; and " : " and "}${items.at(-1)}`;
  const lead = { Formal: "Specifically:", Friendly: "In a nutshell:", Persuasive: "In short:" }[tone];
  return `${lead} ${list}.`;
}

export function generateEmail(input: EmailInput, seed = 0): string {
  const tone = input.tone;
  const category = detectEmailCategory(input.subject, input.keyPoints);
  const tpl = TEMPLATES[category];
  const subjectRaw = stripEndPunct(input.subject.trim()) || "our recent discussion";
  const fill = (s: string) =>
    s.replaceAll("{S}", upperFirst(subjectRaw)).replaceAll("{s}", lowerFirst(subjectRaw));

  const points = splitPoints(input.keyPoints).map((p) => ensurePeriod(upperFirst(p)));
  const name = input.recipient.trim();
  const greeting = tone === "Formal" ? `Dear ${name || "Sir or Madam"},` : `Hi ${firstName(name) || "there"},`;

  const lines: string[] = [`Subject: ${fill(tpl.subject[tone])}`, "", greeting, ""];

  if (input.length === "Concise") {
    const inline = points.length ? ` ${conciseJoin(points.slice(0, 3), tone)}` : "";
    lines.push(`${fill(tpl.context[tone])}${inline}`, "", fill(tpl.cta[tone]));
  } else {
    lines.push(`${pick(OPENERS[tone], seed, 1)} ${fill(tpl.context[tone])}`);
    if (points.length) {
      lines.push("", pick(POINT_INTROS[tone], seed, 2));
      const bullet = tone === "Persuasive" ? "✓" : "•";
      for (const p of points) lines.push(`${bullet} ${p}`);
    }
    if (input.length === "Detailed") {
      const [a, b] = DETAIL_PARAGRAPHS[tone];
      lines.push("", a, "", b);
    }
    lines.push("", fill(tpl.cta[tone]));
  }

  lines.push("", pick(SIGNOFFS[tone], seed, 3), input.sender.trim() || "[Your Name]");
  if (input.senderRole.trim()) lines.push(input.senderRole.trim());
  return lines.join("\n");
}

export function buildEmailPrompt(input: EmailInput): string {
  const points = splitPoints(input.keyPoints);
  const category = detectEmailCategory(input.subject, input.keyPoints);
  return [
    "ROLE: You are an expert business communication assistant.",
    "TASK: Write a clear, professional workplace email.",
    `EMAIL TYPE: ${CATEGORY_LABELS[category]} (auto-detected)`,
    "CONTEXT:",
    `  - Recipient: ${input.recipient.trim() || "[not specified]"}`,
    `  - Sender: ${input.sender.trim() || "[not specified]"}${input.senderRole.trim() ? `, ${input.senderRole.trim()}` : ""}`,
    `  - Purpose / subject: ${input.subject.trim() || "[not specified]"}`,
    "KEY POINTS TO COVER:",
    ...(points.length ? points.map((p, i) => `  ${i + 1}. ${p}`) : ["  (none provided)"]),
    `TONE: ${TONE_DETAILS[input.tone].guidance}`,
    `LENGTH: ${LENGTH_GUIDANCE[input.length]}`,
    "FORMAT: Subject line, greeting, opening, body, one clear call to action, sign-off.",
    "CONSTRAINTS: Do not invent facts, dates or figures that were not provided. Use inclusive, respectful language.",
  ].join("\n");
}

export const EMAIL_EXAMPLES: (Omit<EmailInput, "tone" | "length"> & { label: string })[] = [
  {
    label: "Q3 budget meeting",
    recipient: "Sarah Mitchell",
    sender: "Alex Johnson",
    senderRole: "Operations Manager",
    subject: "Q3 budget review meeting",
    keyPoints:
      "Review Q3 spend against forecast\nAgree priorities for the Q4 marketing budget\nDiscuss the proposed headcount for the support team",
  },
  {
    label: "Project delay",
    recipient: "David Chen",
    sender: "Priya Naidoo",
    senderRole: "Project Lead",
    subject: "Delay to the website launch",
    keyPoints:
      "Launch moves from 14 March to 21 March\nA payment integration issue was found during final testing\nThe fix is in progress and testing resumes on Monday",
  },
  {
    label: "Tool proposal",
    recipient: "Thandi Mokoena",
    sender: "Jordan Lee",
    senderRole: "Team Lead, Customer Success",
    subject: "Proposal to pilot an AI ticket-triage tool",
    keyPoints:
      "Pilot for 6 weeks with the support team\nAim to reduce first-response time\nNo customer data leaves our approved systems\nI will report results at the end of the pilot",
  },
];
