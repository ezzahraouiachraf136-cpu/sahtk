import Link from "next/link";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ProductCard } from "@/components/ProductCard";
import { Testimonials } from "@/components/Testimonials";
import { TrustIcons } from "@/components/TrustIcons";
import home from "@/data/home-sections.json";
import { PRODUCTS } from "@/lib/products";

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-light to-brand-bg">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2">
          <div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-brand-dark md:text-5xl">
              {home.hero.headline}
            </h1>
            <p className="mt-4 text-lg text-brand-muted">{home.hero.subheadline}</p>
            <Link
              href={home.hero.cta_href}
              className="mt-6 inline-block rounded-xl bg-brand px-8 py-3 font-bold text-white hover:bg-brand-dark"
            >
              {home.hero.cta_text}
            </Link>
            <ul className="mt-6 grid grid-cols-2 gap-2 text-sm">
              {home.trust_bar.map((t) => (
                <li key={t.text}>✓ {t.text}</li>
              ))}
            </ul>
          </div>
          <div className="aspect-square rounded-3xl bg-gradient-to-br from-brand-light to-[#E8DFE4] shadow-inner" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-heading text-2xl font-bold">لماذا نما للجمال؟</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {home.why_nama.map((w) => (
            <div key={w.title} className="rounded-2xl border bg-white p-6">
              <h3 className="font-heading font-bold text-brand">{w.title}</h3>
              <p className="mt-2 text-sm text-brand-muted">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center font-heading text-2xl font-bold">
            مجموعتنا المختارة
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-heading text-2xl font-bold text-center mb-8">
          {home.authority.title}
        </h2>
        <p className="mx-auto max-w-2xl text-center text-brand-muted">
          {home.authority.body}
        </p>
      </section>

      <section className="bg-brand-light/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <TrustIcons />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center font-heading text-2xl font-bold">
            تجارب عميلاتنا
          </h2>
          <Testimonials />
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-2xl px-4 pb-24">
        <h2 className="mb-6 text-center font-heading text-2xl font-bold">
          أسئلة شائعة
        </h2>
        <FaqAccordion />
      </section>
    </>
  );
}
