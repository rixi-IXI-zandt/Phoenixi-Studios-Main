import React from 'react';
import type {Entity,Story,Note,ExtractedFact,CanonConflict,Project,EntityType} from '../types';
import crest from '../assets/IXI-Crest.png';
interface Props {project?:Project|null;entities?:Entity[];stories?:Story[];notes?:Note[];extractedFacts?:ExtractedFact[];canonConflicts?:CanonConflict[];onNavigateView?:(view:string,type?:EntityType)=>void;onSelectEntity?:(id:string)=>void;onSelectNote?:(id:string)=>void}
export function Overview({project,entities=[],stories=[],notes=[],extractedFacts=[],canonConflicts=[],onNavigateView,onSelectEntity}:Props){
 const pending=extractedFacts.filter(f=>f.status==='PROPOSED').length,conflicts=canonConflicts.filter(c=>c.status==='unresolved').length;
 return <div className="library-overview">
 <header className="library-intro"><div><p className="ixi-eyebrow">PHOENIXI LIBRARY · {project?.name}</p><h1>A place for<br/>your worlds.</h1><div className="ixi-rule"><i/></div><p className="reading-copy">{project?.description||'Write your stories. Connect your characters, places and histories. Keep the sources that give your world its shape.'}</p></div><img src={crest} alt="" className="library-crest"/></header>
 <nav className="library-destinations" aria-label="Start creating">
 <button onClick={()=>onNavigateView?.('stories')}><span className="ixi-eyebrow">I · WRITE</span><strong>Stories & chapters</strong><span>{stories.length} {stories.length===1?"story":"stories"} <b aria-hidden="true">↗</b></span></button>
 <button onClick={()=>onNavigateView?.('entities','character')}><span className="ixi-eyebrow">II · BUILD</span><strong>World records</strong><span>{entities.length} records <b aria-hidden="true">↗</b></span></button>
 <button onClick={()=>onNavigateView?.('notes')}><span className="ixi-eyebrow">III · CONNECT</span><strong>Notes & sources</strong><span>{notes.length} notes <b aria-hidden="true">↗</b></span></button>
 </nav>
 <div className="overview-columns"><section><h2>Recently edited</h2>{entities.length?<div className="recent-records">{[...entities].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).slice(0,6).map(e=><button key={e.id} onClick={()=>onSelectEntity?.(e.id)}><span>{e.name}<small>{e.type}</small></span><span aria-hidden="true">↗</span></button>)}</div>:<p className="reading-copy">Your library starts with you. Create a story or your first world record to begin.</p>}</section><section><h2>Source review</h2><p>{pending} proposals awaiting review<br/>{conflicts} unresolved conflicts</p><button className="ixi-text-action" onClick={()=>onNavigateView?.('notes')}>Review sources ↗</button></section></div>
 <p className="local-storage-note">Saved in this browser, on this device. Use Backup / Export to keep a copy or move your work.</p>
 </div>;
}

