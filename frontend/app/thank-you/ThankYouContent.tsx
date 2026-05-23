"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getOrder, type OrderResponse } from "@/lib/api";
import { formatSar } from "@/lib/utils";

export default function ThankYouContent() {
  const params = useSearchParams();
  const orderId = params.get("order");
  const [order, setOrder] = useState<OrderResponse | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem("sahtk_last_order");
    if (cached) {
      try {
        setOrder(JSON.parse(cached));
      } catch {
        /* ignore */
      }
    }
    if (orderId) {
      getOrder(orderId)
        .then(setOrder)
        .catch(() => undefined);
    }
  }, [orderId]);

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const waHref = waNumber
    ? `https://wa.me/${waNumber.replace(/\D/g, "")}`
    : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-3xl text-brand">
        ✓
      </div>
      <h1 className="font-heading text-3xl font-bold">
        تم استلام طلبكِ يا جميلة 🤍
      </h1>
      <p className="mt-4 text-brand-muted">
        سيتصل بكِ فريق نما للجمال لتأكيد العنوان. التوصيل المتوقع: 2–5 أيام عمل
        داخل السعودية.
      </p>
      {order && (
        <div className="mt-8 rounded-2xl border border-brand-light bg-white p-6 text-right text-sm">
          <p>
            <span className="text-brand-muted">رقم الطلب:</span>{" "}
            <strong>{order.order_number}</strong>
          </p>
          <p className="mt-2">
            <span className="text-brand-muted">المجموع:</span>{" "}
            <strong className="text-brand">{formatSar(order.total_sar)}</strong>
          </p>
          <ul className="mt-4 space-y-1 border-t pt-4">
            {order.items.map((i) => (
              <li key={`${i.product_slug}-${i.offer_code}`}>
                {i.product_name_ar} — {formatSar(i.line_total_sar)}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-brand-muted">
            الدفع عند الاستلام عند استلام الطرد.
          </p>
        </div>
      )}
      {waHref && (
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-xl bg-green-600 px-6 py-3 font-bold text-white"
        >
          تواصلي عبر واتساب
        </a>
      )}
      <Link href="/collections" className="mt-4 block font-semibold text-brand">
        متابعة التسوق
      </Link>
    </div>
  );
}
