"use client";

import { useEffect } from "react";
import { captureUtmFromUrl } from "@/lib/utm";
import { CartDrawer } from "./CartDrawer";
import { CheckoutModal } from "./CheckoutModal";
import { DeferredPixels } from "./DeferredPixels";
import { UpsellModal } from "./UpsellModal";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    captureUtmFromUrl();
  }, []);

  return (
    <>
      {children}
      <CartDrawer />
      <CheckoutModal />
      <UpsellModal />
      <DeferredPixels />
    </>
  );
}
