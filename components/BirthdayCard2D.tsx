"use client";

import React from "react";
import { CardStyle, isRtlLanguage, Language } from "@/types";
import { getCardPalette, resolveCardText } from "@/utils/cardTheme";

export interface BirthdayCard2DProps {
  userName?: string;
  customMessage?: string;
  giverName?: string;
  cardStyle?: CardStyle;
  lang: Language;
  compact?: boolean;
  className?: string;
}

const STAR_DOTS = Array.from({ length: 18 }, (_, i) => ({
  left: `${(((i * 37) % 86) + 7).toFixed(1)}%`,
  top: `${(((i * 53) % 80) + 10).toFixed(1)}%`,
  size: `${(1.5 + (i % 3) * 0.9).toFixed(1)}px`,
  opacity: Number((0.28 + (i % 4) * 0.16).toFixed(2)),
}));

const BirthdayCard2D: React.FC<BirthdayCard2DProps> = ({
  userName = "",
  customMessage = "",
  giverName = "",
  cardStyle = "cream-rose",
  lang,
  compact = false,
  className = "",
}) => {
  if (cardStyle === "none") {
    return null;
  }

  const p = getCardPalette(cardStyle);
  const { titleText, bodyText, fromText } = resolveCardText({
    userName,
    customMessage,
    giverName,
    lang,
  });

  const hasBody = Boolean(bodyText);
  const hasFrom = Boolean(fromText);
  const isRTL = isRtlLanguage(lang);

  // 根据字数微调标题比例，确保中英文长名都不溢出
  const titleFontSize =
    titleText.length > 14
      ? "clamp(10px, 6.4cqw, 16px)"
      : titleText.length > 8
        ? "clamp(11px, 7.6cqw, 19px)"
        : "clamp(12px, 9cqw, 22px)";

  const bodyFontSize =
    bodyText.length > 22
      ? "clamp(8px, 4.4cqw, 11.5px)"
      : "clamp(9px, 5cqw, 13px)";

  return (
    <div
      className={`pointer-events-none absolute left-1/2 -translate-x-1/2 z-20 ${
        compact
          ? "w-[48%] min-w-[136px] max-w-[216px]"
          : "w-[46%] min-w-[152px] max-w-[236px]"
      } ${className}`}
      style={{ perspective: "620px" }}
      aria-label={`${titleText}${bodyText ? ` - ${bodyText}` : ""}${fromText ? ` (${fromText})` : ""}`}
    >
      {/* 柔和落地投影，让卡片自然倚靠在 2D 蛋糕底托前缘 */}
      <div
        className="absolute -bottom-1.5 left-[8%] right-[8%] h-3 rounded-full blur-[5px]"
        style={{ background: "rgba(2, 6, 23, 0.45)" }}
      />

      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="relative w-full aspect-[768/420] rounded-[10px] sm:rounded-[13px] overflow-hidden select-none transition-all duration-300"
        style={{
          containerType: "inline-size",
          background: `linear-gradient(135deg, ${p.bg1} 0%, ${p.bg2} 100%)`,
          transform: "rotateX(7deg)",
          transformOrigin: "center bottom",
          boxShadow:
            "0 10px 24px rgba(2, 6, 23, 0.44), 0 1px 0 rgba(255, 255, 255, 0.16) inset",
        }}
      >
        {/* 星夜紫韵点点星光 */}
        {p.stars && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {STAR_DOTS.map((star, idx) => (
              <span
                key={idx}
                className="absolute rounded-full bg-white"
                style={{
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity,
                }}
              />
            ))}
          </div>
        )}

        {/* 外层典雅装饰线框 */}
        <div
          className="absolute inset-[5%] rounded-[7px] sm:rounded-[9px]"
          style={{ border: `1.5px solid ${p.border}` }}
        />
        {/* 内层细腻副线框 */}
        <div
          className="absolute inset-[8.2%] rounded-[5px] sm:rounded-[7px]"
          style={{ border: `1px solid ${p.subBorder}` }}
        />

        {/* 卡片文字排版内容区 */}
        <div className="relative z-10 w-full h-full px-[12%] py-[9%] flex flex-col items-center justify-between text-center">
          {/* 顶部装饰徽章 */}
          <div
            className="font-serif font-semibold leading-none tracking-[0.2em] shrink-0"
            style={{
              color: p.emblem,
              fontSize: "clamp(7px, 3.6cqw, 11px)",
            }}
            aria-hidden="true"
          >
            {p.emblemText}
          </div>

          {/* 中部标题与祝福语 */}
          <div className="flex-1 w-full flex flex-col items-center justify-center gap-[3cqw] min-h-0">
            <div
              className="w-full font-serif font-bold leading-tight truncate px-1"
              style={{
                color: p.primaryInk,
                fontSize: titleFontSize,
              }}
            >
              {titleText}
            </div>

            {hasBody && (
              <p
                className="w-full font-medium leading-[1.32] line-clamp-2 break-words px-0.5"
                style={{
                  color: p.secondaryInk,
                  fontSize: bodyFontSize,
                }}
              >
                {bodyText}
              </p>
            )}
          </div>

          {/* 底部落款（From） */}
          {hasFrom ? (
            <div className="w-full flex flex-col items-center gap-[2cqw] shrink-0">
              <div
                className="w-[62%] h-[1px]"
                style={{ backgroundColor: p.subBorder }}
              />
              <div
                className="w-full font-serif italic font-semibold leading-none truncate px-1"
                style={{
                  color: p.fromInk,
                  fontSize: "clamp(8px, 4.4cqw, 12px)",
                }}
              >
                {fromText}
              </div>
            </div>
          ) : (
            <div className="h-[2cqw] shrink-0" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
};

export default BirthdayCard2D;
