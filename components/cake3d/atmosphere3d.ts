import * as THREE from 'three';
import { createSoftGlowTexture } from './cakeTextures';
import { disposeObject3D } from './cakeModels';
import { WebGLTier } from '@/utils/webglSupport';

interface ConfettiPiece {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  rz: number;
  vrx: number;
  vry: number;
  vrz: number;
  life: number;
  maxLife: number;
}

export interface AtmosphereController {
  group: THREE.Group;
  triggerCelebrationBurst: () => void;
  update: (dt: number, elapsed: number, isExtinguished: boolean, soundLevel: number) => void;
  dispose: () => void;
}

/**
 * 蛋糕周围浪漫氛围场景：
 * 1. 背景弧形暖光串灯（Fairy String Lights）
 * 2. 漂浮星尘与焦外光斑（Floating Bokeh Dust）
 * 3. 桌面散落玫瑰花瓣与金色小星星
 * 4. 吹灭蜡烛瞬间的 3D 立体彩带与金星礼花爆发
 */
export function buildAtmosphereController(tier: WebGLTier): AtmosphereController {
  const group = new THREE.Group();
  const isHigh = tier === 'high';

  const warmGlowTex = createSoftGlowTexture('#fffbeb', '#fde68a', 'rgba(251,191,36,0)');
  const roseGlowTex = createSoftGlowTexture('#fff1f2', '#f472b6', 'rgba(244,114,182,0)');

  // 1. 远景弧形梦幻串灯 (Fairy Lights Arch)
  const stringGroup = new THREE.Group();
  const bulbCount = isHigh ? 13 : 9;
  const bulbSprites: Array<{ sprite: THREE.Sprite; phase: number; baseScale: number }> = [];
  const curvePts: THREE.Vector3[] = [];

  for (let i = 0; i < bulbCount; i++) {
    const t = i / (bulbCount - 1);
    const angle = (t - 0.5) * Math.PI * 0.92;
    const radius = 4.4;
    const x = Math.sin(angle) * radius;
    const z = -Math.cos(angle) * radius * 0.85 - 0.4;
    const sag = Math.sin(t * Math.PI) * 0.48;
    const y = 2.65 - sag;
    curvePts.push(new THREE.Vector3(x, y, z));

    const mat = new THREE.SpriteMaterial({
      map: i % 3 === 0 ? roseGlowTex : warmGlowTex,
      color: i % 3 === 0 ? 0xf9a8d4 : 0xfde68a,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat);
    const baseScale = 0.42 + (i % 3) * 0.1;
    sprite.position.set(x, y, z);
    sprite.scale.set(baseScale, baseScale, 1);
    stringGroup.add(sprite);
    bulbSprites.push({ sprite, phase: i * 0.85, baseScale });
  }

  // 细优雅弧线串灯线
  const curve = new THREE.CatmullRomCurve3(curvePts);
  const wireGeo = new THREE.TubeGeometry(curve, 36, 0.008, 6, false);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x94a3b8,
    transparent: true,
    opacity: 0.25,
  });
  stringGroup.add(new THREE.Mesh(wireGeo, wireMat));
  group.add(stringGroup);

  // 2. 环绕蛋糕缓缓升腾的金色仙尘粒子 (Fairy Dust Points)
  const dustCount = isHigh ? 75 : 40;
  const dustPositions = new Float32Array(dustCount * 3);
  const dustMeta: Array<{ angle: number; radius: number; y: number; speed: number; phase: number }> = [];

  for (let i = 0; i < dustCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.65 + Math.random() * 2.6;
    const y = -0.6 + Math.random() * 3.8;
    dustMeta.push({
      angle,
      radius,
      y,
      speed: 0.12 + Math.random() * 0.22,
      phase: Math.random() * Math.PI * 2,
    });
    dustPositions[i * 3] = Math.cos(angle) * radius;
    dustPositions[i * 3 + 1] = y;
    dustPositions[i * 3 + 2] = Math.sin(angle) * radius;
  }

  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const dustMat = new THREE.PointsMaterial({
    map: warmGlowTex,
    size: 0.16,
    transparent: true,
    opacity: 0.68,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    color: 0xfef08a,
  });
  const dustPoints = new THREE.Points(dustGeo, dustMat);
  group.add(dustPoints);

  // 3. 桌面优雅装饰：散落玫瑰花瓣与金色糖星
  const petalGeo = new THREE.SphereGeometry(0.11, 10, 8);
  petalGeo.scale(1.3, 0.12, 0.85);
  const petalMat = new THREE.MeshStandardMaterial({
    color: 0xfb7185,
    roughness: 0.55,
  });
  const goldStarGeo = new THREE.OctahedronGeometry(0.055, 0);
  goldStarGeo.scale(1, 0.22, 1);
  const goldStarMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.2,
    metalness: 0.9,
  });

  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + 0.35;
    const r = 1.35 + (i % 4) * 0.38;
    const mesh = new THREE.Mesh(i % 2 === 0 ? petalGeo : goldStarGeo, i % 2 === 0 ? petalMat : goldStarMat);
    mesh.position.set(Math.cos(a) * r, -0.805, Math.sin(a) * r);
    mesh.rotation.y = a * 2.1;
    group.add(mesh);
  }

  // 4. 吹灭后的 3D 立体庆祝礼花彩带 (InstancedMesh)
  const confettiCount = isHigh ? 140 : 80;
  const confettiGeo = new THREE.PlaneGeometry(0.11, 0.22);
  const confettiMat = new THREE.MeshStandardMaterial({
    roughness: 0.28,
    metalness: 0.45,
    side: THREE.DoubleSide,
  });
  const confettiMesh = new THREE.InstancedMesh(confettiGeo, confettiMat, confettiCount);
  confettiMesh.visible = false;

  const palette = [0xf43f5e, 0xfb7185, 0xfacc15, 0x38bdf8, 0xc084fc, 0x34d399, 0xfb923c];
  const colorTmp = new THREE.Color();
  const confettiPieces: ConfettiPiece[] = [];
  const dummy = new THREE.Object3D();

  for (let i = 0; i < confettiCount; i++) {
    colorTmp.setHex(palette[i % palette.length]);
    confettiMesh.setColorAt(i, colorTmp);
    confettiPieces.push({
      x: 0, y: -10, z: 0,
      vx: 0, vy: 0, vz: 0,
      rx: 0, ry: 0, rz: 0,
      vrx: 0, vry: 0, vrz: 0,
      life: 99, maxLife: 4,
    });
  }
  if (confettiMesh.instanceColor) confettiMesh.instanceColor.needsUpdate = true;
  group.add(confettiMesh);

  let confettiActive = false;

  const triggerCelebrationBurst = () => {
    confettiActive = true;
    confettiMesh.visible = true;
    for (let i = 0; i < confettiCount; i++) {
      const p = confettiPieces[i];
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 2.8;
      p.x = (Math.random() - 0.5) * 0.4;
      p.y = 1.85 + Math.random() * 0.5;
      p.z = (Math.random() - 0.5) * 0.4;
      p.vx = Math.cos(angle) * speed;
      p.vy = 2.4 + Math.random() * 3.1;
      p.vz = Math.sin(angle) * speed;
      p.rx = Math.random() * Math.PI;
      p.ry = Math.random() * Math.PI;
      p.rz = Math.random() * Math.PI;
      p.vrx = (Math.random() - 0.5) * 9;
      p.vry = (Math.random() - 0.5) * 9;
      p.vrz = (Math.random() - 0.5) * 9;
      p.life = 0;
      p.maxLife = 4.2 + Math.random() * 2.4;
    }
  };

  const update = (dt: number, elapsed: number, isExtinguished: boolean, soundLevel: number) => {
    const clampedDt = Math.min(dt, 0.06);

    // 串灯柔和呼吸闪烁（吹灭庆祝时闪烁更欢快）
    const twinkleSpeed = isExtinguished ? 4.2 : 1.8;
    for (let i = 0; i < bulbSprites.length; i++) {
      const b = bulbSprites[i];
      const pulse = 0.72 + 0.28 * Math.sin(elapsed * twinkleSpeed + b.phase);
      const scale = b.baseScale * (0.9 + pulse * 0.25 + soundLevel * 0.16);
      b.sprite.scale.set(scale, scale, 1);
      (b.sprite.material as THREE.SpriteMaterial).opacity = (isExtinguished ? 0.85 : 0.62) * pulse;
    }

    // 仙尘粒子盘旋上升
    const posAttr = dustGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < dustCount; i++) {
      const m = dustMeta[i];
      m.angle += clampedDt * (isExtinguished ? 0.24 : 0.12);
      m.y += clampedDt * m.speed * (isExtinguished ? 1.8 : 1.0);
      if (m.y > 3.6) m.y = -0.65;

      const wobble = Math.sin(elapsed * 1.6 + m.phase) * 0.12;
      posAttr.setXYZ(
        i,
        Math.cos(m.angle) * (m.radius + wobble),
        m.y,
        Math.sin(m.angle) * (m.radius + wobble)
      );
    }
    posAttr.needsUpdate = true;
    dustMat.opacity = isExtinguished ? 0.85 : 0.55 + soundLevel * 0.25;

    // 更新 3D 礼花彩带物理轨迹
    if (confettiActive) {
      let alive = 0;
      for (let i = 0; i < confettiCount; i++) {
        const p = confettiPieces[i];
        p.life += clampedDt;
        if (p.life >= p.maxLife) {
          dummy.scale.setScalar(0.0001);
          dummy.updateMatrix();
          confettiMesh.setMatrixAt(i, dummy.matrix);
          continue;
        }
        alive++;
        p.vy -= 3.6 * clampedDt; // 重力
        p.vx *= 0.985;
        p.vz *= 0.985;
        // 空气飘荡
        p.x += (p.vx + Math.sin(elapsed * 4 + i) * 0.35) * clampedDt;
        p.y += p.vy * clampedDt;
        p.z += (p.vz + Math.cos(elapsed * 3.5 + i) * 0.35) * clampedDt;

        // 落到桌面停止
        if (p.y < -0.78) {
          p.y = -0.78;
          p.vy = 0;
          p.vx *= 0.8;
          p.vz *= 0.8;
          p.rx = Math.PI / 2;
        } else {
          p.rx += p.vrx * clampedDt;
          p.ry += p.vry * clampedDt;
          p.rz += p.vrz * clampedDt;
        }

        const fadeOut = p.life > p.maxLife - 0.8 ? (p.maxLife - p.life) / 0.8 : 1;
        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(p.rx, p.ry, p.rz);
        dummy.scale.setScalar(Math.max(0.001, fadeOut));
        dummy.updateMatrix();
        confettiMesh.setMatrixAt(i, dummy.matrix);
      }
      confettiMesh.instanceMatrix.needsUpdate = true;
      if (alive === 0) {
        confettiActive = false;
        confettiMesh.visible = false;
      }
    }
  };

  return {
    group,
    triggerCelebrationBurst,
    update,
    dispose: () => disposeObject3D(group),
  };
}
