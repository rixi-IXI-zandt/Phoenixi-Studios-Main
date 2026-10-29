// Policy infrastructure only. Invoke on a trusted server before delivering gated content.
// Client-side evaluation is useful for previews, never authorization.
export interface AccessRule {id:string;resourceId:string;enabled:boolean;mode:'public'|'membership'|'wax';membershipPlanId?:string;wax?:{collection:string;schema?:string;templateId:string;minimum:number}}
export interface Evidence {subjectId:string;verifiedByServer:boolean;expiresAt:number;membership?:{planId:string;status:'active'|'expired'|'cancelled';validUntil:number};wallet?:{account:string;chainId:string;ownershipCheckedAt:number;assets:{id:string;owner:string;collection:string;schema:string;templateId:string}[]}}
export const WAX_CHAIN='1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01af5a41';
export const accessConfiguration:{version:1;rules:AccessRule[]}={version:1,rules:[]};
export function canAccess(rule:AccessRule|undefined,evidence:Evidence|undefined,at=Date.now()):boolean {
 if(!rule?.enabled)return false;
 if(rule.mode==='public')return true;
 if(!evidence?.verifiedByServer||!evidence.subjectId||evidence.expiresAt<=at)return false;
 if(rule.mode==='membership')return !!rule.membershipPlanId&&evidence.membership?.planId===rule.membershipPlanId&&evidence.membership.status==='active'&&evidence.membership.validUntil>at;
 const w=evidence.wallet,r=rule.wax;
 if(!w||!r||!r.collection||!r.templateId||r.minimum<1||!Number.isInteger(r.minimum)||w.chainId!==WAX_CHAIN||!w.account||at-w.ownershipCheckedAt>60000||w.ownershipCheckedAt>at)return false;
 return new Set(w.assets.filter(a=>a.owner===w.account&&a.collection===r.collection&&a.templateId===r.templateId&&(!r.schema||a.schema===r.schema)).map(a=>a.id)).size>=r.minimum;
}
export interface OwnershipAdapter {lookup(account:string,rule:NonNullable<AccessRule['wax']>):Promise<NonNullable<Evidence['wallet']>['assets']>}
// The caller supplies a vetted indexer. This adapter does not prove control of an account.
export function atomicAssetsAdapter(endpoint:string,request:typeof fetch=fetch):OwnershipAdapter {
 const base=new URL(endpoint);if(base.protocol!=='https:')throw new Error('Ownership service must use HTTPS.');
 return {async lookup(account,rule){
  if(!/^[a-z1-5.]{1,12}$/.test(account)||!rule.collection||!/^\d+$/.test(rule.templateId))throw new Error('Invalid WAX ownership query.');
  const results:NonNullable<Evidence['wallet']>['assets']=[];
  for(let page=1;page<=100;page++){
   const url=new URL('atomicassets/v1/assets',base.href.replace(/\/?$/,'/'));url.search=new URLSearchParams({owner:account,collection_name:rule.collection,template_id:rule.templateId,limit:'100',page:String(page),...(rule.schema?{schema_name:rule.schema}:{})}).toString();
   const response=await request(url,{signal:AbortSignal.timeout(10000)});if(!response.ok)throw new Error('Ownership provider is unavailable. No access granted.');const body=await response.json();if(body.success!==true||!Array.isArray(body.data))throw new Error('Invalid ownership response.');
   for(const a of body.data){if(a.owner===account&&a.collection?.collection_name===rule.collection&&String(a.template?.template_id)===rule.templateId&&(!rule.schema||a.schema?.schema_name===rule.schema))results.push({id:String(a.asset_id),owner:a.owner,collection:a.collection.collection_name,schema:a.schema.schema_name,templateId:String(a.template.template_id)});}
   if(body.data.length<100)return results;
  }
  throw new Error('Ownership result exceeded safe pagination bounds. No access granted.');
 }};
}
