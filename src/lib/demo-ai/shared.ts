/** Deterministic helpers for the simulated (frontend-only) AI engine. */

export function pick<T>(arr: readonly T[], seed: number, salt = 0): T {
  const n = arr.length;
  const i = ((((seed + salt) * 7 + seed * salt) % n) + n) % n;
  return arr[i] as T;
}

export function rotate<T>(arr: readonly T[], seed: number): T[] {
  const n = arr.length;
  if (!n) return [];
  const s = ((seed % n) + n) % n;
  return [...arr.slice(s), ...arr.slice(0, s)];
}

export function lowerFirst(s: string): string {
  if (!s) return s;
  // Keep acronyms / proper nouns like "Q3" or "AI" intact.
  if (s.length > 1 && /[A-Z0-9]/.test(s.charAt(1))) return s;
  return s.charAt(0).toLowerCase() + s.slice(1);
}

export function upperFirst(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export function stripEndPunct(s: string): string {
  return s.replace(/[.!?;,:\s]+$/, "");
}

export function ensurePeriod(s: string): string {
  const t = s.trim();
  if (!t) return t;
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

export function splitPoints(text: string): string[] {
  return text
    .split(/\n+/)
    .map((l) => l.replace(/^\s*(?:[-*•✓]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

export function firstName(full: string): string {
  return full.trim().split(/\s+/)[0] ?? "";
}

export function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

export function truncate(s: string, n: number): string {
  const t = s.trim().replace(/\s+/g, " ");
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}
