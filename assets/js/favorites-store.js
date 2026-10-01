export const STORAGE_KEY='trains-dz-saved-v2';
const LEGACY_KEY='trains-dz-favorites',types=new Set(['station','route','timetable','trip']);
export const cleanEntries=value=>{const seen=new Set();return (Array.isArray(value)?value:[]).filter(x=>{if(!x||!types.has(x.type)||typeof x.id!=='string'||!x.id||x.id.length>300)return false;const key=x.type+':'+x.id;if(seen.has(key))return false;seen.add(key);return true}).map(x=>({type:x.type,id:x.id,name:typeof x.name==='string'?x.name.slice(0,500):x.id,savedAt:typeof x.savedAt==='string'?x.savedAt:''}))};
export function readFavorites(storage=localStorage){
 const raw=storage.getItem(STORAGE_KEY);if(raw!==null){try{return cleanEntries(JSON.parse(raw))}catch{throw Error('تعذر قراءة المفضلة المحفوظة على هذا الجهاز.')}}
 let old;try{old=JSON.parse(storage.getItem(LEGACY_KEY)||'[]')}catch{throw Error('تعذر قراءة المحطات المحفوظة سابقًا.')}
 const migrated=cleanEntries((Array.isArray(old)?old:[]).map(x=>({...x,type:'station'})));
 // The old key stays intact; only a successful write records migration.
 if(migrated.length)try{storage.setItem(STORAGE_KEY,JSON.stringify(migrated))}catch{}
 return migrated;
}
export function isSaved(type,id){return readFavorites().some(x=>x.type===type&&x.id===id)}
export function toggleFavorite(entry,storage=localStorage){if(!cleanEntries([entry]).length)throw Error('عنصر غير صالح للحفظ.');const current=readFavorites(storage),saved=current.some(x=>x.type===entry.type&&x.id===entry.id);const next=saved?current.filter(x=>x.type!==entry.type||x.id!==entry.id):[...current,{...entry,savedAt:new Date().toISOString()}];try{storage.setItem(STORAGE_KEY,JSON.stringify(cleanEntries(next)))}catch{throw Error('تعذر الحفظ على هذا الجهاز. تحقق من السماح بالتخزين المحلي.')};if(typeof window!=='undefined')window.dispatchEvent(new Event('favorites-change'));return !saved}
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function saveButton(type,id,name){return `<button type="button" class="save-toggle" data-save-type="${escape(type)}" data-save-id="${escape(id)}" data-save-name="${escape(name)}" aria-pressed="false">☆ حفظ في المفضلة</button>`}
