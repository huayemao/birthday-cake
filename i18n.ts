
import { Language, Translation } from './types';

export const TRANSLATIONS: Record<Language, Translation> = {
  en: {
    title: "Lumina Birthday",
    subtitle: "Make a wish and blow out the candles",
    chooseCake: "Select Your Cake",
    chooseCandle: "Candle Style",
    classic: "Classic",
    digits: "Digits",
    numberOfCandles: "Number of Candles",
    digitValue: "Enter Digits",
    blowPrompt: "Blow into your mic to extinguish the flames!",
    celebrate: "Happy Birthday!",
    reset: "Light Again",
    uploadCustom: "Upload/Paste Your Cake"
  },
  zh: {
    title: "华光生日",
    subtitle: "许下愿望，吹灭蜡烛",
    chooseCake: "选择蛋糕",
    chooseCandle: "蜡烛款式",
    classic: "经典",
    digits: "数字",
    numberOfCandles: "蜡烛数量",
    digitValue: "输入数字",
    blowPrompt: "对着麦克风吹气来熄灭蜡烛！",
    celebrate: "生日快乐！",
    reset: "重新点亮",
    uploadCustom: "上传/粘贴蛋糕"
  },
  ja: {
    title: "ルミナ・バースデー",
    subtitle: "願いを込めて、ろうそくを吹き消して",
    chooseCake: "ケーキを選ぶ",
    chooseCandle: "キャンドルのスタイル",
    classic: "クラシック",
    digits: "数字",
    numberOfCandles: "ろうそくの数",
    digitValue: "数字を入力",
    blowPrompt: "マイクに息を吹きかけて、ろうそくを消しましょう！",
    celebrate: "お誕生日おめでとう！",
    reset: "もう一度点灯",
    uploadCustom: "アップロード/貼り付け"
  },
  fr: {
    title: "Lumina Anniversaire",
    subtitle: "Faites un vœu et soufflez les bougies",
    chooseCake: "Choisissez votre gâteau",
    chooseCandle: "Style de bougie",
    classic: "Classique",
    digits: "Chiffres",
    numberOfCandles: "Nombre de bougies",
    digitValue: "Entrez les chiffres",
    blowPrompt: "Soufflez dans votre micro pour éteindre les flames !",
    celebrate: "Joyeux Anniversaire !",
    reset: "Rallumer",
    uploadCustom: "Téléverser/Coller"
  },
  ar: {
    title: "لومينا ميلاد",
    subtitle: "تمنى أمنية وأطفئ الشموع",
    chooseCake: "اختر كعكتك",
    chooseCandle: "نمط الشمع",
    classic: "كلاسيكي",
    digits: "أرقام",
    numberOfCandles: "عدد الشموع",
    digitValue: "أدخل الأرقام",
    blowPrompt: "انفخ في الميكروفون لإطفاء الشموع!",
    celebrate: "عيد ميلاد سعيد!",
    reset: "أشعلها مرة أخرى",
    uploadCustom: "رفع/لصق كعكتك"
  }
};

export const getTranslation = (lang: Language) => TRANSLATIONS[lang] || TRANSLATIONS.en;
