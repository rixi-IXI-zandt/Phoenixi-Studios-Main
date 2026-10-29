import {rm,lstat} from 'node:fs/promises';
const dir=new URL('../dist/',import.meta.url);
const info=await lstat(dir).catch(()=>null);if(info?.isSymbolicLink())throw new Error('Refusing linked build directory');
await rm(dir,{recursive:true,force:true});
