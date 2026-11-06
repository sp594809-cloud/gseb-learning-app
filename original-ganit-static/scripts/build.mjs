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
 for(const filename of (await readdir(path.join(root,'chapter-additions')).catch(()=>[])).filter(n=>n.endsWith('.json')).sort()) {
  const addition=JSON.parse(await readFile(path.join(root,'chapter-additions',filename),'utf8'));
  if(content.chapters.some(c=>c.id===addition.chapter.id))throw Error('Refusing to overwrite chapter '+addition.chapter.id);
  if(addition.sourceUrl)content.sources={...(content.sources||{}),['chapter'+addition.chapter.id]:addition.sourceUrl};
  content.chapters.push(addition.chapter);
 }
 for(const filename of (await readdir(path.join(root,'content-additions'))).filter(n=>n.endsWith('.json')).sort()) {
  for(const q of JSON.parse(await readFile(path.join(root,'content-additions',filename),'utf8'))) {
   if(ids.has(q.id))throw Error('Refusing to overwrite existing solution '+q.id);
   const hasVerifiedSource=Boolean(expected[q.verification?.source])||(/^https:\/\//.test(q.verification?.sourceUrl||'')&&q.verification.status==='verified');
   if(!q.verification||!q.steps?.length||!q.answer||!hasVerifiedSource)throw Error('Unverified addition '+q.id);
   ids.add(q.id); content.solutions.push(q);
  }
 }
 await writeFile(contentPath,JSON.stringify(content));
 const appPath=path.join(root,'dist/app.js');let app=await readFile(appPath,'utf8');
 app=app.replace("Six chapters. Start wherever you need a little clarity.","Explore the uploaded Part I book and the first verified Part II Integral solution.")
  .replace("STANDARD 12 · MATHS PART 1</div><h2>Don’t just find","STANDARD 12 · MATHS PART 1 + PART 2</div><h2>Don’t just find")
  .replace("A clear path through Part 1.','છ પ્રકરણો · મૂળ પાઠ્યપુસ્તક · પગલુંવાર સમજણ'","A clear path through Part I and Part II.','Part I · Chapters 1–6 · Part II Integrals starting'");
 app=app.replace("const qs=data.solutions.filter(q=>q.chapter===c.id),b=data.book.chapters.find(b=>b.id===c.id);main.innerHTML=heading('CHAPTER '+String(c.id).padStart(2,'0'),esc(c.name),esc(c.gu))+`<div class=\"question-actions\"><a class=\"secondary\" href=\"#book/${b.page+14}\">Read textbook · p. ${b.page}–${b.end} ↗</a><a class=\"secondary\" href=\"#practice/${c.id}\">Practise this chapter →</a></div><div class=\"notice\">${qs.length?qs.length+' explained textbook entries. Select an exercise or example below.':'The original textbook and its worked examples are available to read. New explained exercise solutions for this chapter are still pending.'}</div>${qs.length?", "const qs=data.solutions.filter(q=>q.chapter===c.id),b=data.book.chapters.find(b=>b.id===c.id),sourceUrl=data.sources?.['chapter'+c.id],bookAction=b?`<a class=\"secondary\" href=\"#book/${b.page+14}\">Read textbook · p. ${b.page}–${b.end} ↗</a>`:sourceUrl?`<a class=\"secondary\" href=\"${esc(sourceUrl)}\" target=\"_blank\" rel=\"noopener noreferrer\">Open NCERT Part II · Chapter ${c.id} ↗</a>`:'',practiceAction=c.id<=6?`<a class=\"secondary\" href=\"#practice/${c.id}\">Practise this chapter →</a>`:'';main.innerHTML=heading('CHAPTER '+String(c.id).padStart(2,'0'),esc(c.name),esc(c.gu))+`<div class=\"question-actions\">${bookAction}${practiceAction}</div><div class=\"notice\">${qs.length?qs.length+' explained entries. Select an exercise or example below.':c.id===7?'NCERT Mathematics Part II · Integrals. Gujarati GSEB Part II wording has not been independently checked.':'The original textbook and its worked examples are available to read. New explained exercise solutions for this chapter are still pending.'}</div>${qs.length?")
  .replace(":empty('Your textbook is ready to read.','Open the original worked examples while the explained solution bank is being expanded.','#book/'+(b.page+14),'Read this chapter')}`",":empty('Your textbook is ready to read.','Open the textbook while the explained solution bank is being expanded.',b?'#book/'+(b.page+14):sourceUrl||'#chapters',b?'Read this chapter':sourceUrl?'Open NCERT Chapter 7':'Back to chapters')}`")
  .replace(" · ${q.number} · TEXTBOOK P. ${q.page}"," · ${q.number} · ${q.sourceId==='NCERT'?'NCERT PART II':'TEXTBOOK P. '+q.page}")
  .replace("${q.kind==='Textbook'?'મૂળ પ્રશ્ન માટે નીચે આપેલી પાઠ્યપુસ્તકની લિંક ખોલો.':'This is a separate practice question, not a numbered textbook exercise.'}","${q.sourceId==='NCERT'?'NCERT Mathematics Part II · Gujarati translation prepared for this solution.':'મૂળ પ્રશ્ન માટે નીચે આપેલી પાઠ્યપુસ્તકની લિંક ખોલો.'}")
  .replace("6:'વિધેય બનાવો, યોગ્ય પ્રાન્ત નક્કી કરો અને નિર્ણાયક બિંદુઓ સાથે છેડાઓ પણ તપાસો.'})[q.chapter]", "6:'વિધેય બનાવો, યોગ્ય પ્રાન્ત નક્કી કરો અને નિર્ણાયક બિંદુઓ સાથે છેડાઓ પણ તપાસો.',7:'ચેઇન નિયમથી અંદરના વિધેયના વિકલિતને ધ્યાનમાં લો; પછી જવાબનું વિકલિત કરીને ચકાસો.'})[q.chapter]")
  .replace("${q.page?`<div class=\"panel\"><h3>Check the source.</h3><p class=\"small\">Gujarati Maths Part 1<br>Printed page ${q.page} · PDF page ${q.page+14}</p><a class=\"secondary\" href=\"#book/${q.page+14}\">Open original page ↗</a></div>`:''}","${q.page?`<div class=\"panel\"><h3>Check the source.</h3><p class=\"small\">Gujarati Maths Part 1<br>Printed page ${q.page} · PDF page ${q.page+14}</p><a class=\"secondary\" href=\"#book/${q.page+14}\">Open original page ↗</a></div>`:q.sourceId==='NCERT'?`<div class=\"panel\"><h3>Check the source.</h3><p class=\"small\">NCERT Mathematics Part II<br>Chapter 7 · Exercise 7.1</p><a class=\"secondary\" href=\"${esc(q.verification.sourceUrl)}\" target=\"_blank\" rel=\"noopener noreferrer\">Open official NCERT chapter ↗</a><p class=\"small\">Gujarati GSEB Part II wording has not been independently checked.</p></div>`:''}")
  .replace("<a class=\"plain\" href=\"#practice/${q.chapter}\">Test your understanding →</a>","${q.sourceId==='NCERT'?`<a class=\"plain\" href=\"#chapter/${q.chapter}\">More Integrals solutions →</a>`:`<a class=\"plain\" href=\"#practice/${q.chapter}\">Test your understanding →</a>`}");
 await writeFile(appPath,app);
 console.log('Published '+content.solutions.length+' solutions; original 110 entries unchanged.');
}

if(!process.argv.includes('--original')) {
 const appPath=path.join(root,'dist/app.js');
 let app=await readFile(appPath,'utf8');
 const renderer=await readFile(path.join(root,'scripts/math-renderer.js'),'utf8');
 for(const from of ['esc(q.prompt)','esc(q.answer)','esc(s)'])app=app.replaceAll(from,from.replace('esc(','mathText('));
 await writeFile(appPath,renderer+'\n'+app);
}

if(!process.argv.includes('--original')) {
 const contentPath=path.join(root,'dist/content.json');
 const content=JSON.parse(await readFile(contentPath,'utf8'));
 const presentations=JSON.parse(await readFile(path.join(root,'solution-presentation.json'),'utf8'));
 for(const item of presentations){const q=content.solutions.find(q=>q.id===item.id);if(!q)throw Error('Missing solution '+item.id);q.explanation=item.explanation;q.steps=item.steps;}
 await writeFile(contentPath,JSON.stringify(content));
 const appPath=path.join(root,'dist/app.js');let app=await readFile(appPath,'utf8');
 app=app.replace("<div class=\"question-actions\"><button class=\"primary\" id=\"complete\">","${q.explanation?`<details class=\"panel understanding\" style=\"margin-top:20px\"><summary style=\"cursor:pointer;font-weight:700\">ઉકેલ સમજો / Understand the solution</summary><ol>${q.explanation.map(text=>`<li style=\"margin:14px 0;line-height:1.9\">${mathText(text)}</li>`).join('')}</ol></details>`:''}<div class=\"question-actions\"><button class=\"primary\" id=\"complete\">");
 app=app.replace('let revealed=1;','let revealed=q.explanation?q.steps.length:1;').replace("$('#answer').hidden=q.steps.length>1","$('#answer').hidden=!q.explanation&&q.steps.length>1").replace("$('#next-step').hidden=q.steps.length<=1","$('#next-step').hidden=Boolean(q.explanation)||q.steps.length<=1");
 await writeFile(appPath,app);
}

if(!process.argv.includes('--original')) {
 const contentPath=path.join(root,'dist/content.json');
 const content=JSON.parse(await readFile(contentPath,'utf8'));
 const groups={'Example':0,'6.1':1,'6.2':2,'6.3':3,'Misc 6':4};
 const sorted=content.solutions.filter(q=>q.chapter===6).sort((a,b)=>(groups[a.section]-groups[b.section])||(+a.number-+b.number));
 let next=0;content.solutions=content.solutions.map(q=>q.chapter===6?sorted[next++]:q);
 await writeFile(contentPath,JSON.stringify(content));
 const appPath=path.join(root,'dist/app.js');let app=await readFile(appPath,'utf8');
 app=app.replace('<div class="solution-layout"><section>', '<div class="solution-layout"><section style="min-width:0">').replace('class="step" ${i?', 'class="step" style="min-width:0" ${i?').replace('<p>${mathText(s)}</p></div>', '<p style="min-width:0;flex:1">${mathText(s)}</p></div>');
 await writeFile(appPath,app);
 await mkdir(path.join(root,'dist/verification'),{recursive:true});
 await cp(path.join(root,'verification/mobile.html'),path.join(root,'dist/verification/mobile.html'));
}

if(!process.argv.includes('--original')) {
 const contentPath=path.join(root,'dist/content.json');
 const content=JSON.parse(await readFile(contentPath,'utf8'));
 const groups={'Example':0,'3.1':1,'3.2':2,'3.3':3,'3.4':4,'Misc':5};
 const sorted=content.solutions.filter(q=>q.chapter===3).sort((a,b)=>(groups[a.section]-groups[b.section])||(+a.number-+b.number));
 let next=0;content.solutions=content.solutions.map(q=>q.chapter===3?sorted[next++]:q);
 await writeFile(contentPath,JSON.stringify(content));
}

// Smaller, reviewed calculation steps; verified questions, answers and explanations stay intact.
if(!process.argv.includes('--original')) {
 const contentPath=path.join(root,'dist/content.json');
 const content=JSON.parse(await readFile(contentPath,'utf8'));
 const expanded=JSON.parse(await readFile(path.join(root,'chapter3-expanded-steps.json'),'utf8'));
 const seen=new Set();
 for(const item of expanded){
  const q=content.solutions.find(q=>q.id===item.id);
  if(!q||q.chapter!==3||seen.has(item.id)||!item.steps?.length||item.steps.some(s=>typeof s!=='string'||!s.trim()))throw Error('Invalid Chapter 3 expansion '+item.id);
  if(item.steps.length<=q.steps.length)throw Error('Expansion must add meaningful intermediate working: '+item.id);
  seen.add(item.id);q.steps=item.steps;
 }
 await writeFile(contentPath,JSON.stringify(content));
 console.log('Applied detailed working to '+seen.size+' Chapter 3 solutions.');
}

// Optional guided practice; leave verified mathematical content untouched.
if(!process.argv.includes('--original')) {
 const appPath=path.join(root,'dist/app.js');let app=await readFile(appPath,'utf8');
 const start=app.indexOf('let revealed=q.explanation?q.steps.length:1;');
 const end=app.indexOf("$('#bookmark').onclick",start);
 if(start<0||end<0)throw Error('Solution controls changed; review practice integration.');
 const controls=`let revealed=q.steps.length;
 const steps=[...document.querySelectorAll('#steps .step')];
 const toolbar=document.createElement('div');toolbar.className='question-actions guided-controls';
 toolbar.innerHTML='<button type="button" class="secondary" id="practice-steps">જાતે પ્રયત્ન કરો / Try step by step</button><span id="step-count" role="status" aria-live="polite" aria-atomic="true"></span>';
 $('#steps').before(toolbar);
 $('#reveal').textContent='સંપૂર્ણ ઉકેલ / Show full solution';
 $('#next-step').textContent='આગળનું પગલું / Next step →';
 const updateSteps=(animate=false)=>{
  steps.forEach((el,i)=>{el.hidden=i>=revealed;el.classList.remove('step-enter');});
  if(animate&&revealed>0)steps[revealed-1].classList.add('step-enter');
  $('#answer').hidden=revealed<steps.length;
  $('#next-step').hidden=revealed>=steps.length;
  $('#step-count').textContent= revealed+' / '+steps.length+' પગલાં · steps shown';
  $('#practice-steps').textContent=revealed<steps.length?'ફરી શરૂ કરો / Restart practice':'જાતે પ્રયત્ન કરો / Try step by step';
 };
 const reveal=all=>{revealed=all?steps.length:Math.min(revealed+1,steps.length);updateSteps(!all);};
 $('#practice-steps').onclick=()=>{revealed=0;document.querySelectorAll('details.understanding').forEach(el=>el.open=false);updateSteps();$('#next-step').focus();};
 $('#next-step').onclick=()=>{reveal(false);if(revealed===steps.length)$('#reveal').focus();};
 $('#reveal').onclick=()=>reveal(true);
 $('#print').onclick=()=>{reveal(true);window.print();};
 updateSteps();

 // Follow textbook order among the available solutions in this section.
 if(q.kind==='Textbook'){
  const sectionSolutions=data.solutions
   .filter(item=>item.kind==='Textbook'&&item.chapter===q.chapter&&item.section===q.section)
   .sort((a,b)=>Number(a.number)-Number(b.number));
  if(sectionSolutions.length>1){
   const current=sectionSolutions.findIndex(item=>item.id===q.id);
   const previous=sectionSolutions[current-1];
   const next=sectionSolutions[current+1];
   const navigation=document.createElement('nav');
   navigation.className='question-actions solution-pagination';
   navigation.setAttribute('aria-label','વિભાગના ઉકેલો / Solutions in this section');
   const position=document.createElement('span');
   position.textContent=(current+1)+' / '+sectionSolutions.length+' ઉપલબ્ધ ઉકેલો · available solutions';
   navigation.append(position);
   for(const [item,label] of [[previous,'← પાછલો / Previous'],[next,'આગળનો / Next →']]){
    if(!item)continue;
    const link=document.createElement('a');
    link.className='secondary';
    link.href='#solution/'+encodeURIComponent(item.id);
    link.textContent=label+' · '+item.number;
    navigation.append(link);
   }
   $('#print').closest('.question-actions').after(navigation);
  }
 }
 `;
 app=app.slice(0,start)+controls+app.slice(end);
 const practiceCSS=`
 .guided-controls{align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px}
 #step-count{font-size:.85rem;line-height:1.6}
 .solution-pagination{align-items:center;flex-wrap:wrap;gap:10px}
 .solution-pagination span{flex-basis:100%;font-size:.85rem;line-height:1.6}
 .step[hidden],#next-step[hidden],#answer[hidden]{display:none!important}
 @media(prefers-reduced-motion:no-preference){.step-enter{animation:guided-reveal .22s ease-out}@keyframes guided-reveal{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}}
 @media print{.guided-controls,.solution-pagination,#next-step,#reveal{display:none!important}#steps .step[hidden],#answer[hidden]{display:flex!important}}
 `;
 app+='\n{const style=document.createElement("style");style.textContent='+JSON.stringify(practiceCSS)+';document.head.append(style); }';
 await writeFile(appPath,app);
}
