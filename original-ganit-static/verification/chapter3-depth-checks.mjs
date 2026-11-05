import {readFileSync,readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),read=p=>JSON.parse(readFileSync(new URL(p,root),'utf8'));
const original=read('source/content.json');
const baseline=[...original.solutions];
for(const p of readdirSync(new URL('content-additions/',root)).filter(p=>p.endsWith('.json')))baseline.push(...read('content-additions/'+p));
for(const p of read('solution-presentation.json')){const q=baseline.find(q=>q.id===p.id);q.steps=p.steps;q.explanation=p.explanation;}
const built=read('dist/content.json'),expanded=read('chapter3-expanded-steps.json');
assert.equal(expanded.length,81);assert.equal(new Set(expanded.map(q=>q.id)).size,81);
let before=0,after=0;
for(const q of baseline){
 const actual=built.solutions.find(x=>x.id===q.id);assert.ok(actual,q.id);
 if(q.chapter!==3){assert.deepEqual(actual,q,q.id);continue;}
 const {steps:oldSteps,...oldData}=q,{steps:newSteps,...newData}=actual;
 assert.deepEqual(newData,oldData,q.id+' question, answer, explanation or source changed');
 assert.ok(newSteps.length>oldSteps.length,q.id+' needs smaller intermediate steps');
 assert.ok(newSteps.every(s=>typeof s==='string'&&s.trim()),q.id);
 before+=oldSteps.length;after+=newSteps.length;
}
assert.equal(built.solutions.length,baseline.length);
console.log(`All 81 Chapter 3 solutions expanded: ${before} → ${after} steps; every question, subpart, final answer, explanation and source record preserved; all other chapters unchanged.`);
