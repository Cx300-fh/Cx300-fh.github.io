export type Post = {slug:string;href:string;title:string;description:string;image:string;imageAlt:string;category:string;date:string;readingTime:string;tags:string[];languages:string[]};
export const posts: Post[] = [
  {
    slug:'planner-skill-alignment',
    href:'/blog/planner-skill-alignment/',
    title:'Planner × Skill: From Hierarchy to Capability Alignment',
    description:'A survey of how planners understand skill boundaries, how executors follow each invocation, and how long-horizon outcomes inform learning—with an interactive capability atlas.',
    image:'/images/blog/planner-skill-cover.svg',
    imageAlt:'Planner and robot skills linked by capability contracts, verified execution feedback and a separate learning loop',
    category:'Research Survey',
    date:'Oct 18, 2026',
    readingTime:'25 min read',
    tags:['Planner–Skill','Agentic RL','Code as Policy','VLA'],
    languages:['EN','中文']
  },
  {
    slug:'reasoning-to-muscle-memory',
    href:'/blog/reasoning-to-muscle-memory/',
    title:'Astra: Embodiment Is Not Dead',
    description:'GPT-6 Astra may be a powerful System 2 for robots. The harder question is how its first-time reasoning becomes a fast VLA skill—and eventually an embodied reflex.',
    image:'/images/blog/reasoning-muscle-cover.svg',
    imageAlt:'System 2 to System 1 to System 0 skill consolidation diagram',
    category:'Research Note',
    date:'Sep 15, 2026',
    readingTime:'14 min read',
    tags:['GPT-6 Astra','VLA','World Models','Robot Learning'],
    languages:['EN','中文']
  }
];

