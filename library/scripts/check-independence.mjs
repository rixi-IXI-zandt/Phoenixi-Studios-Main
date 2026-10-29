import {readFile,readdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const failures=[];
const forbidden=/(?:https?:)?\/\/(?:[^/\s"']+\.)?(?:googleapis\.com|gstatic\.com|googleusercontent\.com|firebaseapp\.com|appspot\.com)|@google\/genai|from\s+['"]firebase|GEMINI_API_KEY|gemini-\d|ai\.studio\//i;
async function scan(dir){for(const f of await readdir(new URL(dir,root),{withFileTypes:true})){const name=dir+f.name;if(f.isDirectory())await scan(name+'/');else if(/\.(tsx?|m?js|cjs|html|css|json)$/.test(f.name)){const text=await readFile(new URL(name,root),'utf8');if(forbidden.test(text))failures.push(name);}}}
for(const dir of ['src/','dist/'])await scan(dir);
for(const file of ['package.json','package-lock.json','index.html','vite.config.ts','metadata.json','README.md','server.mjs','.env.example'])if(forbidden.test(await readFile(new URL(file,root),'utf8')))failures.push(file);
if(failures.length)throw new Error('External service residue: '+failures.join(', '));
console.log('Application source, dependencies and built assets have no Google/Gemini runtime dependencies or service URLs.');
