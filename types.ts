
// Fix: Import React to provide the 'React' namespace for React.FC
import React from 'react';

export const languages = ['zh', 'en', 'ja', 'fr', 'ar', 'ko'] as const;

export type Language = 'zh' | 'en' | 'ja' | 'fr' | 'ar' | 'ko';

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  zh: "中文",
  ja: "日本語",
  fr: "Français",
  ar: "العربية",
  ko: "한국어",
};

export interface CakeOption {
  id: string;
  name: string;
  Component?: React.FC;
  customImage?: string;
  candleBaseY: number; // Percent from top for candle placement
  candleBaseWidth: number; // Percent width for candle distribution
}

export enum CandleType {
  CLASSIC = 'classic',
  DIGITS = 'digits'
}

export interface AppState {
  lang: Language;
  selectedCakeId: string;
  candleType: CandleType;
  candleCount: number;
  digits: string;
  isExtinguished: boolean;
  configCompleted: boolean;
  isBlowing: boolean;
  blowingProgress: number; // 吹气进度百分比 (0-100)
  customCakes: Record<string, string>; // ID to DataURL
  userName: string; // 用户姓名
  customMessage: string; // 自定义祝福语
  giverName: string; // 赠送人姓名
}

export interface Translation {
  title: string;
  subtitle: string;
  chooseCake: string;
  chooseCandle: string;
  classic: string;
  digits: string;
  numberOfCandles: string;
  digitValue: string;
  blowPrompt: string;
  celebrate: string;
  reset: string;
  uploadCustom: string;
  openControls: string;
  closeControls: string;
  completeConfig: string;
  backToConfig: string;
  restartPrompt: string;
  share: string;
  copyLink: string;
  configCompleteToBlow: string;
  // SEO 相关字段
  keywords: string;
  description: string;
  // 拆分成不同字段的标题
  seoTitle: string;
  seoSubtitle1: string;
  seoSubtitle2: string;
  customize: string;
  name: string;
  from: string;
  message: string;
  enterName: string;
  enterGiverName: string;
  enterMessage: string;
  optional: string;
  footerText: string;
  author: string;
  // 导航和页面相关字段
  aboutTitle?: string;
  guideTitle?: string;
  backToHome?: string;
  featuresTitle?: string;
  feature1?: string;
  feature2?: string;
  feature3?: string;
  feature4?: string;
  feature5?: string;
  feature6?: string;
  aboutContent1?: string;
  aboutContent2?: string;
  step1Title?: string;
  step1Content?: string;
  step2Title?: string;
  step2Content?: string;
  step3Title?: string;
  step3Content?: string;
  step4Title?: string;
  step4Content?: string;
  step5Title?: string;
  step5Content?: string;
  step6Title?: string;
  step6Content?: string;
  tipsTitle?: string;
  tip1?: string;
  tip2?: string;
  tip3?: string;
  tip4?: string;
}
