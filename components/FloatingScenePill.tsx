"use client";

import React from "react";

export type FloatingScenePillVariant = "default" | "blowing" | "locked";

interface FloatingScenePillProps {
  children: React.ReactNode;
  variant?: FloatingScenePillVariant;
  className?: string;
  onClick?: () => void;
}

/**
 * 统一的场景悬浮玻璃胶囊容器：
 * 同时用于“拖动 360° 欣赏蛋糕”与“[对着麦克风吹气来熄灭蜡烛！]”等提示文案，
 * 确保与深邃烛光全屏场景自然融合、风格高度一致。
 */
export const FloatingScenePill: React.FC<FloatingScenePillProps> = ({
  children,
  variant = "default",
  className = "",
  onClick,
}) => {
  const variantClasses =
    variant === "blowing"
      ? "bg-pink-950/65 border-pink-400/55 text-pink-100 scale-105 shadow-[0_0_28px_rgba(244,114,182,0.3)]"
      : variant === "locked"
        ? "bg-amber-950/60 border-amber-400/45 text-amber-100"
        : "bg-slate-900/55 border-white/15 text-white/85";

  const interactiveClasses = onClick
    ? "cursor-pointer hover:bg-slate-800/70 hover:border-white/25 active:scale-95"
    : "";

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md border text-xs font-medium tracking-wide shadow-lg transition-all duration-300 ${variantClasses} ${interactiveClasses} ${className}`}
    >
      {children}
    </div>
  );
};

export default FloatingScenePill;
