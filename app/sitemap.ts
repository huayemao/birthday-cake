import { MetadataRoute } from 'next';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n';

// 获取所有支持的语言
const languages = Object.keys(TRANSLATIONS) as Language[];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://birthday-cake.online';
  const currentDate = new Date().toISOString();
  
  // 为每种语言生成URL
  const urls: MetadataRoute.Sitemap = languages.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  
  // 添加默认语言URL（英语）
  urls.push({
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 1.0,
  });
  
  return urls;
}
