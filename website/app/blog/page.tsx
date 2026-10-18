import { ArrowUpRight } from 'lucide-react';
import { PageShell } from '@/components/site';
import { posts } from '@/lib/posts';
import { PostCard } from '@/components/post-card';
export const metadata = {title:'Blog — Yuxin Li',description:'Bilingual research essays and surveys on embodied intelligence, world models, and robot learning.'};
export default function Blog() { return <PageShell active="Blog" eyebrow="WRITING / RESEARCH NOTES & SURVEYS" title="Blog" description="Essays and surveys on embodied intelligence, world models, and robot learning. Full text in English and Chinese.">{posts.length ? <><div className="archive-year"><span>2026</span><span>{posts.length} ARTICLES · EN / 中文</span></div><div className="blog-grid">{posts.map(p=><PostCard key={p.slug} post={p}/>)}</div></> : <div className="blog-empty"><span className="eyebrow">THE NOTEBOOK / 00</span><h2>A blank page,<br/><em>for now.</em></h2><p>No posts yet. More to come.</p><a className="text-link" href="/publications/">Explore my research in the meantime <ArrowUpRight size={14}/></a></div>}</PageShell>; }

