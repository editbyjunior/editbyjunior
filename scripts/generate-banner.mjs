#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const outputPath = resolve(repoRoot, "assets/banner.svg");
const logoPath = resolve(repoRoot, "assets/logo.svg");

const width = 1600;
const height = 400;

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const logoSource = readFileSync(logoPath, "utf8");
const logoPathMatch = logoSource.match(/<path\b[^>]*\bd="([^"]+)"/);

if (!logoPathMatch) {
  throw new Error(`Could not find a path d attribute in ${logoPath}`);
}

const logoPathData = logoPathMatch[1];

const yamlMarkup = [
  '<span foreground="#f1413f" size="30720">editbyjunior:</span>',
  '  role: Design Engineer',
  '  mode: Solo Founder',
  '  building: <span foreground="#56f3e8">Regeneer</span>',
  '  stack: brand · product · interface · code',
  '  edge: 25yrs of taste, modern tools',
].join("\n");

const textLayerInput = resolve(tmpdir(), "editbyjunior-banner-text.pango");
const textLayerOutput = resolve(tmpdir(), "editbyjunior-banner-text.svg");
writeFileSync(textLayerInput, yamlMarkup);

execFileSync("pango-view", [
  "--no-display",
  "--markup",
  "--pixels",
  "--font=IoskeleyMonoTerm Nerd Font Light 33",
  "--foreground=#f4f6f8",
  "--background=transparent",
  "--line-spacing=1.08",
  "--output",
  textLayerOutput,
  textLayerInput,
]);

const textLayerSource = readFileSync(textLayerOutput, "utf8");
const textLayerDefs = textLayerSource.match(/<defs>([\s\S]*?)<\/defs>/)?.[1]?.trim();
const textLayerBody = textLayerSource
  .replace(/^[\s\S]*?<\/defs>/, "")
  .replace(/<\/svg>\s*$/, "")
  .trim();

if (!textLayerDefs || !textLayerBody) {
  throw new Error("Could not extract outlined text layer from pango-view output");
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" aria-labelledby="title desc">
  <title id="title">editbyjunior profile banner</title>
  <desc id="desc">editbyjunior: Design Engineer, Solo Founder, building Regeneer with brand, product, interface, code, and modern tools.</desc>

  <defs>
    <radialGradient id="rightGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1370 166) rotate(154) scale(452 198)">
      <stop stop-color="#5c6469" stop-opacity="0.78"/>
      <stop offset="0.48" stop-color="#242a30" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#111820" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bottomGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(641 384) rotate(-15) scale(521 114)">
      <stop stop-color="#768084" stop-opacity="0.5"/>
      <stop offset="0.46" stop-color="#343b40" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#111820" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="1600" y2="400" gradientUnits="userSpaceOnUse">
      <stop stop-color="#222a32"/>
      <stop offset="0.38" stop-color="#111820"/>
      <stop offset="1" stop-color="#20272d"/>
    </linearGradient>
    <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="34"/>
    </filter>
    <filter id="textGlow" x="-10%" y="-25%" width="120%" height="160%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="0" stdDeviation="1.2" flood-color="#eff4f6" flood-opacity="0.12"/>
    </filter>
    <filter id="markGlow" x="-45%" y="-45%" width="190%" height="190%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="0" stdDeviation="13" flood-color="#ff3e3b" flood-opacity="0.18"/>
    </filter>
    ${textLayerDefs}
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#rightGlow)"/>
  <rect width="${width}" height="${height}" fill="url(#bottomGlow)"/>
  <ellipse cx="1268" cy="172" rx="246" ry="92" fill="#7e878c" opacity="0.2" filter="url(#softBlur)"/>
  <ellipse cx="603" cy="391" rx="348" ry="64" fill="#a4a9a6" opacity="0.18" filter="url(#softBlur)"/>

  <g aria-hidden="true" opacity="0.18">
    <path d="M0 52H1600" stroke="#39424a" stroke-width="1"/>
    <path d="M0 348H1600" stroke="#0f151b" stroke-width="1"/>
    <path d="M84 0V400" stroke="#2d353d" stroke-width="1"/>
    <path d="M1515 0V400" stroke="#343c44" stroke-width="1"/>
  </g>

  <g transform="translate(150 74)" filter="url(#textGlow)">
    ${textLayerBody}
  </g>

  <g transform="translate(1252 102) scale(5.18)" filter="url(#markGlow)">
    <path d="${logoPathData}" fill="#fa3838"/>
  </g>
</svg>
`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, svg);
console.log(`Generated ${outputPath}`);
