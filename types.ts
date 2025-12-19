
// Fix: Import React to provide the 'React' namespace for React.FC
import React from 'react';

export type Language = 'zh' | 'en' | 'ja' | 'fr' | 'ar';

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
  isBlowing: boolean;
  customCakes: Record<string, string>; // ID to DataURL
  userName: string; // 用户姓名
  customMessage: string; // 自定义祝福语
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
  // SEO相关字段
  keywords: string;
  description: string;
  // 拆分成不同字段的标题
  seoTitle: string;
  seoSubtitle1: string;
  seoSubtitle2: string;
}
