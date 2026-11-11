import sharp from 'sharp';
import { join } from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';

const SRC = 'D:/learning/pulpoffe-coffee/public/media/source_new';
const DST_PUB = 'D:/learning/pulpoffe-coffee/public/media/estate';
const DST_DIST = 'D:/learning/pulpoffe-coffee/dist/media/estate';

mkdirSync(DST_PUB, { recursive: true });
mkdirSync(DST_DIST, { recursive: true });

// Warm grade matching brand book earthy elegance
const brandGrade = img => img
  .modulate({ saturation: 0.95, brightness: 1.02 })
  .tint({ r: 255, g: 250, b: 242 });

const photoMap = [
  // 20.09.48 is landscape 1280x960 - the hero photo!
  { src: 'WhatsApp Image 2026-11-11 at 20.09.48.jpeg', out: 'estate-hero-landscape' },
  // 20.09.46, 47, 47 (1) - hands holding cherries (story and craft)
  { src: 'WhatsApp Image 2026-11-11 at 20.09.46.jpeg', out: 'estate-cherries-hands-1' },
  { src: 'WhatsApp Image 2026-11-11 at 20.09.47.jpeg', out: 'estate-cherries-hands-2' },
  { src: 'WhatsApp Image 2026-11-11 at 20.09.47 (1).jpeg', out: 'estate-cherries-hands-3' },
  // 47 (2), 49, 49 (1), 50, 50 (1) - shaded canopy (people & place, b2b, account, contact)
  { src: 'WhatsApp Image 2026-11-11 at 20.09.47 (2).jpeg', out: 'estate-canopy-1' },
  { src: 'WhatsApp Image 2026-11-11 at 20.09.49.jpeg', out: 'estate-canopy-2' },
  { src: 'WhatsApp Image 2026-11-11 at 20.09.49 (1).jpeg', out: 'estate-canopy-3' },
  { src: 'WhatsApp Image 2026-11-11 at 20.09.50.jpeg', out: 'estate-canopy-4' },
  { src: 'WhatsApp Image 2026-11-11 at 20.09.50 (1).jpeg', out: 'estate-canopy-5' },
];

for (const { src, out } of photoMap) {
  const input = join(SRC, src);
  if (!existsSync(input)) {
    console.error(`Missing: ${src}`);
    continue;
  }
  const meta = await sharp(input).metadata();
  const w = meta.width;

  const w1280 = Math.min(1280, w);
  const w640 = Math.min(640, w);

  // 1280 webp
  await brandGrade(sharp(input).resize(w1280, null, { withoutEnlargement: true }))
    .webp({ quality: 84 })
    .toFile(join(DST_PUB, `${out}-1280.webp`));
  copyFileSync(join(DST_PUB, `${out}-1280.webp`), join(DST_DIST, `${out}-1280.webp`));

  // 640 webp
  await brandGrade(sharp(input).resize(w640, null, { withoutEnlargement: true }))
    .webp({ quality: 80 })
    .toFile(join(DST_PUB, `${out}-640.webp`));
  copyFileSync(join(DST_PUB, `${out}-640.webp`), join(DST_DIST, `${out}-640.webp`));

  // Also write fallback jpg
  await sharp(input).resize(w1280, null, { withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(join(DST_PUB, `${out}.jpg`));
  copyFileSync(join(DST_PUB, `${out}.jpg`), join(DST_DIST, `${out}.jpg`));

  console.log(`✓ Processed: ${out} (${w}px source)`);
}

// Copy video to public & dist
const videoSrc = 'C:/Users/anude.LAPTOP-1NVIEN2E/Downloads/WhatsApp Video 2026-11-11 at 20.28.07.mp4';
const vidDstPub = 'D:/learning/pulpoffe-coffee/public/media/videos';
const vidDstDist = 'D:/learning/pulpoffe-coffee/dist/media/videos';
mkdirSync(vidDstPub, { recursive: true });
mkdirSync(vidDstDist, { recursive: true });

if (existsSync(videoSrc)) {
  copyFileSync(videoSrc, join(vidDstPub, 'estate-beans-texture.mp4'));
  copyFileSync(videoSrc, join(vidDstDist, 'estate-beans-texture.mp4'));
  console.log('✓ Video copied: estate-beans-texture.mp4');
}

console.log('All real client assets processed successfully!');
