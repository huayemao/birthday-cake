/**
 * 基于真实多设备吹气采样（public/blow-effect.mp3 手机近场直吹、public/blow-effect-1.m4a
 * 含超低频风压与轻吹气流的样本）及远距离气流声学特征标定的吹气检测与个性化采样校准算法。
 *
 * 核心声学特征：
 * 1. 多频段频谱倾斜（50-350Hz / 350-1000Hz / 1-3kHz / 3-7kHz）：
 *    - 近场直吹模式：低频气流冲击显著强于中频和高频，同时中高频持续存在宽带摩擦湍流。
 *    - 远场/轻吹模式：距离较远时气流不直接撞击振膜，呈现极平坦宽带气流湍流，
 *      同时支持中高频信噪比通道（穿透低频风扇/电脑底噪）。
 * 2. 高子带谱平坦度（Wiener Entropy）：气流湍流在 350Hz-7kHz 连续铺开，无窄带谐波尖峰。
 * 3. 高通后过零归一化自相关（HPF + Post-Zero-Crossing Autocorrelation）：
 *    先滤除 <100Hz 慢速风压漂移，并跳过主瓣过零点后再搜索 70-700Hz 周期峰，
 *    彻底区分宽带吹气与周期性人声/唱歌/音乐/震动。
 * 4. 峰值因数 + 真实毫秒耗时（dtMs）累积/平滑衰减：排除拍手、敲击、咳嗽等瞬态脉冲，
 *    确保 30Hz/60Hz/120Hz 屏幕下手感一致。
 * 5. 自适应多频段底噪跟踪 + 可选用户录音采样校准（BlowCalibrationProfile）：
 *    用户可录一段当前距离下的真实吹气，提取 8 频段归一化频谱指纹与响度基线，
 *    显著提升远距离吹气和低灵敏度麦克风的识别率。
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

  /** 低频气流冲击主频段 (Hz)，覆盖 50-350Hz 兼顾手机与电脑麦克风 */
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

  /** 直吹模式：低频相对中频的能量优势范围 (L - M, dB) */
  minLowToMidDb: number;
  maxLowToMidDb: number;
  /** 直吹模式：低频相对高频的能量优势范围 (L - H, dB) */
  minLowToHighDb: number;
  maxLowToHighDb: number;
  /** 中高频最低绝对能量地板 (dBFS)，支持远距离弱吹气 */
  minMidBandDb: number;
  minHighBandDb: number;

  /** 子带谱平坦度下限 (0 ~ 1)，过滤人声/音乐/口哨等谐波信号 */
  minFlatnessLowMid: number;
  minFlatnessMid: number;
  minFlatnessHigh: number;
  minAvgMidHighFlatness: number;
  /** 中频带单峰相对均值上限 (dB)，过滤强单频啸叫/口哨 */
  maxMidPeakToMeanDb: number;

  /** 高通过零自相关上限 (0 ~ 1)，过滤周期性人声、唱歌、乐器、震动 */
  maxAutocorr: number;
  /** 时域峰值因数上限 (peak / rms)，过滤尖锐瞬态脉冲（拍手/敲击） */
  maxCrestFactor: number;
  /** 自适应环境底噪上限 (dBFS)，避免极端嘈杂环境下彻底无法触发 */
  maxAmbientRmsDb: number;
}

/**
 * 用户通过“吹气采样校准”录制的设备专属声学指纹
 */
export interface BlowCalibrationProfile {
  version: 1;
  createdAt: number;
  /** 8 个对数分布频段 (50Hz - 7kHz) 的零均值归一化频谱形状 (dB) */
  bandProfileDb: number[];
  /** 采样吹气的中位数音量 (dBFS) */
  targetRmsDb: number;
  /** 采样吹气的中位数中频音量 (dBFS)，用于远距离弱吹气匹配 */
  targetMidDb?: number;
  /** 采样吹气的中位数低/中频能量差 (L - M, dB) */
  lowToMidDb: number;
  /** 采样吹气的中位数低/高频能量差 (L - H, dB) */
  lowToHighDb: number;
  /** 采样吹气的中位数三子带谱平坦度 */
  flatnessLowMid: number;
  flatnessMid: number;
  flatnessHigh: number;
  /** 采样吹气的 85 分位自相关峰值 */
  maxAutocorr: number;
  /** 采集到的有效吹气时长 (ms) */
  sampledDurationMs: number;
}

export const BLOW_CALIBRATION_STORAGE_KEY = "lumina_blow_calibration_v1";

export const RECOMMENDED_SMOOTHING_TIME_CONSTANT = 0.45;

const PROFILE_BANDS_HZ: ReadonlyArray<readonly [number, number]> = [
  [50, 120],
  [120, 250],
  [250, 500],
  [500, 1000],
  [1000, 1800],
  [1800, 3000],
  [3000, 4800],
  [4800, 7000],
];

/**
 * 根据采样率推荐 AnalyserNode 的 fftSize，保持分析窗口在 ~42-64ms，
 * 确保低频段（50-350Hz）拥有足够的频率分辨率。
 */
export const getRecommendedFftSize = (sampleRate: number): number => {
  return sampleRate <= 24000 ? 1024 : 2048;
};

/**
 * 默认吹气检测配置（对应默认灵敏度 60%，兼顾近场直吹与较远距离吹气）
 */
export const DEFAULT_BLOW_CONFIG: BlowDetectionConfig = {
  minRmsDb: -42.4,
  minSnrDb: 7.2,
  requiredDurationMs: 260,
  decayMultiplier: 1.3,
  calibrationMs: 250,

  lowFreqStartHz: 50,
  lowFreqEndHz: 350,
  lowMidFreqStartHz: 350,
  lowMidFreqEndHz: 1000,
  midFreqStartHz: 1000,
  midFreqEndHz: 3000,
  highFreqStartHz: 3000,
  highFreqEndHz: 7000,

  minLowToMidDb: 3.0,
  maxLowToMidDb: 24.5,
  minLowToHighDb: 1.0,
  maxLowToHighDb: 31.0,
  minMidBandDb: -92,
  minHighBandDb: -98,

  minFlatnessLowMid: 0.35,
  minFlatnessMid: 0.30,
  minFlatnessHigh: 0.28,
  minAvgMidHighFlatness: 0.35,
  maxMidPeakToMeanDb: 13.0,

  maxAutocorr: 0.38,
  maxCrestFactor: 7.2,
  maxAmbientRmsDb: -24,
};

/**
 * 根据用户设置的灵敏度（10-100）动态生成检测配置。
 */
export const getBlowConfigWithSensitivity = (sensitivity: number): BlowDetectionConfig => {
  const clamped = Math.max(0, Math.min(100, sensitivity));
  const s = clamped / 100;
  return {
    ...DEFAULT_BLOW_CONFIG,
    minRmsDb: -28.0 - s * 24.0,        // 10% -> -30.4 dB, 60% -> -42.4 dB, 100% -> -52.0 dB
    minSnrDb: 10.5 - s * 5.5,          // 10% -> 10.0 dB,  60% -> 7.2 dB,   100% -> 5.0 dB
    requiredDurationMs: 350 - s * 150, // 10% -> 335 ms,   60% -> 260 ms,   100% -> 200 ms
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
  profileDistanceDb?: number;
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
  ambientHighDb: number;
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
  ambientRmsDb: -60,
  ambientLowDb: -78,
  ambientMidDb: -92,
  ambientHighDb: -96,
  initializedAmbient: false,
  smoothFlatLowMid: 0,
  smoothFlatMid: 0,
  smoothFlatHigh: 0,
  smoothAutocorr: 0.35,
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

const computeNormalizedBandProfile = (
  freqDb: Float32Array,
  binHz: number,
  sampleRate: number
): number[] => {
  const nyqSafe = sampleRate * 0.48;
  const raw = new Array<number>(PROFILE_BANDS_HZ.length);
  let sum = 0;
  for (let i = 0; i < PROFILE_BANDS_HZ.length; i++) {
    const [f1, f2] = PROFILE_BANDS_HZ[i];
    const db = computeBandStats(freqDb, binHz, f1, Math.min(f2, nyqSafe)).db;
    raw[i] = db;
    sum += db;
  }
  const mean = sum / raw.length;
  for (let i = 0; i < raw.length; i++) {
    raw[i] -= mean;
  }
  return raw;
};

/**
 * 高通滤波（~100Hz 一阶高通，消除振膜超低频风压漂移）+ 过零后归一化自相关峰值（70-700Hz）。
 */
const computeMaxAutocorr = (
  timeData: Float32Array,
  sampleRate: number,
  scratchHolder: { decimatedBuffer: Float32Array | null }
): number => {
  const fftSize = timeData.length;
  const stride = Math.max(1, Math.round(sampleRate / 16000));
  const dsSr = sampleRate / stride;
  const dsLen = Math.min(512, Math.floor(fftSize / stride));
  if (dsLen < 64) return 0;

  if (!scratchHolder.decimatedBuffer || scratchHolder.decimatedBuffer.length !== dsLen) {
    scratchHolder.decimatedBuffer = new Float32Array(dsLen);
  }
  const ds = scratchHolder.decimatedBuffer;
  const start = fftSize - dsLen * stride;

  const rc = 1 / (2 * Math.PI * 100);
  const hpAlpha = rc / (rc + 1 / dsSr);
  let prevX = timeData[start];
  let prevY = 0;
  for (let i = 0; i < dsLen; i++) {
    const x = timeData[start + i * stride];
    const y = hpAlpha * (prevY + x - prevX);
    ds[i] = y;
    prevX = x;
    prevY = y;
  }

  const trim = 16;
  const len = dsLen - trim;
  let energy = 0;
  for (let i = 0; i < len; i++) {
    const v = ds[trim + i];
    energy += v * v;
  }
  if (energy <= 1e-10) return 0;

  const minLag = Math.max(2, Math.floor(dsSr / 700));
  const maxLag = Math.min(Math.floor(dsSr / 70), Math.floor(len / 2));

  let crossedZero = false;
  let maxCorr = 0;
  for (let lag = 1; lag <= maxLag; lag++) {
    let sum = 0;
    const limit = len - lag;
    for (let i = 0; i < limit; i++) {
      sum += ds[trim + i] * ds[trim + i + lag];
    }
    const r = sum / energy;
    if (!crossedZero) {
      if (r <= 0.05) {
        crossedZero = true;
      }
    } else if (lag >= minLag && r > maxCorr) {
      maxCorr = r;
    }
  }
  return maxCorr;
};

const computeTimeStats = (timeData: Float32Array) => {
  const n = timeData.length;
  let mean = 0;
  for (let i = 0; i < n; i++) mean += timeData[i];
  mean /= n;

  let sumSq = 0;
  let peak = 0;
  for (let i = 0; i < n; i++) {
    const v = timeData[i] - mean;
    sumSq += v * v;
    const av = Math.abs(v);
    if (av > peak) peak = av;
  }
  const rms = Math.sqrt(sumSq / n);
  const rmsDb = 20 * Math.log10(Math.max(rms, 1e-6));
  const crestFactor = rms > 1e-6 ? peak / rms : 0;
  return { rmsDb, crestFactor };
};

/**
 * 纯 DSP 帧级吹气检测函数（支持近场直吹、远距离轻吹与个性化采样校准）。
 */
export const detectBlowFromFrame = (
  freqDb: Float32Array,
  timeData: Float32Array,
  sampleRate: number,
  config: BlowDetectionConfig = DEFAULT_BLOW_CONFIG,
  state: BlowDetectionState = createBlowDetectionState(),
  nowMs: number = typeof performance !== "undefined" ? performance.now() : Date.now(),
  profile?: BlowCalibrationProfile | null
): BlowDetectionResult => {
  const dtMs =
    state.lastTimestampMs === null
      ? 16.67
      : Math.max(4, Math.min(100, nowMs - state.lastTimestampMs));
  state.lastTimestampMs = nowMs;
  state.elapsedMs += dtMs;

  const fftSize = timeData.length;
  const binHz = sampleRate / fftSize;

  // 1. 时域特征
  const { rmsDb, crestFactor } = computeTimeStats(timeData);

  // 2. 四频段能量与子带谱平坦度
  const nyquistSafe = sampleRate * 0.45;
  const bLow = computeBandStats(freqDb, binHz, config.lowFreqStartHz, config.lowFreqEndHz);
  const bLowMid = computeBandStats(freqDb, binHz, config.lowMidFreqStartHz, config.lowMidFreqEndHz);
  const bMid = computeBandStats(
    freqDb,
    binHz,
    config.midFreqStartHz,
    Math.min(config.midFreqEndHz, nyquistSafe)
  );
  const bHigh = computeBandStats(
    freqDb,
    binHz,
    config.highFreqStartHz,
    Math.min(config.highFreqEndHz, nyquistSafe)
  );

  // 45ms 轻度时间平滑谱平坦度
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

  // 3. 启动初期的环境底噪校准期
  if (state.elapsedMs < config.calibrationMs) {
    if (!state.initializedAmbient) {
      state.ambientRmsDb = Math.min(rmsDb, config.maxAmbientRmsDb);
      state.ambientLowDb = Math.min(bLow.db, config.maxAmbientRmsDb - 12);
      state.ambientMidDb = Math.min(bMid.db, config.maxAmbientRmsDb - 24);
      state.ambientHighDb = Math.min(bHigh.db, config.maxAmbientRmsDb - 28);
      state.initializedAmbient = true;
    } else {
      const a = 0.25;
      state.ambientRmsDb = Math.min(config.maxAmbientRmsDb, state.ambientRmsDb * (1 - a) + rmsDb * a);
      state.ambientLowDb = Math.min(config.maxAmbientRmsDb - 12, state.ambientLowDb * (1 - a) + bLow.db * a);
      state.ambientMidDb = Math.min(config.maxAmbientRmsDb - 24, state.ambientMidDb * (1 - a) + bMid.db * a);
      state.ambientHighDb = Math.min(config.maxAmbientRmsDb - 28, state.ambientHighDb * (1 - a) + bHigh.db * a);
    }
    return { isBlowing: false, isExtinguished: false, progress: 0 };
  }

  // 4. 能量与多频段自适应信噪比判断
  // 远距离吹气时总 RMS 可能受电脑低频底噪掩盖，但中/高频（1-7kHz）气流摩擦信噪比会显著跃升
  const effectiveMinRmsDb = profile
    ? Math.min(config.minRmsDb, Math.max(-56, profile.targetRmsDb - 9))
    : config.minRmsDb;

  const snrDb = rmsDb - state.ambientRmsDb;
  const lowSnrDb = bLow.db - state.ambientLowDb;
  const midSnrDb = bMid.db - state.ambientMidDb;
  const highSnrDb = bHigh.db - state.ambientHighDb;

  const standardSnrOk = snrDb >= config.minSnrDb && lowSnrDb >= config.minSnrDb * 0.55;
  const noisyRoomBlowOk = rmsDb >= -19 && snrDb >= 5.0 && midSnrDb >= config.minSnrDb + 2.5;
  // 远距离/抿唇气流通道：即使总 RMS 被低频电脑风扇掩盖（总增量 >=2.0dB），
  // 只要中频与高频气流湍流同时明显高出底噪，即放行进入严格频谱+平坦度+自相关校验
  const distantAirflowSnrOk =
    snrDb >= 2.0 &&
    midSnrDb >= Math.max(4.5, config.minSnrDb * 0.75) &&
    highSnrDb >= Math.max(4.0, config.minSnrDb * 0.65);
  // 已校准远距离弱吹气：中频达到采样吹气水平且明显高出环境底噪
  const calibratedMidOk =
    Boolean(profile && typeof profile.targetMidDb === "number") &&
    bMid.db >= (profile!.targetMidDb as number) - 10 &&
    midSnrDb >= 4.0 &&
    snrDb >= 1.5;

  const energyOk =
    rmsDb >= effectiveMinRmsDb &&
    (standardSnrOk || noisyRoomBlowOk || distantAirflowSnrOk || calibratedMidOk);

  // 5. 频谱倾斜与平坦度判断
  const lowToMidDb = bLow.db - bMid.db;
  const lowToHighDb = bLow.db - bHigh.db;
  const midToHighDb = bMid.db - bHigh.db;
  const avgMidHighFlat = 0.5 * (state.smoothFlatMid + state.smoothFlatHigh);

  const directBlowTiltOk =
    lowToMidDb >= config.minLowToMidDb &&
    lowToMidDb <= config.maxLowToMidDb &&
    lowToHighDb >= config.minLowToHighDb &&
    lowToHighDb <= config.maxLowToHighDb;

  // 远距离/抿唇吹气通道（不直接撞击振膜，L-M 可为轻度负值，但宽带极其平坦且中频不低于高频，
  // 且中低频平坦度高；借此排除耳语、鼓掌、纯高频嘶声和白噪音）
  const distantBlowTiltOk =
    lowToMidDb >= -3.5 &&
    lowToMidDb < config.minLowToMidDb &&
    lowToHighDb >= 2.0 &&
    lowToHighDb <= config.maxLowToHighDb &&
    midToHighDb >= 1.0 &&
    state.smoothFlatLowMid >= 0.48 &&
    avgMidHighFlat >= 0.48;

  let tiltOk =
    (directBlowTiltOk || distantBlowTiltOk) &&
    bMid.db > config.minMidBandDb &&
    bHigh.db > config.minHighBandDb;

  let usedCalibratedTilt = false;
  if (profile && !tiltOk) {
    // 校准模式：围绕用户真实采样（包括远距离弱吹）的频谱倾斜窗口放宽，并由 8 频段指纹严格匹配
    const minLM = Math.max(-10.0, profile.lowToMidDb - 6.5);
    const maxLM = Math.min(28.0, profile.lowToMidDb + 9.0);
    const minLH = Math.max(-10.0, profile.lowToHighDb - 6.5);
    const maxLH = Math.min(35.0, profile.lowToHighDb + 9.0);
    tiltOk =
      lowToMidDb >= minLM &&
      lowToMidDb <= maxLM &&
      lowToHighDb >= minLH &&
      lowToHighDb <= maxLH &&
      bMid.db > config.minMidBandDb - 6 &&
      bHigh.db > config.minHighBandDb - 6;
    usedCalibratedTilt = tiltOk;
  }

  const flatnessOk =
    state.smoothFlatLowMid >= config.minFlatnessLowMid &&
    state.smoothFlatMid >= config.minFlatnessMid &&
    state.smoothFlatHigh >= config.minFlatnessHigh &&
    avgMidHighFlat >= config.minAvgMidHighFlatness &&
    bMid.peakToMeanDb <= config.maxMidPeakToMeanDb;

  const crestOk = crestFactor <= config.maxCrestFactor;

  // 6. 若启用了用户吹气采样校准，校验 8 频段归一化频谱指纹相似度
  let profileDistanceDb: number | undefined;
  let profileOk = true;
  if (profile && energyOk && tiltOk && flatnessOk && crestOk) {
    const currentBandProfile = computeNormalizedBandProfile(freqDb, binHz, sampleRate);
    let sumAbs = 0;
    const len = Math.min(currentBandProfile.length, profile.bandProfileDb.length);
    for (let i = 0; i < len; i++) {
      sumAbs += Math.abs(currentBandProfile[i] - profile.bandProfileDb[i]);
    }
    profileDistanceDb = len > 0 ? sumAbs / len : 0;
    if (usedCalibratedTilt) {
      // 走远距离校准放宽窗口时，必须与用户的 8 频段吹气指纹高度匹配
      profileOk = profileDistanceDb <= 5.5;
    } else {
      profileOk = profileDistanceDb <= 7.0 || directBlowTiltOk;
      if (profileDistanceDb > 9.5) {
        profileOk = false;
      }
    }
  }

  // 7. 高通过零自相关判断（仅在前置门限通过时运行）
  let maxAutocorr = state.smoothAutocorr;
  let isBlowFrame = false;

  if (energyOk && tiltOk && flatnessOk && crestOk && profileOk) {
    maxAutocorr = computeMaxAutocorr(timeData, sampleRate, state);
    state.smoothAutocorr += (maxAutocorr - state.smoothAutocorr) * Math.min(1, featAlpha * 1.4);
    const effectiveMaxAcorr = profile
      ? Math.min(0.42, Math.max(config.maxAutocorr, profile.maxAutocorr + 0.06))
      : config.maxAutocorr;
    isBlowFrame =
      maxAutocorr <= effectiveMaxAcorr + 0.06 &&
      state.smoothAutocorr <= effectiveMaxAcorr;
  } else {
    state.smoothAutocorr += (0.32 - state.smoothAutocorr) * 0.1;
  }

  // 8. 自适应环境底噪更新（吹气过程中冻结底噪）
  if (!isBlowFrame) {
    const dtSec = dtMs / 1000;
    if (rmsDb < state.ambientRmsDb) {
      const alpha = 1 - Math.exp(-dtSec / 0.4);
      state.ambientRmsDb += (rmsDb - state.ambientRmsDb) * alpha;
      state.ambientLowDb += (bLow.db - state.ambientLowDb) * alpha;
      state.ambientMidDb += (bMid.db - state.ambientMidDb) * alpha;
      state.ambientHighDb += (bHigh.db - state.ambientHighDb) * alpha;
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
      state.ambientHighDb = Math.min(
        config.maxAmbientRmsDb - 28,
        state.ambientHighDb + (bHigh.db - state.ambientHighDb) * alpha
      );
    }
  }

  // 9. 基于真实耗时（ms）的累积与平滑衰减
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
      profileDistanceDb,
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
  nowMs?: number,
  profile?: BlowCalibrationProfile | null
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
    nowMs,
    profile
  );
};

// ============================================================================
// 可选用户吹气录音采样校准引擎（同时支持近距离与远距离吹气采样）
// ============================================================================

interface CalibrationSampleFrame {
  rmsDb: number;
  midDb: number;
  lowToMidDb: number;
  lowToHighDb: number;
  flatLowMid: number;
  flatMid: number;
  flatHigh: number;
  autocorr: number;
  bandProfileDb: number[];
  dtMs: number;
}

export interface BlowCalibrationSessionState {
  elapsedMs: number;
  lastTimestampMs: number | null;
  ambientRmsDb: number;
  ambientMidDb: number;
  ambientHighDb: number;
  ambientInitialized: boolean;
  validDurationMs: number;
  targetDurationMs: number;
  noiseBaselineMs: number;
  samples: CalibrationSampleFrame[];
  freqBuffer: Float32Array | null;
  timeBuffer: Float32Array | null;
  decimatedBuffer: Float32Array | null;
}

export interface BlowCalibrationStepResult {
  phase: "noise-baseline" | "listening" | "complete";
  /** 采样进度 (0-100) */
  progress: number;
  /** 当前麦克风实时响度指示 (0-100)，用于 UI 声浪反馈 */
  liveLevel: number;
  /** 当前帧是否被识别为有效吹气采样帧 */
  isValidBlowFrame: boolean;
  /** 完成采样后生成的校准配置 */
  profile: BlowCalibrationProfile | null;
}

export const createBlowCalibrationState = (
  targetDurationMs = 420,
  noiseBaselineMs = 350
): BlowCalibrationSessionState => ({
  elapsedMs: 0,
  lastTimestampMs: null,
  ambientRmsDb: -60,
  ambientMidDb: -92,
  ambientHighDb: -96,
  ambientInitialized: false,
  validDurationMs: 0,
  targetDurationMs,
  noiseBaselineMs,
  samples: [],
  freqBuffer: null,
  timeBuffer: null,
  decimatedBuffer: null,
});

const getPercentile = (values: number[], p: number): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(sorted.length * p)));
  return sorted[idx];
};

export const finalizeBlowCalibration = (
  state: BlowCalibrationSessionState,
  minDurationMs = 200
): BlowCalibrationProfile | null => {
  if (state.validDurationMs < minDurationMs || state.samples.length < 8) {
    return null;
  }

  const bandCount = PROFILE_BANDS_HZ.length;
  const bandProfileDb = new Array<number>(bandCount);
  for (let b = 0; b < bandCount; b++) {
    bandProfileDb[b] = getPercentile(
      state.samples.map((s) => s.bandProfileDb[b]),
      0.5
    );
  }

  return {
    version: 1,
    createdAt: Date.now(),
    bandProfileDb,
    targetRmsDb: getPercentile(state.samples.map((s) => s.rmsDb), 0.5),
    targetMidDb: getPercentile(state.samples.map((s) => s.midDb), 0.5),
    lowToMidDb: getPercentile(state.samples.map((s) => s.lowToMidDb), 0.5),
    lowToHighDb: getPercentile(state.samples.map((s) => s.lowToHighDb), 0.5),
    flatnessLowMid: getPercentile(state.samples.map((s) => s.flatLowMid), 0.5),
    flatnessMid: getPercentile(state.samples.map((s) => s.flatMid), 0.5),
    flatnessHigh: getPercentile(state.samples.map((s) => s.flatHigh), 0.5),
    maxAutocorr: getPercentile(state.samples.map((s) => s.autocorr), 0.85),
    sampledDurationMs: Math.round(state.validDurationMs),
  };
};

/**
 * 喂入单帧音频用于采样校准。
 * 同时支持近距离直吹与远距离轻吹（通过中高频 SNR 通道穿透低频环境底噪，
 * 并放宽远距离无振膜冲击时的低/中频差范围），同时仍严格过滤人声、唱歌、音乐、口哨、拍手与纯高频嘶声。
 */
export const feedBlowCalibrationFrame = (
  freqDb: Float32Array,
  timeData: Float32Array,
  sampleRate: number,
  state: BlowCalibrationSessionState,
  nowMs: number = typeof performance !== "undefined" ? performance.now() : Date.now()
): BlowCalibrationStepResult => {
  const dtMs =
    state.lastTimestampMs === null
      ? 16.67
      : Math.max(4, Math.min(100, nowMs - state.lastTimestampMs));
  state.lastTimestampMs = nowMs;
  state.elapsedMs += dtMs;

  const fftSize = timeData.length;
  const binHz = sampleRate / fftSize;
  const nyquistSafe = sampleRate * 0.45;
  const { rmsDb, crestFactor } = computeTimeStats(timeData);

  const bLow = computeBandStats(freqDb, binHz, 50, 350);
  const bLowMid = computeBandStats(freqDb, binHz, 350, 1000);
  const bMid = computeBandStats(freqDb, binHz, 1000, Math.min(3000, nyquistSafe));
  const bHigh = computeBandStats(freqDb, binHz, 3000, Math.min(7000, nyquistSafe));

  // 实时音量条结合绝对响度与相对底噪抬升，让远距离吹气时 UI 也有清晰反馈
  const absLevel = ((rmsDb + 62) / 50) * 100;
  const relLevel = state.ambientInitialized
    ? Math.max(rmsDb - state.ambientRmsDb, (bMid.db - state.ambientMidDb) * 0.8) * 5
    : 0;
  const liveLevel = Math.max(0, Math.min(100, Math.round(Math.max(absLevel, relLevel))));

  // 阶段 1：前 350ms 采集静默环境底噪（记录全频段及中高频底噪）
  if (state.elapsedMs < state.noiseBaselineMs) {
    if (!state.ambientInitialized) {
      state.ambientRmsDb = Math.min(rmsDb, -24);
      state.ambientMidDb = Math.min(bMid.db, -48);
      state.ambientHighDb = Math.min(bHigh.db, -52);
      state.ambientInitialized = true;
    } else {
      state.ambientRmsDb = Math.min(-24, state.ambientRmsDb * 0.75 + rmsDb * 0.25);
      state.ambientMidDb = Math.min(-48, state.ambientMidDb * 0.75 + bMid.db * 0.25);
      state.ambientHighDb = Math.min(-52, state.ambientHighDb * 0.75 + bHigh.db * 0.25);
    }
    return {
      phase: "noise-baseline",
      progress: 0,
      liveLevel,
      isValidBlowFrame: false,
      profile: null,
    };
  }

  // 阶段 2：校验当前帧是否为有效吹气气流（兼顾近场直吹与远场轻吹）
  const snrDb = rmsDb - state.ambientRmsDb;
  const midSnrDb = bMid.db - state.ambientMidDb;
  const highSnrDb = bHigh.db - state.ambientHighDb;

  const lowToMidDb = bLow.db - bMid.db;
  const lowToHighDb = bLow.db - bHigh.db;
  const midToHighDb = bMid.db - bHigh.db;
  const avgMidHighFlat = 0.5 * (bMid.flatness + bHigh.flatness);

  // 能量门槛：支持低至 -56 dBFS 的远距离轻吹，且支持通过中高频 SNR（穿透电脑风扇低频底噪）触发
  const levelOk =
    rmsDb >= -56 &&
    (snrDb >= 4.0 || (midSnrDb >= 6.5 && (snrDb >= 1.2 || highSnrDb >= 5.0)));

  const broadbandOk =
    bLowMid.flatness >= 0.28 &&
    bMid.flatness >= 0.28 &&
    bHigh.flatness >= 0.25 &&
    avgMidHighFlat >= 0.32 &&
    bMid.peakToMeanDb <= 13.5 &&
    bMid.db > -98 &&
    bHigh.db > -104;

  // 允许两类合理吹气倾斜：
  // A) 近/中场吹气：低频高于高频（L-H >= 2.0dB）
  // B) 远距离口唇气流（无振膜风压）：L-M 可低至 -4.0dB，但中频强于高频且低频仍高于高频（排除耳语/掌声/嘶声/白噪）
  const nearTiltOk =
    lowToMidDb >= -3.0 &&
    lowToMidDb <= 26.0 &&
    lowToHighDb >= 2.0 &&
    lowToHighDb <= 33.0;
  const farTiltOk =
    lowToMidDb >= -4.0 &&
    lowToMidDb <= 26.0 &&
    lowToHighDb >= 1.5 &&
    lowToHighDb <= 33.0 &&
    midToHighDb >= 1.5 &&
    bLowMid.flatness >= 0.45 &&
    avgMidHighFlat >= 0.44;
  const tiltSane = nearTiltOk || farTiltOk;

  const crestOk = crestFactor <= 7.8;

  let isValidBlowFrame = false;
  if (levelOk && broadbandOk && tiltSane && crestOk) {
    const autocorr = computeMaxAutocorr(timeData, sampleRate, state);
    if (autocorr <= 0.43) {
      isValidBlowFrame = true;
      state.validDurationMs += dtMs;
      state.samples.push({
        rmsDb,
        midDb: bMid.db,
        lowToMidDb,
        lowToHighDb,
        flatLowMid: bLowMid.flatness,
        flatMid: bMid.flatness,
        flatHigh: bHigh.flatness,
        autocorr,
        bandProfileDb: computeNormalizedBandProfile(freqDb, binHz, sampleRate),
        dtMs,
      });
    }
  } else if (rmsDb < state.ambientRmsDb) {
    state.ambientRmsDb = state.ambientRmsDb * 0.9 + rmsDb * 0.1;
    state.ambientMidDb = state.ambientMidDb * 0.9 + bMid.db * 0.1;
    state.ambientHighDb = state.ambientHighDb * 0.9 + bHigh.db * 0.1;
  }

  const progress = Math.min(100, Math.round((state.validDurationMs / state.targetDurationMs) * 100));
  if (state.validDurationMs >= state.targetDurationMs) {
    const profile = finalizeBlowCalibration(state);
    if (profile) {
      return {
        phase: "complete",
        progress: 100,
        liveLevel,
        isValidBlowFrame,
        profile,
      };
    }
  }

  return {
    phase: "listening",
    progress,
    liveLevel,
    isValidBlowFrame,
    profile: null,
  };
};

export const feedBlowCalibrationAnalyser = (
  analyser: AnalyserNode,
  state: BlowCalibrationSessionState,
  nowMs?: number
): BlowCalibrationStepResult => {
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

  return feedBlowCalibrationFrame(
    state.freqBuffer,
    state.timeBuffer,
    analyser.context.sampleRate,
    state,
    nowMs
  );
};

export const loadBlowCalibrationProfile = (): BlowCalibrationProfile | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(BLOW_CALIBRATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BlowCalibrationProfile;
    if (
      parsed &&
      parsed.version === 1 &&
      Array.isArray(parsed.bandProfileDb) &&
      parsed.bandProfileDb.length === PROFILE_BANDS_HZ.length &&
      typeof parsed.targetRmsDb === "number"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const saveBlowCalibrationProfile = (profile: BlowCalibrationProfile): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BLOW_CALIBRATION_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // 隐私模式或存储受限时忽略持久化错误
  }
};

export const clearBlowCalibrationProfile = (): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(BLOW_CALIBRATION_STORAGE_KEY);
  } catch {
    // ignore
  }
};

/**
 * 获取适合吹气识别的原始麦克风流（关闭浏览器默认降噪、回声消除和自动增益）。
 */
export const requestRawMicStream = async (): Promise<MediaStream> => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });
  } catch (constraintErr) {
    if (constraintErr instanceof DOMException && constraintErr.name === "OverconstrainedError") {
      return navigator.mediaDevices.getUserMedia({ audio: true });
    }
    throw constraintErr;
  }
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
