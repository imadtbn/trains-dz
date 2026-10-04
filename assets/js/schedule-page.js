const root=new URL('../../',import.meta.url);
const categoryLabels={suburban:'ضاحية الجزائر',eastern:'الجهة الشرقية',western:'الجهة الغربية',sahara:'الصحراء والهضاب',international:'الخط الدولي'};
const params=new URL(location.href).searchParams;
const requested=params.get('schedule')||params.get('id')||'alger-thenia-suburban';
const els={
 title:document.querySelector('#schedule-title'),category:document.querySelector('#schedule-category'),summary:document.querySelector('#schedule-summary'),crumb:document.querySelector('#breadcrumb-title'),
 metaRoute:document.querySelector('#meta-route'),metaCategory:document.querySelector('#meta-category'),metaSource:document.querySelector('#meta-source'),art:document.querySelector('#hero-art-label'),
 image:document.querySelector('#schedule-image'),loading:document.querySelector('#schedule-loading'),canvas:document.querySelector('#schedule-canvas'),level:document.querySelector('#zoom-level'),
 original:document.querySelector('#open-original'),explore:document.querySelector('#explore-route'),note:document.querySelector('#schedule-note-text'),
 canonical:document.querySelector('#schedule-canonical'),ogTitle:document.querySelector('#schedule-og-title'),ogDesc:document.querySelector('#schedule-og-description'),ogUrl:document.querySelector('#schedule-og-url'),ogImage:document.querySelector('#schedule-og-image'),
 schema:document.querySelector('#schedule-schema'),fullDialog:document.querySelector('#fullscreen-dialog'),fullImage:document.querySelector('#fullscreen-image'),fullTitle:document.querySelector('#fullscreen-title')
};
let scale=1;
const clamp=n=>Math.min(3,Math.max(.65,n));
function setZoom(value,anchor=true){scale=clamp(value);els.image.style.width=(scale*100)+'%';els.level.value=Math.round(scale*100)+'%';if(anchor){els.canvas.scrollTo({left:Math.max(0,(els.canvas.scrollWidth-els.canvas.clientWidth)/2),behavior:'smooth'})}}
function setMeta(item){
 const category=categoryLabels[item.category]||'جدول مصور';
 const pageTitle='جدول قطارات '+item.alt+' | قطارات الجزائر';
 const description='عرض جدول قطارات '+item.alt+' المصور بوضوح مع أدوات التكبير وملء الشاشة داخل منصة قطارات الجزائر.';
 const pageUrl='https://imadtbn.github.io/trains-dz/sectors/sntf-schedule.html?schedule='+encodeURIComponent(item.id);
 const imageUrl=new URL(item.path,root).href;
 document.title=pageTitle; els.title.textContent='جدول '+item.alt; els.category.textContent=category; els.crumb.textContent=item.alt; els.metaRoute.textContent=item.alt; els.metaCategory.textContent=category; els.metaSource.textContent=item.issuing_authority||'SNTF';els.art.textContent=item.alt;
 els.summary.textContent='راجع الجدول المصور لمسار '+item.alt+' بوضوح، مع إمكانية التكبير والعرض بملء الشاشة.';
 els.note.textContent=item.notes||'المواقيت المعروضة مأخوذة من الجدول المصور المدرج في المنصة. راجع أيام التشغيل وأي تحديثات استثنائية قبل السفر.';
 els.canonical.href=pageUrl;els.ogTitle.content=pageTitle;els.ogDesc.content=description;els.ogUrl.content=pageUrl;els.ogImage.content=imageUrl;
 const metaDescription=document.querySelector('meta[name=description]');if(metaDescription)metaDescription.content=description;
 const shareUrl=document.querySelector('#share-url');if(shareUrl)shareUrl.value=pageUrl;
 els.image.src=imageUrl;els.image.alt='جدول قطارات '+item.alt;els.original.href=imageUrl;els.fullImage.src=imageUrl;els.fullImage.alt=els.image.alt;els.fullTitle.textContent='جدول '+item.alt;
 if(item.route_ids?.[0])els.explore.href='sntf-map.html?'+new URLSearchParams({route:item.route_ids[0]});else els.explore.href='sntf-map.html?'+new URLSearchParams({category:item.category});
 els.schema.textContent=JSON.stringify({'@context':'https://schema.org','@graph':[
  {'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'الرئيسية','item':'https://imadtbn.github.io/trains-dz/'},{'@type':'ListItem','position':2,'name':'الجداول والخدمات','item':'https://imadtbn.github.io/trains-dz/sectors/sntf.html'},{'@type':'ListItem','position':3,'name':item.alt,'item':pageUrl}]},
  {'@type':'ImageObject','name':'جدول قطارات '+item.alt,'contentUrl':imageUrl,'url':imageUrl,'creditText':item.issuing_authority||'SNTF'},
  {'@type':'WebPage','url':pageUrl,'name':pageTitle,'description':description,'inLanguage':'ar-DZ','isAccessibleForFree':true}
 ]});
}
function showError(message){els.loading.className='schedule-error';els.loading.textContent=message;els.image.hidden=true;document.querySelector('.schedule-tools').hidden=true;document.querySelector('.schedule-actions').hidden=true}
document.querySelector('#zoom-in').addEventListener('click',()=>setZoom(scale+.25));
document.querySelector('#zoom-out').addEventListener('click',()=>setZoom(scale-.25));
document.querySelector('#zoom-reset').addEventListener('click',()=>{setZoom(1,false);els.canvas.scrollTo({top:0,left:0,behavior:'smooth'})});
els.canvas.addEventListener('dblclick',()=>setZoom(scale>1?1:1.75));
els.canvas.addEventListener('wheel',e=>{if(!e.ctrlKey)return;e.preventDefault();setZoom(scale+(e.deltaY<0?.15:-.15))},{passive:false});
document.querySelector('#open-fullscreen').addEventListener('click',()=>els.fullDialog.showModal());
document.querySelector('#fullscreen-close').addEventListener('click',()=>els.fullDialog.close());
els.fullDialog.addEventListener('click',e=>{if(e.target===els.fullDialog)els.fullDialog.close()});
els.image.addEventListener('load',()=>{els.loading.hidden=true;els.image.hidden=false;setZoom(1,false)});
els.image.addEventListener('error',()=>showError('تعذر تحميل صورة الجدول. تحقق من الاتصال ثم أعد المحاولة.'));
try{
 const response=await fetch(new URL('assets/data/sntf/gallery-index.json',root),{cache:'no-cache'});if(!response.ok)throw Error('load');
 const data=await response.json();const item=data.images.find(entry=>entry.id===requested);
 if(!item){showError('هذا الجدول غير موجود في قاعدة الجداول.');}else setMeta(item);
}catch{showError('تعذر تحميل بيانات الجداول. تحقق من الاتصال ثم أعد المحاولة.')}
