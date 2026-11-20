import * as THREE from 'three';
import { SceneTheme } from '@/types';
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

interface FloatingPetal {
  mesh: THREE.Mesh;
  angle: number;
  radius: number;
  y: number;
  fallSpeed: number;
  spinSpeed: number;
  phase: number;
}

export interface AtmosphereController {
  group: THREE.Group;
  triggerCelebrationBurst: () => void;
  update: (dt: number, elapsed: number, isExtinguished: boolean, soundLevel: number) => void;
  dispose: () => void;
}

/**
 * 可自由搭配的 3D 场景环境氛围系统：
 * - fairy-lights: 浪漫暖光串灯 + 金色仙尘 + 桌面花瓣星饰
 * - starry-night: 深邃星河秘境（无串灯线，满天 3D 闪烁星座星尘）
 * - warm-candlelight: 温馨烛影萤火（漂浮柔暖焦外光斑，无串灯线）
 * - cherry-blossom: 樱花漫舞（3D 粉色樱花花瓣轻盈飘落）
 * - minimal-studio: 极简纯净影棚（无背景装饰，聚焦蛋糕本身）
 */
export function buildAtmosphereController(
  tier: WebGLTier,
  theme: SceneTheme = 'fairy-lights'
): AtmosphereController {
  const group = new THREE.Group();
  const isHigh = tier === 'high';

  const warmGlowTex = createSoftGlowTexture('#fffbeb', '#fde68a', 'rgba(251,191,36,0)');
  const roseGlowTex = createSoftGlowTexture('#fff1f2', '#f472b6', 'rgba(244,114,182,0)');
  const starGlowTex = createSoftGlowTexture('#ffffff', '#c7d2fe', 'rgba(129,140,248,0)');

  const bulbSprites: Array<{ sprite: THREE.Sprite; phase: number; baseScale: number }> = [];
  const floatingOrbs: Array<{ sprite: THREE.Sprite; angle: number; radius: number; baseY: number; speed: number; phase: number; baseScale: number }> = [];
  const fallingPetals: FloatingPetal[] = [];

  let dustGeo: THREE.BufferGeometry | null = null;
  let dustMat: THREE.PointsMaterial | null = null;
  const dustMeta: Array<{ angle: number; radius: number; y: number; speed: number; phase: number }> = [];

  // ===== 主题 1：浪漫串灯 (fairy-lights) =====
  if (theme === 'fairy-lights') {
    const stringGroup = new THREE.Group();
    const bulbCount = isHigh ? 13 : 9;
    const curvePts: THREE.Vector3[] = [];

    for (let i = 0; i < bulbCount; i++) {
      const t = i / (bulbCount - 1);
      const angle = (t - 0.5) * Math.PI * 0.92;
      const radius = 4.6;
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius * 0.82 - 0.5;
      const sag = Math.sin(t * Math.PI) * 0.45;
      const y = 2.85 - sag;
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

    // 极细腻暖金色丝线（避免发白突兀）
    const curve = new THREE.CatmullRomCurve3(curvePts);
    const wireGeo = new THREE.TubeGeometry(curve, 36, 0.005, 6, false);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xd9b36c,
      transparent: true,
      opacity: 0.16,
    });
    stringGroup.add(new THREE.Mesh(wireGeo, wireMat));
    group.add(stringGroup);
  }

  // ===== 主题 2：星河秘境 (starry-night) =====
  if (theme === 'starry-night') {
    const starCount = isHigh ? 120 : 70;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.52;
      const r = 4.4 + Math.random() * 4.2;
      starPos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      starPos[i * 3 + 1] = 0.5 + Math.cos(phi) * r * 0.75;
      starPos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      map: starGlowTex,
      size: 0.22,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xe0e7ff,
    });
    group.add(new THREE.Points(starGeo, starMat));
  }

  // ===== 主题 3：暖光烛影萤火 (warm-candlelight) =====
  if (theme === 'warm-candlelight') {
    const orbCount = isHigh ? 18 : 11;
    for (let i = 0; i < orbCount; i++) {
      const angle = (i / orbCount) * Math.PI * 2 + Math.random() * 0.3;
      const radius = 2.6 + Math.random() * 2.4;
      const baseY = 0.4 + Math.random() * 2.8;
      const baseScale = 0.28 + Math.random() * 0.36;
      const mat = new THREE.SpriteMaterial({
        map: warmGlowTex,
        color: i % 2 === 0 ? 0xfbbf24 : 0xfb923c,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius);
      sprite.scale.set(baseScale, baseScale, 1);
      group.add(sprite);
      floatingOrbs.push({
        sprite,
        angle,
        radius,
        baseY,
        speed: 0.08 + Math.random() * 0.14,
        phase: Math.random() * Math.PI * 2,
        baseScale,
      });
    }
  }

  // ===== 主题 4：樱花漫舞 (cherry-blossom) =====
  if (theme === 'cherry-blossom') {
    const petalCount = isHigh ? 34 : 20;
    const petalGeo = new THREE.SphereGeometry(0.085, 8, 6);
    petalGeo.scale(1.35, 0.14, 0.85);
    const petalMats = [
      new THREE.MeshStandardMaterial({ color: 0xffc2d4, roughness: 0.55 }),
      new THREE.MeshStandardMaterial({ color: 0xffa6c1, roughness: 0.55 }),
      new THREE.MeshStandardMaterial({ color: 0xffe5ec, roughness: 0.5 }),
    ];

    for (let i = 0; i < petalCount; i++) {
      const mesh = new THREE.Mesh(petalGeo, petalMats[i % petalMats.length]);
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.9 + Math.random() * 2.5;
      const y = Math.random() * 3.8;
      mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      group.add(mesh);
      fallingPetals.push({
        mesh,
        angle,
        radius,
        y,
        fallSpeed: 0.25 + Math.random() * 0.28,
        spinSpeed: 1.2 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  // ===== 通用柔和仙尘（极简纯净模式除外） =====
  if (theme !== 'minimal-studio') {
    const dustCount = isHigh ? 60 : 32;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.9 + Math.random() * 2.5;
      const y = 0.1 + Math.random() * 3.4;
      dustMeta.push({
        angle,
        radius,
        y,
        speed: 0.12 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
      });
      dustPositions[i * 3] = Math.cos(angle) * radius;
      dustPositions[i * 3 + 1] = y;
      dustPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustMat = new THREE.PointsMaterial({
      map: theme === 'starry-night' ? starGlowTex : theme === 'cherry-blossom' ? roseGlowTex : warmGlowTex,
      size: 0.15,
      transparent: true,
      opacity: 0.58,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: theme === 'starry-night' ? 0xc7d2fe : theme === 'cherry-blossom' ? 0xfbcfe8 : 0xfef08a,
    });
    group.add(new THREE.Points(dustGeo, dustMat));
  }

  // ===== 地面浪漫散落装饰（浪漫串灯 / 樱花主题） =====
  if (theme === 'fairy-lights' || theme === 'cherry-blossom') {
    const petalGeo = new THREE.SphereGeometry(0.095, 10, 8);
    petalGeo.scale(1.3, 0.12, 0.85);
    const petalMat = new THREE.MeshStandardMaterial({
      color: theme === 'cherry-blossom' ? 0xffb3c6 : 0xf472b6,
      roughness: 0.6,
    });
    const goldStarGeo = new THREE.OctahedronGeometry(0.05, 0);
    goldStarGeo.scale(1, 0.22, 1);
    const goldStarMat = new THREE.MeshStandardMaterial({
      color: 0xf5cc5c,
      roughness: 0.28,
      metalness: 0.65,
    });

    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + 0.35;
      const r = 1.82 + (i % 3) * 0.3;
      const isPetal = theme === 'cherry-blossom' || i % 2 === 0;
      const mesh = new THREE.Mesh(isPetal ? petalGeo : goldStarGeo, isPetal ? petalMat : goldStarMat);
      mesh.position.set(Math.cos(a) * r, 0.0, Math.sin(a) * r);
      mesh.rotation.y = a * 2.1;
      group.add(mesh);
    }
  }

  // ===== 吹灭后的 3D 立体庆祝礼花彩带（全主题保留） =====
  const confettiCount = isHigh ? 140 : 80;
  const confettiGeo = new THREE.PlaneGeometry(0.11, 0.22);
  const confettiMat = new THREE.MeshStandardMaterial({
    roughness: 0.32,
    metalness: 0.35,
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

    // 串灯呼吸闪烁
    if (bulbSprites.length > 0) {
      const twinkleSpeed = isExtinguished ? 4.2 : 1.8;
      for (let i = 0; i < bulbSprites.length; i++) {
        const b = bulbSprites[i];
        const pulse = 0.72 + 0.28 * Math.sin(elapsed * twinkleSpeed + b.phase);
        const scale = b.baseScale * (0.9 + pulse * 0.25 + soundLevel * 0.16);
        b.sprite.scale.set(scale, scale, 1);
        (b.sprite.material as THREE.SpriteMaterial).opacity = (isExtinguished ? 0.85 : 0.6) * pulse;
      }
    }

    // 暖光萤火漂浮
    for (let i = 0; i < floatingOrbs.length; i++) {
      const o = floatingOrbs[i];
      o.angle += clampedDt * o.speed;
      const y = o.baseY + Math.sin(elapsed * 1.3 + o.phase) * 0.24;
      o.sprite.position.set(Math.cos(o.angle) * o.radius, y, Math.sin(o.angle) * o.radius);
      const pulse = 0.75 + 0.25 * Math.sin(elapsed * 2.2 + o.phase);
      const sc = o.baseScale * pulse;
      o.sprite.scale.set(sc, sc, 1);
      (o.sprite.material as THREE.SpriteMaterial).opacity = 0.52 * pulse;
    }

    // 樱花花瓣飘落
    for (let i = 0; i < fallingPetals.length; i++) {
      const fp = fallingPetals[i];
      fp.y -= clampedDt * fp.fallSpeed;
      fp.angle += clampedDt * 0.18;
      if (fp.y < 0.04) {
        fp.y = 3.6 + Math.random() * 0.4;
      }
      const sway = Math.sin(elapsed * 1.8 + fp.phase) * 0.25;
      fp.mesh.position.set(
        Math.cos(fp.angle) * (fp.radius + sway),
        fp.y,
        Math.sin(fp.angle) * (fp.radius + sway)
      );
      fp.mesh.rotation.x += clampedDt * fp.spinSpeed;
      fp.mesh.rotation.z += clampedDt * fp.spinSpeed * 0.7;
    }

    // 仙尘粒子盘旋上升
    if (dustGeo && dustMat) {
      const posAttr = dustGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < dustMeta.length; i++) {
        const m = dustMeta[i];
        m.angle += clampedDt * (isExtinguished ? 0.24 : 0.12);
        m.y += clampedDt * m.speed * (isExtinguished ? 1.8 : 1.0);
        if (m.y > 3.6) m.y = 0.05;

        const wobble = Math.sin(elapsed * 1.6 + m.phase) * 0.12;
        posAttr.setXYZ(
          i,
          Math.cos(m.angle) * (m.radius + wobble),
          m.y,
          Math.sin(m.angle) * (m.radius + wobble)
        );
      }
      posAttr.needsUpdate = true;
      dustMat.opacity = isExtinguished ? 0.82 : 0.52 + soundLevel * 0.24;
    }

    // 3D 礼花彩带物理轨迹
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
        p.vy -= 3.6 * clampedDt;
        p.vx *= 0.985;
        p.vz *= 0.985;
        p.x += (p.vx + Math.sin(elapsed * 4 + i) * 0.35) * clampedDt;
        p.y += p.vy * clampedDt;
        p.z += (p.vz + Math.cos(elapsed * 3.5 + i) * 0.35) * clampedDt;

        if (p.y < 0.02) {
          p.y = 0.02;
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
