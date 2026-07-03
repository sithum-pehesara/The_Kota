fetch('https://brmclothing.store/').then(r=>r.text()).then(t=>{
  const regex = /<img[^>]*src="([^"]+)"/g;
  let match;
  while ((match = regex.exec(t)) !== null) {
    console.log(match[1]);
  }
}).catch(console.error);
