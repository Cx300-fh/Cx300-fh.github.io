export type Post = {slug:string;href:string;title:string;description:string;image:string;imageAlt:string;category:string;date:string;readingTime:string;tags:string[]};
export const posts: Post[] = [
  {
    slug:'planner-skill-alignment',
    href:'/blog/planner-skill-alignment/',
    title:'Planner × Skill：从分层执行到能力对齐',
    description:'机器人已经学会分工，但 Planner 是否知道技能的真实边界，技能又是否忠实执行本次调用？一篇围绕能力接口、可靠性与长程归因的交互综述。',
    image:'/images/blog/planner-skill-cover.svg',
    imageAlt:'Planner and robot skills linked by capability contracts, verified execution feedback and a separate learning loop',
    category:'Research Survey',
    date:'Oct 18, 2026',
    readingTime:'25 min read',
    tags:['Planner–Skill','Agentic RL','Code as Policy','VLA']
  },
  {
    slug:'reasoning-to-muscle-memory',
    href:'/blog/reasoning-to-muscle-memory/',
    title:'From Reasoning to Muscle Memory',
    description:'GPT-6 Astra may be a powerful System 2 for robots. The harder question is how its first-time reasoning becomes a fast VLA skill—and eventually an embodied reflex.',
    image:'/images/blog/reasoning-muscle-cover.svg',
    imageAlt:'System 2 to System 1 to System 0 skill consolidation diagram',
    category:'Embodied Intelligence',
    date:'Sep 15, 2026',
    readingTime:'14 min read',
    tags:['GPT-6 Astra','VLA','World Models','Robot Learning']
  }
];

