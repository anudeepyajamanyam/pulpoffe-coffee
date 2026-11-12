const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = 'dist/media/products';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp') && !f.includes('trans') && !f.includes('hero') && !f.includes('blog'));

async function processFile(file) {
  const filePath = path.join(dir, file);
  try {
    const { data, info } = await sharp(filePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const visited = new Uint8Array(width * height);
    const queue = [];

    // Check if pixel is near-white background
    function isWhite(idx) {
      const r = data[idx * 4];
      const g = data[idx * 4 + 1];
      const b = data[idx * 4 + 2];
      return r > 232 && g > 232 && b > 232;
    }

    // Add border pixels
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
        data[idx * 4 + 3] = 0; // set alpha 0

        if (x > 0 && !visited[idx - 1]) queue.push([x - 1, y]);
        if (x < width - 1 && !visited[idx + 1]) queue.push([x + 1, y]);
        if (y > 0 && !visited[idx - width]) queue.push([x, y - 1]);
        if (y < height - 1 && !visited[idx + width]) queue.push([x, y + 1]);
      }
    }

    // Soft anti-alias pass on edge pixels
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (data[idx * 4 + 3] > 0) {
          const r = data[idx * 4];
          const g = data[idx * 4 + 1];
          const b = data[idx * 4 + 2];
          // If light pixel and has an adjacent transparent pixel
          if (r > 220 && g > 220 && b > 220) {
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

    const tmpPath = filePath + '.tmp.webp';
    await sharp(data, { raw: { width, height, channels } })
      .webp({ quality: 92, alphaQuality: 100 })
      .toFile(tmpPath);

    fs.copyFileSync(tmpPath, filePath);
    fs.unlinkSync(tmpPath);
    console.log('Processed transparent:', file);
  } catch (err) {
    console.error('Error on', file, err.message);
  }
}

async function run() {
  for (const f of files) {
    await processFile(f);
  }
  console.log('All product images processed with clean transparent background!');
}
run();
