// One initialization per manual unit, including repeat execution and tab changes.
(()=>{
 const units=[...document.querySelectorAll('.ad-container ins.adsbygoogle')];
 if(!units.length)return;
 let observer;
 function request(unit){
  if(unit.dataset.railAdRequested||unit.hasAttribute('data-adsbygoogle-status'))return true;
  if(!navigator.onLine||unit.getBoundingClientRect().width<100||!unit.getClientRects().length)return false;
  unit.dataset.railAdRequested='true';
  try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}
  catch{unit.closest('.ad-container').dataset.adState='unavailable';}
  return true;
 }
 function nearby(unit){const r=unit.getBoundingClientRect();return r.top<innerHeight+250&&r.bottom>-250;}
 function check(){units.forEach(unit=>{if(nearby(unit)&&request(unit))observer?.unobserve(unit)})}
 if('IntersectionObserver'in window){observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting&&request(entry.target))observer.unobserve(entry.target)},{rootMargin:'250px 0px'});units.forEach(unit=>observer.observe(unit));}
 else{window.addEventListener('scroll',check,{passive:true});check();}
 if('ResizeObserver'in window){const resize=new ResizeObserver(check);units.forEach(unit=>resize.observe(unit));}
 window.addEventListener('online',check);
})();
