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

module.exports={Document};
