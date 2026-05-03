#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const flowityPath = resolve(repoRoot, "assets/flowity-flow-field-fur.svg");
const logoPath = resolve(repoRoot, "assets/logo.svg");
const outputPath = resolve(repoRoot, "assets/banner-flowity-preview.svg");

const width = 1600;
const height = 400;

const flowitySource = readFileSync(flowityPath, "utf8");
const flowityMatch = flowitySource.match(/<g\b[\s\S]*?<\/g>/);

if (!flowityMatch) {
  throw new Error(`Could not find the Flowity path group in ${flowityPath}`);
}

const logoSource = readFileSync(logoPath, "utf8");
const logoPathMatch = logoSource.match(/<path\b[^>]*\bd="([^"]+)"/);

if (!logoPathMatch) {
  throw new Error(`Could not find a path d attribute in ${logoPath}`);
}

const flowityGroup = flowityMatch[0]
  .replace("<g ", '<g class="flow-lines" ')
  .replace(/stroke-width="[^"]+"/, 'stroke-width="0.92"')
  .replace(/stroke-opacity="[^"]+"/, 'stroke-opacity="0.64"');

const logoPathData = logoPathMatch[1];

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">editbyjunior Flowity banner preview</title>
  <desc id="desc">A dark grey gradient profile banner preview using a Flow Field Fur SVG background with selectable YAML profile text.</desc>

  <style>
    .yaml {
      font-family: "IoskeleyMonoTerm Nerd Font", "IoskeleyMonoTerm Nerd Font Mono", "SFMono-Regular", "Cascadia Mono", "Menlo", "Consolas", monospace;
      font-size: 32px;
      font-weight: 300;
      letter-spacing: 0;
      fill: #f4f6f8;
      white-space: pre;
    }
    .key { fill: #f1413f; }
    .accent { fill: #56f3e8; }
    .field-wrap {
      opacity: 0.72;
      animation: fieldBreathe 10s ease-in-out infinite;
      transform-box: fill-box;
      transform-origin: center;
    }
    .flow-a {
      animation: flowBreatheA 13s ease-in-out infinite;
      transform-box: fill-box;
      transform-origin: center;
    }
    .flow-b {
      animation: flowBreatheB 29s ease-in-out infinite;
      transform-box: fill-box;
      transform-origin: center;
    }
    .flow-lines {
      animation: strokeBreathe 8s ease-in-out infinite;
    }
    .flow-lines path {
      vector-effect: non-scaling-stroke;
    }
    .mark {
      animation: markPulse 8s ease-in-out infinite;
      transform-box: fill-box;
      transform-origin: center;
    }
    @keyframes fieldBreathe {
      0%, 100% {
        opacity: 0.48;
        transform: translate3d(0, 0, 0) scale(1);
      }
      50% {
        opacity: 0.86;
        transform: translate3d(0, 0, 0) scale(1.038);
      }
    }
    @keyframes flowBreatheA {
      0%, 100% {
        opacity: 0.82;
        transform: rotate(-0.65deg) scale(1);
      }
      50% {
        opacity: 1;
        transform: rotate(0.95deg) scale(1.022);
      }
    }
    @keyframes flowBreatheB {
      0%, 100% {
        opacity: 0.58;
        transform: rotate(0deg) scale(1);
      }
      50% {
        opacity: 0.82;
        transform: rotate(-0.42deg) scale(1.014);
      }
    }
    @keyframes strokeBreathe {
      0%, 100% {
        stroke-opacity: 0.42;
      }
      50% {
        stroke-opacity: 0.82;
      }
    }
    @keyframes markPulse {
      0%, 100% {
        opacity: 0.94;
      }
      50% {
        opacity: 1;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .flow-a,
      .flow-b,
      .flow-lines,
      .field-wrap,
      .mark {
        animation: none !important;
      }
    }
  </style>

  <defs>
    <clipPath id="bannerClip">
      <rect width="${width}" height="${height}" rx="0"/>
    </clipPath>
    <linearGradient id="bg" x1="0" y1="200" x2="1600" y2="200" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#151b22"/>
      <stop offset="0.25" stop-color="#262b32"/>
      <stop offset="0.5" stop-color="#4e5153"/>
      <stop offset="0.75" stop-color="#262b32"/>
      <stop offset="1" stop-color="#151b22"/>
    </linearGradient>
    <radialGradient id="rightGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1285 177) rotate(154) scale(480 214)">
      <stop stop-color="#6f777f" stop-opacity="0.14"/>
      <stop offset="0.52" stop-color="#242a30" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#111820" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bottomGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(625 390) rotate(-12) scale(570 128)">
      <stop stop-color="#8d9493" stop-opacity="0.12"/>
      <stop offset="0.46" stop-color="#343b40" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#111820" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="flowFade" x1="0" y1="0" x2="1600" y2="400" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.62"/>
      <stop offset="0.35" stop-color="#ffffff" stop-opacity="0.32"/>
      <stop offset="0.56" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="0.76" stop-color="#ffffff" stop-opacity="0.42"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.72"/>
    </linearGradient>
    <mask id="flowMask">
      <rect width="${width}" height="${height}" fill="url(#flowFade)"/>
    </mask>
    <filter id="flowGlow" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#d8e0e6" flood-opacity="0.05"/>
    </filter>
    <filter id="textGlow" x="-10%" y="-25%" width="120%" height="160%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="0" stdDeviation="1.2" flood-color="#eff4f6" flood-opacity="0.12"/>
    </filter>
    <filter id="markGlow" x="-45%" y="-45%" width="190%" height="190%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="0" stdDeviation="13" flood-color="#ff3e3b" flood-opacity="0.3"/>
    </filter>
  </defs>

  <g clip-path="url(#bannerClip)">
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <rect width="${width}" height="${height}" fill="url(#rightGlow)"/>
    <rect width="${width}" height="${height}" fill="url(#bottomGlow)"/>

    <g class="field-wrap" mask="url(#flowMask)" filter="url(#flowGlow)">
      <g transform="translate(0 -221)">
        <g transform="scale(1.4815)">
          <g class="flow-a">
            ${flowityGroup}
          </g>
        </g>
      </g>
    </g>

    <g aria-hidden="true" opacity="0.15">
      <path d="M0 52H1600" stroke="#39424a" stroke-width="1"/>
      <path d="M0 348H1600" stroke="#0f151b" stroke-width="1"/>
      <path d="M84 0V400" stroke="#2d353d" stroke-width="1"/>
      <path d="M1515 0V400" stroke="#343c44" stroke-width="1"/>
    </g>

    <g class="source" filter="url(#textGlow)">
      <text x="149" y="98" class="yaml key">editbyjunior:</text>
      <text x="207" y="148" class="yaml">role: Design Engineer</text>
      <text x="207" y="198" class="yaml">mode: Solo Founder</text>
      <text x="207" y="248" class="yaml">building: <tspan class="accent">Regeneer</tspan></text>
      <text x="207" y="298" class="yaml">stack: brand · product · interface · code</text>
      <text x="207" y="348" class="yaml">edge: 25yrs of taste, modern tools</text>
    </g>

    <g transform="translate(1253 102) scale(3.6919233148)" filter="url(#markGlow)">
      <g class="mark">
        <path d="${logoPathData}" fill="#d43a34"/>
      </g>
    </g>
  </g>
</svg>
`;

writeFileSync(outputPath, svg);
console.log(`Wrote ${outputPath}`);
