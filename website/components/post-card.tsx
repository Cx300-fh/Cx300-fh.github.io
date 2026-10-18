import { ArrowUpRight } from 'lucide-react';
import { Tags } from '@/components/site';
import type { Post } from '@/lib/posts';
export function PostCard({post:p,level=2}:{post:Post;level?:2|3}){
  const Heading=level===3?'h3':'h2';
  return <article className="content-card post-card"><a className="card-cover note-cover" href={p.href}><img src={p.image} alt={p.imageAlt} loading="lazy"/>{p.slug!=='planner-skill-alignment'&&<span className="image-badge">{p.category}</span>}</a><div className="card-body"><div className="post-meta-row"><p className="paper-meta">{p.date} · {p.readingTime}</p><span className="post-languages" aria-label="Available in English and Chinese">{p.languages.join(' / ')}</span></div><Heading className="post-title"><a href={p.href}>{p.title}<ArrowUpRight size={20}/></a></Heading><p>{p.description}</p><Tags items={p.tags}/><a className="text-link" href={p.href}>Read {p.category==='Research Survey'?'survey':'note'} <ArrowUpRight size={14}/></a></div></article>;
}
