"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { finalizeOrder, patchUpsell, type OrderResponse } from "@/lib/api";
import { UPSELL_TIMEOUT_MS } from "@/lib/products";
import { trackEvent } from "@/lib/tracking";
import { formatSar } from "@/lib/utils";
import { useCart } from "@/store/cart";

const UPSELL_SECONDS = Math.round(UPSELL_TIMEOUT_MS / 1000);

export function UpsellModal() {
  const router = useRouter();
  const { upsellOpen, pendingOrderId, pendingOrder, closeUpsell } = useCart();
  const [seconds, setSeconds] = useState(UPSELL_SECONDS);
  const [busy, setBusy] = useState(false);
  const finishedRef = useRef(false);

  const order = pendingOrder as OrderResponse | null;

  const finish = useCallback(
    async (accept: boolean) => {
      if (!pendingOrderId || busy || finishedRef.current) return;
      finishedRef.current = true;
      setBusy(true);
      try {
        let finalTotal = order?.total_sar ?? 0;
        if (accept) {
          const updated = await patchUpsell(pendingOrderId, true);
          finalTotal = updated.total_sar;
        }
        const purchaseEventId = trackEvent("Purchase", {
          value: finalTotal,
          orderId: pendingOrderId,
          phone: order?.phone_e164,
          name: order?.customer_name,
        });
        const finalized = await finalizeOrder(pendingOrderId, purchaseEventId);
        sessionStorage.setItem("sahtk_last_order", JSON.stringify(finalized));
        closeUpsell();
        router.push(`/thank-you?order=${pendingOrderId}`);
      } catch {
        closeUpsell();
        router.push(`/thank-you?order=${pendingOrderId}`);
      } finally {
        setBusy(false);
      }
    },
    [pendingOrderId, busy, order, closeUpsell, router]
  );

  useEffect(() => {
    if (!upsellOpen) {
      finishedRef.current = false;
      return;
    }
    setSeconds(UPSELL_SECONDS);
    const interval = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    const timeout = setTimeout(() => finish(false), UPSELL_TIMEOUT_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [upsellOpen, pendingOrderId, finish]);

  if (!upsellOpen || !order) return null;

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-black/60" />
      <div className="fixed inset-x-4 top-[15%] z-[71] mx-auto max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
        <p className="text-xs font-semibold text-brand-gold">
          عرض خاص لكِ فقط — {seconds} ث
        </p>
        <h2 className="mt-2 font-heading text-xl font-bold">
          {order.upsell_product_name_ar || "منتج مكمّل"}
        </h2>
        <p className="mt-2 text-2xl font-bold text-brand">
          {formatSar(order.upsell_price_sar)} فقط
        </p>
        <p className="mt-2 text-sm text-brand-muted">
          هذا الخصم يظهر مرة واحدة بعد طلبكِ
        </p>
        <button
          type="button"
          disabled={busy}
          className="mt-6 w-full rounded-xl bg-brand py-3 font-bold text-white"
          onClick={() => finish(true)}
        >
          نعم، أضيفي العرض الخاص
        </button>
        <button
          type="button"
          disabled={busy}
          className="mt-3 w-full text-sm text-brand-muted"
          onClick={() => finish(false)}
        >
          لا شكراً، أكملي
        </button>
      </div>
    </>
  );
}
