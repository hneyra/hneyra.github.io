// Generates the CV PDFs from the built site, using the print stylesheet.
//
//   node scripts/build-pdf.mjs [--site _site] [--baseurl /repo] [--channel chrome] [--copy-to-source]
//
// --channel (or PDF_BROWSER_CHANNEL) uses an installed browser such as Google Chrome
// instead of Playwright's bundled Chromium; CI uses the Chrome preinstalled on the runner.
//
// It serves the built site locally, opens every language version in headless
// Chromium and prints it to the path the "Download CV" button points to
// (pdf.* and pdf_min.* in _data/profile.yml), so the link can never point to a
// missing file. --copy-to-source also updates the copies in assets/pdf/.

import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join, extname, dirname, resolve } from "node:path";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 ? args[i + 1] : fallback;
};

const site = resolve(option("site", "_site"));
const baseurl = (option("baseurl", process.env.BASE_PATH || "") || "").replace(/\/$/, "");
const copyToSource = args.includes("--copy-to-source");
const channel = option("channel", process.env.PDF_BROWSER_CHANNEL) || undefined;
// Pages that offer a PDF download: full and minimal versions, one per language.
// Each one is printed with its own print stylesheet to the file its download link points to.
const pages = ["/", "/es/", "/min/", "/es/min/"];

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
};

// Minimal static server that mounts the site under the baseurl, like GitHub Pages does
const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (baseurl && !path.startsWith(baseurl + "/")) throw new Error("outside baseurl");
    path = path.slice(baseurl.length);
    let file = join(site, path);
    if (!file.startsWith(site)) throw new Error("outside site");
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
});

await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel });
console.log(`Browser: ${channel || "bundled Chromium"} ${browser.version()}`);
let failed = false;

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
  page.on("pageerror", (e) => { console.error(`Page error: ${e.message}`); failed = true; });

  for (const path of pages) {
    const url = origin + baseurl + path;
    const response = await page.goto(url, { waitUntil: "load" });
    if (!response?.ok()) throw new Error(`${url} returned ${response?.status()}`);

    // The download button's href is the single source of truth for the file name
    const href = await page.getAttribute("a[download][href$='.pdf']", "href").catch(() => null);
    if (!href) {
      console.log(`${path}: no PDF link on the page, skipped`);
      continue;
    }
    const relative = new URL(href, url).pathname.slice(baseurl.length);
    const target = join(site, relative);

    await page.emulateMedia({ media: "print", colorScheme: "light" });
    const pdf = await page.pdf({ printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
    await page.emulateMedia({ media: "screen" });

    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, pdf);
    console.log(`${path} -> ${relative} (${Math.round(pdf.length / 1024)} KB)`);

    if (copyToSource) {
      const source = resolve(relative.replace(/^\//, ""));
      await mkdir(dirname(source), { recursive: true });
      await writeFile(source, pdf);
      console.log(`  also updated ${relative.replace(/^\//, "")}`);
    }
  }
} finally {
  await browser.close();
  server.close();
}

if (failed) process.exit(1);
