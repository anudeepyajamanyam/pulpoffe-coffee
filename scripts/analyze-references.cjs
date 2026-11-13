const fs = require('fs');

async function analyze() {
  // Scrape Levista homepage text & structure
  const levistaRes = await fetch('https://levista.in/', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const levistaHtml = await levistaRes.text();
  
  // Extract key headlines, badges, features
  console.log('--- LEVISTA HEADLINES & BADGES ---');
  const levistaHeadings = levistaHtml.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi) || [];
  console.log(levistaHeadings.map(h => h.replace(/<[^>]+>/g, '').trim()).filter(Boolean).slice(0, 15));

  // Scrape Continental Coffee collection text & structure
  const contRes = await fetch('https://shop.continental.coffee/collections/instant', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const contHtml = await contRes.text();
  console.log('--- CONTINENTAL HEADLINES & BADGES ---');
  const contHeadings = contHtml.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi) || [];
  console.log(contHeadings.map(h => h.replace(/<[^>]+>/g, '').trim()).filter(Boolean).slice(0, 15));
}

analyze().catch(console.error);
