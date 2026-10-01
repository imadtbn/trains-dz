const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#site-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
nav?.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus()}});
for(const a of nav?.querySelectorAll('a')||[])if(new URL(a.href).pathname===location.pathname&&!new URL(a.href).hash)a.setAttribute('aria-current','page');
function onlineState(){document.querySelector('.offline-note').hidden=navigator.onLine}
window.addEventListener('online',onlineState);window.addEventListener('offline',onlineState);onlineState();
let installPrompt;const install=document.querySelector('.install-button');
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;install.hidden=false});
install?.addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;install.hidden=true});
window.addEventListener('appinstalled',()=>{install.hidden=true});
const root=new URL('../../',document.currentScript.src);
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register(new URL('service-worker.js',root)).catch(()=>{}));
const station=document.querySelector('#station');
if(station){
 const button=document.createElement('button');button.type='button';button.className='favorite-button';station.closest('.station-hero').prepend(button);
 const read=()=>{try{return JSON.parse(localStorage.getItem('trains-dz-favorites')||'[]')}catch{return []}};
 const update=()=>{const saved=read().some(s=>s.id===station.value);button.textContent=saved?'★ المحطة محفوظة':'☆ احفظ هذه المحطة';button.setAttribute('aria-pressed',String(saved));button.disabled=!station.value};
 button.addEventListener('click',()=>{const entries=read(),id=station.value;if(!id)return;const next=entries.some(s=>s.id===id)?entries.filter(s=>s.id!==id):[...entries,{id,name:station.selectedOptions[0].textContent}];try{localStorage.setItem('trains-dz-favorites',JSON.stringify(next));update()}catch{button.textContent='تعذر الحفظ على هذا الجهاز'}});
 station.addEventListener('change',update);document.addEventListener('rail-ready',()=>setTimeout(update,0));new MutationObserver(update).observe(document.querySelector('#selected-name'),{childList:true,subtree:true});update();
}
