import { MetadataRoute } from "next";
import { Language } from "../types";
import { TRANSLATIONS } from "../i18n";
import { getScreenshotUrl, ScreenshotView, SITE_URL } from "@/utils/seo";
import { getBlogPosts } from "@/utils/blog";

const languages = Object.keys(TRANSLATIONS) as Language[];

const staticPages: Array<{
  path: string;
  priority: number;
  views: ScreenshotView[];
}> = [
  { path: "", priority: 1.0, views: ["home", "stage", "celebrate"] },
  { path: "configure", priority: 0.9, views: ["configure"] },
  { path: "about", priority: 0.8, views: ["about"] },
  { path: "guide", priority: 0.8, views: ["guide"] },
  { path: "blog", priority: 0.7, views: ["home"] },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();
  const urls: MetadataRoute.Sitemap = [];

  for (const lang of languages) {
    for (const page of staticPages) {
      const urlPath = page.path
        ? `${SITE_URL}/${lang}/${page.path}`
        : `${SITE_URL}/${lang}`;
      urls.push({
        url: urlPath,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: page.priority,
        images: page.views.map((view) =>
          getScreenshotUrl(lang, "desktop", view)
        ),
      });
    }

    const posts = await getBlogPosts(lang);
    for (const post of posts) {
      const postImages =
        post.images && post.images.length > 0
          ? post.images
          : post.image
            ? [post.image]
            : [getScreenshotUrl(lang, "desktop", "home")];

      urls.push({
        url: `${SITE_URL}/${lang}/blog/${post.slug}`,
        lastModified: post.updatedAt || post.date || currentDate,
        changeFrequency: "monthly",
        priority: 0.65,
        images: postImages,
      });
    }
  }

  urls.push({
    url: `${SITE_URL}/`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 1.0,
    images: [
      getScreenshotUrl("en", "desktop", "home"),
      getScreenshotUrl("en", "desktop", "stage"),
      getScreenshotUrl("en", "desktop", "celebrate"),
    ],
  });

  return urls;
}
