import { MetadataRoute } from 'next';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n';

const languages = Object.keys(TRANSLATIONS) as Language[];

const staticPages = [
  { path: '', priority: 1.0 },
  { path: 'about', priority: 0.8 },
  { path: 'guide', priority: 0.8 },
  { path: 'blog', priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://birthday-cake.online';
  const currentDate = new Date().toISOString();
  const urls: MetadataRoute.Sitemap = [];

  for (const lang of languages) {
    for (const page of staticPages) {
      const urlPath = page.path ? `${baseUrl}/${lang}/${page.path}` : `${baseUrl}/${lang}`;
      urls.push({
        url: urlPath,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: page.priority,
      });
    }
  }

  for (const page of staticPages) {
    const urlPath = page.path ? `${baseUrl}/${page.path}` : baseUrl;
    urls.push({
      url: urlPath,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: page.priority,
    });
  }

  return urls;
}
