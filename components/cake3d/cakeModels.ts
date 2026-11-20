import * as THREE from 'three';
import {
  createButtercreamBumpTexture,
  createRainbowFrostingTexture,
  createStarryVelvetTexture,
  createLaceDoilyTexture,
  createStrawberryTexture,
  createPlaqueTexture,
  createTableSurfaceTexture,
} from './cakeTextures';

export interface BuiltCakeResult {
  group: THREE.Group;
  /** 顶面放置蜡烛的 Y 坐标 */
  candleSurfaceY: number;
  /** 顶面可放蜡烛的安全半径 */
  candleMaxRadius: number;
  /** 蛋糕主色调（用于氛围微光） */
  accentColor: number;
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

/** 创建圆润倒角圆柱蛋糕胚（比普通 CylinderGeometry 更有奶油柔滑圆边感） */
function createRoundedCakeTierGeometry(radius: number, height: number, bevel = 0.08): THREE.LatheGeometry {
  const b = Math.min(bevel, radius * 0.25, height * 0.25);
  const pts: THREE.Vector2[] = [];
  pts.push(new THREE.Vector2(0, 0));
  pts.push(new THREE.Vector2(radius - b, 0));

  // 底部微圆角
  const steps = 6;
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(radius - b + Math.cos(a) * b, b + Math.sin(a) * b));
  }
  // 侧面直壁 + 顶部丰润圆角
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(radius - b + Math.cos(a) * b, height - b + Math.sin(a) * b));
  }
  pts.push(new THREE.Vector2(0, height));

  return new THREE.LatheGeometry(pts, 64);
}

/** 创建裱花奶油花球（螺旋尖顶星嘴挤花几何体） */
function createPipedRosetteGeometry(radius = 0.13, height = 0.17): THREE.BufferGeometry {
  const radialSegs = 28;
  const heightSegs = 14;
  const geom = new THREE.ConeGeometry(radius, height, radialSegs, heightSegs, false);
  const pos = geom.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const t = (y + height / 2) / height; // 0 bottom -> 1 top
    const angle = Math.atan2(z, x);
    const r = Math.sqrt(x * x + z * z);

    // 7 瓣星形裱花棱线 + 螺旋扭转
    const twist = t * 1.9;
    const flute = 1 + 0.22 * Math.sin(7 * (angle + twist)) * (1 - t * 0.55);
    const bulge = Math.sin(t * Math.PI * 0.85) * 0.28 + (1 - t * 0.65);
    const newR = r * flute * (0.78 + bulge * 0.45);
    // 尖顶微弯俏皮感
    const curlX = Math.pow(t, 2.5) * 0.025;
    pos.setXYZ(i, Math.cos(angle) * newR + curlX, y + height / 2, Math.sin(angle) * newR);
  }

  geom.computeVertexNormals();
  return geom;
}

/** 创建精美 3D 草莓（带籽粒质感与立体绿叶花萼） */
function createStrawberry(
  strawberryMat: THREE.Material,
  leafMat: THREE.Material,
  scale = 1
): THREE.Group {
  const g = new THREE.Group();

  // 草莓水滴锥形主体
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14; // 0 顶部蒂 -> 1 底部尖
    const y = (1 - t) * 0.26;
    const r = Math.sin(Math.pow(t, 0.72) * Math.PI) * 0.125 * (1 - t * 0.22);
    pts.push(new THREE.Vector2(Math.max(0.002, r), y));
  }
  const bodyGeo = new THREE.LatheGeometry(pts, 20);
  const body = new THREE.Mesh(bodyGeo, strawberryMat);
  body.castShadow = true;
  body.receiveShadow = true;
  // 翻转使尖头向上
  body.rotation.x = Math.PI;
  body.position.y = 0.25;
  g.add(body);

  // 底部 5 片嫩绿花萼叶片
  const leafGeo = new THREE.ConeGeometry(0.042, 0.12, 4);
  leafGeo.scale(1, 1, 0.28);
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(Math.cos(angle) * 0.055, 0.032, Math.sin(angle) * 0.055);
    leaf.rotation.z = Math.PI / 2 - 0.35;
    leaf.rotation.y = -angle;
    g.add(leaf);
  }

  g.scale.setScalar(scale);
  return g;
}

/** 创建法式马卡龙（双层光滑杏仁饼壳 + 蓬松裙边夹心） */
function createMacaron(shellColor: number, fillingColor: number, scale = 1): THREE.Group {
  const g = new THREE.Group();
  const shellMat = new THREE.MeshPhysicalMaterial({
    color: shellColor,
    roughness: 0.32,
    metalness: 0.02,
    clearcoat: 0.35,
    clearcoatRoughness: 0.28,
  });
  const fillMat = new THREE.MeshStandardMaterial({
    color: fillingColor,
    roughness: 0.65,
  });

  const shellGeo = new THREE.SphereGeometry(0.15, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.56);
  shellGeo.scale(1, 0.48, 1);

  const topShell = new THREE.Mesh(shellGeo, shellMat);
  topShell.position.y = 0.045;
  topShell.castShadow = true;
  g.add(topShell);

  const botShell = new THREE.Mesh(shellGeo, shellMat);
  botShell.rotation.x = Math.PI;
  botShell.position.y = -0.045;
  botShell.castShadow = true;
  g.add(botShell);

  const footGeo = new THREE.TorusGeometry(0.132, 0.024, 10, 24);
  footGeo.rotateX(Math.PI / 2);
  const filling = new THREE.Mesh(footGeo, fillMat);
  filling.scale.set(1, 1.35, 1);
  g.add(filling);

  const coreGeo = new THREE.CylinderGeometry(0.132, 0.132, 0.06, 20);
  const core = new THREE.Mesh(coreGeo, fillMat);
  g.add(core);

  g.scale.setScalar(scale);
  return g;
}

/** 沿着蛋糕顶缘创建自然垂坠的淋面滴落 (Cream / Ganache / Glaze Drip) */
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
    roughness = 0.18,
    clearcoat = 0.85,
    dripCount = 26,
    minDrop = 0.14,
    maxDrop = 0.42,
    seed = 1,
    capThickness = 0.07,
  } = options;

  const group = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({
    color: dripColor,
    roughness,
    metalness: 0.02,
    clearcoat,
    clearcoatRoughness: Math.min(0.3, roughness + 0.05),
  });

  // 顶部光滑淋面圆盘
  const capGeo = createRoundedCakeTierGeometry(radius + 0.028, capThickness, 0.032);
  const cap = new THREE.Mesh(capGeo, mat);
  cap.position.y = topY - capThickness * 0.42;
  cap.castShadow = true;
  cap.receiveShadow = true;
  group.add(cap);

  // 沿圆周自然垂落的冰柱状圆润淋面
  const dropCylGeo = new THREE.CylinderGeometry(0.046, 0.038, 1, 12);
  const dropTipGeo = new THREE.SphereGeometry(0.046, 12, 10);

  for (let i = 0; i < dripCount; i++) {
    const angle = (i / dripCount) * Math.PI * 2;
    // 确定性伪随机，保证每次渲染一致且有韵律感
    const wave =
      0.5 +
      0.32 * Math.sin(i * 2.3 + seed * 1.7) +
      0.18 * Math.cos(i * 4.7 + seed * 0.9);
    const len = minDrop + wave * (maxDrop - minDrop);
    const widthScale = 0.82 + 0.36 * Math.sin(i * 3.1 + seed);

    const x = Math.cos(angle) * (radius + 0.008);
    const z = Math.sin(angle) * (radius + 0.008);

    const drip = new THREE.Mesh(dropCylGeo, mat);
    drip.scale.set(widthScale, len, widthScale * 0.82);
    drip.position.set(x, topY - len / 2 - 0.01, z);
    drip.castShadow = true;
    group.add(drip);

    const tip = new THREE.Mesh(dropTipGeo, mat);
    tip.scale.set(widthScale * 0.96, 1.05, widthScale * 0.85);
    tip.position.set(x, topY - len - 0.01, z);
    group.add(tip);
  }

  return group;
}

/** 豪华陶瓷镶金边蛋糕托盘 + 蕾丝纸垫 + 桌面 */
function createCakeStandAndTable(): { group: THREE.Group; plateTopY: number } {
  const group = new THREE.Group();

  // 1. 细腻大理石暗纹桌面
  const tableTex = createTableSurfaceTexture();
  const tableMat = new THREE.MeshStandardMaterial({
    map: tableTex,
    roughness: 0.42,
    metalness: 0.12,
    transparent: true,
    opacity: 0.96,
  });
  const tableGeo = new THREE.CircleGeometry(6.8, 64);
  tableGeo.rotateX(-Math.PI / 2);
  const table = new THREE.Mesh(tableGeo, tableMat);
  table.position.y = -0.82;
  table.receiveShadow = true;
  group.add(table);

  // 2. 高级白瓷高脚蛋糕架（车削曲线造型）
  const ceramicMat = new THREE.MeshPhysicalMaterial({
    color: 0xfffaf6,
    roughness: 0.14,
    metalness: 0.02,
    clearcoat: 0.92,
    clearcoatRoughness: 0.08,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf6c95e,
    roughness: 0.22,
    metalness: 0.88,
  });

  const standPts = [
    new THREE.Vector2(0.0, -0.81),
    new THREE.Vector2(0.95, -0.81),
    new THREE.Vector2(0.92, -0.74),
    new THREE.Vector2(0.74, -0.68),
    new THREE.Vector2(0.42, -0.58),
    new THREE.Vector2(0.28, -0.44),
    new THREE.Vector2(0.34, -0.35), // 优雅圆润束腰装饰环
    new THREE.Vector2(0.26, -0.25),
    new THREE.Vector2(0.42, -0.14),
    new THREE.Vector2(1.58, -0.10),
    new THREE.Vector2(1.88, -0.02),
    new THREE.Vector2(1.94, 0.04),
    new THREE.Vector2(1.86, 0.05),
    new THREE.Vector2(1.74, 0.0),
    new THREE.Vector2(0.0, 0.0),
  ];
  const standGeo = new THREE.LatheGeometry(standPts, 72);
  const stand = new THREE.Mesh(standGeo, ceramicMat);
  stand.castShadow = true;
  stand.receiveShadow = true;
  group.add(stand);

  // 托盘边缘镶金线
  const rimGoldGeo = new THREE.TorusGeometry(1.91, 0.024, 14, 72);
  rimGoldGeo.rotateX(Math.PI / 2);
  const rimGold = new THREE.Mesh(rimGoldGeo, goldMat);
  rimGold.position.y = 0.042;
  group.add(rimGold);

  // 底座金边装饰环
  const baseGoldGeo = new THREE.TorusGeometry(0.93, 0.018, 12, 56);
  baseGoldGeo.rotateX(Math.PI / 2);
  const baseGold = new THREE.Mesh(baseGoldGeo, goldMat);
  baseGold.position.y = -0.785;
  group.add(baseGold);

  // 3. 精致镂空蕾丝纸垫
  const doilyTex = createLaceDoilyTexture();
  const doilyMat = new THREE.MeshStandardMaterial({
    map: doilyTex,
    transparent: true,
    roughness: 0.85,
    depthWrite: false,
  });
  const doilyGeo = new THREE.CircleGeometry(1.78, 64);
  doilyGeo.rotateX(-Math.PI / 2);
  const doily = new THREE.Mesh(doilyGeo, doilyMat);
  doily.position.y = 0.008;
  doily.receiveShadow = true;
  group.add(doily);

  return { group, plateTopY: 0.01 };
}

/** 蛋糕前精致倾斜巧克力祝福铭牌 */
function createBirthdayPlaque(label: string, zPos: number, yPos: number, darkChocolate: boolean): THREE.Mesh {
  const tex = createPlaqueTexture(label, darkChocolate);
  const frontMat = new THREE.MeshPhysicalMaterial({
    map: tex,
    roughness: 0.24,
    clearcoat: 0.65,
  });
  const sideMat = new THREE.MeshStandardMaterial({
    color: darkChocolate ? 0x3b1c0a : 0xfecdd3,
    roughness: 0.35,
  });

  const geo = new THREE.BoxGeometry(0.92, 0.4, 0.04);
  const plaque = new THREE.Mesh(geo, [sideMat, sideMat, sideMat, sideMat, frontMat, sideMat]);
  plaque.position.set(0, yPos, zPos);
  plaque.rotation.x = -0.28;
  plaque.castShadow = true;
  return plaque;
}

/**
 * 蛋糕 1：草莓梦幻双层蛋糕 (elegant-strawberry)
 * 粉白双层抹面奶油 + 垂坠奶油淋面 + 立体鲜草莓 + 马卡龙 + 裱花球 + 珍珠 + 缎带蝴蝶结
 */
function buildStrawberryDreamCake(baseY: number, plaqueText: string): Omit<BuiltCakeResult, 'dispose'> {
  const group = new THREE.Group();
  const bumpTex = createButtercreamBumpTexture();
  const strawberryTex = createStrawberryTexture();

  const pinkCreamMat = new THREE.MeshStandardMaterial({
    color: 0xffd6e0,
    roughness: 0.56,
    metalness: 0.01,
    bumpMap: bumpTex,
    bumpScale: 0.012,
  });

  const ivoryCreamMat = new THREE.MeshStandardMaterial({
    color: 0xfff8f3,
    roughness: 0.48,
    metalness: 0.01,
    bumpMap: bumpTex,
    bumpScale: 0.009,
  });

  const strawberryMat = new THREE.MeshPhysicalMaterial({
    map: strawberryTex,
    roughness: 0.22,
    clearcoat: 0.85,
    clearcoatRoughness: 0.16,
  });

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x2f855a,
    roughness: 0.45,
  });

  const goldPearlMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    roughness: 0.18,
    metalness: 0.85,
  });

  const rosePearlMat = new THREE.MeshPhysicalMaterial({
    color: 0xfda4af,
    roughness: 0.15,
    metalness: 0.15,
    clearcoat: 0.9,
  });

  // 底层大蛋糕
  const bottomR = 1.46;
  const bottomH = 0.82;
  const bottomTier = new THREE.Mesh(createRoundedCakeTierGeometry(bottomR, bottomH, 0.08), pinkCreamMat);
  bottomTier.position.y = baseY;
  bottomTier.castShadow = true;
  bottomTier.receiveShadow = true;
  group.add(bottomTier);

  // 底层粉色丝绸缎带环
  const ribbonMat = new THREE.MeshPhysicalMaterial({
    color: 0xf43f5e,
    roughness: 0.34,
    metalness: 0.08,
    sheen: 0.9,
    sheenColor: new THREE.Color(0xffc2d1),
  });
  const ribbonGeo = new THREE.CylinderGeometry(bottomR + 0.016, bottomR + 0.016, 0.13, 64, 1, true);
  const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
  ribbon.position.y = baseY + 0.11;
  group.add(ribbon);

  // 底层底部珍珠围边
  const pearlGeo = new THREE.SphereGeometry(0.052, 14, 12);
  const basePearlCount = 34;
  for (let i = 0; i < basePearlCount; i++) {
    const a = (i / basePearlCount) * Math.PI * 2;
    const pearl = new THREE.Mesh(pearlGeo, i % 2 === 0 ? ivoryCreamMat : rosePearlMat);
    pearl.position.set(Math.cos(a) * (bottomR + 0.03), baseY + 0.042, Math.sin(a) * (bottomR + 0.03));
    group.add(pearl);
  }

  // 上层蛋糕
  const topR = 1.04;
  const topH = 0.72;
  const topBaseY = baseY + bottomH - 0.02;
  const topTier = new THREE.Mesh(createRoundedCakeTierGeometry(topR, topH, 0.075), ivoryCreamMat);
  topTier.position.y = topBaseY;
  topTier.castShadow = true;
  topTier.receiveShadow = true;
  group.add(topTier);

  // 上层粉白奶油滴落淋面
  const topY = topBaseY + topH;
  const drip = createDripCap(topR, topY, 0xfff1f5, {
    roughness: 0.22,
    clearcoat: 0.65,
    dripCount: 24,
    minDrop: 0.12,
    maxDrop: 0.36,
    seed: 2,
  });
  group.add(drip);

  // 下层台阶奶油裱花球 + 草莓与法式马卡龙交错
  const rosetteGeo = createPipedRosetteGeometry(0.115, 0.15);
  const lowerDecorCount = 16;
  for (let i = 0; i < lowerDecorCount; i++) {
    const a = (i / lowerDecorCount) * Math.PI * 2;
    const r = (bottomR + topR) * 0.5 + 0.02;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;

    const rosette = new THREE.Mesh(rosetteGeo, ivoryCreamMat);
    rosette.position.set(x, topBaseY + 0.01, z);
    rosette.castShadow = true;
    group.add(rosette);

    // 每隔两个放一颗鲜草莓或马卡龙
    if (i % 4 === 1) {
      const sb = createStrawberry(strawberryMat, leafMat, 0.9);
      sb.position.set(Math.cos(a) * (r + 0.05), topBaseY + 0.08, Math.sin(a) * (r + 0.05));
      sb.rotation.z = -Math.cos(a) * 0.28;
      sb.rotation.x = Math.sin(a) * 0.28;
      group.add(sb);
    } else if (i % 4 === 3) {
      const mac = createMacaron(i % 8 === 3 ? 0xfda4af : 0xfde68a, 0xfff7ed, 0.85);
      mac.position.set(Math.cos(a) * (r + 0.04), topBaseY + 0.14, Math.sin(a) * (r + 0.04));
      mac.lookAt(0, topBaseY + 0.14, 0);
      mac.rotation.x += 0.35;
      group.add(mac);
    }
  }

  // 顶层皇冠裱花圈 + 整颗鲜红草莓 + 金色糖珠
  const topCrownCount = 12;
  const smallPearlGeo = new THREE.SphereGeometry(0.032, 12, 10);
  for (let i = 0; i < topCrownCount; i++) {
    const a = (i / topCrownCount) * Math.PI * 2 + 0.15;
    const r = topR - 0.14;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;

    const ros = new THREE.Mesh(rosetteGeo, i % 2 === 0 ? ivoryCreamMat : pinkCreamMat);
    ros.scale.setScalar(0.92);
    ros.position.set(x, topY + 0.02, z);
    ros.castShadow = true;
    group.add(ros);

    if (i % 2 === 0) {
      const sb = createStrawberry(strawberryMat, leafMat, 0.92);
      sb.position.set(x * 0.96, topY + 0.07, z * 0.96);
      sb.rotation.y = a;
      sb.rotation.z = 0.18;
      group.add(sb);
    } else {
      const pearl = new THREE.Mesh(smallPearlGeo, goldPearlMat);
      pearl.position.set(x, topY + 0.16, z);
      group.add(pearl);
    }
  }

  // 前侧精致粉色/巧克力祝福铭牌
  const plaque = createBirthdayPlaque(plaqueText, bottomR + 0.14, baseY + 0.23, false);
  group.add(plaque);

  return {
    group,
    candleSurfaceY: topY + 0.035,
    candleMaxRadius: topR - 0.32,
    accentColor: 0xfb7185,
  };
}

/**
 * 蛋糕 2：午夜黑巧金箔蛋糕 (classic-chocolate)
 * 深烘焙丝绒可可蛋糕 + 镜面黑巧甘纳许滴落 + 24K金箔条纹与碎片 + 金色榛果松露球 + 树莓 + 巧克力卷片
 */
function buildChocolateCake(baseY: number, plaqueText: string): Omit<BuiltCakeResult, 'dispose'> {
  const group = new THREE.Group();
  const bumpTex = createButtercreamBumpTexture();

  const cocoaSpongeMat = new THREE.MeshStandardMaterial({
    color: 0x3b1a0c,
    roughness: 0.72,
    metalness: 0.02,
    bumpMap: bumpTex,
    bumpScale: 0.015,
  });

  const mousseMat = new THREE.MeshStandardMaterial({
    color: 0x522512,
    roughness: 0.5,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.18,
    metalness: 0.94,
  });

  const darkCurlMat = new THREE.MeshPhysicalMaterial({
    color: 0x241008,
    roughness: 0.22,
    clearcoat: 0.75,
    side: THREE.DoubleSide,
  });

  const berryMat = new THREE.MeshPhysicalMaterial({
    color: 0xbe123c,
    roughness: 0.35,
    clearcoat: 0.45,
  });

  // 优雅厚实黑巧主层 + 略高顶层
  const r1 = 1.4;
  const h1 = 0.72;
  const tier1 = new THREE.Mesh(createRoundedCakeTierGeometry(r1, h1, 0.06), cocoaSpongeMat);
  tier1.position.y = baseY;
  tier1.castShadow = true;
  tier1.receiveShadow = true;
  group.add(tier1);

  const r2 = 1.08;
  const h2 = 0.64;
  const tier2BaseY = baseY + h1 - 0.02;
  const tier2 = new THREE.Mesh(createRoundedCakeTierGeometry(r2, h2, 0.06), cocoaSpongeMat);
  tier2.position.y = tier2BaseY;
  tier2.castShadow = true;
  tier2.receiveShadow = true;
  group.add(tier2);

  // 拉丝金环腰线装饰
  const goldBand1 = new THREE.Mesh(
    new THREE.TorusGeometry(r1 + 0.01, 0.022, 12, 72),
    goldMat
  );
  goldBand1.rotation.x = Math.PI / 2;
  goldBand1.position.y = baseY + 0.12;
  group.add(goldBand1);

  const goldBand2 = new THREE.Mesh(
    new THREE.TorusGeometry(r2 + 0.01, 0.018, 12, 64),
    goldMat
  );
  goldBand2.rotation.x = Math.PI / 2;
  goldBand2.position.y = tier2BaseY + 0.04;
  group.add(goldBand2);

  // 侧面艺术贴金箔碎片
  const leafFlakeGeo = new THREE.PlaneGeometry(0.14, 0.11);
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2 + 0.3;
    const onTop = i % 2 === 0;
    const rad = onTop ? r2 + 0.018 : r1 + 0.018;
    const y = onTop ? tier2BaseY + 0.18 + (i % 3) * 0.1 : baseY + 0.26 + (i % 3) * 0.12;
    const flake = new THREE.Mesh(leafFlakeGeo, goldMat);
    flake.position.set(Math.cos(a) * rad, y, Math.sin(a) * rad);
    flake.lookAt(Math.cos(a) * (rad + 2), y, Math.sin(a) * (rad + 2));
    flake.rotation.z = i * 0.7;
    flake.scale.set(0.6 + (i % 3) * 0.35, 0.7 + ((i + 1) % 3) * 0.3, 1);
    group.add(flake);
  }

  // 镜面黑巧甘纳许滴落
  const topY = tier2BaseY + h2;
  const drip = createDripCap(r2, topY, 0x1e0c05, {
    roughness: 0.08,
    clearcoat: 1.0,
    dripCount: 26,
    minDrop: 0.16,
    maxDrop: 0.46,
    seed: 5,
  });
  group.add(drip);

  // 下层台阶金色费列罗风格松露球 & 慕斯花
  const truffleGeo = new THREE.IcosahedronGeometry(0.11, 2);
  const rosetteGeo = createPipedRosetteGeometry(0.11, 0.14);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const rad = (r1 + r2) * 0.5 + 0.02;
    if (i % 2 === 0) {
      const truffle = new THREE.Mesh(truffleGeo, goldMat);
      truffle.position.set(Math.cos(a) * rad, tier2BaseY + 0.1, Math.sin(a) * rad);
      truffle.castShadow = true;
      group.add(truffle);
    } else {
      const swirl = new THREE.Mesh(rosetteGeo, mousseMat);
      swirl.position.set(Math.cos(a) * rad, tier2BaseY + 0.01, Math.sin(a) * rad);
      group.add(swirl);
    }
  }

  // 顶层：黑巧弧形卷片 + 覆盆子 + 金珠点缀
  const curlGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.24, 16, 1, true, 0, Math.PI * 1.15);
  const berryGeo = new THREE.DodecahedronGeometry(0.085, 1);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const rad = r2 - 0.15;
    const x = Math.cos(a) * rad;
    const z = Math.sin(a) * rad;

    const swirl = new THREE.Mesh(rosetteGeo, mousseMat);
    swirl.scale.setScalar(0.88);
    swirl.position.set(x, topY + 0.02, z);
    group.add(swirl);

    if (i % 2 === 0) {
      const curl = new THREE.Mesh(curlGeo, darkCurlMat);
      curl.position.set(x * 0.98, topY + 0.16, z * 0.98);
      curl.rotation.y = -a + 0.5;
      curl.rotation.z = 0.35;
      curl.castShadow = true;
      group.add(curl);
    } else {
      const berry = new THREE.Mesh(berryGeo, berryMat);
      berry.scale.set(1, 1.18, 1);
      berry.position.set(x, topY + 0.15, z);
      berry.castShadow = true;
      group.add(berry);
    }
  }

  const plaque = createBirthdayPlaque(plaqueText, r1 + 0.13, baseY + 0.24, true);
  group.add(plaque);

  return {
    group,
    candleSurfaceY: topY + 0.035,
    candleMaxRadius: r2 - 0.32,
    accentColor: 0xf59e0b,
  };
}

/**
 * 蛋糕 3：彩虹派对高身蛋糕 (rainbow-party)
 * 水彩彩虹渐变抹面 + 云朵白香草奶油滴落 + 满天星3D彩色糖针(InstancedMesh) + 蛋白糖霜尖塔 + 迷你马卡龙 + 金星插牌
 */
function buildRainbowPartyCake(baseY: number, plaqueText: string): Omit<BuiltCakeResult, 'dispose'> {
  const group = new THREE.Group();
  const rainbowTex = createRainbowFrostingTexture();
  const bumpTex = createButtercreamBumpTexture();

  const rainbowMat = new THREE.MeshStandardMaterial({
    map: rainbowTex,
    roughness: 0.5,
    bumpMap: bumpTex,
    bumpScale: 0.01,
  });

  const whiteCreamMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.42,
  });

  // 高挑欢快的派对主蛋糕体
  const radius = 1.28;
  const height = 1.32;
  const cakeBody = new THREE.Mesh(createRoundedCakeTierGeometry(radius, height, 0.08), rainbowMat);
  cakeBody.position.y = baseY;
  cakeBody.castShadow = true;
  cakeBody.receiveShadow = true;
  group.add(cakeBody);

  const topY = baseY + height;

  // 厚实纯白香草糖霜滴落
  const drip = createDripCap(radius, topY, 0xfffdfb, {
    roughness: 0.18,
    clearcoat: 0.72,
    dripCount: 28,
    minDrop: 0.18,
    maxDrop: 0.52,
    seed: 9,
  });
  group.add(drip);

  // 底部彩色奶油泡芙围边
  const pastelColors = [0xfda4af, 0xfdba74, 0xfde68a, 0x6ee7b7, 0x93c5fd, 0xc4b5fd];
  const rosetteGeo = createPipedRosetteGeometry(0.11, 0.14);
  const bottomCount = 24;
  for (let i = 0; i < bottomCount; i++) {
    const a = (i / bottomCount) * Math.PI * 2;
    const mat = new THREE.MeshStandardMaterial({
      color: pastelColors[i % pastelColors.length],
      roughness: 0.45,
    });
    const puff = new THREE.Mesh(rosetteGeo, mat);
    puff.scale.setScalar(0.82);
    puff.position.set(Math.cos(a) * (radius + 0.04), baseY + 0.01, Math.sin(a) * (radius + 0.04));
    group.add(puff);
  }

  // 顶部蛋白糖霜 & 马卡龙花环
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r = radius - 0.16;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;

    if (i % 3 === 0) {
      const mac = createMacaron(pastelColors[i % pastelColors.length], 0xffffff, 0.92);
      mac.position.set(x, topY + 0.14, z);
      mac.lookAt(0, topY + 0.14, 0);
      mac.rotation.x += 0.25;
      group.add(mac);
    } else {
      const kissMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xffffff : pastelColors[i % pastelColors.length],
        roughness: 0.35,
      });
      const kiss = new THREE.Mesh(rosetteGeo, kissMat);
      kiss.scale.set(1.0, 1.35, 1.0);
      kiss.position.set(x, topY + 0.02, z);
      kiss.castShadow = true;
      group.add(kiss);
    }
  }

  // 3D 立体彩虹糖针（InstancedMesh 高性能铺满顶面）
  const sprinkleCount = 110;
  const sprinkleGeo = new THREE.CapsuleGeometry(0.014, 0.055, 4, 8);
  const sprinkleMat = new THREE.MeshStandardMaterial({
    roughness: 0.25,
    metalness: 0.05,
  });
  const sprinkles = new THREE.InstancedMesh(sprinkleGeo, sprinkleMat, sprinkleCount);
  const dummy = new THREE.Object3D();
  const colorObj = new THREE.Color();
  const brightPalette = [0xf43f5e, 0xfb923c, 0xfacc15, 0x34d399, 0x38bdf8, 0xa855f7, 0xec4899];

  for (let i = 0; i < sprinkleCount; i++) {
    const r = Math.sqrt(((i * 0.6180339) % 1)) * (radius - 0.14);
    const a = i * 2.39996;
    dummy.position.set(Math.cos(a) * r, topY + 0.048, Math.sin(a) * r);
    dummy.rotation.set(Math.PI / 2, a * 1.7, (i % 5) * 0.18);
    dummy.updateMatrix();
    sprinkles.setMatrixAt(i, dummy.matrix);
    colorObj.setHex(brightPalette[i % brightPalette.length]);
    sprinkles.setColorAt(i, colorObj);
  }
  sprinkles.instanceMatrix.needsUpdate = true;
  if (sprinkles.instanceColor) sprinkles.instanceColor.needsUpdate = true;
  group.add(sprinkles);

  // 顶部外圈小金星插签装饰
  const goldStarMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    roughness: 0.2,
    metalness: 0.88,
    emissive: 0x92400e,
    emissiveIntensity: 0.15,
  });
  const stemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.36, 8);
  const starGeo = new THREE.OctahedronGeometry(0.085, 0);
  starGeo.scale(1, 1, 0.35);

  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const rad = radius - 0.1;
    const pick = new THREE.Group();
    const stem = new THREE.Mesh(stemGeo, whiteCreamMat);
    stem.position.y = 0.18;
    pick.add(stem);
    const star = new THREE.Mesh(starGeo, goldStarMat);
    star.position.y = 0.38;
    pick.add(star);
    pick.position.set(Math.cos(a) * rad, topY + 0.02, Math.sin(a) * rad);
    pick.rotation.z = -Math.cos(a) * 0.22;
    pick.rotation.x = Math.sin(a) * 0.22;
    group.add(pick);
  }

  const plaque = createBirthdayPlaque(plaqueText, radius + 0.15, baseY + 0.24, false);
  group.add(plaque);

  return {
    group,
    candleSurfaceY: topY + 0.04,
    candleMaxRadius: radius - 0.36,
    accentColor: 0x38bdf8,
  };
}

/**
 * 蛋糕 4：紫绒蓝莓星空蛋糕 (blueberry-glaze)
 * 星空薰衣草渐变丝绒胚 + 高光深紫蓝莓镜面滴落 + 饱满3D蓝莓簇 + 薄荷叶 + 银色星尘糖珠
 */
function buildBlueberryVelvetCake(baseY: number, plaqueText: string): Omit<BuiltCakeResult, 'dispose'> {
  const group = new THREE.Group();
  const starryTex = createStarryVelvetTexture();
  const bumpTex = createButtercreamBumpTexture();

  const velvetMat = new THREE.MeshStandardMaterial({
    map: starryTex,
    roughness: 0.46,
    metalness: 0.06,
    bumpMap: bumpTex,
    bumpScale: 0.01,
  });

  const lavenderCreamMat = new THREE.MeshStandardMaterial({
    color: 0xe9d5ff,
    roughness: 0.44,
  });

  const blueberryMat = new THREE.MeshPhysicalMaterial({
    color: 0x262262,
    roughness: 0.28,
    metalness: 0.06,
    clearcoat: 0.65,
    sheen: 0.8,
    sheenColor: new THREE.Color(0x93c5fd), // 蓝莓表层天然白霜
  });

  const mintMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.42,
    side: THREE.DoubleSide,
  });

  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.12,
    metalness: 0.95,
  });

  // 优雅饱满弧形双层紫绒蛋糕
  const r1 = 1.42;
  const h1 = 0.72;
  const tier1 = new THREE.Mesh(createRoundedCakeTierGeometry(r1, h1, 0.1), velvetMat);
  tier1.position.y = baseY;
  tier1.castShadow = true;
  tier1.receiveShadow = true;
  group.add(tier1);

  const r2 = 1.06;
  const h2 = 0.66;
  const tier2BaseY = baseY + h1 - 0.03;
  const tier2 = new THREE.Mesh(createRoundedCakeTierGeometry(r2, h2, 0.09), velvetMat);
  tier2.position.y = tier2BaseY;
  tier2.castShadow = true;
  tier2.receiveShadow = true;
  group.add(tier2);

  // 高光深紫蓝莓镜面滴落
  const topY = tier2BaseY + h2;
  const drip = createDripCap(r2, topY, 0x4c1d95, {
    roughness: 0.1,
    clearcoat: 1.0,
    dripCount: 24,
    minDrop: 0.18,
    maxDrop: 0.46,
    seed: 13,
  });
  group.add(drip);

  // 银色珍珠底边
  const pearlGeo = new THREE.SphereGeometry(0.044, 12, 10);
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    const p = new THREE.Mesh(pearlGeo, i % 3 === 0 ? silverMat : lavenderCreamMat);
    p.position.set(Math.cos(a) * (r1 + 0.025), baseY + 0.04, Math.sin(a) * (r1 + 0.025));
    group.add(p);
  }

  // 顶层与台阶饱满蓝莓簇 + 薄荷叶 + 薰衣草裱花
  const berryGeo = new THREE.SphereGeometry(0.088, 16, 14);
  berryGeo.scale(1, 0.88, 1);
  const crownGeo = new THREE.TorusGeometry(0.024, 0.008, 6, 5);
  crownGeo.rotateX(Math.PI / 2);
  const leafGeo = new THREE.SphereGeometry(0.08, 10, 8);
  leafGeo.scale(1.4, 0.18, 0.72);
  const rosetteGeo = createPipedRosetteGeometry(0.11, 0.14);

  const addBlueberry = (x: number, y: number, z: number, scale = 1) => {
    const bg = new THREE.Group();
    const b = new THREE.Mesh(berryGeo, blueberryMat);
    b.castShadow = true;
    bg.add(b);
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
      ros.position.set(x, topY + 0.02, z);
      group.add(ros);

      // 蓝莓三颗聚簇
      addBlueberry(x + Math.cos(a) * 0.05, topY + 0.15, z + Math.sin(a) * 0.05, 0.95);
      addBlueberry(x + Math.cos(a + 0.25) * 0.09, topY + 0.11, z + Math.sin(a + 0.25) * 0.09, 0.82);

      // 翠绿薄荷叶衬托
      const leaf = new THREE.Mesh(leafGeo, mintMat);
      leaf.position.set(x + Math.cos(a - 0.25) * 0.11, topY + 0.08, z + Math.sin(a - 0.25) * 0.11);
      leaf.rotation.y = -a + 0.5;
      leaf.rotation.z = 0.3;
      group.add(leaf);
    } else {
      addBlueberry(x, topY + 0.09, z, 1.05);
      const sp = new THREE.Mesh(pearlGeo, silverMat);
      sp.scale.setScalar(0.65);
      sp.position.set(x * 0.88, topY + 0.06, z * 0.88);
      group.add(sp);
    }

    // 下层台阶点缀蓝莓和银珠
    const lowR = (r1 + r2) * 0.5 + 0.04;
    addBlueberry(Math.cos(a + 0.12) * lowR, tier2BaseY + 0.075, Math.sin(a + 0.12) * lowR, 0.85);
    if (i % 3 === 0) {
      const mac = createMacaron(0xc4b5fd, 0xf5f3ff, 0.82);
      mac.position.set(Math.cos(a + 0.35) * lowR, tier2BaseY + 0.12, Math.sin(a + 0.35) * lowR);
      mac.lookAt(0, tier2BaseY + 0.12, 0);
      mac.rotation.x += 0.3;
      group.add(mac);
    }
  }

  const plaque = createBirthdayPlaque(plaqueText, r1 + 0.14, baseY + 0.23, true);
  group.add(plaque);

  return {
    group,
    candleSurfaceY: topY + 0.038,
    candleMaxRadius: r2 - 0.32,
    accentColor: 0xa855f7,
  };
}

/**
 * 蛋糕 5：自定义照片主题 3D 奶油蛋糕 (custom-*)
 * 将用户上传的蛋糕图片制作成精美的金色画框糖霜牌立于奶油蛋糕前端/顶面
 */
function buildCustomPhotoCake(
  baseY: number,
  customImageUrl: string | undefined,
  plaqueText: string
): Omit<BuiltCakeResult, 'dispose'> {
  const group = new THREE.Group();
  const bumpTex = createButtercreamBumpTexture();

  const creamMat = new THREE.MeshStandardMaterial({
    color: 0xfff8f1,
    roughness: 0.45,
    bumpMap: bumpTex,
    bumpScale: 0.01,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    roughness: 0.2,
    metalness: 0.88,
  });

  const r = 1.36;
  const h = 1.06;
  const body = new THREE.Mesh(createRoundedCakeTierGeometry(r, h, 0.08), creamMat);
  body.position.y = baseY;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const topY = baseY + h;
  const drip = createDripCap(r, topY, 0xfbcfe8, {
    roughness: 0.2,
    clearcoat: 0.7,
    dripCount: 24,
    minDrop: 0.14,
    maxDrop: 0.38,
    seed: 21,
  });
  group.add(drip);

  // 奶油裱花边
  const rosetteGeo = createPipedRosetteGeometry(0.11, 0.14);
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const ros = new THREE.Mesh(rosetteGeo, creamMat);
    ros.position.set(Math.cos(a) * (r - 0.14), topY + 0.02, Math.sin(a) * (r - 0.14));
    group.add(ros);
  }

  // 自定义图片可食用糖画金框立牌
  if (customImageUrl) {
    const loader = new THREE.TextureLoader();
    const photoTex = loader.load(customImageUrl);
    photoTex.colorSpace = THREE.SRGBColorSpace;

    const frameGroup = new THREE.Group();
    const frameBox = new THREE.Mesh(new THREE.BoxGeometry(1.16, 1.16, 0.06), goldMat);
    frameBox.castShadow = true;
    frameGroup.add(frameBox);

    const photoPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.04, 1.04),
      new THREE.MeshStandardMaterial({ map: photoTex, roughness: 0.25 })
    );
    photoPlane.position.z = 0.032;
    frameGroup.add(photoPlane);

    frameGroup.position.set(0, baseY + h * 0.56, r + 0.05);
    frameGroup.rotation.x = -0.1;
    group.add(frameGroup);
  } else {
    const plaque = createBirthdayPlaque(plaqueText, r + 0.14, baseY + 0.25, false);
    group.add(plaque);
  }

  return {
    group,
    candleSurfaceY: topY + 0.035,
    candleMaxRadius: r - 0.34,
    accentColor: 0xf472b6,
  };
}

/** 根据 selectedCakeId 构建完整的 3D 蛋糕 + 陶瓷托盘 + 桌面场景组合 */
export function buildCakeAssembly(options: {
  cakeId: string;
  customImage?: string;
  userName?: string;
  lang?: string;
}): BuiltCakeResult {
  const root = new THREE.Group();
  const { group: standGroup, plateTopY } = createCakeStandAndTable();
  root.add(standGroup);

  const plaqueLabel =
    options.userName?.trim() ||
    (options.lang === 'zh' || options.lang === 'zh-Hant' ? '生日快乐' : 'Happy Birthday');

  let built: Omit<BuiltCakeResult, 'dispose'>;
  if (options.cakeId.startsWith('custom-')) {
    built = buildCustomPhotoCake(plateTopY, options.customImage, plaqueLabel);
  } else if (options.cakeId === 'classic-chocolate') {
    built = buildChocolateCake(plateTopY, plaqueLabel);
  } else if (options.cakeId === 'rainbow-party') {
    built = buildRainbowPartyCake(plateTopY, plaqueLabel);
  } else if (options.cakeId === 'blueberry-glaze') {
    built = buildBlueberryVelvetCake(plateTopY, plaqueLabel);
  } else {
    built = buildStrawberryDreamCake(plateTopY, plaqueLabel);
  }

  root.add(built.group);

  return {
    group: root,
    candleSurfaceY: built.candleSurfaceY,
    candleMaxRadius: built.candleMaxRadius,
    accentColor: built.accentColor,
    dispose: () => disposeObject3D(root),
  };
}
