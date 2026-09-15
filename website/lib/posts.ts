export type Post = {slug:string;href:string;title:string;description:string;image:string;imageAlt:string;category:string;date:string;readingTime:string;tags:string[]};
export const posts: Post[] = [
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
