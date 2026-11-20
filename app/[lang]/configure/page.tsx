import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Language, LANGUAGE_NAMES } from "@/types";
import { getTranslation } from "@/i18n";
import ConfigurePage from "@/components/ConfigurePage";
import { buildPageMetadata } from "@/utils/seo";

interface ConfigureRouteProps {
  params: Promise<{
    lang: Language;
  }>;
}

export const generateStaticParams = async () => {
  return Object.keys(LANGUAGE_NAMES).map((lang) => ({
    lang,
  }));
};

export const generateMetadata = async ({
  params,
}: ConfigureRouteProps): Promise<Metadata> => {
  const { lang } = await params;
  const t = getTranslation(lang);
  return buildPageMetadata({
    lang,
    subPath: "/configure",
    title: `${t.arrangeCake} - ${t.seoTitle}`,
    description: t.description,
    views: ["configure", "home", "stage"],
  });
};

export default async function ConfigureRoute({ params }: ConfigureRouteProps) {
  const { lang } = await params;

  return (
    <Suspense
      fallback={
        <div className="h-[100dvh] w-full bg-slate-950 flex items-center justify-center text-pink-200/70 text-xs tracking-widest uppercase">
          Loading...
        </div>
      }
    >
      <ConfigurePage initialLang={lang} />
    </Suspense>
  );
}
