import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

// 全屏只作用于蛋糕场景容器（#cake-stage），FAQ、header、footer 等不会被包含在全屏内。
export const FullscreenManager: React.FC = () => {
  const { configCompleted } = useAppStore();

  useEffect(() => {
    const requestFullscreenOnStage = async () => {
      const el = document.getElementById("cake-stage");
      if (!el) return;
      if (document.fullscreenElement) return; // 已在全屏中则不重复请求
      try {
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        } else if ((el as any).webkitRequestFullscreen) {
          await (el as any).webkitRequestFullscreen();
        } else if ((el as any).msRequestFullscreen) {
          await (el as any).msRequestFullscreen();
        }
      } catch (err) {
        console.warn("无法进入全屏模式:", err);
      }
    };

    const exitFullscreen = async () => {
      if (!document.fullscreenElement) return;
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.warn("无法退出全屏模式:", err);
      }
    };

    if (configCompleted) {
      requestFullscreenOnStage();
    } else {
      exitFullscreen();
    }
  }, [configCompleted]);

  return null;
};
