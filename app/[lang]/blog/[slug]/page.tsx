import { readFileSync } from 'fs';
import { join } from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Language } from '@/types';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { blogPageTitles } from '../page';

interface Params {
 slug: string;
 lang: Language;
}

async function getBlogPost(slug: string, lang: Language) {
 const blogDir = join(process.cwd(), 'content', lang, 'blog');
 const filePath = join(blogDir, `${slug}.mdx`);

 try {
  return readFileSync(filePath, 'utf8');
 } catch {
  return null;
 }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
 const { slug, lang } = await params;
 const content = await getBlogPost(slug, lang);
 if (!content) notFound();

 const titleMatch = content.match(/^#\s+(.*)$/m);
 const descriptionMatch = content.match(/^description:\s+(.*)$/m);

 return {
  title: titleMatch ? titleMatch[1] : slug,
  description: descriptionMatch ? descriptionMatch[1] : '',
 };
}

export async function generateStaticParams() {
 const { readdirSync } = await import('fs');
 const { languages } = await import('@/types');
 const params: { slug: string; lang: string }[] = [];

 for (const lang of languages) {
  const blogDir = join(process.cwd(), 'content', lang, 'blog');
  try {
   const files = readdirSync(blogDir).filter((file) => file.endsWith('.mdx'));
   for (const file of files) {
    params.push({
     slug: file.replace('.mdx', ''),
     lang,
    });
   }
  } catch {
   // Language directory doesn't exist
  }
 }

 return params;
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
 const { slug, lang } = await params;
 const content = await getBlogPost(slug, lang);
 if (!content) notFound();


 return (
  <main className="flex-1 container mx-auto px-6 py-12">
   <div className="mb-12 border-b-4 border-black pb-8">
    <h1 className="text-6xl font-black tracking-tighter uppercase italic">
     {blogPageTitles[lang]}
    </h1>
   </div>

   <div className="prose prose-lg max-w-none">
    <MDXRemote source={content} />
   </div>
  </main>
 );
}