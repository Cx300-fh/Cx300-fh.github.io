(() => {
  const frame=document.querySelector('[data-planner-skill-frame]');
  if(!frame)return;
  window.addEventListener('message',event=>{
    if(event.origin!==window.location.origin||event.source!==frame.contentWindow||event.data?.type!=='planner-skill:height')return;
    const height=Number(event.data.height);
    if(Number.isFinite(height)&&height>=350&&height<=6000)frame.style.height=height+'px';
  });
})();
