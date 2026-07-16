"use client";

import { Language } from "@/types";
import { getTranslation } from "@/i18n";

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  const t = getTranslation(lang);

  return (
    <footer className="py-8 text-center text-sm border-t border-slate-800">
      <p className="text-slate-400">
        <a
          href="https://huayemao.run/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-500 hover:text-pink-400 transition-colors font-medium"
        >
          {t.author || "huayemao"}
        </a>
        <span className="mx-2">·</span>
        <span>{t.footerText || "Crafted with ❤"}</span>
        <span className="mx-2">·</span>
        <span>&copy;{new Date().getFullYear()}</span>
      </p>
      <p className="text-slate-500 text-xs mt-2">
        <a
          href={`mailto:${t.contactEmail || "dev@huayemao.fun"}`}
          className="hover:text-pink-400 transition-colors"
        >
          {t.contactAuthor || "Contact Author"}: {t.contactEmail || "dev@huayemao.fun"}
        </a>
      </p>
    </footer>
  );
}