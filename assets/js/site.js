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

// Keep Algeria time visible independently of railway data loading.
const clockTime=document.getElementById('clock'),clockDate=document.getElementById('date-label');
if(clockTime&&clockDate){
 const timeFormat=new Intl.DateTimeFormat('ar-DZ-u-nu-latn',{timeZone:'Africa/Algiers',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
 const dateFormat=new Intl.DateTimeFormat('ar-DZ',{timeZone:'Africa/Algiers',dateStyle:'full'});
 function updateAlgeriaClock(){const now=new Date();clockTime.textContent=timeFormat.format(now);clockDate.textContent=dateFormat.format(now)}
 updateAlgeriaClock();setInterval(updateAlgeriaClock,1000);
}
