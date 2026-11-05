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
 st=[F(r'i=1,…,'+str(shape[0])+r';\quad j=1,…,'+str(shape[1]))]
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
# Exact arithmetic expansion: expose products and sums previously combined on one line.
from sympy.parsing.sympy_parser import parse_expr,standard_transformations,implicit_multiplication_application
numchecks=[]
def scalar(t):
 t=t.strip().replace(r'\left','').replace(r'\right','').replace(r'\,','').replace(r'\cdot','*')
 def atom(i):
  if t[i]=='{':
   level=1;j=i+1
   while level:
    if t[j]=='{':level+=1
    if t[j]=='}':level-=1
    j+=1
   return t[i+1:j-1],j
  if t[i]=='\\':
   m=re.match(r'\\[A-Za-z]+',t[i:]);return m.group(),i+len(m.group())
  return t[i],i+1
 while r'\frac' in t:
  i=t.rfind(r'\frac');a,j=atom(i+5);b,k=atom(j);t=t[:i]+'(('+a+')/('+b+'))'+t[k:]
 while r'\sqrt' in t:
  i=t.rfind(r'\sqrt');a,j=atom(i+5);t=t[:i]+'sqrt('+a+')'+t[j:]
 for c in ['alpha','beta','gamma','theta','sin','cos','tan','pi']:t=t.replace('\\'+c,c)
 t=t.replace('{','(').replace('}',')').replace('^','**')
 if not re.fullmatch(r'[0-9A-Za-z+*/().\s-]+',t):raise ValueError(t)
 local={v:s.Symbol(v,real=True) for v in ['a','b','c','d','x','y','z','k','alpha','beta','gamma','theta']}
 local.update(sin=s.sin,cos=s.cos,tan=s.tan,sqrt=s.sqrt,pi=s.pi)
 return parse_expr(t,local_dict=local,transformations=standard_transformations+(implicit_multiplication_application,))
def matrices(t):
 return [(m,s.Matrix([[scalar(c) for c in row.split('&')] for row in m.group(1).split(r'\\')])) for m in re.finditer(r'\\begin\{bmatrix\}(.*?)\\end\{bmatrix\}',t)]
def expanded_formula(t,q):
 try:
  # A single row/column dot product: multiplication, addition, result.
  m=re.fullmatch(r'(\(.+\)_\{\d+\})=(.+)=(.+)',t)
  if m:
   lhs,expr,rhs=m.groups();terms=re.findall(r'\(([^()]*)\)\(([^()]*)\)',expr)
   if terms and re.sub(r'\(([^()]*)\)\(([^()]*)\)','',expr).replace('+','').strip()=='':
    vals=[s.expand(scalar(a)*scalar(b)) for a,b in terms]
    assert s.simplify(sum(vals)-scalar(rhs))==0,(q['id'],t)
    mid='+'.join(T(v) for v in vals).replace('+-','-');numchecks.append({'id':q['id'],'type':'dot-product','expression':t})
    return list(dict.fromkeys([lhs+'='+expr,lhs+'='+mid,lhs+'='+rhs]))
  ms=matrices(t)
  if len(ms)==3:
   (ma,A),(mb,B),(mc,C)=ms;op=t[ma.end():mb.start()].strip();between=t[mb.end():mc.start()].strip()
   if op in ['+','-'] and between=='=' and A.shape==B.shape:
    prefix=t[:ma.start()]; factor=prefix.split('=')[-1].strip(); factor=scalar(factor) if factor else s.Integer(1); A=factor*A
    actual=A+B if op=='+' else A-B;assert s.simplify(actual-C)==s.zeros(*C.shape),(q['id'],t)
    label=prefix.split('=')[0] if '=' in prefix else 'C';lines=[('C=' if '=' not in prefix else '')+t[:mc.start()].rstrip('=')]
    for i in range(A.rows):
     for j in range(A.cols):
      component='('+label+')_{'+str(i+1)+str(j+1)+'}'
      lines.append(component+'=('+T(A[i,j])+')'+op+'('+T(B[i,j])+')='+T(C[i,j]))
    numchecks.append({'id':q['id'],'type':'matrix-sum-difference','expression':t});return lines+[t]
  if len(ms)==2 and t[ms[0][0].end():ms[1][0].start()].strip()=='=':
   (ma,A),(mb,B)=ms;prefix=t[:ma.start()];factor=prefix.split('=')[-1].strip()
   if factor and not any(c in factor for c in ['(',')','+']):
    k=scalar(factor);assert s.simplify(k*A-B)==s.zeros(*B.shape),(q['id'],t)
    label=prefix.split('=')[0];lines=[t[:mb.start()].rstrip('=')]
    for i in range(A.rows):
     for j in range(A.cols):lines.append('('+label+')_{'+str(i+1)+str(j+1)+'}=('+T(k)+')('+T(A[i,j])+')='+T(B[i,j]))
    numchecks.append({'id':q['id'],'type':'matrix-scaling','expression':t});return lines+[t]
  if len(ms)==1:
   ma,C=ms[0];label=t[:ma.start()].rstrip('=');labelmatch=re.fullmatch(r'(-?\d+)([AB])',label)
   if labelmatch:
    k,name=labelmatch.groups();given=re.search(name+r'=([^$]+)',q['prompt'])
    if given:
     inputs=matrices(given.group(1))
     if len(inputs)==1:
      A=inputs[0][1];assert s.simplify(int(k)*A-C)==s.zeros(*C.shape),(q['id'],t)
      lines=[label+'='+k+T(A)]
      for i in range(A.rows):
       for j in range(A.cols):lines.append('('+label+')_{'+str(i+1)+str(j+1)+'}='+k+'('+T(A[i,j])+')='+T(C[i,j]))
      numchecks.append({'id':q['id'],'type':'given-matrix-scaling','expression':t});return lines+[t]
 except (ValueError,TypeError,IndexError,SyntaxError,s.SympifyError):pass
 if r'\begin{' not in t:
  parts=t.split(r'\Rightarrow')
  if len(parts)>1 and all(p.strip() for p in parts):return [p.strip() for p in parts]
  parts=re.split(r',\s*\\quad|,\\;',t)
  if len(parts)>1 and all('=' in p for p in parts):return [p.strip() for p in parts]
 return [t]
def expand_steps(q):
 result=[]
 for old in q['steps']:
  matches=list(re.finditer(r'\$([^$]+)\$',old))
  if len(matches)==1:
   m=matches[0];parts=expanded_formula(m.group(1),q)
   if len(parts)>1:
    result.extend([(old[:m.start()] if i==0 else '')+F(p)+(old[m.end():] if i==len(parts)-1 else '') for i,p in enumerate(parts)]);continue
  result.append(old)
 return result
# Specific teaching expansions for compact proofs and formula-based examples.
if '--exercise31' not in sys.argv:
 M=s.Matrix
 q=base['tb3-Example-1'];setq('Example-1',['હાર 1 (કારખાનું I): '+F('(30,25)'),'હાર 2 (કારખાનું II): '+F('(25,31)'),'હાર 3 (કારખાનું III): '+F('(27,26)'),*q['steps'][:2],F('a_{32}=26')+'; હાર 3 ⇒ કારખાનું III, સ્તંભ 2 ⇒ સ્ત્રી કર્મચારીઓ.'])
 A=M(3,2,lambda i,j:s.Rational(abs(i+1-3*(j+1)),2));st=[F(r'i=1,2,3;\quad j=1,2')]
 for i in range(1,4):
  for j in range(1,3):
   val=i-3*j;lhs='a_{'+str(i)+str(j)+'}'
   st += [eq(lhs,r'\frac{|'+str(i)+'-3('+str(j)+r')|}{2}',r'\frac{|'+str(val)+r'|}{2}'),eq(lhs,r'\frac{'+str(abs(val))+'}{2}',T(A[i-1,j-1]))]
 st.append(F('A='+T(A)));setq('Example-3',st)
 A=M([[s.sqrt(3),1,-1],[2,3,0]]);B=M([[2,s.sqrt(5),1],[-2,3,s.Rational(1,2)]]);st=[base['tb3-Example-6']['steps'][0],F('c_{ij}=a_{ij}+b_{ij}')]
 for i in range(2):
  for j in range(3):st.append(eq('c_{'+str(i+1)+str(j+1)+'}','('+T(A[i,j])+')+('+T(B[i,j])+')',T(A[i,j]+B[i,j])))
 st.append(F('A+B='+T(A+B)));setq('Example-6',st)
 q=base['tb3-Example-23'];details=[F(r'(A^{k+1})_{11}=\cos k\theta\cos\theta-\sin k\theta\sin\theta'),F(r'(A^{k+1})_{11}=\cos(k\theta+\theta)=\cos((k+1)\theta)'),F(r'(A^{k+1})_{12}=\cos k\theta\sin\theta+\sin k\theta\cos\theta'),F(r'(A^{k+1})_{12}=\sin(k\theta+\theta)=\sin((k+1)\theta)'),F(r'(A^{k+1})_{21}=-\sin k\theta\cos\theta-\cos k\theta\sin\theta'),F(r'(A^{k+1})_{21}=-\sin(k\theta+\theta)=-\sin((k+1)\theta)'),F(r'(A^{k+1})_{22}=-\sin k\theta\sin\theta+\cos k\theta\cos\theta'),F(r'(A^{k+1})_{22}=\cos(k\theta+\theta)=\cos((k+1)\theta)')];setq('Example-23',q['steps'][:-1]+details+q['steps'][-1:])
 a,b,c,x,y,theta=s.symbols('a b c x y theta',real=True)
 pairs=[(M([[a,b],[-b,a]]),M([[a,b],[b,a]])),(M([[a*a+b*b,b*b+c*c],[a*a+c*c,a*a+b*b]]),M([[2*a*b,2*b*c],[-2*a*c,-2*a*b]])),(M([[-1,4,-6],[8,5,16],[2,8,5]]),M([[12,7,6],[8,0,5],[3,2,4]])),(M([[s.cos(x)**2,s.sin(x)**2],[s.sin(x)**2,s.cos(x)**2]]),M([[s.sin(x)**2,s.cos(x)**2],[s.cos(x)**2,s.sin(x)**2]]))]
 answers=[M([[2*a,2*b],[0,2*a]]),M([[(a+b)**2,(b+c)**2],[(a-c)**2,(a-b)**2]]),M([[11,11,0],[16,5,21],[5,10,9]]),s.ones(2)];st=[]
 for part,((A,B),C) in enumerate(zip(pairs,answers),1):
  assert s.simplify(A+B-C)==s.zeros(*C.shape);st += [f'({part}) '+F('C='+T(A)+'+'+T(B))]
  for i in range(C.rows):
   for j in range(C.cols):
    lhs='c_{'+str(i+1)+str(j+1)+'}';st += [eq(lhs,'('+T(A[i,j])+')+('+T(B[i,j])+')'),eq(lhs,T(s.expand(A[i,j]+B[i,j])),T(C[i,j]))]
  st.append(F('C='+T(C)));numchecks.append({'id':'tb3-32-2','type':'symbolic-matrix-addition','part':part})
 setq('32-2',st)
 setq('32-6',[F(r'C=\cos\theta\begin{bmatrix}\cos\theta&\sin\theta\\-\sin\theta&\cos\theta\end{bmatrix}+\sin\theta\begin{bmatrix}\sin\theta&-\cos\theta\\\cos\theta&\sin\theta\end{bmatrix}'),F(r'c_{11}=\cos\theta\cos\theta+\sin\theta\sin\theta'),F(r'c_{11}=\cos^2\theta+\sin^2\theta=1'),F(r'c_{12}=\cos\theta\sin\theta+\sin\theta(-\cos\theta)'),F(r'c_{12}=\cos\theta\sin\theta-\sin\theta\cos\theta=0'),F(r'c_{21}=\cos\theta(-\sin\theta)+\sin\theta\cos\theta'),F(r'c_{21}=-\cos\theta\sin\theta+\sin\theta\cos\theta=0'),F(r'c_{22}=\cos\theta\cos\theta+\sin\theta\sin\theta'),F(r'c_{22}=\cos^2\theta+\sin^2\theta=1'),F(r'C=\begin{bmatrix}1&0\\0&1\end{bmatrix}=I')])
 rot=lambda t:M([[s.cos(t),-s.sin(t),0],[s.sin(t),s.cos(t),0],[0,0,1]])
 A,B=rot(x),rot(y);C=rot(x+y);st=base['tb3-32-13']['steps'][:2]
 for i in range(3):
  for j in range(3):
   terms=[A[i,k]*B[k,j] for k in range(3)];val=sum(terms);assert s.trigsimp(val-C[i,j])==0
   lhs='(F(x)F(y))_{'+str(i+1)+str(j+1)+'}'
   st += [eq(lhs,'+'.join('('+T(A[i,k])+')('+T(B[k,j])+')' for k in range(3))),eq(lhs,T(val),T(C[i,j]))]
 st.append(base['tb3-32-13']['steps'][-1]);setq('32-13',st)
 setq('32-20',[F(r'10\ \text{dozen}=10\times12=120'),'રસાયણવિજ્ઞાન: '+F('120')+' નંગ.',F(r'8\ \text{dozen}=8\times12=96'),'ભૌતિકવિજ્ઞાન: '+F('96')+' નંગ.','અર્થશાસ્ત્ર: '+F(r'10\times12=120')+' નંગ.',*base['tb3-32-20']['steps'][:3],F(r'120\times80=9600'),F(r'96\times60=5760'),F(r'120\times40=4800'),F('QP=9600+5760+4800'),F('QP=15360+4800'),F('QP=20160')])
 As=[M([5,s.Rational(1,2),-1]),M([[1,-1],[2,3]]),M([[-1,5,6],[s.sqrt(3),5,6],[2,3,-1]])];st=[]
 for part,A in enumerate(As,1):
  st += [f'({part}) '+F('A='+T(A)),F(r'\text{order}(A)='+str(A.rows)+r'\times'+str(A.cols)),F(r'\text{order}(A^T)='+str(A.cols)+r'\times'+str(A.rows))]
  for i in range(A.rows):
   for j in range(A.cols):st.append(eq('(A^T)_{'+str(j+1)+str(i+1)+'}','a_{'+str(i+1)+str(j+1)+'}',T(A[i,j])))
  st.append(F('A^T='+T(A.T)))
 setq('33-1',st)
 al=s.Symbol('alpha',real=True);co=s.cos(al);si=s.sin(al);As=[M([[co,si],[-si,co]]),M([[si,co],[-co,si]])];st=[]
 for part,A in enumerate(As,1):
  st += [f'({part}) '+F('A^T='+T(A.T)),F('C=A^TA')]
  for i in range(2):
   for j in range(2):
    lhs='c_{'+str(i+1)+str(j+1)+'}';v=sum(A.T[i,k]*A[k,j] for k in range(2));assert s.trigsimp(v)==int(i==j)
    st += [eq(lhs,'+'.join('('+T(A.T[i,k])+')('+T(A[k,j])+')' for k in range(2))),eq(lhs,T(v),str(int(i==j)))]
  st.append(F(r'A^TA=\begin{bmatrix}1&0\\0&1\end{bmatrix}=I'))
 setq('33-6',st)
 A=M([[0,a,b],[-a,0,c],[-b,-c,0]])
 setq('33-9',[F('A^T='+T(A.T)),F('-A='+T(-A)),F('A^T=-A'),'(i) '+F('A+A^T=A-A'),F('A+A^T='+T(s.zeros(3))+'=O'),F(r'\frac12(A+A^T)=\frac12O=O'),'(ii) '+F('A-A^T=A-(-A)'),F('A-A^T=A+A=2A'),F('A-A^T='+T(2*A)),F(r'\frac12(A-A^T)=\frac12(2A)'),F(r'\frac12(A-A^T)=A='+T(A))])
 # Show the logical proof operations separately as well as the calculations.
 proof=[F('A^T=A'),F('B^T=B'),F('C=AB-BA'),F('C^T=(AB-BA)^T'),F('C^T=(AB)^T-(BA)^T'),F('(AB)^T=B^TA^T'),F('(BA)^T=A^TB^T'),F('C^T=B^TA^T-A^TB^T'),F('C^T=BA-AB'),F('C^T=-(AB-BA)=-C'),'અતઃ '+F('AB-BA')+' વિસંમિત છે.']
 setq('33-11',proof+['અતઃ વિકલ્પ (A).']);setq('Misc-1',proof)
 setq('Misc-2',[F('C=B^TAB'),F('C^T=(B^TAB)^T'),F('C^T=B^TA^T(B^T)^T'),F('(B^T)^T=B'),F('C^T=B^TA^TB'),'(i) '+F('A^T=A'),F('C^T=B^TAB'),F('C^T=C')+' ⇒ સંમિત.','(ii) '+F('A^T=-A'),F('C^T=B^T(-A)B'),F('C^T=-B^TAB'),F('C^T=-C')+' ⇒ વિસંમિત.'])
 setq('34-1',[F('B=A^{-1}'),F('AB=AA^{-1}'),F('AA^{-1}=I'),F('AB=I'),F('BA=A^{-1}A'),F('A^{-1}A=I'),F('BA=I'),F('AB=BA=I'),'અતઃ વિકલ્પ (D).'])

if '--exercise31' not in sys.argv:
 for id,q in base.items():
  if id not in custom:
   steps=expand_steps(q)
   if len(steps)>len(q['steps']):custom[id]=steps
 print('Not automatically expanded:',[(id,len(q['steps'])) for id,q in base.items() if id not in custom])

selected=[{'id':id,'steps':steps} for id,steps in custom.items()]
for item in selected:
 assert item['id'] in base and len(item['steps'])>len(base[item['id']]['steps']),item['id']
(R/'chapter3-expanded-steps.json').write_text(json.dumps(selected,ensure_ascii=False,indent=2)+'\n')
print('Expanded',len(selected),'solutions:',sum(len(base[q['id']]['steps']) for q in selected),'→',sum(len(q['steps']) for q in selected),'steps; question/answer data untouched.')
