/* DOM simulation only; this is not a browser or a visual-layout test. */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../public/interactives/planner-skill');
let checks=0;
function check(fn){fn();checks++;}
const {Document}=require('./helpers/minidom.cjs');
const document=new Document();
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
document.innerHTML=html;
const context=vm.createContext({window:{},document,console});
for(const name of ['data.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),context,{filename:name});
const api=context.window.CapabilityAtlas,data=api.data,$=id=>document.getElementById(id);
const nodeEl=id=>document.querySelector(`[data-node="${id}"]`);
check(()=>{assert.equal(data.nodes.length,14);assert.equal(new Set(data.nodes.map(n=>n.id)).size,14);assert.equal(data.stages.length,5);assert.equal(Object.keys(data.sources).length,12);assert.equal(data.edges.length,25);});
check(()=>{assert.equal(document.querySelectorAll('[data-node]').length,14);assert.match($('node-detail').textContent,/能力契约/);assert.equal(api.state.node,'contract');});
check(()=>{const paths=document.querySelectorAll('path').map(p=>p.getAttribute('d')).filter(d=>d&&d.startsWith('M '));assert.equal(paths.length,new Set(paths).size,'Reciprocal graph edges must have distinct routes');});
for(const edge of data.edges)check(()=>{assert(data.nodes.some(n=>n.id===edge.from));assert(data.nodes.some(n=>n.id===edge.to));assert(edge.label.length>0);});
for(const node of data.nodes){check(()=>{nodeEl(node.id).click();assert.equal(api.state.node,node.id);assert.match($('node-detail').textContent,new RegExp(node.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));assert.equal($('node-detail').querySelectorAll('a').length,node.methods.length);assert(node.questions.length>=2);node.methods.forEach(m=>assert(data.sources[m]));assert.equal(nodeEl(node.id).getAttribute('aria-pressed'),'true');});}
for(const s of data.stages){check(()=>{document.querySelector(`[data-stage="${s.id}"]`).click();assert.equal(api.state.stage,s.id);assert.equal(api.state.node,s.selected);assert.match($('stage-brief').textContent,new RegExp(s.label));assert.equal($('stage-dependencies').querySelectorAll('[data-dependency]').length,3);for(const n of data.nodes){const className=nodeEl(n.id).getAttribute('class');assert.equal(className.includes('muted'),!s.focus.includes(n.id));}for(const d of s.dependencies){assert(s.focus.includes(d.id));assert.match($('stage-dependencies').textContent,new RegExp(d.level));}assert.equal(api.describeStage(s.id).dependencies.length,3);});}
check(()=>{document.querySelector('[data-stage="grasp"]').click();document.querySelector('[data-dependency="code"]').click();assert.equal(api.state.node,'code');assert.equal(api.state.stage,'grasp');assert.equal($('map').scrolled,true);});
check(()=>{document.querySelector('[data-stage="plan"]').click();assert($('stage-prev').disabled);$('stage-next').click();assert.equal(api.state.stage,'grasp');$('stage-prev').click();assert.equal(api.state.stage,'plan');document.querySelector('[data-stage="attribute"]').click();assert($('stage-next').disabled);});
check(()=>{assert(api.search('PPO').some(n=>n.id==='critic'));assert(api.search('可靠性').some(n=>n.id==='reliability'));assert(api.search('  vLa ').length>0);assert.equal(api.search('impossible-nomatch-7364').length,0);});
check(()=>{$('node-search').value='可靠性';$('node-search').dispatch('input');assert(!$('search-results').hidden);assert($('search-results').querySelectorAll('button').length>0);$('search-results').querySelector('button').click();assert.equal(api.state.node,'reliability');assert($('search-results').hidden);});
check(()=>{$('node-search').value='没有这样的节点xyz';$('node-search').dispatch('input');assert.match($('search-results').textContent,/没有找到/);$('node-search').value='<img src=x onerror=alert(1)>';$('node-search').dispatch('input');assert.equal($('search-results').querySelectorAll('img').length,0);});
check(()=>{$('node-search').value='Critic';$('node-search').dispatch('keydown',{key:'Enter'});assert.equal(api.state.node,'critic');assert($('search-results').hidden);});
check(()=>{nodeEl('credit').dispatch('keydown',{key:'Enter'});assert.equal(api.state.node,'credit');assert.equal(document.activeElement.getAttribute('data-node'),'credit');nodeEl('planner').dispatch('keydown',{key:' '});assert.equal(api.state.node,'planner');});
check(()=>{$('zoom-in').click();assert.equal(api.state.zoom,1.2);$('zoom-reset').click();assert.equal(api.state.zoom,1);api.setZoom(99);assert.equal(api.state.zoom,1.8);assert($('zoom-in').disabled);api.setZoom(-99);assert.equal(api.state.zoom,.8);assert($('zoom-out').disabled);});
for(const [trigger,title]of [['sources-open','文献索引'],['notes-open','把“兵不识将”变成实验问题'],['guide-open','一张图，看清协作的接口']])check(()=>{$(trigger).click();assert($('info-dialog').open);assert.match($('dialog-content').textContent,new RegExp(title));$('dialog-close').click();assert(!$('info-dialog').open);});
check(()=>{$('sources-open').click();const links=$('dialog-content').querySelectorAll('a');assert.equal(links.length,12);for(const a of links){assert(a.getAttribute('href').startsWith('https://'));assert.equal(a.getAttribute('rel'),'noopener noreferrer');}$('dialog-close').click();});
check(()=>{$('reset-focus').click();assert.equal(api.state.stage,null);assert.equal(api.state.node,'contract');assert.equal(api.state.zoom,1);assert.equal(document.querySelectorAll('[data-node]').filter(n=>n.getAttribute('class').includes('muted')).length,0);});
check(()=>{const prior=api.state.node;api.selectNode('missing');assert.equal(api.state.node,prior);api.selectStage('missing');assert.equal(api.state.stage,null);});
check(()=>{const scripts=document.querySelectorAll('script');assert.equal(scripts.length,4);for(const file of ['data.js','data-en.js','app.js','styles.css','paper.css','resize.js','embed.js'])assert(fs.existsSync(path.join(root,file)));for(const file of ['data.js','app.js']){const src=fs.readFileSync(path.join(root,file),'utf8');assert(!/fetch\(|XMLHttpRequest|sendBeacon|localStorage/.test(src));}});
console.log(JSON.stringify({status:'passed',checks,coverage:'14 node clicks, 5 stage flows, highlights, dependency navigation, search, keyboard, zoom, 3 dialogs, content graph and static assets',verification_limit:'DOM simulation; no browser visual QA'},null,2));
