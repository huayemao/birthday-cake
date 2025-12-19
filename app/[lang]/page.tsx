import React from 'react';
import { AppState, Language, CandleType } from '../../types';
import { ClientPage } from './ClientPage';


interface PageProps {
  params: {
    lang: Language;
  };
}

// 服务器组件以支持Next.js 15的异步params访问
const Page: React.FC<PageProps> = async ({ params }) => {
  // 服务器组件中使用await解包params
  const { lang } = await params;

  // 动态导入客户端组件

  return <html lang={lang}><ClientPage initialLang={lang} /></html>;
};



export default Page;