const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = 'dist/media/products';
const outDir = 'dist/media/products-clean';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.webp') && !f.includes('hero') && !f.includes('blog') && !f.includes('tmp'));

async function processFile(file) {
  const srcPath = path.join(srcDir, file);
  const outPath = path.join(outDir, file);
  try {
    const { data, info } = await sharp(srcPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const visited = new Uint8Array(width * height);
    const queue = [];

    function isWhite(idx) {
      const r = data[idx * 4];
      const g = data[idx * 4 + 1];
      const b = data[idx * 4 + 2];
      return r > 230 && g > 230 && b > 230;
    }

    for (let x = 0; x < width; x++) {
      queue.push([x, 0]);
      queue.push([x, height - 1]);
    }
    for (let y = 0; y < height; y++) {
      queue.push([0, y]);
      queue.push([width - 1, y]);
    }

    let head = 0;
    while (head < queue.length) {
      const [x, y] = queue[head++];
      const idx = y * width + x;
      if (visited[idx]) continue;
      visited[idx] = 1;

      if (isWhite(idx)) {
        data[idx * 4 + 3] = 0;

        if (x > 0 && !visited[idx - 1]) queue.push([x - 1, y]);
        if (x < width - 1 && !visited[idx + 1]) queue.push([x + 1, y]);
        if (y > 0 && !visited[idx - width]) queue.push([x, y - 1]);
        if (y < height - 1 && !visited[idx + width]) queue.push([x, y + 1]);
      }
    }

    // Edge anti-aliasing
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (data[idx * 4 + 3] > 0) {
          const r = data[idx * 4];
          const g = data[idx * 4 + 1];
          const b = data[idx * 4 + 2];
          if (r > 215 && g > 215 && b > 215) {
            const hasAlphaNeighbor =
              data[(idx - 1) * 4 + 3] === 0 ||
              data[(idx + 1) * 4 + 3] === 0 ||
              data[(idx - width) * 4 + 3] === 0 ||
              data[(idx + width) * 4 + 3] === 0;
            if (hasAlphaNeighbor) {
              data[idx * 4 + 3] = 0;
            }
          }
        }
      }
    }

    await sharp(data, { raw: { width, height, channels } })
      .webp({ quality: 92, alphaQuality: 100 })
      .toFile(outPath);

    console.log('Saved clean transparent:', file);
  } catch (err) {
    console.error('Error on', file, err.message);
  }
}

async function run() {
  for (const f of files) {
    await processFile(f);
  }
  console.log('Done creating products-clean folder!');
}
run();
