/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require("sharp");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const src = path.join(ROOT, "scripts/icon-source.svg");

const targets = [
  { out: "src/app/icon.png", size: 512 },
  { out: "src/app/apple-icon.png", size: 180 },
  { out: "public/icon-192.png", size: 192 },
  { out: "public/icon-512.png", size: 512 },
  { out: "public/icon-maskable-512.png", size: 512, padded: true },
];

async function run() {
  for (const t of targets) {
    const dest = path.join(ROOT, t.out);
    if (t.padded) {
      // Maskable icons need safe-zone padding (~20%) so OS masks don't clip the glyph.
      const inner = Math.round(t.size * 0.7);
      const svg = await sharp(src).resize(inner, inner).toBuffer();
      await sharp({
        create: {
          width: t.size,
          height: t.size,
          channels: 4,
          background: "#4d46e0",
        },
      })
        .composite([{ input: svg, gravity: "center" }])
        .png()
        .toFile(dest);
    } else {
      await sharp(src).resize(t.size, t.size).png().toFile(dest);
    }
    console.log("wrote", t.out);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
