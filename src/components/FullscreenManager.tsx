import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export const FullscreenManager: React.FC = () => {
  const { configCompleted } = useAppStore();

  useEffect(() => {
    if (configCompleted) {
      const enterFullscreen = async () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
          await (elem as any).msRequestFullscreen();
        }
      };
      enterFullscreen().catch((err) => {
        console.warn("无法进入全屏模式:", err);
      });
    }
  }, [configCompleted]);

  return null;
};
