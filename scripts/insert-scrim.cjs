const fs = require('fs');
let html = fs.readFileSync('dist/index.html', 'utf8');

const target = `      <video class="hero-video-bg" autoplay muted loop playsinline poster="media/estate/estate-hero-landscape-1280.webp" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0">
        <source src="media/videos/hero-video.mp4" type="video/mp4">
      </video>`;

const replacement = `      <video class="hero-video-bg" autoplay muted loop playsinline poster="media/estate/estate-hero-landscape-1280.webp" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0">
        <source src="media/videos/hero-video.mp4" type="video/mp4">
      </video>
      <div class="hero-scrim" style="position:absolute;inset:0;background:linear-gradient(90deg, rgba(12,7,3,0.96) 0%, rgba(12,7,3,0.88) 38%, rgba(12,7,3,0.52) 65%, rgba(12,7,3,0.15) 100%);z-index:1;pointer-events:none"></div>`;

if (html.includes(target)) {
  html = html.replace(target, replacement);
  fs.writeFileSync('dist/index.html', html, 'utf8');
  console.log('Inserted hero-scrim in dist/index.html');
} else {
  console.log('Target not found in dist/index.html');
}
