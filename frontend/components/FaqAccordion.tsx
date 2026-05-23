"use client";

import { useState } from "react";
import faq from "@/data/faq.json";

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faq.map((item, i) => (
        <div key={item.question} className="rounded-xl border border-brand-light bg-white">
          <button
            type="button"
            className="flex w-full items-center justify-between p-4 text-right font-semibold"
            onClick={() => setOpen(open === i ? null : i)}
          >
            {item.question}
            <span>{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <p className="border-t px-4 pb-4 text-sm text-brand-muted">{item.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}
