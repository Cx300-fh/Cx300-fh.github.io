import { PageShell } from '@/components/site';
import { ChineseSurvey } from './chinese';
import { EnglishSurvey } from './english';
import '../reasoning-to-muscle-memory/essay.css';
import './survey.css';

export const metadata = {
  title:'Planner × Skill: From Hierarchy to Capability Alignment — Yuxin Li',
  description:'A bilingual survey of planner–skill interfaces, conditional reliability, invocation fidelity, and long-horizon credit assignment, with an interactive capability atlas.',
  alternates:{canonical:'https://cx300-fh.github.io/blog/planner-skill-alignment/'}
};
export default function Post(){return <div className="planner-survey-page"><PageShell active="Blog" eyebrow="RESEARCH SURVEY / PLANNING × EMBODIED SKILLS" title="Planner × Skill: From Hierarchy to Capability Alignment" description="Understanding what a skill can reliably do—and making sure it follows the particular request. A survey with an interactive capability atlas."><article className="research-essay planner-survey">
<div className="essay-meta">OCTOBER 18, 2026 · YUXIN LI · RESEARCH SURVEY</div>
<input className="lang-radio-zh" type="radio" name="survey-language" id="lang-zh" defaultChecked aria-label="Read in Chinese"/>
<input className="lang-input" type="radio" name="survey-language" id="lang-toggle" aria-label="Read in English"/>
<div className="lang-switch" role="group" aria-label="Article language"><label className="lang-zh" htmlFor="lang-zh" lang="zh-CN">中文</label><label className="lang-en" htmlFor="lang-toggle" lang="en">EN</label></div>
<div className="lang-content chinese" lang="zh-CN"><ChineseSurvey/></div>
<div className="lang-content english" lang="en"><EnglishSurvey/></div>
<script data-static-keep="true" src="/interactives/planner-skill/embed.js" defer/>
</article></PageShell></div>;}
