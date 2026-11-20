#!/usr/bin/env node

/**
 * Export public/favicon.svg into all required app icon formats & sizes:
 *  - public/favicon-16x16.png
 *  - public/favicon-32x32.png
 *  - public/favicon-48x48.png
 *  - public/favicon.ico (multi-resolution 16/32/48 PNG-in-ICO)
 *  - public/apple-touch-icon.png (180x180, full-bleed opaque background)
 *  - public/pwa-192x192.png (192x192, rounded squircle)
 *  - public/pwa-512x512.png (512x512, rounded squircle)
 *  - public/pwa-maskable-192x192.png (192x192, full-bleed + safe-zone padding)
 *  - public/pwa-maskable-512x512.png (512x512, full-bleed + safe-zone padding)
 *
 * Usage:
 *   node scripts/export-icons.mjs
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const MASTER_SVG_PATH = path.join(PUBLIC_DIR, "favicon.svg");

function detectBrowserExecutable() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return { executablePath: process.env.CHROME_PATH };
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
          ]
        : [
            "/usr/bin/google-chrome",
            "/usr/bin/chromium",
            "/usr/bin/chromium-browser",
          ];

  for (const c of candidates) {
    if (c && fs.existsSync(c)) return { executablePath: c };
  }
  return { channel: "chrome" };
}

/**
 * Transform master SVG for variant needs:
 * - squircle: original rounded corners with transparent outside
 * - fullbleed: square background (rx=0), slightly padded for Apple touch icon
 * - maskable: square background (rx=0), scaled inside 80% Android safe zone
 */
function transformSvgVariant(svgSource, variant) {
  if (variant === "squircle") {
    return svgSource;
  }

  // Remove rounded corners so iOS / Android launcher masks never show black corners
  let out = svgSource.replace(/rx="116"/g, 'rx="0"');

  const scale = variant === "maskable" ? 0.8 : 0.92;
  const offset = ((1 - scale) * 256).toFixed(2);
  out = out.replace(
    '<g data-artwork="true">',
    `<g data-artwork="true" transform="translate(${offset} ${offset}) scale(${scale})">`
  );

  return out;
}

/**
 * Build a standard multi-image .ico Buffer containing PNG frames (supported by all modern browsers & OSes).
 */
function buildIcoFromPngs(entries) {
  // ICONDIR header: 6 bytes
  // ICONDIRENTRY: 16 bytes each
  const headerSize = 6 + entries.length * 16;
  let offset = headerSize;
  const totalSize =
    headerSize + entries.reduce((sum, e) => sum + e.buffer.length, 0);
  const ico = Buffer.alloc(totalSize);

  ico.writeUInt16LE(0, 0); // Reserved
  ico.writeUInt16LE(1, 2); // Type: 1 = ICO
  ico.writeUInt16LE(entries.length, 4); // Image count

  entries.forEach((entry, i) => {
    const pos = 6 + i * 16;
    const dim = entry.size >= 256 ? 0 : entry.size;
    ico.writeUInt8(dim, pos); // Width
    ico.writeUInt8(dim, pos + 1); // Height
    ico.writeUInt8(0, pos + 2); // Color palette
    ico.writeUInt8(0, pos + 3); // Reserved
    ico.writeUInt16LE(1, pos + 4); // Color planes
    ico.writeUInt16LE(32, pos + 6); // Bits per pixel
    ico.writeUInt32LE(entry.buffer.length, pos + 8); // Image data size
    ico.writeUInt32LE(offset, pos + 12); // Offset to PNG data

    entry.buffer.copy(ico, offset);
    offset += entry.buffer.length;
  });

  return ico;
}

const TARGETS = [
  { file: "favicon-16x16.png", size: 16, variant: "squircle", transparent: true },
  { file: "favicon-32x32.png", size: 32, variant: "squircle", transparent: true },
  { file: "favicon-48x48.png", size: 48, variant: "squircle", transparent: true },
  { file: "apple-touch-icon.png", size: 180, variant: "fullbleed", transparent: false },
  { file: "pwa-192x192.png", size: 192, variant: "squircle", transparent: true },
  { file: "pwa-512x512.png", size: 512, variant: "squircle", transparent: true },
  { file: "pwa-maskable-192x192.png", size: 192, variant: "maskable", transparent: false },
  { file: "pwa-maskable-512x512.png", size: 512, variant: "maskable", transparent: false },
];

async function main() {
  if (!fs.existsSync(MASTER_SVG_PATH)) {
    throw new Error(`Master SVG not found at ${MASTER_SVG_PATH}`);
  }

  const masterSvg = fs.readFileSync(MASTER_SVG_PATH, "utf-8");
  const browser = await chromium.launch({
    headless: true,
    ...detectBrowserExecutable(),
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  const renderedBuffers = new Map();

  try {
    const context = await browser.newContext({
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const target of TARGETS) {
      await page.setViewportSize({ width: target.size, height: target.size });
      const svgMarkup = transformSvgVariant(masterSvg, target.variant);

      await page.setContent(
        `<!DOCTYPE html>
<html>
<head>
<style>
  html, body {
    margin: 0;
    padding: 0;
    width: ${target.size}px;
    height: ${target.size}px;
    overflow: hidden;
    background: ${target.transparent ? "transparent" : "#070b1a"};
  }
  svg {
    display: block;
    width: ${target.size}px;
    height: ${target.size}px;
  }
</style>
</head>
<body>${svgMarkup}</body>
</html>`,
        { waitUntil: "load" }
      );

      const outPath = path.join(PUBLIC_DIR, target.file);
      const buffer = await page.screenshot({
        type: "png",
        omitBackground: target.transparent,
      });

      fs.writeFileSync(outPath, buffer);
      renderedBuffers.set(target.size, buffer);
      console.log(
        `✓ public/${target.file} (${target.size}x${target.size}, ${target.variant}, ${(buffer.length / 1024).toFixed(1)} KB)`
      );
    }

    await context.close();
  } finally {
    await browser.close();
  }

  // Generate multi-size favicon.ico (16, 32, 48)
  const icoBuffer = buildIcoFromPngs([
    { size: 16, buffer: renderedBuffers.get(16) },
    { size: 32, buffer: renderedBuffers.get(32) },
    { size: 48, buffer: renderedBuffers.get(48) },
  ]);
  const icoPath = path.join(PUBLIC_DIR, "favicon.ico");
  fs.writeFileSync(icoPath, icoBuffer);
  console.log(
    `✓ public/favicon.ico (16+32+48 multi-size, ${(icoBuffer.length / 1024).toFixed(1)} KB)`
  );
}

main().catch((err) => {
  console.error("Icon export failed:", err);
  process.exit(1);
});
