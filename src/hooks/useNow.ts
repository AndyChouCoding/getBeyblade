"use client";

import { useSyncExternalStore } from "react";

const TICK_MS = 30_000;

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, TICK_MS);
  return () => clearInterval(id);
}

// Rounded so consecutive reads within a tick return the same snapshot.
function getSnapshot() {
  return Math.floor(Date.now() / TICK_MS) * TICK_MS;
}

/**
 * Current time, refreshed every 30s.
 * `renderedAt` is the build/render time passed down from the server, used while
 * prerendering and hydrating so the markup matches; the real clock takes over right after.
 */
export function useNow(renderedAt: number) {
  return useSyncExternalStore(subscribe, getSnapshot, () => renderedAt);
}
