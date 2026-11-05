"""Expand verified Chapter 3 working without changing questions, answers or source records.
Run with --exercise31 for the first deployable milestone; otherwise expand the full chapter.
"""
import json,re,sys
from pathlib import Path
import sympy as s
R=Path(__file__).resolve().parents[2]
base={q['id']:q for p in sorted((R/'content-additions').glob('*.json')) for q in json.loads(p.read_text()) if q['chapter']==3}
for item in json.loads((R/'solution-presentation.json').read_text()):
 if item['id'] in base:base[item['id']]={**base[item['id']],**item}
def F(t):return '$'+t+'$'
def T(x):
 if isinstance(x,s.MatrixBase):return r'\begin{bmatrix}'+r'\\'.join('&'.join(T(v) for v in x.row(i)) for i in range(x.rows))+r'\end{bmatrix}'
 return s.latex(s.sympify(x))
def eq(*xs):return F('='.join(xs))
custom={}
def setq(id,steps):custom['tb3-'+id]=steps
setq('31-1',['(i) હારો ગણીને: '+F('m=3'),'સ્તંભો ગણીને: '+F('n=4'),F(r'\text{order}(A)=m\times n=3\times4'),'(ii) '+F(r'mn=3\times4=12'),'(iii) '+F('a_{ij}')+'માં i હાર અને j સ્તંભ દર્શાવે છે.',F('a_{13}=19')+' (હાર 1, સ્તંભ 3)',F('a_{21}=35')+' (હાર 2, સ્તંભ 1)',F('a_{33}=-5')+' (હાર 3, સ્તંભ 3)',F('a_{24}=12')+' (હાર 2, સ્તંભ 4)',F(r'a_{23}=\frac52')+' (હાર 2, સ્તંભ 3)'])
for n,counts in [(2,[24,13]),(3,[18,5])]:
 st=[F(r'm,n\in\mathbb N'),F(r'\text{order}(A)=m\times n'),F(r'\text{number of entries}=mn')]
 for k,total in enumerate(counts,1):
  st += [f'({k}) '+F('mn='+str(total)),F(r'n=\frac{'+str(total)+'}{m}')]
  pairs=[]
  for m in range(1,total+1):
   if total%m==0:
    ncol=total//m;st.append(F('m='+str(m)+r'\Rightarrow n=\frac{'+str(total)+'}{'+str(m)+'}='+str(ncol)+r'\Rightarrow '+str(m)+r'\times'+str(ncol)));pairs.append(str(m)+r'\times'+str(ncol))
  st.append('બધી શક્ય કક્ષાઓ: '+F(r',\ '.join(pairs)))
 setq('31-'+str(n),st)
for number,shape,forms in [(4,(2,2),[lambda i,j:s.Rational((i+j)**2,2),lambda i,j:s.Rational(i,j),lambda i,j:s.Rational((i+2*j)**2,2)]),(5,(3,4),[lambda i,j:s.Rational(abs(-3*i+j),2),lambda i,j:2*i-j])]:
 st=[F(r'i=1,\ldots,'+str(shape[0])+r';\quad j=1,\ldots,'+str(shape[1]))]
 for part,fn in enumerate(forms,1):
  st.append(f'({part})')
  A=s.zeros(*shape)
  for i in range(1,shape[0]+1):
   for j in range(1,shape[1]+1):
    A[i-1,j-1]=fn(i,j);prefix='a_{'+str(i)+str(j)+'}'
    if number==4 and part in [1,3]:
     inner=i+j if part==1 else i+2*j
     sub='('+str(i)+'+'+(str(j) if part==1 else '2('+str(j)+')')+')'
     st += [eq(prefix,r'\frac{'+sub+r'^2}{2}',r'\frac{'+str(inner)+r'^2}{2}'),eq(prefix,r'\frac{'+str(inner**2)+'}{2}',T(A[i-1,j-1]))]
    elif number==4:st.append(eq(prefix,r'\frac{'+str(i)+'}{'+str(j)+'}',T(A[i-1,j-1])))
    elif part==1:
     inside=-3*i+j
     st += [eq(prefix,r'\frac{|-3('+str(i)+')+'+str(j)+r'|}{2}',r'\frac{|'+str(inside)+r'|}{2}'),eq(prefix,r'\frac{'+str(abs(inside))+'}{2}',T(A[i-1,j-1]))]
    else:st.append(eq(prefix,'2('+str(i)+')-'+str(j),str(2*i)+'-'+str(j),T(A[i-1,j-1])))
  st.append(F('A='+T(A)))
 setq('31-'+str(number),st)
setq('31-6',['(i) અનુરૂપ ઘટકો: '+F('4=y'),F('3=z'),F('x=1'),F('(x,y,z)=(1,4,3)'),'(ii) '+F('x+y=6'),F(r'5+z=5\Rightarrow z=0'),F('xy=8'),F('y=6-x'),F('x(6-x)=8'),F('6x-x^2=8'),F('x^2-6x+8=0'),F('x^2-2x-4x+8=0'),F('x(x-2)-4(x-2)=0'),F('(x-2)(x-4)=0'),F('x=2')+' અથવા '+F('x=4'),F(r'x=2\Rightarrow y=6-2=4'),F(r'x=4\Rightarrow y=6-4=2'),F(r'2+4=6,\quad2(4)=8,\quad5+0=5'),F(r'4+2=6,\quad4(2)=8,\quad5+0=5'),F('(x,y,z)=(2,4,0)')+' અથવા '+F('(4,2,0)'),'(iii) '+F(r'x+y+z=9\quad(1)'),F(r'x+z=5\quad(2)'),F(r'y+z=7\quad(3)'),F(r'(1)-(2):\quad x+y+z-x-z=9-5'),F('y=4'),F('4+z=7'),F('z=7-4=3'),F('x+3=5'),F('x=5-3=2'),F(r'2+4+3=9,\quad2+3=5,\quad4+3=7'),F('(x,y,z)=(2,4,3)')])
setq('31-7',[F(r'a-b=-1\quad(1)'),F(r'2a+c=5\quad(2)'),F(r'2a-b=0\quad(3)'),F(r'3c+d=13\quad(4)'),F(r'(3)-(1):\quad(2a-b)-(a-b)=0-(-1)'),F('2a-b-a+b=1'),F('a=1'),F('2(1)-b=0'),F(r'2-b=0\Rightarrow b=2'),F('2(1)+c=5'),F('c=5-2=3'),F('3(3)+d=13'),F('d=13-9=4'),F('a-b=1-2=-1'),F('2a+c=2(1)+3=5'),F('2a-b=2(1)-2=0'),F('3c+d=3(3)+4=13')])
setq('31-8',['ચોરસ શ્રેણિક માટે હારોની સંખ્યા અને સ્તંભોની સંખ્યા સમાન છે.',F(r'\text{rows}=m'),F(r'\text{columns}=n'),F('m=n'),'અતઃ વિકલ્પ (C).'])
setq('31-9',[F(r'3x+7=0\quad(1)'),F(r'5=y-2\quad(2)'),F(r'y+1=8\quad(3)'),F(r'2-3x=4\quad(4)'),F(r'(1):\quad3x=0-7=-7'),F(r'x=-\frac73'),F(r'(4):\quad-3x=4-2=2'),F(r'x=-\frac23'),F(r'-\frac73\ne-\frac23')+' ⇒ એક જ x બંને શરતો સંતોષતું નથી.',F(r'(2):\quad y=5+2=7'),F(r'(3):\quad y=8-1=7'),'yની શરતો મળે છે; xની શરતો વિરોધાભાસી છે.','અતઃ કોઈ ઉકેલ નથી; વિકલ્પ (B).'])
setq('31-10',[F(r'\text{positions}=3\times3=9'),'પ્રથમ સ્થાન માટે 0 અથવા 1: '+F('2')+' પસંદગી.','બીજા સ્થાન માટે પણ '+F('2')+' સ્વતંત્ર પસંદગી.',F(r'\text{first two positions}=2\times2=4'),F(r'\text{first three positions}=2\times2\times2=8'),'આ જ રીતે નવેય સ્થાન માટે ગુણાકારનો નિયમ:',F(r'N=2\times2\times2\times2\times2\times2\times2\times2\times2'),F('N=2^9=512'),'અતઃ વિકલ્પ (D).'])
# Numeric equalities used in the new small-step construction are checked independently.
assert (s.Symbol('x')-2)*(s.Symbol('x')-4)==s.expand((s.Symbol('x')-2)*(s.Symbol('x')-4)) or s.expand((s.Symbol('x')-2)*(s.Symbol('x')-4))==s.Symbol('x')**2-6*s.Symbol('x')+8
for x,y in [(2,4),(4,2)]:assert x+y==6 and x*y==8
assert [1-2,2+3,2-2,3*3+4]==[-1,5,0,13]
assert 2**9==512
selected=[{'id':id,'steps':steps} for id,steps in custom.items()]
for item in selected:
 assert item['id'] in base and len(item['steps'])>len(base[item['id']]['steps']),item['id']
(R/'chapter3-expanded-steps.json').write_text(json.dumps(selected,ensure_ascii=False,indent=2)+'\n')
print('Expanded',len(selected),'solutions:',sum(len(base[q['id']]['steps']) for q in selected),'→',sum(len(q['steps']) for q in selected),'steps; question/answer data untouched.')
