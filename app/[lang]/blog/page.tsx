import React from "react";
import type { Metadata } from "next";
import { readdirSync } from "fs";
import { join } from "path";
import Link from "next/link";
import { Language, languages } from "../../../types";
import { getTranslation } from "@/i18n";
import PageLayout from "../../../components/PageLayout";
import { buildPageMetadata } from "@/utils/seo";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
}

interface PageProps {
  params: Promise<{
    lang: Language;
  }>;
}

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslation(lang);
  return buildPageMetadata({
    lang,
    subPath: "/blog",
    title: `${t.blogTitle || "Blog"} - ${t.seoTitle}`,
    description: t.description,
    views: ["home", "stage", "celebrate"],
  });
}

async function getBlogPosts(lang: Language): Promise<BlogPost[]> {
  const blogDir = join(process.cwd(), "content", lang, "blog");
  try {
    const files = readdirSync(blogDir).filter((file) => file.endsWith(".mdx"));

    const posts = await Promise.all(
      files.map(async (file) => {
        const slug = file.replace(".mdx", "");
        const mod = await import(`../../../content/${lang}/blog/${slug}.mdx`);
        const metadata = mod.metadata as {
          title?: string;
          date?: string;
          description?: string;
        };

        return {
          slug,
          title: metadata.title || slug,
          date: metadata.date || "",
          description: metadata.description || "",
        };
      })
    );

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

const Page: React.FC<PageProps> = async ({ params }) => {
  const { lang } = await params;
  const t = getTranslation(lang);
  const posts = await getBlogPosts(lang);
  const currentPath = `/blog`;

  return (
    <PageLayout lang={lang} title={t.blogTitle || "Blog"} currentPath={currentPath}>
      <div className="space-y-8">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">
              No posts yet.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.slug}
              href={`/${lang}/blog/${post.slug}`}
              className="block group p-6 bg-slate-800/30 rounded-2xl hover:bg-slate-800/50 transition-all duration-300 border border-slate-700/50 hover:border-pink-500/30"
            >
              <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-slate-400 text-sm mb-3 flex items-center gap-2">
                <span className="text-pink-500">📅</span>
                {post.date}
              </p>
              <p className="text-slate-300">{post.description}</p>
              <div className="mt-4 flex items-center text-pink-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                <span>Read more</span>
                <span className="ml-1">→</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </PageLayout>
  );
};

export default Page;