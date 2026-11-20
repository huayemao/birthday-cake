import * as THREE from 'three';
import { CandleType } from '@/types';
import {
  createCandleStripeTexture,
  createDigitFaceTexture,
  createSoftGlowTexture,
  createSmokePuffTexture,
} from './cakeTextures';
import { disposeObject3D } from './cakeModels';

interface CandleInstance {
  flamePivot: THREE.Group;
  outerFlame: THREE.Mesh;
  innerFlame: THREE.Mesh;
  halo: THREE.Sprite;
  ember: THREE.Mesh;
  wickWorldTop: THREE.Vector3;
  phase: number;
  snuffDelay: number;
}

interface SmokeParticle {
  sprite: THREE.Sprite;
  vx: number;
  vy: number;
  vz: number;
  age: number;
  maxAge: number;
  origin: THREE.Vector3;
  baseScale: number;
  active: boolean;
}

export interface CandleUpdateInput {
  isExtinguished: boolean;
  isBlowing: boolean;
  blowingProgress: number;
  soundLevel: number;
}

export interface BuiltCandlesController {
  group: THREE.Group;
  /** 烛火平均高度（供暖光点光源定位） */
  flameCenterY: number;
  /** 每帧驱动火焰摇曳、吹气倾倒、熄灭余烬与袅袅青烟，返回当前综合火焰亮度 0..1 */
  update: (dt: number, elapsed: number, input: CandleUpdateInput) => number;
  dispose: () => void;
}

/** 柔滑立体泪滴形烛火几何体 */
function createFlameTeardropGeometry(radius: number, height: number): THREE.LatheGeometry {
  const pts: THREE.Vector2[] = [];
  const segs = 16;
  for (let i = 0; i <= segs; i++) {
    const t = i / segs; // 0 bottom -> 1 sharp tip
    const y = t * height;
    // 底部饱满，向上流畅收尖
    const r = Math.sin(Math.pow(t, 0.58) * Math.PI) * radius * (1 - t * 0.25);
    pts.push(new THREE.Vector2(Math.max(0.001, r), y));
  }
  return new THREE.LatheGeometry(pts, 18);
}

/** 构建全部 3D 蜡烛、立体火苗、烛芯余烬与吹灭后青烟粒子系统 */
export function buildCandlesController(options: {
  candleType: CandleType;
  candleCount: number;
  digits: string;
  surfaceY: number;
  maxRadius: number;
  initialExtinguished: boolean;
}): BuiltCandlesController {
  const { candleType, surfaceY, maxRadius, initialExtinguished } = options;
  const group = new THREE.Group();
  const candles: CandleInstance[] = [];

  const glowTex = createSoftGlowTexture('#fffbeb', '#fbbf24', 'rgba(251,146,60,0)');
  const smokeTex = createSmokePuffTexture();

  // 共享火焰几何与材质
  const outerFlameGeo = createFlameTeardropGeometry(0.056, 0.23);
  const innerFlameGeo = createFlameTeardropGeometry(0.028, 0.13);
  const blueCoreGeo = createFlameTeardropGeometry(0.032, 0.065);
  const wickGeo = new THREE.CylinderGeometry(0.006, 0.008, 0.065, 8);
  const emberGeo = new THREE.SphereGeometry(0.013, 8, 8);

  const outerFlameMat = new THREE.MeshBasicMaterial({
    color: 0xffa62b,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const innerFlameMat = new THREE.MeshBasicMaterial({
    color: 0xfffce0,
    transparent: true,
    opacity: 0.96,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const blueCoreMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const wickMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.9,
  });

  const holderMat = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    roughness: 0.35,
  });

  // 4 种温柔马卡龙螺旋条纹蜡烛材质
  const stripePalettes: Array<[string, string]> = [
    ['#fda4af', '#fff1f2'], // 樱花粉
    ['#fde68a', '#fffbeb'], // 奶油黄
    ['#c4b5fd', '#f5f3ff'], // 薰衣草
    ['#99f6e4', '#f0fdfa'], // 薄荷青
  ];
  const candleMats = stripePalettes.map(
    ([base, stripe]) =>
      new THREE.MeshPhysicalMaterial({
        map: createCandleStripeTexture(base, stripe, true),
        roughness: 0.34,
        clearcoat: 0.35,
        clearcoatRoughness: 0.28,
      })
  );

  const addFlameAssembly = (
    parent: THREE.Group,
    wickTopY: number,
    worldPos: THREE.Vector3,
    index: number,
    scale = 1
  ) => {
    const wick = new THREE.Mesh(wickGeo, wickMat);
    wick.position.y = wickTopY - 0.02;
    parent.add(wick);

    const emberMat = new THREE.MeshBasicMaterial({
      color: 0xff4500,
      transparent: true,
      opacity: 0,
    });
    const ember = new THREE.Mesh(emberGeo, emberMat);
    ember.position.y = wickTopY + 0.012;
    parent.add(ember);

    const flamePivot = new THREE.Group();
    flamePivot.position.y = wickTopY + 0.008;
    flamePivot.scale.setScalar(scale);

    const outerFlame = new THREE.Mesh(outerFlameGeo, outerFlameMat);
    flamePivot.add(outerFlame);

    const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
    innerFlame.position.y = 0.022;
    flamePivot.add(innerFlame);

    const blueCore = new THREE.Mesh(blueCoreGeo, blueCoreMat);
    blueCore.position.y = -0.004;
    flamePivot.add(blueCore);

    const haloMat = new THREE.SpriteMaterial({
      map: glowTex,
      color: 0xffb347,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const halo = new THREE.Sprite(haloMat);
    halo.position.y = 0.11;
    halo.scale.set(0.55, 0.55, 1);
    flamePivot.add(halo);

    parent.add(flamePivot);

    candles.push({
      flamePivot,
      outerFlame,
      innerFlame,
      halo,
      ember,
      wickWorldTop: worldPos.clone(),
      phase: index * 1.73 + 0.4,
      snuffDelay: (index % 7) * 0.032,
    });
  };

  let flameCenterY = surfaceY + 0.72;

  if (candleType === CandleType.CLASSIC) {
    const count = Math.max(1, Math.min(options.candleCount || 1, 50));
    const scaleFactor = count > 28 ? 0.74 : count > 14 ? 0.86 : 1.0;
    const candleRadius = 0.044 * scaleFactor;
    const candleHeight = 0.58 * (count > 28 ? 0.88 : 1.0);
    flameCenterY = surfaceY + candleHeight + 0.14;

    const bodyGeo = new THREE.CylinderGeometry(candleRadius, candleRadius * 1.06, candleHeight, 16);
    const collarGeo = new THREE.TorusGeometry(candleRadius * 1.05, candleRadius * 0.25, 8, 16);
    collarGeo.rotateX(Math.PI / 2);
    const baseCupGeo = new THREE.CylinderGeometry(candleRadius * 1.35, candleRadius * 0.9, 0.055, 14);

    // 同心圆自然排布算法（1根居中，多根由内向外错落环绕）
    const positions: Array<{ x: number; z: number; hMul: number }> = [];
    if (count === 1) {
      positions.push({ x: 0, z: 0, hMul: 1.15 });
    } else {
      const rings = count <= 6 ? 1 : count <= 18 ? 2 : 3;
      let remaining = count;
      for (let rIdx = 0; rIdx < rings; rIdx++) {
        const isLast = rIdx === rings - 1;
        let ringCount: number;
        if (isLast) {
          ringCount = remaining;
        } else if (rings === 2) {
          ringCount = Math.min(remaining, Math.max(1, Math.round(count * 0.32)));
        } else {
          ringCount = rIdx === 0 ? Math.min(remaining, 3) : Math.min(remaining, Math.round(count * 0.36));
        }
        remaining -= ringCount;

        const ringRadius =
          rings === 1
            ? maxRadius * 0.58
            : rIdx === 0 && ringCount === 1
            ? 0
            : maxRadius * (0.28 + (rIdx / (rings - 1)) * 0.64);

        for (let i = 0; i < ringCount; i++) {
          const angle = (i / ringCount) * Math.PI * 2 + rIdx * 0.45;
          const jitterR = ((i * 7 + rIdx * 3) % 3 - 1) * 0.025;
          const x = Math.cos(angle) * Math.max(0, ringRadius + jitterR);
          const z = Math.sin(angle) * Math.max(0, ringRadius + jitterR);
          const hMul = 0.92 + ((i + rIdx) % 3) * 0.09;
          positions.push({ x, z, hMul });
        }
      }
    }

    positions.forEach((pos, idx) => {
      const cGroup = new THREE.Group();
      const h = candleHeight * pos.hMul;
      cGroup.position.set(pos.x, surfaceY, pos.z);

      const cup = new THREE.Mesh(baseCupGeo, holderMat);
      cup.position.y = 0.026;
      cGroup.add(cup);

      const body = new THREE.Mesh(bodyGeo, candleMats[idx % candleMats.length]);
      body.scale.set(1, pos.hMul, 1);
      body.position.y = 0.04 + h / 2;
      body.castShadow = true;
      cGroup.add(body);

      const collar = new THREE.Mesh(collarGeo, holderMat);
      collar.position.y = 0.04 + h - 0.01;
      cGroup.add(collar);

      const wickTopY = 0.04 + h + 0.032;
      addFlameAssembly(
        cGroup,
        wickTopY,
        new THREE.Vector3(pos.x, surfaceY + wickTopY + 0.02, pos.z),
        idx,
        scaleFactor * 1.05
      );

      group.add(cGroup);
    });
  } else {
    // 立体数字蜡烛（精致圆角金边 3D 块体）
    const digitStr = (options.digits || '0').slice(0, 4);
    const chars = digitStr.split('');
    const spacing = chars.length >= 4 ? 0.36 : chars.length === 3 ? 0.44 : 0.52;
    const digitW = chars.length >= 4 ? 0.32 : 0.4;
    const digitH = chars.length >= 4 ? 0.44 : 0.54;
    const digitD = 0.09;
    flameCenterY = surfaceY + digitH + 0.24;

    const sideGoldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.22,
      metalness: 0.78,
    });
    const stickGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.14, 10);

    chars.forEach((char, idx) => {
      const x = (idx - (chars.length - 1) / 2) * spacing;
      const z = Math.abs(idx - (chars.length - 1) / 2) * -0.04;

      const dGroup = new THREE.Group();
      dGroup.position.set(x, surfaceY, z);

      // 底部插签
      const stick = new THREE.Mesh(stickGeo, holderMat);
      stick.position.y = 0.07;
      dGroup.add(stick);

      // 立体数字主体
      const faceTex = createDigitFaceTexture(char, idx);
      const faceMat = new THREE.MeshPhysicalMaterial({
        map: faceTex,
        roughness: 0.24,
        clearcoat: 0.65,
      });
      const boxGeo = new THREE.BoxGeometry(digitW, digitH, digitD);
      const box = new THREE.Mesh(boxGeo, [
        sideGoldMat,
        sideGoldMat,
        sideGoldMat,
        sideGoldMat,
        faceMat,
        faceMat,
      ]);
      box.position.y = 0.12 + digitH / 2;
      box.castShadow = true;
      dGroup.add(box);

      const wickTopY = 0.12 + digitH + 0.036;
      addFlameAssembly(
        dGroup,
        wickTopY,
        new THREE.Vector3(x, surfaceY + wickTopY + 0.02, z),
        idx,
        1.25
      );

      group.add(dGroup);
    });
  }

  // 构建吹灭后的袅袅青烟粒子池（每根蜡烛最多分配 2-3 个烟团，总计上限 42 个保证高帧率）
  const smokeParticles: SmokeParticle[] = [];
  const smokeGroup = new THREE.Group();
  const maxSmoke = Math.min(42, Math.max(12, candles.length * 3));
  for (let i = 0; i < maxSmoke; i++) {
    const srcCandle = candles[i % candles.length];
    const mat = new THREE.SpriteMaterial({
      map: smokeTex,
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.visible = false;
    smokeGroup.add(sprite);

    smokeParticles.push({
      sprite,
      vx: 0,
      vy: 0,
      vz: 0,
      age: 0,
      maxAge: 2.2,
      origin: srcCandle.wickWorldTop.clone(),
      baseScale: 0.14,
      active: false,
    });
  }
  group.add(smokeGroup);

  let wasExtinguished = initialExtinguished;
  let extinguishElapsed = initialExtinguished ? 10 : 0;
  let smoothSound = 0;

  const triggerSmokeBurst = () => {
    smokeParticles.forEach((p, idx) => {
      const candle = candles[idx % candles.length];
      p.origin.copy(candle.wickWorldTop);
      p.age = -((idx % 4) * 0.24 + Math.random() * 0.18); // 分批缓缓飘出
      p.maxAge = 2.0 + Math.random() * 1.4;
      p.vx = (Math.random() - 0.5) * 0.12;
      p.vy = 0.28 + Math.random() * 0.16;
      p.vz = (Math.random() - 0.5) * 0.12;
      p.baseScale = 0.1 + Math.random() * 0.08;
      p.active = true;
      p.sprite.position.copy(p.origin);
      p.sprite.visible = false;
    });
  };

  // 初始化状态
  if (initialExtinguished) {
    candles.forEach((c) => {
      c.flamePivot.visible = false;
    });
  }

  const update = (dt: number, elapsed: number, input: CandleUpdateInput): number => {
    const { isExtinguished, isBlowing, blowingProgress, soundLevel } = input;
    const clampedDt = Math.min(dt, 0.06);

    // 检测刚吹灭或刚重新点亮
    if (isExtinguished && !wasExtinguished) {
      extinguishElapsed = 0;
      triggerSmokeBurst();
    } else if (!isExtinguished && wasExtinguished) {
      extinguishElapsed = 0;
      smokeParticles.forEach((p) => {
        p.active = false;
        p.sprite.visible = false;
      });
    }
    wasExtinguished = isExtinguished;

    if (isExtinguished) {
      extinguishElapsed += clampedDt;
    }

    smoothSound += (soundLevel - smoothSound) * Math.min(1, clampedDt * 14);
    const blowIntensity = isBlowing ? Math.max(0.35, blowingProgress / 100) : 0;

    let sumLight = 0;

    for (let i = 0; i < candles.length; i++) {
      const c = candles[i];
      const emberMat = c.ember.material as THREE.MeshBasicMaterial;
      const haloMat = c.halo.material as THREE.SpriteMaterial;

      if (isExtinguished) {
        const localT = extinguishElapsed - c.snuffDelay;
        if (localT < 0.22) {
          // 瞬间收缩熄灭过渡
          const shrink = Math.max(0, 1 - Math.max(0, localT) / 0.22);
          c.flamePivot.visible = shrink > 0.02;
          c.flamePivot.scale.set(shrink * 0.8, shrink * 1.1, shrink * 0.8);
          c.flamePivot.rotation.x = -0.65;
          haloMat.opacity = shrink * 0.5;
          sumLight += shrink;
        } else {
          c.flamePivot.visible = false;
          // 烛芯温暖红炽余烬在 2.4 秒内缓缓冷却
          const emberT = Math.max(0, 1 - (localT - 0.22) / 2.2);
          c.ember.visible = emberT > 0.02;
          emberMat.opacity = emberT * (0.75 + 0.25 * Math.sin(elapsed * 14 + c.phase));
        }
      } else {
        c.flamePivot.visible = true;
        c.ember.visible = false;

        // 有机摇曳 + 环境声波抖动 + 吹气大幅度向后倾斜压低
        const organicX =
          Math.sin(elapsed * 5.2 + c.phase) * 0.055 +
          Math.sin(elapsed * 11.8 + c.phase * 2.1) * 0.028;
        const organicZ =
          Math.cos(elapsed * 4.6 + c.phase * 1.3) * 0.05 +
          Math.sin(elapsed * 9.4 + c.phase) * 0.022;

        const tremor = smoothSound * 0.28;
        const blowLean = blowIntensity * 0.72;
        const blowFlutter = blowIntensity * Math.sin(elapsed * 32 + c.phase * 3) * 0.16;

        c.flamePivot.rotation.x = organicX - blowLean + blowFlutter + Math.sin(elapsed * 18 + c.phase) * tremor;
        c.flamePivot.rotation.z = organicZ + Math.cos(elapsed * 16 + c.phase) * (tremor + blowIntensity * 0.22);

        const flickerScale = 1 + Math.sin(elapsed * 9.5 + c.phase) * 0.065 + smoothSound * 0.14;
        const shrinkByBlow = Math.max(0.28, 1 - blowIntensity * 0.58);
        const stretchY = flickerScale * shrinkByBlow * (1 + blowIntensity * 0.18);
        const widthXZ = (1 - blowIntensity * 0.25) * (0.96 + Math.cos(elapsed * 7 + c.phase) * 0.04);

        c.flamePivot.scale.set(widthXZ, stretchY, widthXZ);

        const brightness = shrinkByBlow * (0.85 + 0.15 * Math.sin(elapsed * 12 + c.phase) + smoothSound * 0.2);
        haloMat.opacity = Math.min(0.95, 0.62 * brightness);
        const haloSize = (0.52 + smoothSound * 0.16) * Math.max(0.45, shrinkByBlow);
        c.halo.scale.set(haloSize, haloSize, 1);
        sumLight += brightness;
      }
    }

    // 更新袅袅青烟粒子
    for (let i = 0; i < smokeParticles.length; i++) {
      const p = smokeParticles[i];
      if (!p.active) continue;
      p.age += clampedDt;
      if (p.age < 0) {
        p.sprite.visible = false;
        continue;
      }
      if (p.age >= p.maxAge) {
        p.active = false;
        p.sprite.visible = false;
        continue;
      }

      const t = p.age / p.maxAge;
      p.sprite.visible = true;
      const curlX = Math.sin(p.age * 3.1 + i) * 0.08 * t;
      const curlZ = Math.cos(p.age * 2.6 + i * 1.4) * 0.08 * t;

      p.sprite.position.set(
        p.origin.x + p.vx * p.age + curlX,
        p.origin.y + p.vy * p.age + 0.05,
        p.origin.z + p.vz * p.age + curlZ
      );

      const scale = p.baseScale * (1 + t * 3.4);
      p.sprite.scale.set(scale, scale, 1);

      const mat = p.sprite.material as THREE.SpriteMaterial;
      // 淡入再优雅淡出
      mat.opacity = Math.sin(t * Math.PI) * 0.44 * (1 - t * 0.35);
    }

    return candles.length > 0 ? Math.min(1.25, sumLight / candles.length) : 0;
  };

  return {
    group,
    flameCenterY,
    update,
    dispose: () => disposeObject3D(group),
  };
}
