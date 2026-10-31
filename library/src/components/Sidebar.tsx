import React from 'react';
import type {EntityType} from '../types';
export type NavView=string;
interface Props{currentView?:string;selectedEntityType?:EntityType|null;onNavigateView?:(view:string,type?:EntityType)=>void;pendingExtractionCount?:number;onClose?:()=>void}
export const categories:[EntityType,string][]=[['character','Characters'],['location','Places'],['organization','Organizations'],['culture','Cultures'],['species','Species'],['discovery','Discoveries'],['item','Items'],['structure','Structures'],['room','Rooms'],['event','Events'],['pantheon','Pantheons']];
export function Sidebar({currentView,onNavigateView}:Props){
 const world=['entities','entity_detail','graph','timeline','maps','assets'].includes(currentView||'');
 return <nav className="primary-navigation" aria-label="Library sections">{[['overview','Library',currentView==='overview'],['story_index','Write',['stories','editor','threads'].includes(currentView||'')],['entities','World',world],['notes','Notes',currentView==='notes']].map(([view,label,active])=><button key={String(view)} aria-current={active?'page':undefined} onClick={()=>onNavigateView?.(String(view),view==='entities'?'character':undefined)}>{label}</button>)}</nav>;
}
export function WorldNavigation({view,type,onNavigate}:{view:string;type:EntityType;onNavigate:(view:string,type?:EntityType)=>void}){return <div className="context-navigation"><label>{view==='entities'?'Browse':'Explore'}<select aria-label="World view" value={view==='entities'?type:view} onChange={e=>{const kind=categories.find(([k])=>k===e.target.value);kind?onNavigate('entities',kind[0]):onNavigate(e.target.value);}}><optgroup label="Records">{categories.map(([k,label])=><option key={k} value={k}>{label}</option>)}</optgroup><optgroup label="Explore"><option value="graph">Relationships</option><option value="timeline">Timeline</option><option value="maps">Maps</option><option value="assets">Images</option></optgroup></select></label></div>;}
