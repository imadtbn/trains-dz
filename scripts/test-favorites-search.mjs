import assert from 'node:assert/strict';
import {normalizeStation,findStations,searchStationCatalog} from '../assets/js/station-search.js';
import {readFavorites,toggleFavorite,cleanEntries,STORAGE_KEY} from '../assets/js/favorites-store.js';
import {readFileSync} from 'node:fs';
const stations=JSON.parse(readFileSync('assets/data/sntf/stations.json')).stations;
assert.equal(normalizeStation('آغَا'),normalizeStation('اغا'));assert.equal(normalizeStation('Béjaïa'),normalizeStation('bejaia'));
assert(findStations(stations,'زرالدة').some(s=>s.id==='zeralda'));assert(findStations(stations,'agha').some(s=>s.id==='agha'));assert.equal(findStations(stations,'zzzz-no-station').length,0);
assert.equal(findStations(stations,'').length,0);
assert.equal(findStations(stations,'  ').length,0);
assert.equal(findStations(stations,'ا').length,8);
const memory=new Map([['trains-dz-favorites',JSON.stringify([{id:'agha',name:'آغا'},{id:'agha',name:'آغا'}])]]);
const storage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v)};
assert.equal(readFavorites(storage).length,1);assert.equal(readFavorites(storage)[0].type,'station');assert(memory.has('trains-dz-favorites'),'Keep old key intact');
assert.equal(toggleFavorite({type:'route',id:'agha',name:'مسار'},storage),true);assert.equal(readFavorites(storage).length,2,'Different item types may share an ID');
assert.equal(toggleFavorite({type:'route',id:'agha',name:'مسار'},storage),false);assert.equal(readFavorites(storage).length,1);
assert.equal(toggleFavorite({type:'station',id:'agha',name:'آغا'},storage),false);assert.equal(readFavorites(storage).length,0,'Empty new list must not resurrect migrated station');
assert.equal(cleanEntries([null,{id:'x',type:'unknown'},{id:'x',type:'trip'}]).length,1);
const before=JSON.stringify(readFavorites(storage));const blocked={getItem:storage.getItem,setItem(){throw Error('quota')}};assert.throws(()=>toggleFavorite({type:'trip',id:'train',name:'قطار'},blocked));assert.equal(JSON.stringify(readFavorites(storage)),before,'Failed writes must not delete favorites');
memory.set(STORAGE_KEY,'invalid json');assert.throws(()=>readFavorites(storage));assert.equal(memory.get(STORAGE_KEY),'invalid json','Corrupt data must not be overwritten');
const mo=stations.find(s=>s.id==='mohammadia');assert(mo);assert.equal(mo.lat,35.587998);assert.equal(mo.lon,0.062321);assert(stations.some(s=>s.id==='mohammadia2'));
console.log('Search/favorites PASS: Arabic/French search, migration, deduplication, remove, blocked storage, preserved Mohammadia coordinates.');

// Run the actual home module with loaded timetable data and capture picker catalogs.
const {default:vm}=await import('node:vm');
const {dayISO}=await import('../assets/js/sntf-trains/engine.js');
const homeNodes=new Map();
function homeNode(id){if(!homeNodes.has(id))homeNodes.set(id,{id,textContent:'',children:[],listeners:{},addEventListener(k,f){this.listeners[k]=f},replaceChildren(){this.children=[]},append(x){this.children.push(x)}});return homeNodes.get(id)}
const form=homeNode('#home-search');form.elements={date:{value:''}};form.querySelectorAll=()=>[];form.querySelector=()=>({disabled:true});
const pickerCatalogs=[];
const ctx={URL,dayISO,searchStationCatalog,readFavorites:()=>[],document:{querySelector:homeNode,createElement:()=>homeNode('created')},window:{addEventListener(){}},fetch:async url=>({ok:true,json:async()=>JSON.parse(readFileSync(new URL(url),'utf8'))}),stationPicker(container,catalog){pickerCatalogs.push(catalog);return {get:()=>catalog[0],set(){},validate:()=>true}}};
vm.createContext(ctx);
const home=readFileSync('assets/js/home.js','utf8').replace(/^import .*;\n/gm,'').replace('import.meta.url',JSON.stringify(new URL('../assets/js/home.js',import.meta.url).href));
await vm.runInContext('(async()=>{'+home+'})()',ctx);
assert.equal(pickerCatalogs.length,2,'Home initializes both station inputs');
for(const catalog of pickerCatalogs){
 assert.equal(catalog.length,new Set(stations.map(s=>s.id)).size,'Home offers every station, independent of timetable status');
 for(const query of ['تلمسان','Tlemcen','فرندة','Frenda'])assert(findStations(catalog,query).length,query+' is selectable even without published station times');
 assert.equal(findStations(catalog,'').length,0);assert.equal(findStations(catalog,'ا').length,8);
}
console.log('Home search PASS: all stations, unique options, Arabic/French names, empty input and eight suggestions.');
