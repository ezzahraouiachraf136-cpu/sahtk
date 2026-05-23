import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن",
  description: "قصة نما للجمال — عناية فاخرة لنساء السعودية",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-heading text-3xl font-bold">من نما للجمال</h1>
      <p className="mt-4 text-brand-muted leading-relaxed">
        نما للجمال علامة سعودية راقية للعناية والجمال — نختار لكِ تركيبات مدروسة
        ونقدّمها كأنها من مختبرنا، لأنكِ تستحقين منتجاً يُشبه ثقتكِ بنفسكِ.
      </p>
      <p className="mt-4 text-brand-muted leading-relaxed">
        نعمل مع مركز تسويق معتمد لدى نساء المملكة لضمان أن كل منتج يمر بمراجعة
        الجودة والتجربة قبل أن يصل لبابكِ — مع دفع عند الاستلام وشحن داخل
        السعودية.
      </p>
      <ul className="mt-8 space-y-3">
        <li>✓ الثقة والخصوصية</li>
        <li>✓ الجودة والتغليف الفاخر</li>
        <li>✓ دعم واتساب سريع</li>
      </ul>
    </div>
  );
}
