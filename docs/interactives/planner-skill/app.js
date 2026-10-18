(function(){
  'use strict';
  const data=window.ATLAS_DATA;
  const isEn=window.ATLAS_LANGUAGE==='en';
  const t=value=>isEn?(window.ATLAS_TRANSLATIONS[value]??value):value;
  const nodeById=new Map(data.nodes.map(n=>[n.id,n]));
  const stageById=new Map(data.stages.map(s=>[s.id,s]));
  const groups={planner:t('决策与理解'),tool:t('能力与执行'),learning:t('反馈与学习')};
  const state={stage:null,node:'contract',zoom:1};
  const $=id=>document.getElementById(id);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const svgNS='http://www.w3.org/2000/svg';
  function svgEl(tag,attrs={},text){const e=document.createElementNS(svgNS,tag);for(const [k,v]of Object.entries(attrs))e.setAttribute(k,String(v));if(text!==undefined)e.textContent=text;return e;}
  function neighbors(id){return [...new Set(data.edges.flatMap(e=>e.from===id?[e.to]:e.to===id?[e.from]:[]))];}
  function getStage(){return stageById.get(state.stage)||data.stages[0];}
  function describeStage(id){const s=stageById.get(id);if(!s)throw new Error('Unknown stage');return {title:s.label,focus:s.focus,dependencies:s.dependencies.map(d=>({...d,node:nodeById.get(d.id)}))};}
  function selectNode(id){if(!nodeById.has(id))return;state.node=id;renderGraph();renderDetail();$('announcer').textContent=t('已选择')+' '+nodeById.get(id).title;}
  function selectStage(id){if(id!==null&&!stageById.has(id))return;state.stage=id;state.node=id?stageById.get(id).selected:'contract';renderAll();$('announcer').textContent=id?t('已切换至')+' '+stageById.get(id).label+t('阶段'):t('已恢复全局视角');}
  function edgePath(e){const a=nodeById.get(e.from),b=nodeById.get(e.to),dx=b.x-a.x,dy=b.y-a.y;let sx=a.x,sy=a.y,tx=b.x,ty=b.y;
    if(Math.abs(dy)>80){sy+=Math.sign(dy)*34;ty-=Math.sign(dy)*34;}else{sx+=Math.sign(dx)*88;tx-=Math.sign(dx)*88;}
    if(e.to==='planner'&&e.from==='monitor')return `M ${sx+88} ${sy} C 978 ${sy} 978 42 ${tx+88} ${ty}`;
    if(e.to==='planner'&&e.from==='credit')return `M ${sx+88} ${sy} C 960 620 960 70 ${tx+88} ${ty}`;
    if(e.from==='credit'&&e.to==='vla')return `M ${a.x+88} ${a.y} C ${a.x+145} ${a.y} ${b.x+145} ${b.y} ${b.x+88} ${b.y}`;
    if(e.from==='credit'&&e.to==='critic')return `M ${sx} ${sy+8} Q ${(sx+tx)/2} ${sy+60} ${tx} ${ty+8}`;
    if(e.from==='recovery'&&e.to==='boundary')return `M ${sx-88} ${sy} C ${sx-130} ${sy} ${tx-130} ${ty} ${tx-88} ${ty}`;
    if(Math.abs(dy)<80)return `M ${sx} ${sy} L ${tx} ${ty}`;
    return `M ${sx} ${sy} C ${sx} ${(sy+ty)/2} ${tx} ${(sy+ty)/2} ${tx} ${ty}`;
  }
  const compactEdges={
    'contract:code':['程序调用','Invoke code'],
    'contract:option':['执行边界','Execution scope'],
    'contract:vla':['局部目标','Local goal'],
    'contract:monitor':['成功判据','Success criteria'],
    'planner:contract':['子目标','Subgoal'],
    'boundary:contract':['适用条件','Preconditions'],
    'reliability:contract':['能力证据','Evidence']
  };
  const edgeLabel=e=>compactEdges[e.from+':'+e.to]?.[isEn?1:0]||e.label;
  function renderGraph(){const root=$('graph-content');root.replaceChildren();const focus=state.stage?new Set(stageById.get(state.stage).focus):null;
    [['01  任务与理解',30],['02  能力接口',185],['03  局部执行',345],['04  反馈与学习',510]].forEach(([text,y])=>{root.append(svgEl('text',{x:49,y,class:'graph-section'},t(text)));root.append(svgEl('line',{x1:isEn?330:178,y1:y-3,x2:950,y2:y-3,class:'graph-section-line'}));});
    for(const e of data.edges){const active=e.from===state.node||e.to===state.node,dim=focus&&(!focus.has(e.from)||!focus.has(e.to));const path=svgEl('path',{d:edgePath(e),class:['edge',e.kind==='feedback'?'feedback':'',active?'highlight':'',dim?'muted':''].join(' '),'marker-end':'url(#arrow)'});path.append(svgEl('title',{},nodeById.get(e.from).title+' → '+nodeById.get(e.to).title+'：'+e.label));root.append(path);}
    // Labels appear only for the selected node, preserving a readable overview.
    data.edges.filter(e=>e.from===state.node||e.to===state.node).forEach((e,i)=>{const a=nodeById.get(e.from),b=nodeById.get(e.to);let x=(a.x+b.x)/2,y=(a.y+b.y)/2-7;if(e.from==='credit'&&e.to==='critic')y+=50;if(e.from==='credit'&&e.to==='vla'){x=760;y=490;}if(e.to==='planner'&&e.from==='monitor'){x=910;y=180;}if(e.to==='planner'&&e.from==='credit'){x=907;y=530;}if(e.from==='recovery'&&e.to==='boundary'){x=43;y=350;}if(state.node==='contract'&&a.y<b.y)y+=i%2?9:-2;root.append(svgEl('text',{x,y,'text-anchor':'middle',class:'edge-label'},edgeLabel(e)));});
    data.nodes.forEach((n,i)=>{const g=svgEl('g',{class:['node',n.group,n.id===state.node?'selected':'',focus&&!focus.has(n.id)?'muted':'',focus&&focus.has(n.id)?'stage-active':''].join(' '),transform:`translate(${n.x-88} ${n.y-34})`,role:'button',tabindex:'0','aria-label':n.title+'：'+n.en,'aria-pressed':n.id===state.node,'data-node':n.id});g.append(svgEl('rect',{width:176,height:68,rx:8}));g.append(svgEl('text',{x:88,y:40,'text-anchor':'middle',class:'node-title'},n.title));g.append(svgEl('title',{},n.title+' · '+groups[n.group]));g.addEventListener('click',()=>selectNode(n.id));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(n.id);const replacement=document.querySelector(`[data-node="${n.id}"]`);if(replacement)replacement.focus();}});root.append(g);});
    $('graph-caption').textContent=state.stage?stageById.get(state.stage).number+' / '+stageById.get(state.stage).label:(isEn?'Global view':'全局视角');
    $('edge-hint').textContent=isEn?'Solid: invocation · Dashed: feedback':'实线：调用 · 虚线：反馈';
  }
  function renderDetail(){const n=nodeById.get(state.node);$('node-detail').innerHTML=`<div class="detail-category"><span>${t('节点档案')} / ${esc(groups[n.group])}</span><span>${String(data.nodes.indexOf(n)+1).padStart(2,'0')} / 14</span></div><h3>${esc(n.title)}</h3><div class="detail-subtitle">${esc(n.en)}</div><div class="detail-rule"></div><h4>${t('它是什么')}</h4><p class="detail-definition">${esc(n.definition)}</p><h4>${t('代表方法')} <span aria-hidden="true">↗</span></h4><div class="method-list">${n.methods.map(id=>{const s=data.sources[id];return `<a class="method-link" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><span>${esc(s.name)}</span><span>↗</span></a>`;}).join('')}</div><h4>${t('关键问题')}</h4><ul class="question-list">${n.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul><div class="evidence-note"><b>${t('证据与边界')}</b><br>${esc(n.boundary)}</div><h4>${t('直接相连')}</h4><div class="related-list">${neighbors(n.id).map(id=>`<button data-related="${id}">${esc(nodeById.get(id).title)} ↗</button>`).join('')}</div>`;
    $('node-detail').querySelectorAll('[data-related]').forEach(b=>b.addEventListener('click',()=>selectNode(b.dataset.related)));
  }
  function renderChips(){const all=[{id:null,label:t('全图'),number:''},...data.stages];$('stage-chips').innerHTML=all.map(s=>`<button class="stage-chip" aria-pressed="${state.stage===s.id}" data-stage="${s.id||''}">${s.number?`<span class="step-num">${s.number}</span>`:''}${esc(s.label)}</button>`).join('');$('stage-chips').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>selectStage(b.dataset.stage||null)));}
  function renderStage(){const s=getStage(),index=data.stages.indexOf(s);$('stage-brief').innerHTML=`<span class="stage-number">STAGE ${s.number} / 05${state.stage?'':t(' · 默认示例')}</span><h3>${esc(s.label)}</h3><p>${esc(s.goal)}</p><span class="output-label">${t('期望得到的证据')}</span><div class="output-text">${esc(s.output)}</div><div class="stage-select-wrap"><button id="stage-prev" ${index===0?'disabled':''}>${t('← 上一阶段')}</button><button id="stage-next" ${index===data.stages.length-1?'disabled':''}>${t('下一阶段 →')}</button></div>`;
    $('stage-prev').addEventListener('click',()=>{if(index>0)selectStage(data.stages[index-1].id);});$('stage-next').addEventListener('click',()=>{if(index<data.stages.length-1)selectStage(data.stages[index+1].id);});
    $('stage-dependencies').innerHTML=s.dependencies.map(d=>`<div class="dependency-row"><button class="dependency-node" data-dependency="${d.id}">${esc(nodeById.get(d.id).title)}<span>↗</span></button><div><p>${esc(d.why)}</p><span class="risk"><b>${esc(d.level)}</b>${esc(d.risk)}</span></div></div>`).join('');
    $('stage-dependencies').querySelectorAll('[data-dependency]').forEach(b=>b.addEventListener('click',()=>{selectNode(b.dataset.dependency);$('map').scrollIntoView({behavior:'smooth',block:'start'});}));
  }
  function renderAll(){renderChips();renderGraph();renderDetail();renderStage();}
  function setZoom(value){state.zoom=Math.max(.8,Math.min(1.8,Math.round(value*10)/10));$('graph').style.width=state.zoom*100+'%';$('graph').style.maxHeight=state.zoom>1?'none':'';$('graph-scroll').style.justifyContent=state.zoom>1?'flex-start':'';$('zoom-reset').textContent=Math.round(state.zoom*100)+'%';$('zoom-out').disabled=state.zoom<=.8;$('zoom-in').disabled=state.zoom>=1.8;}
  function search(query){const q=query.trim().toLowerCase();return q?data.nodes.filter(n=>[n.title,n.en,n.definition,...n.methods.map(id=>data.sources[id].name)].join(' ').toLowerCase().includes(q)):[];}
  function renderSearch(){const q=$('node-search').value.trim(),results=$('search-results'),matches=search(q);results.hidden=!q;results.innerHTML=matches.length?matches.map(n=>`<button data-result="${n.id}">${esc(n.title)}<small>${esc(n.en)}</small></button>`).join(''):(isEn?'<div class="search-empty">No matching nodes. Try reliability, VLA, or PPO.</div>':'<div class="search-empty">没有找到匹配节点。试试“可靠性”“VLA”或“PPO”。</div>');results.querySelectorAll('[data-result]').forEach(b=>b.addEventListener('click',()=>{selectNode(b.dataset.result);results.hidden=true;$('node-search').value='';}));}
  const guide=`<h2 id="dialog-title">一张图，看清协作的接口</h2><p class="dialog-intro">以“Planner 与 Tools 彼此不了解能力”为线索，把研究问题放回同一个决策与反馈闭环。</p><div class="guide-steps"><div class="guide-step"><div><strong>从能力契约开始</strong><p>默认选中中心节点。点击任意能力，右侧查看定义、代表方法、关键问题与证据边界。箭头表示信息或约束的方向。</p></div></div><div class="guide-step"><div><strong>选择一个任务阶段</strong><p>图上方切换阶段，相关能力保持高亮，其余节点变淡。下方实验台显示依赖理由、风险与期望证据；点击能力可跳回节点。</p></div></div></div><h3>键盘与浏览</h3><p>按 / 查找节点；输入方法名也能搜索。Tab 切换节点，Enter 或空格查看详情。图下方可缩放，窄屏可横向滚动。Esc 关闭弹窗或搜索结果。</p>`;
  const notes=`<h2 id="dialog-title">把“兵不识将”变成实验问题</h2><p>当前工作假设：高层与低层的协作瓶颈，可能来自能力判断与调用语义的双向错位。</p><h3>1. Planner 是否知道技能能做什么？</h3><div class="memo"><p>固定技能与任务，只改变提供给 Planner 的能力信息：技能名称 → 前置与后置条件 → 条件化执行证据。比较技能选择错误、无效调用与整回合成本。</p></div><h3>2. 技能是否遵守本次调用？</h3><div class="memo"><p>固定 Planner 与场景，改变目标对象、目标区域或终止条件。分别记录调用忠实度、局部成功与长程成功，避免三个指标相互替代。</p></div><h3>3. 如何把长程结果分回两层？</h3><p>先对齐高层选择与底层轨迹，再使用技能边界上的价值估计。若执行持续 τ 个底层时间步，折扣应与这一时间尺度一致。</p><div class="formula">Q(s, o) = E[Σ(k=0…τ−1) γᵏ r(t+k) + γᵗᵃᵘ V(s′)]</div><p>上式用完全可观测状态的理想化 SMDP 表达；实际部分可观测任务需要历史或信念表示。这里的 s 不能直接等同于一张图像。</p><p>用同一初始条件下的状态重放或受控替换，区分“Planner 选错工具”与“工具没做好”。advantage 是估计的学习信号，因果责任仍需独立证据。</p>`;
  function openDialog(type){$('dialog-kicker').textContent=type==='sources'?'READING INDEX / 12':type==='notes'?'RESEARCH QUESTIONS':'QUICK START';$('dialog-content').innerHTML=type==='sources'?`<h2 id="dialog-title">${t('文献索引')}</h2>${Object.values(data.sources).map(s=>`<div class="source-card"><div><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)} ↗</a><p>${esc(s.title)}</p></div><span>${s.year}</span></div>`).join('')}`:type==='notes'?(isEn?window.ATLAS_EN_NOTES:notes):(isEn?window.ATLAS_EN_GUIDE:guide);$('info-dialog').showModal();}
  $('node-search').addEventListener('input',renderSearch);
  $('node-search').addEventListener('keydown',e=>{if(e.key==='Enter'){const first=search($('node-search').value)[0];if(first){selectNode(first.id);$('search-results').hidden=true;$('node-search').value='';}}});
  $('zoom-in').addEventListener('click',()=>setZoom(state.zoom+.2));$('zoom-out').addEventListener('click',()=>setZoom(state.zoom-.2));$('zoom-reset').addEventListener('click',()=>setZoom(1));$('reset-focus').addEventListener('click',()=>{selectStage(null);setZoom(1);});
  $('sources-open').addEventListener('click',()=>openDialog('sources'));$('notes-open').addEventListener('click',()=>openDialog('notes'));$('guide-open').addEventListener('click',()=>openDialog('guide'));$('dialog-close').addEventListener('click',()=>$('info-dialog').close());
  $('info-dialog').addEventListener('click',e=>{if(e.target===$('info-dialog')){const r=$('info-dialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('info-dialog').close();}});
  document.addEventListener('keydown',e=>{const editing=['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName);if(e.key==='/'&&!editing&&!$('info-dialog').open){e.preventDefault();$('node-search').focus();}if(e.key==='Escape'){$('search-results').hidden=true;}});
  document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))$('search-results').hidden=true;});
  renderAll();setZoom(1);
  // Stable model/controller surface supports non-browser interaction checks.
  window.CapabilityAtlas={data,state,selectNode,selectStage,search,describeStage,setZoom,neighbors,openDialog};
})();
