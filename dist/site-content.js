(async()=>{
  let response=await fetch('/api/site-content').catch(()=>null);if(!response||!response.ok){response=await fetch('/api/site-content.json').catch(()=>null);}
  if(!response.ok)return;
  const data=await response.json();
  const headline=document.querySelector('#film-phase-a h1');
  if(headline){
    headline.replaceChildren();
    const lines=data.headline.split('\n');
    lines.forEach((line,index)=>{
      if(index)headline.append(document.createElement('br'));
      const piece=document.createElement(index===lines.length-1?'em':'span');
      piece.textContent=line;headline.append(piece);
    });
    document.querySelector('.film-description').textContent=data.intro;
    if(data.storyTitle!=='Every great cup has deep roots.')document.querySelector('.story-copy h2').textContent=data.storyTitle;
    document.querySelector('.story-copy .gold-rule + p').textContent=data.story;
  }
  const footer=document.querySelector('.footer-top>div:last-child');
  if(footer)for(const [key,label] of Object.entries({instagram:'Instagram',facebook:'Facebook',linkedin:'LinkedIn',youtube:'YouTube'})){
    if(!data[key])continue;
    const link=document.createElement('a');link.href=data[key];link.textContent=label;footer.append(link);
  }
})().catch(()=>{});

