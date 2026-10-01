import assert from 'node:assert/strict';import {readFileSync,existsSync,readdirSync} from 'node:fs';import {resolve,dirname,join} from 'node:path';
const json=n=>JSON.parse(readFileSync('assets/data/sntf/'+n+'.json'));
const stations=json('stations').stations;assert.equal(new Set(stations.map(s=>s.id)).size,stations.length);
for(const image of json('gallery-index').images)assert(existsSync(image.path),'Missing gallery image '+image.path);
for(const route of json('routes').routes)if(route.schedule_image)assert(existsSync(resolve('sectors',route.schedule_image)),'Missing route image '+route.id);
for(const page of ['index.html','about.html','404.html','sectors/sntf-trains.html','sectors/sntf-trip.html','sectors/sntf.html']){
 const html=readFileSync(page,'utf8');const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'Duplicate IDs '+page);
 for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)){const url=m[1].split(/[?#]/)[0];if(!url||/^(https?:|data:|\/|mailto:)/.test(url))continue;assert(existsSync(resolve(dirname(page),url)),'Broken local URL '+page+' -> '+url)}
}
const app=readFileSync('assets/js/sntf-trains/app.js','utf8'),html=readFileSync('sectors/sntf-trains.html','utf8');for(const m of app.matchAll(/\$\("([^"+]+)"\)/g))assert(html.includes('id="'+m[1]+'"'),'Missing application element '+m[1]);
console.log('Portability PASS: gallery images, route sources, unique IDs, local links, application DOM.');
