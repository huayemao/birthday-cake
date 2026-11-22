import type { Metadata } from "next";
import { getTranslation } from "@/i18n";
import { Language, languages, Translation } from "@/types";

export const SITE_URL = "https://www.birthday-cake.online";

export type ScreenshotPlatform = "desktop" | "mobile";
export type ScreenshotView =
  | "home"
  | "configure"
  | "stage"
  | "celebrate"
  | "guide"
  | "about";

export const SCREENSHOT_DIMENSIONS: Record<
  ScreenshotPlatform,
  { width: number; height: number }
> = {
  desktop: { width: 1280, height: 720 },
  mobile: { width: 780, height: 1688 },
};

export const OG_LOCALE_MAP: Record<Language, string> = {
  en: "en_US",
  zh: "zh_CN",
  "zh-Hant": "zh_TW",
  ja: "ja_JP",
  fr: "fr_FR",
  ar: "ar_AR",
  ko: "ko_KR",
  es: "es_ES",
  pt: "pt_BR",
  de: "de_DE",
  it: "it_IT",
  ru: "ru_RU",
  vi: "vi_VN",
  hi: "hi_IN",
  id: "id_ID",
  th: "th_TH",
  ms: "ms_MY",
  tr: "tr_TR",
  ur: "ur_PK",
};

/** 已生成本地截图文件的语言集合，未生成截图的新语言自动回退到 en 防止 404 */
const SCREENSHOT_AVAILABLE_LANGS = new Set<Language>([
  "en",
  "zh",
  "zh-Hant",
  "ja",
  "fr",
  "ar",
  "ko",
  "es",
  "pt",
  "de",
  "it",
  "ru",
  "vi",
]);

export function getScreenshotPath(
  lang: Language,
  platform: ScreenshotPlatform,
  view: ScreenshotView
): string {
  const effectiveLang: Language = SCREENSHOT_AVAILABLE_LANGS.has(lang)
    ? lang
    : "en";
  return `/screenshots/${effectiveLang}/${platform}/${view}.jpg`;
}

export function getScreenshotUrl(
  lang: Language,
  platform: ScreenshotPlatform,
  view: ScreenshotView
): string {
  return `${SITE_URL}${getScreenshotPath(lang, platform, view)}`;
}

function getViewAltText(
  t: Translation,
  view: ScreenshotView,
  platform: ScreenshotPlatform
): string {
  const platformTag = platform === "mobile" ? " (Mobile)" : "";
  switch (view) {
    case "home":
      return `${t.title} - ${t.seoTitle}${platformTag}`;
    case "configure":
      return `${t.arrangeCake} - ${t.chooseCake} | ${t.title}${platformTag}`;
    case "stage":
      return `${t.title} - ${t.blowPrompt}${platformTag}`;
    case "celebrate":
      return `${t.celebrate} - ${t.title}${platformTag}`;
    case "guide":
      return `${t.guideTitle || "Guide"} - ${t.title}${platformTag}`;
    case "about":
      return `${t.aboutTitle || "About"} - ${t.title}${platformTag}`;
  }
}

export function buildOpenGraphImages(
  lang: Language,
  views: ScreenshotView[] = ["home", "stage", "celebrate", "configure"]
) {
  const t = getTranslation(lang);
  const { width, height } = SCREENSHOT_DIMENSIONS.desktop;

  return views.map((view) => {
    const url = getScreenshotUrl(lang, "desktop", view);
    return {
      url,
      secureUrl: url,
      width,
      height,
      type: "image/jpeg",
      alt: getViewAltText(t, view, "desktop"),
    };
  });
}

export function buildAlternates(
  lang: Language,
  subPath: string = "",
  isRoot: boolean = false
): NonNullable<Metadata["alternates"]> {
  const normalizedSubPath = subPath
    ? subPath.startsWith("/")
      ? subPath
      : `/${subPath}`
    : "";

  const languageAlternates: Record<string, string> = {};
  for (const lng of languages) {
    languageAlternates[lng] = `${SITE_URL}/${lng}${normalizedSubPath}`;
  }
  languageAlternates["x-default"] = `${SITE_URL}/en${normalizedSubPath}`;

  return {
    canonical: isRoot ? `${SITE_URL}/` : `${SITE_URL}/${lang}${normalizedSubPath}`,
    languages: languageAlternates,
  };
}

export interface CustomOgImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface BuildPageMetadataOptions {
  lang: Language;
  subPath?: string;
  isRoot?: boolean;
  title?: string;
  description?: string;
  keywords?: string;
  views?: ScreenshotView[];
  type?: "website" | "article";
  customImages?: CustomOgImage[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
}

export function buildPageMetadata({
  lang,
  subPath = "",
  isRoot = false,
  title,
  description,
  keywords,
  views = ["home", "stage", "celebrate", "configure"],
  type = "website",
  customImages,
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: BuildPageMetadataOptions): Metadata {
  const t = getTranslation(lang);
  const resolvedTitle = title || `${t.seoTitle} - ${t.seoSubtitle1}`;
  const resolvedDescription =
    description || `${t.seoSubtitle2} ${t.description}`.trim();
  const resolvedKeywords = keywords ?? t.keywords;

  const normalizedSubPath = subPath
    ? subPath.startsWith("/")
      ? subPath
      : `/${subPath}`
    : "";
  const pageUrl = isRoot
    ? `${SITE_URL}/`
    : `${SITE_URL}/${lang}${normalizedSubPath}`;

  const fallbackOgImages = buildOpenGraphImages(lang, views);
  const formattedCustomImages = (customImages || [])
    .filter((img) => Boolean(img.url))
    .map((img) => ({
      url: img.url,
      secureUrl: img.url.startsWith("https://") ? img.url : undefined,
      width: img.width,
      height: img.height,
      alt: img.alt || resolvedTitle,
    }));

  const ogImages =
    formattedCustomImages.length > 0
      ? [...formattedCustomImages, ...fallbackOgImages]
      : fallbackOgImages;
  const primaryImage = ogImages[0];
  const currentOgLocale = OG_LOCALE_MAP[lang] || "en_US";
  const alternateLocales = languages
    .filter((lng) => lng !== lang)
    .map((lng) => OG_LOCALE_MAP[lng]);

  const openGraphBase = {
    url: pageUrl,
    siteName: t.title,
    title: resolvedTitle,
    description: resolvedDescription,
    locale: currentOgLocale,
    alternateLocale: alternateLocales,
    images: ogImages,
  };

  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          ...openGraphBase,
          type: "article",
          publishedTime,
          modifiedTime: modifiedTime || publishedTime,
          authors,
          tags,
        }
      : {
          ...openGraphBase,
          type: "website",
        };

  return {
    metadataBase: new URL(SITE_URL),
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: resolvedKeywords,
    authors: authors?.map((name) => ({ name })),
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: ["/favicon.ico"],
    },
    alternates: buildAlternates(lang, normalizedSubPath, isRoot),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: primaryImage
        ? [{ url: primaryImage.url, alt: primaryImage.alt }]
        : undefined,
    },
  };
}

/**
 * Schema.org WebApplication JSON-LD with desktop & mobile ImageObject screenshots
 * so search engines can display rich visual previews in SERP results.
 */
export function buildWebAppJsonLd(lang: Language) {
  const t = getTranslation(lang);
  const showcaseViews: ScreenshotView[] = [
    "home",
    "stage",
    "celebrate",
    "configure",
  ];

  const desktopImages = showcaseViews.map((view) =>
    getScreenshotUrl(lang, "desktop", view)
  );

  const screenshots = (["desktop", "mobile"] as ScreenshotPlatform[]).flatMap(
    (platform) => {
      const { width, height } = SCREENSHOT_DIMENSIONS[platform];
      return showcaseViews.map((view) => ({
        "@type": "ImageObject",
        url: getScreenshotUrl(lang, platform, view),
        width,
        height,
        encodingFormat: "image/jpeg",
        caption: getViewAltText(t, view, platform),
      }));
    }
  );

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t.title,
    alternateName: t.seoTitle,
    description: `${t.seoSubtitle2} ${t.description}`.trim(),
    url: `${SITE_URL}/${lang}`,
    inLanguage: lang,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    image: desktopImages,
    screenshot: screenshots,
  };
}
