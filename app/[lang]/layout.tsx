import React, { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Language } from "../../types";
import { Analytics } from "@vercel/analytics/next";
import { buildPageMetadata } from "@/utils/seo";

export const viewport: Viewport = {
  themeColor: "#070b1a",
};

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{
    lang: Language;
  }>;
}

export const generateMetadata = async ({
  params,
}: LangLayoutProps): Promise<Metadata> => {
  const { lang } = await params;
  return buildPageMetadata({
    lang,
    views: ["home", "stage", "celebrate", "configure"],
  });
};

export const LangLayout: React.FC<LangLayoutProps> = async ({
  children,
  params,
}) => {
  const { lang } = await params;
  const isRTL = lang === "ar";

  return (
    <html lang={lang} dir={isRTL ? "rtl" : "ltr"}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-950">
        {children}
        <Analytics />
      </body>
    </html>
  );
};

export default LangLayout;
