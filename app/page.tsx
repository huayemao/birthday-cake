import React from "react";
import { ClientPage } from "./[lang]/ClientPage";
import { buildWebAppJsonLd } from "@/utils/seo";

const Home: React.FC = () => {
  const jsonLd = buildWebAppJsonLd("en");

  return (
    <html lang="en" dir="ltr">
      <body className="bg-slate-950">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ClientPage initialLang="en" />
      </body>
    </html>
  );
};

export default Home;
