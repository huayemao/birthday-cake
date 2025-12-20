// 吹气检测工具函数

// 吹气检测配置常量
export interface BlowDetectionConfig {
  blowThreshold: number;
  blowRequiredDuration: number;
  lowFreqStart: number;
  lowFreqEnd: number;
  midFreqStart: number;
  midFreqEnd: number;
  midHighRatio: number;
}

// 默认吹气检测配置
export const DEFAULT_BLOW_CONFIG: BlowDetectionConfig = {
  blowThreshold: 0.5, // 吹气阈值，值越高越不敏感
  blowRequiredDuration: 20, // 触发熄灭所需的持续帧数
  lowFreqStart: 0, // 低频起始频率
  lowFreqEnd: 30, // 低频结束频率
  midFreqStart: 50, // 中频起始频率
  midFreqEnd: 200, // 中频结束频率
  midHighRatio: 0.6, // 中低频比率阈值
};

// 吹气检测结果
export interface BlowDetectionResult {
  isBlowing: boolean;
  isExtinguished: boolean;
}

// 吹气检测状态
export interface BlowDetectionState {
  blowDuration: number;
}

/**
 * 检测吹气动作
 * @param analyser AnalyserNode实例
 * @param config 吹气检测配置
 * @param state 吹气检测状态
 * @returns 吹气检测结果
 */
export const detectBlow = (
  analyser: AnalyserNode,
  config: BlowDetectionConfig = DEFAULT_BLOW_CONFIG,
  state: BlowDetectionState
): BlowDetectionResult => {
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteFrequencyData(dataArray);

  // 计算低频和中频能量
  let lowSum = 0;
  let midSum = 0;

  for (let i = config.lowFreqStart; i < config.lowFreqEnd && i < dataArray.length; i++) {
    lowSum += dataArray[i];
  }

  for (let i = config.midFreqStart; i < config.midFreqEnd && i < dataArray.length; i++) {
    midSum += dataArray[i];
  }

  const lowBandWidth = Math.min(dataArray.length, config.lowFreqEnd) - config.lowFreqStart;
  const midBandWidth = Math.min(dataArray.length, config.midFreqEnd) - config.midFreqStart;

  // 避免除以零
  if (lowBandWidth === 0 || midBandWidth === 0) {
    return { isBlowing: false, isExtinguished: false };
  }

  const lowAverage = lowSum / lowBandWidth / 255;
  const midAverage = midSum / midBandWidth / 255;

  // 吹气特征：低频能量高，中频能量相对较低
  const isBlowingSound = 
    lowAverage > config.blowThreshold && 
    midAverage < lowAverage * config.midHighRatio;

  if (isBlowingSound) {
    state.blowDuration += 1;
    return {
      isBlowing: true,
      isExtinguished: state.blowDuration > config.blowRequiredDuration
    };
  } else {
    state.blowDuration = 0;
    return { isBlowing: false, isExtinguished: false };
  }
};

/**
 * 清理音频资源
 * @param audioContext AudioContext实例
 */
export const cleanupAudioResources = (audioContext: AudioContext | null) => {
  if (audioContext) {
    audioContext.close();
  }
};
