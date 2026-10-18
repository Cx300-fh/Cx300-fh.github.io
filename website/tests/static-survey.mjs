import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('dist/client');
const post=await readFile(resolve(root,'blog/planner-skill-alignment/index.html'),'utf8');
const map=await readFile(resolve(root,'interactives/planner-skill/index.html'),'utf8');
let checks=0;
const check=fn=>{fn();checks++;};
check(()=>assert(post.includes('Planner 与 Skill：从分层执行到能力对齐')));
check(()=>assert(post.includes('https://cx300-fh.github.io/blog/planner-skill-alignment/')));
check(()=>assert.equal((post.match(/id="ref-\d+"/g)||[]).length,18));
for(const id of ['problem','lineage','alignment','capability-map','architecture','credit','evidence','agenda'])check(()=>{assert(post.includes(`id="${id}"`));assert(post.includes(`href="#${id}"`));});
check(()=>assert.equal((post.match(/<h1\b/g)||[]).length,1));
check(()=>assert.equal((post.match(/data-planner-skill-frame/g)||[]).length,1));
check(()=>assert(post.includes('src="../../interactives/planner-skill/embed.js"')));
check(()=>assert(!post.includes('vinext-client')));
check(()=>assert(map.includes('src="./data.js"')&&map.includes('src="./app.js"')&&map.includes('src="./resize.js"')));
check(()=>assert(!map.includes('私人研究空间')&&!map.includes('私有')));
check(()=>assert(!post.includes('pastelsong512')&&!map.includes('pastelsong512')));
check(()=>assert(!/<script[^>]*src="[^\"]*(?:chunks|client-entry)/.test(post)));
for(const n of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18])check(()=>assert(post.includes(`href="#ref-${n}"`)));
for(const [file,text]of [['blog/planner-skill-alignment/index.html',post],['interactives/planner-skill/index.html',map]]){
  const ids=[...text.matchAll(/\bid="([^\"]+)"/g)].map(m=>m[1]);
  check(()=>assert.equal(ids.length,new Set(ids).size,`duplicate IDs in ${file}`));
  for(const m of text.matchAll(/\b(?:src|href)="([^\"]+)"/g)){
    const url=m[1];if(!url.startsWith('.')||url.endsWith('/'))continue;
    await access(resolve(dirname(resolve(root,file)),url.split('#')[0]));checks++;
  }
}
const index=await readFile(resolve(root,'blog/index.html'),'utf8');
check(()=>assert(index.includes('planner-skill-alignment/')&&index.includes('reasoning-to-muscle-memory/')));
await access(resolve(root,'blog/reasoning-to-muscle-memory/index.html'));checks++;
const chars=(post.match(/[\u4e00-\u9fff]/g)||[]).length;
console.log(JSON.stringify({status:'passed',checks,chinese_characters:chars,coverage:'exported routes, preserved scripts, iframe assets, anchors, citations, article index, old article, no private-site linkage',verification_limit:'No browser visual QA'},null,2));
