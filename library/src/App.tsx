import React, {useState,useEffect,useRef} from 'react';
import {IXITransition,useIXITransition} from './components/IXITransition';
import {Header} from './components/Header';
import {Sidebar} from './components/Sidebar';
import {GlobalSearchModal} from './components/GlobalSearchModal';
import {ContextualSidebar} from './components/ContextualSidebar';
import {Overview} from './components/Overview';
import {EntityList} from './components/EntityList';
import {EntityDetail} from './components/EntityDetail';
import {TemplateManager} from './components/TemplateManager';
import {RelationshipGraph} from './components/RelationshipGraph';
import {StoryManager} from './components/StoryManager';
import {WritingEditor} from './components/WritingEditor';
import {NotesAndExtraction} from './components/NotesAndExtraction';
import {PlotThreadsManager} from './components/PlotThreadsManager';
import {TimelineView} from './components/TimelineView';
import {MapView} from './components/MapView';
import {AssetLibrary} from './components/AssetLibrary';
import {AccessSettings} from './components/AccessSettings';
import * as store from './services/database';
import {entity,commitFacts,removeEntity} from './services/lore';
import type {Entity,EntityType,Scene,ProvenanceReference} from './types';

export default function App(){
  const {phase,travel,busy}=useIXITransition();
  const [initial]=useState(()=>{try{return {db:store.read(),error:''}}catch(e){return {db:null,error:e.message}}});
  const [db,setDb]=useState(initial.db);
  const current=useRef(db);current.current=db;
  const [error,setError]=useState(initial.error),[saved,setSaved]=useState('Stored on this device');
  const [view,changeView]=useState('overview'),[type,setType]=useState<EntityType>('character'),[selected,setSelected]=useState('');
  const [sceneId,setSceneId]=useState(''),[noteId,setNoteId]=useState(''),[storyId,setStoryId]=useState(''),[source,setSource]=useState<ProvenanceReference|null>(null);
  const [search,setSearch]=useState(false),[pins,setPins]=useState(false),[history,setHistory]=useState(false),[menu,setMenu]=useState(false);
  const [dirty,setDirty]=useState(false);
  const [undo,setUndo]=useState<store.Database|null>(null);
  const commit=(next:store.Database,destructive=false)=>{
    try {const written=store.save(next);if(destructive)setUndo(current.current);current.current=written;setDb(written);setError('');setSaved('Saved on this device');return true;}
    catch(e){setError(e.message);setSaved('Not saved');return false;}
  };
  useEffect(()=>{const listener=(e:StorageEvent)=>{if(e.key===store.KEY)setError('Library changed in another tab. Export any unsaved work, then reload to continue.');};window.addEventListener('storage',listener);return()=>window.removeEventListener('storage',listener);},[]);
  useEffect(()=>{const listener=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',listener);return()=>window.removeEventListener('beforeunload',listener);},[dirty]);
  useEffect(()=>{const listener=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSearch(v=>!v);}if(e.key==='Escape'){setSearch(false);setPins(false);setHistory(false);setMenu(false);}};window.addEventListener('keydown',listener);return()=>window.removeEventListener('keydown',listener);},[]);
  const setView=(next:string)=>travel(()=>changeView(next));
  const leave=()=>{if(dirty&&!window.confirm('Leave without saving these edits?'))return false;setDirty(false);return true;};
  const navigate=(next:string,nextType?:EntityType,target='')=>{
    if(busy.current||!leave())return;
    const map={entity_list:'entities',template_manager:'templates',relationship_graph:'graph',story_database:'stories',plot_threads:'threads',map_system:'maps',notes_ingestion:'notes',extraction_queue:'notes',asset_library:'assets'};
    const actual=map[next]||next;
    setMenu(false);setSearch(false);travel(()=>{changeView(actual);if(nextType)setType(nextType);setSelected(actual==='entity_detail'?target:'');});
    if(current.current){const d=store.copy(current.current);d.history=[{type:actual==='entity_detail'?'entity':'view',targetId:target||actual,title:actual==='entity_detail'?d.entities.find(e=>e.id===target)?.name||'Entity':actual,projectId:d.activeProjectId,timestamp:Date.now()},...d.history.filter(h=>!(h.targetId===(target||actual)&&h.projectId===d.activeProjectId))].slice(0,50) as any;commit(d);}
  };
  if(!db)return <main className="p-8"><h1>Library recovery</h1><p role="alert">{error}</p><p>Your stored records have not been replaced.</p><button onClick={()=>store.download('phoenixi-raw-recovery.json',store.rawBackup())}>Download recovery data</button></main>;
  const data=store.scope(db),project=db.projects.find(p=>p.id===db.activeProjectId)!;
  const put=(key:store.Collection,row:any)=>{
    const d=store.copy(current.current!);
    const updated={...row,projectId:d.activeProjectId};
    if(d[key].some((r:any)=>r.id===updated.id&&r.projectId!==d.activeProjectId))updated.id=store.id(key);
    if('updatedAt' in updated)updated.updatedAt=store.now();
    d[key]=store.upsert(d[key] as any[],updated) as any;
    return commit(d);
  };
  const remove=(key:store.Collection,id:string)=>{
    if(!window.confirm('Delete this record? You can undo the last deletion.'))return;
    const d=store.copy(current.current!);d[key]=d[key].filter((r:any)=>r.id!==id) as any;
    if(key==='stories'){d.plotThreads=d.plotThreads.filter(t=>t.storyId!==id);}
    d.bookmarks=d.bookmarks.filter(b=>b.targetId!==id);
    commit(d,true);
  };
  const selectEntity=(id:string)=>navigate('entity_detail',undefined,id);
  const sourceNavigate=(ref:ProvenanceReference)=>{
    if(!leave())return;setSource(ref);
    if(ref.sourceType==='note'){setNoteId(ref.sourceId);setView('notes');}
    else if(ref.sourceType==='scene'){setSceneId(ref.sourceId);setView('editor');}
    else {setStoryId(ref.sourceId);setView('stories');}
  };
  const selectedEntity=data.entities.find(e=>e.id===selected);
  const scene=data.stories.flatMap(s=>s.chapters.flatMap(c=>c.scenes)).find(s=>s.id===sceneId);
  const onScene=(updated:Scene)=>{
    const d=store.copy(current.current!);
    for(const s of d.stories)for(const c of s.chapters)if(c.scenes.some(sc=>sc.id===updated.id)){c.scenes=c.scenes.map(sc=>sc.id===updated.id?updated:sc);s.updatedAt=store.now();}
    const ok=commit(d);if(ok)setDirty(false);return ok;
  };
  return <div className="library-app">
    <a href="#library-workspace" className="library-skip">Skip to workspace</a><div className="library-atmosphere" aria-hidden="true"><i/><i/></div><div className="library-frame" aria-hidden="true"/>
    <Header transitioning={phase!=='idle'} menuOpen={menu} projects={db.projects} activeProject={project} database={db}
      onSelectProject={id=>{if(!leave())return;if(commit({...current.current!,activeProjectId:id})){setView('overview');setSource(null);setSelected('');setUndo(null);}}}
      onProjectCreated={p=>{if(!leave())return;if(commit({...current.current!,projects:[...current.current!.projects,p],activeProjectId:p.id})){setView('overview');setUndo(null);}}}
      onRestore={next=>{if(!leave())return false;const ok=commit({...next,revision:current.current!.revision},true);if(ok){setView('overview');setSource(null);}return ok;}}
      onOpenSearch={()=>setSearch(true)} onToggleContextualSidebar={()=>setPins(v=>!v)} onToggleHistory={()=>setHistory(v=>!v)} onMenu={()=>setMenu(v=>!v)} />
    <div className="save-status" aria-live="polite"><span>{dirty?'Unsaved edits':saved}</span>
      {undo&&<button onClick={()=>{if(commit({...undo,revision:current.current!.revision})){setUndo(null);setView('overview');}}}>Undo last deletion / restore</button>}
    </div>
    {error&&<div role="alert" className="error-banner">{error}<button onClick={()=>store.download('phoenixi-unsaved-recovery.json',store.backup(current.current!))}>Export current library</button></div>}
    <div className="workspace" inert={phase!=='idle'}>
      {menu&&<button className="navigation-backdrop" aria-label="Close navigation" onClick={()=>setMenu(false)}/>}
      <div id="library-navigation" className={'navigation '+(menu?'navigation-open':'')}><Sidebar onClose={()=>setMenu(false)} currentView={view} selectedEntityType={type} onNavigateView={navigate} pendingExtractionCount={data.extractedFacts.filter(f=>f.status==='PROPOSED').length}/></div>
      <main key={project.id} id="library-workspace" tabIndex={-1} className="workspace-content" data-view={view} aria-busy={phase!=='idle'}>
        {view==='overview'&&<Overview project={project} {...data} onSelectEntity={selectEntity} onNavigateView={navigate}/>}
        {view==='entities'&&<EntityList entityType={type} entities={data.entities} onSelectEntity={selectEntity} onCreateEntity={t=>{const e=entity(project.id,t||type,'New '+(t||type));if(put('entities',e))selectEntity(e.id);}}/>}
        {view==='entity_detail'&&selectedEntity&&<EntityDetail key={selectedEntity.id} entity={selectedEntity} allEntities={data.entities} templates={data.templates}
          onSaveEntity={e=>{const ok=put('entities',e);if(ok)setDirty(false);return ok;}} onDirtyChange={setDirty}
          onDeleteEntity={id=>{if(window.confirm('Delete this entity and remove its links? The last deletion can be undone.')&&commit(removeEntity(current.current!,id),true)){setDirty(false);setView('entities');}}}
          onBack={()=>navigate('entities')} onSelectRelatedEntity={selectEntity} onNavigateToSource={sourceNavigate}
          onToggleBookmark={e=>{const d=store.copy(current.current!);const exists=d.bookmarks.some(b=>b.targetId===e.id&&b.projectId===project.id);d.bookmarks=exists?d.bookmarks.filter(b=>b.targetId!==e.id):[...d.bookmarks,{id:store.id('bookmark'),type:'entity',targetId:e.id,title:e.name,projectId:project.id}];commit(d);}}
          isBookmarked={db.bookmarks.some(b=>b.targetId===selectedEntity.id&&b.projectId===project.id)}/>}
        {view==='templates'&&<TemplateManager templates={data.templates} onSaveTemplate={t=>put('templates',t)} onDirtyChange={setDirty}/>}
        {view==='graph'&&<RelationshipGraph entities={data.entities} onSelectEntity={selectEntity}/>}
        {view==='stories'&&<StoryManager key={storyId} initialStoryId={storyId} stories={data.stories} allEntities={data.entities} onSaveStory={s=>put('stories',s)} onDeleteStory={id=>remove('stories',id)} onEditScene={s=>{if(!leave())return;setSceneId(s.id);setStoryId(data.stories.find(story=>story.chapters.some(c=>c.scenes.some(sc=>sc.id===s.id)))?.id||'');setView('editor');}}/>}
        {view==='editor'&&(scene?<WritingEditor key={scene.id} scene={scene} allEntities={data.entities} onSaveScene={onScene} onDirtyChange={setDirty} onBack={()=>navigate('stories')}/>:<p className="p-6">This scene is no longer available.</p>)}
        {view==='notes'&&<NotesAndExtraction key={noteId} initialNoteId={noteId} source={source} {...data} allEntities={data.entities}
          onSaveNote={n=>put('notes',n)} onDeleteNote={id=>remove('notes',id)}
          onCommitApprovedFacts={facts=>{try{return commit(commitFacts(current.current!,facts));}catch(e){setError(e.message);return false;}}}
          onResolveConflict={(id,choice)=>{const d=store.copy(current.current!);const c=d.canonConflicts.find(c=>c.id===id);if(!c)return;const e=d.entities.find(e=>e.id===c.entityId||(e.projectId===project.id&&e.name===c.entityName));if(!e){setError('The conflict entity no longer exists.');return;}const value=choice==='resolved_A'?c.factA:c.factB;if(!['description','status','dateText','approximateDateText','personality','motivation','history','appearance','biology','habitat','values','customs','traditions','rituals','language','mythology','socialStructures','mechanism','consequences','domains'].includes(c.attributeName)){setError('Unsupported conflict field.');return;}e[c.attributeName]=value.text;e.updatedAt=store.now();e.sourceReferences.push(value.source);c.status=choice;c.resolvedValue=value.text;if(c.factId)d.extractedFacts=d.extractedFacts.map(f=>f.id===c.factId?{...f,status:choice==='resolved_B'?'APPROVED':'REJECTED',canonState:choice==='resolved_B'?(f.evidenceClassification==='EXPLICIT'?'CANON':'UNVERIFIED'):'REJECTED'}:f);commit(d);}}
          onNavigateToSource={sourceNavigate} onLog={log=>put('extractionLogs',log)}/>}
        {view==='threads'&&<PlotThreadsManager plotThreads={data.plotThreads} stories={data.stories} allEntities={data.entities} onSavePlotThread={t=>put('plotThreads',t)} onDelete={id=>remove('plotThreads',id)}/>}
        {view==='timeline'&&<TimelineView allEntities={data.entities} onSaveEntity={e=>put('entities',e)} onSelectEntity={selectEntity}/>}
        {view==='maps'&&<MapView maps={data.maps} allEntities={data.entities} onSaveMap={m=>put('maps',m)} onDelete={id=>remove('maps',id)} onSelectLocationEntity={selectEntity}/>}
        {view==='assets'&&<AssetLibrary assets={data.assets} allEntities={data.entities} onSaveAsset={a=>put('assets',a)} onDeleteAsset={id=>remove('assets',id)}/>}
        {view==='access'&&<AccessSettings/>}
      </main>
    </div>
    <ContextualSidebar isOpen={pins} activeTab="bookmarks" onClose={()=>setPins(false)} bookmarks={db.bookmarks.filter(b=>b.projectId===project.id).map(b=>({...b,title:data.entities.find(e=>e.id===b.targetId)?.name||b.title}))} history={[]} onSelectBookmark={b=>{selectEntity(b.targetId);setPins(false);}} onSelectHistory={()=>{}} onRemoveBookmark={id=>commit({...current.current!,bookmarks:current.current!.bookmarks.filter(b=>b.targetId!==id)})}/>
    {history&&<div role="dialog" aria-label="Navigation history" className="history-panel"><button onClick={()=>setHistory(false)}>Close history</button>{db.history.filter(h=>h.projectId===project.id).map((h,i)=><button key={i} onClick={()=>{h.type==='entity'?selectEntity(h.targetId):navigate(h.targetId);setHistory(false);}}>{h.title}</button>)}</div>}
    <GlobalSearchModal isOpen={search} onClose={()=>setSearch(false)} {...data} onSelectEntity={selectEntity} onSelectStory={id=>{if(!leave())return;setStoryId(id);setView('stories');setSearch(false);}} onSelectNote={id=>{if(!leave())return;setNoteId(id);setSource(null);setView('notes');setSearch(false);}}/>
    <IXITransition phase={phase}/>
  </div>;
}
