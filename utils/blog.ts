import { readdirSync } from "fs";
import { join } from "path";
import { Language } from "@/types";

export interface BlogPostMetadata {
  title?: string;
  date?: string;
  updatedAt?: string;
  description?: string;
  keywords?: string;
  image?: string;
  images?: string[];
  imageAlt?: string;
  author?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  updatedAt?: string;
  description: string;
  keywords?: string;
  image?: string;
  images?: string[];
  imageAlt?: string;
  author?: string;
}

export function getBlogSlugs(lang: Language): string[] {
  const blogDir = join(process.cwd(), "content", lang, "blog");
  try {
    return readdirSync(blogDir)
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

export async function getBlogPosts(
  lang: Language,
  limit?: number
): Promise<BlogPost[]> {
  const slugs = getBlogSlugs(lang);
  if (slugs.length === 0) {
    return [];
  }

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const mod = await import(`@/content/${lang}/blog/${slug}.mdx`);
      const metadata = (mod.metadata || {}) as BlogPostMetadata;
      const images = Array.isArray(metadata.images)
        ? metadata.images.filter(Boolean)
        : metadata.image
          ? [metadata.image]
          : undefined;

      return {
        slug,
        title: metadata.title || slug,
        date: metadata.date || "",
        updatedAt: metadata.updatedAt,
        description: metadata.description || "",
        keywords: metadata.keywords,
        image: metadata.image || images?.[0],
        images,
        imageAlt: metadata.imageAlt,
        author: metadata.author,
      };
    })
  );

  const sorted = posts.sort((a, b) => {
    const timeA = a.date ? new Date(a.date).getTime() : 0;
    const timeB = b.date ? new Date(b.date).getTime() : 0;
    return timeB - timeA;
  });

  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}
