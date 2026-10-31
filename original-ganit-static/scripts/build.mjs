import {cp,mkdir,rm,readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const manifest=JSON.parse(await readFile(path.join(root,'verification/source-manifest.json'),'utf8'));
export async function inventory(dir,prefix=''){
 let out={};for(const item of await readdir(dir,{withFileTypes:true})){
 const rel=prefix+item.name,p=path.join(dir,item.name);
 if(item.isDirectory())Object.assign(out,await inventory(p,rel+'/'));
 else out[rel]=createHash('sha256').update(await readFile(p)).digest('hex');
 }return Object.fromEntries(Object.entries(out).sort(([a],[b])=>a.localeCompare(b)));
}
const expected=Object.fromEntries(Object.entries(manifest.files).sort(([a],[b])=>a.localeCompare(b)));
const actual=await inventory(path.join(root,'source'));
if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('Source differs from published revision: exact-match build refused.');
await rm(path.join(root,'dist'),{recursive:true,force:true});
await mkdir(path.join(root,'dist'),{recursive:true});
await cp(path.join(root,'source'),path.join(root,'dist'),{recursive:true});
if(JSON.stringify(await inventory(path.join(root,'dist')))!==JSON.stringify(expected))throw Error('Build output differs from original');
console.log(`Built ${Object.keys(expected).length} unchanged original files into dist/ (published source ${manifest.sourceCommit}).`);

// Keep the recovered source immutable; append only explicitly reviewed additions.
if(!process.argv.includes('--original')) {
 const contentPath=path.join(root,'dist/content.json');
 const content=JSON.parse(await readFile(contentPath,'utf8'));
 const ids=new Set(content.solutions.map(q=>q.id));
 for(const filename of (await readdir(path.join(root,'content-additions'))).filter(n=>n.endsWith('.json')).sort()) {
  for(const q of JSON.parse(await readFile(path.join(root,'content-additions',filename),'utf8'))) {
   if(ids.has(q.id))throw Error('Refusing to overwrite existing solution '+q.id);
   if(!q.verification||!q.steps?.length||!q.answer||!expected[q.verification.source])throw Error('Unverified addition '+q.id);
   ids.add(q.id); content.solutions.push(q);
  }
 }
 await writeFile(contentPath,JSON.stringify(content));
 console.log('Published '+content.solutions.length+' solutions; original 110 entries unchanged.');
}
