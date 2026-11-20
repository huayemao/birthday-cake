"use client";

import { useEffect } from "react";
import * as LZString from "lz-string";
import { useAppStore } from "@/store/useAppStore";
import { CandleType, CardStyle, CelebrationSfxStyle, SceneTheme } from "@/types";
import { MusicStyle } from "@/utils/birthdayAudio";

const VALID_CARD_STYLES: ReadonlySet<string> = new Set<CardStyle>([
  "cream-rose",
  "dark-gold",
  "starry-violet",
  "mint-fresh",
  "none",
]);

const VALID_SCENE_THEMES: ReadonlySet<string> = new Set<SceneTheme>([
  "fairy-lights",
  "starry-night",
  "warm-candlelight",
  "cherry-blossom",
  "minimal-studio",
]);

const VALID_MUSIC_STYLES: ReadonlySet<string> = new Set<MusicStyle>([
  "musicbox",
  "piano",
  "chimes",
]);

const VALID_SFX_STYLES: ReadonlySet<string> = new Set<CelebrationSfxStyle>([
  "grand-party",
  "fireworks-show",
  "fairy-chimes",
  "carnival-cheer",
  "warm-applause",
]);

/**
 * 解析分享链接中的 ?config= 参数，完整还原：
 * 蛋糕款式、自定义图、蜡烛款式/数量/数字、收件人/祝福语/赠送人、
 * 祝福卡片风格、场景氛围主题、生日快乐歌乐器风格与吹灭后庆祝音效风格。
 */
export const useUrlConfig = () => {
  const { updateState, setMusicStyle, setCelebrationSfxStyle } = useAppStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const configParam = urlParams.get("config");

        if (!configParam) return;

        try {
          const decompressedConfig = LZString.decompressFromEncodedURIComponent(configParam);
          if (!decompressedConfig) return;

          const parsed = JSON.parse(decompressedConfig) as Record<string, unknown>;

          const updates: Parameters<typeof updateState>[0] = {
            configCompleted: true,
            isExtinguished: false,
            isBlowing: false,
            blowingProgress: 0,
          };

          if (typeof parsed.selectedCakeId === "string" && parsed.selectedCakeId) {
            updates.selectedCakeId = parsed.selectedCakeId;
          }
          if (parsed.candleType === CandleType.CLASSIC || parsed.candleType === CandleType.DIGITS) {
            updates.candleType = parsed.candleType;
          }
          if (typeof parsed.candleCount === "number" && Number.isFinite(parsed.candleCount)) {
            updates.candleCount = Math.max(1, Math.min(50, Math.round(parsed.candleCount)));
          }
          if (typeof parsed.digits === "string") {
            updates.digits = parsed.digits.replace(/[^0-9]/g, "").slice(0, 4) || "0";
          }
          if (parsed.customCakes && typeof parsed.customCakes === "object") {
            updates.customCakes = parsed.customCakes as Record<string, string>;
          }
          if (typeof parsed.userName === "string") {
            updates.userName = parsed.userName;
          }
          if (typeof parsed.customMessage === "string") {
            updates.customMessage = parsed.customMessage;
          }
          if (typeof parsed.giverName === "string") {
            updates.giverName = parsed.giverName;
          }
          if (typeof parsed.cardStyle === "string" && VALID_CARD_STYLES.has(parsed.cardStyle)) {
            updates.cardStyle = parsed.cardStyle as CardStyle;
          }
          if (typeof parsed.sceneTheme === "string" && VALID_SCENE_THEMES.has(parsed.sceneTheme)) {
            updates.sceneTheme = parsed.sceneTheme as SceneTheme;
          }

          updateState(updates);

          if (typeof parsed.musicStyle === "string" && VALID_MUSIC_STYLES.has(parsed.musicStyle)) {
            setMusicStyle(parsed.musicStyle as MusicStyle);
          }
          if (
            typeof parsed.celebrationSfxStyle === "string" &&
            VALID_SFX_STYLES.has(parsed.celebrationSfxStyle)
          ) {
            setCelebrationSfxStyle(parsed.celebrationSfxStyle as CelebrationSfxStyle);
          }
        } catch (err) {
          console.error("Failed to parse config from URL:", err);
        }
}, [updateState, setMusicStyle, setCelebrationSfxStyle]);

return null;
};
