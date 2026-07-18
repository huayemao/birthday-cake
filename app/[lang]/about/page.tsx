import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Language } from "@/types";
import { getTranslation } from "@/i18n";
import PageLayout from "@/components/PageLayout";

interface Params {
  lang: Language;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang } = await params;
  try {
    const { metadata } = await import(`@/content/${lang}/about.mdx`);
    return {
      title: (metadata as { title?: string }).title || "About",
      description: (metadata as { description?: string }).description || "",
    };
  } catch (error) {
    console.error(`Error loading about page: ${lang}`, error);
    return {
      title: "About",
      description: "",
    };
  }
}

export async function generateStaticParams() {
  const { languages } = await import("@/types");
  return languages.map((lang) => ({ lang }));
}

const Page: React.FC<{ params: Promise<Params> }> = async ({ params }) => {
  const { lang } = await params;
  const t = getTranslation(lang);

  let AboutContent;
  let metadata;
  try {
    const mod = await import(`@/content/${lang}/about.mdx`);
    AboutContent = mod.default;
    metadata = mod.metadata;
  } catch {
    notFound();
  }

  const title = (metadata as { title?: string }).title || t.aboutTitle || "About";
  const currentPath = `/about`;

  return (
    <PageLayout lang={lang} title={title} currentPath={currentPath}>
      <article className="prose prose-lg prose-invert max-w-none">
        <AboutContent />
      </article>
    </PageLayout>
  );
};

export default Page;
