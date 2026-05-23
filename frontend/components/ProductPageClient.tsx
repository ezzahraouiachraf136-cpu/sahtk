"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { FaqAccordion } from "@/components/FaqAccordion";
import { OfferSelector } from "@/components/OfferSelector";
import { Testimonials } from "@/components/Testimonials";
import { TrustIcons } from "@/components/TrustIcons";
import type { OfferCode, Product } from "@/lib/products";
import { cn, formatSar } from "@/lib/utils";
import { trackEvent } from "@/lib/tracking";

const ACCENT = ["text-brand-gold", "text-brand", "text-rose-700", "text-amber-700"] as const;

function Accent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("font-bold bg-gradient-to-l from-brand-gold via-amber-600 to-brand bg-clip-text text-transparent", className)}>
      {children}
    </span>
  );
}

function ProductImageFrame({
  product,
  label,
  variant = "default",
}: {
  product: Product;
  label: string;
  variant?: "default" | "warm" | "cool";
}) {
  const gradients = {
    default: "from-brand-light via-[#F0E4EA] to-[#E8DFE4]",
    warm: "from-amber-50 via-brand-light to-rose-50",
    cool: "from-slate-50 via-brand-light to-violet-50",
  };

  return (
    <div className="group relative">
      <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-brand-gold/30 via-brand/10 to-transparent opacity-60 blur-2xl transition group-hover:opacity-80" />
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/80 shadow-[0_24px_60px_-12px_rgba(122,62,92,0.25)]",
          "bg-gradient-to-br",
          gradients[variant]
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(201,169,98,0.35),transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-brand-dark/10 to-transparent" />
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-white/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-brand-dark backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
            نما للجمال · السعودية
          </span>
          <p className="font-heading text-xl font-bold text-brand-dark md:text-2xl">{product.nameAr}</p>
          <p className="mt-2 text-sm text-brand-muted">{label}</p>
        </div>
      </div>
    </div>
  );
}

function LuxurySection({
  eyebrow,
  title,
  subtitle,
  reverse,
  image,
  children,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  reverse?: boolean;
  image: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden py-16 md:py-24", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,169,98,0.08),transparent)]" />
      <div
        className={cn(
          "relative mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:gap-16",
          reverse && "md:[&>.luxury-text]:md:col-start-2 md:[&>.luxury-image]:md:col-start-1"
        )}
      >
        {/* النص أولاً في DOM وفي ترتيب القراءة */}
        <div className="luxury-text flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
            {eyebrow}
          </p>
          <h2 className="font-heading text-3xl font-extrabold leading-snug text-brand-dark md:text-4xl lg:text-[2.75rem]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-5 text-lg leading-relaxed text-brand-muted md:text-xl">{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>
        </div>
        <div className="luxury-image">{image}</div>
      </div>
    </section>
  );
}

function StepNumber({ n }: { n: number }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-lg font-bold text-white shadow-lg shadow-brand/25">
      {n}
    </span>
  );
}

export function ProductPageClient({ product }: { product: Product }) {
  const [offerCode, setOfferCode] = useState<OfferCode>(product.defaultOffer);
  const selected = product.offers.find((o) => o.offerCode === offerCode)!;

  useEffect(() => {
    trackEvent("ViewContent", {
      value: selected.priceSar,
      productIds: [product.slug],
    });
  }, [product.slug, selected.priceSar]);

  return (
    <>
      {/* Hero — فخامة أول انطباع */}
      <section className="relative overflow-hidden border-b border-brand-gold/15 bg-gradient-to-b from-white via-brand-bg to-brand-light/30">
        <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-brand/5 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <span className="rounded-full bg-gradient-to-l from-brand-gold/20 to-brand-light px-4 py-1.5 text-xs font-bold text-brand-dark ring-1 ring-brand-gold/30">
              ★ الأكثر مبيعاً في السعودية
            </span>
            <span className="rounded-full bg-brand/10 px-4 py-1.5 text-xs font-semibold text-brand">
              +{product.reviewCount.toLocaleString("ar-SA")} عميلة راضية
            </span>
          </div>

          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div className="order-2 md:order-1">
              <p className="text-base font-semibold text-brand-gold md:text-lg">
                ★ {product.rating} · تقييم استثنائي
              </p>
              <h1 className="mt-3 font-heading text-4xl font-extrabold leading-[1.15] text-brand-dark md:text-5xl lg:text-[3.25rem]">
                {product.heroHeadline}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-brand-muted md:text-xl">
                {product.heroSubheadline}
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-alert/10 px-4 py-2 text-sm font-semibold text-brand-alert md:text-base">
                <span className="animate-pulse">●</span> {product.scarcityText}
              </p>

              <div className="mt-8">
                <OfferSelector
                  offers={product.offers}
                  selected={offerCode}
                  onSelect={setOfferCode}
                />
              </div>
              <AddToCartButton
                product={product}
                offerCode={offerCode}
                className="mt-6 w-full rounded-2xl bg-gradient-to-l from-brand to-brand-dark py-5 text-xl font-bold text-white shadow-xl shadow-brand/30 transition hover:shadow-2xl hover:shadow-brand/40"
              />
              <p className="mt-4 text-center text-sm text-brand-muted md:text-base">
                <Accent>دفع عند الاستلام</Accent> · شحن مجاني داخل المملكة · تأكيد خلال 30 دقيقة
              </p>
            </div>

            <div className="order-1 md:order-2">
              <div className="grid grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "overflow-hidden rounded-2xl border border-white/60 shadow-lg",
                      "bg-gradient-to-br from-brand-light via-white to-[#E8DFE4]",
                      i === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"
                    )}
                  >
                    <div className="flex h-full items-center justify-center p-4">
                      {i === 0 && (
                        <p className="text-center font-heading text-sm font-bold text-brand/70 md:text-base">
                          {product.nameAr}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-brand-gold/10 bg-gradient-to-l from-brand-dark via-brand to-brand-dark py-4">
        <p className="text-center font-heading text-sm font-bold tracking-wide text-white md:text-base">
          نما للجمال — الوجهة الأولى للعناية الفاخرة في السعودية · منتجات مختارة · جودة ملكية
        </p>
      </section>

      <section className="bg-gradient-to-b from-brand-light/50 to-white py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <TrustIcons />
        </div>
      </section>

      {/* الفوائد — نص ثم صورة */}
      <LuxurySection
        eyebrow="لماذا تختارين نما"
        title={
          <>
            فوائد <Accent>استثنائية</Accent> تليق بكِ
          </>
        }
        subtitle="تركيبة مدروسة لنساء السعودية — جودة تُشعرين بها من أول استخدام، بروتين بسيط يناسب مشغولياتكِ اليومية."
        className="bg-white"
        image={
          <ProductImageFrame product={product} label="تجربة فاخرة · نتائج ملموسة" variant="warm" />
        }
      >
        <ul className="space-y-4">
          {product.benefits.map((b, i) => (
            <li
              key={b}
              className="flex gap-4 rounded-2xl border border-brand-gold/15 bg-gradient-to-l from-white to-brand-light/40 p-5 shadow-sm transition hover:border-brand-gold/35 hover:shadow-md"
            >
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-light text-xl font-bold",
                  ACCENT[i % ACCENT.length]
                )}
              >
                ✦
              </span>
              <p className="text-base leading-relaxed text-brand-dark md:text-lg md:leading-loose">
                {b}
              </p>
            </li>
          ))}
        </ul>
      </LuxurySection>

      {/* طريقة الاستخدام */}
      <LuxurySection
        reverse
        eyebrow="روتينكِ اليومي"
        title={
          <>
            ثلاث خطوات نحو <Accent>التميّز</Accent>
          </>
        }
        subtitle="لا تعقيد — لا وقت ضائع. روتين واضح صُمّم لينسجم مع حياتكِ في الرياض، جدة، والدمام."
        className="bg-brand-bg"
        image={
          <ProductImageFrame product={product} label="سهولة · أناقة · نتيجة" variant="cool" />
        }
      >
        <ol className="space-y-5">
          {product.howItWorks.map((step, i) => (
            <li
              key={step}
              className="flex gap-4 rounded-2xl border border-brand/10 bg-white p-5 shadow-sm"
            >
              <StepNumber n={i + 1} />
              <p className="pt-2 text-base leading-relaxed text-brand-dark md:text-lg">{step}</p>
            </li>
          ))}
        </ol>
      </LuxurySection>

      {/* لمن هذا المنتج */}
      <LuxurySection
        eyebrow="صُنع لكِ"
        title={
          <>
            هل أنتِ من <Accent>عميلاتنا المميّزات</Accent>؟
          </>
        }
        subtitle="آلاف السعوديات اخترن نما للجمال — انضمي إلى من يعرفن قيمة العناية الحقيقية."
        className="bg-white"
        image={
          <ProductImageFrame product={product} label="أنتِ تستحقين الأفضل" variant="default" />
        }
      >
        <ul className="grid gap-4">
          {product.forWho.map((w, i) => (
            <li
              key={w}
              className="relative overflow-hidden rounded-2xl border border-brand-light bg-gradient-to-l from-brand-light/80 to-white p-5 pl-6 md:p-6"
            >
              <span
                className={cn(
                  "absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-brand-gold to-brand",
                  i % 2 === 1 && "from-brand to-brand-gold"
                )}
              />
              <p className="text-base font-medium leading-relaxed text-brand-dark md:text-lg">
                <span className={cn("ml-2 font-bold", ACCENT[i % ACCENT.length])}>✓</span> {w}
              </p>
            </li>
          ))}
        </ul>
      </LuxurySection>

      {/* المكوّنات */}
      <LuxurySection
        reverse
        eyebrow="الشفافية والثقة"
        title={
          <>
            مكوّنات <Accent>نخبوية</Accent> بمعايير عالمية
          </>
        }
        subtitle="كل عنصر مُختار بعناية — لأن بشرتكِ وشعركِ يستحقان ما تختارينه بثقة."
        className="bg-gradient-to-b from-brand-bg to-brand-light/30"
        image={
          <ProductImageFrame product={product} label="تركيبة مركّزة · فعالية عالية" variant="warm" />
        }
      >
        <div className="flex flex-wrap gap-3">
          {product.ingredientsHighlight.map((ing, i) => (
            <span
              key={ing}
              className={cn(
                "rounded-2xl px-5 py-3 text-base font-bold shadow-sm md:text-lg",
                i % 3 === 0 && "bg-brand text-white",
                i % 3 === 1 && "bg-brand-gold/20 text-brand-dark ring-1 ring-brand-gold/40",
                i % 3 === 2 && "bg-white text-brand ring-1 ring-brand/20"
              )}
            >
              {ing}
            </span>
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-brand-muted md:text-base">
          منتج عناية وليس بديلاً عن الاستشارة الطبية عند الحاجة — نما للجمال تلتزم بالوضوح
          والأمانة مع كل عميلة.
        </p>
      </LuxurySection>

      {/* عروض الكمية */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-dark via-brand to-brand-dark py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(201,169,98,0.2),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-gold">
            عرض حصري
          </p>
          <h2 className="mt-2 text-center font-heading text-3xl font-extrabold text-white md:text-4xl">
            وفّري أكثر مع عروض الكمية
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-brand-light/90">
            الأكثر طلباً بين عميلاتنا السعوديات — قطعتان بسعر لا يُقاوَم
          </p>
          <div className="mt-10 rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur md:p-8">
            <OfferSelector
              offers={product.offers}
              selected={offerCode}
              onSelect={setOfferCode}
            />
            <p className="mt-6 text-center text-lg text-brand-muted">
              الأكثر طلباً:{" "}
              <span className="font-heading text-2xl font-bold text-brand">{formatSar(279)}</span>
              <span className="text-brand-muted"> لقطعتين</span>
            </p>
            <AddToCartButton
              product={product}
              offerCode={offerCode}
              className="mx-auto mt-6 block w-full max-w-lg rounded-2xl bg-gradient-to-l from-brand-gold to-amber-600 py-5 text-xl font-bold text-brand-dark shadow-xl transition hover:brightness-110"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-sm font-semibold text-brand-gold">آراء حقيقية</p>
          <h2 className="mt-2 mb-10 text-center font-heading text-3xl font-extrabold text-brand-dark md:text-4xl">
            عميلاتنا <Accent>يتحدثن عن التجربة</Accent>
          </h2>
          <Testimonials productSlug={product.slug} />
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 pb-28 md:pb-24">
        <h2 className="mb-8 text-center font-heading text-2xl font-bold text-brand-dark md:text-3xl">
          أسئلة شائعة
        </h2>
        <FaqAccordion />
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-brand-gold/20 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
        <AddToCartButton
          product={product}
          offerCode={offerCode}
          className="w-full rounded-xl bg-gradient-to-l from-brand to-brand-dark py-3.5 font-bold text-white"
          label={`أضيفي بـ ${formatSar(selected.priceSar)}`}
        />
      </div>
    </>
  );
}
