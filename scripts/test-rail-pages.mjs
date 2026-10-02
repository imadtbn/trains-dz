import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as engine from '../assets/js/sntf-trains/engine.js';
import * as network from '../assets/js/sntf-trains/network.js';
import {planJourney} from '../assets/js/sntf-trains/planner.js';
import {stationPicker} from '../assets/js/station-search.js';
import {saveButton} from '../assets/js/favorites-store.js';
import {legacyDestination} from '../assets/js/sntf-trains/legacy-routing.js';
const base='https://imadtbn.github.io/trains-dz/sectors/';
for(const [suffix,target] of [['#panel-station','sntf-station.html'],['?station=agha','sntf-station.html?station=agha'],['?from=agha&to=zeralda#panel-search','sntf-search.html?from=agha&to=zeralda'],['?route=alger-thenia#panel-explore','sntf-map.html?route=alger-thenia'],['?category=eastern','sntf-map.html?category=eastern']])assert.equal(legacyDestination(base+'sntf-trains.html'+suffix),base+target);
const runtime=readFileSync('assets/js/sntf-trains/rail-runtime.js','utf8').replace(/^import .*;\n/gm,'').replace('export function','function');
// Only IDs actually present in each page are available. Missing-section accesses fail.
async function smoke(mode,query=''){
 const file={search:'search',station:'station',explore:'map'}[mode],html=readFileSync('sectors/sntf-'+file+'.html','utf8');
 assert.equal((html.match(/class="task-panel"/g)||[]).length,1);
 assert(html.includes('id="panel-'+mode+'"'));
 const errors=[],nodes=new Map();
 class Element{
  constructor(){this.value='';this.children=[];this.dataset={};this.hidden=false;this.textContent='';this.innerHTML='';this.attrs={};this.classList={add(){},remove(){},toggle(){}};this.listeners={}}
  setAttribute(k,v){this.attrs[k]=v} removeAttribute(k){delete this.attrs[k]} addEventListener(k,f){this.listeners[k]=f} replaceChildren(...x){this.children=x} append(...x){this.children.push(...x)} focus(){} scrollIntoView(){} setCustomValidity(){} reportValidity(){} querySelectorAll(){return []} querySelector(){return null}
 }
 for(const [,id] of html.matchAll(/\bid="([^"]+)"/g))nodes.set(id,new Element());
 for(const [container,input,value,list,note] of [['journey-origin','journey-from-search','journey-from','journey-from-options','journey-from-count'],['journey-destination','journey-to-search','journey-to','journey-to-options','journey-to-count'],['board-picker','station-search-board','station','board-options','station-search-board-count'],['map-picker','station-search','map-station','station-results','map-search-count']])if(nodes.has(container))nodes.get(container).querySelector=q=>nodes.get({'[role=combobox]':input,'input[type=hidden]':value,'[role=listbox]':list,'[role=status]':note}[q]);
 const document={getElementById:id=>nodes.get(id)||null,querySelectorAll:()=>[],addEventListener(){},dispatchEvent(){},createElement:()=>new Element(),body:new Element(),head:new Element()};
 const chain={addTo(){return this},bindPopup(){return this},on(){return this},remove(){},setView(){return this},fitBounds(){},getZoom(){return 8},invalidateSize(){},openPopup(){}};
 let geoRequests=0;const nav={geolocation:{getCurrentPosition(ok,fail){geoRequests++;fail({code:1})}}};
 const ctx={...engine,...network,planJourney,stationPicker,saveButton,document,navigator:nav,URL,URLSearchParams,Intl,Date,Map,Set,Option:class extends Element{constructor(t,v){super();this.textContent=t;this.value=v}},CustomEvent:class{},setInterval(){},setTimeout,console:{error(...x){errors.push(x)},warn(...x){errors.push(x)}},location:{href:base+'sntf-'+file+'.html'+query,hash:'',assign(){}},localStorage:{getItem(){return null},setItem(){}},fetch:async url=>({ok:true,json:async()=>JSON.parse(readFileSync(new URL(url),'utf8'))})};
 ctx.window={matchMedia:()=>({matches:false,addEventListener(){}}),addEventListener(){},history:{replaceState(){}},L:{map:()=>Object.create(chain),tileLayer:()=>Object.create(chain),circleMarker:()=>Object.create(chain)}};
 // Production module resolves data relative to itself; replace only that module URL for Node's VM.
 vm.createContext(ctx);vm.runInContext(runtime.replace('import.meta.url',JSON.stringify(new URL('../assets/js/sntf-trains/rail-runtime.js',import.meta.url).href)),ctx);
 await ctx.startRailPage(mode);
 assert.deepEqual(errors,[],mode+' must initialize without accesses to absent panels');
 assert.equal(geoRequests,0,'Location permission must not be requested on load');
 if(mode==='station'){
  assert.equal(nodes.get('station').value,query?'agha':'','No implicit station');
  if(!query){assert(nodes.get('departures').innerHTML.includes('اختر محطة'));nodes.get('locate-board').listeners.click();assert.equal(geoRequests,1);assert(nodes.get('board-location-status').textContent.includes('لم يُمنح'));assert.equal(nodes.get('station').value,'');nav.geolocation.getCurrentPosition=ok=>ok({coords:{latitude:36.7621,longitude:3.0555}});nodes.get('locate-board').listeners.click();assert(nodes.get('station').value);assert(nodes.get('board-location-status').textContent.includes('أقرب محطة وفق المسافة المباشرة'));}
 }
 if(mode==='search'&&query)assert(nodes.get('journey-results').innerHTML.includes('رحلة مباشرة'));
 if(mode==='explore')assert(nodes.get('route-catalog').innerHTML.includes('استعرض المسار'));
}
await smoke('search','?from=agha&to=zeralda&date=2026-10-01');await smoke('station');await smoke('station','?station=agha');await smoke('explore');await smoke('explore','?route=alger-thenia');await smoke('explore','?station=agha');
console.log('Rail pages PASS: isolated initialization, legacy routing, direct search, empty station, explicit station and denied location.');
