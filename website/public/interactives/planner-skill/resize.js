(() => {
  let pending=false;
  const report=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;if(window.parent!==window)window.parent.postMessage({type:'planner-skill:height',height:Math.ceil(document.getElementById('main').getBoundingClientRect().height)+4},window.location.origin);});};
  if('ResizeObserver' in window)new ResizeObserver(report).observe(document.getElementById('main'));
  window.addEventListener('load',report);window.addEventListener('resize',report);report();
})();
