/* Research snapshot: 2026-10-18. Stage recommendations are design hypotheses. */
window.ATLAS_DATA = {
  sources: {
    cortex:{name:"Cortex",year:"2026",url:"https://arxiv.org/abs/2607.05377",title:"A Bidirectionally Aligned Embodied Agent Framework for Long-horizon Manipulation",note:"用可执行子任务、记忆与进度核验连接规划和执行；结构化技能空间的覆盖范围仍需评估。"},
    capx:{name:"CaP-X",year:"2026",url:"https://arxiv.org/abs/2603.22435v2",title:"A Framework for Benchmarking and Improving Coding Agents for Robot Manipulation",note:"研究动作抽象、交互反馈与测试时计算对编程控制的影响，并探索可验证奖励上的强化学习。"},
    embodiedswe:{name:"EmbodiedSWE",year:"2026",url:"https://arxiv.org/abs/2609.27308",title:"Coding Agents for Long Horizon Dexterous Robotics",note:"把通过验证的代码解扩展为策略学习数据；离线求解时间与在线执行时间需要分别报告。"},
    saycan:{name:"SayCan",year:"2022",url:"https://say-can.github.io/",title:"Do As I Can, Not As I Say",note:"用语言相关性与技能可行性共同选择动作，为“知道什么做得成”提供基础视角。"},
    cap:{name:"Code as Policies",year:"2022",url:"https://code-as-policies.github.io/",title:"Language Model Programs for Embodied Control",note:"由语言模型组合感知与控制 API，生成包含逻辑、几何计算和反馈循环的策略程序。"},
    hivla:{name:"What Matters in Orchestrating Robot Policies",year:"2026",url:"https://jiahenghu.github.io/hi-vla/",title:"A Systematic Study of Hierarchical VLA Agents",note:"在 options 式框架下研究规划器、控制器、切换机制、观测与记忆。证据来自其特定实验设置。"},
    harness:{name:"Harness VLA",year:"2026",url:"https://arxiv.org/abs/2607.08448v5",title:"Steering Frozen VLAs into Reliable Manipulation Primitives via Memory-Guided Agents",note:"把冻结 VLA 用作可重试的接触技能，与解析原语组合，并利用执行经验认识技能的工作范围。核对版本 v5。"},
    tools:{name:"VLAs-as-Tools / TAPT",year:"2026",url:"https://arxiv.org/abs/2605.13119v2",title:"Towards Long-horizon Embodied Agents with Tool-Aligned Vision-Language-Action Models",note:"通过工具族接口、执行进度反馈和调用对齐后训练，连接高层规划与局部 VLA 操作。核对版本 v2。"},
    options:{name:"Options Framework",year:"1999",url:"https://doi.org/10.1016/S0004-3702(99)00052-1",title:"Between MDPs and semi-MDPs: A Framework for Temporal Abstraction in Reinforcement Learning",note:"用启动集合、内部策略与终止条件描述持续多个时间步的动作，连接 MDP 与半马尔可夫决策过程。"},
    ppo:{name:"PPO",year:"2017",url:"https://arxiv.org/abs/1707.06347",title:"Proximal Policy Optimization Algorithms",note:"通过约束策略更新幅度提高策略梯度优化的稳定性；不自动解决延迟奖励中的因果归因。"},
    gae:{name:"GAE",year:"2015",url:"https://arxiv.org/abs/1506.02438",title:"High-Dimensional Continuous Control Using Generalized Advantage Estimation",note:"用带权时序差分残差估计 advantage，调节偏差与方差；价值估计依赖所用状态或观测表示。"},
    rudder:{name:"RUDDER",year:"2019",url:"https://papers.neurips.cc/paper_files/paper/2019/hash/16105fb9cc614fc29e1bda00dab60d41-Abstract.html",title:"Return Decomposition for Delayed Rewards",note:"研究延迟奖励的回报分解与奖励重分配；归因估计不能直接当作真实的因果证明。"}
  },
  nodes: [
    {id:"observation",title:"观测与状态",en:"Observation / belief",group:"planner",x:160,y:105,definition:"机器人拿到的是图像、传感器与历史观测，而不一定是完整环境状态。Planner 需要据此形成可更新的判断，并把目标对象、接触关系和不确定性传给执行端。",methods:["hivla","cap"],questions:["看不见的物体，是不存在还是被遮挡？","一次调用后，哪些状态必须重新观测？"],boundary:"研究建议：保留观测时间与对象标识；仿真真值不能默认在真实部署中可得。"},
    {id:"planner",title:"Planner",en:"Task decomposition & routing",group:"planner",x:500,y:105,definition:"把任务目标分解为子目标，选择工具、参数与执行顺序，并在收到新证据后修改计划。它需要同时判断“这一步有用吗”与“这项技能此刻做得成吗”。",methods:["saycan","hivla","tools"],questions:["选择错误来自任务理解，还是能力判断？","何时等待技能完成，何时中断并重规划？"],boundary:"概念区分：语义上合理的计划，不等于在当前机器人与场景中可执行。"},
    {id:"memory",title:"执行记忆",en:"Traces → capability knowledge",group:"planner",x:840,y:105,definition:"保存调用条件、执行结果和失败原因，把一次次经验转化为对技能工作范围的认识。原始历史需要被组织成可检索的证据，才能支持后续选择。",methods:["harness","hivla"],questions:["失败经验能迁移到哪些相似场景？","技能或机器人版本改变后，旧记忆还能用吗？"],boundary:"研究建议：记忆绑定策略版本和场景条件，避免把过期经验当作当前能力。"},
    {id:"boundary",title:"能力边界",en:"Preconditions & effects",group:"tool",x:160,y:255,definition:"描述一项技能在哪些初始条件下适用，以及它能够稳定达成哪些后置条件。它要回答的不只是“会抓取”，而是“能抓哪类物体、从什么姿态开始、结束时保证什么”。",methods:["saycan","harness","options"],questions:["抓取成功，是否同时保证了后续可放置？","边界来自描述、经验，还是系统性干预测试？"],boundary:"待验证：同名技能在不同对象、位姿和接触状态下，工作范围可能不同。"},
    {id:"contract",title:"能力契约",en:"The planner–tool interface",group:"tool",x:500,y:255,definition:"把技能名称变成双方都理解的调用约定：目标与参数、启动条件、进度反馈、成功判据、超时和失败返回。这里用它作为研究组织概念，连接“将知兵”与“兵知将”。",methods:["tools","options","harness","cortex"],questions:["技能是否执行了本次指定的对象与目标？","返回“完成”时，Planner 到底能相信哪些条件？"],boundary:"本图研究抽象：不是上述论文统一提出的标准；需要逐项映射到实际工具 API。"},
    {id:"reliability",title:"可靠性评估",en:"Context-conditioned evidence",group:"tool",x:840,y:255,definition:"在给定任务、场景和策略版本下，估计技能成功的可能性与代价，并区分证据充足、证据不足和分布外条件。技能是否有用与技能是否可靠，需要分别评估。",methods:["saycan","harness"],questions:["可行性分数有无经过真实执行校准？","成功样本是否覆盖当前对象与场景？"],boundary:"本站没有实测可靠性。所有阶段风险均为定性推演，不能解读为成功概率。"},
    {id:"code",title:"Code as Policy",en:"Logic, geometry & API composition",group:"tool",x:160,y:415,definition:"由语言模型生成程序，组合感知、几何计算、控制原语与条件循环。它提供灵活的组合能力，但最终动作仍受底层 API、观测质量与执行频率约束。",methods:["cap","capx","harness"],questions:["程序调用的控制原语，是否满足当前接触要求？","坐标、单位、参考系与超时是否一致？"],boundary:"研究建议：可执行代码需要接口检查与运行时退出条件；代码运行成功不代表任务完成。"},
    {id:"option",title:"时间抽象 / Option",en:"Initiation · policy · termination",group:"tool",x:385,y:415,definition:"用启动集合 I、内部策略 π 和终止条件 β 描述持续多个底层时间步的行为。Planner 在技能边界决策，技能在内部闭环执行，二者可以具有不同时间尺度。",methods:["options","hivla"],questions:["终止由固定步数、技能信号还是外部验证决定？","需要打断时，内部控制能否安全退出？"],boundary:"概念区分：固定 action chunk 不自动具备完整 option 的启动与终止语义。"},
    {id:"vla",title:"VLA as Tool",en:"Bounded visuomotor execution",group:"tool",x:615,y:415,definition:"把视觉语言动作策略封装为有边界的局部执行工具，由高层提供明确子目标。工具化还需要调用对齐、进度反馈与终止机制，不能只在模型外套一个函数名。",methods:["tools","harness"],questions:["VLA 跟随的是当前指令，还是训练中的默认习惯？","局部动作成功，是否为下一技能留下合适姿态？"],boundary:"待验证：调用忠实度、局部成功率与整回合成功率应分别记录。"},
    {id:"monitor",title:"监控与验证",en:"Progress · success · interruption",group:"tool",x:840,y:415,definition:"在执行期间与结束时检查进度、目标条件和异常，决定继续、完成或上报失败。验证器输出的是关于执行结果的证据，Planner 再据此更新判断。",methods:["hivla","tools","cortex"],questions:["停下是因为完成、卡住，还是超时？","误判成功会如何传递到下一阶段？"],boundary:"研究建议：区分进行中、成功、失败与未知；未观测到失败不等于成功。"},
    {id:"recovery",title:"失败恢复",en:"Re-ground · re-stage · retry",group:"tool",x:160,y:575,definition:"先诊断失败发生在哪一层，再选择重新定位、调整起始条件、切换工具或重新规划。恢复策略应改变导致失败的条件，而不是无条件重复原调用。",methods:["harness","tools"],questions:["失败是目标错误、前置条件不满足，还是控制失误？","继续重试的收益能否覆盖时间与动作代价？"],boundary:"研究建议：设置重试预算；状态未知时先获取新证据，再安排下一动作。"},
    {id:"critic",title:"Critic / Q",en:"Expected long-term return",group:"learning",x:385,y:575,definition:"价值函数估计从当前情况继续执行能够获得的期望回报。高层 Q 可评价一次技能选择的长期收益；局部成功预测只评价技能是否完成，二者目标不同。",methods:["options","gae","ppo"],questions:["Critic 看到了技能的前置条件与执行时长吗？","高分代表容易成功，还是对最终任务真正有益？"],boundary:"概念区分：Q 是在给定后续策略下的期望回报，不天然等于技能成功率。"},
    {id:"credit",title:"Credit assignment",en:"Who contributed to the outcome?",group:"learning",x:615,y:575,definition:"在长程回报到来后，估计哪些规划选择、技能调用或底层动作促成了结果。需要跨时间与跨层级处理贡献，避免把整段成败全部归到最后一个动作。",methods:["gae","rudder","options"],questions:["杯子掉落，是抓取不稳、搬运过快还是放置错误？","能否用重放或受控干预区分规划与执行责任？"],boundary:"研究建议：advantage 与回报分解是学习信号；没有干预证据时，不把它们写成因果结论。"},
    {id:"reward",title:"奖励与轨迹",en:"Outcome · cost · provenance",group:"learning",x:840,y:575,definition:"记录最终目标、阶段事件、时长与失败轨迹，为评估和学习提供证据。任务完成可能在回合末才有奖励，也可以设计过程奖励，但后者需要检查是否改变原任务目标。",methods:["ppo","rudder","embodiedswe"],questions:["局部奖励会不会诱导反复抓取却不完成放置？","轨迹能否对齐到每次 Planner 决策与工具版本？"],boundary:"研究建议：分别记录观测、调用、终止原因、环境奖励和验证结果，保留原始证据。"}
  ],
  edges:[
    {from:"monitor",to:"planner",label:"证据触发重规划",kind:"feedback"},
    {from:"credit",to:"planner",label:"更新高层选择",kind:"feedback"},
    {from:"credit",to:"vla",label:"改进局部策略",kind:"feedback"},
    {from:"observation",to:"planner",label:"形成当前判断"},
    {from:"planner",to:"contract",label:"表达子目标与约束"},
    {from:"memory",to:"planner",label:"召回能力经验",kind:"feedback"},
    {from:"boundary",to:"contract",label:"约束启动与效果"},
    {from:"reliability",to:"contract",label:"提供条件化证据"},
    {from:"contract",to:"code",label:"调用组合程序"},
    {from:"contract",to:"option",label:"约定执行边界"},
    {from:"contract",to:"vla",label:"指定局部任务"},
    {from:"contract",to:"monitor",label:"指定成功判据"},
    {from:"observation",to:"boundary",label:"检查前置条件"},
    {from:"monitor",to:"reliability",label:"积累结果证据",kind:"feedback"},
    {from:"reliability",to:"memory",label:"更新工作范围",kind:"feedback"},
    {from:"code",to:"recovery",label:"调整几何与起始条件"},
    {from:"recovery",to:"boundary",label:"恢复可执行条件",kind:"feedback"},
    {from:"option",to:"critic",label:"在技能边界估值"},
    {from:"vla",to:"credit",label:"关联局部执行轨迹",kind:"feedback"},
    {from:"monitor",to:"reward",label:"记录终止与结果",kind:"feedback"},
    {from:"reward",to:"credit",label:"回传长程回报",kind:"feedback"},
    {from:"critic",to:"credit",label:"提供价值基线",kind:"feedback"},
    {from:"credit",to:"critic",label:"改善价值学习",kind:"feedback"},
    {from:"recovery",to:"critic",label:"计入重试成本"},
    {from:"vla",to:"monitor",label:"回传执行进度",kind:"feedback"}
  ],
  stages:[
    {id:"plan",label:"任务分解",number:"01",focus:["observation","planner","contract","boundary","reliability"],selected:"planner",goal:"先确认目标杯子与托盘，再把任务分成定位、抓取、搬运和释放。每个子目标都要能用可观察条件验收。",output:"对象标识、子目标序列、可调用技能及其前置条件。",dependencies:[
      {id:"observation",why:"绑定正确对象与目标区域，保留遮挡、位姿和观测时效的不确定性。",risk:"把推测当真值，会把错误目标一路传给执行端。",level:"优先核验"},
      {id:"boundary",why:"先检查抓取范围、起始位姿与后置条件，再让 Planner 安排技能顺序。",risk:"单步可行不保证技能之间能够衔接。",level:"衔接风险"},
      {id:"contract",why:"把“整理桌面”改写为对象、参数、成功条件与失败返回。",risk:"笼统指令可能触发默认行为，出现调用不忠实。",level:"语义风险"}
    ]},
    {id:"grasp",label:"接近与抓取",number:"02",focus:["observation","planner","contract","boundary","code","vla","option","monitor"],selected:"vla",goal:"用几何与控制原语接近杯子，再由适合当前物体与姿态的局部策略建立稳定抓取。",output:"杯子已被稳定持有，并获得可继续搬运的状态证据。",dependencies:[
      {id:"code",why:"根据几何信息进行接近与起始姿态调整，参数需要满足实际控制接口。",risk:"坐标系或单位错误，会让合理的计划变成错误动作。",level:"接口风险"},
      {id:"vla",why:"在训练与验证覆盖的条件内，完成需要闭环反馈的局部接触操作。",risk:"技能可能抓错对象，或在分布外物体上沿用默认动作。",level:"能力未知"},
      {id:"monitor",why:"检查接触、夹持与离桌状态，确认成功后才进入搬运。",risk:"夹爪闭合本身不能证明杯子已被抓住。",level:"优先核验"}
    ]},
    {id:"transfer",label:"搬运与放置",number:"03",focus:["planner","contract","boundary","reliability","code","vla","monitor"],selected:"boundary",goal:"维持杯子的稳定持有状态，移动至托盘上方，按放置条件释放，并验证杯子确实留在托盘内。",output:"杯子位于托盘内、夹爪已释放，最终位置稳定。",dependencies:[
      {id:"boundary",why:"检查抓取姿态是否支持运输，以及托盘放置是否需要新的接触技能。",risk:"抓得住不等于适合搬运，局部成功也可能制造后续死路。",level:"衔接风险"},
      {id:"code",why:"对适用的非接触路段组合路径与位姿控制，接触放置按契约切换工具。",risk:"搬运中的滑移可能在下一次高层观察前已经发生。",level:"状态漂移"},
      {id:"monitor",why:"分别确认目标区域、释放状态与放置稳定性，检查任务最终条件。",risk:"在托盘上方或夹爪张开，都不等于放置成功。",level:"优先核验"}
    ]},
    {id:"recover",label:"失败恢复",number:"04",focus:["planner","observation","memory","boundary","reliability","monitor","recovery"],selected:"recovery",goal:"如果抓空、滑移或放错，先重新观测并判断失败原因，再改变起始条件、切换工具或重新规划。",output:"失败类型、新观测、调整后的调用与明确重试预算。",dependencies:[
      {id:"observation",why:"先确定杯子与夹爪的当前位置，避免基于失败前状态继续动作。",risk:"旧状态会让后续恢复动作与真实场景错位。",level:"优先核验"},
      {id:"recovery",why:"根据原因重新定位、重新摆位或换用技能，把失败条件改掉再重试。",risk:"重复相同参数可能稳定复现同一个失败。",level:"重复失败"},
      {id:"memory",why:"查询相似失败与有效修复，并把本次调用条件和结果写入经验。",risk:"跨场景或跨版本迁移未经验证的经验，可能误导选择。",level:"迁移风险"}
    ]},
    {id:"attribute",label:"回合归因",number:"05",focus:["planner","option","vla","critic","credit","reward"],selected:"credit",goal:"把整回合结果对齐到每次决策与技能调用，区分计划选错、调用未被遵守与底层执行失败，形成可检验的归因假设。",output:"按调用分段的轨迹、回报与价值估计，以及待做干预实验。",dependencies:[
      {id:"reward",why:"保留完整轨迹和最终结果，并记录过程事件、执行时长与恢复代价。",risk:"只留回合成败，会掩盖前面哪一步制造了失败条件。",level:"证据缺失"},
      {id:"critic",why:"在技能边界估计长期回报，计算 advantage 时匹配实际决策时间尺度。",risk:"把每个长短不同的技能都当作一个等长环境步，会歪曲折扣。",level:"时间尺度"},
      {id:"credit",why:"比较规划与执行的贡献，用状态重放或受控替换进一步验证。",risk:"相关性与价值预测不等于因果责任，不能直接归咎最后一步。",level:"归因偏差"}
    ]}
  ]
};
