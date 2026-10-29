import type {Project,Entity,Story,Note,CustomTemplate,PlotThread,MapObject,Asset,ExtractedFact,CanonConflict,ExtractionLog,Bookmark,NavigationHistoryItem} from '../types';
export const KEY='phoenixi_library_v2', RECOVERY='phoenixi_library_recovery';
export const kinds=['character','organization','location','culture','species','discovery','item','structure','room','pantheon','event','note'];
export const collections=['entities','stories','notes','templates','plotThreads','maps','assets','extractedFacts','canonConflicts','extractionLogs'] as const;
export type Collection=typeof collections[number];
export interface Data {entities:Entity[];stories:Story[];notes:Note[];templates:CustomTemplate[];plotThreads:PlotThread[];maps:MapObject[];assets:Asset[];extractedFacts:ExtractedFact[];canonConflicts:CanonConflict[];extractionLogs:ExtractionLog[]}
export interface Database extends Data {version:2;revision:number;projects:Project[];activeProjectId:string;bookmarks:(Bookmark&{projectId:string})[];history:(NavigationHistoryItem&{projectId:string})[]}
export const id=(prefix:string)=>`${prefix}-${crypto.randomUUID()}`;
export const now=()=>new Date().toISOString();
export const blank=():Data=>({entities:[],stories:[],notes:[],templates:[],plotThreads:[],maps:[],assets:[],extractedFacts:[],canonConflicts:[],extractionLogs:[]});
export const project=(name='My Library'):Project=>({id:id('project'),name,description:'',createdAt:now(),updatedAt:now()});
export const copy=<T,>(v:T):T=>JSON.parse(JSON.stringify(v));
function check(ok:any,message:string):asserts ok {if(!ok)throw new Error(message);}
const obj=(x:any)=>x&&typeof x==='object'&&!Array.isArray(x);
const text=(x:any,keys:string[])=>keys.forEach(k=>check(typeof x?.[k]==='string',`Invalid ${k}: expected text.`));
const list=(x:any)=>Array.isArray(x)&&x.every(v=>typeof v==='string');
const canonical=['CANON','PROPOSED','UNVERIFIED','CONFLICTING','REJECTED','UNKNOWN'];
function refs(x:any){check(Array.isArray(x),'Sources must be a list.');x.forEach((r:any)=>{text(r,['id','sourceId','sourceTitle','sourceType','passageSnippet','timestamp']);check(['note','story','scene'].includes(r.sourceType),'Unknown source kind.');});}
export function validate(db:any):asserts db is Database {
  check(obj(db)&&db.version===2,'Unsupported library format.');check(Number.isInteger(db.revision)&&db.revision>=0,'Invalid revision.');
  check(Array.isArray(db.projects)&&db.projects.length>0,'At least one project is required.');const projects=new Set();
  db.projects.forEach((p:any)=>{text(p,['id','name','description','createdAt','updatedAt']);check(p.id&&p.name.trim()&&!projects.has(p.id),'Empty or duplicate project.');projects.add(p.id);});
  check(projects.has(db.activeProjectId),'Active project is missing.');
  for(const key of collections){check(Array.isArray(db[key]),`${key} must be a list.`);const ids=new Set();
    for(const r of db[key]){text(r,['id','projectId']);check(r.id&&!ids.has(r.id),'Duplicate or empty record ID.');ids.add(r.id);check(projects.has(r.projectId),'Record belongs to an unknown project.');
      if(key==='entities'){
        text(r,['name','description','status','createdAt','updatedAt']);check(kinds.includes(r.type)&&canonical.includes(r.canonState),'Invalid entity type or canon state.');
        for(const k of ['aliases','tags','images'])check(list(r[k]),`Invalid ${k}.`);check(obj(r.customFields)&&obj(r.customStats),'Invalid entity fields.');refs(r.sourceReferences);
        check(Array.isArray(r.relationships),'Invalid relationships.');r.relationships.forEach((v:any)=>{text(v,['id','sourceId','targetId','relationshipType']);check(['directed','bi-directional'].includes(v.direction),'Invalid direction.');refs(v.sourceReferences);});
        if(r.culturalLenses!==undefined){check(Array.isArray(r.culturalLenses),'Invalid perspectives.');r.culturalLenses.forEach((v:any)=>{text(v,['id','targetEntityId','targetEntityName','perspectiveText']);refs(v.sourceReferences);});}
      }
      if(key==='stories'){
        text(r,['title','description','plot','summary','updatedAt']);check(['Draft','In Progress','Completed','Archived'].includes(r.status),'Invalid story status.');check(list(r.tags)&&list(r.participatingEntityIds)&&Array.isArray(r.chapters),'Invalid story structure.');
        const cs=new Set(),ss=new Set();r.chapters.forEach((c:any)=>{text(c,['id','storyId','title','summary']);check(c.storyId===r.id&&!cs.has(c.id),'Invalid chapter parent or duplicate ID.');cs.add(c.id);check(Array.isArray(c.scenes),'Invalid scenes.');c.scenes.forEach((s:any)=>{text(s,['id','chapterId','title','prose','summary','updatedAt']);check(s.chapterId===c.id&&!ss.has(s.id),'Invalid scene parent or duplicate ID.');ss.add(s.id);check(list(s.tags)&&list(s.appearingCharacterIds),'Invalid scene links.');});});
      }
      if(key==='notes'){text(r,['title','content','updatedAt']);check(list(r.tags)&&list(r.entityReferences),'Invalid note links.');}
      if(key==='templates'){text(r,['name','entityType']);check(kinds.includes(r.entityType)&&Array.isArray(r.fields),'Invalid template.');const fields=new Set();r.fields.forEach((f:any)=>{text(f,['id','name','fieldType']);check(!fields.has(f.id),'Duplicate template field.');fields.add(f.id);check(['text','longtext','number','boolean','date','select','multiselect','entity_ref','entity_ref_list','image','url','richtext'].includes(f.fieldType),'Unsupported field type.');if(f.options!==undefined)check(list(f.options),'Invalid field options.');});}
      if(key==='maps'){text(r,['title']);check(Array.isArray(r.markers),'Invalid map markers.');r.markers.forEach((m:any)=>{text(m,['id','locationId']);check(Number.isFinite(m.x)&&Number.isFinite(m.y)&&m.x>=0&&m.x<=100&&m.y>=0&&m.y<=100,'Invalid marker position.');});}
      if(key==='assets'){text(r,['title','url','createdAt']);check(list(r.tags)&&list(r.associatedEntityIds),'Invalid asset links.');}
      if(key==='plotThreads'){text(r,['title','storyId','description']);check(list(r.associatedSceneIds)&&list(r.associatedCharacterIds),'Invalid thread links.');check(['active','unresolved','resolved'].includes(r.status),'Invalid thread status.');}
      if(key==='extractedFacts'){text(r,['sourceNoteId','sourceNoteTitle','entityName','factDetail','sourcePassage','timestamp']);check(kinds.includes(r.entityType)&&['entity','relationship','event','attribute'].includes(r.factType),'Invalid fact type.');check(['PROPOSED','APPROVED','REJECTED','CONFLICTING'].includes(r.status)&&canonical.includes(r.canonState),'Invalid fact status.');check(['EXPLICIT','INFERRED','UNRESOLVED'].includes(r.evidenceClassification),'Invalid evidence class.');}
      if(key==='canonConflicts'){text(r,['entityName','attributeName']);check(['unresolved','resolved_A','resolved_B'].includes(r.status),'Invalid conflict status.');text(r.factA,['text']);text(r.factB,['text']);refs([r.factA.source,r.factB.source]);}
      if(key==='extractionLogs'){text(r,['timestamp','sourceNoteTitle']);for(const k of ['entitiesFound','relationshipsFound','eventsFound','pendingReview','conflictsCount','unresolvedCount'])check(Number.isFinite(r[k]),'Invalid review log.');}
    }
  }
  check(Array.isArray(db.bookmarks)&&Array.isArray(db.history),'Invalid navigation data.');
  db.bookmarks.forEach((b:any)=>text(b,['id','projectId','type','targetId','title']));db.history.forEach((h:any)=>text(h,['projectId','type','targetId','title']));
}
export function read():Database {
  const raw=localStorage.getItem(KEY);if(raw){const db=JSON.parse(raw);validate(db);return db;}
  const old=(key:string,fallback:any)=>{const v=localStorage.getItem('loreforge_v1_'+key);return v===null?fallback:JSON.parse(v);};
  const p=project(),db:any={...blank(),version:2,revision:0,projects:old('projects',[]),activeProjectId:old('active_project_id',''),bookmarks:[],history:[]};
  const names={plotThreads:'plot_threads',extractedFacts:'extracted_facts',canonConflicts:'canon_conflicts',extractionLogs:'extraction_logs'};
  for(const k of collections){const rows=old(names[k]||k,[]);check(Array.isArray(rows),`Legacy ${k} is damaged. Export raw recovery before changing it.`);db[k]=[...new Map(rows.map((r:any)=>[r.id,r])).values()];}
  const known=new Set(db.projects.map((v:any)=>v.id));for(const k of collections)for(const r of db[k])if(r.projectId&&!known.has(r.projectId)){db.projects.push({...p,id:r.projectId,name:'Recovered project'});known.add(r.projectId);}
  if(!db.projects.length)db.projects=[p];if(!db.projects.some((v:any)=>v.id===db.activeProjectId))db.activeProjectId=db.projects[0].id;
  db.entities=db.entities.map((e:any)=>({...e,aliases:e.aliases||[],tags:e.tags||[],images:e.images||[],relationships:e.relationships||[],sourceReferences:e.sourceReferences||[],customFields:e.customFields||{},customStats:e.customStats||{},culturalLenses:e.culturalLenses||[]}));
  db.stories.forEach((s:any)=>(s.chapters||[]).forEach((c:any)=>{c.storyId=s.id;(c.scenes||[]).forEach((sc:any)=>sc.chapterId=c.id);}));
  db.bookmarks=old('bookmarks',[]).map((b:any)=>({...b,projectId:db.activeProjectId}));db.history=old('history',[]).map((h:any)=>({...h,projectId:db.activeProjectId}));
  validate(db);return db; // Legacy keys remain untouched as recovery evidence.
}
export function save(db:Database):Database {
  validate(db);const raw=localStorage.getItem(KEY),revision=raw?JSON.parse(raw).revision:0;
  check(revision===db.revision,'Changed in another tab. Reload before saving; the other tab has not been overwritten.');
  const next={...db,revision:revision+1};if(raw)localStorage.setItem(RECOVERY,raw);localStorage.setItem(KEY,JSON.stringify(next));return next;
}
export function scope(db:Database):Data {return Object.fromEntries(collections.map(k=>[k,db[k].filter((r:any)=>r.projectId===db.activeProjectId)])) as unknown as Data;}
export function restore(raw:string,db:Database):Database {
  const input=JSON.parse(raw);
  if(input.format==='phoenixi-library'){validate(input.database);return {...copy(input.database),revision:db.revision};}
  check(['1.0','2.0'].includes(input.version)&&obj(input.project),'Unsupported backup.');
  const p=input.project,next=copy(db);next.projects=[...next.projects.filter(v=>v.id!==p.id),p];next.activeProjectId=p.id;
  for(const k of collections){const rows=input[k==='extractionLogs'?'logs':k];check(Array.isArray(rows),`Backup is missing ${k}.`);check(rows.every((r:any)=>r.projectId===p.id),'Backup contains records from another project.');next[k]=[...next[k].filter((r:any)=>r.projectId!==p.id),...rows] as any;}
  validate(next);return next;
}
export const backup=(db:Database)=>JSON.stringify({format:'phoenixi-library',exportedAt:now(),database:db},null,2);
export function rawBackup(){const raw:Record<string,string>={};for(let n=0;n<localStorage.length;n++){const k=localStorage.key(n)!;if(k.startsWith('loreforge_v1_')||k.startsWith('phoenixi_library'))raw[k]=localStorage.getItem(k)!;}return JSON.stringify({format:'phoenixi-raw-recovery',raw},null,2);}
export function download(name:string,data:string,type='application/json'){const u=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
export const upsert=<T extends {id:string}>(rows:T[],row:T)=>[...rows.filter(r=>r.id!==row.id),row];
