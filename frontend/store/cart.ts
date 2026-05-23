"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OfferCode } from "@/lib/products";

export interface CartItem {
  productSlug: string;
  productNameAr: string;
  offerCode: OfferCode;
  offerLabelAr: string;
  quantity: number;
  priceSar: number;
  compareAtSar: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  checkoutOpen: boolean;
  upsellOpen: boolean;
  pendingOrderId: string | null;
  pendingOrder: Record<string, unknown> | null;
  addItem: (item: CartItem) => void;
  updateOffer: (productSlug: string, item: CartItem) => void;
  removeItem: (productSlug: string) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  openUpsell: (orderId: string, order: Record<string, unknown>) => void;
  closeUpsell: () => void;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      checkoutOpen: false,
      upsellOpen: false,
      pendingOrderId: null,
      pendingOrder: null,
      addItem: (item) => {
        const items = get().items.filter((i) => i.productSlug !== item.productSlug);
        set({ items: [...items, item] });
      },
      updateOffer: (productSlug, item) => {
        set({
          items: get().items.map((i) =>
            i.productSlug === productSlug ? item : i
          ),
        });
      },
      removeItem: (productSlug) => {
        set({ items: get().items.filter((i) => i.productSlug !== productSlug) });
      },
      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      openCheckout: () => set({ checkoutOpen: true, isOpen: false }),
      closeCheckout: () => set({ checkoutOpen: false }),
      openUpsell: (orderId, order) =>
        set({ upsellOpen: true, pendingOrderId: orderId, pendingOrder: order }),
      closeUpsell: () => set({ upsellOpen: false }),
      subtotal: () => get().items.reduce((s, i) => s + i.priceSar, 0),
    }),
    { name: "sahtk-cart" }
  )
);
