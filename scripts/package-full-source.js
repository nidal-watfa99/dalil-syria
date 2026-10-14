import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AdmZip from 'adm-zip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function packageSource() {
  console.log('[DalilSyria Packager] Initializing full source archive builder...');

  const zip = new AdmZip();

  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Root configuration and project files
  const rootFiles = [
    'package.json',
    'bun.lock',
    'tsconfig.json',
    'vite.config.ts',
    'server.ts',
    'index.html',
    'metadata.json',
    '.env.example',
    '.gitignore',
    'README.md',
  ];

  let addedFilesCount = 0;

  rootFiles.forEach((file) => {
    const p = path.join(rootDir, file);
    if (fs.existsSync(p)) {
      zip.addLocalFile(p, '');
      console.log(`+ Added root file: ${file}`);
      addedFilesCount++;
    }
  });

  // 2. Add src folder recursively
  const srcDir = path.join(rootDir, 'src');
  if (fs.existsSync(srcDir)) {
    zip.addLocalFolder(srcDir, 'src');
    console.log('+ Added recursive folder: src/**/*');
  }

  // 3. Add scripts folder recursively
  const scriptsDir = path.join(rootDir, 'scripts');
  if (fs.existsSync(scriptsDir)) {
    zip.addLocalFolder(scriptsDir, 'scripts');
    console.log('+ Added recursive folder: scripts/**/*');
  }

  // 4. Add public folder assets (excluding zip files to avoid self-nesting)
  if (fs.existsSync(publicDir)) {
    const publicEntries = fs.readdirSync(publicDir);
    publicEntries.forEach((entry) => {
      if (!entry.endsWith('.zip')) {
        const entryPath = path.join(publicDir, entry);
        const stat = fs.statSync(entryPath);
        if (stat.isFile()) {
          zip.addLocalFile(entryPath, 'public');
          console.log(`+ Added public asset: public/${entry}`);
        } else if (stat.isDirectory()) {
          zip.addLocalFolder(entryPath, `public/${entry}`);
        }
      }
    });
  }

  // Output file paths
  const publicZipPath = path.join(publicDir, 'dalil-syria-complete-source.zip');
  const rootZipPath = path.join(rootDir, 'dalil-syria-complete-source.zip');

  console.log('[DalilSyria Packager] Compressing and writing zip files...');
  zip.writeZip(publicZipPath);
  console.log(`✓ Generated public archive: ${publicZipPath}`);

  // Also write to root directory
  zip.writeZip(rootZipPath);
  console.log(`✓ Generated root archive: ${rootZipPath}`);

  const stat = fs.statSync(publicZipPath);
  const sizeMb = (stat.size / 1024 / 1024).toFixed(2);
  const sizeKb = (stat.size / 1024).toFixed(1);

  console.log(`\n=========================================================`);
  console.log(`[DalilSyria Packager] Source Packaging Complete!`);
  console.log(`Archive file: dalil-syria-complete-source.zip`);
  console.log(`Archive size: ${sizeMb} MB (${sizeKb} KB, ${stat.size} bytes)`);
  console.log(`Accessible at URL: /dalil-syria-complete-source.zip`);
  console.log(`=========================================================\n`);
}

packageSource();
