#!/usr/bin/env node

/**
 * Multi-platform, multi-language, multi-screen promotional & SEO screenshot generator
 * for Electronic Birthday Cake (https://www.birthday-cake.online/).
 *
 * Usage examples:
 *   node scripts/capture-screenshots.mjs
 *   node scripts/capture-screenshots.mjs --langs=en,zh,ja --platforms=desktop,mobile
 *   node scripts/capture-screenshots.mjs --views=home,configure,stage,celebrate
 *   node scripts/capture-screenshots.mjs --base-url=http://localhost:3000 --concurrency=3
 *   node scripts/capture-screenshots.mjs --help
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import LZString from "lz-string";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const DEFAULT_BASE_URL =
  process.env.SCREENSHOT_BASE_URL || "https://www.birthday-cake.online";
const DEFAULT_OUT_DIR = path.join(ROOT_DIR, "public", "screenshots");

const ALL_LANGUAGES = [
  "en",
  "zh",
  "zh-Hant",
  "ja",
  "fr",
  "ar",
  "ko",
  "es",
  "pt",
  "de",
  "it",
  "ru",
  "vi",
  "hi",
  "id",
  "th",
  "ms",
  "tr",
  "ur",
];

const PLATFORMS = {
  desktop: {
    id: "desktop",
    label: "Desktop (16:9)",
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  },
  mobile: {
    id: "mobile",
    label: "Mobile (iPhone Portrait)",
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  },
};

const ACCEPT_LANGUAGE_MAP = {
  en: "en-US,en;q=0.9",
  zh: "zh-CN,zh;q=0.9",
  "zh-Hant": "zh-TW,zh-Hant;q=0.9",
  ja: "ja-JP,ja;q=0.9",
  fr: "fr-FR,fr;q=0.9",
  ar: "ar-SA,ar;q=0.9",
  ko: "ko-KR,ko;q=0.9",
  es: "es-ES,es;q=0.9",
  pt: "pt-BR,pt;q=0.9",
  de: "de-DE,de;q=0.9",
  it: "it-IT,it;q=0.9",
  ru: "ru-RU,ru;q=0.9",
  vi: "vi-VN,vi;q=0.9",
  hi: "hi-IN,hi;q=0.9",
  id: "id-ID,id;q=0.9",
  th: "th-TH,th;q=0.9",
  ms: "ms-MY,ms;q=0.9",
  tr: "tr-TR,tr;q=0.9",
  ur: "ur-PK,ur;q=0.9",
};

/** Localized demo payloads used to render rich, authentic celebration & fireworks screenshots. */
const STAGE_DEMO_CONFIG = {
  en: {
    selectedCakeId: "elegant-strawberry",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "Emma",
    customMessage: "May all your wishes come true!",
    giverName: "Lucas",
    cardStyle: "cream-rose",
    sceneTheme: "fairy-lights",
  },
  zh: {
    selectedCakeId: "elegant-strawberry",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "小雨",
    customMessage: "愿你岁岁常欢愉，万事皆胜意！",
    giverName: "阿明",
    cardStyle: "cream-rose",
    sceneTheme: "fairy-lights",
  },
  "zh-Hant": {
    selectedCakeId: "elegant-strawberry",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "小雨",
    customMessage: "願你歲歲常歡愉，萬事皆勝意！",
    giverName: "阿明",
    cardStyle: "cream-rose",
    sceneTheme: "fairy-lights",
  },
  ja: {
    selectedCakeId: "elegant-strawberry",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "さくら",
    customMessage: "素敵な一年になりますように！",
    giverName: "ハルト",
    cardStyle: "cream-rose",
    sceneTheme: "cherry-blossom",
  },
  fr: {
    selectedCakeId: "elegant-strawberry",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "Chloé",
    customMessage: "Que tous tes vœux se réalisent !",
    giverName: "Léo",
    cardStyle: "cream-rose",
    sceneTheme: "fairy-lights",
  },
  ar: {
    selectedCakeId: "classic-chocolate",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "ليلى",
    customMessage: "كل عام وأنتِ بألف خير وسعادة!",
    giverName: "عمر",
    cardStyle: "dark-gold",
    sceneTheme: "warm-candlelight",
  },
  ko: {
    selectedCakeId: "elegant-strawberry",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "지민",
    customMessage: "행복한 하루 보내세요!",
    giverName: "민준",
    cardStyle: "cream-rose",
    sceneTheme: "cherry-blossom",
  },
  es: {
    selectedCakeId: "rainbow-party",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "Sofía",
    customMessage: "¡Que se cumplan todos tus deseos!",
    giverName: "Mateo",
    cardStyle: "cream-rose",
    sceneTheme: "fairy-lights",
  },
  pt: {
    selectedCakeId: "rainbow-party",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "Helena",
    customMessage: "Que todos os seus sonhos se realizem!",
    giverName: "Gabriel",
    cardStyle: "cream-rose",
    sceneTheme: "fairy-lights",
  },
  de: {
    selectedCakeId: "classic-chocolate",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "Hannah",
    customMessage: "Mögen alle deine Wünsche wahr werden!",
    giverName: "Jonas",
    cardStyle: "dark-gold",
    sceneTheme: "warm-candlelight",
  },
  it: {
    selectedCakeId: "elegant-strawberry",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "Giulia",
    customMessage: "Che tutti i tuoi desideri si avverino!",
    giverName: "Lorenzo",
    cardStyle: "cream-rose",
    sceneTheme: "fairy-lights",
  },
  ru: {
    selectedCakeId: "blueberry-glaze",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "Анна",
    customMessage: "Пусть сбудутся все твои мечты!",
    giverName: "Максим",
    cardStyle: "starry-violet",
    sceneTheme: "starry-night",
  },
  vi: {
    selectedCakeId: "elegant-strawberry",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "Linh",
    customMessage: "Chúc mọi điều ước của bạn thành hiện thực!",
    giverName: "Minh",
    cardStyle: "cream-rose",
    sceneTheme: "fairy-lights",
  },
  hi: {
    selectedCakeId: "elegant-strawberry",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "अनाया",
    customMessage: "आपकी हर मनोकामना पूरी हो!",
    giverName: "आरव",
    cardStyle: "cream-rose",
    sceneTheme: "fairy-lights",
  },
  id: {
    selectedCakeId: "elegant-strawberry",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "Ayu",
    customMessage: "Semoga semua harapanmu terkabul!",
    giverName: "Budi",
    cardStyle: "cream-rose",
    sceneTheme: "fairy-lights",
  },
  th: {
    selectedCakeId: "elegant-strawberry",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "มิ้นท์",
    customMessage: "ขอให้สมหวังทุกประการนะ!",
    giverName: "ต้น",
    cardStyle: "cream-rose",
    sceneTheme: "fairy-lights",
  },
  ms: {
    selectedCakeId: "elegant-strawberry",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "Aisyah",
    customMessage: "Semoga semua impianmu menjadi kenyataan!",
    giverName: "Amir",
    cardStyle: "cream-rose",
    sceneTheme: "fairy-lights",
  },
  tr: {
    selectedCakeId: "elegant-strawberry",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "Elif",
    customMessage: "Tüm dileklerin gerçek olsun!",
    giverName: "Kerem",
    cardStyle: "cream-rose",
    sceneTheme: "fairy-lights",
  },
  ur: {
    selectedCakeId: "elegant-strawberry",
    candleType: "digits",
    candleCount: 18,
    digits: "25",
    userName: "عائشہ",
    customMessage: "آپ کی تمام خواہشات پوری ہوں!",
    giverName: "حمزہ",
    cardStyle: "cream-rose",
    sceneTheme: "fairy-lights",
  },
};

function buildShareConfigQuery(lang, overrides = {}) {
  const base = STAGE_DEMO_CONFIG[lang] || STAGE_DEMO_CONFIG.en;
  const payload = {
    lang,
    selectedCakeId: base.selectedCakeId,
    candleType: base.candleType,
    candleCount: base.candleCount,
    digits: base.digits,
    userName: base.userName,
    customMessage: base.customMessage,
    giverName: base.giverName,
    cardStyle: base.cardStyle,
    sceneTheme: base.sceneTheme,
    musicStyle: "musicbox",
    celebrationSfxStyle: "grand-party",
    ...overrides,
  };
  return LZString.compressToEncodedURIComponent(JSON.stringify(payload));
}

const VIEW_DEFINITIONS = {
  home: {
    id: "home",
    has3D: true,
    buildUrl: (baseUrl, lang) => `${baseUrl}/${lang}`,
    settleMs: 2200,
    prepare: null,
  },
  configure: {
    id: "configure",
    has3D: true,
    buildUrl: (baseUrl, lang) => `${baseUrl}/${lang}/configure?step=1`,
    settleMs: 2600,
    prepare: null,
  },
  "configure-candles": {
    id: "configure-candles",
    has3D: true,
    buildUrl: (baseUrl, lang) => `${baseUrl}/${lang}/configure?step=2`,
    settleMs: 2400,
    prepare: null,
  },
  "configure-customize": {
    id: "configure-customize",
    has3D: true,
    buildUrl: (baseUrl, lang) => `${baseUrl}/${lang}/configure?step=3`,
    settleMs: 2400,
    prepare: null,
  },
  "configure-audio": {
    id: "configure-audio",
    has3D: true,
    buildUrl: (baseUrl, lang) => `${baseUrl}/${lang}/configure?step=4`,
    settleMs: 2400,
    prepare: null,
  },
  stage: {
    id: "stage",
    has3D: true,
    buildUrl: (baseUrl, lang) =>
      `${baseUrl}/${lang}?config=${buildShareConfigQuery(lang)}`,
    // Wait slightly past the 3.2s auto-hide timer so the floating side menu hides for a clean stage shot
    settleMs: 3600,
    prepare: null,
  },
  celebrate: {
    id: "celebrate",
    has3D: true,
    buildUrl: (baseUrl, lang) =>
      `${baseUrl}/${lang}?config=${buildShareConfigQuery(lang, {
        sceneTheme: "starry-night",
      })}`,
    settleMs: 1800,
    prepare: async (page) => {
      // Reveal the floating controls bar and hold the wind (cheat) button until candles extinguish
      const stage = page.locator("#cake-stage");
      const box = await stage.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      }

      const windBtn = page.locator('button:has(path[d^="M17.7 7.7"])').first();
      await windBtn.waitFor({ state: "visible", timeout: 8000 });
      const btnBox = await windBtn.boundingBox();
      if (!btnBox) {
        throw new Error("Could not locate extinguish button bounding box");
      }

      await page.mouse.move(
        btnBox.x + btnBox.width / 2,
        btnBox.y + btnBox.height / 2
      );
      await page.mouse.down();
      await page.waitForTimeout(1350);
      await page.mouse.up();

      // Move pointer away and capture during peak fireworks & confetti burst
      if (box) {
        await page.mouse.move(box.x + 8, box.y + 8);
      }
      await page.waitForTimeout(850);
    },
  },
  guide: {
    id: "guide",
    has3D: false,
    buildUrl: (baseUrl, lang) => `${baseUrl}/${lang}/guide`,
    settleMs: 600,
    prepare: null,
  },
  about: {
    id: "about",
    has3D: false,
    buildUrl: (baseUrl, lang) => `${baseUrl}/${lang}/about`,
    settleMs: 600,
    prepare: null,
  },
  blog: {
    id: "blog",
    has3D: false,
    buildUrl: (baseUrl, lang) => `${baseUrl}/${lang}/blog`,
    settleMs: 600,
    prepare: null,
  },
};

const DEFAULT_VIEWS = [
  "home",
  "configure",
  "stage",
  "celebrate",
  "guide",
  "about",
];

function printHelp() {
  console.log(`
Electronic Birthday Cake Screenshot Generator
=============================================

Captures multi-platform, multi-language screenshots of the app for marketing & SEO meta tags.

Options:
  --base-url=<url>       Target site URL (default: ${DEFAULT_BASE_URL})
  --out-dir=<path>       Output directory (default: public/screenshots)
  --langs=<list|all>     Comma-separated language codes (default: all)
                         Supported: ${ALL_LANGUAGES.join(", ")}
  --platforms=<list>     Comma-separated platforms: desktop,mobile (default: desktop,mobile)
  --views=<list>         Comma-separated views (default: ${DEFAULT_VIEWS.join(",")})
                         Available: ${Object.keys(VIEW_DEFINITIONS).join(", ")}
  --format=<jpg|png>     Image format (default: jpg)
  --quality=<1-100>      JPEG quality when format=jpg (default: 88)
  --concurrency=<n>      Parallel page workers (default: 4)
  --retries=<n>          Retries per failed capture (default: 1)
  --chrome-path=<path>   Custom Chrome/Chromium/Edge executable path
  --dry-run              Print planned capture matrix without launching a browser
  --help                 Show this help message
`);
}

function parseArgs(argv) {
  const opts = {
    baseUrl: DEFAULT_BASE_URL,
    outDir: DEFAULT_OUT_DIR,
    langs: [...ALL_LANGUAGES],
    platforms: ["desktop", "mobile"],
    views: [...DEFAULT_VIEWS],
    format: "jpg",
    quality: 88,
    concurrency: 4,
    retries: 1,
    chromePath: process.env.CHROME_PATH || "",
    dryRun: false,
    help: false,
  };

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      opts.help = true;
    } else if (arg === "--dry-run") {
      opts.dryRun = true;
    } else if (arg.startsWith("--base-url=")) {
      opts.baseUrl = arg.slice("--base-url=".length).replace(/\/+$/, "");
    } else if (arg.startsWith("--out-dir=")) {
      opts.outDir = path.resolve(ROOT_DIR, arg.slice("--out-dir=".length));
    } else if (arg.startsWith("--langs=")) {
      const val = arg.slice("--langs=".length).trim();
      opts.langs =
        val === "all"
          ? [...ALL_LANGUAGES]
          : val
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
    } else if (arg.startsWith("--platforms=")) {
      opts.platforms = arg
        .slice("--platforms=".length)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (arg.startsWith("--views=")) {
      const val = arg.slice("--views=".length).trim();
      opts.views =
        val === "all"
          ? Object.keys(VIEW_DEFINITIONS)
          : val
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
    } else if (arg.startsWith("--format=")) {
      const fmt = arg.slice("--format=".length).toLowerCase();
      opts.format = fmt === "jpeg" ? "jpg" : fmt;
    } else if (arg.startsWith("--quality=")) {
      opts.quality = Math.max(
        1,
        Math.min(100, Number(arg.slice("--quality=".length)) || 88)
      );
    } else if (arg.startsWith("--concurrency=")) {
      opts.concurrency = Math.max(
        1,
        Math.min(12, Number(arg.slice("--concurrency=".length)) || 4)
      );
    } else if (arg.startsWith("--retries=")) {
      opts.retries = Math.max(
        0,
        Math.min(5, Number(arg.slice("--retries=".length)) || 1)
      );
    } else if (arg.startsWith("--chrome-path=")) {
      opts.chromePath = arg.slice("--chrome-path=".length).trim();
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  for (const lang of opts.langs) {
    if (!ALL_LANGUAGES.includes(lang)) {
      throw new Error(
        `Unsupported language "${lang}". Supported: ${ALL_LANGUAGES.join(", ")}`
      );
    }
  }
  for (const p of opts.platforms) {
    if (!PLATFORMS[p]) {
      throw new Error(
        `Unsupported platform "${p}". Supported: ${Object.keys(PLATFORMS).join(", ")}`
      );
    }
  }
  for (const v of opts.views) {
    if (!VIEW_DEFINITIONS[v]) {
      throw new Error(
        `Unsupported view "${v}". Supported: ${Object.keys(VIEW_DEFINITIONS).join(", ")}`
      );
    }
  }
  if (!["jpg", "png"].includes(opts.format)) {
    throw new Error(`Unsupported format "${opts.format}". Supported: jpg, png`);
  }

  return opts;
}

function detectBrowserExecutable(explicitPath) {
  if (explicitPath) {
    if (!fs.existsSync(explicitPath)) {
      throw new Error(`Specified --chrome-path does not exist: ${explicitPath}`);
    }
    return { executablePath: explicitPath };
  }

  const candidates =
    process.platform === "win32"
      ? [
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
          path.join(
            process.env.LOCALAPPDATA || "",
            "Google\\Chrome\\Application\\chrome.exe"
          ),
          "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
          "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
        ]
      : process.platform === "darwin"
        ? [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
          ]
        : [
            "/usr/bin/google-chrome",
            "/usr/bin/google-chrome-stable",
            "/usr/bin/chromium",
            "/usr/bin/chromium-browser",
            "/usr/bin/microsoft-edge",
          ];

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      return { executablePath: candidate };
    }
  }

  // Fallback to Playwright channel auto-discovery
  return { channel: "chrome" };
}

async function waitForPageReady(page, viewDef) {
  await page
    .evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 4000)),
        ]);
      }
    })
    .catch(() => {});

  if (viewDef.has3D) {
    // Wait until Three.js canvas renders with non-zero dimensions and the loading spinner disappears
    await page
      .waitForFunction(
        () => {
          const canvases = Array.from(document.querySelectorAll("canvas"));
          return canvases.some((c) => c.width > 50 && c.height > 50);
        },
        { timeout: 12000 }
      )
      .catch(() => {});

    // Let several animation frames render so flames, particles, and 3D thumbnails settle
    await page
      .evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() =>
              requestAnimationFrame(() => requestAnimationFrame(resolve))
            )
          )
      )
      .catch(() => {});
  }

  if (viewDef.settleMs > 0) {
    await page.waitForTimeout(viewDef.settleMs);
  }
}

async function captureTask(browser, task, opts) {
  const platform = PLATFORMS[task.platform];
  const viewDef = VIEW_DEFINITIONS[task.view];
  const url = viewDef.buildUrl(opts.baseUrl, task.lang);

  const relPath = path.join(
    task.lang,
    task.platform,
    `${task.view}.${opts.format}`
  );
  const outPath = path.join(opts.outDir, relPath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const context = await browser.newContext({
    viewport: platform.viewport,
    deviceScaleFactor: platform.deviceScaleFactor,
    isMobile: platform.isMobile,
    hasTouch: platform.hasTouch,
    userAgent: platform.userAgent,
    locale: task.lang,
    extraHTTPHeaders: {
      "Accept-Language": ACCEPT_LANGUAGE_MAP[task.lang] || "en-US,en;q=0.9",
    },
    reducedMotion: "no-preference",
  });

  try {
    const page = await context.newPage();
    page.setDefaultTimeout(30000);

    await page.goto(url, { waitUntil: "networkidle", timeout: 35000 }).catch(
      async () => {
        // Fallback if third-party font/analytics keeps network busy
        await page.waitForLoadState("load", { timeout: 15000 }).catch(() => {});
      }
    );

    await waitForPageReady(page, viewDef);

    if (typeof viewDef.prepare === "function") {
      await viewDef.prepare(page);
    }

    const screenshotOptions = {
      path: outPath,
      type: opts.format === "jpg" ? "jpeg" : "png",
      fullPage: false,
      animations: "allow",
    };
    if (opts.format === "jpg") {
      screenshotOptions.quality = opts.quality;
    }

    await page.screenshot(screenshotOptions);

    const stat = fs.statSync(outPath);
    const pixelWidth = platform.viewport.width * platform.deviceScaleFactor;
    const pixelHeight = platform.viewport.height * platform.deviceScaleFactor;

    return {
      lang: task.lang,
      platform: task.platform,
      view: task.view,
      url,
      publicPath: `/screenshots/${task.lang}/${task.platform}/${task.view}.${opts.format}`,
      width: pixelWidth,
      height: pixelHeight,
      format: opts.format,
      bytes: stat.size,
    };
  } finally {
    await context.close();
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    return;
  }

  const tasks = [];
  for (const lang of opts.langs) {
    for (const platform of opts.platforms) {
      for (const view of opts.views) {
        tasks.push({ lang, platform, view });
      }
    }
  }

  console.log(
    `\n🎂 Birthday Cake Screenshot Capture\n` +
      `   Base URL   : ${opts.baseUrl}\n` +
      `   Output Dir : ${opts.outDir}\n` +
      `   Languages  : ${opts.langs.join(", ")} (${opts.langs.length})\n` +
      `   Platforms  : ${opts.platforms.join(", ")}\n` +
      `   Views      : ${opts.views.join(", ")}\n` +
      `   Format     : ${opts.format}${opts.format === "jpg" ? ` (quality=${opts.quality})` : ""}\n` +
      `   Total Jobs : ${tasks.length} (concurrency=${opts.concurrency})\n`
  );

  if (opts.dryRun) {
    for (const t of tasks) {
      const url = VIEW_DEFINITIONS[t.view].buildUrl(opts.baseUrl, t.lang);
      console.log(
        `  [dry-run] ${t.lang}/${t.platform}/${t.view}.${opts.format} <- ${url}`
      );
    }
    return;
  }

  const launchTarget = detectBrowserExecutable(opts.chromePath);
  console.log(
    `Launching browser (${launchTarget.executablePath || launchTarget.channel})...`
  );

  const browser = await chromium.launch({
    headless: true,
    ...launchTarget,
    args: [
      "--enable-webgl",
      "--ignore-gpu-blocklist",
      "--use-gl=angle",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--autoplay-policy=no-user-gesture-required",
      "--mute-audio",
    ],
  });

  const startedAt = Date.now();
  const results = [];
  const failures = [];
  let cursor = 0;
  let completed = 0;

  async function worker() {
    while (true) {
      const idx = cursor++;
      if (idx >= tasks.length) break;
      const task = tasks[idx];
      let lastError = null;

      for (let attempt = 0; attempt <= opts.retries; attempt++) {
        try {
          const item = await captureTask(browser, task, opts);
          results.push(item);
          completed++;
          const kb = (item.bytes / 1024).toFixed(1);
          console.log(
            `[${completed}/${tasks.length}] ✓ ${item.publicPath} (${item.width}x${item.height}, ${kb} KB)`
          );
          lastError = null;
          break;
        } catch (err) {
          lastError = err;
          if (attempt < opts.retries) {
            console.warn(
              `  ↻ Retry ${attempt + 1}/${opts.retries} for ${task.lang}/${task.platform}/${task.view}: ${err.message}`
            );
          }
        }
      }

      if (lastError) {
        completed++;
        failures.push({ ...task, error: lastError.message });
        console.error(
          `[${completed}/${tasks.length}] ✗ ${task.lang}/${task.platform}/${task.view}: ${lastError.message}`
        );
      }
    }
  }

  try {
    const workers = Array.from(
      { length: Math.min(opts.concurrency, tasks.length) },
      () => worker()
    );
    await Promise.all(workers);
  } finally {
    await browser.close();
  }

  // Merge into existing manifest.json if partial run, otherwise write clean sorted manifest
  const manifestPath = path.join(opts.outDir, "manifest.json");
  let existingItems = [];
  if (fs.existsSync(manifestPath)) {
    try {
      const prev = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      if (Array.isArray(prev.screenshots)) {
        existingItems = prev.screenshots;
      }
    } catch {
      existingItems = [];
    }
  }

  const byKey = new Map();
  for (const item of existingItems) {
    byKey.set(`${item.lang}/${item.platform}/${item.view}`, item);
  }
  for (const item of results) {
    byKey.set(`${item.lang}/${item.platform}/${item.view}`, item);
  }

  const mergedScreenshots = Array.from(byKey.values()).sort((a, b) =>
    `${a.lang}/${a.platform}/${a.view}`.localeCompare(
      `${b.lang}/${b.platform}/${b.view}`
    )
  );

  fs.mkdirSync(opts.outDir, { recursive: true });
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        baseUrl: opts.baseUrl,
        format: opts.format,
        count: mergedScreenshots.length,
        screenshots: mergedScreenshots,
      },
      null,
      2
    ) + "\n",
    "utf-8"
  );

  const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);
  const totalBytes = results.reduce((sum, r) => sum + r.bytes, 0);
  console.log(
    `\nDone in ${elapsedSec}s: ${results.length} captured (${(totalBytes / 1024 / 1024).toFixed(2)} MB), ${failures.length} failed.\n` +
      `Manifest written to ${manifestPath}\n`
  );

  if (failures.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("Screenshot script failed:", err);
  process.exit(1);
});
