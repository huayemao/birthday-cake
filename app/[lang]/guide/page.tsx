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
  const currentPath = `/guide`;

  return (
    <PageLayout lang={lang} title={t.guideTitle || "User Guide"} currentPath={currentPath}>
      <div className="space-y-8">
        {/* 步骤 1 */}
        <section className="bg-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500 text-white font-bold text-lg">
              1
            </span>
            <h2 className="text-2xl font-bold text-white">
              {t.step1Title || "选择蛋糕款式"}
            </h2>
          </div>
          <p className="text-slate-300 ml-14">
            {t.step1Content ||
              "从预设的精美蛋糕模板中选择您喜欢的款式，或者上传您自己的蛋糕图片。"}
          </p>
        </section>

        {/* 步骤 2 */}
        <section className="bg-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500 text-white font-bold text-lg">
              2
            </span>
            <h2 className="text-2xl font-bold text-white">
              {t.step2Title || "选择蜡烛款式"}
            </h2>
          </div>
          <p className="text-slate-300 ml-14">
            {t.step2Content ||
              "选择经典蜡烛或数字形状蜡烛。数字蜡烛可以拼出年龄或其他有意义的数字。"}
          </p>
        </section>

        {/* 步骤 3 */}
        <section className="bg-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500 text-white font-bold text-lg">
              3
            </span>
            <h2 className="text-2xl font-bold text-white">
              {t.step3Title || "个性化设置"}
            </h2>
          </div>
          <p className="text-slate-300 ml-14">
            {t.step3Content ||
              "填写寿星姓名、赠送人姓名和祝福语，让您的祝福更加特别。"}
          </p>
        </section>

        {/* 步骤 4 */}
        <section className="bg-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500 text-white font-bold text-lg">
              4
            </span>
            <h2 className="text-2xl font-bold text-white">
              {t.step4Title || "完成配置"}
            </h2>
          </div>
          <p className="text-slate-300 ml-14">
            {t.step4Content ||
              "点击[完成配置]按钮，蛋糕将自动点亮蜡烛。"}
          </p>
        </section>

        {/* 步骤 5 */}
        <section className="bg-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500 text-white font-bold text-lg">
              5
            </span>
            <h2 className="text-2xl font-bold text-white">
              {t.step5Title || "吹灭蜡烛"}
            </h2>
          </div>
          <p className="text-slate-300 ml-14">
            {t.step5Content ||
              "对着麦克风吹气来吹灭蜡烛。系统会检测您的吹气声，当看到提示文字变红时表示检测到了吹气。"}
          </p>
        </section>

        {/* 步骤 6 */}
        <section className="bg-slate-800/50 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-500 text-white font-bold text-lg">
              6
            </span>
            <h2 className="text-2xl font-bold text-white">
              {t.step6Title || "分享祝福"}
            </h2>
          </div>
          <p className="text-slate-300 ml-14">
            {t.step6Content ||
              "点击[分享]按钮复制链接，发送给亲朋好友，让他们也能体验这个特别的生日祝福！"}
          </p>
        </section>

        {/* 提示 */}
        <section className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl p-6 border border-pink-500/30">
          <h3 className="text-xl font-bold text-pink-400 mb-3 flex items-center gap-2">
            <span>💡</span>
            {t.tipsTitle || "温馨提示"}
          </h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-pink-500 mt-1">•</span>
              <span>{t.tip1 || "确保您的设备有麦克风并已授权浏览器访问"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-500 mt-1">•</span>
              <span>{t.tip2 || "吹气时尽量靠近麦克风，力度适中"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-500 mt-1">•</span>
              <span>{t.tip3 || "可以在安静的环境中使用，效果更好"}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-500 mt-1">•</span>
              <span>{t.tip4 || "支持手机、平板和电脑等多种设备"}</span>
            </li>
          </ul>
        </section>
      </div>
    </PageLayout>
  );
};

export default Page;
