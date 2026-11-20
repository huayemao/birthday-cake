import React, { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { buildPageMetadata } from "@/utils/seo";

interface RootLayoutProps {
  children: ReactNode;
}

export const viewport: Viewport = {
  themeColor: "#070b1a",
};

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    lang: "en",
    isRoot: true,
    views: ["home", "stage", "celebrate", "configure"],
  });
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default RootLayout;
