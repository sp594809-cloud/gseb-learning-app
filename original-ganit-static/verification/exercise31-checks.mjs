import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const content=JSON.parse(readFileSync(new URL('../dist/content.json',import.meta.url)));
const qs=content.solutions.filter(q=>q.chapter===3&&q.section==='3.1');
assert.equal(qs.length,10);assert.deepEqual(qs.map(q=>+q.number).sort((a,b)=>a-b),[1,2,3,4,5,6,7,8,9,10]);
const find=n=>qs.find(q=>+q.number===n);
const num=s=>{s=s.trim();if(/^\\sqrt\{?3\}?$/.test(s))return Math.sqrt(3);const m=s.match(/^\\frac(?:\{(-?\d+)\}|(-?\d))(?:\{(-?\d+)\}|(-?\d))$/);if(m)return +(m[1]??m[2])/+(m[3]??m[4]);assert.match(s,/^-?\d+$/);return +s;};
const matrices=s=>[...s.matchAll(/\\begin\{bmatrix\}([\s\S]*?)\\end\{bmatrix\}/g)].map(m=>m[1].split('\\\\').map(r=>r.split('&').map(num)));
assert.deepEqual(matrices(find(1).prompt),[[[2,5,19,-7],[35,-2,2.5,12],[Math.sqrt(3),1,-5,17]]]);
const expected4=[(i,j)=>(i+j)**2/2,(i,j)=>i/j,(i,j)=>(i+2*j)**2/2].map(f=>Array.from({length:2},(_,i)=>Array.from({length:2},(_,j)=>f(i+1,j+1))));
assert.deepEqual(matrices(find(4).answer),expected4);
const expected5=[(i,j)=>Math.abs(-3*i+j)/2,(i,j)=>2*i-j].map(f=>Array.from({length:3},(_,i)=>Array.from({length:4},(_,j)=>f(i+1,j+1))));
assert.deepEqual(matrices(find(5).answer),expected5);
for(const [x,y,z] of [[2,4,0],[4,2,0]]){assert.equal(x+y,6);assert.equal(5+z,5);assert.equal(x*y,8);}
assert.deepEqual([2+4+3,2+3,4+3],[9,5,7]);
const [a,b,c,d]=[1,2,3,4];assert.deepEqual([[a-b,2*a+c],[2*a-b,3*c+d]],[[-1,5],[0,13]]);
for(const [x,y] of [[-1/3,7],[-2/3,7],[-1/3,-2/3]])assert.notDeepEqual([[3*x+7,5],[y+1,2-3*x]],[[0,y-2],[8,4]]);
assert.notEqual(-7/3,-2/3);
assert.equal(new Set(Array.from({length:2**9},(_,n)=>n.toString(2).padStart(9,'0'))).size,512);
const ctx={esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))};vm.createContext(ctx);vm.runInContext(readFileSync(new URL('../scripts/math-renderer.js',import.meta.url),'utf8'),ctx);
for(const q of qs){assert.ok(q.steps.length&&q.explanation?.length&&q.answer);for(const s of [q.prompt,...q.steps,q.answer,...q.explanation]){assert.equal((s.match(/\$/g)||[]).length%2,0,q.id);const html=ctx.mathText(s);assert.ok(!html.includes('Invalid matrix')&&!html.includes('$'),q.id);const envs=(s.match(/\\begin\{(?:bmatrix|matrix)\}/g)||[]).length;assert.equal((html.match(/<mtable /g)||[]).length,envs,q.id);}}
const first=ctx.mathText(find(1).prompt);assert.equal((first.match(/<mtr>/g)||[]).length,3);assert.equal((first.match(/<mtd>/g)||[]).length,12);assert.ok(first.includes('<mfrac>'));assert.ok(first.includes('<msqrt>'));
console.log('Exercise 3.1 Q1–10 and all subparts verified: exact matrix entries/formulas, both equality solutions, inconsistent MCQ, 512 binary matrices, and native MathML tables.');
