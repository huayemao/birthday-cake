"use client";

import { Language, LANGUAGE_NAMES } from "@/types";
import { useState, useEffect, useRef } from "react";

interface LanguageSelectorProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSelector({
  currentLang,
  onLanguageChange,
}: LanguageSelectorProps) {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (lang: Language) => {
    onLanguageChange(lang);
    setIsLangMenuOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
        className="px-4 py-2 rounded-[1rem] text-[10px] font-black uppercase transition-all flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        aria-expanded={isLangMenuOpen}
        aria-haspopup="true"
      >
        {LANGUAGE_NAMES[currentLang]}
        <span className="text-sm">▼</span>
      </button>

      {isLangMenuOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-[1.5rem] overflow-hidden shadow-2xl glass-panel dark:bg-slate-900/90 z-50 border border-white/10">
          {(Object.keys(LANGUAGE_NAMES) as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => handleLanguageSelect(l)}
              className={`w-full text-left px-4 py-3 text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                currentLang === l
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {LANGUAGE_NAMES[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}