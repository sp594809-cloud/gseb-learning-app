import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const content=JSON.parse(readFileSync(new URL('../dist/content.json',import.meta.url)));
const ctx={esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))};
vm.createContext(ctx);vm.runInContext(readFileSync(new URL('../scripts/math-renderer.js',import.meta.url),'utf8'),ctx);
let expressions=0,tables=0;
for(const q of content.solutions.filter(q=>q.chapter===3)){
 assert.ok(q.steps.length&&q.explanation.length&&q.answer,q.id);
 for(const text of [q.prompt,q.answer,...q.steps,...q.explanation]){
  assert.equal(text.match(/\$/g)?.length%2||0,0,q.id+' unmatched math delimiter');
  assert.ok(!/[\x00-\x08\x0b-\x1f]/.test(text),q.id+' control character');
  const html=ctx.mathText(text);assert.ok(!html.includes('Invalid matrix')&&!html.includes('$'),q.id);
  const n=(text.match(/\\begin\{(?:bmatrix|matrix)\}/g)||[]).length;
  assert.equal((html.match(/<mtable /g)||[]).length,n,q.id);tables+=n;expressions+=(text.match(/\$/g)||[]).length/2;
 }
}
const qs=content.solutions.filter(q=>q.chapter===3&&q.section==='3.2');assert.equal(qs.length,22);assert.deepEqual(qs.map(q=>+q.number),Array.from({length:22},(_,i)=>i+1));
console.log(`Chapter 3 rendering: ${expressions} math expressions and ${tables} matrices; Exercise 3.2 all 22 numbered questions in order.`);
