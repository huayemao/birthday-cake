"use client";

import React, { ReactNode } from "react";
import { Language } from "@/types";
import { getTranslation } from "@/i18n";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import Footer from "./Footer";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* 导航栏 */}
      <header className="px-4 py-4 flex items-center justify-between">
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

        <div className="glass-panel p-1.5 rounded-2xl shadow-xl dark:bg-slate-900/50">
          <LanguageSelector currentLang={lang} onLanguageChange={handleLanguageChange} />
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <article className="rounded-3xl p-8 px-4 md:p-12 shadow-2xl">
          <h1 className="text-4xl md:text-5xl font-serif font-black text-white mb-8 text-center">
            {title}
          </h1>

          {children}
        </article>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
