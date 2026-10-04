const marker='assets/train-schedules/';
export function scheduleAssetKey(value){
 if(typeof value!=='string'||!value)return '';
 let text=value.trim().replace(/\\/g,'/');
 try{text=decodeURI(text)}catch{}
 const index=text.toLowerCase().indexOf(marker);
 if(index<0)return '';
 return text.slice(index).split(/[?#]/,1)[0].toLowerCase();
}
export function scheduleEntryFor(value,images=[]){
 const key=scheduleAssetKey(value);
 if(!key)return null;
 return images.find(item=>scheduleAssetKey(item.path)===key)||null;
}
export function scheduleViewerHref(value,images=[]){
 const entry=scheduleEntryFor(value,images);
 return entry?'sntf-schedule.html?'+new URLSearchParams({schedule:entry.id}).toString():'';
}
