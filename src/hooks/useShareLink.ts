import { useCallback } from "react";
import * as LZString from "lz-string";
import { useAppStore } from "@/store/useAppStore";
import { getTranslation } from "@/i18n";

export const useShareLink = () => {
  const { lang, selectedCakeId, candleType, candleCount, digits, customCakes, userName, customMessage, giverName, updateState } = useAppStore();
  const t = getTranslation(lang);

  // 生成分享链接
  const generateShareLink = useCallback(() => {
    const shareState = {
      lang,
      selectedCakeId,
      configCompleted: true,
      candleType,
      candleCount,
      digits,
      isExtinguished: false,
      isBlowing: false,
      blowingProgress: 0,
      customCakes,
      userName,
      customMessage,
      giverName,
    };

    const jsonState = JSON.stringify(shareState);
    const compressedState = LZString.compressToEncodedURIComponent(jsonState);

    const url = new URL(window.location.href);
    url.searchParams.set("config", compressedState);
    return url.toString();
  }, [lang, selectedCakeId, candleType, candleCount, digits, customCakes, userName, customMessage, giverName]);

  // 复制分享链接到剪贴板
  const copyShareLink = useCallback(async () => {
    try {
      const shareLink = generateShareLink();
      await navigator.clipboard.writeText(shareLink);
      alert(t.copyLink + " ✓");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }, [generateShareLink, t.copyLink]);

  return {
    generateShareLink,
    copyShareLink,
  };
};
