import React from 'react';
import { Language } from '../../../types';
import { SceneClient } from './SceneClient';

interface PageProps {
  params: {
    lang: Language;
  };
}

const Page: React.FC<PageProps> = async ({ params }) => {
  const { lang } = await params;

  return <SceneClient initialLang={lang} />;
};

export default Page;