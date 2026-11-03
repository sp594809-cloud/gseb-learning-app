// Native MathML: no external scripts, fonts or runtime server.
function mathText(value){
 const symbols={pi:'π',infty:'∞',ne:'≠',neq:'≠',leq:'≤',geq:'≥',Rightarrow:'⇒',Leftrightarrow:'⇔',to:'→',cdot:'·',times:'×',pm:'±',setminus:'∖',in:'∈',prime:'′',theta:'θ',alpha:'α',beta:'β',gamma:'γ',delta:'δ',sum:'∑',varnothing:'∅',cap:'∩',ge:'≥',le:'≤'};
 function parseTex(tex){let i=0;
  function atom(){while(/\s/.test(tex[i]||'')&&i<tex.length)i++;let c=tex[i++];if(!c)return '<mrow/>';
   if(c==='{')return '<mrow>'+sequence('}')+'</mrow>';
   if(c==='\\'){
    const match=/^[A-Za-z]+/.exec(tex.slice(i));if(!match){i++;return '<mspace width="0.15em"/>';}
    const cmd=match[0];i+=cmd.length;
    if(cmd==='quad'||cmd==='qquad')return '<mspace width="'+(cmd==='quad'?'1em':'2em')+'"/>';
    if(cmd==='frac')return '<mfrac>'+atom()+atom()+'</mfrac>';
    if(cmd==='sqrt')return '<msqrt>'+atom()+'</msqrt>';
    if(cmd==='left'||cmd==='right')return atom();
    if(cmd==='text'){const start=++i;while(i<tex.length&&tex[i]!=='}')i++;return '<mtext>'+esc(tex.slice(start,i++))+'</mtext>';}
    if(cmd==='mathbb')return '<mstyle mathvariant="double-struck">'+atom()+'</mstyle>';
    if(cmd==='begin'){
     if(tex[i]!=='{')return '<mtext>Invalid matrix</mtext>';
     const close=tex.indexOf('}',i),env=tex.slice(i+1,close);i=close+1;
     const ending='\\end{'+env+'}',end=tex.indexOf(ending,i);
     if(end<0||!['matrix','bmatrix','pmatrix','vmatrix'].includes(env))return '<mtext>Invalid matrix</mtext>';
     const body=tex.slice(i,end);i=end+ending.length;
     const table='<mtable columnalign="center" columnspacing="0.8em" rowspacing="0.35em">'+body.split('\\\\').filter(row=>row.trim()).map(row=>'<mtr>'+row.split('&').map(cell=>'<mtd><mrow>'+parseTex(cell.trim())+'</mrow></mtd>').join('')+'</mtr>').join('')+'</mtable>';
     const fences={bmatrix:['[',']'],pmatrix:['(',')'],vmatrix:['|','|']}[env];
     return fences?'<mrow><mo fence="true" stretchy="true">'+fences[0]+'</mo>'+table+'<mo fence="true" stretchy="true">'+fences[1]+'</mo></mrow>':table;
    }
    if(symbols[cmd])return '<mo>'+symbols[cmd]+'</mo>';
    return '<mi mathvariant="normal">'+esc(cmd)+'</mi>';
   }
   if(/[0-9]/.test(c))return '<mn>'+c+'</mn>';
   return (/[A-Za-z]/.test(c)?'<mi>':'<mo>')+esc(c)+(/[A-Za-z]/.test(c)?'</mi>':'</mo>');
  }
  function sequence(end){let out='';while(i<tex.length&&tex[i]!==end){if(/\s/.test(tex[i])){i++;continue;}let a=atom();while(tex[i]==='^'||tex[i]==='_'){const op=tex[i++];a=(op==='^'?'<msup>':'<msub>')+a+atom()+(op==='^'?'</msup>':'</msub>');}out+=a;}if(end)i++;return out;}
  return sequence();
 }
 function formula(tex){return '<span style="display:inline-block;max-width:100%;overflow-x:auto;overflow-y:hidden;vertical-align:middle;padding:2px 0"><math xmlns="http://www.w3.org/1998/Math/MathML" displaystyle="true" style="font-size:1.1em"><mrow>'+parseTex(tex)+'</mrow></math></span>';}
 return String(value??'').split(/(\$[^$]+\$)/g).map(s=>s.startsWith('$')&&s.endsWith('$')?formula(s.slice(1,-1)):esc(s)).join('');
}
