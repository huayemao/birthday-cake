import { useCallback } from "react";
import * as LZString from "lz-string";
import { useAppStore } from "@/store/useAppStore";
import { getTranslation } from "@/i18n";
import { usePathname } from "next/navigation";
import { Language } from "@/types";

export const useShareLink = () => {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] as Language || "en";
  const { selectedCakeId, candleType, candleCount, digits, customCakes, userName, customMessage, giverName } = useAppStore();
  const t = getTranslation(lang);

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
