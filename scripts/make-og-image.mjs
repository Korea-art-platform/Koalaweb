import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const W = 1200;
const H = 630;
const OUT = process.argv[2];
const LOGO = process.argv[3];

const background = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="glow" cx="50%" cy="42%" r="62%">
      <stop offset="0%" stop-color="#5A3382"/>
      <stop offset="55%" stop-color="#43265F"/>
      <stop offset="100%" stop-color="#2A1640"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#2A1640"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="0" y="0" width="${W}" height="6" fill="#C7A15A"/>
</svg>`);

const caption = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <text x="${W / 2}" y="438" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="34" fill="#EFE7F7" letter-spacing="6">KOREAN ART, IN YOUR HANDS</text>
  <line x1="${W / 2 - 90}" y1="480" x2="${W / 2 + 90}" y2="480" stroke="#C7A15A" stroke-width="2"/>
  <text x="${W / 2}" y="540" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
        font-size="26" fill="#C7A15A" letter-spacing="4">koala-art.co.kr</text>
</svg>`);

const logo = await sharp(readFileSync(LOGO), { density: 600 })
  .resize({ width: 620 })
  .png()
  .toBuffer();

const logoMeta = await sharp(logo).metadata();

const out = await sharp(background)
  .composite([
    { input: logo, top: Math.round(240 - logoMeta.height / 2), left: Math.round((W - logoMeta.width) / 2) },
    { input: caption, top: 0, left: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer();

writeFileSync(OUT, out);
const meta = await sharp(out).metadata();
console.log(`${OUT} ${meta.width}x${meta.height} ${(out.length / 1024).toFixed(0)}KB`);
