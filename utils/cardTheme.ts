import { CardStyle } from "@/types";

export interface CardPalette {
  bg1: string;
  bg2: string;
  sideColor: number;
  border: string;
  subBorder: string;
  emblem: string;
  emblemText: string;
  primaryInk: string;
  secondaryInk: string;
  fromInk: string;
  stars?: boolean;
}

export const CARD_PALETTES: Record<Exclude<CardStyle, "none">, CardPalette> = {
  "cream-rose": {
    bg1: "#fdf6f0",
    bg2: "#f9e5ec",
    sideColor: 0xf3d5df,
    border: "#d97a99",
    subBorder: "rgba(217, 122, 153, 0.38)",
    emblem: "#e11d48",
    emblemText: "✦   ♥   ✦",
    primaryInk: "#881337",
    secondaryInk: "#9f1239",
    fromInk: "#be185d",
  },
  "dark-gold": {
    bg1: "#422011",
    bg2: "#2d1409",
    sideColor: 0x4a2413,
    border: "#e5be63",
    subBorder: "rgba(229, 190, 99, 0.42)",
    emblem: "#f3d47e",
    emblemText: "✦   ♛   ✦",
    primaryInk: "#fef3c7",
    secondaryInk: "#fde68a",
    fromInk: "#f3d47e",
  },
  "starry-violet": {
    bg1: "#272356",
    bg2: "#1b1840",
    sideColor: 0x312e6b,
    border: "#c4b5fd",
    subBorder: "rgba(196, 181, 253, 0.36)",
    emblem: "#fde68a",
    emblemText: "✧   ☾   ✧",
    primaryInk: "#f5f3ff",
    secondaryInk: "#ddd6fe",
    fromInk: "#f9a8d4",
    stars: true,
  },
  "mint-fresh": {
    bg1: "#f0fdf6",
    bg2: "#dcfce9",
    sideColor: 0xc6ebd9,
    border: "#34a87c",
    subBorder: "rgba(52, 168, 124, 0.36)",
    emblem: "#059669",
    emblemText: "❀   ✿   ❀",
    primaryInk: "#065f46",
    secondaryInk: "#047857",
    fromInk: "#0f766e",
  },
};

export function getCardPalette(style: CardStyle = "cream-rose"): CardPalette {
  return CARD_PALETTES[style === "none" ? "cream-rose" : style] || CARD_PALETTES["cream-rose"];
}

export interface ResolvedCardText {
  titleText: string;
  bodyText: string;
  fromText: string;
}

export function resolveCardText(options: {
  userName?: string;
  customMessage?: string;
  giverName?: string;
  lang?: string;
}): ResolvedCardText {
  const { userName = "", customMessage = "", giverName = "", lang = "zh" } = options;
  const isZhHans = lang === "zh";
  const isZhHant = lang === "zh-Hant";

  const nameTrim = userName.trim();
  const msgTrim = customMessage.trim();
  const giverTrim = giverName.trim();

  const defaultTitle = isZhHans
    ? "生日快乐"
    : isZhHant
      ? "生日快樂"
      : "Happy Birthday";

  const defaultBody = isZhHans
    ? "祝你生日快乐，岁岁常欢愉"
    : isZhHant
      ? "祝你生日快樂，歲歲常歡愉"
      : "Wishing you a Happy Birthday!";

  const titleText = nameTrim || defaultTitle;
  const bodyText = msgTrim || (nameTrim ? defaultBody : "");
  const fromText = giverTrim ? `From: ${giverTrim}` : "";

  return { titleText, bodyText, fromText };
}
