import { getApiBase } from "./api-base";
import { getUtmParams } from "./utm";

const API_BASE = getApiBase();

const SESSION_KEY = "sahtk_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function trackAnalyticsEvent(payload: {
  event_name: string;
  product_slug?: string;
  value?: number;
  order_id?: string;
}) {
  const utm = getUtmParams();
  fetch(`${API_BASE}/api/analytics/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      page_url: window.location.href,
      session_id: getSessionId(),
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
    }),
    keepalive: true,
  }).catch(() => undefined);
}
