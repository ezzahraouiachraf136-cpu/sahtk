import { clearAdminToken, getAdminToken } from "./admin-auth";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

export interface AdminMetrics {
  date_from: string;
  date_to: string;
  page_views: number;
  product_views: number;
  add_to_cart: number;
  checkout_starts: number;
  leads: number;
  purchases: number;
  orders: number;
  revenue_sar: number;
  average_order_value_sar: number;
  conversion_rate_pct: number;
  upsell_acceptance_rate_pct: number;
  top_products: Array<{ name: string; orders: number; revenue_sar: number }>;
  top_utm_sources: Array<{ source: string; orders: number }>;
  daily_orders: Array<{ date: string; orders: number; revenue_sar: number }>;
}

export interface AdminOrderItem {
  product_slug: string;
  product_name_ar: string;
  offer_code: string;
  quantity: number;
  line_total_sar: number;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  customer_name: string;
  phone_e164: string;
  phone_national: string;
  status: string;
  subtotal_sar: number;
  upsell_total_sar: number;
  total_sar: number;
  upsell_accepted: boolean;
  upsell_product_slug: string | null;
  source_url: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  created_at: string;
  items: AdminOrderItem[];
}

async function adminRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });
  if (res.status === 401) {
    clearAdminToken();
    if (typeof window !== "undefined") window.location.href = "/admin/login";
    throw new Error("انتهت الجلسة");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "حدث خطأ");
  }
  return res.json();
}

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.detail === "string" ? err.detail : "اسم المستخدم أو كلمة المرور غير صحيحة"
    );
  }
  return res.json() as Promise<{ token: string }>;
}

export function fetchMetrics(dateFrom: string, dateTo: string) {
  const q = new URLSearchParams({ date_from: dateFrom, date_to: dateTo });
  return adminRequest<AdminMetrics>(`/api/admin/metrics?${q}`);
}

export function fetchOrders(params: {
  dateFrom: string;
  dateTo: string;
  status?: string;
  search?: string;
  page?: number;
}) {
  const q = new URLSearchParams({
    date_from: params.dateFrom,
    date_to: params.dateTo,
    page: String(params.page || 1),
  });
  if (params.status) q.set("status", params.status);
  if (params.search) q.set("search", params.search);
  return adminRequest<{ total: number; page: number; limit: number; orders: AdminOrder[] }>(
    `/api/admin/orders?${q}`
  );
}

export function fetchOrder(id: string) {
  return adminRequest<AdminOrder>(`/api/admin/orders/${id}`);
}

export function updateOrderStatus(id: string, status: string) {
  return adminRequest<AdminOrder>(`/api/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
