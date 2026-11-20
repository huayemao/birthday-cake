import { MetadataRoute } from "next";
import { Language } from "../types";
import { TRANSLATIONS } from "../i18n";
import { getScreenshotUrl, ScreenshotView, SITE_URL } from "@/utils/seo";

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

export default function sitemap(): MetadataRoute.Sitemap {
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
