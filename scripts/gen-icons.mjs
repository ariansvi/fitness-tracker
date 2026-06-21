// One-off: rasterize the app icon to the PNGs iOS / PWA need.
// Run with `node scripts/gen-icons.mjs` (requires the `sharp` devDependency).
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

// Emerald square with a white dumbbell — full-bleed so iOS can apply its own mask.
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#10b981"/>
  <g fill="#ffffff">
    <rect x="96"  y="176" width="40"  height="160" rx="12"/>
    <rect x="140" y="196" width="28"  height="120" rx="10"/>
    <rect x="168" y="242" width="176" height="28"  rx="14"/>
    <rect x="344" y="196" width="28"  height="120" rx="10"/>
    <rect x="376" y="176" width="40"  height="160" rx="12"/>
  </g>
</svg>`;

const buf = Buffer.from(svg);
const targets = [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
];

for (const [name, size] of targets) {
  await sharp(buf).resize(size, size).png().toFile(join(pub, name));
  console.log('wrote', name);
}
