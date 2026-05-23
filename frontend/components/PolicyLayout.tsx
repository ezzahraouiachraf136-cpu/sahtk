export function PolicyLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-slate">
      <h1 className="font-heading text-3xl font-bold text-brand-dark">{title}</h1>
      <div className="mt-6 space-y-4 text-brand-muted">{children}</div>
    </article>
  );
}
