import React,{useState} from 'react';
import type {Asset,Entity} from '../types';
import {id,now} from '../services/database';
import {imageURL,imageFile} from '../services/text';
export function AssetLibrary({assets,allEntities,onSaveAsset,onDeleteAsset}:{assets:Asset[];allEntities:Entity[];onSaveAsset:(asset:Asset)=>boolean;onDeleteAsset:(id:string)=>void}){
 const [edit,setEdit]=useState<Asset|null>(null),[error,setError]=useState('');
 return <section className="p-6 space-y-5"><h1>Asset Library & Image Gallery</h1><p>Upload small images to include them in your backups, or reference an HTTPS image. Linked external files remain with their original host.</p><button onClick={()=>setEdit({id:id('asset'),projectId:'',title:'',url:'',tags:[],associatedEntityIds:[],createdAt:now()})}>Add Asset</button>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{assets.map(a=><article key={a.id} className="artdeco-card p-4">{imageURL(a.url)?<img src={imageURL(a.url)} alt={a.title} className="h-40 w-full object-contain" onError={e=>{e.currentTarget.hidden=true;}}/>:<p>Image link unavailable</p>}<h2>{a.title}</h2><p>{a.tags.join(', ')}</p><p>{a.associatedEntityIds.map(id=>allEntities.find(e=>e.id===id)?.name).filter(Boolean).join(', ')}</p><button onClick={()=>setEdit({...a})}>Edit Asset</button><button title="Delete Asset" onClick={()=>onDeleteAsset(a.id)}>Delete Asset</button></article>)}</div>
 {edit&&<div className="modal-overlay"><form role="dialog" aria-modal="true" aria-label="Asset" className="modal-card" onSubmit={e=>{e.preventDefault();if(!imageURL(edit.url)){setError('Choose an image file or an HTTPS image URL from a non-Google host.');return;}if(onSaveAsset(edit)){setEdit(null);setError('');}}}>
 <h2>Image asset</h2><label>Title<input required value={edit.title} onChange={e=>setEdit({...edit,title:e.target.value})}/></label>
 <label>Upload image<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={async e=>{const f=e.target.files?.[0];if(f)try{setEdit({...edit,url:await imageFile(f)});setError('');}catch(e){setError(e.message);}}}/></label>
 <label>Image URL<input required value={edit.url.startsWith('data:')?'[Embedded image]':edit.url} readOnly={edit.url.startsWith('data:')} onChange={e=>setEdit({...edit,url:e.target.value})}/></label>
 {edit.url.startsWith('data:')&&<button type="button" onClick={()=>setEdit({...edit,url:''})}>Use a URL instead</button>}
 <label>Tags (comma separated)<input value={edit.tags.join(', ')} onChange={e=>setEdit({...edit,tags:e.target.value.split(',').map(t=>t.trim())})}/></label>
 <label>Associated entities<select multiple value={edit.associatedEntityIds} onChange={e=>setEdit({...edit,associatedEntityIds:Array.from(e.target.selectedOptions).map(o=>o.value)})}>{allEntities.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</select></label>
 {error&&<p role="alert">{error}</p>}<button type="submit">Save Asset</button><button type="button" onClick={()=>setEdit(null)}>Cancel</button></form></div>}
 </section>;
}
