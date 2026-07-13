// scripts/generate-favicons.mjs
// Generates favicon PNGs, ICO, and apple-touch-icon from src/app/icon.svg.
// Run with: node scripts/generate-favicons.mjs
//
// Outputs:
//   src/app/icon.svg              (hand-authored, not regenerated)
//   src/app/favicon.ico           (16, 32, 48 — Next.js file-based)
//   src/app/manifest.webmanifest  (hand-authored, not regenerated)
//   public/favicon-16x16.png      (static — served at root)
//   public/favicon-32x32.png      (static — served at root)
//   public/apple-touch-icon.png   (static — served at root, 180×180)
//   public/icon-192.png           (static — served at root)
//   public/icon-512.png           (static — served at root)
//
// Why split: Next.js file-based metadata convention auto-serves
// `icon.svg`, `favicon.ico`, and `manifest.webmanifest` from src/app/
// at the root URL. PNG files with names that don't match the convention
// (icon-{size}.png with an "x", like icon-16x16.png) must live in
// public/ to be served as static files at the root URL.
//
// Uses sharp (devDependency) for rasterisation and png-to-ico
// (devDependency) for the ICO container. No runtime dependency
// added to the production bundle.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const APP_DIR = join(ROOT, "src", "app");
const PUBLIC_DIR = join(ROOT, "public");
const SVG_PATH = join(APP_DIR, "icon.svg");

// PNGs that must be served as static files at root — these have
// filenames that don't match Next.js's file-based metadata convention,
// so they live in public/.
const PNG_SIZES = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "icon-192.png", size: 192 },
  { name: "icon-512.png", size: 512 },
];

// ICO sizes — 16, 32, 48 per the brief
const ICO_SIZES = [16, 32, 48];

async function main() {
  // Ensure public/ exists
  await mkdir(PUBLIC_DIR, { recursive: true });

  console.log("Reading SVG source…");
  const svgBuffer = await readFile(SVG_PATH);

  console.log("Generating PNGs in public/…");
  for (const { name, size } of PNG_SIZES) {
    const out = join(PUBLIC_DIR, name);
    await sharp(svgBuffer, { density: 384 })
      .resize(size, size, { fit: "cover", position: "center" })
      .png({ compressionLevel: 9 })
      .toFile(out);
    console.log(`  ✓ ${name} (${size}×${size})`);
  }

  console.log("Generating ICO (16, 32, 48) in src/app/…");
  const icoPngs = [];
  for (const size of ICO_SIZES) {
    const png = await sharp(svgBuffer, { density: 384 })
      .resize(size, size, { fit: "cover", position: "center" })
      .png({ compressionLevel: 9 })
      .toBuffer();
    icoPngs.push(png);
  }
  const icoBuffer = await pngToIco(icoPngs);
  const icoOut = join(APP_DIR, "favicon.ico");
  await writeFile(icoOut, icoBuffer);
  console.log(`  ✓ favicon.ico (${ICO_SIZES.join(", ")})`);

  console.log("\nDone. All favicon assets generated.");
  console.log("  src/app/icon.svg              (hand-authored)");
  console.log("  src/app/favicon.ico           (generated)");
  console.log("  src/app/manifest.webmanifest  (hand-authored)");
  console.log("  public/favicon-16x16.png      (generated)");
  console.log("  public/favicon-32x32.png      (generated)");
  console.log("  public/apple-touch-icon.png   (generated)");
  console.log("  public/icon-192.png           (generated)");
  console.log("  public/icon-512.png           (generated)");
}

main().catch((err) => {
  console.error("Favicon generation failed:", err);
  process.exit(1);
});
