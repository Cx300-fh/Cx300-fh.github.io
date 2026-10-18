import { PageShell } from '@/components/site';
import { references } from './references';
import '../reasoning-to-muscle-memory/essay.css';
import './survey.css';

export const metadata = {
  title:'Planner 与 Skill：从分层执行到能力对齐 — Yuxin Li',
  description:'围绕 Planner 与技能之间的能力认知、调用语义、可靠性和长程信用分配，梳理具身智能的主要路线，并提供交互能力关系图与双闭环系统架构。',
  alternates:{canonical:'https://cx300-fh.github.io/blog/planner-skill-alignment/'}
};
const Ref=({n}:{n:number})=><sup className="survey-ref"><a href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a></sup>;
const Section=({id,index,title,children}:{id:string;index:string;title:string;children:React.ReactNode})=><section id={id} className="survey-section"><span className="survey-section-index">{index}</span><h2>{title}</h2>{children}</section>;
const Figure=()=> <figure className="essay-figure architecture-figure"><div className="figure-index">FIGURE 02 / A TWO-LOOP SYSTEM</div><img src="/images/blog/planner-skill-architecture.svg" alt="在线闭环：观测进入 Planner，能力目录与契约约束工具选择，由代码或 VLA 执行，环境结果经验证后触发重规划。离线闭环：调用与轨迹进入归因和干预评估，再更新规划选择、技能与能力目录。" width="1200" height="850"/><figcaption><b>从层级连接到可检验的协作。</b>实线表示在线调用与观测反馈，虚线表示离线的证据与学习更新。能力目录保存适用范围及证据，能力契约约束一次具体调用。底层控制器始终负责其适用频率上的运动执行。图为本文对现有研究的综合组织，不是任一论文的原图，也不表示所有更新路径都已被联合验证。</figcaption></figure>;

export default function Post(){return <div className="planner-survey-page"><PageShell active="Blog" eyebrow="RESEARCH SURVEY / PLANNING × EMBODIED SKILLS" title="Planner 与 Skill：从分层执行到能力对齐" description="当机器人已经学会分工，下一步是让 Planner 了解技能的真实边界，也让技能准确理解每一次调用。"><article className="research-essay planner-survey" lang="zh-CN">
<div className="essay-meta">OCTOBER 18, 2026 · YUXIN LI · RESEARCH SURVEY</div>
<div className="survey-status"><span>文献快照 / 2026.10.18</span><a href="#capability-map">探索能力关系图 ↘</a></div>
<p className="essay-lede">一个机器人可能已经会抓杯子、会搬运、会放置，却依然无法可靠地把杯子放进托盘。问题可能发生在抓取之前：Planner 选中了不适用的技能；也可能发生在抓取之后：技能虽然完成了局部目标，却留下了无法继续放置的姿态。对于长程具身任务，更强的规划器与更强的动作策略并不会自动形成更强的系统。真正需要建立的，是双方关于目标、能力边界、执行结果与失败责任的共同理解。</p>
<div className="survey-claim"><span>本文的中心判断</span><p>Planner–Skill 协作的一个关键问题，正从“有没有层级”转向“层级之间传递的信息是否足以支持可靠决策”。能力对齐既包含 Planner 对技能的认识，也包含技能对调用意图的服从。</p></div>
<nav className="survey-toc" aria-label="文章目录"><a href="#problem">01 问题与边界</a><a href="#lineage">02 发展路线</a><a href="#alignment">03 双向对齐</a><a href="#capability-map">04 能力关系图</a><a href="#architecture">05 系统架构</a><a href="#credit">06 长程归因</a><a href="#evidence">07 实验证据</a><a href="#agenda">08 研究方向</a></nav>
<details className="english-abstract"><summary>English abstract</summary><p>Hierarchical robot agents increasingly combine foundation-model planning with learned visuomotor skills and executable programs. Their central challenge is not only task decomposition, but also a bidirectional interface: the planner must understand when a skill is applicable, while the executor must follow the particular invocation rather than a familiar training-task routine. This survey connects affordance grounding, programmatic control, VLA tool alignment, orchestration, and agent-generated policy data. An interactive capability map and a two-loop architecture distinguish online execution and verification from offline attribution and capability updates. We emphasize conditional reliability, compositional handoffs, decision timescales, and evaluation protocols rather than a cross-paper success-rate ranking.</p></details>

<Section id="problem" index="01 / THE PROBLEM" title="“会做”为什么还不等于“会协作”">
<p>这里的 Planner 指选择子目标、工具与执行顺序的高层决策机制；Skill 指在一定条件下持续执行一段行为的能力单元。Skill 可以是手写控制程序、运动规划器、由语言模型生成的代码，也可以是学习得到的视觉运动策略。Tool 则强调可调用的接口形式。一个函数可以包装技能，但函数名本身并不说明技能何时有效、完成什么、如何退出。</p>
<p>这一问题有明确的理论前史。Options 框架用启动集合、内部策略与终止条件描述持续多个时间步的动作，让规划和学习能够发生在不同时间尺度上。<Ref n={1}/>今天的变化在于，上层越来越多地接收开放的语言目标，底层则可能由大规模数据训练而来；两者不再天然共享一套精确的状态、动作和效果定义。高层说“把这个杯子放好”，底层究竟把“这个”“放好”和“现在结束”理解成什么，需要被单独检验。</p>
<p>“兵不识将、将不识兵”因而对应两个可分离的错误。前者是调用意图没有被低层忠实实现，例如让策略抓左侧杯子，它仍沿熟悉轨迹抓右侧杯子；后者是高层错误估计低层能力，例如默认“抓取”适用于任意物体、任意初始位姿。两种错误可能产生同样的最终失败，却需要完全不同的训练数据与修复手段。</p>
<p>本文关注可调用技能与高层决策之间的边界，不把所有机器人智能问题都归结为接口。接触建模、感知精度、动作数据覆盖与控制延迟仍可能是直接瓶颈。这里提出的是一个系统视角：当组件已经具有一定能力时，应怎样识别协作损失，并把它转化成可验证、可优化的对象。</p>
</Section>

<Section id="lineage" index="02 / THE LANDSCAPE" title="五条并行发展的路线">
<h3>从语言计划到可行性接地</h3>
<p>SayCan 的重要性在于把两个问题拆开：一个技能是否推进语言目标，以及它是否能在当前环境中成功。语言模型提供前者，技能价值或可行性估计提供后者。<Ref n={2}/>Inner Monologue 进一步把成功检测、场景描述等反馈送回规划过程，让下一步计划能够随执行结果改变。<Ref n={3}/>这一阶段确立的原则一直有效：计划需要依赖机器人能够执行的动作，而反馈需要能够改变后续决策。它的局限也很清楚：如果技能目录的覆盖不足，或可行性估计本身失准，语言推理无法凭空补齐物理能力。</p>
<h3>从选择技能到生成可执行程序</h3>
<p>Code as Policies 让模型组织函数、条件循环与几何计算，使用感知和控制 API 产生行为；因此，代码控制从一开始就可以包含反馈，而不必是一次性开环脚本。<Ref n={4}/>VoxPoser 则把语言中的空间约束转为三维价值图，再通过规划生成轨迹。<Ref n={5}/>这条路线将组合结构显式化，但它的实际能力仍依赖 API 提供了什么抽象，以及观测能否支撑这些计算。一个看似通用的“抓取”函数，可能已经藏入了大量人工经验。</p>
<p>CaP-X 将这种依赖变成可评测的问题：控制抽象越接近人类设计好的任务结构，模型通常越容易成功；移除这些先验后，性能会下降，而多轮交互、结构化反馈与更多测试时计算可以缓解部分差距。<Ref n={11}/>因此，评价编程智能体时，代码是否由模型生成只是起点；更重要的是它获得了哪些控制原语、允许多少次试错，以及是否需要在执行期间继续调用大模型。</p>
<h3>从完整任务策略到可调用的 VLA</h3>
<p>以 OpenVLA 为代表的视觉语言动作模型，将视觉、语言与机器人动作学习到同一策略中，使大量局部行为不必逐一手写。<Ref n={6}/>但“输入含有语言”与“能够忠实接受高层的任意子任务调用”并不是同一件事。完整轨迹训练可能让策略依赖场景规律，或继续完成训练中常见的后续动作；高层需要它提前停止、更换对象、改变目的地时，这些习惯可能成为限制。</p>
<p>VLAs-as-Tools 因而同时研究执行器与接口：通过调用对齐的后训练组织有边界的操作，用工具族选择与执行进度反馈连接规划和控制。<Ref n={7}/>Cortex 则用结构化的可执行子任务、记忆与进度验证对齐高层编排和局部动作。<Ref n={8}/>前者更直接触及“本次调用有没有被遵守”，后者强调长程任务中子目标、状态与切换的连贯性。它们共同说明，把一个通用策略封装成工具，需要改变可监督、可观测的执行语义，而不只是增加一层函数调用。</p>
<h3>从固定分工到条件化编排</h3>
<p>Harness VLA 提供了另一种取舍：冻结 VLA，把它作为局部接触操作原语，再与重新定位、摆位、运输和释放等解析操作组合。记忆保存执行经验，帮助高层认识这些固定原语的适用范围。<Ref n={9}/>其研究价值在于说明，高层不仅可以“选择技能”，还可以先改变场景和起始状态，让一个原本容易失败的技能变得可用。重新摆位在这里是一种能力准备，而不仅是失败后的补丁。</p>
<p>What Matters in Orchestrating Robot Policies 进一步系统考察规划器、动作策略、终止机制、观测与记忆的设计。<Ref n={10}/>它提醒我们，同一底层策略可以因为编排方式不同而产生明显不同的长程表现；反过来，某个系统的提升也不能自动解释为“Planner 更聪明了”。指令跟随、成功检测和状态表示，都可能是改变结果的具体因素。</p>
<h3>从解决一次任务到形成可复用能力</h3>
<p>EmbodiedSWE 将编程智能体的角色从在线执行者扩展到能力生产者：先获得验证通过的代码解，再通过多层次变化产生轨迹，训练机器人策略。<Ref n={12}/>这使昂贵的求解成本有机会在后续大量执行中被分摊。近期的 EmbodiedEvo 也关注将物理反馈沉淀为可复用代码技能与诊断经验。<Ref n={18}/>这些路线的共同目标是保留探索所得，但保留的载体不同：可以是代码、经验规则，也可以是策略参数。哪种载体更适合当前任务，取决于复用次数、场景变化、反馈成本和动作精度要求。</p>
<div className="survey-note"><b>编排系统不自动等于 Agentic RL。</b><p>闭环调用、记忆更新和代码修复都可以在不更新策略参数的情况下发生。只有明确了可学习的决策变量、环境回报与优化过程，才能具体讨论强化学习发生在哪一层。CaP-X 中的 CaP-RL、调用对齐的策略训练，与纯推理时编排应分别分析。</p></div>
</Section>

<Section id="alignment" index="03 / BIDIRECTIONAL ALIGNMENT" title="让双方共享一次调用的含义">
<p>“Planner 认识技能”不应被压缩成一段更长的工具说明。真正有用的能力描述需要支持决策：允许从什么条件开始，能提供哪些结果保证，失败时会留下什么状态，以及这些判断有多少执行证据。对应地，“技能理解 Planner”也不应只用训练集上的整任务成功率证明；需要在相似场景中主动改变目标对象、空间关系和终止点，观察策略是否随本次指令变化。VLAs-as-Tools 的调用忠实度评测正体现了后一种区分。<Ref n={7}/></p>
<p>为统一讨论，本文把一次调用的约定称为<strong>能力契约</strong>。这不是声称领域已有统一标准，而是把散落在提示词、动作封装、训练标签和验证器中的假设放到同一处。能力目录回答“有哪些技能、其经验边界在哪里”；能力契约回答“这一次究竟要求哪项技能在什么条件下完成什么”。</p>
<div className="survey-table-wrap"><table className="survey-table"><thead><tr><th>契约内容</th><th>以抓杯子为例</th><th>缺失时的风险</th></tr></thead><tbody>
<tr><td>目标与参数</td><td>对象标识、抓取姿态约束、坐标系与单位</td><td>对象绑定正确，但几何参数含义错误</td></tr>
<tr><td>启动条件</td><td>可达、目标可见、夹爪状态适合抓取</td><td>把起始条件不满足归咎为技能能力不足</td></tr>
<tr><td>完成与终止</td><td>物体稳定随夹爪移动；超时、卡住分别返回</td><td>夹爪闭合就被当作抓取成功</td></tr>
<tr><td>后置条件</td><td>抓取姿态支持下一步搬运与放置</td><td>当前技能成功，后续技能无法接续</td></tr>
<tr><td>反馈与代价</td><td>进度、异常、耗时、观测证据</td><td>高层不知道何时介入，也无法比较恢复方案</td></tr>
<tr><td>适用证据与版本</td><td>对象类别、初始状态、策略版本、验证样本</td><td>把旧策略或其他场景的经验当作当前保证</td></tr>
</tbody></table></div>
<p>这里还必须区分三个量：语义相关性、局部成功可能性和长期任务价值。能轻松完成的动作，未必值得执行；难度较高的一步，也可能是完成任务所必需。若把可行性分数当作长期 Q 值，系统可能不断选择容易成功却无法推进任务的技能。条件化可靠性应回答“在当前条件与版本下能否达到约定结果”，长期价值则回答“达到这个结果以后，最终任务还有多大收益”。</p>
<p>技能组合的核心困难由此显现：即使每项技能都有较高的局部成功率，它们连接后的分布也可能不同。抓取造成的物体朝向、夹持位置与剩余空间，都是下一项技能的输入条件。可组合能力因此需要联合考虑前置条件、后置条件与状态变化，而不能把整回合成功率简单写成若干个固定数字相乘。</p>
</Section>

<Section id="capability-map" index="04 / INTERACTIVE CAPABILITY ATLAS" title="把能力、边界与反馈放进同一张图">
<p>下面的关系图保留十四个核心节点，并补全验证结果返回 Planner、长程归因分别更新高层选择与局部策略的路径。点击节点可查看定义、代表方法与关键问题；切换任务阶段后，图会突出相关依赖，下方同时显示需要的证据与风险。它是一种研究导航，而不是一套已经运行的机器人架构。</p>
<figure className="atlas-figure"><div className="figure-index">FIGURE 01 / EXPLORE THE INTERFACE</div><iframe src="/interactives/planner-skill/index.html" title="Planner 与 Skill 交互能力图及五阶段风险分析" data-planner-skill-frame loading="lazy" className="capability-frame"/><figcaption>以“把杯子放进托盘”为贯穿示例。先点击“能力契约”，再比较接近抓取、搬运放置与失败恢复三个阶段：同一项技能的价值，依赖它在整个任务链中的位置。<a href="/interactives/planner-skill/" target="_blank" rel="noopener noreferrer">独立窗口探索 ↗</a></figcaption></figure>
<p>图中的“可靠性”刻意没有标成功概率。目前这里没有接入指定机器人和策略上的执行样本。文本中的定性风险用于提出验证任务，例如“是否抓到了指定对象”“是否在指定条件满足后停止”，而不是代替经验数据。将未知显式保留，比用看似精确的分数掩盖能力空白更有研究价值。</p>
<noscript><p>交互图需要 JavaScript。正文、系统架构图与参考文献仍可阅读；<a href="/interactives/planner-skill/">也可进入图谱独立页面</a>。</p></noscript>
</Section>

<Section id="architecture" index="05 / SYSTEM ARCHITECTURE" title="用两个闭环组织整个系统">
<p>一张从 Planner 向 Skill 再向机器人的单向箭头图，容易把最关键的机制藏起来：Planner 用什么证据做决定，技能用什么信号结束，以及一次失败如何影响未来。更清晰的系统应分开组织在线执行与离线学习，再用统一的调用记录连接二者。</p>
<Figure/>
<p>在线闭环从观测开始。机器人通常只有部分观测，因此应维护对象绑定、历史和不确定性，而不是把当前图像当作完整状态。Planner 结合任务目标与能力目录提出调用；执行前检查启动条件与参数含义，再由工具路由选择代码、解析控制或 VLA。这里的路由依据应是条件化能力，而非固定规定“凡是推理用代码、凡是接触用 VLA”。代码也能包含闭环控制，学习策略也可能覆盖运输；真正的边界需要在所用实现上测量。</p>
<p>执行反馈至少应区分进行中、成功、失败与未知。进度变化可以触发 Planner，但不必让大模型在每个底层控制步都重新思考。终止机制与中断机制也应分开：技能认为自己完成了，并不意味着外部目标判据已经满足；高层希望换任务，也不意味着底层可以立即无状态地切断。What Matters 与 VLAs-as-Tools 分别从编排分析和接口设计的角度支持了对这些切换机制的关注。<Ref n={10}/><Ref n={7}/></p>
<p>验证器需要检查任务结果，而不是重复工具的自我描述。对于杯子任务，夹爪张开只证明释放动作发生，不能证明杯子稳定留在托盘内。多个模块即使用同一基础模型，也可能共享感知误差，不能把多次相同判断当作独立证据。恢复时应先重新观测，再决定调整起始条件、切换工具或重新规划；重复调用只有在失败条件已经改变或存在合理随机性的情况下，才构成有依据的恢复。</p>
<p>离线闭环处理另一类工作：对齐每次高层决策、局部轨迹、终止原因、奖励与代价，分析成功或失败发生的条件，再更新能力目录、规划选择或执行策略。某些验证过的成功轨迹可以用于模仿学习，某些失败和恢复片段可以用于优化策略，某些经验适合保存成可检索规则。EmbodiedSWE 与 Harness VLA 分别体现了参数学习和经验记忆这两种不同的积累路径。<Ref n={12}/><Ref n={9}/></p>
<p>World Model 可以插入候选评估环节，用于比较不同动作可能带来的结果，但它不是这套架构必需的固定一层。预测误差、物体绑定错误和模拟偏差需要进入决策的不确定性；预测画面“看起来成功”不能替代真实执行验证。作为本文的研究设想，候选预演更适合补充昂贵或困难阶段的证据，而不是默认接管每一次控制决策。</p>
</Section>

<Section id="credit" index="06 / CREDIT ASSIGNMENT" title="长程回报应该分给谁">
<p>假设杯子在最后放置时掉落，直接惩罚最后一个动作可能并不正确：早先的抓取位置使杯子始终不稳定；也可能是搬运速度过高，或 Planner 选择了不匹配的放置方式。Credit assignment 要处理的，是结果跨越时间和层级后的贡献估计。它既不是把总奖励平均分给每个技能，也不能只依赖失败发生的时间位置。</p>
<p>先看高层时间尺度。设一次技能选择从状态 s 开始，执行 τ 个底层步后到达 s′。在理想化的半马尔可夫表示中，它的长期价值满足下面的关系。Options 框架提供了这种时间抽象的基础。<Ref n={1}/></p>
<div className="survey-formula" role="math" aria-label="Q of state s and option o equals expected discounted rewards during the option plus gamma to the tau times value of the next state"><span>Q(s, o) = E [ <span className="sum">Σ<sub>k=0…τ−1</sub></span> γ<sup>k</sup> r<sub>t+k</sub> + γ<sup>τ</sup> V(s′) ]</span></div>
<p className="formula-note">s 在此表示足以支持该模型的状态；部分可观测任务需要历史或信念等适当表示，不能直接把一张图像视为满足马尔可夫性质的状态。若系统按高层决策步定义奖励与折扣，也可以建立另一套一致的模型，但不能混用两种时间尺度。</p>
<p>这个公式的实际含义是：持续五步和持续五百步的技能，不能在使用底层时间折扣时都简单只乘一次 γ。高层选择的收益需要包括执行中的奖励、时间或资源代价，以及终止后留下的状态价值。否则，Planner 可能偏好看起来便宜、实际占用很长时间的技能，也可能低估一次有助于后续执行的重新摆位。</p>
<p>GAE 通过价值估计与时序差分残差组织 advantage，PPO 则是一种优化策略更新的方式。<Ref n={13}/><Ref n={14}/>它们并不会自动决定“Planner 和 Skill 各承担多少责任”。如果高层仅使用冻结模型加提示词，常规 PPO 也不能凭一条最终奖励就更新提示词本身；必须先明确可以训练的策略、动作表示与更新路径。低层的局部优势可以奖励抓取稳定性，高层的优势则应反映选择该技能对任务完成的长期作用，两者可能并不相同。</p>
<p>RUDDER 对延迟奖励的回报分解提供了有价值的思路。<Ref n={15}/>但预测贡献仍不等于因果责任：在成功轨迹里总是出现的动作，未必是必要动作。更可靠的分析需要可比较的干预，例如固定初始条件与 Planner，只替换一次工具调用；或者固定执行器，只更换高层选择。状态恢复还要保证与行为相关的模拟器、控制与历史状态一致，否则反事实比较可能从一开始就不等价。没有干预证据时，应把归因明确写成假设。</p>
</Section>

<Section id="evidence" index="07 / EVIDENCE & EVALUATION" title="现有结果证明了什么，又没有证明什么">
<p>这些研究的证据具有互补性，却很难用单一排行榜表示。动作接口、可用观测、策略训练数据、试错预算和任务分布不同，都会改变成功率的含义。即使同样写着 LIBERO，标准套件、扰动版本、反事实指令测试和自建子任务切分，也可能对应不同的问题。<Ref n={16}/></p>
<div className="within-study-evidence"><div><span>编排的收益 / 同一研究内对照</span><p>What Matters 的长时域任务组，在同一底层 VLA 下，平坦控制、朴素层级与最佳编排分别为 <b>25.30%、40.56%、67.08%</b>。它支持接口与编排具有实质作用，但结论仍受该研究的任务与系统设置约束。<Ref n={10}/></p></div><div><span>调用是否被遵守 / 固定高层计划</span><p>VLAs-as-Tools 的 LIBERO-IF 测试中，π<sub>0.5</sub> 的指定目标完成率随完整 TAPT 从 <b>24.8% 提高到 54.8%</b>。这个指标直接检查本次请求，与长程整任务成功率具有不同含义。<Ref n={7}/></p></div></div>
<div className="survey-table-wrap"><table className="survey-table evidence-table"><thead><tr><th>代表工作</th><th>主要检验对象</th><th>阅读证据时需要保留的条件</th></tr></thead><tbody>
<tr><td>What Matters<Ref n={10}/></td><td>编排、观测、记忆与终止机制</td><td>同一研究内控制底层策略，才能较好分离编排收益；不推出所有模型都适用同一最优结构。</td></tr>
<tr><td>VLAs-as-Tools<Ref n={7}/></td><td>调用对齐与双向接口</td><td>任务成功、指定目标完成与避免原任务偏置是不同指标；无偏置也不自动意味着完成新目标。</td></tr>
<tr><td>Cortex<Ref n={8}/></td><td>结构化子目标、记忆与进度核验</td><td>需要同时看规划数据、动作策略及训练设置；结构化技能空间的外部覆盖仍需检验。</td></tr>
<tr><td>Harness VLA<Ref n={9}/></td><td>冻结策略的条件准备与原语组合</td><td>区分记忆构建、测试执行及重试代价；它没有因此完成高低层联合强化学习。</td></tr>
<tr><td>CaP-X<Ref n={11}/></td><td>编程控制中的先验与交互预算</td><td>公开动作 API、抽象层级与反馈权限；测试时计算增加本身就是需要计入的资源。</td></tr>
<tr><td>EmbodiedSWE<Ref n={12}/></td><td>长程求解及验证解到训练数据的转化</td><td>区分首次搜索成本、生成数据成本和训练后策略的执行成本；它们不应混称一次 rollout 成本。</td></tr>
</tbody></table></div>
<p>例如，VLAs-as-Tools 的反事实调用测试将高层计划固定，改变请求目标，分别衡量是否完成本次请求、是否仍受原始任务偏置影响。<Ref n={7}/>这种设计比只看最终成功率更接近“兵是否识将”的问题。相应地，检验“将是否识兵”应固定技能库与能力参数，只改变 Planner 能获得的能力证据，看它是否减少无效调用并改善任务收益。</p>
<p>RoboDojo 同时提供仿真与真实环境评测，覆盖多种操作能力。<Ref n={17}/>其官方报告收录的 Code-as-Policies 社区路线，明确采用开发时迭代、冻结代码后执行的方式；这是一种具体方案的评测设置，不代表所有 RoboDojo 方法都采用相同流程。对于这种设置，不能把“执行时无需大模型”解读为“整个方案没有大模型成本”，也不能把开发阶段的多轮求解与在线 Planner 的单回合执行直接比较。<a className="essay-link" href="https://robodojo-benchmark.com/report" target="_blank" rel="noopener noreferrer">官方报告 ↗</a></p>
<p>一个面向协作的报告至少需要保留三组结果：整回合成功与阶段进展；调用忠实度、边界判断与技能交接；成本与失败恢复。可靠性估计还应检查是否校准，并给出样本数量和覆盖条件。API 费用应写清模型、价格日期与计费口径，墙钟时间应区分思考、工具等待、物理执行及离线探索。本文不将不同协议的数字合并成“哪条路线已经胜出”的结论。</p>
</Section>

<Section id="agenda" index="08 / OPEN QUESTIONS" title="更值得推进的，是可证伪的能力协作">
<p><strong>第一，把技能目录升级为有执行证据的能力模型。</strong>可以固定 Planner、技能库和任务，逐步增加名称、启动与后置条件、条件化执行统计三种信息，比较选择错误、无效调用、任务收益与成本。如果更丰富的说明没有带来收益，原因可能是模型没有使用这些信息，也可能是描述没有覆盖实际决定成败的变量。这个实验同时要求检查能力预测本身，而不是只看整回合结果。</p>
<p><strong>第二，把技能交接而非单技能成功作为学习对象。</strong>在相同抓取成功条件下，主动改变夹持位置、物体朝向与结束时机，测量后续运输和放置的表现。如果某些局部“成功”稳定破坏下一阶段，就说明技能目标需要包含可组合的后置条件。它可能要求新的终止标签、交接状态数据，或者面向下一阶段价值的策略训练，而非继续提高同一个局部成功指标。</p>
<p><strong>第三，学习何时值得思考、验证与恢复。</strong>高层推理并非越频繁越好。固定总时间或总预算，比较周期调用、事件触发与基于不确定性的调用；同时记录漏检、误报和恢复后的实际收益。对于长程任务，一次额外观测可能比再生成一个计划更有价值，一次重新摆位也可能比更换更大模型更有效。这些都应由预算匹配的对照实验决定。</p>
<p>这三类问题可以共享同一套证据基础：任务目标、调用参数、技能版本、执行轨迹、终止原因与验证结果。它们还可以连接到不同的学习方式：用模仿学习保留被验证的行为，用强化学习改善选择与执行，用记忆保存稀缺经验，用受控干预检验归因。关键是每一种更新都应对应一个明确的失败机制，而不是把所有新增模块统称为更强的智能体。</p>
<p className="essay-conclusion">Planner 与 Skill 的发展，正在让机器人从拥有若干能力走向组织、验证和积累这些能力。下一步真正有价值的系统，应当能够说明自己为什么选择这项技能、相信哪些边界、凭什么判断完成，以及一次结果究竟改变了未来的哪一部分决策。让“将知兵、兵知将”成为可以测量的协作关系，才可能把更强的单个模型持续转化为更可靠的长程行为。</p>
</Section>

<section className="survey-references" id="references"><div className="figure-index">REFERENCES / PRIMARY SOURCES</div><h2>参考文献与阅读入口</h2><p className="references-note">共 18 项原始论文或作者项目页。新工作按截至 2026 年 10 月 18 日可见版本整理；具体评测协议以原文为准。“能力契约”、双闭环架构与阶段风险是本文的综合组织或研究建议。</p><ol>{references.map(r=><li key={r.id} id={`ref-${r.id}`}><span className="reference-number">[{r.id}]</span><div><a href={r.url} target="_blank" rel="noopener noreferrer">{r.name} ↗</a><span className="reference-title">{r.title}</span><span className="reference-meta">{r.authors} · {r.year}</span><p>{r.note}</p></div></li>)}</ol></section>
<div className="survey-end"><a href="/blog/">← 返回 Blog</a><a href="/blog/reasoning-to-muscle-memory/">延伸阅读：Astra 与能力下沉 ↗</a></div>
<script data-static-keep="true" src="/interactives/planner-skill/embed.js" defer/>
</article></PageShell></div>;}
