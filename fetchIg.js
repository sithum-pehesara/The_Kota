const fetch = require('node-fetch') || globalThis.fetch;
fetch('https://corsproxy.io/?https://www.picuki.com/profile/brm.clothing')
  .then(r => r.text())
  .then(html => {
    const regex = /<img[^>]*src="([^"]+)"/g;
    let match;
    const images = [];
    while ((match = regex.exec(html)) !== null) {
      if (match[1].includes('scontent') || match[1].includes('picuki')) {
        images.push(match[1]);
      }
    }
    console.log(images.slice(0, 3));
  })
  .catch(console.error);
