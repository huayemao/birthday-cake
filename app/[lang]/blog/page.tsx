import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { isRtlLanguage, Language, languages } from "../../../types";
import { getTranslation } from "@/i18n";
import PageLayout from "../../../components/PageLayout";
import { buildPageMetadata, SITE_URL } from "@/utils/seo";
import { getBlogPosts } from "@/utils/blog";
import { getBlogCopy } from "@/utils/blogCopy";

interface PageProps {
  params: Promise<{
    lang: Language;
  }>;
}

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslation(lang);
  const copy = getBlogCopy(lang);
  const posts = await getBlogPosts(lang, 3);
  const coverImages = posts
    .filter((post) => Boolean(post.image))
    .map((post) => ({
      url: post.image!,
      alt: post.imageAlt || post.title,
    }));

  return buildPageMetadata({
    lang,
    subPath: "/blog",
    title: `${t.blogTitle || "Blog"} - ${copy.seoTitleSuffix} | ${t.seoTitle}`,
    description: copy.seoDescription,
    keywords: `${copy.seoKeywords}, ${t.keywords}`,
    views: ["home", "stage", "celebrate"],
    customImages: coverImages,
  });
}

const Page: React.FC<PageProps> = async ({ params }) => {
  const { lang } = await params;
  const t = getTranslation(lang);
  const copy = getBlogCopy(lang);
  const posts = await getBlogPosts(lang);
  const currentPath = `/blog`;
  const isRTL = isRtlLanguage(lang);

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${t.blogTitle || "Blog"} - ${t.title}`,
    description: copy.seoDescription,
    keywords: copy.seoKeywords,
    url: `${SITE_URL}/${lang}/blog`,
    inLanguage: lang,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      keywords: post.keywords || undefined,
      image: post.images && post.images.length > 0 ? post.images : post.image || undefined,
      datePublished: post.date || undefined,
      dateModified: post.updatedAt || post.date || undefined,
      url: `${SITE_URL}/${lang}/blog/${post.slug}`,
      inLanguage: lang,
    })),
  };

  return (
    <PageLayout
      lang={lang}
      title={t.blogTitle || "Blog"}
      currentPath={currentPath}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      {/* SEO 引导文案与专题概览 */}
      <section className="mb-12 space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-pink-300 bg-pink-500/10 border border-pink-500/20">
            {copy.introSubtitle}
          </p>
          <p className="text-slate-200 text-base md:text-lg leading-relaxed">
            {copy.introParagraph1}
          </p>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            {copy.introParagraph2}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {copy.topics.map((topic, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-slate-800/25 border border-slate-700/40"
            >
              <h2 className="text-sm font-bold text-pink-300 mb-1.5">
                {topic.title}
              </h2>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 博客文章列表 */}
      <section aria-label={copy.latestHeading} className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-white">
            {copy.latestHeading}
          </h2>
          <span className="text-xs text-slate-400">{posts.length}</span>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">{copy.noPosts}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/${lang}/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row gap-5 p-6 bg-slate-800/30 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 border border-slate-700/50 hover:border-pink-500/30"
              >
                {post.image && (
                  <div className="sm:w-48 md:w-56 shrink-0 overflow-hidden rounded-xl bg-slate-900/60 border border-white/10">
                    <img
                      src={post.image}
                      alt={post.imageAlt || post.title}
                      loading="lazy"
                      className="w-full h-40 sm:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                      {post.title}
                    </h3>
                    {post.date && (
                      <time
                        dateTime={post.date}
                        className="text-slate-400 text-sm mb-3 flex items-center gap-2"
                      >
                        <span className="text-pink-500" aria-hidden="true">
                          📅
                        </span>
                        {post.date}
                      </time>
                    )}
                    <p className="text-slate-300 leading-relaxed">
                      {post.description}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center text-pink-400 text-sm font-medium">
                    <span>{copy.readMore}</span>
                    <span
                      aria-hidden="true"
                      className={`${
                        isRTL
                          ? "mr-1 group-hover:-translate-x-1"
                          : "ml-1 group-hover:translate-x-1"
                      } transition-transform`}
                    >
                      {isRTL ? "←" : "→"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 底部行动引导与内链 */}
      <section className="mt-14 p-6 md:p-8 rounded-3xl bg-gradient-to-br from-pink-500/10 via-slate-800/40 to-amber-500/10 border border-pink-500/20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-white">
          {copy.ctaTitle}
        </h2>
        <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          {copy.ctaDescription}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href={`/${lang}/configure`}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:brightness-105 text-white text-sm font-bold shadow-lg shadow-pink-500/20 transition-all"
          >
            {copy.ctaPrimary}
          </Link>
          <Link
            href={`/${lang}/guide`}
            className="px-6 py-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/15 text-slate-200 hover:text-white text-sm font-semibold transition-all"
          >
            {copy.ctaSecondary}
          </Link>
        </div>
      </section>
    </PageLayout>
  );
};

export default Page;
