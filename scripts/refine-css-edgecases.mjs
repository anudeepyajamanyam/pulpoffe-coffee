import { readFileSync, writeFileSync } from 'node:fs';

// Hero real: fix location chip and peek card
let hero = readFileSync('dist/hero-real.css', 'utf8');
hero = hero.replace(/\.hero-location-chip span\s*\{\s*font-size:\s*8\.5px;/g, '.hero-location-chip span {\n  font-size: 12px;');
hero = hero.replace(/\.hero-peek-card span\s*\{([^}]*?)font-size:\s*7px;/g, '.hero-peek-card span {$1font-size: 12px;');
writeFileSync('dist/hero-real.css', hero, 'utf8');

// Experience: fix timeline text
let exp = readFileSync('dist/experience.css', 'utf8');
exp = exp.replace(/font-size:8px;line-height:1\.3/g, 'font-size:12px;line-height:1.4');
writeFileSync('dist/experience.css', exp, 'utf8');

// Dashboard: fix image-editor inputs and p
let dash = readFileSync('dist/dashboard.css', 'utf8');
dash = dash.replace(/\.image-editor input\{max-width:100%;font-size:11px\}/g, '.image-editor input{max-width:100%;font-size:13px}');
dash = dash.replace(/\.image-editor p\{font-size:11px;margin:0\}/g, '.image-editor p{font-size:13px;margin:0}');
dash = dash.replace(/min-height:44px;/g, 'min-height:48px;');
writeFileSync('dist/dashboard.css', dash, 'utf8');

console.log('Fixed remaining CSS edge cases');
