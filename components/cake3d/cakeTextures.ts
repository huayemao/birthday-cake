import * as THREE from 'three';

function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

/** 柔滑奶油微纹理凹凸贴图（横纹抹刀笔触 + 细腻气孔质感） */
export function createButtercreamBumpTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 256);
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 256);

  // 横向精致抹面线条
  for (let y = 0; y < 256; y += 3) {
    const shade = 122 + Math.floor(Math.sin(y * 0.27) * 9 + (Math.random() - 0.5) * 10);
    ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
    ctx.fillRect(0, y, 512, 2);
  }
  // 细腻颗粒
  for (let i = 0; i < 3200; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    const v = 115 + Math.floor(Math.random() * 26);
    ctx.fillStyle = `rgba(${v},${v},${v},0.35)`;
    ctx.fillRect(x, y, 2, 1.5);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1.5);
  return tex;
}

/** 彩虹蛋糕侧面渐变水彩层纹理 */
export function createRainbowFrostingTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, '#fffaf5');
  grad.addColorStop(0.14, '#fda4af'); // rose
  grad.addColorStop(0.28, '#fdba74'); // apricot
  grad.addColorStop(0.44, '#fde68a'); // buttercup
  grad.addColorStop(0.60, '#a7f3d0'); // mint
  grad.addColorStop(0.76, '#93c5fd'); // sky
  grad.addColorStop(0.92, '#c4b5fd'); // lavender
  grad.addColorStop(1.0, '#fbcfe8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // 柔和奶白色半裸抹面条纹
  for (let y = 0; y < 512; y += 5) {
    const alpha = 0.08 + Math.random() * 0.16;
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
    ctx.fillRect(0, y, 512, 2 + Math.random() * 3);
  }

  // 细小糖珠彩点
  const sprinkleColors = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ec4899'];
  for (let i = 0; i < 140; i++) {
    ctx.save();
    ctx.translate(Math.random() * 512, 50 + Math.random() * 420);
    ctx.rotate(Math.random() * Math.PI);
    ctx.fillStyle = sprinkleColors[i % sprinkleColors.length];
    ctx.beginPath();
    ctx.roundRect(-5, -1.8, 10, 3.6, 1.8);
    ctx.fill();
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/** 紫绒星空蓝莓镜面纹理 */
export function createStarryVelvetTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, '#5b21b6');
  grad.addColorStop(0.45, '#7c3aed');
  grad.addColorStop(0.85, '#ddd6fe');
  grad.addColorStop(1, '#ede9fe');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // 柔和星云炫彩刷痕
  for (let i = 0; i < 22; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 320;
    const r = 35 + Math.random() * 75;
    const rg = ctx.createRadialGradient(x, y, 2, x, y, r);
    rg.addColorStop(0, i % 2 === 0 ? 'rgba(244,114,182,0.18)' : 'rgba(129,140,248,0.22)');
    rg.addColorStop(1, 'rgba(129,140,248,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }

  // 可食用银粉星尘
  for (let i = 0; i < 240; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 480;
    const r = 0.6 + Math.random() * 1.7;
    ctx.fillStyle = `rgba(255,255,255,${(0.35 + Math.random() * 0.65).toFixed(2)})`;
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

/** 精致蕾丝蛋糕纸垫（圆形径向镂空花边） */
export function createLaceDoilyTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const cx = 256;
  const cy = 256;

  ctx.clearRect(0, 0, 512, 512);

  // 中心实心柔白底
  ctx.fillStyle = 'rgba(255, 252, 248, 0.94)';
  ctx.beginPath();
  ctx.arc(cx, cy, 185, 0, Math.PI * 2);
  ctx.fill();

  // 外圈波浪花瓣边
  const petals = 36;
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2;
    const px = cx + Math.cos(angle) * 212;
    const py = cy + Math.sin(angle) * 212;
    ctx.fillStyle = 'rgba(255, 252, 248, 0.92)';
    ctx.beginPath();
    ctx.arc(px, py, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  // 镂空蕾丝孔洞（destination-out 挖空）
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2;
    const hx1 = cx + Math.cos(angle) * 214;
    const hy1 = cy + Math.sin(angle) * 214;
    ctx.beginPath();
    ctx.arc(hx1, hy1, 7.5, 0, Math.PI * 2);
    ctx.fill();

    const angle2 = angle + Math.PI / petals;
    const hx2 = cx + Math.cos(angle2) * 195;
    const hy2 = cy + Math.sin(angle2) * 195;
    ctx.beginPath();
    ctx.arc(hx2, hy2, 5.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalCompositeOperation = 'source-over';
  // 淡金色压纹细环
  ctx.strokeStyle = 'rgba(245, 208, 138, 0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 180, 0, Math.PI * 2);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 螺旋条纹蜡烛纹理（支持多组马卡龙色系） */
export function createCandleStripeTexture(baseColor: string, stripeColor: string, accentGold = true): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(256, 256);
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = stripeColor;
  ctx.lineWidth = 22;
  for (let i = -256; i < 512; i += 64) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 256, 256);
    ctx.stroke();
  }

  if (accentGold) {
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.55)';
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

/** 草莓表面籽粒凹凸与红润色泽贴图 */
export function createStrawberryTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(256, 256);
  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, '#be123c'); // 尖端熟透深红 (v=1)
  grad.addColorStop(0.55, '#e11d48');
  grad.addColorStop(0.85, '#f43f5e');
  grad.addColorStop(1, '#fda4af'); // 靠近绿叶蒂部微浅红 (v=0)
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // 均匀交错排列的金黄色草莓籽
  for (let row = 1; row < 10; row++) {
    const y = (row / 10) * 230 + 10;
    const cols = 12;
    const offset = (row % 2) * (256 / cols / 2);
    for (let col = 0; col < cols; col++) {
      const x = (col / cols) * 256 + offset;
      // 凹陷暗影
      ctx.fillStyle = 'rgba(80, 7, 36, 0.45)';
      ctx.beginPath();
      ctx.ellipse(x, y + 1, 3.2, 4.4, 0, 0, Math.PI * 2);
      ctx.fill();
      // 金色籽粒
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.ellipse(x, y, 1.9, 3.0, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/** 柔和径向光晕贴图（烛火光晕、氛围星光、焦外光斑） */
export function createSoftGlowTexture(innerHex = '#fffbeb', midHex = '#fbbf24', outerRgba = 'rgba(251, 146, 60, 0)'): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(128, 128);
  const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
  grad.addColorStop(0.0, innerHex);
  grad.addColorStop(0.26, midHex);
  grad.addColorStop(0.6, outerRgba.replace(/0\)$/, '0.28)'));
  grad.addColorStop(1.0, outerRgba);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 细腻半透明烟雾团纹理（吹灭蜡烛后袅袅青烟） */
export function createSmokePuffTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(128, 128);
  ctx.clearRect(0, 0, 128, 128);

  // 多重偏移柔光球叠加，形成自然云雾质感
  const puffs = [
    [64, 64, 46, 0.34],
    [52, 58, 34, 0.25],
    [76, 60, 32, 0.22],
    [62, 74, 34, 0.22],
  ];
  puffs.forEach(([x, y, r, a]) => {
    const g = ctx.createRadialGradient(x, y, 2, x, y, r);
    g.addColorStop(0, `rgba(226, 232, 240, ${a})`);
    g.addColorStop(0.55, `rgba(203, 213, 225, ${(a * 0.45).toFixed(2)})`);
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

/** 蛋糕前精致巧克力/翻糖手写铭牌贴图 */
export function createPlaqueTexture(text: string, darkChocolate = true): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 220);

  // 圆角牌底色
  const bgGrad = ctx.createLinearGradient(0, 0, 512, 220);
  if (darkChocolate) {
    bgGrad.addColorStop(0, '#3b1c0a');
    bgGrad.addColorStop(0.5, '#2a1205');
    bgGrad.addColorStop(1, '#451a03');
  } else {
    bgGrad.addColorStop(0, '#fff5f7');
    bgGrad.addColorStop(1, '#ffe4e6');
  }

  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(12, 12, 488, 196, 36);
  ctx.fill();

  // 金色双线精致边框
  ctx.strokeStyle = darkChocolate ? '#facc15' : '#f472b6';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(24, 24, 464, 172, 28);
  ctx.stroke();

  ctx.strokeStyle = darkChocolate ? 'rgba(253, 224, 71, 0.45)' : 'rgba(244, 114, 182, 0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(36, 36, 440, 148, 22);
  ctx.stroke();

  // 顶部小星星装饰
  ctx.fillStyle = darkChocolate ? '#fde047' : '#ec4899';
  ctx.font = '24px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦   ♥   ✦', 256, 68);

  // 主文字（自适应字号）
  const display = text.trim() || 'Happy Birthday';
  const fontSize = display.length > 14 ? 36 : display.length > 9 ? 44 : 54;
  ctx.fillStyle = darkChocolate ? '#fef08a' : '#be185d';
  ctx.font = `italic bold ${fontSize}px Georgia, "Songti SC", "STSong", serif`;
  ctx.fillText(display, 256, 134, 410);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 3D 数字蜡烛纹理（立体发光浮雕感数字 + 糖果点缀） */
export function createDigitFaceTexture(digit: string, themeIndex = 0): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(256, 320);
  const palettes = [
    ['#fff1f2', '#f43f5e', '#fbbf24'],
    ['#fefce8', '#f59e0b', '#fb7185'],
    ['#f5f3ff', '#8b5cf6', '#f472b6'],
    ['#ecfeff', '#06b6d4', '#facc15'],
  ];
  const [bg, fg, border] = palettes[themeIndex % palettes.length];

  // 背景圆角糖牌
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(14, 14, 228, 292, 42);
  ctx.fill();

  // 金边
  ctx.strokeStyle = border;
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.roundRect(22, 22, 212, 276, 36);
  ctx.stroke();

  // 可爱彩色糖粒点缀
  const dots = [
    [54, 58], [202, 62], [58, 260], [198, 256], [128, 44], [128, 276],
  ];
  dots.forEach(([x, y], i) => {
    ctx.fillStyle = i % 2 === 0 ? border : fg;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // 大号立体数字
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.font = '900 186px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(digit, 132, 170);

  ctx.fillStyle = fg;
  ctx.fillText(digit, 128, 165);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.strokeText(digit, 128, 165);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 优雅木纹/深色大理石圆桌纹理 */
export function createTableSurfaceTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = createCanvas(512, 512);
  const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 256);
  grad.addColorStop(0, '#292238');
  grad.addColorStop(0.55, '#171324');
  grad.addColorStop(0.88, '#0b0e1c');
  grad.addColorStop(1, '#020617');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // 淡雅大理石金丝脉络
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.05)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 14; i++) {
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = Math.random() * 512;
    ctx.moveTo(x, y);
    for (let s = 0; s < 6; s++) {
      x += (Math.random() - 0.5) * 90;
      y += (Math.random() - 0.5) * 90;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
