const items = [
  { title: "دفع عند الاستلام", desc: "بدون بطاقة بنكية" },
  { title: "شحن السعودية", desc: "2–5 أيام عمل" },
  { title: "تأكيد هاتفي", desc: "خلال 30 دقيقة" },
  { title: "دعم واتساب", desc: "نساء السعودية" },
];

export function TrustIcons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-xl bg-brand-light p-4 text-center text-sm"
        >
          <p className="font-bold text-brand">{item.title}</p>
          <p className="mt-1 text-brand-muted">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}
