"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { OrderPreviewModal } from "@/components/admin/OrderPreviewModal";
import {
  type AdminMetrics,
  type AdminOrder,
  fetchMetrics,
  fetchOrder,
  fetchOrders,
  updateOrderStatus,
} from "@/lib/admin-api";
import { clearAdminToken, getAdminToken } from "@/lib/admin-auth";

type Tab = "overview" | "orders" | "funnel";

const STATUS_LABELS: Record<string, string> = {
  pending_confirmation: "بانتظار التأكيد",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  cancelled: "ملغي",
  "": "الكل",
};

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function presetRange(days: number) {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - (days - 1));
  return { from: formatDate(from), to: formatDate(to) };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [dateFrom, setDateFrom] = useState(presetRange(30).from);
  const [dateTo, setDateTo] = useState(presetRange(30).to);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [m, o] = await Promise.all([
        fetchMetrics(dateFrom, dateTo),
        fetchOrders({
          dateFrom,
          dateTo,
          status: statusFilter || undefined,
          search: search || undefined,
        }),
      ]);
      setMetrics(m);
      setOrders(o.orders);
      setOrdersTotal(o.total);
    } catch {
      clearAdminToken();
      router.replace("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, statusFilter, search, router]);

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }
    loadData();
  }, [loadData, router]);

  async function openOrder(id: string) {
    const order = await fetchOrder(id);
    setSelectedOrder(order);
  }

  async function handleStatusChange(status: string) {
    if (!selectedOrder) return;
    const updated = await updateOrderStatus(selectedOrder.id, status);
    setSelectedOrder(updated);
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }

  function logout() {
    clearAdminToken();
    router.replace("/admin/login");
  }

  const metricCards = metrics
    ? [
        { label: "زيارات الصفحة", value: metrics.page_views },
        { label: "مشاهدات المنتج", value: metrics.product_views },
        { label: "إضافة للسلة", value: metrics.add_to_cart },
        { label: "بدء الدفع", value: metrics.checkout_starts },
        { label: "الطلبات", value: metrics.orders },
        { label: "الإيرادات", value: `${metrics.revenue_sar} ر.س` },
        { label: "معدل التحويل", value: `${metrics.conversion_rate_pct}%` },
        { label: "متوسط الطلب", value: `${metrics.average_order_value_sar} ر.س` },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <aside className="fixed inset-y-0 right-0 z-20 hidden w-64 flex-col border-l border-slate-200 bg-white p-6 lg:flex">
        <p className="font-heading text-xl font-bold text-brand">نما للجمال</p>
        <p className="mb-8 text-sm text-slate-500">لوحة التحكم</p>
        <nav className="flex flex-1 flex-col gap-2">
          {(
            [
              ["overview", "نظرة عامة"],
              ["orders", "الطلبات"],
              ["funnel", "قمع التحويل"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-xl px-4 py-3 text-right text-sm font-medium transition ${
                tab === id ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={logout}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          خروج
        </button>
      </aside>

      <main className="lg:mr-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-heading text-xl font-bold lg:hidden">لوحة التحكم</h1>
            <div className="flex flex-wrap items-center gap-2">
              {[
                ["7", 7],
                ["30", 30],
                ["90", 90],
              ].map(([label, days]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    const r = presetRange(days as number);
                    setDateFrom(r.from);
                    setDateTo(r.to);
                  }}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs hover:bg-slate-50"
                >
                  {label} يوم
                </button>
              ))}
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              />
              <span className="text-slate-400">—</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
              />
              <button
                type="button"
                onClick={loadData}
                className="rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white"
              >
                تطبيق
              </button>
            </div>
          </div>
          <div className="mt-3 flex gap-2 lg:hidden">
            {(["overview", "orders", "funnel"] as Tab[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`rounded-lg px-3 py-1 text-xs ${tab === id ? "bg-brand text-white" : "bg-slate-100"}`}
              >
                {id === "overview" ? "عام" : id === "orders" ? "طلبات" : "قمع"}
              </button>
            ))}
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {loading && <p className="text-slate-500">جاري التحميل...</p>}

          {!loading && tab === "overview" && metrics && (
            <div className="space-y-8">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {metricCards.map((card) => (
                  <div
                    key={card.label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <p className="text-sm text-slate-500">{card.label}</p>
                    <p className="mt-2 font-heading text-2xl font-bold text-slate-900">
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="mb-4 font-heading font-bold">أفضل المنتجات</h2>
                  {metrics.top_products.length === 0 ? (
                    <p className="text-sm text-slate-500">لا بيانات بعد</p>
                  ) : (
                    <ul className="space-y-3">
                      {metrics.top_products.map((p) => (
                        <li key={p.name} className="flex justify-between text-sm">
                          <span>{p.name}</span>
                          <span className="font-medium">
                            {p.orders} طلب · {p.revenue_sar} ر.س
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h2 className="mb-4 font-heading font-bold">مصادر الحركة</h2>
                  {metrics.top_utm_sources.length === 0 ? (
                    <p className="text-sm text-slate-500">لا بيانات UTM</p>
                  ) : (
                    <ul className="space-y-3">
                      {metrics.top_utm_sources.map((u) => (
                        <li key={u.source} className="flex justify-between text-sm">
                          <span>{u.source}</span>
                          <span className="font-medium">{u.orders} طلب</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="mb-4 font-heading font-bold">الطلبات اليومية</h2>
                <div className="flex h-40 items-end gap-1">
                  {metrics.daily_orders.map((d) => {
                    const max = Math.max(...metrics.daily_orders.map((x) => x.orders), 1);
                    const h = (d.orders / max) * 100;
                    return (
                      <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t bg-brand/80"
                          style={{ height: `${Math.max(h, 4)}%` }}
                          title={`${d.orders} طلب`}
                        />
                        <span className="text-[10px] text-slate-400">
                          {d.date.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {!loading && tab === "funnel" && metrics && (
            <div className="mx-auto max-w-xl space-y-4">
              {[
                ["زيارات", metrics.page_views],
                ["مشاهدة منتج", metrics.product_views],
                ["إضافة للسلة", metrics.add_to_cart],
                ["بدء الدفع", metrics.checkout_starts],
                ["طلبات", metrics.orders],
              ].map(([label, count], i, arr) => {
                const base = metrics.page_views || 1;
                const pct = Math.round(((count as number) / base) * 100);
                const prev = arr[i - 1]?.[1] as number | undefined;
                const stepPct = prev
                  ? Math.round(((count as number) / prev) * 100)
                  : 100;
                return (
                  <div
                    key={label as string}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{label as string}</span>
                      <span className="font-bold text-brand">{count as number}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {pct}% من الزيارات
                      {i > 0 ? ` · ${stepPct}% من الخطوة السابقة` : ""}
                    </p>
                  </div>
                );
              })}
              <div className="rounded-2xl bg-brand/10 p-5 text-center">
                <p className="text-sm text-brand-muted">معدل التحويل النهائي</p>
                <p className="font-heading text-3xl font-bold text-brand">
                  {metrics.conversion_rate_pct}%
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  قبول العرض الإضافي: {metrics.upsell_acceptance_rate_pct}%
                </p>
              </div>
            </div>
          )}

          {!loading && tab === "orders" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <input
                  type="search"
                  placeholder="بحث بالاسم أو الهاتف أو رقم الطلب..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadData()}
                  className="min-w-[200px] flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                >
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={loadData}
                  className="rounded-xl bg-brand px-4 py-2 text-sm text-white"
                >
                  بحث
                </button>
              </div>

              <p className="text-sm text-slate-500">{ordersTotal} طلب</p>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 text-right">الطلب</th>
                      <th className="px-4 py-3 text-right">العميلة</th>
                      <th className="px-4 py-3 text-right">الهاتف</th>
                      <th className="px-4 py-3 text-right">الإجمالي</th>
                      <th className="px-4 py-3 text-right">الحالة</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium">{order.order_number}</td>
                        <td className="px-4 py-3">{order.customer_name}</td>
                        <td className="px-4 py-3 font-latin" dir="ltr">
                          {order.phone_e164}
                        </td>
                        <td className="px-4 py-3 font-bold text-brand">
                          {order.total_sar} ر.س
                        </td>
                        <td className="px-4 py-3">
                          {STATUS_LABELS[order.status] || order.status}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => openOrder(order.id)}
                            className="rounded-lg bg-brand/10 px-3 py-1 text-xs font-medium text-brand hover:bg-brand/20"
                          >
                            معاينة
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && (
                  <p className="p-8 text-center text-slate-500">لا توجد طلبات في هذه الفترة</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedOrder && (
        <OrderPreviewModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
