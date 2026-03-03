"use client";

import React, { ReactNode } from "react";
import { Language, languages } from "@/types";
import { getTranslation } from "@/i18n";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";

interface PageLayoutProps {
  lang: Language;
  title: string;
  children: ReactNode;
  currentPath: string;
}

export default function PageLayout({ lang, title, children, currentPath }: PageLayoutProps) {
  const t = getTranslation(lang);

  const handleLanguageChange = (newLang: Language) => {
    window.location.href = `/${newLang}${currentPath}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* 导航栏 */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="p-1.5 rounded-2xl shadow-xl dark:bg-slate-900/50 flex items-center gap-2">
          <Link
            href={`/${lang}`}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            {t.backToHome || "Back to Home"}
          </Link>
          <Link
            href={`/${lang}/about`}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            {t.aboutTitle || "About"}
          </Link>
          <Link
            href={`/${lang}/guide`}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            {t.guideTitle || "Guide"}
          </Link>
        </div>
      </nav>

      {/* 语言选择器 */}
      <nav className="fixed top-4 right-4 md:top-8 md:right-8 z-20">
        <div className="glass-panel p-1.5 rounded-2xl shadow-xl dark:bg-slate-900/50">
          <LanguageSelector currentLang={lang} onLanguageChange={handleLanguageChange} />
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <article className="rounded-3xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-serif font-black text-white mb-8 text-center">
            {title}
          </h1>

          {children}

          <div className="mt-12 pt-8 border-t border-slate-700">
            <p className="text-center text-slate-400">
              {t.footerText || "Crafted with ❤"}{" "}
              <span className="text-pink-500">{t.author || "huayemao"}</span>
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
