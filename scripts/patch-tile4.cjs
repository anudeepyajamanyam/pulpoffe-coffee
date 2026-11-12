const fs = require('fs');
let html = fs.readFileSync('dist/index.html', 'utf8');

const oldTile4 = `<a class="tile t4" href="contact.html?type=b2b">
            <img class="tile-packshot" src="media/estate/estate-cherries-hands-1-1280.webp" alt="Harvest cherries" loading="lazy" style="object-fit:cover;border-radius:10px;box-shadow:0 8px 20px rgba(0,0,0,0.4)">
            <small>Commercial &amp; Bulk</small>
            <h3>For Business</h3>
            <span>Custom quote →</span>
          </a>`;

const newTile4 = `<a class="tile t4" href="contact.html?type=b2b">
            <img class="tile-packshot" src="media/products/b2b-bulk-suite.webp" alt="Pulpoffe commercial bulk and wholesale coffee range" loading="lazy">
            <small>Commercial &amp; Bulk</small>
            <h3>For Business</h3>
            <span>Custom quote →</span>
          </a>`;

if (html.includes(oldTile4)) {
  html = html.replace(oldTile4, newTile4);
  fs.writeFileSync('dist/index.html', html, 'utf8');
  console.log('Updated tile 4 in dist/index.html');
} else {
  // Fallback regex replacement
  html = html.replace(/<a class="tile t4"[\s\S]*?<\/a>/, newTile4);
  fs.writeFileSync('dist/index.html', html, 'utf8');
  console.log('Regex updated tile 4 in dist/index.html');
}
