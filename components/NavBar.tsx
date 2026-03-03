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
      ja: "について",
      fr: "À propos",
      ar: "حول",
      ko: "정보",
    },
    href: "/about",
  },
  {
    key: "guide",
    label: {
      en: "Guide",
      zh: "使用指南",
      ja: "使い方",
      fr: "Guide",
      ar: "دليل",
      ko: "사용 가이드",
    },
    href: "/guide",
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
      <div className="left-auto p-1.5 rounded-2xl shadow-xl dark:bg-slate-900/50 flex items-center gap-2">
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
