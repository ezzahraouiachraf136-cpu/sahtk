import testimonials from "@/data/testimonials.json";

export function Testimonials({ productSlug }: { productSlug?: string }) {
  const list = productSlug
    ? testimonials.filter(
        (t) => !t.product_slug || t.product_slug === productSlug
      )
    : testimonials;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {list.map((t) => (
        <blockquote
          key={t.id}
          className="rounded-2xl border border-brand-light bg-white p-5 shadow-sm"
        >
          <p className="text-amber-500">{"★".repeat(t.rating)}</p>
          <p className="mt-2 text-sm text-brand-muted">{t.text}</p>
          <footer className="mt-3 text-sm font-semibold">
            {t.name} — {t.city}
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
