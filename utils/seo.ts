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
};

export function getScreenshotPath(
  lang: Language,
  platform: ScreenshotPlatform,
  view: ScreenshotView
): string {
  return `/screenshots/${lang}/${platform}/${view}.jpg`;
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

export interface BuildPageMetadataOptions {
  lang: Language;
  subPath?: string;
  isRoot?: boolean;
  title?: string;
  description?: string;
  keywords?: string;
  views?: ScreenshotView[];
  type?: "website" | "article";
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

  const ogImages = buildOpenGraphImages(lang, views);
  const primaryImage = ogImages[0];
  const currentOgLocale = OG_LOCALE_MAP[lang] || "en_US";
  const alternateLocales = languages
    .filter((lng) => lng !== lang)
    .map((lng) => OG_LOCALE_MAP[lng]);

  return {
    metadataBase: new URL(SITE_URL),
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: resolvedKeywords,
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
    openGraph: {
      type,
      url: pageUrl,
      siteName: t.title,
      title: resolvedTitle,
      description: resolvedDescription,
      locale: currentOgLocale,
      alternateLocale: alternateLocales,
      images: ogImages,
    },
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
