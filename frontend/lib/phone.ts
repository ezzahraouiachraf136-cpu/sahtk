import { z } from "zod";

const SAUDI_MOBILE = /^966(5[013456789][0-9]{7})$/;

export function normalizeSaudiPhone(raw: string): string {
  let d = raw.replace(/[\s\-().]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0") && d.length === 10) d = "966" + d.slice(1);
  if (d.startsWith("5") && d.length === 9) d = "966" + d;
  return d;
}

export const phoneSchema = z
  .string()
  .min(1, "رقم الجوال مطلوب")
  .transform(normalizeSaudiPhone)
  .refine((v) => SAUDI_MOBILE.test(v), {
    message: "أدخل رقم جوال سعودي صحيح يبدأ بـ 05",
  });

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, "الاسم مطلوب (حرفان على الأقل)")
    .refine((v) => !/^\d+$/.test(v.trim()), "الاسم غير صالح"),
  phone: phoneSchema,
});
