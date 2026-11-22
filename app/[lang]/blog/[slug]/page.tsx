import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { isRtlLanguage, Language } from "@/types";
import { getTranslation } from "@/i18n";
import PageLayout from "@/components/PageLayout";
import { buildPageMetadata, CustomOgImage, SITE_URL } from "@/utils/seo";
import { BlogPostMetadata } from "@/utils/blog";
import { getBlogCopy } from "@/utils/blogCopy";

interface Params {
  slug: string;
  lang: Language;
}

function resolvePostImages(
  metadata: BlogPostMetadata,
  fallbackAlt: string
): CustomOgImage[] {
  const urls = Array.from(
    new Set(
      [
        metadata.image,
        ...(Array.isArray(metadata.images) ? metadata.images : []),
      ].filter((u): u is string => Boolean(u))
    )
  );
  return urls.map((url) => ({
    url,
    alt: metadata.imageAlt || fallbackAlt,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, lang } = await params;
  const t = getTranslation(lang);
  try {
    const mod = await import(`@/content/${lang}/blog/${slug}.mdx`);
    const metadata = (mod.metadata || {}) as BlogPostMetadata;
    const title = metadata.title || slug;
    const description = metadata.description || t.description;
    const keywords = metadata.keywords
      ? `${metadata.keywords}, ${t.keywords}`
      : t.keywords;
    const tags = metadata.keywords
      ? metadata.keywords
          .split(/[,，]/)
          .map((item) => item.trim())
          .filter(Boolean)
      : undefined;

    return buildPageMetadata({
      lang,
      subPath: `/blog/${slug}`,
      title,
      description,
      keywords,
      views: ["home", "stage", "celebrate"],
      type: "article",
      customImages: resolvePostImages(metadata, title),
      publishedTime: metadata.date,
      modifiedTime: metadata.updatedAt || metadata.date,
      authors: [metadata.author || t.author || "huayemao"],
      tags,
    });
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
      const files = readdirSync(blogDir).filter((file) =>
        file.endsWith(".mdx")
      );
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
  const copy = getBlogCopy(lang);
  const isRTL = isRtlLanguage(lang);

  let BlogPost;
  let metadata: BlogPostMetadata = {};
  try {
    const mod = await import(`@/content/${lang}/blog/${slug}.mdx`);
    BlogPost = mod.default;
    metadata = (mod.metadata || {}) as BlogPostMetadata;
  } catch {
    notFound();
  }

  const title = metadata.title || slug;
  const currentPath = `/blog/${slug}`;
  const postImages = resolvePostImages(metadata, title).map((img) => img.url);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: metadata.description || "",
    keywords: metadata.keywords || undefined,
    image: postImages.length > 0 ? postImages : undefined,
    datePublished: metadata.date || undefined,
    dateModified: metadata.updatedAt || metadata.date || undefined,
    inLanguage: lang,
    url: `${SITE_URL}/${lang}/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${lang}/blog/${slug}`,
    },
    author: {
      "@type": "Person",
      name: metadata.author || t.author || "huayemao",
      url: "https://huayemao.run/",
    },
    publisher: {
      "@type": "Organization",
      name: t.title,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/apple-touch-icon.png`,
      },
    },
  };

  return (
    <PageLayout lang={lang} title={title} currentPath={currentPath}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400 border-b border-slate-800 pb-4">
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-1.5 text-pink-400 hover:text-pink-300 font-medium transition-colors"
        >
          <span aria-hidden="true">{isRTL ? "→" : "←"}</span>
          <span>{copy.backToBlog}</span>
        </Link>
        {metadata.date && (
          <time
            dateTime={metadata.date}
            className="inline-flex items-center gap-1.5"
          >
            <span aria-hidden="true">📅</span>
            {metadata.date}
          </time>
        )}
      </div>

      <article className="prose prose-lg prose-invert max-w-none">
        <BlogPost />
      </article>

      <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-pink-400 hover:text-pink-300 transition-colors"
        >
          <span aria-hidden="true">{isRTL ? "→" : "←"}</span>
          <span>{copy.backToBlog}</span>
        </Link>
        <Link
          href={`/${lang}/configure`}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:brightness-105 text-white text-sm font-bold shadow-lg shadow-pink-500/20 transition-all"
        >
          {copy.ctaPrimary}
        </Link>
      </div>
    </PageLayout>
  );
};

export default Page;
