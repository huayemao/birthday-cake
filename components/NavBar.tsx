"use client";

import Link from "next/link";
import { Language } from "@/types";
import LanguageSelector from "./LanguageSelector";

interface NavBarProps {
  lang: Language;
  configCompleted: boolean;
}

interface NavItem {
  key: string;
  label: Record<Language, string>;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    key: "about",
    label: {
      en: "About",
      zh: "关于",
      "zh-Hant": "關於",
      ja: "について",
      fr: "À propos",
      ar: "حول",
      ko: "정보",
      es: "Acerca de",
      pt: "Sobre",
      de: "Über",
      it: "Chi siamo",
      ru: "О нас",
      vi: "Về chúng tôi",
    },
    href: "/about",
  },
  {
    key: "guide",
    label: {
      en: "Guide",
      zh: "使用指南",
      "zh-Hant": "使用指南",
      ja: "使い方",
      fr: "Guide",
      ar: "دليل",
      ko: "사용 가이드",
      es: "Guía",
      pt: "Guia",
      de: "Anleitung",
      it: "Guida",
      ru: "Руководство",
      vi: "Hướng dẫn",
    },
    href: "/guide",
  },
  {
    key: "blog",
    label: {
      en: "Blog",
      zh: "博客",
      "zh-Hant": "博客",
      ja: "ブログ",
      fr: "Blog",
      ar: "مدونة",
      ko: "블로그",
      es: "Blog",
      pt: "Blog",
      de: "Blog",
      it: "Blog",
      ru: "Блог",
      vi: "Bài viết",
    },
    href: "/blog",
  },
];

/**
 * 顶部导航栏：悬浮在全屏主页首屏之上，确保主页核心视口严格为 100dvh，
 * 同时保留完整的导航交互与 SEO 链接抓取。
 */
export default function NavBar({ lang, configCompleted }: NavBarProps) {
  const changeLanguage = (l: Language) => {
    window.location.href = `/${l}`;
  };

  if (configCompleted) {
    return null;
  }

  return (
    <nav className="absolute top-0 left-0 right-0 z-40 flex items-center justify-end p-3 sm:p-4 pointer-events-none">
      <div className="pointer-events-auto shrink-0 p-1.5 rounded-2xl shadow-xl bg-slate-900/55 backdrop-blur-md border border-white/10 flex items-center gap-1 sm:gap-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={`/${lang}${item.href}`}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            {item.label[lang]}
          </Link>
        ))}
        <LanguageSelector currentLang={lang} onLanguageChange={changeLanguage} />
      </div>
    </nav>
  );
}
