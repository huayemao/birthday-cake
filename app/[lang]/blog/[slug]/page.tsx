import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Language } from "@/types";
import { getTranslation } from "@/i18n";
import PageLayout from "@/components/PageLayout";

interface Params {
  slug: string;
  lang: Language;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, lang } = await params;
  try {
    console.log(`@/content/${lang}/blog/${slug}.mdx`)
    const { metadata } = await import(`@/content/${lang}/blog/${slug}.mdx`);
    return {
      title: (metadata as { title?: string }).title || slug,
      description: (metadata as { description?: string }).description || "",
    };
  } catch (error) {
    console.error(`Error loading blog post: ${slug}`, error);
    notFound();
  }
}

export async function generateStaticParams() {
  const { readdirSync } = await import("fs");
  const { languages } = await import("@/types");
  const params: { slug: string; lang: string }[] = [];

  for (const lang of languages) {
    const blogDir = `content/${lang}/blog`;
    try {
      const files = readdirSync(blogDir).filter((file) => file.endsWith(".mdx"));
      for (const file of files) {
        params.push({
          slug: file.replace(".mdx", ""),
          lang,
        });
      }
    } catch {
      // Language directory doesn't exist
    }
  }

  return params;
}

const Page: React.FC<{ params: Promise<Params> }> = async ({ params }) => {
  const { slug, lang } = await params;
  const t = getTranslation(lang);

  let BlogPost;
  let metadata;
  try {
    const mod = await import(`@/content/${lang}/blog/${slug}.mdx`);
    BlogPost = mod.default;
    metadata = mod.metadata;
  } catch {
    notFound();
  }

  const title = (metadata as { title?: string }).title || slug;
  const currentPath = `/blog/${slug}`;

  return (
    <PageLayout lang={lang} title={title} currentPath={currentPath}>
      <article className="prose prose-lg prose-invert max-w-none">
        <BlogPost />
      </article>
    </PageLayout>
  );
};

export default Page;