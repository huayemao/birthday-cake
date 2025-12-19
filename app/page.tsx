
import { getTranslation } from '@/i18n';
import { ClientPage } from './[lang]/ClientPage';
import { Metadata } from 'next';


const lang = 'en';
const t = getTranslation(lang);

export const metadata: Metadata = {
  title: `${t.seoTitle} - ${t.seoSubtitle1} | ${t.seoSubtitle2}`,
  description: t.description,
  keywords: t.keywords,
};

const Home: React.FC = () => {
  return <html lang="en"><body><ClientPage initialLang="en" /></body></html>
}

export default Home;