import * as THREE from 'three';
import { CardStyle } from '@/types';
import {
  createSilkyFrostingBumpTexture,
  createRainbowFrostingTexture,
  createStarryVelvetTexture,
  createLaceDoilyTexture,
  createStrawberryTexture,
  createPlaqueTexture,
  getPlaqueSideColor,
  createTableSurfaceTexture,
  PlaqueContentOptions,
} from './cakeTextures';

export interface BuiltCakeResult {
  group: THREE.Group;
  /** 顶面放置蜡烛的 Y 坐标 */
  candleSurfaceY: number;
  /** 顶面可放蜡烛的安全半径 */
  candleMaxRadius: number;
  /** 蛋糕主色调（用于氛围微光） */
  accentColor: number;
  /** 实时更新蛋糕前祝福卡片内容与风格（零闪烁、不重建蛋糕） */
  updatePlaque: (content: PlaqueContentOptions) => void;
  dispose: () => void;
}

/** 递归释放 Group 下全部几何体、材质与贴图 */
export function disposeObject3D(root: THREE.Object3D): void {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) {
      geometries.add(mesh.geometry);
    }
    if (mesh.material) {
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        materials.add(m);
        const rec = m as unknown as Record<string, unknown>;
        for (const key of Object.keys(rec)) {
          const val = rec[key];
          if (val && typeof val === 'object' && (val as THREE.Texture).isTexture) {
            textures.add(val as THREE.Texture);
          }
        }
      });
    }
  });

  textures.forEach((t) => t.dispose());
  materials.forEach((m) => m.dispose());
  geometries.forEach((g) => g.dispose());
}

/** 创建圆润柔滑倒角蛋糕胚（用于纯色奶油/巧克力层） */
function createRoundedCakeTierGeometry(radius: number, height: number, bevel = 0.08): THREE.LatheGeometry {
  const b = Math.min(bevel, radius * 0.25, height * 0.25);
  const pts: THREE.Vector2[] = [];
  pts.push(new THREE.Vector2(0, 0));
  pts.push(new THREE.Vector2(radius - b, 0));

  const steps = 6;
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(radius - b + Math.cos(a) * b, b + Math.sin(a) * b));
  }
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(radius - b + Math.cos(a) * b, height - b + Math.sin(a) * b));
  }
  pts.push(new THREE.Vector2(0, height));

  return new THREE.LatheGeometry(pts, 64);
}

/**
 * 创建带完整侧面 UV 渐变（v=0..1 严格对应底到顶）的蛋糕层组合，
 * 确保彩虹渐变与紫绒星夜等垂直渐变贴图色彩饱满清晰不被拉伸发白。
 */
function createTexturedTierGroup(
  radius: number,
  height: number,
  sideMat: THREE.Material,
  topCapMat: THREE.Material
): THREE.Group {
  const g = new THREE.Group();
  const cylGeo = new THREE.CylinderGeometry(radius, radius, height, 64, 1, true);
  const wall = new THREE.Mesh(cylGeo, sideMat);
  wall.position.y = height / 2;
  wall.castShadow = true;
  g.add(wall);

  const capGeo = new THREE.CircleGeometry(radius, 64);
  capGeo.rotateX(-Math.PI / 2);
  const topCap = new THREE.Mesh(capGeo, topCapMat);
  topCap.position.y = height;
  g.add(topCap);

  const botCap = new THREE.Mesh(capGeo, topCapMat);
  botCap.rotation.x = Math.PI;
  botCap.position.y = 0;
  g.add(botCap);

  return g;
}

/**
 * 创建洁净圆润的星嘴奶油裱花球（基于闭环球体平滑塑形，彻底消除底部黑边锯齿！）
 */
function createPipedRosetteGeometry(radius = 0.115, height = 0.15): THREE.BufferGeometry {
  const geom = new THREE.SphereGeometry(1, 24, 16);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const ux = pos.getX(i);
    const uy = pos.getY(i);
    const uz = pos.getZ(i);

    // 归一化高度 t: 0 (底端) -> 1 (顶端尖嘴)
    const t = (uy + 1) * 0.5;
    const angle = Math.atan2(uz, ux);
    const horiz = Math.sqrt(ux * ux + uz * uz);

    // 饱满底部圆弧 + 向上优雅收拢成奶油尖顶 + 6 瓣轻柔螺旋棱线
    const profileR = Math.sin(Math.pow(t, 0.68) * Math.PI) * (1 - t * 0.34);
    const twist = t * 1.65;
    const flute = 1 + 0.14 * Math.sin(6 * (angle + twist)) * Math.sin(t * Math.PI);

    const r = horiz > 1e-4 ? radius * profileR * flute : 0;
    const y = Math.pow(t, 0.92) * height;
    const tipCurl = Math.pow(t, 2.8) * 0.018;

    pos.setXYZ(i, Math.cos(angle) * r + tipCurl, y, Math.sin(angle) * r);
  }

  geom.computeVertexNormals();
  return geom;
}

/** 饱满水润 3D 鲜红草莓 */
function createStrawberry(
  strawberryMat: THREE.Material,
  leafMat: THREE.Material,
  scale = 1
): THREE.Group {
  const g = new THREE.Group();

  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    const y = (1 - t) * 0.26;
    const r = Math.sin(Math.pow(t, 0.72) * Math.PI) * 0.125 * (1 - t * 0.2);
    pts.push(new THREE.Vector2(Math.max(0.002, r), y));
  }
  const bodyGeo = new THREE.LatheGeometry(pts, 22);
  const body = new THREE.Mesh(bodyGeo, strawberryMat);
  body.castShadow = true;
  body.rotation.x = Math.PI;
  body.position.y = 0.25;
  g.add(body);

  const leafGeo = new THREE.ConeGeometry(0.044, 0.125, 4);
  leafGeo.scale(1, 1, 0.28);
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(Math.cos(angle) * 0.056, 0.032, Math.sin(angle) * 0.056);
    leaf.rotation.z = Math.PI / 2 - 0.34;
    leaf.rotation.y = -angle;
    g.add(leaf);
  }

  g.scale.setScalar(scale);
  return g;
}

/** 法式马卡龙 */
function createMacaron(shellColor: number, fillingColor: number, scale = 1): THREE.Group {
  const g = new THREE.Group();
  const shellMat = new THREE.MeshPhysicalMaterial({
    color: shellColor,
    roughness: 0.32,
    metalness: 0.0,
    clearcoat: 0.35,
    clearcoatRoughness: 0.28,
  });
  const fillMat = new THREE.MeshStandardMaterial({
    color: fillingColor,
    roughness: 0.55,
  });

  const shellGeo = new THREE.SphereGeometry(0.15, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.56);
  shellGeo.scale(1, 0.48, 1);

  const topShell = new THREE.Mesh(shellGeo, shellMat);
  topShell.position.y = 0.045;
  g.add(topShell);

  const botShell = new THREE.Mesh(shellGeo, shellMat);
  botShell.rotation.x = Math.PI;
  botShell.position.y = -0.045;
  g.add(botShell);

  const footGeo = new THREE.TorusGeometry(0.132, 0.024, 10, 24);
  footGeo.rotateX(Math.PI / 2);
  const filling = new THREE.Mesh(footGeo, fillMat);
  filling.scale.set(1, 1.32, 1);
  g.add(filling);

  const coreGeo = new THREE.CylinderGeometry(0.132, 0.132, 0.06, 20);
  g.add(new THREE.Mesh(coreGeo, fillMat));

  g.scale.setScalar(scale);
  return g;
}

/** 丝绸蝴蝶结装饰 */
function createRibbonBow(color: number): THREE.Group {
  const bow = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.36,
    metalness: 0.02,
    sheen: 0.7,
    sheenColor: new THREE.Color(0xffffff),
  });

  const loopGeo = new THREE.TorusGeometry(0.11, 0.036, 12, 24);
  loopGeo.scale(1.3, 0.72, 0.55);

  const leftLoop = new THREE.Mesh(loopGeo, mat);
  leftLoop.position.set(-0.12, 0.02, 0);
  leftLoop.rotation.z = 0.22;
  bow.add(leftLoop);

  const rightLoop = new THREE.Mesh(loopGeo, mat);
  rightLoop.position.set(0.12, 0.02, 0);
  rightLoop.rotation.z = -0.22;
  bow.add(rightLoop);

  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 12), mat);
  knot.scale.set(1, 0.9, 0.7);
  bow.add(knot);

  return bow;
}

/** 光滑淋面滴落 */
function createDripCap(
  radius: number,
  topY: number,
  dripColor: number,
  options: {
    roughness?: number;
    clearcoat?: number;
    dripCount?: number;
    minDrop?: number;
    maxDrop?: number;
    seed?: number;
    capThickness?: number;
  } = {}
): THREE.Group {
  const {
    roughness = 0.2,
    clearcoat = 0.75,
    dripCount = 26,
    minDrop = 0.14,
    maxDrop = 0.4,
    seed = 1,
    capThickness = 0.068,
  } = options;

  const group = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({
    color: dripColor,
    roughness,
    metalness: 0.02,
    clearcoat,
    clearcoatRoughness: Math.min(0.28, roughness + 0.06),
  });

  const capGeo = createRoundedCakeTierGeometry(radius + 0.024, capThickness, 0.03);
  const cap = new THREE.Mesh(capGeo, mat);
  cap.position.y = topY - capThickness * 0.42;
  group.add(cap);

  const dropCylGeo = new THREE.CylinderGeometry(0.044, 0.036, 1, 12);
  const dropTipGeo = new THREE.SphereGeometry(0.044, 12, 10);

  for (let i = 0; i < dripCount; i++) {
    const angle = (i / dripCount) * Math.PI * 2;
    const wave =
      0.5 +
      0.32 * Math.sin(i * 2.3 + seed * 1.7) +
      0.18 * Math.cos(i * 4.7 + seed * 0.9);
    const len = minDrop + wave * (maxDrop - minDrop);
    const widthScale = 0.84 + 0.32 * Math.sin(i * 3.1 + seed);

    const x = Math.cos(angle) * (radius + 0.008);
    const z = Math.sin(angle) * (radius + 0.008);

    const drip = new THREE.Mesh(dropCylGeo, mat);
    drip.scale.set(widthScale, len, widthScale * 0.82);
    drip.position.set(x, topY - len / 2 - 0.01, z);
    group.add(drip);

    const tip = new THREE.Mesh(dropTipGeo, mat);
    tip.scale.set(widthScale * 0.96, 1.05, widthScale * 0.85);
    tip.position.set(x, topY - len - 0.01, z);
    group.add(tip);
  }

  return group;
}

/**
 * 极简轻薄法式金边蛋糕底板（彻底移除臃肿的草帽形大瓷盘底座！）
 * 仅比蛋糕底层略宽 0.12，薄而精致，优雅承托蛋糕主体。
 */
function createMinimalCakeBoard(
  cakeBottomRadius: number,
  includeAmbientGround: boolean
): { group: THREE.Group; boardTopY: number } {
  const group = new THREE.Group();

  if (includeAmbientGround) {
    const groundTex = createTableSurfaceTexture();
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      roughness: 0.7,
      metalness: 0.05,
      transparent: true,
      depthWrite: false,
    });
    const groundGeo = new THREE.CircleGeometry(4.8, 64);
    groundGeo.rotateX(-Math.PI / 2);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.02;
    ground.receiveShadow = true;
    group.add(ground);
  }

  const boardR = cakeBottomRadius + 0.13;
  const boardH = 0.048;

  // 香槟金哑光薄底托
  const goldBoardMat = new THREE.MeshStandardMaterial({
    color: 0xe6c16d,
    roughness: 0.34,
    metalness: 0.45,
  });

  const boardGeo = new THREE.CylinderGeometry(boardR, boardR * 0.985, boardH, 64);
  const board = new THREE.Mesh(boardGeo, goldBoardMat);
  board.position.y = boardH / 2;
  board.castShadow = true;
  group.add(board);

  // 紧贴底板上的精致小蕾丝花边垫纸
  const doilyTex = createLaceDoilyTexture();
  const doilyMat = new THREE.MeshStandardMaterial({
    map: doilyTex,
    transparent: true,
    roughness: 0.85,
    depthWrite: false,
  });
  const doilyGeo = new THREE.CircleGeometry(boardR - 0.02, 64);
  doilyGeo.rotateX(-Math.PI / 2);
  const doily = new THREE.Mesh(doilyGeo, doilyMat);
  doily.position.y = boardH + 0.002;
  group.add(doily);

  return { group, boardTopY: boardH + 0.004 };
}

interface PlaqueHandle {
  mesh: THREE.Mesh;
  frontMat: THREE.MeshStandardMaterial;
  sideMat: THREE.MeshStandardMaterial;
}

/**
 * 蛋糕前哑光手写祝福卡片（完全无高光反光、无黑边框，支持多种风格搭配与隐藏）
 */
function createBirthdayPlaque(
  content: PlaqueContentOptions,
  zPos: number,
  yPos: number
): PlaqueHandle {
  const style: CardStyle = content.cardStyle || 'cream-rose';
  const tex = createPlaqueTexture({ ...content, cardStyle: style });

  const frontMat = new THREE.MeshStandardMaterial({
    map: tex,
    roughness: 0.96,
    metalness: 0.0,
    envMapIntensity: 0.08,
  });

  const sideMat = new THREE.MeshStandardMaterial({
    color: getPlaqueSideColor(style),
    roughness: 0.65,
    metalness: 0.06,
  });

  const geo = new THREE.BoxGeometry(1.16, 0.66, 0.036);
  const mesh = new THREE.Mesh(geo, [sideMat, sideMat, sideMat, sideMat, frontMat, sideMat]);
  mesh.position.set(0, yPos, zPos);
  mesh.rotation.x = -0.22;
  mesh.castShadow = true;
  mesh.visible = style !== 'none';

  return { mesh, frontMat, sideMat };
}

/**
 * 蛋糕 1：草莓梦幻双层蛋糕 (elegant-strawberry)
 */
function buildStrawberryDreamCake(
  baseY: number,
  plaqueContent: PlaqueContentOptions,
  includePlaque: boolean
): Omit<BuiltCakeResult, 'dispose' | 'updatePlaque'> & { plaqueHandle: PlaqueHandle | null } {
  const group = new THREE.Group();
  const bumpTex = createSilkyFrostingBumpTexture();
  const strawberryTex = createStrawberryTexture();

  const pinkCreamMat = new THREE.MeshStandardMaterial({
    color: 0xf7b8cc,
    roughness: 0.58,
    metalness: 0.0,
    bumpMap: bumpTex,
    bumpScale: 0.002,
  });

  const ivoryCreamMat = new THREE.MeshStandardMaterial({
    color: 0xfbf3ec,
    roughness: 0.55,
    metalness: 0.0,
    bumpMap: bumpTex,
    bumpScale: 0.002,
  });

  const strawberryMat = new THREE.MeshPhysicalMaterial({
    map: strawberryTex,
    roughness: 0.24,
    clearcoat: 0.65,
    clearcoatRoughness: 0.18,
  });

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.45,
  });

  const goldPearlMat = new THREE.MeshStandardMaterial({
    color: 0xf5cc5c,
    roughness: 0.24,
    metalness: 0.62,
  });

  const rosePearlMat = new THREE.MeshPhysicalMaterial({
    color: 0xf9a8c4,
    roughness: 0.25,
    clearcoat: 0.5,
  });

  const bottomR = 1.42;
  const bottomH = 0.82;
  const bottomTier = new THREE.Mesh(createRoundedCakeTierGeometry(bottomR, bottomH, 0.08), pinkCreamMat);
  bottomTier.position.y = baseY;
  bottomTier.castShadow = true;
  group.add(bottomTier);

  const ribbonMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    roughness: 0.42,
  });
  const ribbonGeo = new THREE.CylinderGeometry(bottomR + 0.015, bottomR + 0.015, 0.11, 64, 1, true);
  const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
  ribbon.position.y = baseY + 0.12;
  group.add(ribbon);

  if (!includePlaque) {
    const bow = createRibbonBow(0xf43f5e);
    bow.position.set(0, baseY + 0.14, bottomR + 0.04);
    group.add(bow);
  }

  const pearlGeo = new THREE.SphereGeometry(0.05, 14, 12);
  const basePearlCount = 34;
  for (let i = 0; i < basePearlCount; i++) {
    const a = (i / basePearlCount) * Math.PI * 2;
    const pearl = new THREE.Mesh(pearlGeo, i % 2 === 0 ? ivoryCreamMat : rosePearlMat);
    pearl.position.set(Math.cos(a) * (bottomR + 0.025), baseY + 0.042, Math.sin(a) * (bottomR + 0.025));
    group.add(pearl);
  }

  const topR = 1.04;
  const topH = 0.72;
  const topBaseY = baseY + bottomH - 0.02;
  const topTier = new THREE.Mesh(createRoundedCakeTierGeometry(topR, topH, 0.075), ivoryCreamMat);
  topTier.position.y = topBaseY;
  topTier.castShadow = true;
  group.add(topTier);

  const topY = topBaseY + topH;
  const drip = createDripCap(topR, topY, 0xf48fb1, {
    roughness: 0.18,
    clearcoat: 0.72,
    dripCount: 24,
    minDrop: 0.14,
    maxDrop: 0.36,
    seed: 2,
  });
  group.add(drip);

  const rosetteGeo = createPipedRosetteGeometry(0.11, 0.14);
  const lowerDecorCount = 16;
  for (let i = 0; i < lowerDecorCount; i++) {
    const a = (i / lowerDecorCount) * Math.PI * 2;
    const r = (bottomR + topR) * 0.5 + 0.01;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;

    const rosette = new THREE.Mesh(rosetteGeo, ivoryCreamMat);
    rosette.position.set(x, topBaseY - 0.01, z);
    group.add(rosette);

    if (i % 4 === 1) {
      const sb = createStrawberry(strawberryMat, leafMat, 0.94);
      sb.position.set(Math.cos(a) * (r + 0.04), topBaseY + 0.06, Math.sin(a) * (r + 0.04));
      sb.rotation.z = -Math.cos(a) * 0.24;
      sb.rotation.x = Math.sin(a) * 0.24;
      group.add(sb);
    } else if (i % 4 === 3) {
      const mac = createMacaron(i % 8 === 3 ? 0xf9a8c4 : 0xfde08d, 0xfdf8f2, 0.86);
      mac.position.set(Math.cos(a) * (r + 0.04), topBaseY + 0.12, Math.sin(a) * (r + 0.04));
      mac.lookAt(0, topBaseY + 0.12, 0);
      mac.rotation.x += 0.32;
      group.add(mac);
    }
  }

  const topCrownCount = 12;
  const smallPearlGeo = new THREE.SphereGeometry(0.032, 12, 10);
  for (let i = 0; i < topCrownCount; i++) {
    const a = (i / topCrownCount) * Math.PI * 2 + 0.15;
    const r = topR - 0.14;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;

    const ros = new THREE.Mesh(rosetteGeo, i % 2 === 0 ? ivoryCreamMat : pinkCreamMat);
    ros.scale.setScalar(0.92);
    ros.position.set(x, topY + 0.01, z);
    group.add(ros);

    if (i % 2 === 0) {
      const sb = createStrawberry(strawberryMat, leafMat, 0.95);
      sb.position.set(x * 0.95, topY + 0.06, z * 0.95);
      sb.rotation.y = a;
      sb.rotation.z = 0.16;
      group.add(sb);
    } else {
      const pearl = new THREE.Mesh(smallPearlGeo, goldPearlMat);
      pearl.position.set(x, topY + 0.145, z);
      group.add(pearl);
    }
  }

  let plaqueHandle: PlaqueHandle | null = null;
  if (includePlaque) {
    plaqueHandle = createBirthdayPlaque(plaqueContent, bottomR + 0.12, baseY + 0.34);
    group.add(plaqueHandle.mesh);
  }

  return {
    group,
    candleSurfaceY: topY + 0.035,
    candleMaxRadius: topR - 0.32,
    accentColor: 0xfb7185,
    plaqueHandle,
  };
}

/**
 * 蛋糕 2：丝绒黑巧金箔蛋糕 (classic-chocolate)
 */
function buildChocolateCake(
  baseY: number,
  plaqueContent: PlaqueContentOptions,
  includePlaque: boolean
): Omit<BuiltCakeResult, 'dispose' | 'updatePlaque'> & { plaqueHandle: PlaqueHandle | null } {
  const group = new THREE.Group();
  const bumpTex = createSilkyFrostingBumpTexture();

  const cocoaSpongeMat = new THREE.MeshStandardMaterial({
    color: 0x5c2d18,
    roughness: 0.48,
    metalness: 0.04,
    bumpMap: bumpTex,
    bumpScale: 0.0025,
  });

  const mousseMat = new THREE.MeshStandardMaterial({
    color: 0x763c22,
    roughness: 0.42,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf5cc5c,
    roughness: 0.22,
    metalness: 0.72,
  });

  const darkCurlMat = new THREE.MeshPhysicalMaterial({
    color: 0x2c1207,
    roughness: 0.16,
    clearcoat: 0.85,
    side: THREE.DoubleSide,
  });

  const berryMat = new THREE.MeshPhysicalMaterial({
    color: 0xdc2626,
    roughness: 0.26,
    clearcoat: 0.65,
  });

  const mintMat = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.42,
    side: THREE.DoubleSide,
  });

  const r1 = 1.4;
  const h1 = 0.74;
  const tier1 = new THREE.Mesh(createRoundedCakeTierGeometry(r1, h1, 0.065), cocoaSpongeMat);
  tier1.position.y = baseY;
  tier1.castShadow = true;
  group.add(tier1);

  const r2 = 1.06;
  const h2 = 0.66;
  const tier2BaseY = baseY + h1 - 0.02;
  const tier2 = new THREE.Mesh(createRoundedCakeTierGeometry(r2, h2, 0.065), cocoaSpongeMat);
  tier2.position.y = tier2BaseY;
  tier2.castShadow = true;
  group.add(tier2);

  const goldBand1 = new THREE.Mesh(new THREE.TorusGeometry(r1 + 0.01, 0.022, 12, 72), goldMat);
  goldBand1.rotation.x = Math.PI / 2;
  goldBand1.position.y = baseY + 0.12;
  group.add(goldBand1);

  const goldBand2 = new THREE.Mesh(new THREE.TorusGeometry(r2 + 0.01, 0.018, 12, 64), goldMat);
  goldBand2.rotation.x = Math.PI / 2;
  goldBand2.position.y = tier2BaseY + 0.04;
  group.add(goldBand2);

  const leafFlakeGeo = new THREE.PlaneGeometry(0.13, 0.1);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + 0.3;
    const onTop = i % 2 === 0;
    const rad = onTop ? r2 + 0.018 : r1 + 0.018;
    const y = onTop ? tier2BaseY + 0.18 + (i % 3) * 0.1 : baseY + 0.28 + (i % 3) * 0.12;
    const flake = new THREE.Mesh(leafFlakeGeo, goldMat);
    flake.position.set(Math.cos(a) * rad, y, Math.sin(a) * rad);
    flake.lookAt(Math.cos(a) * (rad + 2), y, Math.sin(a) * (rad + 2));
    flake.rotation.z = i * 0.7;
    flake.scale.set(0.65 + (i % 3) * 0.3, 0.7 + ((i + 1) % 3) * 0.28, 1);
    group.add(flake);
  }

  const topY = tier2BaseY + h2;
  const drip = createDripCap(r2, topY, 0x261007, {
    roughness: 0.1,
    clearcoat: 0.9,
    dripCount: 26,
    minDrop: 0.16,
    maxDrop: 0.44,
    seed: 5,
  });
  group.add(drip);

  const truffleGeo = new THREE.IcosahedronGeometry(0.105, 2);
  const rosetteGeo = createPipedRosetteGeometry(0.105, 0.135);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const rad = (r1 + r2) * 0.5 + 0.02;
    if (i % 2 === 0) {
      const truffle = new THREE.Mesh(truffleGeo, goldMat);
      truffle.position.set(Math.cos(a) * rad, tier2BaseY + 0.095, Math.sin(a) * rad);
      group.add(truffle);
    } else {
      const swirl = new THREE.Mesh(rosetteGeo, mousseMat);
      swirl.position.set(Math.cos(a) * rad, tier2BaseY - 0.01, Math.sin(a) * rad);
      group.add(swirl);
    }
  }

  const curlGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.24, 16, 1, true, 0, Math.PI * 1.15);
  const berryGeo = new THREE.DodecahedronGeometry(0.086, 1);
  const leafGeo = new THREE.SphereGeometry(0.075, 10, 8);
  leafGeo.scale(1.4, 0.18, 0.7);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const rad = r2 - 0.15;
    const x = Math.cos(a) * rad;
    const z = Math.sin(a) * rad;

    const swirl = new THREE.Mesh(rosetteGeo, mousseMat);
    swirl.scale.setScalar(0.88);
    swirl.position.set(x, topY + 0.01, z);
    group.add(swirl);

    if (i % 2 === 0) {
      const curl = new THREE.Mesh(curlGeo, darkCurlMat);
      curl.position.set(x * 0.98, topY + 0.15, z * 0.98);
      curl.rotation.y = -a + 0.5;
      curl.rotation.z = 0.35;
      group.add(curl);
    } else {
      const berry = new THREE.Mesh(berryGeo, berryMat);
      berry.scale.set(1, 1.18, 1);
      berry.position.set(x, topY + 0.14, z);
      group.add(berry);

      const leaf = new THREE.Mesh(leafGeo, mintMat);
      leaf.position.set(x * 0.9 + Math.cos(a + 0.3) * 0.08, topY + 0.09, z * 0.9 + Math.sin(a + 0.3) * 0.08);
      leaf.rotation.y = -a;
      leaf.rotation.z = 0.25;
      group.add(leaf);
    }
  }

  let plaqueHandle: PlaqueHandle | null = null;
  if (includePlaque) {
    plaqueHandle = createBirthdayPlaque(plaqueContent, r1 + 0.12, baseY + 0.34);
    group.add(plaqueHandle.mesh);
  }

  return {
    group,
    candleSurfaceY: topY + 0.035,
    candleMaxRadius: r2 - 0.32,
    accentColor: 0xf59e0b,
    plaqueHandle,
  };
}

/**
 * 蛋糕 3：梦幻马卡龙彩虹蛋糕 (rainbow-party)
 */
function buildRainbowPartyCake(
  baseY: number,
  plaqueContent: PlaqueContentOptions,
  includePlaque: boolean
): Omit<BuiltCakeResult, 'dispose' | 'updatePlaque'> & { plaqueHandle: PlaqueHandle | null } {
  const group = new THREE.Group();
  const rainbowTex = createRainbowFrostingTexture();
  const bumpTex = createSilkyFrostingBumpTexture();

  const rainbowSideMat = new THREE.MeshStandardMaterial({
    map: rainbowTex,
    roughness: 0.52,
    bumpMap: bumpTex,
    bumpScale: 0.002,
  });

  const whiteCreamMat = new THREE.MeshStandardMaterial({
    color: 0xfbf8f3,
    roughness: 0.5,
  });

  const radius = 1.28;
  const height = 1.32;
  // 使用直壁 UV 蛋糕体，确保鲜活马卡龙彩虹渐变清晰呈现在蛋糕侧面
  const cakeBody = createTexturedTierGroup(radius, height, rainbowSideMat, whiteCreamMat);
  cakeBody.position.y = baseY;
  group.add(cakeBody);

  const topY = baseY + height;

  const drip = createDripCap(radius, topY, 0xfffaf6, {
    roughness: 0.22,
    clearcoat: 0.65,
    dripCount: 28,
    minDrop: 0.16,
    maxDrop: 0.46,
    seed: 9,
  });
  group.add(drip);

  const pastelColors = [0xffa3be, 0xffbd8a, 0xfee074, 0x7be0ad, 0x8bc9ff, 0xc9a8ff];
  const rosetteGeo = createPipedRosetteGeometry(0.105, 0.135);
  const bottomCount = 24;
  for (let i = 0; i < bottomCount; i++) {
    const a = (i / bottomCount) * Math.PI * 2;
    const mat = new THREE.MeshStandardMaterial({
      color: pastelColors[i % pastelColors.length],
      roughness: 0.48,
    });
    const puff = new THREE.Mesh(rosetteGeo, mat);
    puff.scale.setScalar(0.84);
    puff.position.set(Math.cos(a) * (radius + 0.035), baseY - 0.005, Math.sin(a) * (radius + 0.035));
    group.add(puff);
  }

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r = radius - 0.16;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;

    if (i % 3 === 0) {
      const mac = createMacaron(pastelColors[i % pastelColors.length], 0xfffaf5, 0.92);
      mac.position.set(x, topY + 0.13, z);
      mac.lookAt(0, topY + 0.13, 0);
      mac.rotation.x += 0.25;
      group.add(mac);
    } else {
      const kissMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xfcf8f3 : pastelColors[i % pastelColors.length],
        roughness: 0.45,
      });
      const kiss = new THREE.Mesh(rosetteGeo, kissMat);
      kiss.scale.set(0.95, 1.25, 0.95);
      kiss.position.set(x, topY + 0.01, z);
      group.add(kiss);
    }
  }

  // 均匀铺满整个蛋糕顶面的 3D 彩色糖针（黄金角菲波那契均匀散点）
  const sprinkleCount = 120;
  const sprinkleGeo = new THREE.CapsuleGeometry(0.015, 0.055, 4, 8);
  const sprinkleMat = new THREE.MeshStandardMaterial({
    roughness: 0.35,
    metalness: 0.04,
  });
  const sprinkles = new THREE.InstancedMesh(sprinkleGeo, sprinkleMat, sprinkleCount);
  const dummy = new THREE.Object3D();
  const colorObj = new THREE.Color();
  const brightPalette = [0xf43f5e, 0xfb923c, 0xfacc15, 0x10b981, 0x0ea5e9, 0xa855f7, 0xec4899];

  for (let i = 0; i < sprinkleCount; i++) {
    const r = Math.sqrt((i + 0.5) / sprinkleCount) * (radius - 0.22);
    const a = i * 2.3999632;
    dummy.position.set(Math.cos(a) * r, topY + 0.046, Math.sin(a) * r);
    dummy.rotation.set(Math.PI / 2, a * 1.7, (i % 5) * 0.18);
    dummy.updateMatrix();
    sprinkles.setMatrixAt(i, dummy.matrix);
    colorObj.setHex(brightPalette[i % brightPalette.length]);
    sprinkles.setColorAt(i, colorObj);
  }
  sprinkles.instanceMatrix.needsUpdate = true;
  if (sprinkles.instanceColor) sprinkles.instanceColor.needsUpdate = true;
  group.add(sprinkles);

  const goldStarMat = new THREE.MeshStandardMaterial({
    color: 0xf5cc5c,
    roughness: 0.24,
    metalness: 0.65,
  });
  const stemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.34, 8);
  const starGeo = new THREE.OctahedronGeometry(0.085, 0);
  starGeo.scale(1, 1, 0.35);

  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const rad = radius - 0.1;
    const pick = new THREE.Group();
    const stem = new THREE.Mesh(stemGeo, whiteCreamMat);
    stem.position.y = 0.17;
    pick.add(stem);
    const star = new THREE.Mesh(starGeo, goldStarMat);
    star.position.y = 0.36;
    pick.add(star);
    pick.position.set(Math.cos(a) * rad, topY + 0.02, Math.sin(a) * rad);
    pick.rotation.z = -Math.cos(a) * 0.22;
    pick.rotation.x = Math.sin(a) * 0.22;
    group.add(pick);
  }

  let plaqueHandle: PlaqueHandle | null = null;
  if (includePlaque) {
    plaqueHandle = createBirthdayPlaque(plaqueContent, radius + 0.12, baseY + 0.34);
    group.add(plaqueHandle.mesh);
  }

  return {
    group,
    candleSurfaceY: topY + 0.04,
    candleMaxRadius: radius - 0.36,
    accentColor: 0x38bdf8,
    plaqueHandle,
  };
}

/**
 * 蛋糕 4：星夜蓝莓紫绒蛋糕 (blueberry-glaze)
 */
function buildBlueberryVelvetCake(
  baseY: number,
  plaqueContent: PlaqueContentOptions,
  includePlaque: boolean
): Omit<BuiltCakeResult, 'dispose' | 'updatePlaque'> & { plaqueHandle: PlaqueHandle | null } {
  const group = new THREE.Group();
  const starryTex = createStarryVelvetTexture();
  const bumpTex = createSilkyFrostingBumpTexture();

  const velvetSideMat = new THREE.MeshStandardMaterial({
    map: starryTex,
    roughness: 0.48,
    metalness: 0.04,
    bumpMap: bumpTex,
    bumpScale: 0.002,
  });

  const lavenderCreamMat = new THREE.MeshStandardMaterial({
    color: 0xe6d4fe,
    roughness: 0.48,
  });

  const blueberryMat = new THREE.MeshPhysicalMaterial({
    color: 0x2e2a7a,
    roughness: 0.24,
    metalness: 0.06,
    clearcoat: 0.65,
    sheen: 0.85,
    sheenColor: new THREE.Color(0x93c5fd),
  });

  const mintMat = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.42,
    side: THREE.DoubleSide,
  });

  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.18,
    metalness: 0.78,
  });

  const r1 = 1.4;
  const h1 = 0.74;
  const tier1 = createTexturedTierGroup(r1, h1, velvetSideMat, lavenderCreamMat);
  tier1.position.y = baseY;
  group.add(tier1);

  const r2 = 1.05;
  const h2 = 0.66;
  const tier2BaseY = baseY + h1 - 0.02;
  const tier2 = createTexturedTierGroup(r2, h2, velvetSideMat, lavenderCreamMat);
  tier2.position.y = tier2BaseY;
  group.add(tier2);

  const topY = tier2BaseY + h2;
  const drip = createDripCap(r2, topY, 0x6d28d9, {
    roughness: 0.14,
    clearcoat: 0.85,
    dripCount: 24,
    minDrop: 0.18,
    maxDrop: 0.44,
    seed: 13,
  });
  group.add(drip);

  const pearlGeo = new THREE.SphereGeometry(0.044, 12, 10);
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    const p = new THREE.Mesh(pearlGeo, i % 3 === 0 ? silverMat : lavenderCreamMat);
    p.position.set(Math.cos(a) * (r1 + 0.025), baseY + 0.04, Math.sin(a) * (r1 + 0.025));
    group.add(p);
  }

  const berryGeo = new THREE.SphereGeometry(0.086, 16, 14);
  berryGeo.scale(1, 0.88, 1);
  const crownGeo = new THREE.TorusGeometry(0.024, 0.008, 6, 5);
  crownGeo.rotateX(Math.PI / 2);
  const leafGeo = new THREE.SphereGeometry(0.078, 10, 8);
  leafGeo.scale(1.4, 0.18, 0.72);
  const rosetteGeo = createPipedRosetteGeometry(0.105, 0.135);

  const addBlueberry = (x: number, y: number, z: number, scale = 1) => {
    const bg = new THREE.Group();
    bg.add(new THREE.Mesh(berryGeo, blueberryMat));
    const c = new THREE.Mesh(crownGeo, blueberryMat);
    c.position.y = 0.072;
    bg.add(c);
    bg.position.set(x, y, z);
    bg.scale.setScalar(scale);
    group.add(bg);
  };

  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const rad = r2 - 0.15;
    const x = Math.cos(a) * rad;
    const z = Math.sin(a) * rad;

    if (i % 2 === 0) {
      const ros = new THREE.Mesh(rosetteGeo, lavenderCreamMat);
      ros.scale.setScalar(0.88);
      ros.position.set(x, topY + 0.01, z);
      group.add(ros);

      addBlueberry(x + Math.cos(a) * 0.05, topY + 0.14, z + Math.sin(a) * 0.05, 0.96);
      addBlueberry(x + Math.cos(a + 0.25) * 0.09, topY + 0.1, z + Math.sin(a + 0.25) * 0.09, 0.84);

      const leaf = new THREE.Mesh(leafGeo, mintMat);
      leaf.position.set(x + Math.cos(a - 0.25) * 0.11, topY + 0.075, z + Math.sin(a - 0.25) * 0.11);
      leaf.rotation.y = -a + 0.5;
      leaf.rotation.z = 0.3;
      group.add(leaf);
    } else {
      addBlueberry(x, topY + 0.085, z, 1.05);
      const sp = new THREE.Mesh(pearlGeo, silverMat);
      sp.scale.setScalar(0.68);
      sp.position.set(x * 0.88, topY + 0.055, z * 0.88);
      group.add(sp);
    }

    const lowR = (r1 + r2) * 0.5 + 0.03;
    addBlueberry(Math.cos(a + 0.12) * lowR, tier2BaseY + 0.075, Math.sin(a + 0.12) * lowR, 0.85);
    if (i % 3 === 0) {
      const mac = createMacaron(0xc4b5fd, 0xfaf5ff, 0.85);
      mac.position.set(Math.cos(a + 0.35) * lowR, tier2BaseY + 0.11, Math.sin(a + 0.35) * lowR);
      mac.lookAt(0, tier2BaseY + 0.11, 0);
      mac.rotation.x += 0.3;
      group.add(mac);
    }
  }

  let plaqueHandle: PlaqueHandle | null = null;
  if (includePlaque) {
    plaqueHandle = createBirthdayPlaque(plaqueContent, r1 + 0.12, baseY + 0.34);
    group.add(plaqueHandle.mesh);
  }

  return {
    group,
    candleSurfaceY: topY + 0.038,
    candleMaxRadius: r2 - 0.32,
    accentColor: 0xa855f7,
    plaqueHandle,
  };
}

/**
 * 蛋糕 5：自定义照片主题 3D 奶油蛋糕 (custom-*)
 */
function buildCustomPhotoCake(
  baseY: number,
  customImageUrl: string | undefined,
  plaqueContent: PlaqueContentOptions,
  includePlaque: boolean
): Omit<BuiltCakeResult, 'dispose' | 'updatePlaque'> & { plaqueHandle: PlaqueHandle | null } {
  const group = new THREE.Group();
  const bumpTex = createSilkyFrostingBumpTexture();

  const creamMat = new THREE.MeshStandardMaterial({
    color: 0xfbf4ee,
    roughness: 0.52,
    bumpMap: bumpTex,
    bumpScale: 0.002,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf0c965,
    roughness: 0.28,
    metalness: 0.5,
  });

  const r = 1.34;
  const h = 1.08;
  const body = new THREE.Mesh(createRoundedCakeTierGeometry(r, h, 0.08), creamMat);
  body.position.y = baseY;
  body.castShadow = true;
  group.add(body);

  const topY = baseY + h;
  const drip = createDripCap(r, topY, 0xf9a8c4, {
    roughness: 0.18,
    clearcoat: 0.7,
    dripCount: 24,
    minDrop: 0.14,
    maxDrop: 0.38,
    seed: 21,
  });
  group.add(drip);

  const rosetteGeo = createPipedRosetteGeometry(0.105, 0.135);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const ros = new THREE.Mesh(rosetteGeo, creamMat);
    ros.position.set(Math.cos(a) * (r - 0.14), topY + 0.01, Math.sin(a) * (r - 0.14));
    group.add(ros);
  }

  let plaqueHandle: PlaqueHandle | null = null;
  if (customImageUrl) {
    const loader = new THREE.TextureLoader();
    const photoTex = loader.load(customImageUrl);
    photoTex.colorSpace = THREE.SRGBColorSpace;

    const frameGroup = new THREE.Group();
    frameGroup.add(new THREE.Mesh(new THREE.BoxGeometry(1.12, 1.12, 0.05), goldMat));

    const photoPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.0, 1.0),
      new THREE.MeshStandardMaterial({ map: photoTex, roughness: 0.85, metalness: 0.0, envMapIntensity: 0.1 })
    );
    photoPlane.position.z = 0.028;
    frameGroup.add(photoPlane);

    frameGroup.position.set(0, baseY + h * 0.56, r + 0.05);
    frameGroup.rotation.x = -0.1;
    group.add(frameGroup);
  } else if (includePlaque) {
    plaqueHandle = createBirthdayPlaque(plaqueContent, r + 0.12, baseY + 0.34);
    group.add(plaqueHandle.mesh);
  }

  return {
    group,
    candleSurfaceY: topY + 0.035,
    candleMaxRadius: r - 0.34,
    accentColor: 0xf472b6,
    plaqueHandle,
  };
}

/** 构建完整的 3D 蛋糕 + 极简轻薄金边底托（无笨重草帽底座） */
export function buildCakeAssembly(options: {
  cakeId: string;
  customImage?: string;
  userName?: string;
  customMessage?: string;
  giverName?: string;
  lang?: string;
  cardStyle?: CardStyle;
  includeTable?: boolean;
  includePlaque?: boolean;
}): BuiltCakeResult {
  const { includeTable = true, includePlaque = true } = options;
  const root = new THREE.Group();

  const bottomRadius =
    options.cakeId === 'rainbow-party'
      ? 1.28
      : options.cakeId.startsWith('custom-')
        ? 1.34
        : options.cakeId === 'elegant-strawberry'
          ? 1.42
          : 1.4;

  const { group: boardGroup, boardTopY } = createMinimalCakeBoard(bottomRadius, includeTable);
  root.add(boardGroup);

  const plaqueContent: PlaqueContentOptions = {
    userName: options.userName,
    customMessage: options.customMessage,
    giverName: options.giverName,
    lang: options.lang,
    cardStyle: options.cardStyle || 'cream-rose',
  };

  let built: Omit<BuiltCakeResult, 'dispose' | 'updatePlaque'> & { plaqueHandle: PlaqueHandle | null };
  if (options.cakeId.startsWith('custom-')) {
    built = buildCustomPhotoCake(boardTopY, options.customImage, plaqueContent, includePlaque);
  } else if (options.cakeId === 'classic-chocolate') {
    built = buildChocolateCake(boardTopY, plaqueContent, includePlaque);
  } else if (options.cakeId === 'rainbow-party') {
    built = buildRainbowPartyCake(boardTopY, plaqueContent, includePlaque);
  } else if (options.cakeId === 'blueberry-glaze') {
    built = buildBlueberryVelvetCake(boardTopY, plaqueContent, includePlaque);
  } else {
    built = buildStrawberryDreamCake(boardTopY, plaqueContent, includePlaque);
  }

  root.add(built.group);

  const updatePlaque = (nextContent: PlaqueContentOptions) => {
    const handle = built.plaqueHandle;
    if (!handle) return;
    const style: CardStyle = nextContent.cardStyle || 'cream-rose';
    handle.mesh.visible = style !== 'none';
    if (style === 'none') return;

    const prevMap = handle.frontMat.map;
    handle.frontMat.map = createPlaqueTexture({ ...nextContent, cardStyle: style });
    handle.frontMat.needsUpdate = true;
    handle.sideMat.color.setHex(getPlaqueSideColor(style));
    prevMap?.dispose();
  };

  return {
    group: root,
    candleSurfaceY: built.candleSurfaceY,
    candleMaxRadius: built.candleMaxRadius,
    accentColor: built.accentColor,
    updatePlaque,
    dispose: () => disposeObject3D(root),
  };
}
