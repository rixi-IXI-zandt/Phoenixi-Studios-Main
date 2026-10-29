import React,{useState} from 'react';
import type {Entity} from '../types';
import {entity} from '../services/lore';
export function TimelineView({allEntities,onSaveEntity,onSelectEntity}:{allEntities:Entity[];onSaveEntity:(e:Entity)=>boolean;onSelectEntity:(id:string)=>void}){
 const [adding,setAdding]=useState(false),[title,setTitle]=useState(''),[date,setDate]=useState(''),[description,setDescription]=useState(''),[order,setOrder]=useState(''),[location,setLocation]=useState('');
 const events=allEntities.filter(e=>e.type==='event').sort((a,b)=>(a.customStats?.timelineOrder??Infinity)-(b.customStats?.timelineOrder??Infinity)||a.name.localeCompare(b.name));
 return <div className="p-6 space-y-6"><h1>Timeline & World Historical Events</h1><p>Dates preserve your world's own wording. Set a numeric sequence to order events across fictional eras.</p><button onClick={()=>setAdding(true)}>Add Historical Event</button>
 {events.length===0&&<p>No events yet.</p>}
 {events.map(e=><article key={e.id} className="artdeco-card p-4"><button onClick={()=>onSelectEntity(e.id)}>{e.name}</button><p>{e.dateText||'Date unspecified'}</p><p>{e.description}</p><small>{e.locationId?allEntities.find(x=>x.id===e.locationId)?.name:''}</small></article>)}
 {adding&&<div className="modal-overlay"><form role="dialog" aria-modal="true" aria-label="Add Historical Event" className="modal-card" onSubmit={e=>{e.preventDefault();const row={...entity('', 'event',title.trim()),description,dateText:date,locationId:location,customStats:order===''?{}:{timelineOrder:Number(order)}};if(onSaveEntity(row)){setAdding(false);setTitle('');setDate('');setDescription('');setOrder('');}}}>
 <h2>Add Historical Event</h2><label>Event Title<input required value={title} onChange={e=>setTitle(e.target.value)}/></label><label>Date / era<input required value={date} onChange={e=>setDate(e.target.value)}/></label><label>Timeline sequence<input type="number" value={order} onChange={e=>setOrder(e.target.value)}/></label><label>Description<textarea value={description} onChange={e=>setDescription(e.target.value)}/></label><label>Location<select value={location} onChange={e=>setLocation(e.target.value)}><option value="">Not set</option>{allEntities.filter(e=>e.type==='location').map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select></label><button type="submit">Save Event</button><button type="button" onClick={()=>setAdding(false)}>Cancel</button></form></div>}
 </div>;
}

