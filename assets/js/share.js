(()=>{
 const dialog=document.querySelector('#share-dialog');if(!dialog)return;
 const url='https://imadtbn.github.io/trains-dz/',title='قطارات الجزائر | Trains DZ',text='خطط رحلتك بالقطار، وتصفح لوحة المحطات والجداول المصورة.';
 const u=encodeURIComponent(url),t=encodeURIComponent(title+' — '+text);
 const links={whatsapp:'https://wa.me/?text='+t+'%20'+u,facebook:'https://www.facebook.com/sharer/sharer.php?u='+u,telegram:'https://t.me/share/url?url='+u+'&text='+t,x:'https://twitter.com/intent/tweet?url='+u+'&text='+t,linkedin:'https://www.linkedin.com/sharing/share-offsite/?url='+u};
 dialog.querySelectorAll('[data-share]').forEach(a=>a.href=links[a.dataset.share]);
 const status=document.querySelector('#share-status-site'),input=document.querySelector('#share-url');
 document.querySelector('.share-open').addEventListener('click',()=>{status.textContent='';dialog.showModal()});
 document.querySelector('#share-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
 const native=document.querySelector('#share-native');native.hidden=!navigator.share;
 native.addEventListener('click',async()=>{try{await navigator.share({title,text,url});status.textContent='تم فتح مشاركة الموقع.'}catch(e){if(e.name!=='AbortError')status.textContent='تعذرت المشاركة؛ اختر منصة أو انسخ الرابط.'}});
 document.querySelector('#share-copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(url);status.textContent='تم نسخ الرابط ✓'}catch{input.focus();input.select();status.textContent='حدد الرابط وانسخه من الحقل أدناه.'}});
})();
