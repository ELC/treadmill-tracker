import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(rootDir, "public");
const sourcePath = join(publicDir, "icon-source.png");
const source = readFileSync(sourcePath);

const outputs = [
  { name: "favicon.png", size: 32 },
  { name: "apple-touch-icon.png", size: 180 },
  { name: "pwa-192x192.png", size: 192 },
  { name: "pwa-512x512.png", size: 512 },
];

for (const { name, size } of outputs) {
  await sharp(source).resize(size, size).png().toFile(join(publicDir, name));
}
