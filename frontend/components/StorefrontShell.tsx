"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StoreProvider } from "@/components/StoreProvider";
import { TrustBar } from "@/components/TrustBar";

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <StoreProvider>
      <TrustBar />
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </StoreProvider>
  );
}
