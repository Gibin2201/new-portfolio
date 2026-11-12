import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");

const CORE_PRODUCTION_FILES = [
  "index.html",
  "style.css",
  "main.js",
  "Gibin Thomas.pdf",
  "assets/Gibin.jpg",
  "assets/favicon.svg"
];

const EXCLUDED_ASSETS = new Set([
  "assets/image.png",
  "assets/main.png",
  "assets/20240229_151035.jpg"
]);

function collectConfiguredScreenshots() {
  const mainJsPath = path.join(rootDir, "main.js");
  if (!fs.existsSync(mainJsPath)) return [];
  const mainJs = fs.readFileSync(mainJsPath, "utf8");
  const matches = [...mainJs.matchAll(/screenshotSrc:\s*["']([^"']+)["']/g)];
  const extraFiles = [];

  for (const match of matches) {
    const rel = match[1].trim().replace(/\\/g, "/");
    if (!rel || rel.startsWith("REPLACE_WITH_") || rel.startsWith("http")) continue;
    if (EXCLUDED_ASSETS.has(rel)) {
      throw new Error(`Refusing to publish excluded/dummy asset: ${rel}`);
    }
    if (fs.existsSync(path.join(rootDir, rel))) {
      extraFiles.push(rel);
    }
  }

  return extraFiles;
}

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

const filesToPublish = Array.from(
  new Set([...CORE_PRODUCTION_FILES, ...collectConfiguredScreenshots()])
);

for (const relPath of filesToPublish) {
  const src = path.join(rootDir, relPath);
  const dest = path.join(distDir, relPath);
  if (!fs.existsSync(src)) {
    throw new Error(`Missing required production file: ${relPath}`);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

console.log(`Prepared dist/ with ${filesToPublish.length} production files:`);
for (const f of filesToPublish) {
  console.log(` - ${f}`);
}

