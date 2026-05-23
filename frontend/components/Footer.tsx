import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const wa = waNumber ? `https://wa.me/${waNumber.replace(/\D/g, "")}` : null;
  const email =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@sahtk.shop";

  return (
    <footer className="mt-16 border-t border-brand-light bg-brand-dark text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-slate-300">
            نما للجمال — عناية فاخرة لنساء السعودية. دفع عند الاستلام وتأكيد
            عبر الهاتف.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-heading font-bold">المتجر</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <Link href="/" className="hover:text-white">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link href="/collections" className="hover:text-white">
                المجموعة
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-heading font-bold">الشركة</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <Link href="/about" className="hover:text-white">
                من نحن
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                اتصل بنا
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-heading font-bold">السياسات</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>
              <Link href="/privacy-policy" className="hover:text-white">
                الخصوصية
              </Link>
            </li>
            <li>
              <Link href="/shipping-policy" className="hover:text-white">
                الشحن
              </Link>
            </li>
            <li>
              <Link href="/return-policy" className="hover:text-white">
                الاسترجاع
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white">
                الشروط
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-700 px-4 py-6 text-center text-xs text-slate-400">
        <p>© 2026 نما للجمال — YOUR HELT</p>
        {wa && (
          <a href={wa} className="mt-2 inline-block text-brand-gold hover:underline">
            واتساب الدعم
          </a>
        )}
        <p className="mt-2">
          <a href={`mailto:${email}`} className="hover:underline">
            {email}
          </a>
        </p>
        <p className="mt-4 max-w-2xl mx-auto">
          منتجات نما للجمال للعناية والجمال وليست بديلاً عن الاستشارة الطبية.
        </p>
      </div>
    </footer>
  );
}
