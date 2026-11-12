import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const DEFAULT_SITE_URL = "https://gibinthomas.netlify.app";

const CORE_PRODUCTION_FILES = [
  "index.html",
  "404.html",
  "style.css",
  "main.js",
  "robots.txt",
  "sitemap.xml",
  "Gibin Thomas.pdf",
  "assets/Gibin.jpg",
  "assets/favicon.svg",
  "assets/logo.svg",
  "assets/logo.png"
];

const TEXT_FILES_WITH_SITE_URL = new Set([
  "index.html",
  "robots.txt",
  "sitemap.xml"
]);

const TEXT_FILES_TO_CHECK = [
  "index.html",
  "404.html",
  "style.css",
  "main.js",
  "robots.txt",
  "sitemap.xml"
];

const EXCLUDED_ASSETS = new Set([
  "assets/image.png",
  "assets/main.png",
  "assets/20240229_151035.jpg",
  "resume.pdf"
]);

function parseValidHttpsOrigin(rawUrl) {
  if (typeof rawUrl !== "string") return "";
  const trimmed = rawUrl.trim();
  if (!trimmed || trimmed.includes("REPLACE_WITH_")) return "";
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") {
      throw new Error(`Site URL must use https:// (received: ${trimmed})`);
    }
    return parsed.origin + parsed.pathname.replace(/\/+$/, "");
  } catch (err) {
    throw new Error(`Invalid site URL "${trimmed}": ${err.message}`);
  }
}

function resolveSiteUrl() {
  const configPath = path.join(rootDir, "site.config.json");
  if (fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, "utf8");
    const parsed = JSON.parse(raw);
    const configured = parseValidHttpsOrigin(parsed.siteUrl);
    if (configured) {
      return configured;
    }
  }

  if (process.env.NETLIFY === "true" && process.env.URL) {
    try {
      const netlifyEnvUrl = parseValidHttpsOrigin(process.env.URL);
      if (netlifyEnvUrl) {
        return netlifyEnvUrl;
      }
    } catch (_err) {
      // Ignore invalid Netlify env URL and fall back to default domain
    }
  }

  return DEFAULT_SITE_URL;
}

function collectReferencedHtmlAssets() {
  const htmlFiles = ["index.html", "404.html"];
  const collected = [];

  for (const htmlFile of htmlFiles) {
    const fullPath = path.join(rootDir, htmlFile);
    if (!fs.existsSync(fullPath)) continue;
    const html = fs.readFileSync(fullPath, "utf8");
    const matches = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)];

    for (const match of matches) {
      const rawRef = match[1].trim();
      if (
        !rawRef ||
        rawRef.startsWith("#") ||
        rawRef.startsWith("http://") ||
        rawRef.startsWith("https://") ||
        rawRef.startsWith("//") ||
        /^(?:mailto|tel|javascript|data):/i.test(rawRef)
      ) {
        continue;
      }

      const withoutQueryOrHash = rawRef.split("#")[0].split("?")[0];
      if (!withoutQueryOrHash || withoutQueryOrHash === "/") continue;

      const decoded = decodeURIComponent(withoutQueryOrHash).replace(/\\/g, "/");
      const stripped = decoded.startsWith("/") ? decoded.slice(1) : decoded;
      const rel = path.posix.normalize(stripped);

      if (path.isAbsolute(rel) || rel.startsWith("..")) {
        throw new Error(`Asset reference escapes workspace (${htmlFile}): ${rawRef}`);
      }

      if (EXCLUDED_ASSETS.has(rel)) {
        throw new Error(`Refusing to publish excluded legacy/unused asset (${htmlFile}): ${rel}`);
      }

      const diskPath = path.join(rootDir, rel);
      if (!fs.existsSync(diskPath)) {
        throw new Error(`Referenced asset missing on disk (${htmlFile}): ${rel}`);
      }

      collected.push(rel);
    }
  }

  return collected;
}

const resolvedSiteUrl = resolveSiteUrl();

for (const relPath of TEXT_FILES_TO_CHECK) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) continue;
  const content = fs.readFileSync(fullPath, "utf8");
  if (content.includes("REPLACE_WITH_")) {
    throw new Error(`Unresolved placeholder token (REPLACE_WITH_) found in ${relPath}`);
  }
}

const filesToPublish = Array.from(
  new Set([...CORE_PRODUCTION_FILES, ...collectReferencedHtmlAssets()])
);

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

for (const relPath of filesToPublish) {
  const src = path.join(rootDir, relPath);
  const dest = path.join(distDir, relPath);
  if (!fs.existsSync(src)) {
    throw new Error(`Missing required production file: ${relPath}`);
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  if (TEXT_FILES_WITH_SITE_URL.has(relPath)) {
    const content = fs.readFileSync(src, "utf8").split(DEFAULT_SITE_URL).join(resolvedSiteUrl);
    fs.writeFileSync(dest, content, "utf8");
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log(`Prepared dist/ with ${filesToPublish.length} production files:`);
for (const f of filesToPublish) {
  console.log(` - ${f}`);
}
console.log(`Configured canonical/SEO site URL: ${resolvedSiteUrl}`);
