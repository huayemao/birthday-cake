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
        className="px-4 py-1.5 rounded-[0.8rem] text-[10px] font-black uppercase transition-all flex items-center gap-2 bg-pink-500 text-white shadow-lg"
        aria-expanded={isLangMenuOpen}
        aria-haspopup="true"
      >
        {LANGUAGE_NAMES[currentLang]}
        <span className="text-sm">▼</span>
      </button>

      {isLangMenuOpen && (
        <div className="absolute right-0 mt-1 w-40 rounded-[0.8rem] overflow-hidden shadow-xl glass-panel dark:bg-slate-900/80 z-50">
          {(Object.keys(LANGUAGE_NAMES) as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => handleLanguageSelect(l)}
              className={`w-full text-left px-4 py-2 text-[10px] font-black uppercase transition-all ${
                currentLang === l
                  ? "bg-pink-500 text-white"
                  : "text-gray-500 hover:bg-pink-100 dark:hover:bg-slate-800"
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
