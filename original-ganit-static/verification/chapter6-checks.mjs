import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const d=JSON.parse(readFileSync(new URL('../dist/content.json',import.meta.url)));
const qs=d.solutions.filter(q=>q.chapter===6);
assert.equal(qs.length,119);
for(const [section,n] of [['Example',37],['6.1',18],['6.2',19],['6.3',29],['Misc 6',16]])assert.deepEqual(qs.filter(q=>q.section===section).map(q=>+q.number).sort((a,b)=>a-b),Array.from({length:n},(_,i)=>i+1));
const near=(a,b,t=1e-5)=>assert.ok(Math.abs(a-b)<=t*Math.max(1,Math.abs(b)),`${a} ≠ ${b}`);
const pairs=[
 [x=>x**3-3*x+3,x=>3*(x-1)*(x+1)],
 [x=>2*x**3-6*x*x+6*x+5,x=>6*(x-1)**2],
 [x=>3*x**4+4*x**3-12*x*x+12,x=>12*x*(x+2)*(x-1)],
 [x=>(x+10)*Math.sqrt(100-x*x),x=>(100-2*x*x-10*x)/Math.sqrt(100-x*x)],
 [x=>2*x**3-15*x*x+36*x+1,x=>6*(x-2)*(x-3)],
 [x=>12*Math.cbrt(x)**4-6*Math.cbrt(x),x=>2*(8*x-1)/(Math.cbrt(x)**2)],
 [x=>(x-3)**2+x**4,x=>2*(x-1)*(2*x*x+2*x+3)],
 [x=>x*(3-2*x)*(8-2*x),x=>4*(x-3)*(3*x-2)],
 [x=>3*x**4-8*x**3+12*x*x-48*x+25,x=>12*(x-2)*(x*x+2)],
 [x=>x*Math.sqrt(1-x),x=>(2-3*x)/(2*Math.sqrt(1-x))],
 [x=>x*(60-x)**3,x=>4*(60-x)**2*(15-x)],
 [x=>x*x*(35-x)**5,x=>7*x*(35-x)**4*(10-x)],
 [x=>x*(45-2*x)*(24-2*x),x=>12*(x-5)*(x-18)],
 [x=>x*(1-x)/(1+x)**2,x=>(1-3*x)/(1+x)**3],
 [x=>(x-2)**4*(x+1)**3,x=>(x-2)**3*(x+1)**2*(7*x-2)],
 [x=>(x-2)**3*(x+1)**2*(7*x-2),x=>6*(x-2)**2*(x+1)*(7*x*x-4*x-2)]
];let comparisons=0;
for(const [f,g] of pairs)for(const x of [.13,.27,.43,.67,.83]){const h=1e-5;near((f(x+h)-f(x-h))/(2*h),g(x),2e-5);comparisons++;}
// Independent direct sampling checks mathematical boundary cases and complete extrema.
const globalCheck=(f,lo,hi,xstar,kind='min')=>{const y=f(xstar);for(let i=0;i<=3000;i++){let v=f(lo+(hi-lo)*i/3000);if(kind==='min')assert.ok(v>=y-1e-6);else assert.ok(v<=y+1e-6);}};
for(const c of [0,.1,.5,.75,1,5]){const xs=c<=.5?0:Math.sqrt(c-.5);const distance=x=>Math.hypot(x,x*x-c);near(distance(xs),c<=.5?c:Math.sqrt(4*c-1)/2);globalCheck(distance,-4,4,xs);}
globalCheck(x=>x*(3-2*x)*(8-2*x),0,1.5,2/3,'max');
globalCheck(x=>x*(45-2*x)*(24-2*x),0,12,5,'max');
globalCheck(x=>x+Math.sin(2*x),0,2*Math.PI,0,'min');
globalCheck(x=>x+Math.sin(2*x),0,2*Math.PI,2*Math.PI,'max');
globalCheck(x=>Math.cos(x)**2+Math.sin(x),0,Math.PI,Math.PI/6,'max');
globalCheck(x=>Math.cos(x)**2+Math.sin(x),0,Math.PI,Math.PI/2,'min');
for(const [a,b] of [[1,1],[2,3],[4,.5]]){const theta=Math.atan(Math.cbrt(a/b)),f=x=>a/Math.sin(x)+b/Math.cos(x);near(f(theta),(a**(2/3)+b**(2/3))**1.5);globalCheck(f,.0001,Math.PI/2-.0001,theta);}
const candidate=x=>x**4-6*x*x+8*x+9;assert.ok(candidate(2)>candidate(1),'Ex6.3 Q11: a=8 does not give maximum at 1');
const ctx={esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))};vm.createContext(ctx);vm.runInContext(readFileSync(new URL('../scripts/math-renderer.js',import.meta.url),'utf8'),ctx);
for(const q of qs){assert.ok(q.explanation?.length);for(const text of [q.prompt,...q.steps,q.answer,...q.explanation]){assert.equal((text.match(/\$/g)||[]).length%2,0,q.id);const html=ctx.mathText(text);assert.ok(!html.includes('$')&&!html.includes('undefined'),q.id);}}
console.log(`119 entries complete by inventory; ${comparisons} numerical derivative checks and boundary/extrema sampling passed; all mathematical text parsed.`);
