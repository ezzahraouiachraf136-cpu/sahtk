"use client";

import type { AdminOrder } from "@/lib/admin-api";

const STATUS_LABELS: Record<string, string> = {
  pending_confirmation: "بانتظار التأكيد",
  confirmed: "مؤكد",
  shipped: "تم الشحن",
  cancelled: "ملغي",
};

const STATUS_COLORS: Record<string, string> = {
  pending_confirmation: "bg-amber-100 text-amber-800",
  confirmed: "bg-emerald-100 text-emerald-800",
  shipped: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

export function OrderPreviewModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: AdminOrder;
  onClose: () => void;
  onStatusChange: (status: string) => void;
}) {
  const date = new Date(order.created_at).toLocaleString("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-l from-brand to-brand-dark p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-white/80">طلب</p>
              <h2 className="font-heading text-2xl font-bold">{order.order_number}</h2>
              <p className="mt-1 text-sm text-white/90">{date}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/20 px-3 py-1 text-sm hover:bg-white/30"
            >
              إغلاق
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-brand-light bg-brand-bg p-4">
              <p className="text-xs text-brand-muted">العميلة</p>
              <p className="mt-1 font-heading text-lg font-bold">{order.customer_name}</p>
              <p className="mt-2 font-latin text-sm" dir="ltr">
                {order.phone_e164}
              </p>
              <p className="text-sm text-brand-muted">{order.phone_national}</p>
            </div>
            <div className="rounded-xl border border-brand-light bg-brand-bg p-4">
              <p className="text-xs text-brand-muted">الإجمالي</p>
              <p className="mt-1 font-heading text-3xl font-bold text-brand">
                {order.total_sar.toFixed(0)} <span className="text-base">ر.س</span>
              </p>
              {order.upsell_accepted && (
                <p className="mt-2 text-sm text-emerald-700">
                  + عرض إضافي {order.upsell_total_sar} ر.س
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="mb-3 font-heading font-bold">المنتجات</p>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-brand-light px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{item.product_name_ar}</p>
                    <p className="text-xs text-brand-muted">
                      {item.offer_code} · الكمية {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-brand">{item.line_total_sar} ر.س</p>
                </div>
              ))}
            </div>
          </div>

          {(order.utm_source || order.source_url) && (
            <div className="rounded-xl border border-dashed border-brand-light p-4 text-sm">
              <p className="font-bold text-brand-muted">المصدر</p>
              {order.utm_source && (
                <p className="mt-1">
                  UTM: {order.utm_source}
                  {order.utm_campaign ? ` / ${order.utm_campaign}` : ""}
                </p>
              )}
              {order.source_url && (
                <p className="mt-1 truncate text-brand-muted" dir="ltr">
                  {order.source_url}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-brand-light pt-4">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${STATUS_COLORS[order.status] || "bg-gray-100"}`}
            >
              {STATUS_LABELS[order.status] || order.status}
            </span>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="rounded-lg border border-brand-light px-3 py-2 text-sm"
            >
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
