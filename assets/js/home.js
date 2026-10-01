import {dayISO} from './sntf-trains/engine.js';
import {stationPicker} from './station-search.js?v=20261001-search8';
import {readFavorites} from './favorites-store.js?v=20261001-favorites';
const form=document.querySelector('#home-search'),status=document.querySelector('#home-status');let from,to;
form.elements.date.value=dayISO();
form.addEventListener('submit',e=>{if(!from||!to||!from.validate()||!to.validate()){e.preventDefault();return}if(from.get()?.id===to.get()?.id){e.preventDefault();status.textContent='اختر محطتي انطلاق ووصول مختلفتين.';document.querySelector('#home-to-query').focus()}});
document.querySelector('#home-swap').addEventListener('click',()=>{if(!from||!to)return;const a=from.get(),b=to.get();from.set(b);to.set(a);status.textContent='تم تبديل محطتي الانطلاق والوصول.'});
try{
 const docs=await Promise.all(['stations','lines','trips'].map(async name=>{const r=await fetch(new URL('../data/sntf/'+name+'.json',import.meta.url),{cache:'no-cache'});if(!r.ok)throw Error('load');return r.json()}));
 const [stations,lines,trips]=docs,active=trips.trips.filter(t=>['verified','source_transcribed'].includes(t.data_status));const ids=new Set(active.flatMap(t=>t.stop_times.filter(s=>s.arrival!=null||s.departure!=null).map(s=>s.station_id))),sorted=stations.stations.filter(s=>ids.has(s.id));
 from=stationPicker(document.querySelector('#home-origin'),sorted);to=stationPicker(document.querySelector('#home-destination'),sorted);
 form.querySelectorAll('[role=combobox]').forEach(input=>{input.disabled=false;input.placeholder='اكتب اسم المحطة…'});form.querySelector('button[type=submit]').disabled=false;
 document.querySelector('#stat-stations').textContent=stations.stations.length;document.querySelector('#stat-lines').textContent=lines.lines.length;document.querySelector('#stat-trips').textContent=active.length;
 document.querySelector('#data-date').textContent='تاريخ تحديث ملف الرحلات: '+(trips.updated||'غير محدد');
 function renderFavorites(){const root=document.querySelector('#favorites');root.replaceChildren();try{const saved=readFavorites().filter(x=>x.type==='station');for(const item of saved.slice(0,6)){const found=stations.stations.find(s=>s.id===item.id);if(!found)continue;const a=document.createElement('a');a.href='sectors/sntf-trains.html?station='+encodeURIComponent(found.id);a.textContent='★ '+found.name;root.append(a)}if(!root.childElementCount){const message=document.createElement('p');message.className='minor';message.textContent='احفظ محطتك من لوحة المحطة للوصول إليها سريعًا هنا.';root.append(message)}}catch(error){root.textContent=error.message}}
 renderFavorites();window.addEventListener('favorites-change',renderFavorites);window.addEventListener('storage',renderFavorites);
}catch{status.textContent='تعذر تحميل البيانات. تحقق من اتصالك ثم أعد المحاولة.';form.querySelectorAll('[role=combobox]').forEach(input=>input.placeholder='البيانات غير متاحة');}
