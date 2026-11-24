import * as THREE from 'three';

function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

/** 极柔和纯净的奶油横向抹面纹理 */
export function createSilkyFrostingBumpTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 256);
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 256);

  for (let y = 0; y < 256; y++) {
    const wave = Math.sin(y * 0.22) * 4 + Math.sin(y * 0.08) * 2.5;
    const v = Math.round(128 + wave);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(0, y, 512, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 1);
  return tex;
}

/** 鲜活清晰的马卡龙彩虹渐变奶油侧面贴图（专为直壁侧面 UV 0..1 映射调校） */
export function createRainbowFrostingTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, '#ff9ebb'); // 鲜莓粉
  grad.addColorStop(0.18, '#ffba86'); // 蜜桃橘
  grad.addColorStop(0.36, '#ffe47a'); // 奶油柠檬黄
  grad.addColorStop(0.55, '#8ce9b5'); // 清新薄荷绿
  grad.addColorStop(0.75, '#86c5ff'); // 晴空天蓝
  grad.addColorStop(0.92, '#c59bff'); // 丁香紫
  grad.addColorStop(1.0, '#f7a8d8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // 柔和奶油抹面横向高光丝纹
  for (let y = 0; y < 512; y += 10) {
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.fillRect(0, y, 512, 2.5);
  }

  // 侧面点缀精致彩色糖针
  const sprinkleColors = ['#f43f5e', '#fb923c', '#facc15', '#10b981', '#0ea5e9', '#a855f7'];
  for (let i = 0; i < 85; i++) {
    ctx.save();
    const x = ((i * 73) % 490) + 11;
    const y = 70 + ((i * 137) % 395);
    ctx.translate(x, y);
    ctx.rotate((i * 1.1) % Math.PI);
    ctx.fillStyle = sprinkleColors[i % sprinkleColors.length];
    ctx.beginPath();
    ctx.roundRect(-5.5, -2.2, 11, 4.4, 2.2);
    ctx.fill();
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/** 梦幻饱满的薰衣草蓝莓星夜侧面贴图 */
export function createStarryVelvetTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, '#6d28d9');
  grad.addColorStop(0.35, '#8b5cf6');
  grad.addColorStop(0.72, '#c4b5fd');
  grad.addColorStop(1.0, '#e9d5ff');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const clouds = [
    [110, 140, 120, 'rgba(244,114,182,0.22)'],
    [340, 180, 140, 'rgba(129,140,248,0.26)'],
    [230, 320, 130, 'rgba(255,255,255,0.18)'],
    [430, 90, 95, 'rgba(216,180,254,0.24)'],
  ] as const;
  clouds.forEach(([x, y, r, color]) => {
    const rg = ctx.createRadialGradient(x, y, 4, x, y, r);
    rg.addColorStop(0, color);
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  });

  for (let i = 0; i < 150; i++) {
    const x = (i * 97) % 512;
    const y = (i * 151) % 470;
    const r = 0.8 + (i % 3) * 0.65;
    ctx.fillStyle = `rgba(255,255,255,${(0.45 + (i % 5) * 0.11).toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/** 精致纯白镂空蕾丝垫圈（贴合蛋糕底托，无多余宽边） */
export function createLaceDoilyTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const cx = 256;
  const cy = 256;

  ctx.clearRect(0, 0, 512, 512);

  ctx.fillStyle = 'rgba(255, 253, 250, 0.94)';
  ctx.beginPath();
  ctx.arc(cx, cy, 198, 0, Math.PI * 2);
  ctx.fill();

  const petals = 40;
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2;
    const px = cx + Math.cos(angle) * 218;
    const py = cy + Math.sin(angle) * 218;
    ctx.fillStyle = 'rgba(255, 253, 250, 0.92)';
    ctx.beginPath();
    ctx.arc(px, py, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(angle) * 220, cy + Math.sin(angle) * 220, 6.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = 'source-over';
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 明快马卡龙螺旋条纹蜡烛贴图 */
export function createCandleStripeTexture(
  baseColor: string,
  stripeColor: string,
  accentGold = true
): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(256, 256);
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = stripeColor;
  ctx.lineWidth = 24;
  for (let i = -256; i < 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 256, 256);
    ctx.stroke();
  }

  if (accentGold) {
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.65)';
    ctx.lineWidth = 4;
    for (let i = -256 + 15; i < 512; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 256, 256);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 2);
  return tex;
}

/** 熟透饱满的鲜红草莓表皮贴图（丰富鲜红，不会泛白） */
export function createStrawberryTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(256, 256);
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0.0, '#b91c1c'); // 熟透尖端深红宝石 (v=1)
  grad.addColorStop(0.5, '#dc2626');
  grad.addColorStop(0.85, '#ef4444');
  grad.addColorStop(1.0, '#f87171'); // 蒂部鲜亮红 (v=0)
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  for (let row = 1; row < 10; row++) {
    const y = (row / 10) * 228 + 12;
    const cols = 12;
    const offset = (row % 2) * (256 / cols / 2);
    for (let col = 0; col < cols; col++) {
      const x = (col / cols) * 256 + offset;
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.ellipse(x, y, 1.8, 2.8, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/** 柔和径向光晕贴图 */
export function createSoftGlowTexture(
  innerHex = '#fffbeb',
  midHex = '#fbbf24',
  outerRgba = 'rgba(251, 146, 60, 0)'
): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(128, 128);
  const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
  grad.addColorStop(0.0, innerHex);
  grad.addColorStop(0.28, midHex);
  grad.addColorStop(0.62, outerRgba.replace(/0\)$/, '0.26)'));
  grad.addColorStop(1.0, outerRgba);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 细腻半透明青烟团纹理 */
export function createSmokePuffTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(128, 128);
  ctx.clearRect(0, 0, 128, 128);

  const puffs = [
    [64, 64, 46, 0.32],
    [52, 58, 34, 0.24],
    [76, 60, 32, 0.2],
    [62, 74, 34, 0.2],
  ];
  puffs.forEach(([x, y, r, a]) => {
    const g = ctx.createRadialGradient(x, y, 2, x, y, r);
    g.addColorStop(0, `rgba(241, 245, 249, ${a})`);
    g.addColorStop(0.55, `rgba(226, 232, 240, ${(a * 0.42).toFixed(2)})`);
    g.addColorStop(1, 'rgba(148, 163, 184, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 中英文自动换行工具，保证祝福语在蛋糕卡片上排版整齐清晰 */
function wrapCardText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const lines: string[] = [];
  let current = '';

  for (const ch of Array.from(text)) {
    const test = current + ch;
    if (ctx.measureText(test).width > maxWidth && current.length > 0) {
      lines.push(current);
      current = ch;
      if (lines.length >= maxLines) break;
    } else {
      current = test;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  } else if (lines.length === maxLines && current) {
    let last = lines[maxLines - 1];
    while (last.length > 1 && ctx.measureText(last + '…').width > maxWidth) {
      last = last.slice(0, -1);
    }
    lines[maxLines - 1] = last + '…';
  }

  return lines;
}

import { CardStyle } from '@/types';
import { getCardPalette, resolveCardText } from '@/utils/cardTheme';

export interface PlaqueContentOptions {
  userName?: string;
  customMessage?: string;
  giverName?: string;
  lang?: string;
  cardStyle?: CardStyle;
}

/** 获取不同祝福卡片风格对应的立体厚边颜色（与正面边缘无缝衔接，彻底消除黑边） */
export function getPlaqueSideColor(style: CardStyle = 'cream-rose'): number {
  return getCardPalette(style).sideColor;
}

/**
 * 蛋糕前哑光手写祝福卡片贴图：
 * 1. 先全幅满铺底色（fillRect 0..width, 0..height），彻底杜绝透明边角在 WebGL 渲染成黑框的问题！
 * 2. 支持多种风格自由搭配：奶油粉笺 / 黑巧鎏金 / 星夜紫韵 / 清新薄荷。
 */
export function createPlaqueTexture(options: PlaqueContentOptions): THREE.CanvasTexture {
  const {
    userName = '',
    customMessage = '',
    giverName = '',
    lang = 'zh',
    cardStyle = 'cream-rose',
  } = options;

  const [canvas, ctx] = createCanvas(768, 440);
  const p = getCardPalette(cardStyle);

  // 全幅满铺背景色，彻底消除任何透明像素引起的黑边！
  const bgGrad = ctx.createLinearGradient(0, 0, 768, 440);
  bgGrad.addColorStop(0, p.bg1);
  bgGrad.addColorStop(1, p.bg2);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 768, 440);

  if (p.stars) {
    for (let i = 0; i < 42; i++) {
      const sx = ((i * 113) % 720) + 24;
      const sy = ((i * 71) % 392) + 24;
      const sr = 1.2 + (i % 3) * 0.9;
      ctx.fillStyle = `rgba(255,255,255,${(0.25 + (i % 4) * 0.16).toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 典雅内嵌双线框
  ctx.strokeStyle = p.border;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(22, 22, 724, 396, 26);
  ctx.stroke();

  ctx.strokeStyle = p.subBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(36, 36, 696, 368, 20);
  ctx.stroke();

  // 顶部装饰徽章
  ctx.fillStyle = p.emblem;
  ctx.font = '600 24px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(p.emblemText, 384, 78);

  const { titleText, bodyText, fromText } = resolveCardText({
    userName,
    customMessage,
    giverName,
    lang,
  });

  const hasBody = Boolean(bodyText);
  const hasFrom = Boolean(fromText);

  // 主标题
  const titleY = hasBody && hasFrom ? 150 : hasBody || hasFrom ? 172 : 230;
  const titleSize = titleText.length > 14 ? 46 : titleText.length > 8 ? 56 : 68;
  ctx.fillStyle = p.primaryInk;
  ctx.font = `700 ${titleSize}px Georgia, "Songti SC", "PingFang SC", "Microsoft YaHei", serif`;
  ctx.textAlign = 'center';
  ctx.fillText(titleText, 384, titleY, 620);

  // 祝福语（message）
  if (hasBody) {
    const bodySize = bodyText.length > 22 ? 32 : 38;
    ctx.fillStyle = p.secondaryInk;
    ctx.font = `500 ${bodySize}px "PingFang SC", "Microsoft YaHei", Georgia, sans-serif`;
    const lines = wrapCardText(ctx, bodyText, 600, 2);
    const startY = hasFrom ? (lines.length > 1 ? 232 : 246) : (lines.length > 1 ? 255 : 272);
    const lineGap = bodySize + 14;
    lines.forEach((line, idx) => {
      ctx.fillText(line, 384, startY + idx * lineGap);
    });
  }

  // 赠送人落款（From）
  if (hasFrom) {
    ctx.strokeStyle = p.subBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(180, 326);
    ctx.lineTo(588, 326);
    ctx.stroke();

    ctx.fillStyle = p.fromInk;
    ctx.font = `italic 600 32px Georgia, "PingFang SC", "Microsoft YaHei", serif`;
    ctx.textAlign = 'center';
    ctx.fillText(fromText, 384, 362, 580);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** 3D 数字蜡烛牌面贴图（全幅满铺奶油底色，彻底消除透明外边距导致的黑边！） */
export function createDigitFaceTexture(digit: string, themeIndex = 0): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(256, 320);
  const palettes = [
    ['#fff5f7', '#e11d48', '#f59e0b'],
    ['#fffbeb', '#d97706', '#f43f5e'],
    ['#f5f3ff', '#7c3aed', '#ec4899'],
    ['#f0f9ff', '#0284c7', '#eab308'],
  ];
  const [bg, fg, border] = palettes[themeIndex % palettes.length];

  // 先全幅满铺背景色，绝不留任何透明黑边！
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 256, 320);

  // 内嵌柔和彩色装饰细框
  ctx.strokeStyle = border;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.roundRect(16, 16, 224, 288, 28);
  ctx.stroke();

  const dots = [
    [46, 52], [210, 56], [48, 268], [208, 264], [128, 38], [128, 282],
  ];
  dots.forEach(([x, y], i) => {
    ctx.fillStyle = i % 2 === 0 ? border : fg;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.font = '900 184px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(digit, 132, 168);

  ctx.fillStyle = fg;
  ctx.fillText(digit, 128, 164);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** 柔和星夜底面微光投影圆盘（自然透明融入背景，无突兀边界） */
export function createTableSurfaceTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  ctx.clearRect(0, 0, 512, 512);

  const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 250);
  grad.addColorStop(0.0, 'rgba(30, 27, 56, 0.55)');
  grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.28)');
  grad.addColorStop(1.0, 'rgba(2, 6, 23, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
