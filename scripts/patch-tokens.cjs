const fs = require('fs');
let css = fs.readFileSync('dist/brand/v2-tokens.css', 'utf8');

// Replace .hero and .hero:before styles
const oldHero = `.hero {
  position: relative !important;
  min-height: min(86vh, 720px) !important;
  display: flex !important;
  align-items: center !important;
  color: #FFFFFF !important;
  background: var(--brown) url('../media/estate/estate-hero-landscape-1280.webp') center/cover no-repeat !important;
}
.hero:before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  background: linear-gradient(90deg, rgba(32,20,12,0.88) 0%, rgba(32,20,12,0.6) 45%, rgba(32,20,12,0.05) 100%) !important;
}
.hero .w {
  position: relative !important;
  padding-top: 72px !important;
  padding-bottom: 72px !important;
  width: 100% !important;
}
.hero h1 {
  font-size: clamp(2.75rem, 6.2vw, 5.25rem) !important;
  max-width: 12ch !important;
  margin: 18px 0 !important;
  color: #FFFFFF !important;
}
.hero h1 em {
  font-style: normal !important;
  color: var(--honey-lt) !important;
}
.hero p {
  max-width: 46ch !important;
  font-size: 1.15rem !important;
  color: #EADFCB !important;
  margin: 0 0 30px !important;
}`;

const newHero = `.hero {
  position: relative !important;
  min-height: min(88vh, 740px) !important;
  display: flex !important;
  align-items: center !important;
  color: #FFFFFF !important;
  background: #180F09 url('../media/estate/estate-hero-landscape-1280.webp') center/cover no-repeat !important;
  overflow: hidden !important;
}
.hero:before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: 1 !important;
  pointer-events: none !important;
  background: linear-gradient(90deg, rgba(14,8,4,0.96) 0%, rgba(14,8,4,0.88) 38%, rgba(14,8,4,0.55) 65%, rgba(14,8,4,0.18) 100%) !important;
}
.hero .w {
  position: relative !important;
  z-index: 2 !important;
  padding-top: 76px !important;
  padding-bottom: 76px !important;
  width: 100% !important;
}
.hero h1 {
  font-size: clamp(2.75rem, 6.2vw, 5.25rem) !important;
  max-width: 13ch !important;
  margin: 18px 0 !important;
  color: #FFFFFF !important;
  text-shadow: 0 3px 18px rgba(0,0,0,0.7) !important;
}
.hero h1 em {
  font-style: normal !important;
  color: var(--honey-lt) !important;
  text-shadow: 0 2px 10px rgba(0,0,0,0.6) !important;
}
.hero p {
  max-width: 48ch !important;
  font-size: 1.18rem !important;
  line-height: 1.65 !important;
  color: #F0E6D5 !important;
  margin: 0 0 30px !important;
  text-shadow: 0 2px 12px rgba(0,0,0,0.7) !important;
}`;

css = css.replace(oldHero, newHero);

// Also check mobile hero:before
css = css.replace(
  '.hero:before { background: linear-gradient(0deg, rgba(32,20,12,0.92) 20%, rgba(32,20,12,0.35)) !important; }',
  '.hero:before { background: linear-gradient(0deg, rgba(14,8,4,0.96) 0%, rgba(14,8,4,0.82) 50%, rgba(14,8,4,0.25) 100%) !important; z-index: 1 !important; }'
);

// Update .band to use canopy photo background and rich green gradient
const oldBand = `.band {
  position: relative !important;
  overflow: hidden !important;
  color: #FFFFFF !important;
  background: var(--green) !important;
}`;
const newBand = `.band {
  position: relative !important;
  overflow: hidden !important;
  color: #FFFFFF !important;
  background: #053502 url('../media/estate/estate-canopy-1-1280.webp') center/cover no-repeat !important;
}
.band:before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  background: linear-gradient(135deg, rgba(5,53,2,0.9) 0%, rgba(5,53,2,0.78) 100%) !important;
  z-index: 1 !important;
}`;

css = css.replace(oldBand, newBand);

fs.writeFileSync('dist/brand/v2-tokens.css', css, 'utf8');
console.log('Successfully updated dist/brand/v2-tokens.css with enhanced hero scrim and process band!');
