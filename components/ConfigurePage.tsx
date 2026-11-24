"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CandleType, CardStyle, CelebrationSfxStyle, isRtlLanguage, Language, SceneTheme } from "@/types";
import { CAKES } from "@/constants";
import { getTranslation } from "@/i18n";
import { useAppStore } from "@/store/useAppStore";
import { detectWebGLSupport } from "@/utils/webglSupport";
import { renderCake3DThumbnails } from "@/utils/cakeThumbnailRenderer";
import { birthdayAudio, MusicStyle } from "@/utils/birthdayAudio";
import { useShareLink } from "@/src/hooks/useShareLink";
import CakeScene from "./CakeScene";
import BlowCalibrationCard from "./BlowCalibrationCard";
import ShareModal from "./ShareModal";

interface ConfigurePageProps {
  initialLang: Language;
}

const CAKE_DISPLAY_NAMES: Record<string, { zh: string; en: string }> = {
  "elegant-strawberry": { zh: "草莓梦幻", en: "Strawberry Dream" },
  "classic-chocolate": { zh: "丝绒黑巧", en: "Midnight Cocoa" },
  "rainbow-party": { zh: "彩虹派对", en: "Rainbow Layer" },
  "blueberry-glaze": { zh: "星夜蓝莓", en: "Purple Velvet" },
};

const SCENE_THEME_OPTIONS: Array<{
  id: SceneTheme;
  zh: string;
  en: string;
  swatch: string;
}> = [
    { id: "fairy-lights", zh: "浪漫串灯", en: "Fairy Lights", swatch: "from-amber-300 to-pink-400" },
    { id: "starry-night", zh: "星河秘境", en: "Starry Night", swatch: "from-indigo-400 to-cyan-300" },
    { id: "warm-candlelight", zh: "暖光烛影", en: "Cozy Glow", swatch: "from-amber-400 to-orange-500" },
    { id: "cherry-blossom", zh: "樱花漫舞", en: "Sakura Petals", swatch: "from-pink-300 to-rose-400" },
    { id: "minimal-studio", zh: "极简纯净", en: "Pure Studio", swatch: "from-slate-400 to-slate-600" },
  ];

const CARD_STYLE_OPTIONS: Array<{
  id: CardStyle;
  zh: string;
  en: string;
  previewBg: string;
  previewDot: string;
}> = [
    { id: "cream-rose", zh: "奶油粉笺", en: "Cream Rose", previewBg: "bg-[#fdf3f0]", previewDot: "bg-rose-400" },
    { id: "dark-gold", zh: "黑巧鎏金", en: "Dark Gold", previewBg: "bg-[#3d1e10]", previewDot: "bg-amber-300" },
    { id: "starry-violet", zh: "星夜紫韵", en: "Starry Violet", previewBg: "bg-[#262154]", previewDot: "bg-violet-300" },
    { id: "mint-fresh", zh: "清新薄荷", en: "Fresh Mint", previewBg: "bg-[#e9fcf1]", previewDot: "bg-emerald-500" },
    { id: "none", zh: "不显示卡片", en: "No Card", previewBg: "bg-slate-800", previewDot: "bg-slate-500" },
  ];

const MUSIC_STYLE_OPTIONS: Array<{ id: MusicStyle; zh: string; en: string; descZh: string; descEn: string }> = [
  { id: "musicbox", zh: "八音盒", en: "Music Box", descZh: "清脆温柔", descEn: "Delicate celesta" },
  { id: "piano", zh: "温馨钢琴", en: "Warm Piano", descZh: "柔美华尔兹", descEn: "Soft waltz" },
  { id: "chimes", zh: "梦幻风铃", en: "Dream Chimes", descZh: "空灵星铃", descEn: "Ethereal bells" },
];

const CELEBRATION_SFX_OPTIONS: Array<{
  id: CelebrationSfxStyle;
  zh: string;
  en: string;
  descZh: string;
  descEn: string;
}> = [
    { id: "grand-party", zh: "盛大派对", en: "Grand Party", descZh: "礼花 + 号角 + 欢呼 + 烟花", descEn: "Poppers, fanfare & fireworks" },
    { id: "fireworks-show", zh: "璀璨烟花秀", en: "Fireworks Show", descZh: "连续高空烟花绽放", descEn: "Multi-burst stereo fireworks" },
    { id: "fairy-chimes", zh: "梦幻星铃", en: "Fairy Chimes", descZh: "浪漫竖琴与水晶风铃", descEn: "Dreamy harp & crystal chimes" },
    { id: "carnival-cheer", zh: "欢呼彩炮", en: "Carnival Cheers", descZh: "三连彩炮 + 喇叭 + 热烈欢呼", descEn: "Confetti cannons & party horns" },
    { id: "warm-applause", zh: "温馨掌声", en: "Warm Applause", descZh: "温暖鼓掌 + 柔情钢琴和弦", descEn: "Cozy applause & warm piano" },
  ];

export const ConfigurePage: React.FC<ConfigurePageProps> = ({ initialLang }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = initialLang;
  const t = getTranslation(lang);
  const isRTL = isRtlLanguage(lang);
  const isZh = lang === "zh" || lang === "zh-Hant";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialStepParam = Number(searchParams.get("step") || "1");
  const [currentStep, setCurrentStep] = useState<number>(
    initialStepParam >= 1 && initialStepParam <= 4 ? initialStepParam : 1
  );

  const [thumbnails3D, setThumbnails3D] = useState<Record<string, string>>({});
  const [supports3D, setSupports3D] = useState<boolean>(false);

  const {
    selectedCakeId,
    configCompleted,
    candleType,
    candleCount,
    digits,
    isExtinguished,
    isBlowing,
    blowingProgress,
    customCakes,
    userName,
    customMessage,
    giverName,
    isBlowLocked,
    blowSensitivity,
    cardStyle = "cream-rose",
    sceneTheme = "fairy-lights",
    musicStyle,
    celebrationSfxStyle,
    renderMode,
    updateState,
    setMusicStyle,
    setCelebrationSfxStyle,
  } = useAppStore();

  const {
    copyShareLink,
    shareFeedback,
    shareModalOpen,
    shareUrl,
    openShareDialog,
    closeShareDialog,
  } = useShareLink();

  const state = {
    selectedCakeId,
    configCompleted,
    candleType,
    candleCount,
    digits,
    isExtinguished,
    isBlowing,
    blowingProgress,
    customCakes,
    userName,
    customMessage,
    giverName,
    isBlowLocked,
    blowSensitivity,
    cardStyle,
    sceneTheme,
  };

  // 支持 3D 时，使用共享离屏渲染器生成高清特写 3D 蛋糕缩略图
  useEffect(() => {
    const info = detectWebGLSupport();
    setSupports3D(info.supported);
    if (info.supported) {
      let cancelled = false;
      renderCake3DThumbnails(CAKES.map((c) => c.id)).then((map) => {
        if (!cancelled) {
          setThumbnails3D(map);
        }
      });
      return () => {
        cancelled = true;
      };
    }
  }, []);

  useEffect(() => {
    return () => {
      birthdayAudio.clearCelebrationTimers();
    };
  }, []);

  const show3DThumbs = supports3D && renderMode !== "2d";

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const id = `custom-${Date.now()}`;
      updateState({
        customCakes: { ...customCakes, [id]: dataUrl },
        selectedCakeId: id,
      });
    };
    reader.readAsDataURL(file);
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const item = e.clipboardData.items[0];
    if (item?.type.startsWith("image/")) {
      handleFile(item.getAsFile()!);
    }
  };

  const steps = [
    { id: 1, title: t.chooseCake },
    { id: 2, title: t.chooseCandle },
    { id: 3, title: t.customize },
    { id: 4, title: isZh ? "音效与吹气" : "Audio & Mic" },
  ];

  const handleComplete = () => {
    updateState({
      configCompleted: true,
      isExtinguished: false,
      isBlowing: false,
      blowingProgress: 0,
    });
    router.push(`/${lang}`);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      onPaste={onPaste}
      className="h-[100dvh] w-full bg-slate-950 text-white flex flex-col lg:grid lg:grid-cols-[1.15fr_1fr] overflow-hidden"
    >
      {/* 左侧（桌面端）/ 顶部（移动端）：专属清晰蛋糕实时预览区（不半透明遮挡） */}
      <section className="relative h-[40dvh] sm:h-[44dvh] lg:h-full w-full shrink-0 bg-gradient-to-b from-[#11152c] via-slate-950 to-[#090d1f] border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
        {/* 顶部返回主页链接（悬浮在预览区右上角，与左上角 3D/2D 切换按钮对称） */}
        <div className="absolute top-4 right-4 z-40">
          <Link
            href={`/${lang}`}
            onClick={() => updateState({ configCompleted: false, isExtinguished: false, blowingProgress: 0 })}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/65 hover:bg-slate-800/85 backdrop-blur-md border border-white/15 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span>{t.backToHome || (isZh ? "返回首页" : "Home")}</span>
          </Link>
        </div>

        {/* 随场景氛围主题实时变化的柔美光晕 */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden transition-all duration-700">
          {sceneTheme === "starry-night" ? (
            <>
              <div className="absolute -top-1/4 -left-1/4 w-[65%] h-[65%] rounded-full bg-indigo-500/20 blur-[140px]" />
              <div className="absolute -bottom-1/4 -right-1/4 w-[65%] h-[65%] rounded-full bg-cyan-400/14 blur-[140px]" />
            </>
          ) : sceneTheme === "warm-candlelight" ? (
            <>
              <div className="absolute -top-1/4 -left-1/4 w-[65%] h-[65%] rounded-full bg-amber-400/18 blur-[140px]" />
              <div className="absolute -bottom-1/4 -right-1/4 w-[65%] h-[65%] rounded-full bg-orange-400/14 blur-[140px]" />
            </>
          ) : sceneTheme === "cherry-blossom" ? (
            <>
              <div className="absolute -top-1/4 -left-1/4 w-[65%] h-[65%] rounded-full bg-pink-400/22 blur-[140px]" />
              <div className="absolute -bottom-1/4 -right-1/4 w-[65%] h-[65%] rounded-full bg-rose-300/16 blur-[140px]" />
            </>
          ) : sceneTheme === "minimal-studio" ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55%] h-[55%] rounded-full bg-slate-400/8 blur-[120px]" />
          ) : (
            <>
              <div className="absolute -top-1/4 -left-1/4 w-[65%] h-[65%] rounded-full bg-pink-400/15 blur-[140px]" />
              <div className="absolute -bottom-1/4 -right-1/4 w-[65%] h-[65%] rounded-full bg-amber-300/12 blur-[140px]" />
            </>
          )}
        </div>

        {/* 实时 3D / 2D 蛋糕预览组件（Name / Message / From 均已清晰渲染在 3D 与 2D 蛋糕卡片上） */}
        <div className="relative w-full h-full">
          <CakeScene
            state={state}
            t={t}
            updateState={updateState}
            lang={lang}
            mode="configure-preview"
          />
        </div>
      </section>

      {/* 右侧（桌面端）/ 底部（移动端）：纯净不透明结构化配置面板 */}
      <section className="flex-1 min-h-0 flex flex-col bg-slate-950">
        {/* 顶部标题与步骤导航 */}
        <div className="shrink-0 px-5 sm:px-8 pt-4 sm:pt-7 pb-4 border-b border-white/10 bg-slate-950">
            <div className="flex items-center justify-between mb-4 gap-2">
              <h1 className="text-base sm:text-xl font-serif font-black tracking-tight text-white">
                {t.arrangeCake}
              </h1>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openShareDialog}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-[11px] font-semibold text-slate-200 transition-all active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                    <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                  </svg>
                  <span>{t.share}</span>
                </button>
                <button
                  type="button"
                  onClick={handleComplete}
                  className="text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors"
                >
                  {t.completeConfig}
                </button>
              </div>
            </div>

            {/* 4 步可点击步骤条 */}
            <ol className="grid grid-cols-4 gap-2">
              {steps.map((step) => {
                const active = currentStep === step.id;
                const done = currentStep > step.id;
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-full flex flex-col items-center gap-1.5 py-2 px-1 rounded-2xl border transition-all ${active
                          ? "bg-pink-500/15 border-pink-400/50 text-pink-200"
                          : done
                            ? "bg-slate-900 border-white/10 text-slate-300 hover:border-white/20"
                            : "bg-slate-900/50 border-white/5 text-slate-500 hover:text-slate-300"
                        }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${active || done
                            ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                            : "bg-slate-800 text-slate-400"
                          }`}
                      >
                        {step.id}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-bold tracking-wide truncate max-w-full">
                        {step.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* 中部独立滚动配置内容区 */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 sm:py-7">
            {/* Step 1: 蛋糕选择器（支持 3D 时渲染高清 3D 立体蛋糕且突出放大展示） */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                    {t.selectCake}
                  </h2>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/15 hover:bg-pink-500/25 border border-pink-400/35 text-[11px] font-bold text-pink-300 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                    <span>{t.uploadCustom}</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    aria-label={t.uploadCustom}
                  />
                </div>

                {/* 2 列破框立体大卡片：完整无截断的 3D 蛋糕主体自然浮出紧凑卡片边缘 */}
                <div className="grid grid-cols-2 gap-x-5 sm:gap-x-6 gap-y-9 sm:gap-y-10 pt-7 pb-3 px-2">
                  {CAKES.map((cake) => {
                    const isSelected = selectedCakeId === cake.id;
                    const thumb3D = thumbnails3D[cake.id];
                    const label = CAKE_DISPLAY_NAMES[cake.id]
                      ? isZh
                        ? CAKE_DISPLAY_NAMES[cake.id].zh
                        : CAKE_DISPLAY_NAMES[cake.id].en
                      : cake.name;

                    return (
                      <button
                        key={cake.id}
                        type="button"
                        onClick={() => updateState({ selectedCakeId: cake.id })}
                        aria-label={label}
                        aria-pressed={isSelected}
                        className={`group relative overflow-visible flex flex-col items-center justify-end h-32 sm:h-36 rounded-3xl pb-2.5 px-2 border-2 transition-all duration-300 ${isSelected
                            ? "border-pink-400 bg-gradient-to-b from-pink-500/20 via-slate-900 to-slate-900 shadow-[0_0_28px_rgba(244,114,182,0.24)]"
                            : "border-white/10 bg-slate-900/80 hover:border-white/25 hover:bg-slate-900"
                          }`}
                      >
                        {/* 柔和背光圆晕（置于容器内层） */}
                        <div className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden">
                          <div
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-2xl transition-opacity ${isSelected ? "bg-pink-400/25 opacity-100" : "bg-white/10 opacity-35 group-hover:opacity-70"
                              }`}
                          />
                        </div>

                        {/* 破框立体蛋糕主体：完整不裁切、透明背景，略微向上超出卡片边界 */}
                        <div className="pointer-events-none relative z-10 -mt-10 sm:-mt-11 w-[114%] max-w-[192px] aspect-square flex items-center justify-center">
                          {show3DThumbs && thumb3D ? (
                            <img
                              src={thumb3D}
                              alt={label}
                              className={`w-full h-full object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.55)] transition-transform duration-300 ${isSelected
                                  ? "-translate-y-1.5 scale-[1.06]"
                                  : "group-hover:-translate-y-1 group-hover:scale-[1.04]"
                                }`}
                            />
                          ) : (
                            cake.Component && (
                              <div
                                className={`w-[84%] h-[84%] drop-shadow-[0_12px_18px_rgba(0,0,0,0.45)] transition-transform duration-300 ${isSelected
                                    ? "-translate-y-1.5 scale-[1.06]"
                                    : "group-hover:-translate-y-1 group-hover:scale-[1.04]"
                                  }`}
                              >
                                <cake.Component />
                              </div>
                            )
                          )}
                        </div>

                        <div className="relative z-10 -mt-3 flex items-center gap-1.5">
                          <span
                            className={`text-xs font-bold tracking-wide ${isSelected ? "text-pink-200" : "text-slate-300"
                              }`}
                          >
                            {label}
                          </span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {/* 用户自定义上传蛋糕 */}
                  {Object.entries(customCakes).map(([id, url]) => {
                    const isSelected = selectedCakeId === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => updateState({ selectedCakeId: id })}
                        className={`relative flex flex-col items-center justify-between h-32 sm:h-36 rounded-3xl p-2.5 border-2 transition-all overflow-hidden ${isSelected
                            ? "border-pink-400 bg-pink-500/15 shadow-lg"
                            : "border-white/10 bg-slate-900/80 hover:border-white/25"
                          }`}
                      >
                        <div className="w-full flex-1 min-h-0 rounded-2xl overflow-hidden bg-slate-800">
                          <img src={url} alt="Custom" className="w-full h-full object-cover" />
                        </div>
                        <span className="mt-1.5 text-xs font-bold text-slate-200">
                          {isZh ? "自定义照片" : "Custom"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 场景环境氛围自由搭配 */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                    {isZh ? "场景氛围与环境" : "Scene Atmosphere"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SCENE_THEME_OPTIONS.map((opt) => {
                      const active = sceneTheme === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => updateState({ sceneTheme: opt.id })}
                          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-semibold transition-all ${active
                              ? "border-pink-400 bg-pink-500/15 text-pink-100 shadow-md"
                              : "border-white/10 bg-slate-900/75 text-slate-300 hover:border-white/25 hover:text-white"
                            }`}
                        >
                          <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${opt.swatch}`} />
                          <span>{isZh ? opt.zh : opt.en}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: 蜡烛款式与数量 */}
            {currentStep === 2 && (
              <div className="space-y-7">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  {t.chooseCandle}
                </h2>

                <div className="grid grid-cols-2 bg-slate-900 p-1.5 rounded-2xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => updateState({ candleType: CandleType.CLASSIC })}
                    className={`py-3 rounded-xl text-xs font-black transition-all ${candleType === CandleType.CLASSIC
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                      }`}
                  >
                    {t.classic}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateState({ candleType: CandleType.DIGITS })}
                    className={`py-3 rounded-xl text-xs font-black transition-all ${candleType === CandleType.DIGITS
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                        : "text-slate-400 hover:text-white"
                      }`}
                  >
                    {t.digits}
                  </button>
                </div>

                {candleType === CandleType.CLASSIC ? (
                  <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-5 sm:p-6">
                    <div className="flex justify-between items-end mb-6">
                      <div className="flex items-center gap-2">
                        <label className="text-slate-300 text-xs font-bold uppercase tracking-wider">
                          {t.numberOfCandles}
                        </label>
                        <span className="text-[10px] text-slate-500">{t.optional}</span>
                      </div>
                      <span className="text-4xl sm:text-5xl font-serif font-black text-pink-400">
                        {candleCount}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={candleCount}
                      onChange={(e) => updateState({ candleCount: parseInt(e.target.value, 10) })}
                      className="w-full accent-pink-500 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
                      aria-label={t.numberOfCandles}
                    />
                    <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                      <span>1</span>
                      <span>18</span>
                      <span>30</span>
                      <span>50</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-5 sm:p-6">
                    <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider mb-4">
                      {t.digitValue}
                      <span className="ml-2 text-[10px] text-slate-500">{t.optional}</span>
                    </label>
                    <input
                      type="text"
                      value={digits}
                      maxLength={4}
                      onChange={(e) => updateState({ digits: e.target.value.replace(/[^0-9]/g, "") })}
                      className="w-full px-6 py-4 bg-slate-950 border-2 border-slate-700 rounded-2xl focus:border-pink-400 focus:outline-none text-center text-4xl tracking-[0.2em] font-serif font-black text-pink-400"
                      placeholder="18"
                      aria-label={t.digitValue}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Step 3: 个性化祝福设置与卡片样式搭配 */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  {t.customize}
                </h2>

                {/* 祝福卡片风格选择器 */}
                <div className="space-y-2.5">
                  <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider">
                    {isZh ? "祝福卡片样式" : "Greeting Card Style"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CARD_STYLE_OPTIONS.map((opt) => {
                      const active = cardStyle === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => updateState({ cardStyle: opt.id })}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl border text-xs font-semibold transition-all ${active
                              ? "border-pink-400 bg-pink-500/15 text-pink-100 shadow-md"
                              : "border-white/10 bg-slate-900/75 text-slate-300 hover:border-white/25 hover:text-white"
                            }`}
                        >
                          <span className={`w-4 h-3 rounded-sm border border-white/25 flex items-center justify-center ${opt.previewBg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${opt.previewDot}`} />
                          </span>
                          <span>{isZh ? opt.zh : opt.en}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider">
                    {t.name}
                    <span className="ml-2 text-[10px] text-slate-500">{t.optional}</span>
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => updateState({ userName: e.target.value })}
                    placeholder={t.enterName}
                    className="w-full px-5 py-3.5 bg-slate-900 border border-white/15 rounded-2xl focus:border-pink-400 focus:outline-none text-base font-serif font-bold text-white placeholder:text-slate-500"
                    aria-label={t.name}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider">
                    {t.from}
                    <span className="ml-2 text-[10px] text-slate-500">{t.optional}</span>
                  </label>
                  <input
                    type="text"
                    value={giverName}
                    onChange={(e) => updateState({ giverName: e.target.value })}
                    placeholder={t.enterGiverName}
                    className="w-full px-5 py-3.5 bg-slate-900 border border-white/15 rounded-2xl focus:border-pink-400 focus:outline-none text-base font-serif font-bold text-white placeholder:text-slate-500"
                    aria-label={t.from}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-300 text-xs font-bold uppercase tracking-wider">
                    {t.message}
                    <span className="ml-2 text-[10px] text-slate-500">{t.optional}</span>
                  </label>
                  <input
                    type="text"
                    value={customMessage}
                    onChange={(e) => updateState({ customMessage: e.target.value })}
                    placeholder={t.enterMessage}
                    className="w-full px-5 py-3.5 bg-slate-900 border border-white/15 rounded-2xl focus:border-pink-400 focus:outline-none text-base font-serif font-bold text-white placeholder:text-slate-500"
                    aria-label={t.message}
                  />
                </div>
              </div>
            )}

            {/* Step 4: 音乐/庆祝音效搭配 + 吹气灵敏度与采样校准 */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* 吹灭前《生日快乐歌》乐器选择（点击即试听） */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      {isZh ? "吹灭前 · 生日快乐歌" : "Before Blowing · Birthday Song"}
                    </h2>
                    <span className="text-[10px] text-slate-500">
                      {isZh ? "点击可试听" : "Tap to preview"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {MUSIC_STYLE_OPTIONS.map((opt) => {
                      const active = musicStyle === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            setMusicStyle(opt.id);
                            birthdayAudio.previewMusicStyle(opt.id);
                          }}
                          className={`flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-2xl border text-left transition-all ${active
                              ? "border-amber-400/70 bg-amber-400/15 text-amber-100 shadow-md"
                              : "border-white/10 bg-slate-900/75 text-slate-300 hover:border-white/25 hover:text-white"
                            }`}
                        >
                          <span className="text-xs font-bold">{isZh ? opt.zh : opt.en}</span>
                          <span className="text-[10px] text-slate-400 truncate max-w-full">
                            {isZh ? opt.descZh : opt.descEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                  {/* 吹灭后庆祝音效风格选择（5 种风格自由切换 + 即时试听） */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        {isZh ? "吹灭后 · 庆祝音效" : "After Blowing · Celebration SFX"}
                      </h2>
                      <span className="text-[10px] text-slate-500">
                        {isZh ? "点击可试听" : "Tap to preview"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CELEBRATION_SFX_OPTIONS.map((opt) => {
                        const active = celebrationSfxStyle === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setCelebrationSfxStyle(opt.id);
                              birthdayAudio.previewCelebrationStyle(opt.id);
                            }}
                            className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl border text-left transition-all ${active
                                ? "border-pink-400 bg-pink-500/15 text-pink-100 shadow-md"
                                : "border-white/10 bg-slate-900/75 text-slate-300 hover:border-white/25 hover:text-white"
                              }`}
                          >
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate">{isZh ? opt.zh : opt.en}</div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {isZh ? opt.descZh : opt.descEn}
                              </div>
                            </div>
                            <span
                              className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${active ? "bg-pink-500/30 text-pink-200" : "bg-white/5 text-slate-400"
                                }`}
                              aria-hidden="true"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                              </svg>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 吹气灵敏度 */}
                  <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-slate-300">{t.sensitivity}</span>
                      <span className="text-sm font-black text-pink-400">{blowSensitivity}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400 font-bold">{t.sensitivityLow}</span>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={blowSensitivity}
                        onChange={(e) => updateState({ blowSensitivity: parseInt(e.target.value, 10) })}
                        className="flex-1 accent-pink-500 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer"
                        aria-label={t.sensitivity}
                      />
                      <span className="text-[11px] text-slate-400 font-bold">{t.sensitivityHigh}</span>
                    </div>
                  </div>

                  <BlowCalibrationCard t={t} active={currentStep === 4} />
                </div>
          )}
              </div>

        {/* 底部固定操作条 */}
            <div className="shrink-0 px-5 sm:px-8 py-4 border-t border-white/10 bg-slate-950 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`flex-1 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${currentStep === 1
                      ? "bg-slate-900 text-slate-600 cursor-not-allowed border border-white/5"
                      : "bg-slate-800 hover:bg-slate-700 text-white border border-white/10"
                    }`}
                >
                  {t.prevStep}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-[1.4] py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:brightness-105 text-white font-black rounded-2xl shadow-xl shadow-pink-500/20 transition-all active:scale-95 uppercase tracking-[0.2em] text-xs"
                >
                  {currentStep === 4 ? t.completeConfig : t.nextStep}
                </button>
              </div>
            </div>
          </section>

          {/* 分享链接对话框 */}
          <ShareModal
            isOpen={shareModalOpen}
            shareUrl={shareUrl}
            copyStatus={shareFeedback}
            onCopy={() => copyShareLink({ persistFeedback: true, explicitUrl: shareUrl })}
            onClose={closeShareDialog}
            lang={lang}
            t={t}
            summary={{
              userName,
              giverName,
              customMessage,
              isCustomCake: selectedCakeId.startsWith("custom-"),
            }}
          />
        </div>
        );
};

        export default ConfigurePage;
