import { describe, expect, it } from "vitest";

import { generateEmail, TONES, type EmailInput } from "@/lib/demo-ai/email";
import { generateResearch } from "@/lib/demo-ai/research";
import { detectIntent, generateChatReply } from "@/lib/demo-ai/chat";

const base: EmailInput = {
  recipient: "Sarah Mitchell",
  sender: "Alex Johnson",
  senderRole: "Operations Manager",
  subject: "Q3 budget review meeting",
  keyPoints: "Review Q3 spend\nAgree Q4 priorities",
  tone: "Formal",
  length: "Standard",
};

describe("Smart Email Generator", () => {
  it("offers exactly the Formal, Friendly and Persuasive tones", () => {
    expect([...TONES]).toEqual(["Formal", "Friendly", "Persuasive"]);
  });

  it("writes a different email for each tone", () => {
    const emails = TONES.map((tone) => generateEmail({ ...base, tone }));
    expect(new Set(emails).size).toBe(3);
    expect(emails[0]).toContain("Dear Sarah Mitchell,");
    expect(emails[1]).toContain("Hi Sarah,");
  });

  it("includes the subject line, key points and sender", () => {
    const email = generateEmail(base);
    expect(email.startsWith("Subject: Meeting Request: Q3 budget review meeting")).toBe(true);
    expect(email).toContain("Review Q3 spend.");
    expect(email).toContain("Alex Johnson");
  });

  it("regenerate produces a different variation", () => {
    expect(generateEmail(base, 0)).not.toBe(generateEmail(base, 1));
  });
});

describe("AI Research Assistant", () => {
  it("produces topic-specific insights and recommendations", () => {
    const out = generateResearch({ mode: "topic", topic: "Hybrid work best practices", article: "", depth: "Overview", audience: "Team" });
    expect(out).toContain("Hybrid & Remote Work");
    expect(out).toContain("## Key Insights");
    expect(out).toContain("## Recommendations");
  });

  it("detailed depth adds a 30-60-90 day roadmap", () => {
    const out = generateResearch({ mode: "topic", topic: "Reducing customer churn", article: "", depth: "Detailed", audience: "Executive" });
    expect(out).toContain("30-60-90 day roadmap");
  });
});

describe("AI Chatbot", () => {
  it("answers an agenda request with an agenda for the named meeting", () => {
    expect(detectIntent("Create an agenda for our quarterly planning meeting")).toBe("agenda");
    expect(generateChatReply("Create an agenda for our quarterly planning meeting")).toContain("quarterly planning meeting");
  });
});
