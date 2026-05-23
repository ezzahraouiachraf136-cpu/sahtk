import { PolicyLayout } from "@/components/PolicyLayout";

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="سياسة الخصوصية">
      <p>
        نجمع الاسم ورقم الهاتف عند الطلب أو التواصل لمعالجة طلبك وتأكيده. لا
        نبيع بياناتك لأطراف ثالثة.
      </p>
      <p>
        قد نستخدم أدوات تحليل وإعلانات (Meta، TikTok، Snapchat) مع معرفات
        تقنية مثل cookies وفق سياسات المنصات.
      </p>
      <p>لطلب حذف بياناتك تواصل معنا على support@sahtk.shop.</p>
    </PolicyLayout>
  );
}
