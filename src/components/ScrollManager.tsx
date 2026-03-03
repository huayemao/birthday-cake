import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export const ScrollManager: React.FC = () => {
  const { configCompleted } = useAppStore();

  useEffect(() => {
    if (configCompleted) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [configCompleted]);

  return null;
};
