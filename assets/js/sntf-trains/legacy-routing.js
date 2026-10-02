export function legacyDestination(href){
 const old=new URL(href),p=old.searchParams,h=old.hash;
 const task=h==='#panel-search'||h==='#journey-planner'?'search':h==='#panel-station'||h==='#station-board'?'station':h==='#panel-explore'?'map':p.has('station')?'station':p.has('route')||p.has('category')||p.has('line')||['#suburban','#eastern','#western','#sahara','#eastern-regional','#western-regional','#sahara-plateau-regional','#international'].includes(h)?'map':'search';
 const url=new URL('sntf-'+task+'.html',old);url.search=old.search;
 if(task==='map'&&!h.startsWith('#panel-'))url.hash=h;
 return url.href;
}
