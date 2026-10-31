import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {Script} from 'node:vm';
const root=new URL('../',import.meta.url);
const text=p=>readFile(new URL(p,root),'utf8');
const manifest=JSON.parse(await text('verification/source-manifest.json'));
const content=JSON.parse(await text('source/content.json'));
test('every source and built asset matches recovered published SHA-256',async()=>{
 for(const [p,hash]of Object.entries(manifest.files))for(const folder of ['source','dist'])assert.equal(createHash('sha256').update(await readFile(new URL(folder+'/'+p,root))).digest('hex'),hash,p);
});
test('all original chapters and all 110 numbered solutions preserved',()=>{
 assert.equal(content.chapters.length,6);assert.equal(content.solutions.length,110);assert.equal(new Set(content.solutions.map(q=>q.id)).size,110);
 assert.deepEqual([1,2,3,4,5,6].map(c=>content.solutions.filter(q=>q.chapter===c).length),[61,49,0,0,0,0]);
 for(const q of content.solutions){assert.ok(q.prompt);assert.ok(q.answer);assert.ok(q.steps.length);assert.ok(q.steps.every(x=>typeof x==='string'&&x.length));assert.ok(manifest.files[`book/${q.page+14}.webp`]);}
 assert.ok(content.solutions.some(q=>q.id==='tb1-Example-1'));
});
test('all 196 original textbook page assets are present and nonempty',async()=>{
 assert.equal(content.book.pages,196);assert.equal((await readdir(new URL('source/book/',root))).length,196);
 for(let i=1;i<=196;i++)assert.ok((await stat(new URL(`source/book/${i}.webp`,root))).size>0);
});
test('browser code syntax, static data boundary and original interactions retained',async()=>{
 const js=await text('source/app.js');new Script(js);new Script(await text('source/service-worker.js'));
 assert.ok(js.includes("fetch('/content.json')"));assert.ok(js.includes("if(path==='me')return {user:null}"));
 for(const feature of ['location.hash','localStorage','function bookmark','function practice','function graphs','function solution','window.print()'])assert.ok(js.includes(feature),feature);
 assert.ok(!js.includes("fetch('/api/"));
});
test('HTML and manifest assets resolve locally; no external font dependency introduced',async()=>{
 const html=await text('source/index.html');for(const m of html.matchAll(/(?:src|href)="(\/[^"#]+)"/g))assert.ok(manifest.files[m[1].slice(1)],m[1]);
 const pwa=JSON.parse(await text('source/manifest.json'));for(const icon of pwa.icons)assert.ok(manifest.files[icon.src.slice(1)]);
 assert.ok(!html.includes('fonts.googleapis.com'));assert.ok(!html.includes('premium-experience'));
});
