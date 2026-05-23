"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendContact } from "@/lib/api";
import { phoneSchema } from "@/lib/phone";

const schema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  phone: phoneSchema,
  message: z.string().min(5, "الرسالة قصيرة جداً"),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await sendContact(data);
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "فشل الإرسال");
    }
  };

  const email =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@sahtk.shop";

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-heading text-3xl font-bold">تحتاجين مساعدة؟ فريق نما قريب منكِ</h1>
      <p className="mt-2 text-brand-muted">ساعات العمل: يومياً 9:00 - 21:00</p>
      <p className="mt-1 text-sm">
        البريد:{" "}
        <a href={`mailto:${email}`} className="text-brand font-semibold">
          {email}
        </a>
      </p>
      {sent ? (
        <p className="mt-8 rounded-xl bg-brand-light p-4 text-brand">
          شكراً، استلمنا رسالتك وسنرد عليك قريباً.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium">الاسم</label>
            <input {...register("name")} className="mt-1 w-full rounded-lg border px-3 py-2" />
            {errors.name && (
              <p className="text-xs text-brand-alert">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">الهاتف</label>
            <input {...register("phone")} className="mt-1 w-full rounded-lg border px-3 py-2" dir="ltr" />
            {errors.phone && (
              <p className="text-xs text-brand-alert">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">الرسالة</label>
            <textarea {...register("message")} rows={4} className="mt-1 w-full rounded-lg border px-3 py-2" />
            {errors.message && (
              <p className="text-xs text-brand-alert">{errors.message.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-brand-alert">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-brand py-3 font-bold text-white"
          >
            إرسال
          </button>
        </form>
      )}
    </div>
  );
}
