import { PageShell } from '@/components/site';
import { PaperCard } from '@/components/paper-card';
import { papers } from '@/lib/content';
export const metadata = {title:'Publications — Yuxin Li',description:'Research on memory in video world models and test-time scaling for embodied reasoning.'};
export default function Publications() { return <PageShell active="Publications" eyebrow="RESEARCH / SELECTED PUBLICATIONS" title="Publications" description="On seeing, remembering, and reasoning about the world."><div className="archive-year"><span>2026</span><span>02 PAPERS</span></div><div className="publication-list">{papers.map(p=><PaperCard key={p.slug} paper={p}/>)}</div></PageShell>; }
