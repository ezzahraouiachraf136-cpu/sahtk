"use client";

import { useEffect } from "react";
import { flushEventQueue, trackPageView } from "@/lib/tracking";

function loadScript(src: string, id?: string) {
  if (id && document.getElementById(id)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  if (id) s.id = id;
  document.head.appendChild(s);
}

function initMeta(pixelId: string) {
  const w = window as Window & {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
  };
  if (w.fbq) return;
  const q: unknown[][] = [];
  const fbq = (...args: unknown[]) => {
    q.push(args);
  };
  (fbq as unknown as { queue: unknown[][] }).queue = q;
  w.fbq = fbq;
  w._fbq = fbq;
  loadScript("https://connect.facebook.net/en_US/fbevents.js");
  w.fbq("init", pixelId);
}

function initTikTok(pixelId: string) {
  const w = window as Window & {
    ttq?: {
      page: () => void;
      track: (...args: unknown[]) => void;
      push: (args: unknown) => void;
    };
  };
  if (w.ttq) return;
  const ttq = {
    _i: [] as unknown[],
    push(args: unknown) {
      (this._i as unknown[]).push(args);
    },
    page() {
      this.push("page");
    },
    track(...args: unknown[]) {
      this.push(["track", ...args]);
    },
  };
  w.ttq = ttq;
  loadScript(
    `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${pixelId}`,
    "tiktok-pixel"
  );
  ttq.push(["init", pixelId]);
}

function initSnap(pixelId: string) {
  const w = window as Window & { snaptr?: (...args: unknown[]) => void };
  if (w.snaptr) return;
  const snaptr = (...args: unknown[]) => {
    ((snaptr as unknown as { queue: unknown[][] }).queue =
      (snaptr as unknown as { queue?: unknown[][] }).queue || []).push(args);
  };
  w.snaptr = snaptr;
  loadScript("https://sc-static.net/scevent.min.js", "snap-pixel");
  w.snaptr("init", pixelId);
}

export function DeferredPixels() {
  useEffect(() => {
    const meta = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const tiktok = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
    const snap = process.env.NEXT_PUBLIC_SNAP_PIXEL_ID;
    if (!meta && !tiktok && !snap) return;

    const run = () => {
      if (meta) initMeta(meta);
      if (tiktok) initTikTok(tiktok);
      if (snap) initSnap(snap);
      flushEventQueue();
      trackPageView();
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(run, 2500);
    return () => clearTimeout(t);
  }, []);

  return null;
}
