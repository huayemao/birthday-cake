"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Translation } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import {
  cleanupAudioResources,
  createBlowCalibrationState,
  feedBlowCalibrationAnalyser,
  finalizeBlowCalibration,
  getRecommendedFftSize,
  requestRawMicStream,
  RECOMMENDED_SMOOTHING_TIME_CONSTANT,
  BlowCalibrationSessionState,
} from "@/utils/blowDetection";

interface BlowCalibrationCardProps {
  t: Translation;
  /** 当宿主弹窗关闭或切走步骤时传 false，自动终止采样并释放麦克风 */
  active?: boolean;
}

type SamplingStatus = "idle" | "noise-baseline" | "listening" | "failed" | "mic-denied";

const MAX_SAMPLING_MS = 6500;

const BlowCalibrationCard: React.FC<BlowCalibrationCardProps> = ({ t, active = true }) => {
  const { blowCalibration, setBlowCalibration, setIsCalibratingBlow } = useAppStore();
  const [status, setStatus] = useState<SamplingStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [liveLevel, setLiveLevel] = useState(0);
  const [isDetectingBlow, setIsDetectingBlow] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const sessionRef = useRef<BlowCalibrationSessionState | null>(null);
  const cancelledRef = useRef(false);

  const stopSession = useCallback(
    (nextStatus: SamplingStatus = "idle") => {
      cancelledRef.current = true;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (audioContextRef.current || mediaStreamRef.current) {
        cleanupAudioResources(audioContextRef.current, mediaStreamRef.current);
        audioContextRef.current = null;
        mediaStreamRef.current = null;
      }
      sessionRef.current = null;
      setIsCalibratingBlow(false);
      setLiveLevel(0);
      setIsDetectingBlow(false);
      if (nextStatus !== "idle") {
        setStatus(nextStatus);
      } else {
        setStatus("idle");
        setProgress(0);
      }
    },
    [setIsCalibratingBlow]
  );

  useEffect(() => {
    if (!active) {
      stopSession("idle");
    }
  }, [active, stopSession]);

  useEffect(() => {
    return () => {
      stopSession("idle");
    };
  }, [stopSession]);

  const startSampling = async () => {
    stopSession("idle");
    cancelledRef.current = false;
    setIsCalibratingBlow(true);
    setStatus("noise-baseline");
    setProgress(0);
    setLiveLevel(0);

    try {
      // 给主吹气检测 hook 一帧时间释放已有麦克风流，避免移动端双流冲突
      await new Promise((resolve) => setTimeout(resolve, 60));
      if (cancelledRef.current) return;

      const stream = await requestRawMicStream();
      if (cancelledRef.current) {
        cleanupAudioResources(null, stream);
        return;
      }

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioCtx();
      if (audioContext.state === "suspended") {
        await audioContext.resume().catch(() => {});
      }
      if (cancelledRef.current) {
        cleanupAudioResources(audioContext, stream);
        return;
      }

      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      analyser.fftSize = getRecommendedFftSize(audioContext.sampleRate);
      analyser.smoothingTimeConstant = RECOMMENDED_SMOOTHING_TIME_CONSTANT;
      source.connect(analyser);

      mediaStreamRef.current = stream;
      audioContextRef.current = audioContext;
      const session = createBlowCalibrationState(420, 350);
      sessionRef.current = session;

      const loop = () => {
        if (cancelledRef.current || !sessionRef.current) return;

        const step = feedBlowCalibrationAnalyser(analyser, sessionRef.current);
        setLiveLevel(step.liveLevel);
        setProgress(step.progress);
        setIsDetectingBlow(step.isValidBlowFrame);

        if (step.phase === "noise-baseline") {
          setStatus("noise-baseline");
        } else if (step.phase === "listening") {
          setStatus("listening");
        } else if (step.phase === "complete" && step.profile) {
          setBlowCalibration(step.profile);
          stopSession("idle");
          return;
        }

        if (sessionRef.current.elapsedMs >= MAX_SAMPLING_MS) {
          const fallbackProfile = finalizeBlowCalibration(sessionRef.current, 180);
          if (fallbackProfile) {
            setBlowCalibration(fallbackProfile);
            stopSession("idle");
          } else {
            stopSession("failed");
          }
          return;
        }

        rafIdRef.current = requestAnimationFrame(loop);
      };

      rafIdRef.current = requestAnimationFrame(loop);
    } catch {
      stopSession("mic-denied");
    }
  };

  const isSampling = status === "noise-baseline" || status === "listening";

  const title = t.blowCalibrationTitle || "Blow Sample Calibration";
  const desc =
    t.blowCalibrationDesc ||
    "Record a quick blow to match your device's mic and filter out noise";
  const startLabel = t.blowCalibrationStart || "Sample My Blow";
  const stopLabel = t.blowCalibrationStop || "Cancel";
  const recalibrateLabel = t.blowCalibrationRecalibrate || "Resample";
  const clearLabel = t.blowCalibrationClear || "Clear";
  const noiseLabel =
    t.blowCalibrationListeningNoise || "Stay quiet, measuring background noise...";
  const promptLabel =
    t.blowCalibrationPrompt || "Blow steadily into your microphone now...";
  const successLabel = t.blowCalibrationSuccess || "Calibrated · Enhanced Accuracy";
  const failedLabel =
    t.blowCalibrationFailed || "No blow detected. Try blowing closer to the mic.";
  const micDeniedLabel =
    t.blowCalibrationMicDenied || "Microphone access denied. Check browser permissions.";

  return (
    <div className="mt-8 p-5 rounded-[1.5rem] bg-white/5 border border-white/10 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-pink-400 shrink-0"
            aria-hidden="true"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
          <span className="text-[11px] font-black uppercase tracking-widest text-white/90">
            {title}
          </span>
          <span className="text-[9px] text-gray-400 uppercase tracking-widest">
            {t.optional}
          </span>
        </div>

        {blowCalibration && !isSampling && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[10px] font-bold text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ✓
          </span>
        )}
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>

      {isSampling ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span
              className={`font-bold ${
                isDetectingBlow
                  ? "text-pink-400"
                  : status === "noise-baseline"
                  ? "text-amber-300"
                  : "text-white/80"
              }`}
            >
              {status === "noise-baseline" ? noiseLabel : promptLabel}
            </span>
            <span className="font-mono text-pink-400 font-black">{progress}%</span>
          </div>

          {/* 采样进度条 */}
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 实时麦克风音量波形条 */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-75 ${
                  isDetectingBlow ? "bg-emerald-400" : "bg-white/40"
                }`}
                style={{ width: `${Math.max(4, liveLevel)}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => stopSession("idle")}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-wider text-white/80 transition-colors"
            >
              {stopLabel}
            </button>
          </div>
        </div>
      ) : blowCalibration ? (
        <div className="space-y-3">
          <div className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/25 text-xs font-bold text-emerald-300 flex items-center gap-2">
            <span>✓</span>
            <span>{successLabel}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={startSampling}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-black uppercase tracking-wider transition-all"
            >
              {recalibrateLabel}
            </button>
            <button
              type="button"
              onClick={() => {
                setBlowCalibration(null);
                setStatus("idle");
              }}
              className="py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-300 hover:text-rose-300 border border-white/10 text-[11px] font-bold uppercase tracking-wider transition-all"
            >
              {clearLabel}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {status === "failed" && (
            <p className="text-xs text-amber-300 font-medium">{failedLabel}</p>
          )}
          {status === "mic-denied" && (
            <p className="text-xs text-rose-400 font-medium">{micDeniedLabel}</p>
          )}
          <button
            type="button"
            onClick={startSampling}
            className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-pink-500/25 border border-pink-400/30 hover:border-pink-400/60 text-white text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            <span>{startLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BlowCalibrationCard;
