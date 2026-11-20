import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildCakeAssembly } from '@/components/cake3d/cakeModels';
import { detectWebGLSupport } from '@/utils/webglSupport';

const CACHE_VERSION = 'v4';
const thumbnailCache = new Map<string, string>();
let renderQueuePromise: Promise<void> = Promise.resolve();

/**
 * 使用单一共享离屏 WebGLRenderer 为配置页的蛋糕选择器渲染完整、透明背景且四周留白充足的 3D 蛋糕图。
 * 精确计算透视投影边距，确保 4 款蛋糕水平和垂直方向 100% 完整不被截断，便于在选择器卡片中破框浮出展示。
 */
export function renderCake3DThumbnails(cakeIds: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  const missing = cakeIds.filter((id) => {
    const hit = thumbnailCache.get(`${CACHE_VERSION}-${id}`);
    if (hit) {
      result[id] = hit;
      return false;
    }
    return true;
  });

  if (missing.length === 0) {
    return Promise.resolve(result);
  }

  const support = detectWebGLSupport();
  if (!support.supported || typeof document === 'undefined') {
    return Promise.resolve(result);
  }

  const task = renderQueuePromise.then(() => {
    const toRender = missing.filter((id) => !thumbnailCache.has(`${CACHE_VERSION}-${id}`));
    if (toRender.length === 0) {
      cakeIds.forEach((id) => {
        const v = thumbnailCache.get(`${CACHE_VERSION}-${id}`);
        if (v) result[id] = v;
      });
      return;
    }

    const size = 384;
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true,
        powerPreference: 'high-performance',
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(size, size);
      renderer.setPixelRatio(1);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.94;
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      scene.background = null;

      const pmrem = new THREE.PMREMGenerator(renderer);
      const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = envRT.texture;
      scene.environmentIntensity = 0.36;

      // 柔和均衡的甜品影棚光（色彩饱满不发白）
      const hemi = new THREE.HemisphereLight(0xfff5f8, 0x3b2f4a, 0.62);
      scene.add(hemi);

      const key = new THREE.DirectionalLight(0xfff8ee, 1.08);
      key.position.set(3.4, 5.8, 4.8);
      scene.add(key);

      const fill = new THREE.DirectionalLight(0xdce8ff, 0.4);
      fill.position.set(-4.0, 2.8, 3.6);
      scene.add(fill);

      const rim = new THREE.DirectionalLight(0xf9a8d4, 0.52);
      rim.position.set(-2.6, 3.8, -4.0);
      scene.add(rim);

      // 充足视距 + 26° 焦段：彻底避免近大远小导致左右边缘被截断，四周保留干净透明边距
      const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 40);
      camera.position.set(1.75, 3.25, 8.95);
      camera.lookAt(0, 0.78, 0);

      for (const cakeId of toRender) {
        const built = buildCakeAssembly({
          cakeId,
          includeTable: false,
          includePlaque: false,
        });
        built.group.rotation.y = -0.32;
        scene.add(built.group);

        renderer.clear(true, true, true);
        renderer.render(scene, camera);

        const dataUrl = renderer.domElement.toDataURL('image/png');
        thumbnailCache.set(`${CACHE_VERSION}-${cakeId}`, dataUrl);
        result[cakeId] = dataUrl;

        scene.remove(built.group);
        built.dispose();
      }

      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      try {
        renderer.forceContextLoss();
      } catch {
        // ignore
      }
    } catch (err) {
      console.warn('[cakeThumbnailRenderer] Failed to render 3D thumbnails:', err);
      renderer?.dispose();
    }
  });

  renderQueuePromise = task.catch(() => {});
  return task.then(() => {
    cakeIds.forEach((id) => {
      const v = thumbnailCache.get(`${CACHE_VERSION}-${id}`);
      if (v) result[id] = v;
    });
    return result;
  });
}
