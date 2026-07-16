// 吹气检测配置常量
export interface BlowDetectionConfig {
  blowThreshold: number;         // 吹气能量阈值 (0 ~ 1)
  blowRequiredDuration: number;  // 触发熄灭所需的持续帧数
  lowFreqStartHz: number;        // 超低频起点 (Hz)，捕获气流对麦克风的直接冲击
  lowFreqEndHz: number;          // 超低频终点 (Hz)
  noiseFreqStartHz: number;      // 噪音频带起点 (Hz)，用于检测吹气的摩擦声
  noiseFreqEndHz: number;        // 噪音频带终点 (Hz)
  maxPeakToAverageRatio: number; // 噪音频带内的“峰值/均值”比率上限。值越小，对人声/口哨过滤越严格
}

// 默认吹气检测配置（基于物理声学特征微调）
export const DEFAULT_BLOW_CONFIG: BlowDetectionConfig = {
  blowThreshold: 0.35,           // 降低阈值以提高灵敏度，因为我们引入了更精准的噪声过滤器
  blowRequiredDuration: 12,      // 约 200ms (假设 60fps)，太长用户吹得累，太短容易误触发
  lowFreqStartHz: 15,            // 接近直流的超低频
  lowFreqEndHz: 150,             // 气流冲击主频段
  noiseFreqStartHz: 1000,        // 吹气摩擦音平坦区起点
  noiseFreqEndHz: 4000,          // 吹气摩擦音平坦区终点
  maxPeakToAverageRatio: 1.8,    // 如果中高频的峰值超过均值的 1.8 倍，说明有特定声调（如人声/警报/口哨），排除掉
};

// 根据灵敏度（0-100）动态调整阈值
export const getBlowConfigWithSensitivity = (sensitivity: number): BlowDetectionConfig => {
  // 灵敏度越高，所需阈值越低（最灵敏 0.15，最迟钝 0.65）
  const threshold = 0.65 - (sensitivity / 100) * 0.5;
  return {
    ...DEFAULT_BLOW_CONFIG,
    blowThreshold: Math.max(0.15, Math.min(0.65, threshold)),
  };
};

export interface BlowDetectionResult {
  isBlowing: boolean;
  isExtinguished: boolean;
}

export interface BlowDetectionState {
  blowDuration: number;
}

/**
 * 辅助函数：将实际频率（Hz）转换为 AnalyserNode 的 Bin 索引
 */
const hzToBin = (hz: number, sampleRate: number, fftSize: number): number => {
  const bin = Math.round((hz * fftSize) / sampleRate);
  return Math.max(0, bin);
};

/**
 * 优化后的吹气检测算法
 */
export const detectBlow = (
  analyser: AnalyserNode,
  config: BlowDetectionConfig = DEFAULT_BLOW_CONFIG,
  state: BlowDetectionState
): BlowDetectionResult => {
  const sampleRate = analyser.context.sampleRate;
  const fftSize = analyser.fftSize;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  analyser.getByteFrequencyData(dataArray);

  // 1. 计算频段对应的 Bin 索引
  const lowStartBin = hzToBin(config.lowFreqStartHz, sampleRate, fftSize);
  const lowEndBin = Math.min(bufferLength, hzToBin(config.lowFreqEndHz, sampleRate, fftSize));

  const noiseStartBin = hzToBin(config.noiseFreqStartHz, sampleRate, fftSize);
  const noiseEndBin = Math.min(bufferLength, hzToBin(config.noiseFreqEndHz, sampleRate, fftSize));

  // 2. 算超低频（气流冲击）的平均能量
  let lowSum = 0;
  const lowCount = lowEndBin - lowStartBin;
  for (let i = lowStartBin; i < lowEndBin; i++) {
    lowSum += dataArray[i];
  }
  const lowAverage = lowCount > 0 ? (lowSum / lowCount / 255) : 0;

  // 3. 计算中高频（1k-4kHz）的平坦度，防止人声、环境乐器干扰
  let noiseSum = 0;
  let noiseMax = 0;
  const noiseCount = noiseEndBin - noiseStartBin;

  for (let i = noiseStartBin; i < noiseEndBin; i++) {
    const val = dataArray[i];
    noiseSum += val;
    if (val > noiseMax) {
      noiseMax = val;
    }
  }

  const noiseAverage = noiseCount > 0 ? (noiseSum / noiseCount) : 0;

  // 核心过滤器 1：如果噪声频段有声音，计算它的“峰值与均值比”（Peak-to-Average Ratio）
  // 纯吹气（白噪音）的波形非常平缓，峰值和均值很接近。
  // 人声、口哨、环境尖锐噪音会有明显的波峰，导致 noiseMax 远大于 noiseAverage。
  const isFlatNoise = noiseAverage > 0
    ? (noiseMax / noiseAverage) < config.maxPeakToAverageRatio
    : true;

  // 核心过滤器 2：吹气时，中高频也应该有伴随的平坦摩擦声，但不应该比低频的冲击波还大
  const hasFrictionSound = (noiseAverage / 255) < (lowAverage * 0.7);

  // 4. 综合判断
  const isBlowingSound =
    lowAverage > config.blowThreshold && // 必须有足够强的超低频气流
    isFlatNoise &&                       // 排除非平坦高频音（人声/口哨）
    hasFrictionSound;                    // 排除异常的中高频啸叫

  if (isBlowingSound) {
    state.blowDuration += 1;
    return {
      isBlowing: true,
      isExtinguished: state.blowDuration > config.blowRequiredDuration
    };
  } else {
    // 引入一点消退延迟（可选，这里保持立即清零，或者可以缓慢衰减提高手感）
    state.blowDuration = Math.max(0, state.blowDuration - 1);
    return { isBlowing: false, isExtinguished: false };
  }
};

export const cleanupAudioResources = (audioContext: AudioContext | null) => {
  if (audioContext) {
    audioContext.close();
  }
};