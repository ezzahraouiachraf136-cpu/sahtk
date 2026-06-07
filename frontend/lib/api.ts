import { getApiBase } from "./api-base";

const API_BASE = getApiBase();

export interface OrderResponse {
  id: string;
  order_number: string;
  customer_name: string;
  phone_e164: string;
  phone_national: string;
  status: string;
  subtotal_sar: number;
  upsell_total_sar: number;
  total_sar: number;
  currency: string;
  upsell_available: boolean;
  upsell_product_slug?: string | null;
  upsell_product_name_ar?: string | null;
  upsell_price_sar: number;
  items: Array<{
    product_slug: string;
    product_name_ar: string;
    offer_code: string;
    quantity: number;
    line_total_sar: number;
  }>;
}

export interface CreateOrderPayload {
  customer_name: string;
  phone: string;
  items: Array<{ product_slug: string; offer_code: string }>;
  source_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbp?: string;
  fbc?: string;
  lead_event_id?: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const detail = err.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((d: { msg?: string }) => d.msg).join(", ")
          : err.message || "حدث خطأ، حاولي مرة أخرى";
    throw new Error(message);
  }
  return res.json();
}

export function createOrder(payload: CreateOrderPayload) {
  return request<OrderResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function patchUpsell(orderId: string, accept: boolean) {
  return request<OrderResponse>(`/api/orders/${orderId}/upsell`, {
    method: "PATCH",
    body: JSON.stringify({ accept }),
  });
}

export function finalizeOrder(orderId: string, purchaseEventId?: string) {
  return request<OrderResponse>(`/api/orders/${orderId}/finalize`, {
    method: "POST",
    headers: purchaseEventId
      ? { "x-purchase-event-id": purchaseEventId }
      : undefined,
  });
}

export function getOrder(orderId: string) {
  return request<OrderResponse>(`/api/orders/${orderId}`);
}

export function sendCapiEvent(payload: {
  event_id: string;
  event_name: string;
  value?: number;
  currency?: string;
  product_ids?: string[];
  order_id?: string;
  phone?: string;
  name?: string;
  url?: string;
  fbp?: string;
  fbc?: string;
}) {
  return request<{ ok: boolean }>("/api/events", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function sendContact(payload: {
  name: string;
  phone: string;
  message: string;
}) {
  return request<{ ok: boolean }>("/api/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
