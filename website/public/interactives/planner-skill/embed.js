(() => {
  const frames=[...document.querySelectorAll('[data-planner-skill-frame]')];
  if(!frames.length)return;
  window.addEventListener('message',event=>{
    if(event.origin!==window.location.origin||event.data?.type!=='planner-skill:height')return;
    const frame=frames.find(f=>f.contentWindow===event.source);
    if(!frame)return;
    const height=Number(event.data.height);
    if(Number.isFinite(height)&&height>=350&&height<=6000)frame.style.height=height+'px';
  });
})();
