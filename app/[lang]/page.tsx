import React from "react";
import type { Metadata } from "next";
import { Language, LANGUAGE_NAMES } from "../../types";
import { ClientPage } from "./ClientPage";
import { buildPageMetadata, buildWebAppJsonLd } from "@/utils/seo";

interface PageProps {
  params: Promise<{
    lang: Language;
  }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { lang } = await params;
  return buildPageMetadata({
    lang,
    views: ["home", "stage", "celebrate", "configure"],
  });
};

const Page: React.FC<PageProps> = async ({ params }) => {
  const { lang } = await params;
  const jsonLd = buildWebAppJsonLd(lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientPage initialLang={lang} />
    </>
  );
};

export const generateStaticParams = async () => {
  return Object.keys(LANGUAGE_NAMES).map((lang) => ({
    lang,
  }));
};

export default Page;
