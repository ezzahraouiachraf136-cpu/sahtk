"use client";

import { getProduct, type OfferCode } from "@/lib/products";
import { trackEvent } from "@/lib/tracking";
import { cn, formatSar } from "@/lib/utils";
import { useCart } from "@/store/cart";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateOffer,
    openCheckout,
    subtotal,
  } = useCart();

  if (!isOpen) return null;

  const total = subtotal();

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={closeCart}
        aria-hidden
      />
      <aside
        className={cn(
          "fixed z-50 flex flex-col bg-white shadow-2xl",
          "inset-y-0 right-0 w-full max-w-md"
        )}
        role="dialog"
        aria-label="السلة"
      >
        <div className="flex items-center justify-between border-b px-4 py-4">
          <h2 className="font-heading text-lg font-bold">سلتكِ</h2>
          <button type="button" onClick={closeCart} className="text-2xl">
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-brand-muted">السلة فارغة</p>
          ) : (
            items.map((item) => {
              const product = getProduct(item.productSlug);
              const upgrade =
                item.offerCode === "single"
                  ? product?.offers.find((o) => o.offerCode === "double")
                  : item.offerCode === "double"
                    ? product?.offers.find((o) => o.offerCode === "triple")
                    : null;

              return (
                <div key={item.productSlug} className="rounded-xl border p-3">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="font-semibold">{item.productNameAr}</p>
                      <p className="text-sm text-brand-muted">{item.offerLabelAr}</p>
                    </div>
                    <p className="font-bold text-brand">{formatSar(item.priceSar)}</p>
                  </div>
                  {upgrade && (
                    <button
                      type="button"
                      className="mt-2 w-full rounded-lg bg-brand-light py-2 text-xs font-semibold text-brand"
                      onClick={() => {
                        updateOffer(item.productSlug, {
                          ...item,
                          offerCode: upgrade.offerCode as OfferCode,
                          offerLabelAr: upgrade.labelAr,
                          quantity: upgrade.quantity,
                          priceSar: upgrade.priceSar,
                          compareAtSar: upgrade.compareAtSar,
                        });
                      }}
                    >
                      وفّري أكثر — ارتقي إلى {upgrade.labelAr}
                    </button>
                  )}
                  <button
                    type="button"
                    className="mt-2 text-xs text-brand-alert"
                    onClick={() => removeItem(item.productSlug)}
                  >
                    إزالة
                  </button>
                </div>
              );
            })
          )}
          <p className="rounded-lg bg-amber-50 p-3 text-sm">
            🔥 عرض قطعتين هو الأكثر طلباً — الدفع عند الاستلام فقط.
          </p>
        </div>
        <div className="border-t p-4">
          <div className="mb-3 flex justify-between font-bold">
            <span>المجموع</span>
            <span className="text-brand">{formatSar(total)}</span>
          </div>
          <button
            type="button"
            disabled={items.length === 0}
            className="w-full rounded-xl bg-brand py-3 font-bold text-white disabled:opacity-50"
            onClick={() => {
              trackEvent("InitiateCheckout", { value: total });
              openCheckout();
            }}
          >
            إتمام الطلب — الدفع عند الاستلام
          </button>
        </div>
      </aside>
    </>
  );
}
