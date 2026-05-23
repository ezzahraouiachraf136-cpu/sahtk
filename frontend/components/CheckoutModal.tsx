"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrder } from "@/lib/api";
import { checkoutSchema } from "@/lib/phone";
import { trackEvent } from "@/lib/tracking";
import { getUtmParams } from "@/lib/utm";
import { formatSar } from "@/lib/utils";
import { useCart } from "@/store/cart";
import type { z } from "zod";

type FormData = z.infer<typeof checkoutSchema>;

export function CheckoutModal() {
  const {
    checkoutOpen,
    closeCheckout,
    items,
    subtotal,
    clear,
    openUpsell,
  } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { customerName: "", phone: "" },
  });

  if (!checkoutOpen) return null;

  const total = subtotal();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const leadEventId = trackEvent("Lead", {
        value: total,
        phone: data.phone,
        name: data.customerName,
      });

      const order = await createOrder({
        customer_name: data.customerName,
        phone: data.phone,
        items: items.map((i) => ({
          product_slug: i.productSlug,
          offer_code: i.offerCode,
        })),
        source_url: typeof window !== "undefined" ? window.location.href : undefined,
        lead_event_id: leadEventId,
        ...getUtmParams(),
      });

      clear();
      closeCheckout();
      openUpsell(order.id, order as unknown as Record<string, unknown>);
      sessionStorage.setItem("sahtk_last_order", JSON.stringify(order));
    } catch (e) {
      setError(e instanceof Error ? e.message : "فشل إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50" onClick={closeCheckout} aria-hidden />
      <div className="fixed inset-x-4 top-[10%] z-[61] mx-auto max-w-md rounded-2xl bg-white p-6 shadow-2xl md:inset-x-auto md:left-1/2 md:-translate-x-1/2">
        <h2 className="font-heading text-xl font-bold">إتمام الطلب</h2>
        <p className="mt-1 text-sm text-brand-muted">
          سنؤكد طلبكِ عبر الاتصال خلال 30 دقيقة. الدفع عند الاستلام فقط.
        </p>
        <p className="mt-2 text-xs text-brand-gold">
          ✓ +12,000 عميلة داخل السعودية · ✓ بدون بطاقة بنكية
        </p>
        <ul className="my-4 space-y-1 text-sm">
          {items.map((i) => (
            <li key={i.productSlug} className="flex justify-between">
              <span>
                {i.productNameAr} — {i.offerLabelAr}
              </span>
              <span>{formatSar(i.priceSar)}</span>
            </li>
          ))}
        </ul>
        <p className="mb-4 font-bold text-brand">المجموع: {formatSar(total)}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="text-sm font-medium">الاسم الكامل</label>
            <input
              {...register("customerName")}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="مثال: نورة العتيبي"
            />
            {errors.customerName && (
              <p className="text-xs text-brand-alert">{errors.customerName.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">رقم الجوال (05)</label>
            <input
              {...register("phone")}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="0501234567"
              dir="ltr"
            />
            {errors.phone && (
              <p className="text-xs text-brand-alert">{errors.phone.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-brand-alert">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand py-3 font-bold text-white disabled:opacity-60"
          >
            {loading ? "جاري الإرسال..." : "أكّدي طلبكِ — الدفع عند الاستلام"}
          </button>
        </form>
      </div>
    </>
  );
}
