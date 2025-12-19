import React, { ReactNode } from 'react';
import { Language } from '../../types';
import { Analytics } from '@vercel/analytics/next';

interface LangLayoutProps {
  children: ReactNode;
  params: Promise<{
    lang: Language;
  }>;
}

export const LangLayout: React.FC<LangLayoutProps> = async ({ children, params }) => {
  const lang = await (await params).lang;
  const isRTL = lang === 'ar';

  return (
    <html lang={lang} dir={isRTL ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
};

export default LangLayout;