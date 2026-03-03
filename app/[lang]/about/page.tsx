import React from "react";
import { Language } from "../../../types";
import { getTranslation } from "@/i18n";
import PageLayout from "../../../components/PageLayout";

interface PageProps {
  params: {
    lang: Language;
  };
}

const Page: React.FC<PageProps> = async ({ params }) => {
  const { lang } = await params;
  const t = getTranslation(lang);
  const currentPath = `/about`;

  return (
    <PageLayout lang={lang} title={t.aboutTitle || "About"} currentPath={currentPath}>
      <div className="prose prose-lg prose-invert max-w-none">
        <div className="text-slate-300 space-y-6 text-lg leading-relaxed">
          <p>
            {t.aboutContent1 ||
              "这是一个创新的在线生日庆祝工具，让您能够通过互联网与亲朋好友分享生日喜悦。"}
          </p>

          <p>
            {t.aboutContent2 ||
              "无论您身在何处，只需一个链接，就能邀请远方的亲友通过麦克风吹灭虚拟生日蛋糕上的蜡烛，创造温馨难忘的远程庆祝体验。"}
          </p>

          <h2 className="text-2xl font-bold text-pink-400 mt-8 mb-4">
            {t.featuresTitle || "主要功能"}
          </h2>

          <ul className="space-y-3 list-none pl-0">
            <li className="flex items-start gap-3">
              <span className="text-pink-500 text-xl">✦</span>
              <span>
                {t.feature1 ||
                  "多种精美蛋糕模板可供选择"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-pink-500 text-xl">✦</span>
              <span>
                {t.feature2 ||
                  "支持自定义蜡烛数量和数字形状"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-pink-500 text-xl">✦</span>
              <span>
                {t.feature3 ||
                  "逼真的火焰动画效果"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-pink-500 text-xl">✦</span>
              <span>
                {t.feature4 ||
                  "麦克风感应吹蜡烛功能"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-pink-500 text-xl">✦</span>
              <span>
                {t.feature5 ||
                  "个性化祝福语和署名"}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-pink-500 text-xl">✦</span>
              <span>
                {t.feature6 ||
                  "一键分享链接给好友"}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};

export default Page;
