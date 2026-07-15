import { Language } from "@/types";
import { FAQ_TITLE, FAQS } from "@/faq";

interface FaqSectionProps {
  lang: Language;
}

// 纯展示型组件（无客户端交互依赖），使用语义化 HTML 与 FAQ JSON-LD，
// 保证内容随首屏 SSR 输出，便于搜索引擎抓取与富媒体结果展示。
const FaqSection: React.FC<FaqSectionProps> = ({ lang }) => {
  const title = FAQ_TITLE[lang] || FAQ_TITLE.en;
  const faqs = FAQS[lang] || FAQS.en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section
      aria-label={title}
      className="relative w-full px-4 sm:px-8 py-16 md:py-24"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-serif font-black text-center text-white mb-3">
          {title}
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-amber-400 rounded-full mx-auto mb-10" />

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm p-5 md:p-6 transition-colors hover:border-pink-400/40 open:border-pink-400/50 open:bg-slate-900/60"
            >
              <summary className="flex items-start justify-between gap-4 cursor-pointer font-bold text-white text-base md:text-lg list-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start gap-3">
                  <span className="text-pink-400 font-serif shrink-0">Q{i + 1}</span>
                  <span>{f.q}</span>
                </span>
                <span className="shrink-0 mt-1 text-pink-400 transition-transform duration-300 group-open:rotate-45">
                  ＋
                </span>
              </summary>
              <p className="mt-4 text-slate-300 leading-relaxed text-sm md:text-base">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
};

export default FaqSection;
