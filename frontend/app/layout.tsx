import type { Metadata } from "next";
import { Cairo, Inter, Tajawal } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StoreProvider } from "@/components/StoreProvider";
import { TrustBar } from "@/components/TrustBar";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["500", "700", "800"],
  variable: "--font-tajawal",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-cairo",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "نما للجمال | YOUR HELT — عناية فاخرة داخل السعودية",
    template: "%s | نما للجمال",
  },
  description:
    "نما للجمال — منتجات عناية وجمال مختارة لنساء السعودية. دفع عند الاستلام وشحن سريع.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://sahtk.shop"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar-SA"
      dir="rtl"
      className={`${tajawal.variable} ${cairo.variable} ${inter.variable}`}
    >
      <body className="bg-brand-bg font-body text-brand-dark antialiased">
        <StoreProvider>
          <TrustBar />
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
