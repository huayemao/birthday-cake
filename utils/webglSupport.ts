export type WebGLTier = 'high' | 'medium' | 'none';

export interface WebGLSupportInfo {
  supported: boolean;
  version: 2 | 1 | 0;
  tier: WebGLTier;
  reason?: string;
}

let cachedSupport: WebGLSupportInfo | null = null;

/**
 * 检测当前设备/浏览器是否支持 WebGL 3D 渲染以及性能等级。
 * 支持失败时自动回退至 2D 蛋糕场景。
 */
export function detectWebGLSupport(): WebGLSupportInfo {
  if (cachedSupport) return cachedSupport;

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return { supported: false, version: 0, tier: 'none', reason: 'SSR environment' };
  }

  try {
    const canvas = document.createElement('canvas');
    const contextAttrs: WebGLContextAttributes = {
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    };

    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    let version: 2 | 1 | 0 = 0;

    try {
      gl = canvas.getContext('webgl2', contextAttrs) as WebGL2RenderingContext | null;
      if (gl) version = 2;
    } catch {
      gl = null;
    }

    if (!gl) {
      try {
        gl = (canvas.getContext('webgl', contextAttrs) ||
          canvas.getContext('experimental-webgl', contextAttrs)) as WebGLRenderingContext | null;
        if (gl) version = 1;
      } catch {
        gl = null;
      }
    }

    if (!gl) {
      cachedSupport = {
        supported: false,
        version: 0,
        tier: 'none',
        reason: 'WebGL context unavailable',
      };
      return cachedSupport;
    }

    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    if (!maxTextureSize || maxTextureSize < 1024) {
      cachedSupport = {
        supported: false,
        version: 0,
        tier: 'none',
        reason: 'Insufficient GPU texture size',
      };
      return cachedSupport;
    }

    // 评估设备渲染档位（移动端或小显存适当降低阴影/粒子密度）
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;
    let rendererStr = '';
    try {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        rendererStr = String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '');
      }
    } catch {
      // ignore privacy-restricted extension
    }

    const isSoftware = /swiftshader|llvmpipe|software|mesa offscreen/i.test(rendererStr);
    const tier: WebGLTier =
      isSoftware || isMobile || cores <= 4 || version === 1 || maxTextureSize < 4096
        ? 'medium'
        : 'high';

    // 主动释放测试上下文
    try {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      // ignore
    }

    cachedSupport = {
      supported: true,
      version,
      tier,
    };
    return cachedSupport;
  } catch (err) {
    cachedSupport = {
      supported: false,
      version: 0,
      tier: 'none',
      reason: err instanceof Error ? err.message : 'Unknown WebGL detection error',
    };
    return cachedSupport;
  }
}

export function resetWebGLSupportCache(): void {
  cachedSupport = null;
}
