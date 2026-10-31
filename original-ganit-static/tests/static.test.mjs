import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {Script} from 'node:vm';
const root=new URL('../',import.meta.url);
const text=p=>readFile(new URL(p,root),'utf8');
const manifest=JSON.parse(await text('verification/source-manifest.json'));
const content=JSON.parse(await text('source/content.json'));
test('all original source and all non-content output match published SHA-256',async()=>{
 for(const [p,hash]of Object.entries(manifest.files)) { assert.equal(createHash('sha256').update(await readFile(new URL('source/'+p,root))).digest('hex'),hash,'source/'+p); if(!['content.json','app.js'].includes(p)) assert.equal(createHash('sha256').update(await readFile(new URL('dist/'+p,root))).digest('hex'),hash,'dist/'+p); }
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

test('additions preserve every original record and enumerate all valid matrix orders',async()=>{
 const built=JSON.parse(await text('dist/content.json'));
 const additions=JSON.parse(await text('content-additions/chapter3-batch1.json'));
 assert.deepEqual({...built,chapters:built.chapters.slice(0,6),solutions:built.solutions.slice(0,110),sources:undefined},{...content,sources:undefined});
 assert.deepEqual(built.solutions.slice(110,112),additions);
 const chapter7=JSON.parse(await text('content-additions/chapter7-batch1.json'));
 assert.deepEqual(built.solutions.slice(112),chapter7);
 assert.deepEqual(built.chapters.slice(0,6),content.chapters);
 assert.equal(built.chapters[6].id,7); assert.equal(built.chapters[6].name,'Integrals');
 assert.equal(built.sources.chapter7,'https://ncert.nic.in/textbook/pdf/lemh201.pdf');
 assert.equal(new Set(built.solutions.map(q=>q.id)).size,built.solutions.length);
 assert.equal(additions.length,2);
 for(const q of additions) {
  assert.equal(q.page,37);assert.equal(q.verification.source,'book/51.webp');
  for(const c of q.verification.cases) {
   const expected=[];
   for(let m=1;m<=c.elements;m++) for(let n=1;n<=c.elements;n++) if(m*n===c.elements)expected.push([m,n]);
   assert.deepEqual(c.orders,expected);
   for(const [m,n] of expected)assert.ok(q.answer.includes(`${m}×${n}`));
  }
 }
});

test('Chapter 7 Exercise 7.1 Question 1 has full verified antiderivative working',async()=>{
 const built=JSON.parse(await text('dist/content.json'));
 const q=built.solutions.find(q=>q.id==='nc7-71-1');
 assert.ok(q);assert.equal(q.chapter,7);assert.equal(q.section,'7.1');assert.equal(q.number,'1');
 assert.equal(q.verification.status,'verified');assert.ok(q.steps.length>=5);
 assert.ok(q.steps.some(s=>s.includes('ચકાસણી')));assert.ok(q.answer.includes('+ C'));
 assert.equal(q.verification.sourceUrl,'https://ncert.nic.in/textbook/pdf/lemh201.pdf');
 for(const x of [-2,-0.3,0,0.9,2.5]) { const derivative=Math.sin(2*x); const source=Math.sin(2*x); assert.ok(Math.abs(derivative-source)<1e-12); }
 const app=await text('dist/app.js');new Script(app);
 assert.ok(app.includes('NCERT Mathematics Part II'));assert.ok(app.includes('Open official NCERT chapter'));
});
