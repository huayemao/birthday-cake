import React, { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { buildPageMetadata } from "@/utils/seo";

interface RootLayoutProps {
  children: ReactNode;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...buildPageMetadata({
      lang: "en",
      isRoot: true,
      views: ["home", "stage", "celebrate", "configure"],
    }),
    manifest: "/site.webmanifest",
  };
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default RootLayout;
