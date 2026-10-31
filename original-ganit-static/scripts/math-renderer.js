// Native MathML: no external scripts, fonts or runtime server.
function mathText(value){
 const symbols={pi:'π',infty:'∞',ne:'≠',neq:'≠',leq:'≤',geq:'≥',Rightarrow:'⇒',to:'→',cdot:'·',times:'×',pm:'±',setminus:'∖',in:'∈',prime:'′'};
 function formula(tex){let i=0;
  function atom(){while(/\s/.test(tex[i]||'')&&i<tex.length)i++;let c=tex[i++];if(!c)return '<mrow/>';
   if(c==='{'){let r=sequence('}');return '<mrow>'+r+'</mrow>';}
   if(c==='\\') {let m=/^[A-Za-z]+/.exec(tex.slice(i));if(!m){i++;return '<mspace width="0.15em"/>';}let cmd=m[0];i+=cmd.length;
    if(cmd==='frac')return '<mfrac>'+atom()+atom()+'</mfrac>';
    if(cmd==='sqrt')return '<msqrt>'+atom()+'</msqrt>';
    if(cmd==='left'||cmd==='right')return atom();
    if(cmd==='text'){let start=++i;while(i<tex.length&&tex[i]!=='}')i++;return '<mtext>'+esc(tex.slice(start,i++))+'</mtext>';}
    if(cmd==='mathbb')return '<mstyle mathvariant="double-struck">'+atom()+'</mstyle>';
    if(symbols[cmd])return '<mo>'+symbols[cmd]+'</mo>';
    return '<mi mathvariant="normal">'+esc(cmd)+'</mi>';
   }
   if(/[0-9]/.test(c))return '<mn>'+c+'</mn>';
   return (/[A-Za-z]/.test(c)?'<mi>':'<mo>')+esc(c)+(/[A-Za-z]/.test(c)?'</mi>':'</mo>');
  }
  function sequence(end){let out='';while(i<tex.length&&tex[i]!==end){if(/\s/.test(tex[i])){i++;continue;}let a=atom();while(tex[i]==='^'||tex[i]==='_'){let op=tex[i++];a=(op==='^'?'<msup>':'<msub>')+a+atom()+(op==='^'?'</msup>':'</msub>');}out+=a;}if(end)i++;return out;}
  return '<math xmlns="http://www.w3.org/1998/Math/MathML" style="font-size:1.1em"><mrow>'+sequence()+'</mrow></math>';
 }
 return String(value??'').split(/(\$[^$]+\$)/g).map(s=>s.startsWith('$')&&s.endsWith('$')?formula(s.slice(1,-1)):esc(s)).join('');
}
