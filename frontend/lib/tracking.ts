"use client";

import { v4 as uuidv4 } from "uuid";
import { sendCapiEvent } from "./api";

type EventName =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Lead"
  | "Purchase";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void; page: () => void };
    snaptr?: (...args: unknown[]) => void;
    __sahtkEventQueue?: Array<() => void>;
    __sahtkPixelsReady?: boolean;
  }
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function newEventId(): string {
  return uuidv4();
}

function enqueue(fn: () => void) {
  if (typeof window === "undefined") return;
  if (window.__sahtkPixelsReady) {
    fn();
    return;
  }
  window.__sahtkEventQueue = window.__sahtkEventQueue || [];
  window.__sahtkEventQueue.push(fn);
}

export function flushEventQueue() {
  if (typeof window === "undefined") return;
  window.__sahtkPixelsReady = true;
  (window.__sahtkEventQueue || []).forEach((fn) => fn());
  window.__sahtkEventQueue = [];
}

function trackMeta(eventName: EventName, eventId: string, value?: number) {
  if (!window.fbq) return;
  const params: Record<string, unknown> = { eventID: eventId };
  if (value !== undefined) {
    window.fbq("track", eventName, { value, currency: "SAR" }, params);
  } else {
    window.fbq("track", eventName, {}, params);
  }
}

function trackTikTok(eventName: EventName, eventId: string, value?: number) {
  if (!window.ttq) return;
  const map: Partial<Record<EventName, string>> = {
    ViewContent: "ViewContent",
    AddToCart: "AddToCart",
    InitiateCheckout: "InitiateCheckout",
    Lead: "SubmitForm",
    Purchase: "PlaceAnOrder",
  };
  const tt = map[eventName];
  if (!tt) return;
  window.ttq.track(tt, { value, currency: "SAR", event_id: eventId });
}

function trackSnap(eventName: EventName, eventId: string, value?: number) {
  if (!window.snaptr) return;
  const map: Partial<Record<EventName, string>> = {
    ViewContent: "VIEW_CONTENT",
    AddToCart: "ADD_CART",
    InitiateCheckout: "START_CHECKOUT",
    Lead: "SIGN_UP",
    Purchase: "PURCHASE",
  };
  const snap = map[eventName];
  if (!snap) return;
  window.snaptr("track", snap, {
    price: value,
    currency: "SAR",
    client_dedup_id: eventId,
    transaction_id: eventId,
  });
}

const CAPI_EVENTS: EventName[] = [
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "Lead",
  "Purchase",
];

export function trackEvent(
  eventName: EventName,
  opts: {
    eventId?: string;
    value?: number;
    productIds?: string[];
    orderId?: string;
    phone?: string;
    name?: string;
    sendCapi?: boolean;
  } = {}
) {
  const eventId = opts.eventId || newEventId();
  const value = opts.value;

  enqueue(() => {
    trackMeta(eventName, eventId, value);
    trackTikTok(eventName, eventId, value);
    trackSnap(eventName, eventId, value);
  });

  if (opts.sendCapi !== false && CAPI_EVENTS.includes(eventName)) {
    sendCapiEvent({
      event_id: eventId,
      event_name: eventName,
      value,
      currency: "SAR",
      product_ids: opts.productIds,
      order_id: opts.orderId,
      phone: opts.phone,
      name: opts.name,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      fbp: getCookie("_fbp"),
      fbc: getCookie("_fbc"),
    }).catch(() => undefined);
  }

  return eventId;
}

export function trackPageView() {
  const eventId = newEventId();
  enqueue(() => {
    window.fbq?.("track", "PageView", {}, { eventID: eventId });
    window.ttq?.page();
    window.snaptr?.("track", "PAGE_VIEW");
  });
  return eventId;
}
