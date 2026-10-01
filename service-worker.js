const CACHE='trains-dz-v3';
const ROOT=new URL('./',self.location.href);
const CORE=['index.html','about.html','sectors/sntf-trains.html','sectors/sntf-trip.html','sectors/sntf.html','assets/css/site.css','assets/css/sntf-trains.css','assets/css/sntf-trip.css','assets/js/share.js','assets/js/ads.js','assets/js/site.js','assets/js/home.js','assets/js/gallery.js','assets/js/sntf-trains/app.js','assets/js/sntf-trains/engine.js','assets/js/sntf-trains/network.js','assets/js/sntf-trains/planner.js','assets/js/sntf-trains/trip-page.js','assets/images/icon.svg','assets/images/apple-touch-icon.png','assets/images/favicon-32.png','assets/images/favicon-16.png','favicon.ico','manifest.json'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE.map(p=>new URL(p,ROOT).href))));self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('trains-dz-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==ROOT.origin||!url.pathname.startsWith(ROOT.pathname))return;
 const path=url.pathname.slice(ROOT.pathname.length);
 if(!path.startsWith('assets/data/sntf/')&&!CORE.includes(path)&&path!=='')return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(event.request);if(response.ok)await cache.put(event.request,response.clone());return response}catch{const saved=await cache.match(event.request)||await cache.match(new URL(path||'index.html',ROOT).href);return saved||new Response('البيانات غير محفوظة. اتصل بالإنترنت لتحميلها.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}})}})());
});
