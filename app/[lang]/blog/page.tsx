import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { Metadata } from 'next';
import Link from 'next/link';
import { Language } from '@/types';

interface BlogPost {
 slug: string;
 title: string;
 date: string;
 description: string;
}

interface LangParams {
 lang: Language;
}

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
 const { lang } = await params;
 const titles: Record<Language, string> = {
  en: 'Blog',
  zh: '博客',
  'zh-Hant': '博客',
  ja: 'ブログ',
  fr: 'Blog',
  ar: 'مدونة',
  ko: '블로그',
  es: 'Blog',
  pt: 'Blog',
  de: 'Blog',
  it: 'Blog',
  ru: 'Блог',
  vi: 'Bài viết',
 };
 const descriptions: Record<Language, string> = {
  en: 'Read our latest articles and updates',
  zh: '阅读最新的文章和更新',
  'zh-Hant': '閱讀最新的文章和更新',
  ja: '最新の記事とアップデートを読む',
  fr: 'Lisez nos derniers articles et mises à jour',
  ar: 'اقرأ أحدث مقالاتنا وتحديثاتنا',
  ko: '최신 기사 및 업데이트 읽기',
  es: 'Lea nuestros últimos artículos y actualizaciones',
  pt: 'Leia nossos últimos artigos e atualizações',
  de: 'Lesen Sie unsere neuesten Artikel und Updates',
  it: 'Leggi i nostri ultimi articoli e aggiornamenti',
  ru: 'Читайте наши последние статьи и обновления',
  vi: 'Xem bài viết mới nhất của chúng tôi',
 };

 return {
  title: titles[lang],
  description: descriptions[lang],
 };
}

function getBlogPosts(lang: Language): BlogPost[] {
 const blogDir = join(process.cwd(), 'content', lang, 'blog');
 const files = readdirSync(blogDir).filter((file) => file.endsWith('.mdx'));

 return files.map((file) => {
  const slug = file.replace('.mdx', '');
  const content = readFileSync(join(blogDir, file), 'utf8');

  const titleMatch = content.match(/^#\s+(.*)$/m);
  const dateMatch = content.match(/^date:\s+(.*)$/m);
  const descriptionMatch = content.match(/^description:\s+(.*)$/m);

  return {
   slug,
   title: titleMatch ? titleMatch[1] : slug,
   date: dateMatch ? dateMatch[1] : '',
   description: descriptionMatch ? descriptionMatch[1] : '',
  };
 });
}

 export const blogPageTitles: Record<Language, string> = {
  en: 'Blog',
  zh: '博客',
  'zh-Hant': '博客',
  ja: 'ブログ',
  fr: 'Blog',
  ar: 'مدونة',
  ko: '블로그',
  es: 'Blog',
  pt: 'Blog',
  de: 'Blog',
  it: 'Blog',
  ru: 'Блог',
  vi: 'Bài viết',
 };

export default async function BlogPage({ params }: { params: Promise<LangParams> }) {
 const { lang } = await params;
 const posts = getBlogPosts(lang);



 return (
  <main className="flex-1 container mx-auto px-6 py-12">
   <h1 className="text-6xl font-black tracking-tighter uppercase italic mb-12 border-b-4 border-black pb-8">
    {blogPageTitles[lang]}
   </h1>

   <div className="space-y-8">
    {posts.length === 0 ? (
     <p className="text-zinc-500">No posts yet.</p>
    ) : (
     posts.map((post) => (
     <Link key={post.slug} href={`/${lang}/blog/${post.slug}`} className="block group">
      <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h2>
      <p className="text-zinc-500 text-sm mb-4">{post.date}</p>
      <p className="text-zinc-700">{post.description}</p>
     </Link>
    ))
    )}
   </div>
  </main>
 );
}