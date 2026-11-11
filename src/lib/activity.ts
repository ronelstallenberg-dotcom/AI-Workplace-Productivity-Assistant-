import { useSyncExternalStore } from "react";

export type ToolId = "email" | "research" | "chat";
export interface Activity {
  id: string;
  tool: ToolId;
  title: string;
  at: number;
}

const KEY = "flowmate-activity-v1";
const EMPTY: Activity[] = [];
let cache: Activity[] | null = null;
const listeners = new Set<() => void>();

function read(): Activity[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Activity[];
  } catch {
    cache = [];
  }
  return cache;
}

export function recordActivity(tool: ToolId, title: string) {
  const next = [{ id: crypto.randomUUID(), tool, title, at: Date.now() }, ...read()].slice(0, 100);
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage may be unavailable */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Usage history kept in this browser only (no backend). */
export function useActivity(): Activity[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** Rough minutes saved per task, used for the dashboard estimate. */
export const MINUTES_SAVED: Record<ToolId, number> = { email: 8, research: 25, chat: 3 };
