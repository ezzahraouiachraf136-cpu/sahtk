"use client";

const KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export function captureUtmFromUrl() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) sessionStorage.setItem(`sahtk_${k}`, v);
  });
}

export function getUtmParams(): Record<string, string | undefined> {
  if (typeof window === "undefined") return {};
  const out: Record<string, string | undefined> = {};
  KEYS.forEach((k) => {
    out[k] = sessionStorage.getItem(`sahtk_${k}`) || undefined;
  });
  return out;
}
