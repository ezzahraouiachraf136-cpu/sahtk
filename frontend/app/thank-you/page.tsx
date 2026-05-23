import { Suspense } from "react";
import ThankYouContent from "./ThankYouContent";

export default function ThankYouPage() {
  return (
    <Suspense fallback={<p className="p-12 text-center">جاري التحميل...</p>}>
      <ThankYouContent />
    </Suspense>
  );
}
