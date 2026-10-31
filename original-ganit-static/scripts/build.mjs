import {cp,mkdir,rm,readdir,readFile} from 'node:fs/promises';
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
