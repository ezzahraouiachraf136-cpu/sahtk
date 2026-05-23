import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
        S
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-heading text-xl font-bold text-brand-dark">
          {process.env.NEXT_PUBLIC_BRAND_NAME_AR || "نما للجمال"}
        </span>
        <span className="font-latin text-[10px] tracking-widest text-brand-muted">
          {process.env.NEXT_PUBLIC_BRAND_NAME_EN || "YOUR HELT"}
        </span>
      </span>
    </Link>
  );
}
