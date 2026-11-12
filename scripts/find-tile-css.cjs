const fs = require('fs');
const content = fs.readFileSync('c:/Users/anude.LAPTOP-1NVIEN2E/Downloads/Pulpoffe – Homepage prototype v2.html', 'utf8');
const lines = content.split('\n');
lines.forEach(l => {
  if (l.includes('.tile') || l.includes('.t1') || l.includes('.t2') || l.includes('.t3') || l.includes('.t4')) {
    console.log(l);
  }
});
