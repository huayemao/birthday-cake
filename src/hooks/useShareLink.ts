"use client";

import { useCallback, useState, useRef, useEffect } from "react";
import * as LZString from "lz-string";
import { useAppStore } from "@/store/useAppStore";
import { usePathname } from "next/navigation";
import { Language, languages } from "@/types";

export interface SharePayload {
  lang: Language;
  selectedCakeId: string;
  candleType: string;
  candleCount: number;
  digits: string;
  customCakes?: Record<string, string>;
  userName: string;
  customMessage: string;
  giverName: string;
  cardStyle: string;
  sceneTheme: string;
  musicStyle: string;
  celebrationSfxStyle: string;
}

/** 兼容性剪贴板复制（优先 Clipboard API，降级至隐藏 textarea + execCommand） */
async function copyTextSafe(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback below
    }
  }
  if (typeof document !== "undefined") {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
  return false;
}

export const useShareLink = () => {
  const pathname = usePathname();
  const firstSeg = pathname.split("/")[1] as Language;
  const lang: Language = (languages as readonly string[]).includes(firstSeg) ? firstSeg : "en";

  const {
    selectedCakeId,
    candleType,
    candleCount,
    digits,
    customCakes,
    userName,
    customMessage,
    giverName,
    cardStyle,
    sceneTheme,
    musicStyle,
    celebrationSfxStyle,
  } = useAppStore();

  const [shareFeedback, setShareFeedback] = useState<"idle" | "copied" | "error">("idle");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const feedbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current !== null) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const generateShareLink = useCallback(() => {
      // 仅在真正选中了自定义上传蛋糕时才携带该图片，避免无关图片撑爆分享链接长度
      const activeCustomCakes =
        selectedCakeId.startsWith("custom-") && customCakes[selectedCakeId]
          ? { [selectedCakeId]: customCakes[selectedCakeId] }
          : undefined;

      const sharePayload: SharePayload = {
        lang,
        selectedCakeId,
        candleType,
        candleCount,
        digits,
        ...(activeCustomCakes ? { customCakes: activeCustomCakes } : {}),
        userName,
        customMessage,
        giverName,
        cardStyle: cardStyle || "cream-rose",
        sceneTheme: sceneTheme || "fairy-lights",
        musicStyle,
        celebrationSfxStyle,
      };

      const compressedState = LZString.compressToEncodedURIComponent(
        JSON.stringify(sharePayload)
      );

  // 始终指向 /[lang]?config=...，即使在 /[lang]/configure 页面点分享也能让好友直达沉浸庆生场景！
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/${lang}?config=${compressedState}`;
}, [
  lang,
  selectedCakeId,
  candleType,
  candleCount,
  digits,
  customCakes,
  userName,
  customMessage,
  giverName,
  cardStyle,
  sceneTheme,
  musicStyle,
  celebrationSfxStyle,
]);

  const copyShareLink = useCallback(
    async (options?: { persistFeedback?: boolean; explicitUrl?: string }) => {
      const targetUrl = options?.explicitUrl || generateShareLink();
      setShareUrl(targetUrl);
      const ok = await copyTextSafe(targetUrl);

      if (feedbackTimerRef.current !== null) {
        clearTimeout(feedbackTimerRef.current);
        feedbackTimerRef.current = null;
      }
      setShareFeedback(ok ? "copied" : "error");
      if (!options?.persistFeedback) {
        feedbackTimerRef.current = window.setTimeout(() => {
          setShareFeedback("idle");
          feedbackTimerRef.current = null;
        }, 2600);
      }

      return ok;
    },
    [generateShareLink]
  );

  const openShareDialog = useCallback(async () => {
    const url = generateShareLink();
    setShareUrl(url);
    setShareModalOpen(true);
    await copyShareLink({ persistFeedback: true, explicitUrl: url });
  }, [generateShareLink, copyShareLink]);

  const closeShareDialog = useCallback(() => {
    setShareModalOpen(false);
    if (feedbackTimerRef.current !== null) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
    setShareFeedback("idle");
  }, []);

  return {
    generateShareLink,
    copyShareLink,
    shareFeedback,
    shareModalOpen,
    shareUrl,
    openShareDialog,
    closeShareDialog,
  };
};
