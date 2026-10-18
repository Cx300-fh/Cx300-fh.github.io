/* DOM simulation only; this is not a browser or a visual-layout test. */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../public/interactives/planner-skill');
let checks=0;
function check(fn){fn();checks++;}
const decode=s=>s.replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
class Element{
  constructor(tag,doc){this.tagName=tag.toUpperCase();this.doc=doc;this.attrs={};this.children=[];this.parentElement=null;this.events={};this.style={};this.hidden=false;this.disabled=false;this.value='';this.open=false;this._text='';}
  setAttribute(k,v){this.attrs[k]=String(v);if(k==='id')this.doc.ids.set(v,this);if(k==='hidden')this.hidden=true;if(k==='disabled')this.disabled=true;}
  getAttribute(k){return this.attrs[k]??null;}
  get dataset(){return Object.fromEntries(Object.entries(this.attrs).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v]));}
  append(e){e.parentElement=this;this.children.push(e);}
  replaceChildren(...children){this.children=[];this._text='';children.forEach(c=>this.append(c));}
  set textContent(t){this._text=String(t);this.children=[];}
  get textContent(){return this._text+this.children.map(c=>c.textContent).join('');}
  set innerHTML(html){this.children=[];this._text='';const stack=[this],voids=new Set(['INPUT','BR','META','LINK','HR','IMG']);let m;const rx=/<\/?[a-zA-Z][^>]*>|[^<]+/g;while((m=rx.exec(html))){const token=m[0];if(token.startsWith('</')){if(stack.length>1)stack.pop();}else if(token.startsWith('<')){const tag=token.match(/^<([\w-]+)/)?.[1];if(!tag)continue;const el=new Element(tag,this.doc);const attrRx=/([\w:-]+)(?:="([^"]*)"|='([^']*)'|=([^\s>]+))?/g;const attrText=token.slice(tag.length+1,-1);let a;while((a=attrRx.exec(attrText)))el.setAttribute(a[1],decode(a[2]??a[3]??a[4]??''));stack.at(-1).append(el);if(!voids.has(el.tagName)&&!token.endsWith('/>'))stack.push(el);}else{stack.at(-1)._text+=decode(token);}}}
  matches(selector){if(selector.startsWith('.'))return (this.attrs.class||'').split(/\s+/).includes(selector.slice(1));const m=selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);if(m)return m[1]in this.attrs&&(m[2]===undefined||this.attrs[m[1]]===m[2]);return this.tagName===selector.toUpperCase();}
  querySelectorAll(selector){const results=[];for(const c of this.children){if(c.matches(selector))results.push(c);results.push(...c.querySelectorAll(selector));}return results;}
  querySelector(s){return this.querySelectorAll(s)[0]||null;}
  closest(s){return this.matches(s)?this:this.parentElement?.closest(s)||null;}
  addEventListener(t,f){(this.events[t]??=[]).push(f);}
  dispatch(t,extras={}){const e={target:this,key:'',preventDefault(){this.prevented=true;},...extras};(this.events[t]||[]).forEach(f=>f(e));return e;}
  click(){if(!this.disabled)this.dispatch('click');}
  focus(){this.doc.activeElement=this;}
  scrollIntoView(){this.scrolled=true;}
  showModal(){this.open=true;}
  close(){this.open=false;}
  getBoundingClientRect(){return {left:0,right:1000,top:0,bottom:1000};}
}
class Document extends Element{
  constructor(){super('document',null);this.doc=this;this.ids=new Map();this.activeElement=null;}
  getElementById(id){return this.ids.get(id)||null;}
  createElementNS(ns,tag){return new Element(tag,this);}
}
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
check(()=>{const scripts=document.querySelectorAll('script');assert.equal(scripts.length,3);for(const file of ['data.js','app.js','styles.css','paper.css','resize.js','embed.js'])assert(fs.existsSync(path.join(root,file)));for(const file of ['data.js','app.js']){const src=fs.readFileSync(path.join(root,file),'utf8');assert(!/fetch\(|XMLHttpRequest|sendBeacon|localStorage/.test(src));}});
console.log(JSON.stringify({status:'passed',checks,coverage:'14 node clicks, 5 stage flows, highlights, dependency navigation, search, keyboard, zoom, 3 dialogs, content graph and static assets',verification_limit:'DOM simulation; no browser visual QA'},null,2));
