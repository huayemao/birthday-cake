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
    },
    href: "/blog",
  },
];

export default function NavBar({ lang }: NavBarProps) {
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center transition-all duration-1000 ease-in-out p-4">
      <Link
        href={`/${lang}`}
        className="text-xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-amber-400 tracking-tight"
      >
        E-Cake & Candles
      </Link>
      <div className="p-2 rounded-[2rem] glass-panel shadow-xl dark:bg-slate-900/60 flex items-center gap-1 border border-white/10">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={`/${lang}${item.href}`}
            className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
          >
            {item.label[lang]}
          </Link>
        ))}
        <LanguageSelector currentLang={lang} onLanguageChange={changeLanguage} />
      </div>
    </nav>
  );
}