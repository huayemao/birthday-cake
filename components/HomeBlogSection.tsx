import React from "react";
import Link from "next/link";
import { isRtlLanguage, Language } from "@/types";
import { BlogPost } from "@/utils/blog";
import { getBlogCopy } from "@/utils/blogCopy";
import { SITE_URL } from "@/utils/seo";

interface HomeBlogSectionProps {
  lang: Language;
  posts: BlogPost[];
}

/**
 * 首页最新博客文章模块：取前 5 篇博客文章展示在首页，完善站点内链并输出结构化数据。
 */
const HomeBlogSection: React.FC<HomeBlogSectionProps> = ({ lang, posts }) => {
  const topPosts = posts.slice(0, 5);
  if (topPosts.length === 0) {
    return null;
  }

  const copy = getBlogCopy(lang);
  const isRTL = isRtlLanguage(lang);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: copy.homeSectionTitle,
    itemListElement: topPosts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/${lang}/blog/${post.slug}`,
      name: post.title,
      image: post.image || undefined,
    })),
  };

  return (
    <section
      aria-label={copy.homeSectionTitle}
      className="relative w-full px-4 sm:px-8 py-14 md:py-20 border-t border-white/5"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-black text-white mb-3">
            {copy.homeSectionTitle}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-amber-400 rounded-full mx-auto mb-4" />
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            {copy.homeSectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topPosts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/${lang}/blog/${post.slug}`}
              className={`group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-slate-900/45 backdrop-blur-sm hover:bg-slate-900/75 hover:border-pink-400/40 transition-all duration-300 ${
                topPosts.length % 2 === 1 && index === 0 ? "md:col-span-2" : ""
              }`}
            >
              <div>
                {post.image && (
                  <div className="w-full h-44 overflow-hidden bg-slate-950/60 border-b border-white/5">
                    <img
                      src={post.image}
                      alt={post.imageAlt || post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 pb-4">
                  {post.date && (
                    <time
                      dateTime={post.date}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-pink-300/90 mb-2.5"
                    >
                      <span aria-hidden="true">📅</span>
                      {post.date}
                    </time>
                  )}
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-pink-300 transition-colors leading-snug mb-2.5">
                    {post.title}
                  </h3>
                  {post.description && (
                    <p className="text-slate-300/90 text-sm leading-relaxed line-clamp-3">
                      {post.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="px-6 pb-5 pt-3 border-t border-white/5 flex items-center text-pink-400 text-sm font-medium">
                <span>{copy.readMore}</span>
                <span
                  aria-hidden="true"
                  className={`${
                    isRTL
                      ? "mr-1.5 group-hover:-translate-x-1"
                      : "ml-1.5 group-hover:translate-x-1"
                  } transition-transform`}
                >
                  {isRTL ? "←" : "→"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-pink-400/40 text-sm font-semibold text-white transition-all"
          >
            <span>{copy.viewAllPosts}</span>
            <span aria-hidden="true">{isRTL ? "←" : "→"}</span>
          </Link>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </section>
  );
};

export default HomeBlogSection;
