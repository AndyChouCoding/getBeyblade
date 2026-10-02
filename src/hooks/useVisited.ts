"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// Draw links the viewer has opened, kept in this browser only.
const KEY = "getbeyblade:visited-links";
const EVENT = "getbeyblade:visited-change";

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function write(urls: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(urls));
  } catch {
    // Storage unavailable (private mode, blocked): marks just won't persist
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange); // other tabs
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useVisited() {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  const visited = useMemo(() => {
    try {
      return new Set<string>(JSON.parse(raw));
    } catch {
      return new Set<string>();
    }
  }, [raw]);

  const markVisited = useCallback((url: string) => {
    const current = new Set<string>(JSON.parse(read()));
    if (current.has(url)) return;
    current.add(url);
    write([...current]);
  }, []);

  const clearVisited = useCallback(() => write([]), []);

  return { visited, markVisited, clearVisited };
}
