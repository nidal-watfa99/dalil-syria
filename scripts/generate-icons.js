import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, getPixel) {
  // getPixel(x, y) => [r, g, b, a]
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressed = zlib.deflateSync(rawData);

  function crc32(buf) {
    let crc = -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  const table = (() => {
    const cTable = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      cTable[n] = c >>> 0;
    }
    return cTable;
  })();

  function makeChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(12 + len);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    const crc = crc32(buf.subarray(4, 8 + len));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type 6: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function drawSyrianIcon(size, isMaskable = false) {
  const pad = isMaskable ? Math.round(size * 0.15) : 0;
  const drawSize = size - pad * 2;
  const cx = size / 2;
  const cy = size / 2;

  return createPNG(size, size, (x, y) => {
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const radius = drawSize / 2;

    // Background: deep royal charcoal
    let r = 11, g = 15, b = 23, a = 255;

    // Corner radius if not maskable
    if (!isMaskable) {
      const rx = Math.abs(dx);
      const ry = Math.abs(dy);
      const cornerRadius = size * 0.22;
      const straightW = size / 2 - cornerRadius;
      if (rx > straightW && ry > straightW) {
        const cdx = rx - straightW;
        const cdy = ry - straightW;
        if (cdx * cdx + cdy * cdy > cornerRadius * cornerRadius) {
          return [0, 0, 0, 0];
        }
      }
    }

    // Outer subtle gold accent ring
    if (dist <= radius * 0.92 && dist >= radius * 0.88) {
      r = 212; g = 175; b = 55; // Gold #D4AF37
    }

    // Shield/crest shape in center
    const normalizedY = (y - (cy - radius * 0.45)) / (radius * 1.2);
    const normalizedX = Math.abs(dx) / (radius * 0.6);
    if (normalizedY >= 0 && normalizedY <= 1 && normalizedX <= (1 - normalizedY * 0.35)) {
      r = 24; g = 33; b = 47; // Navy slate #18212F
    }

    // Center gold pin
    const pinCenterY = cy - radius * 0.05;
    const pinDist = Math.sqrt(dx * dx + (y - pinCenterY) * (y - pinCenterY));
    if (pinDist <= radius * 0.3) {
      r = 212; g = 175; b = 55; // Gold
    }
    // Emerald star center
    if (pinDist <= radius * 0.12) {
      r = 5; g = 150; b = 105; // Emerald #059669
    }

    return [r, g, b, a];
  });
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), drawSyrianIcon(192));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), drawSyrianIcon(512));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), drawSyrianIcon(512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), drawSyrianIcon(180));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), drawSyrianIcon(48));

console.log('Successfully generated all PWA icons!');
