import type {Database} from './database';
import {copy,id,now,upsert} from './database';
import type {Entity,EntityType,ExtractedFact,ProvenanceReference} from '../types';
export function entity(projectId:string,type:EntityType,name:string):Entity {return {id:id('entity'),projectId,type,name,aliases:[],description:'',status:'Active',tags:[],images:[],relationships:[],sourceReferences:[],customFields:{},customStats:{},createdAt:now(),updatedAt:now(),canonState:'UNVERIFIED'};}
const match=(db:Database,name:string)=>db.entities.find(e=>e.projectId===db.activeProjectId&&[e.name,...e.aliases].some(n=>n.trim().toLocaleLowerCase()===name.trim().toLocaleLowerCase()));
export function commitFacts(current:Database,facts:ExtractedFact[]):Database {
  const db=copy(current);
  // Entities first so a batch may safely reference an entity approved in that same batch.
  for(const fact of [...facts].sort((a,b)=>Number(b.factType==='entity')-Number(a.factType==='entity'))){
    if(fact.projectId!==db.activeProjectId)throw new Error('Fact belongs to another project.');
    if(fact.status!=='APPROVED'){db.extractedFacts=upsert(db.extractedFacts,fact);continue;}
    if(db.extractedFacts.find(f=>f.id===fact.id)?.status==='APPROVED')continue;
    const source=db.notes.find(n=>n.id===fact.sourceNoteId&&n.projectId===fact.projectId);
    if(!source||!fact.sourcePassage.trim()||!source.content.includes(fact.sourcePassage))throw new Error('The exact source quote is missing or has changed. Review the proposal before approval.');
    const ref:ProvenanceReference={id:id('source'),sourceType:'note',sourceId:source.id,sourceTitle:source.title,passageSnippet:fact.sourcePassage,timestamp:now()};
    const canonState=fact.evidenceClassification==='EXPLICIT'?'CANON':'UNVERIFIED';
    let target=match(db,fact.entityName);
    if(fact.factType==='relationship'){
      const other=match(db,fact.targetEntityName||'');
      if(!target||!other)throw new Error('Create or approve both relationship entities first.');
      const duplicate=target.relationships.find(r=>r.targetId===other.id&&r.relationshipType===fact.relationshipType);
      if(!duplicate)target.relationships.push({id:id('relation'),sourceId:target.id,sourceName:target.name,targetId:other.id,targetName:other.name,relationshipType:fact.relationshipType||'Related to',description:fact.factDetail,direction:'directed',isExtracted:true,evidenceClassification:fact.evidenceClassification,sourceReferences:[ref]});
    }else {
      if(!target){target=entity(fact.projectId,fact.factType==='event'?'event':fact.entityType,fact.entityName);db.entities.push(target);}
      const field=fact.factType==='attribute'?(fact.attributeName||'description'):'description';
      if(!['description','status','dateText','approximateDateText','personality','motivation','history','appearance','biology','habitat','values','customs','traditions','rituals','language','mythology','socialStructures','mechanism','consequences','domains'].includes(field))throw new Error('Unsupported attribute.');
      const previous=target[field];
      if(previous&&previous!==fact.factDetail){
        const oldRef=target.sourceReferences.at(-1)||{...ref,id:id('source'),sourceTitle:'Existing authored value',passageSnippet:previous};
        db.canonConflicts.push({id:id('conflict'),projectId:fact.projectId,entityName:target.name,entityId:target.id,attributeName:field,factId:fact.id,factA:{text:previous,source:oldRef},factB:{text:fact.factDetail,source:ref},status:'unresolved'});
        db.extractedFacts=upsert(db.extractedFacts,{...fact,status:'CONFLICTING',canonState:'CONFLICTING'});continue;
      }
      target[field]=fact.factDetail;target.canonState=canonState;
      if(fact.factType==='event'&&fact.dateText)target.dateText=fact.dateText;
    }
    target.updatedAt=now();target.sourceReferences.push(ref);
    db.extractedFacts=upsert(db.extractedFacts,{...fact,canonState});
  }
  return db;
}
export function removeEntity(current:Database,entityId:string):Database {
  const db=copy(current);db.entities=db.entities.filter(e=>e.id!==entityId);
  const refs=['affiliationIds','itemIds','leadershipIds','memberIds','childOrgIds','childLocationIds','inhabitantIds','previousOwnerIds','roomIds','occupantIds','deityIds','participantIds'];
  for(const e of db.entities){e.relationships=e.relationships.filter(r=>r.targetId!==entityId&&r.sourceId!==entityId);e.culturalLenses=(e.culturalLenses||[]).filter(l=>l.targetEntityId!==entityId);for(const k of refs)if(Array.isArray(e[k]))e[k]=e[k].filter(v=>v!==entityId);for(const k of ['speciesId','cultureId','locationId','parentOrgId','parentLocationId','ownerId','structureId'])if(e[k]===entityId)delete e[k];}
  for(const s of db.stories){s.participatingEntityIds=s.participatingEntityIds.filter(v=>v!==entityId);for(const c of s.chapters)for(const sc of c.scenes){sc.appearingCharacterIds=sc.appearingCharacterIds.filter(v=>v!==entityId);if(sc.povCharacterId===entityId)delete sc.povCharacterId;if(sc.locationId===entityId)delete sc.locationId;}}
  db.maps.forEach(m=>m.markers=m.markers.filter(v=>v.locationId!==entityId));db.assets.forEach(a=>a.associatedEntityIds=a.associatedEntityIds.filter(v=>v!==entityId));db.plotThreads.forEach(t=>t.associatedCharacterIds=t.associatedCharacterIds.filter(v=>v!==entityId));db.notes.forEach(n=>n.entityReferences=n.entityReferences.filter(v=>v!==entityId));db.bookmarks=db.bookmarks.filter(b=>b.targetId!==entityId);return db;
}
