import {dayISO} from './sntf-trains/engine.js';
const form=document.querySelector('#home-search'),status=document.querySelector('#home-status');
form.date.value=dayISO();
form.addEventListener('submit',e=>{if(form.from.value===form.to.value){e.preventDefault();status.textContent='اختر محطتي انطلاق ووصول مختلفتين.';form.to.focus()}});
document.querySelector('#home-swap').addEventListener('click',()=>{[form.from.value,form.to.value]=[form.to.value,form.from.value]});
try{
 const docs=await Promise.all(['stations','lines','trips'].map(async name=>{const r=await fetch(new URL('../data/sntf/'+name+'.json',import.meta.url),{cache:'no-cache'});if(!r.ok)throw Error('load');return r.json()}));
 const [stations,lines,trips]=docs;const active=trips.trips.filter(t=>['verified','source_transcribed'].includes(t.data_status));const ids=new Set(active.flatMap(t=>t.stop_times.filter(s=>s.arrival!=null||s.departure!=null).map(s=>s.station_id)));const sorted=stations.stations.filter(s=>ids.has(s.id)).toSorted((a,b)=>a.name.localeCompare(b.name,'ar'));
 for(const field of [form.from,form.to])field.replaceChildren(new Option('اختر المحطة',''),...sorted.map(s=>new Option(s.name+' · '+s.name_fr,s.id)));
 document.querySelector('#stat-stations').textContent=stations.stations.length;document.querySelector('#stat-lines').textContent=lines.lines.length;document.querySelector('#stat-trips').textContent=trips.trips.filter(t=>['verified','source_transcribed'].includes(t.data_status)).length;
 document.querySelector('#data-date').textContent='تاريخ تحديث ملف الرحلات: '+(trips.updated||'غير محدد');
 const root=document.querySelector('#favorites');let saved=[];try{saved=JSON.parse(localStorage.getItem('trains-dz-favorites')||'[]')}catch{}
 for(const item of saved){const found=stations.stations.find(s=>s.id===item.id);if(!found)continue;if(root.querySelector('p'))root.replaceChildren();const a=document.createElement('a');a.href='sectors/sntf-trains.html?station='+encodeURIComponent(found.id);a.textContent='★ '+found.name;root.append(a)}
}catch{status.textContent='تعذر تحميل البيانات. تحقق من اتصالك ثم أعد المحاولة.';for(const field of [form.from,form.to])field.replaceChildren(new Option('البيانات غير متاحة',''))}
