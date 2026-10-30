import React,{useState} from 'react';
import type {Project} from '../types';
import * as store from '../services/database';
interface Props {transitioning:boolean;menuOpen:boolean;projects:Project[];activeProject:Project;database:store.Database;onSelectProject:(id:string)=>void;onProjectCreated:(p:Project)=>void;onRestore:(db:store.Database)=>boolean;onOpenSearch:()=>void;onToggleContextualSidebar:()=>void;onToggleHistory:()=>void;onMenu:()=>void}
export function Header(p:Props){
 const [panel,setPanel]=useState(''),[name,setName]=useState(''),[raw,setRaw]=useState(''),[error,setError]=useState(''),[preview,setPreview]=useState<store.Database|null>(null);
 const validate=()=>{try{const next=store.restore(raw,p.database);setPreview(next);setError('');}catch(e){setPreview(null);setError(e.message);}};
 return <header className="library-header" inert={p.transitioning}>
  <a className="library-wordmark" href="../worlds/" aria-label="IXI Worlds"><span>IXI</span><span>Phoenixi Library</span></a>
  <button onClick={p.onMenu} className="mobile-menu" aria-label="Toggle navigation" aria-expanded={p.menuOpen} aria-controls="library-navigation">Menu</button>
  <select aria-label="Active project" value={p.activeProject.id} onChange={e=>p.onSelectProject(e.target.value)}>{p.projects.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}</select>
  <button onClick={()=>{setPanel('project');setName('');}}>New project</button>
  <div className="header-actions"><button onClick={p.onOpenSearch}>Global Search <kbd>Ctrl K</kbd></button><button onClick={()=>{setPanel('backup');setError('');setPreview(null);}}>Backup / Export</button><button onClick={p.onToggleContextualSidebar} title="Pinned Bookmarks">Bookmarks</button><button onClick={p.onToggleHistory} title="Navigation History">History</button></div>
  {panel&&<div className="modal-overlay" onKeyDown={e=>{if(e.key==='Escape')setPanel('');}}><section role="dialog" aria-modal="true" aria-label={panel==='project'?'New project':'Backup and restore'} className="modal-card">
   <button className="float-right" onClick={()=>setPanel('')}>Close</button>
   {panel==='project'?<form onSubmit={e=>{e.preventDefault();if(name.trim()){p.onProjectCreated(store.project(name.trim()));setPanel('');}}}><h2>New project</h2><label>Project name<input autoFocus required value={name} onChange={e=>setName(e.target.value)}/></label><button type="submit">Create Project</button></form>:<>
   <h2>Library backup & recovery</h2><p>Writing is stored in this browser on this device. Download regular backups. A different device or site address has a separate library.</p>
   <button onClick={()=>store.download('phoenixi-library-'+new Date().toISOString().slice(0,10)+'.json',store.backup(p.database))}>Export JSON</button>
   <button onClick={()=>store.download('phoenixi-raw-recovery.json',store.rawBackup())}>Export raw recovery</button>
   <h3>Restore a backup</h3><p>A full-library restore replaces this library. A legacy project backup replaces only its matching project. Download your current backup first.</p>
   <label>Backup file<input type="file" accept=".json,application/json" onChange={async e=>{const f=e.target.files?.[0];if(f){setRaw(await f.text());setPreview(null);}}}/></label>
   <textarea aria-label="Backup JSON" rows={5} value={raw} onChange={e=>{setRaw(e.target.value);setPreview(null);}} placeholder="Or paste backup JSON here"/>
   <button onClick={validate}>Check backup</button>
   {preview&&<div><p>{preview.projects.length} projects; {preview.entities.length} entities; {preview.stories.length} stories; {preview.notes.length} notes; {preview.maps.length} maps; {preview.assets.length} assets. Validation passed.</p><button onClick={()=>{store.download('phoenixi-before-restore.json',store.backup(p.database));if(p.onRestore(preview)){setPanel('');setRaw('');setPreview(null);}}}>Restore checked backup</button></div>}
   {error&&<p role="alert">{error}</p>}
   </>}
  </section></div>}
 </header>;
}

