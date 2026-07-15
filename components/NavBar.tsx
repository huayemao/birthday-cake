"use client";

import Link from "next/link";
import { Language } from "@/types";
import { useState, useEffect, useRef } from "react";
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

export default function NavBar({ lang, configCompleted }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const changeLanguage = (l: Language) => {
    window.location.href = `/${l}`;
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (configCompleted) {
    return null;
  }

  return (
    <nav className="flex justify-between transition-all duration-1000 ease-in-out p-4">
      <div className="right-auto">E-Cake & Candles</div>
      <div className="left-auto shrink-0 p-1.5 rounded-2xl shadow-xl dark:bg-slate-900/50 flex items-center gap-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={`/${lang}${item.href}`}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            {item.label[lang]}
          </Link>
        ))}
                  <LanguageSelector currentLang={lang} onLanguageChange={changeLanguage} />

      </div>

    </nav>
  );
}
