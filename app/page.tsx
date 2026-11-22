import React from "react";
import { ClientPage } from "./[lang]/ClientPage";
import { buildWebAppJsonLd } from "@/utils/seo";
import { getBlogPosts } from "@/utils/blog";

const Home: React.FC = async () => {
  const jsonLd = buildWebAppJsonLd("en");
  const latestPosts = await getBlogPosts("en", 5);

  return (
    <html lang="en" dir="ltr">
      <body className="bg-slate-950">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ClientPage initialLang="en" latestPosts={latestPosts} />
      </body>
    </html>
  );
};

export default Home;
