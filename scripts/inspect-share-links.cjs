const https = require('https');

async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      redirect: 'follow'
    });
    console.log('=== URL:', url);
    console.log('Final URL:', res.url);
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Length:', text.length);
    const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) console.log('Title:', titleMatch[1]);
    const ogTitle = text.match(/<meta property="og:title" content="([^"]+)"/i);
    if (ogTitle) console.log('OG Title:', ogTitle[1]);
    const ogDesc = text.match(/<meta property="og:description" content="([^"]+)"/i);
    if (ogDesc) console.log('OG Desc:', ogDesc[1]);
    const ogImage = text.match(/<meta property="og:image" content="([^"]+)"/i);
    if (ogImage) console.log('OG Image:', ogImage[1]);
    
    // Check if there are drive / photo / site URLs inside text
    const urls = text.match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s"'>]*/g) || [];
    const interesting = urls.filter(u => !u.includes('google.com/search') && !u.includes('gstatic') && !u.includes('schema.org') && !u.includes('w3.org'));
    console.log('Interesting URLs sample:', interesting.slice(0, 10));
  } catch (err) {
    console.error('Error fetching', url, err.message);
  }
}

async function main() {
  await checkUrl('https://share.google/eKyWUC9MlsFgVKNPi');
  await checkUrl('https://share.google/4f9b19CLXEXPZf1tx');
}

main();
