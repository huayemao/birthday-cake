import React, { ReactNode } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import './globals.css';
import { getTranslation } from '../i18n';

interface RootLayoutProps {
  children: ReactNode;
}

export async function generateMetadata(
  _props: RootLayoutProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // 默认语言为英语，因为根布局无法获取 params
  const lang = 'en';
  const t = getTranslation(lang);
  
  return {
    title: `${t.seoTitle} - ${t.seoSubtitle1} | ${t.seoSubtitle2}`,
    description: t.description,
    keywords: t.keywords,
  };
}

// 根布局不再需要异步，因为不需要访问 params
const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <>{children}</>
  );
};

export default RootLayout;