import React from 'react';
import type {TemplateField,Entity} from '../types';
export function TemplateInput({field:f,value,entities,onChange}:{field:TemplateField;value:any;entities:Entity[];onChange:(value:any)=>void}){
 const common={id:f.id,'aria-label':f.name,required:!!f.required};
 if(f.fieldType==='boolean')return <input {...common} type="checkbox" checked={!!value} onChange={e=>onChange(e.target.checked)}/>;
 if(['entity_ref','entity_ref_list','select','multiselect'].includes(f.fieldType)){
  const multiple=['entity_ref_list','multiselect'].includes(f.fieldType),options=f.fieldType.startsWith('entity')?entities.map(e=>({id:e.id,name:e.name})):(f.options||[]).map(v=>({id:v,name:v}));
  return <select {...common} multiple={multiple} value={multiple?(Array.isArray(value)?value:[]):value||''} onChange={e=>onChange(multiple?Array.from(e.target.selectedOptions).map(o=>o.value):e.target.value)}>{!multiple&&<option value="">Not set</option>}{options.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select>;
 }
 if(['longtext','richtext'].includes(f.fieldType))return <textarea {...common} rows={4} value={value??''} onChange={e=>onChange(e.target.value)}/>;
 return <input {...common} type={f.fieldType==='number'?'number':f.fieldType==='date'?'date':['url','image'].includes(f.fieldType)?'url':'text'} value={value??''} onChange={e=>onChange(f.fieldType==='number'?(e.target.value===''?'':Number(e.target.value)):e.target.value)}/>;
}
