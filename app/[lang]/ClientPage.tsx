"use client";

import NavBar from "@/components/NavBar";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import { getTranslation } from "@/i18n";
import { Language } from "@/types";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";

interface ClientPageProps {
  initialLang: Language;
}

export const ClientPage: React.FC<ClientPageProps> = ({ initialLang }) => {
  const { lang, configCompleted, updateState } = useAppStore();
  const [showOverlay, setShowOverlay] = useState(true);
  const router = useRouter();

  useEffect(() => {
    useAppStore.setState({ lang: initialLang });
  }, [initialLang]);

  const t = getTranslation(lang);

  useEffect(() => {
    if (configCompleted) {
      router.push(`/${lang}/scene`);
    }
  }, [configCompleted, lang, router]);

  const handlePersonalize = () => {
    updateState({ configCompleted: true, controlsOpen: true });
  };

  const handleStartNow = () => {
    updateState({ configCompleted: true, controlsOpen: false });
  };

  return (
    <>
      <NavBar lang={lang} configCompleted={false} />
      
      <main className="min-h-screen bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-pink-300/20 blur-[180px] rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-200/20 blur-[180px] rounded-full"></div>
        </div>

        {showOverlay && (
          <WelcomeOverlay
            t={t}
            lang={lang}
            onPersonalize={handlePersonalize}
            onStartNow={handleStartNow}
          />
        )}
      </main>

      <footer className="py-12 text-center text-sm font-black text-gray-400 dark:text-slate-600">
        <a href="https://huayemao.run/" target="_blank" className="hover:text-pink-500 transition-colors">
          {t.author}
        </a> {t.footerText} {' '}
        &copy;{new Date().getFullYear()}
      </footer>
    </>
  );
};