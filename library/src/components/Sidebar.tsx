import React from 'react';
import type {EntityType} from '../types';
export type NavView=string;
interface Props {currentView?:string;selectedEntityType?:EntityType|null;onNavigateView?:(view:string,type?:EntityType)=>void;pendingExtractionCount?:number;unresolvedConflictCount?:number;onClose?:()=>void}
const categories:[EntityType,string][]=[['character','Characters'],['organization','Organizations'],['location','Locations'],['culture','Cultures & Lenses'],['species','Species'],['discovery','Discoveries / Magic'],['item','Items & Artifacts'],['structure','Structures'],['room','Rooms'],['event','Event Records'],['pantheon','Pantheons & Deities']];
export function Sidebar({currentView,selectedEntityType,onNavigateView,pendingExtractionCount=0,onClose}:Props){
 const link=(view:string,label:string,type?:EntityType)=>{const active=type?currentView==='entities'&&selectedEntityType===type:currentView===view||(view==='stories'&&currentView==='editor');return <button key={label} aria-current={active?'page':undefined} onClick={()=>onNavigateView?.(view,type)}><span>{label}</span><span aria-hidden="true">{active?'◆':'↗'}</span></button>;};
 return <aside aria-label="Library navigation"><button className="nav-close" onClick={onClose}>Close navigation ×</button>
 <a className="studio-return" href="../worlds/">← IXI Worlds</a>
 <nav>
 <section><h2><span>I</span> Library</h2>{link('overview','Project Overview')}{link('stories','Stories, Chapters & Editor')}{link('notes','Notes & Narrative Ingestion')}{pendingExtractionCount>0&&<p className="nav-note">{pendingExtractionCount} proposals awaiting review</p>}</section>
 <section><h2><span>II</span> World records</h2>{categories.map(([type,label])=>link('entities',label,type))}</section>
 <section><h2><span>III</span> Connections</h2>{link('graph','Relationship Graph')}{link('threads','Plot & Unresolved Threads')}{link('timeline','Timeline & Events')}{link('maps','Maps & Locations')}{link('assets','Asset Library')}</section>
 <section><h2><span>IV</span> Structure</h2>{link('templates','Templates & Fields')}{link('access','Access infrastructure')}</section>
 </nav><p className="nav-footnote">PHOENIXI STUDIOS<br/>CREATE · IMAGINE · BUILD</p></aside>;
}
