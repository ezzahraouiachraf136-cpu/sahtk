"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { useCart } from "@/store/cart";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/collections", label: "المجموعة" },
  { href: "/about", label: "من نحن" },
  { href: "/#faq", label: "الأسئلة" },
  { href: "/contact", label: "اتصل بنا" },
];

export function Header() {
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.openCart);
  const count = items.length;

  return (
    <header className="sticky top-0 z-40 border-b border-brand-light bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-brand-dark hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={openCart}
          className="relative rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
          aria-label="فتح السلة"
        >
          السلة
          {count > 0 && (
            <span className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-xs text-brand-dark">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
