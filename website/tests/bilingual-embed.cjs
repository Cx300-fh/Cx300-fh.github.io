const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const assert=require('node:assert/strict');const {Document}=require('./helpers/minidom.cjs');
const document=new Document();document.innerHTML='<iframe data-planner-skill-frame="true"></iframe><iframe data-planner-skill-frame="true"></iframe>';
const frames=document.querySelectorAll('iframe');frames.forEach(f=>f.contentWindow={});let handler;
const window={location:{origin:'https://cx300-fh.github.io'},addEventListener:(event,fn)=>{if(event==='message')handler=fn;}};
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname,'../public/interactives/planner-skill/embed.js'),'utf8'),{window,document,console});
function send(frame,height,origin=window.location.origin){handler({origin,source:frame.contentWindow,data:{type:'planner-skill:height',height}});}
send(frames[0],1200);assert.equal(frames[0].style.height,'1200px');assert.equal(frames[1].style.height,undefined);
send(frames[1],1600);assert.equal(frames[1].style.height,'1600px');assert.equal(frames[0].style.height,'1200px');
send(frames[1],2000,'https://unrelated.example');assert.equal(frames[1].style.height,'1600px');
send(frames[0],90000);assert.equal(frames[0].style.height,'1200px');
handler({origin:window.location.origin,source:{},data:{type:'planner-skill:height',height:1300}});assert.equal(frames[0].style.height,'1200px');
const css=fs.readFileSync(path.resolve(__dirname,'../app/blog/reasoning-to-muscle-memory/essay.css'),'utf8');assert(css.includes('.lang-input:checked~.chinese{display:none}'));assert(css.includes('.lang-input:checked~.english{display:block}'));
console.log(JSON.stringify({status:'passed',checks:9,coverage:'Independent iframe sizing, origin/source validation, height bounds, and shared CSS language switch'},null,2));
