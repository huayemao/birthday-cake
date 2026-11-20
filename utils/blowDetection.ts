/**
 * 基于真实手机吹气采样（public/blow-effect.mp3）标定的多特征声学吹气检测算法。
 *
 * 吹气撞击麦克风振膜具有非常稳定的物理声学指纹，与人声/唱歌/掌声/音乐/环境噪音有显著区别：
 * 1. 负斜率宽带频谱（1/f^α 粉红-布朗湍流）：低频气流冲击（80-350 Hz）显著强于中频（1-3 kHz）
 *    和高频（3-7 kHz），同时中高频依然存在连续的宽带摩擦声（区别于纯低频敲击/空调嗡鸣，也区别于
 *    高频主导的嘘声/鼓掌/白噪音）。
 * 2. 高子带谱平坦度（Wiener Entropy）：湍流气流在 350Hz-7kHz 各子带内能量均匀铺开，没有尖锐谐波峰
 *    （区别于人声、合唱、乐器、口哨、警报等周期/谐波信号）。
 * 3. 低自相关周期性（Aperiodicity）：时域归一化自相关在 70-700 Hz 基频区间内峰值很低（~0.15-0.35），
 *    而浊音说话、唱生日歌、哼唱、手机震动等具有很强的基频周期峰（~0.50-0.90）。
 * 4. 低峰值因数 + 时间累积：排除拍手、敲桌、咳嗽、点击手机等短时瞬态冲击，并使用真实毫秒耗时（dtMs）
 *    累积与衰减，保证 30Hz/60Hz/120Hz 屏幕下一致的手感。
 * 5. 自适应环境底噪跟踪：过滤持续存在的空调、风扇、嘈杂房间底噪，仅响应显著高出环境底噪的吹气气流。
 */

export interface BlowDetectionConfig {
  /** 触发吹气所需的最低绝对音量 (dBFS) */
  minRmsDb: number;
  /** 高于自适应环境底噪的最低信噪比 (dB) */
  minSnrDb: number;
  /** 吹灭蜡烛所需的有效持续吹气时长 (ms) */
  requiredDurationMs: number;
  /** 中断时的进度回落倍率（相对 dtMs） */
  decayMultiplier: number;
  /** 麦克风开启后的底噪初始化静默校准期 (ms) */
  calibrationMs: number;

  /** 低频气流冲击主频段 (Hz)，避开手机硬件滚降的极低频和直流 */
  lowFreqStartHz: number;
  lowFreqEndHz: number;
  /** 低中频段 (Hz)，用于检测人声/和弦谐波 */
  lowMidFreqStartHz: number;
  lowMidFreqEndHz: number;
  /** 中频摩擦湍流频段 (Hz) */
  midFreqStartHz: number;
  midFreqEndHz: number;
  /** 高频气流嘶声频段 (Hz) */
  highFreqStartHz: number;
  highFreqEndHz: number;

  /** 低频相对中频的能量优势范围 (L - M, dB)：下限排除白噪/掌声/嘘声，上限排除纯低频敲击/嗡鸣 */
  minLowToMidDb: number;
  maxLowToMidDb: number;
  /** 低频相对高频的能量优势范围 (L - H, dB) */
  minLowToHighDb: number;
  maxLowToHighDb: number;
  /** 中高频最低绝对能量地板 (dBFS)，确保摩擦湍流真实存在 */
  minMidBandDb: number;
  minHighBandDb: number;

  /** 子带谱平坦度下限 (0 ~ 1)，过滤人声/音乐/口哨等谐波信号 */
  minFlatnessLowMid: number;
  minFlatnessMid: number;
  minFlatnessHigh: number;
  minAvgMidHighFlatness: number;
  /** 中频带单峰相对均值上限 (dB)，过滤强单频啸叫/口哨 */
  maxMidPeakToMeanDb: number;

  /** 时域归一化自相关上限 (0 ~ 1)，过滤周期性人声、唱歌、乐器、震动 */
  maxAutocorr: number;
  /** 时域峰值因数上限 (peak / rms)，过滤尖锐瞬态脉冲（拍手/敲击） */
  maxCrestFactor: number;
  /** 自适应环境底噪上限 (dBFS)，避免极端嘈杂环境下彻底无法触发 */
  maxAmbientRmsDb: number;
}

export const RECOMMENDED_SMOOTHING_TIME_CONSTANT = 0.45;

/**
 * 根据采样率推荐 AnalyserNode 的 fftSize，保持分析窗口在 ~42-64ms，
 * 确保低频段（80-350Hz）拥有足够的频率分辨率（至少 10+ 个 FFT bin）。
 */
export const getRecommendedFftSize = (sampleRate: number): number => {
  return sampleRate <= 24000 ? 1024 : 2048;
};

/**
 * 默认吹气检测配置（对应默认灵敏度 60%）
 */
export const DEFAULT_BLOW_CONFIG: BlowDetectionConfig = {
  minRmsDb: -32.4,
  minSnrDb: 8.9,
  requiredDurationMs: 274,
  decayMultiplier: 1.35,
  calibrationMs: 250,

  lowFreqStartHz: 80,
  lowFreqEndHz: 350,
  lowMidFreqStartHz: 350,
  lowMidFreqEndHz: 1000,
  midFreqStartHz: 1000,
  midFreqEndHz: 3000,
  highFreqStartHz: 3000,
  highFreqEndHz: 7000,

  minLowToMidDb: 3.5,
  maxLowToMidDb: 22.0,
  minLowToHighDb: 1.5,
  maxLowToHighDb: 28.0,
  minMidBandDb: -75,
  minHighBandDb: -82,

  minFlatnessLowMid: 0.36,
  minFlatnessMid: 0.31,
  minFlatnessHigh: 0.28,
  minAvgMidHighFlatness: 0.36,
  maxMidPeakToMeanDb: 13.0,

  maxAutocorr: 0.38,
  maxCrestFactor: 7.2,
  maxAmbientRmsDb: -24,
};

/**
 * 根据用户设置的灵敏度（10-100）动态生成检测配置。
 * 灵敏度只调节响度门槛、信噪比门槛与所需持续时长，
 * 核心声学模式过滤器（频谱斜率、平坦度、非周期性）始终保持严格以防误触。
 */
export const getBlowConfigWithSensitivity = (sensitivity: number): BlowDetectionConfig => {
  const clamped = Math.max(0, Math.min(100, sensitivity));
  const s = clamped / 100; // 0 ~ 1
  return {
    ...DEFAULT_BLOW_CONFIG,
    minRmsDb: -20.4 - s * 20,          // 10% -> -22.4 dB, 60% -> -32.4 dB, 100% -> -40.4 dB
    minSnrDb: 13.1 - s * 7.0,          // 10% -> 12.4 dB,  60% -> 8.9 dB,   100% -> 6.1 dB
    requiredDurationMs: 370 - s * 160, // 10% -> 354 ms,   60% -> 274 ms,   100% -> 210 ms
  };
};

export interface BlowDetectionMetrics {
  rmsDb: number;
  snrDb: number;
  lowToMidDb: number;
  lowToHighDb: number;
  flatnessLowMid: number;
  flatnessMid: number;
  flatnessHigh: number;
  maxAutocorr: number;
  crestFactor: number;
}

export interface BlowDetectionResult {
  isBlowing: boolean;
  isExtinguished: boolean;
  progress: number;
  metrics?: BlowDetectionMetrics;
}

export interface BlowDetectionState {
  blowDurationMs: number;
  elapsedMs: number;
  lastTimestampMs: number | null;
  ambientRmsDb: number;
  ambientLowDb: number;
  ambientMidDb: number;
  initializedAmbient: boolean;
  smoothFlatLowMid: number;
  smoothFlatMid: number;
  smoothFlatHigh: number;
  smoothAutocorr: number;
  smoothInitialized: boolean;
  freqBuffer: Float32Array | null;
  timeBuffer: Float32Array | null;
  decimatedBuffer: Float32Array | null;
}

export const createBlowDetectionState = (): BlowDetectionState => ({
  blowDurationMs: 0,
  elapsedMs: 0,
  lastTimestampMs: null,
  ambientRmsDb: -55,
  ambientLowDb: -75,
  ambientMidDb: -85,
  initializedAmbient: false,
  smoothFlatLowMid: 0,
  smoothFlatMid: 0,
  smoothFlatHigh: 0,
  smoothAutocorr: 0.5,
  smoothInitialized: false,
  freqBuffer: null,
  timeBuffer: null,
  decimatedBuffer: null,
});

interface BandStats {
  db: number;
  flatness: number;
  peakToMeanDb: number;
}

const computeBandStats = (
  freqDb: Float32Array,
  binHz: number,
  startHz: number,
  endHz: number
): BandStats => {
  const b1 = Math.max(1, Math.round(startHz / binHz));
  const b2 = Math.min(freqDb.length - 1, Math.round(endHz / binHz));
  if (b2 < b1) {
    return { db: -140, flatness: 0, peakToMeanDb: 0 };
  }

  let linSum = 0;
  let logSum = 0;
  let maxPower = 0;
  const count = b2 - b1 + 1;

  for (let i = b1; i <= b2; i++) {
    const raw = freqDb[i];
    const db = Number.isFinite(raw) ? Math.max(raw, -140) : -140;
    const power = Math.pow(10, db / 10);
    linSum += power;
    logSum += Math.log(power + 1e-18);
    if (power > maxPower) {
      maxPower = power;
    }
  }

  const meanPower = linSum / count;
  const db = 10 * Math.log10(Math.max(meanPower, 1e-14));
  const flatness = meanPower > 0 ? Math.exp(logSum / count) / meanPower : 0;
  const peakToMeanDb = 10 * Math.log10(Math.max(maxPower / Math.max(meanPower, 1e-18), 1));
  return { db, flatness, peakToMeanDb };
};

/**
 * 快速归一化自相关峰值（70Hz - 700Hz 基频区间），
 * 将信号降采样到 ~16-24kHz、最多 512 点以保证每帧计算耗时 < 0.1ms。
 */
const computeMaxAutocorr = (
  timeData: Float32Array,
  mean: number,
  sampleRate: number,
  state: BlowDetectionState
): number => {
  const fftSize = timeData.length;
  const stride = Math.max(1, Math.round(sampleRate / 24000));
  const dsSr = sampleRate / stride;
  const dsLen = Math.min(512, Math.floor(fftSize / stride));
  if (dsLen < 64) return 0;

  if (!state.decimatedBuffer || state.decimatedBuffer.length !== dsLen) {
    state.decimatedBuffer = new Float32Array(dsLen);
  }
  const ds = state.decimatedBuffer;
  const start = fftSize - dsLen * stride;

  let energy = 0;
  for (let i = 0; i < dsLen; i++) {
    const v = timeData[start + i * stride] - mean;
    ds[i] = v;
    energy += v * v;
  }
  if (energy <= 1e-7) return 0;

  const minLag = Math.max(2, Math.floor(dsSr / 700));
  const maxLag = Math.min(Math.floor(dsSr / 70), Math.floor(dsLen / 2));

  let maxCorr = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0;
    const limit = dsLen - lag;
    for (let i = 0; i < limit; i++) {
      sum += ds[i] * ds[i + lag];
    }
    const r = sum / energy;
    if (r > maxCorr) {
      maxCorr = r;
    }
  }
  return maxCorr;
};

/**
 * 纯 DSP 帧级吹气检测函数（便于单元测试与离线音频回放验证）。
 */
export const detectBlowFromFrame = (
  freqDb: Float32Array,
  timeData: Float32Array,
  sampleRate: number,
  config: BlowDetectionConfig = DEFAULT_BLOW_CONFIG,
  state: BlowDetectionState = createBlowDetectionState(),
  nowMs: number = typeof performance !== "undefined" ? performance.now() : Date.now()
): BlowDetectionResult => {
  const dtMs =
    state.lastTimestampMs === null
      ? 16.67
      : Math.max(4, Math.min(100, nowMs - state.lastTimestampMs));
  state.lastTimestampMs = nowMs;
  state.elapsedMs += dtMs;

  const fftSize = timeData.length;
  const binHz = sampleRate / fftSize;

  // 1. 时域特征：去直流均值、RMS 音量、峰值、峰值因数（Crest Factor）
  let mean = 0;
  for (let i = 0; i < fftSize; i++) {
    mean += timeData[i];
  }
  mean /= fftSize;

  let sumSq = 0;
  let peak = 0;
  for (let i = 0; i < fftSize; i++) {
    const v = timeData[i] - mean;
    sumSq += v * v;
    const av = Math.abs(v);
    if (av > peak) peak = av;
  }
  const rms = Math.sqrt(sumSq / fftSize);
  const rmsDb = 20 * Math.log10(Math.max(rms, 1e-6));
  const crestFactor = rms > 1e-6 ? peak / rms : 0;

  // 2. 四频段能量与子带谱平坦度
  const nyquistSafe = sampleRate * 0.45;
  const bLow = computeBandStats(freqDb, binHz, config.lowFreqStartHz, config.lowFreqEndHz);
  const bLowMid = computeBandStats(freqDb, binHz, config.lowMidFreqStartHz, config.lowMidFreqEndHz);
  const bMid = computeBandStats(freqDb, binHz, config.midFreqStartHz, Math.min(config.midFreqEndHz, nyquistSafe));
  const bHigh = computeBandStats(freqDb, binHz, config.highFreqStartHz, Math.min(config.highFreqEndHz, nyquistSafe));

  // 对谱平坦度做 45ms 轻度时间平滑，消除宽带随机噪声单帧 Rayleigh 抖动
  const featAlpha = 1 - Math.exp(-(dtMs / 1000) / 0.045);
  if (!state.smoothInitialized) {
    state.smoothFlatLowMid = bLowMid.flatness;
    state.smoothFlatMid = bMid.flatness;
    state.smoothFlatHigh = bHigh.flatness;
    state.smoothInitialized = true;
  } else {
    state.smoothFlatLowMid += (bLowMid.flatness - state.smoothFlatLowMid) * featAlpha;
    state.smoothFlatMid += (bMid.flatness - state.smoothFlatMid) * featAlpha;
    state.smoothFlatHigh += (bHigh.flatness - state.smoothFlatHigh) * featAlpha;
  }

  // 3. 启动初期的环境底噪校准阶段（同时屏蔽移动端打开麦克风时的瞬态爆音）
  if (state.elapsedMs < config.calibrationMs) {
    if (!state.initializedAmbient) {
      state.ambientRmsDb = Math.min(rmsDb, config.maxAmbientRmsDb);
      state.ambientLowDb = Math.min(bLow.db, config.maxAmbientRmsDb - 12);
      state.ambientMidDb = Math.min(bMid.db, config.maxAmbientRmsDb - 24);
      state.initializedAmbient = true;
    } else {
      const a = 0.25;
      state.ambientRmsDb = Math.min(config.maxAmbientRmsDb, state.ambientRmsDb * (1 - a) + rmsDb * a);
      state.ambientLowDb = Math.min(config.maxAmbientRmsDb - 12, state.ambientLowDb * (1 - a) + bLow.db * a);
      state.ambientMidDb = Math.min(config.maxAmbientRmsDb - 24, state.ambientMidDb * (1 - a) + bMid.db * a);
    }
    return { isBlowing: false, isExtinguished: false, progress: 0 };
  }

  // 4. 能量与自适应信噪比判断
  const snrDb = rmsDb - state.ambientRmsDb;
  const lowSnrDb = bLow.db - state.ambientLowDb;
  const midSnrDb = bMid.db - state.ambientMidDb;

  const standardSnrOk = snrDb >= config.minSnrDb && lowSnrDb >= config.minSnrDb * 0.65;
  // 在有持续低频空调/风扇嗡鸣的房间里，吹气的中频宽带摩擦声仍会显著高于底噪
  const noisyRoomBlowOk = rmsDb >= -19 && snrDb >= 5.5 && midSnrDb >= config.minSnrDb + 3;
  const energyOk = rmsDb >= config.minRmsDb && (standardSnrOk || noisyRoomBlowOk);

  // 5. 频谱倾斜（负斜率 + 宽带摩擦存在性）与子带谱平坦度判断
  const lowToMidDb = bLow.db - bMid.db;
  const lowToHighDb = bLow.db - bHigh.db;
  const avgMidHighFlat = 0.5 * (state.smoothFlatMid + state.smoothFlatHigh);

  const tiltOk =
    lowToMidDb >= config.minLowToMidDb &&
    lowToMidDb <= config.maxLowToMidDb &&
    lowToHighDb >= config.minLowToHighDb &&
    lowToHighDb <= config.maxLowToHighDb &&
    bMid.db > config.minMidBandDb &&
    bHigh.db > config.minHighBandDb;

  const flatnessOk =
    state.smoothFlatLowMid >= config.minFlatnessLowMid &&
    state.smoothFlatMid >= config.minFlatnessMid &&
    state.smoothFlatHigh >= config.minFlatnessHigh &&
    avgMidHighFlat >= config.minAvgMidHighFlatness &&
    bMid.peakToMeanDb <= config.maxMidPeakToMeanDb;

  const crestOk = crestFactor <= config.maxCrestFactor;

  // 6. 仅当前置频谱门限全通过时才计算自相关（静音/非吹气帧零额外开销）
  let maxAutocorr = state.smoothAutocorr;
  let isBlowFrame = false;

  if (energyOk && tiltOk && flatnessOk && crestOk) {
    maxAutocorr = computeMaxAutocorr(timeData, mean, sampleRate, state);
    state.smoothAutocorr += (maxAutocorr - state.smoothAutocorr) * Math.min(1, featAlpha * 1.4);
    isBlowFrame =
      maxAutocorr <= config.maxAutocorr + 0.05 &&
      state.smoothAutocorr <= config.maxAutocorr;
  } else {
    state.smoothAutocorr += (0.35 - state.smoothAutocorr) * 0.1;
  }

  // 7. 自适应环境底噪更新（吹气过程中冻结底噪，防止长吹气抬高底噪）
  if (!isBlowFrame) {
    const dtSec = dtMs / 1000;
    if (rmsDb < state.ambientRmsDb) {
      const alpha = 1 - Math.exp(-dtSec / 0.4);
      state.ambientRmsDb += (rmsDb - state.ambientRmsDb) * alpha;
      state.ambientLowDb += (bLow.db - state.ambientLowDb) * alpha;
      state.ambientMidDb += (bMid.db - state.ambientMidDb) * alpha;
    } else {
      const alpha = 1 - Math.exp(-dtSec / 2.5);
      state.ambientRmsDb = Math.min(
        config.maxAmbientRmsDb,
        state.ambientRmsDb + (rmsDb - state.ambientRmsDb) * alpha
      );
      state.ambientLowDb = Math.min(
        config.maxAmbientRmsDb - 12,
        state.ambientLowDb + (bLow.db - state.ambientLowDb) * alpha
      );
      state.ambientMidDb = Math.min(
        config.maxAmbientRmsDb - 24,
        state.ambientMidDb + (bMid.db - state.ambientMidDb) * alpha
      );
    }
  }

  // 8. 基于真实耗时（ms）的持续吹气累积与平滑衰减
  if (isBlowFrame) {
    state.blowDurationMs += dtMs;
  } else {
    state.blowDurationMs = Math.max(0, state.blowDurationMs - dtMs * config.decayMultiplier);
  }

  const progress = Math.min(
    100,
    Math.round((state.blowDurationMs / config.requiredDurationMs) * 100)
  );
  const isExtinguished = state.blowDurationMs >= config.requiredDurationMs;
  const isBlowing = isBlowFrame || state.blowDurationMs > dtMs;

  return {
    isBlowing,
    isExtinguished,
    progress,
    metrics: {
      rmsDb,
      snrDb,
      lowToMidDb,
      lowToHighDb,
      flatnessLowMid: state.smoothFlatLowMid,
      flatnessMid: state.smoothFlatMid,
      flatnessHigh: state.smoothFlatHigh,
      maxAutocorr,
      crestFactor,
    },
  };
};

/**
 * Web Audio AnalyserNode 吹气检测入口（复用内部 TypedArray，零每帧内存分配）。
 */
export const detectBlow = (
  analyser: AnalyserNode,
  config: BlowDetectionConfig = DEFAULT_BLOW_CONFIG,
  state: BlowDetectionState = createBlowDetectionState(),
  nowMs?: number
): BlowDetectionResult => {
  const binCount = analyser.frequencyBinCount;
  const fftSize = analyser.fftSize;

  if (!state.freqBuffer || state.freqBuffer.length !== binCount) {
    state.freqBuffer = new Float32Array(binCount);
  }
  if (!state.timeBuffer || state.timeBuffer.length !== fftSize) {
    state.timeBuffer = new Float32Array(fftSize);
  }

  analyser.getFloatFrequencyData(state.freqBuffer as Float32Array<ArrayBuffer>);
  analyser.getFloatTimeDomainData(state.timeBuffer as Float32Array<ArrayBuffer>);

  return detectBlowFromFrame(
    state.freqBuffer,
    state.timeBuffer,
    analyser.context.sampleRate,
    config,
    state,
    nowMs
  );
};

export const cleanupAudioResources = (
  audioContext: AudioContext | null,
  mediaStream?: MediaStream | null
) => {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
  }
  if (audioContext && audioContext.state !== "closed") {
    audioContext.close().catch(() => {});
  }
};
