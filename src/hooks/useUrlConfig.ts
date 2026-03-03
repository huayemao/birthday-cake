import { useEffect } from "react";
import * as LZString from "lz-string";
import { useAppStore } from "@/store/useAppStore";

export const useUrlConfig = () => {
  const { updateState } = useAppStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const configParam = urlParams.get("config");

    if (configParam) {
      try {
        const decompressedConfig = LZString.decompressFromEncodedURIComponent(configParam);
        if (decompressedConfig) {
          const parsedConfig = JSON.parse(decompressedConfig);
          updateState({ ...parsedConfig, configCompleted: true });
        }
      } catch (err) {
        console.error("Failed to parse config from URL:", err);
      }
    }
  }, [updateState]);

  return null;
};
