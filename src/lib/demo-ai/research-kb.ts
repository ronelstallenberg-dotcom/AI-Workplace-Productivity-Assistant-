export interface TopicBrief {
  id: string;
  label: string;
  keywords: RegExp;
  summary: string[];
  insights: string[]; // "Headline: detail"
  trends: string[];
  risks: string[];
  recommendations: [string, string][];
  sources: string[];
}

export const RESEARCH_KB: TopicBrief[] = [
  {
    id: "hybrid",
    label: "Hybrid & Remote Work",
    keywords: /\b(remote|hybrid|work from home|wfh|distributed|return to office|rto|flexible work)\b/i,
    summary: [
      "Hybrid and remote work have shifted from emergency measures to a permanent operating model for many knowledge-work organisations. Flexibility tends to improve talent attraction, retention and focus time, but it also introduces challenges around collaboration, culture, onboarding and fair performance management. The organisations seeing the best results are deliberate: they define the purpose of in-office time, invest in asynchronous practices and measure outcomes rather than presence.",
      "Flexible work is now a core expectation for many employees, and the debate is moving from 'where people work' to 'how work gets done'. Done well, hybrid models boost autonomy and retention; done poorly, they create proximity bias, meeting overload and weaker connection between teams. Success depends on intentional team agreements, strong digital tooling and outcome-based management.",
    ],
    insights: [
      "Flexibility is a retention lever: Employees consistently rank flexible working among their top reasons for choosing or staying with an employer.",
      "Purpose beats mandates: Office days tied to a clear purpose (planning, onboarding, workshops) see higher attendance and satisfaction than blanket mandates.",
      "Meeting load has grown: Distributed teams often compensate for lost informal contact with more meetings, eroding deep-focus time.",
      "Proximity bias is real: Without safeguards, people who are more visible in the office can receive more recognition and opportunities.",
      "Onboarding is the weak spot: New hires and early-career staff benefit most from in-person mentoring and struggle most in fully remote set-ups.",
      "Async maturity predicts success: Teams that document decisions and share written updates collaborate more effectively across locations and time zones.",
    ],
    trends: [
      "Move from fixed office mandates to team-level working agreements",
      "Growth of asynchronous tools — recorded updates, shared docs and project boards",
      "Office redesign toward collaboration spaces rather than rows of desks",
      "Wider use of outcome-based performance measures",
    ],
    risks: [
      "Proximity bias affecting promotions and fairness",
      "Burnout from an 'always-on' digital presence",
      "Weakened culture and fewer cross-team relationships",
      "Security exposure from home networks and personal devices",
    ],
    recommendations: [
      ["Define team working agreements", "Agree core collaboration hours, expected response times and which activities happen in person."],
      ["Make office time purposeful", "Anchor in-office days around planning, workshops, onboarding and social connection."],
      ["Adopt async-first practices", "Use written updates, decision logs and recorded demos to cut unnecessary meetings."],
      ["Measure outcomes, not presence", "Train managers to assess goals and impact, and review promotions for proximity bias."],
      ["Strengthen onboarding", "Pair new starters with a buddy and schedule structured in-person touchpoints in the first 90 days."],
    ],
    sources: [
      "Microsoft Work Trend Index (annual report)",
      "Gartner research on hybrid work and the future of work",
      "Stanford research on working from home (Nicholas Bloom et al.)",
      "Your internal engagement survey and office-utilisation data",
    ],
  },
  {
    id: "ai",
    label: "AI Adoption in the Workplace",
    keywords: /\b(ai|artificial intelligence|generative|genai|gen ai|chatgpt|copilot|machine learning|llm|automation)\b/i,
    summary: [
      "Generative AI is moving rapidly from experimentation to everyday use in writing, analysis, customer service and software development. Early evidence points to meaningful productivity gains on well-defined tasks — often largest for less experienced staff — but value depends on choosing the right use cases, redesigning workflows and putting strong governance in place. Organisations that pair AI tools with training, clear policies and human review capture value while managing risks such as inaccuracy, data leakage and bias.",
      "AI assistants are becoming part of standard office software, which means adoption is happening with or without a formal strategy. The opportunity is significant — faster drafting, summarising, analysis and support — but so are the risks if outputs are trusted blindly or confidential data is shared with unapproved tools. The winners treat AI as a capability to build: clear use cases, responsible-use policies, upskilling and measurement.",
    ],
    insights: [
      "Task-level gains are real: Studies of drafting, summarising and coding tasks show notable time savings when AI is used as an assistant rather than a replacement.",
      "Skills matter more than tools: Results depend heavily on prompting skill, domain knowledge and knowing when not to trust the output.",
      "Shadow AI is widespread: Many employees already use public AI tools without guidance, creating privacy and compliance exposure.",
      "Workflow redesign unlocks value: The biggest returns come from rethinking end-to-end processes, not bolting AI onto existing steps.",
      "Human oversight is essential: AI can produce confident but incorrect answers ('hallucinations'), so review steps must be built into workflows.",
      "Trust drives adoption: Transparent communication about how AI affects roles reduces anxiety and increases uptake.",
    ],
    trends: [
      "AI assistants embedded directly into office suites and business apps",
      "Rise of AI governance frameworks and regulation (e.g. the EU AI Act)",
      "Shift from scattered pilots to a managed portfolio of use cases with ROI tracking",
      "Growing demand for AI literacy and upskilling programmes",
    ],
    risks: [
      "Inaccurate or fabricated outputs used without verification",
      "Confidential or personal data entered into unapproved tools",
      "Bias and fairness issues in automated decisions",
      "Over-reliance leading to erosion of core skills",
    ],
    recommendations: [
      ["Publish a clear AI usage policy", "Define approved tools, what data may be entered and when human review is mandatory."],
      ["Start with high-value, low-risk use cases", "For example drafting, summarising and internal knowledge search — and measure time saved and quality."],
      ["Invest in AI literacy", "Run practical training on prompting, verifying outputs and responsible use."],
      ["Establish governance", "Create a cross-functional AI group covering legal, security, HR and business owners."],
      ["Track value and risk", "Monitor adoption, productivity impact, error rates and incidents on a simple dashboard."],
    ],
    sources: [
      "McKinsey — The State of AI (annual survey)",
      "Stanford HAI — AI Index Report",
      "NIST AI Risk Management Framework",
      "OECD AI Principles",
    ],
  },
  {
    id: "wellbeing",
    label: "Employee Wellbeing & Burnout",
    keywords: /\b(burnout|burn-out|wellbeing|well-being|wellness|mental health|stress|work-life|engagement|morale)\b/i,
    summary: [
      "Employee wellbeing has become a business issue, not just an HR benefit. Chronic workplace stress and burnout are linked to lower productivity, higher absenteeism and turnover, and weaker customer experience. The root causes are usually structural — unmanageable workload, unclear priorities, lack of control and poor management practices — so the most effective interventions redesign work itself rather than relying only on wellness perks.",
    ],
    insights: [
      "Burnout is organisational: The WHO describes burnout as resulting from chronic workplace stress that has not been successfully managed — pointing to work design, not individual weakness.",
      "Managers are the multiplier: The quality of day-to-day management has an outsized effect on stress, engagement and intention to stay.",
      "Perks alone don't fix it: Wellness apps and events help, but have limited impact if workload and expectations remain unsustainable.",
      "Always-on culture drains energy: After-hours messages and constant notifications reduce recovery time and focus.",
      "Psychological safety matters: Teams where people can raise concerns early catch overload and quality issues sooner.",
      "Early signals are visible: Rising overtime, sick leave and declining survey scores often precede resignations.",
    ],
    trends: [
      "Shift from wellness perks to sustainable work design",
      "Manager training in mental-health awareness and supportive conversations",
      "Right-to-disconnect policies and focus-time norms",
      "Use of pulse surveys and people analytics to spot risk early",
    ],
    risks: [
      "Rising turnover and the cost of replacing experienced staff",
      "Presenteeism — people at work but unable to perform well",
      "Privacy concerns if wellbeing data is collected carelessly",
      "Initiatives perceived as 'wellness-washing' if workload is not addressed",
    ],
    recommendations: [
      ["Audit workload and priorities", "Identify teams with sustained overtime and reset priorities with clear trade-offs."],
      ["Equip managers", "Train managers to hold regular check-ins and recognise early signs of stress."],
      ["Protect recovery time", "Set norms for after-hours communication, meeting-free blocks and leave usage."],
      ["Measure and act", "Run short quarterly pulse surveys and share visible actions taken on the results."],
      ["Make support easy to access", "Promote confidential support services (e.g. an EAP) and reduce stigma through leadership role-modelling."],
    ],
    sources: [
      "World Health Organization — guidance on mental health at work",
      "Gallup — State of the Global Workplace report",
      "Deloitte / Mind and other national mental-health-at-work studies",
      "Your internal absence, overtime and engagement data",
    ],
  },
  {
    id: "cyber",
    label: "Workplace Cybersecurity",
    keywords: /\b(cyber\w*|security|phishing|ransomware|password|data breach|breach|malware|privacy|gdpr|popia|mfa)\b/i,
    summary: [
      "Cybersecurity is now a core operational risk for organisations of every size. Most incidents still begin with people and process weaknesses — phishing, stolen credentials, unpatched systems and misconfigured cloud services — rather than sophisticated technical attacks. A layered approach combining strong identity controls, regular patching, backups, staff awareness and a rehearsed incident-response plan dramatically reduces both the likelihood and impact of an attack.",
    ],
    insights: [
      "People are the front line: Phishing and social engineering remain among the most common initial attack vectors.",
      "Identity is the new perimeter: Multi-factor authentication (MFA) blocks a large share of account-takeover attempts.",
      "Recovery beats prevention alone: Tested, offline or immutable backups are often the difference between a disruption and a crisis.",
      "Speed matters: Organisations that detect and contain incidents quickly typically face much lower total costs.",
      "Third-party risk is growing: Suppliers and software dependencies are increasingly exploited as an entry point.",
      "AI cuts both ways: Attackers use AI to craft convincing phishing, while defenders use it for faster detection.",
    ],
    trends: [
      "Zero-trust architectures and phishing-resistant MFA",
      "Stricter data-protection regulation and breach-reporting obligations",
      "AI-generated phishing and deepfake voice fraud",
      "Board-level accountability for cyber risk",
    ],
    risks: [
      "Ransomware causing operational downtime and data loss",
      "Regulatory penalties and reputational damage after a breach",
      "Business email compromise and payment fraud",
      "Shadow IT and unmanaged devices widening the attack surface",
    ],
    recommendations: [
      ["Enforce MFA everywhere", "Prioritise email, remote access, finance systems and admin accounts."],
      ["Run regular awareness training", "Use short, frequent phishing simulations with friendly, practical feedback."],
      ["Patch and back up", "Automate updates and test restoring from backups at least quarterly."],
      ["Rehearse incident response", "Run a tabletop exercise so leaders know who decides what in the first 24 hours."],
      ["Review supplier access", "Inventory third-party access and apply least-privilege principles."],
    ],
    sources: [
      "Verizon Data Breach Investigations Report (annual)",
      "IBM Cost of a Data Breach Report",
      "NIST Cybersecurity Framework",
      "Your national cybersecurity agency guidance (e.g. CISA, NCSC)",
    ],
  },
  {
    id: "retention",
    label: "Customer Retention & Experience",
    keywords: /\b(customer\w*|churn|retention|loyalty|nps|client satisfaction|cx|customer experience)\b/i,
    summary: [
      "Retaining existing customers is typically far more cost-effective than acquiring new ones, and small improvements in retention can have an outsized effect on profitability. Churn is usually driven by a weak onboarding experience, unresolved service issues, unclear value and better competitor offers. The most effective retention strategies combine proactive customer success, a strong feedback loop and data that flags at-risk accounts early.",
    ],
    insights: [
      "Onboarding sets the trajectory: Customers who reach their first meaningful outcome quickly are far more likely to stay.",
      "Service recovery builds loyalty: A problem resolved quickly and well can increase trust more than no problem at all.",
      "Silent churn is common: Many customers leave without complaining, so declining usage is a more reliable signal than complaints.",
      "Value must be visible: Regular reviews that show outcomes achieved make renewals far easier.",
      "Feedback without action backfires: Surveying customers and not closing the loop can reduce satisfaction.",
      "Segmentation focuses effort: Not all customers need the same level of attention — prioritise by value and risk.",
    ],
    trends: [
      "Health scores combining usage, support and sentiment data",
      "AI-assisted support and proactive outreach",
      "Customer success becoming a revenue-owning function",
      "Personalised experiences across channels",
    ],
    risks: [
      "Over-reliance on discounts to save accounts",
      "Fragmented customer data across teams and tools",
      "Automation that makes it harder to reach a human",
      "Measuring NPS without acting on drivers",
    ],
    recommendations: [
      ["Map the customer journey", "Identify the moments where customers most often get stuck or disengage."],
      ["Build an early-warning score", "Combine usage, support tickets and sentiment to flag at-risk accounts."],
      ["Strengthen onboarding", "Define a clear 'first value' milestone and track time-to-value."],
      ["Close the feedback loop", "Respond to detractors within 48 hours and share 'you said, we did' updates."],
      ["Run value reviews", "Hold quarterly reviews with key accounts that quantify outcomes delivered."],
    ],
    sources: [
      "Bain & Company research on customer loyalty and Net Promoter",
      "Harvard Business Review articles on customer retention",
      "Forrester CX Index",
      "Your CRM, support-ticket and product-usage data",
    ],
  },
  {
    id: "productivity",
    label: "Meetings & Team Productivity",
    keywords: /\b(meeting\w*|productiv\w*|time management|focus|efficien\w*|collaborat\w*|deep work|calendar)\b/i,
    summary: [
      "Knowledge workers spend a large share of their week in meetings, email and chat, leaving limited uninterrupted time for focused work. Fragmented attention and context switching reduce output quality and increase stress. Teams that deliberately design their collaboration — fewer, better meetings, protected focus blocks, clear priorities and asynchronous updates — consistently report higher productivity and engagement.",
    ],
    insights: [
      "Meetings expand to fill calendars: Recurring meetings often outlive their purpose unless they are reviewed regularly.",
      "Context switching is costly: Frequent interruptions can significantly delay the return to deep focus.",
      "Clarity beats effort: Teams with clearly ranked priorities waste less time on low-value work.",
      "Async updates save time: Written status updates can replace many status meetings without losing alignment.",
      "Decisions need owners: Meetings without a decision owner and documented actions frequently need follow-up meetings.",
      "Focus time is a team norm: Individuals struggle to protect focus time unless the whole team respects it.",
    ],
    trends: [
      "Meeting-free days or focus blocks across teams",
      "AI meeting summaries and action-item extraction",
      "OKRs and weekly priority rituals",
      "Shift from status meetings to async dashboards",
    ],
    risks: [
      "Over-collaboration leading to burnout among key contributors",
      "Tool sprawl creating more notifications, not fewer",
      "Productivity metrics that reward activity over outcomes",
      "Reduced connection if all meetings are eliminated",
    ],
    recommendations: [
      ["Audit recurring meetings", "Cancel, shorten or convert to async any meeting without a clear purpose or decision."],
      ["Adopt a meeting standard", "Every meeting needs an agenda, an owner and written actions within 24 hours."],
      ["Protect focus time", "Agree team-wide focus blocks with notifications paused."],
      ["Clarify weekly priorities", "Start each week by agreeing the top three priorities per person."],
      ["Measure outcomes", "Track delivery and quality, not hours online or messages sent."],
    ],
    sources: [
      "Harvard Business Review research on meeting overload",
      "Microsoft Work Trend Index — collaboration and focus data",
      "Atlassian research on workplace productivity",
      "Your team's calendar analytics",
    ],
  },
];

export function findTopicBrief(text: string): TopicBrief | undefined {
  // Score by number of keyword hits so mixed topics pick the strongest match.
  let best: { brief: TopicBrief; score: number } | undefined;
  for (const brief of RESEARCH_KB) {
    const re = new RegExp(brief.keywords.source, "gi");
    const score = text.match(re)?.length ?? 0;
    if (score > 0 && (!best || score > best.score)) best = { brief, score };
  }
  return best?.brief;
}
