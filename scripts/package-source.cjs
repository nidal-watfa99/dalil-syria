/**
 * Builds the deliverable source ZIP OUTSIDE the app: release/dalil-syria-2026-source.zip
 * Usage: npm run package:source
 *
 * - The ZIP is never placed in public/ (so it is not served by, or cached inside, the app).
 * - Excludes node_modules, dist, release, data (server-side secrets), .git, logs and every .env* except .env.example.
 * - Aborts if any file looks like it contains a real API key.
 */
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'release');
const OUT = path.join(OUT_DIR, 'dalil-syria-2026-source.zip');
const EXCLUDE_DIRS = new Set(['node_modules', 'dist', 'release', '.git', 'coverage', '.vite']);
// Server-side secrets dir: excluded ONLY at the project root (src/data is app source and must be kept).
const EXCLUDE_ROOT_DIRS = new Set(['data']);
const KEY_PATTERNS = [/sk-[A-Za-z0-9_-]{20,}/, /AIza[0-9A-Za-z_-]{30,}/, /gsk_[A-Za-z0-9]{20,}/];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(ROOT, full);
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      if (dir === ROOT && EXCLUDE_ROOT_DIRS.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.isFile()) {
      if (/^\.env/.test(entry.name) && entry.name !== '.env.example') continue;
      if (/\.(log|zip)$/i.test(entry.name)) continue;
      out.push(rel);
    }
  }
  return out;
}

const files = walk(ROOT).sort();
const textExt = /\.(ts|tsx|js|cjs|mjs|json|md|html|css|svg|example|gitignore)$/i;
for (const rel of files) {
  if (!textExt.test(rel) && !rel.endsWith('.env.example') && !rel.endsWith('.gitignore')) continue;
  const content = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  for (const re of KEY_PATTERNS) {
    if (re.test(content)) {
      console.error(`ABORT: possible API key found in ${rel}. Remove it before packaging.`);
      process.exit(1);
    }
  }
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const output = fs.createWriteStream(OUT);
const archive = new archiver.ZipArchive({ zlib: { level: 9 } });
output.on('close', () => {
  console.log(`OK: ${OUT}`);
  console.log(`${files.length} files, ${archive.pointer()} bytes`);
});
archive.on('error', (e) => {
  throw e;
});
archive.pipe(output);
for (const rel of files) archive.file(path.join(ROOT, rel), { name: rel });
archive.finalize();
