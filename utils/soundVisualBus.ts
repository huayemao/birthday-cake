export type SoundBands5 = [number, number, number, number, number];

export interface BlowVisualFrame {
  /** 相对环境底噪的平滑声音活跃度 (0 ~ 1)，任意风吹草动即可响应 */
  soundLevel: number;
  /** 5 个视觉频段的归一化能量 (0 ~ 1)，用于驱动波形条 */
  bands: SoundBands5;
  /** 当前是否被识别为有效吹气 */
  isBlowing: boolean;
  /** 麦克风是否处于活跃监听状态 */
  active: boolean;
}

type Listener = (frame: BlowVisualFrame) => void;

const IDLE_FRAME: BlowVisualFrame = {
  soundLevel: 0,
  bands: [0, 0, 0, 0, 0],
  isBlowing: false,
  active: false,
};

let latestFrame: BlowVisualFrame = IDLE_FRAME;
const listeners = new Set<Listener>();

export const emitBlowVisual = (frame: BlowVisualFrame): void => {
  latestFrame = frame;
  listeners.forEach((listener) => listener(frame));
};

export const resetBlowVisual = (): void => {
  emitBlowVisual(IDLE_FRAME);
};

export const subscribeBlowVisual = (listener: Listener): (() => void) => {
  listeners.add(listener);
  listener(latestFrame);
  return () => {
    listeners.delete(listener);
  };
};
