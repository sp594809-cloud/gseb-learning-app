"""Source pass: visually transcribed Gujarati Maths Part I pp48–50, 3 November 2026.
Calculation pass: SymPy plus independent entrywise multiplication/substitution.
Run from this directory's project root. Does not alter existing records.
"""
import json, re
from pathlib import Path
import sympy as s
R=Path(__file__).resolve().parents[2]
M=s.Matrix
checks=[]
def tex(x):
 if isinstance(x,s.MatrixBase):return r'\begin{bmatrix}'+r'\\'.join('&'.join(tex(v) for v in x.row(i)) for i in range(x.rows))+r'\end{bmatrix}'
 return s.latex(s.sympify(x))
def f(t):return '$'+t+'$'
def mat(x):return f(tex(x))
def manual(A,B):
 assert A.cols==B.rows
 return M([[sum(A[i,k]*B[k,j] for k in range(A.cols)) for j in range(B.cols)] for i in range(A.rows)])
def checked(A,B):
 C=A*B;assert s.simplify(C-manual(A,B))==s.zeros(C.rows,C.cols);checks.append('entrywise product '+str(A.shape)+' by '+str(B.shape));return C
def product(A,B,label):
 C=checked(A,B);st=[f(label+'='+tex(A)+tex(B))]
 for i in range(C.rows):
  for j in range(C.cols):st.append(f('('+label+')_{'+str(i+1)+str(j+1)+'}='+ '+'.join('('+tex(A[i,k])+')('+tex(B[k,j])+')' for k in range(A.cols))+'='+tex(s.simplify(C[i,j]))))
 st.append(f(label+'='+tex(C)));return st,C
out=[]
def add(n,prompt,steps,answer,explain):
 q=dict(id=f'tb3-32-{n}',chapter=3,section='3.2',number=str(n),page=48 if n<=2 else 49 if n<=13 else 50,prompt=prompt,steps=steps,answer=answer,explanation=explain,kind='Textbook',graph=None,gu='મૂળ પાઠ્યપુસ્તકના પ્રશ્ન સાથે ચકાસેલો ઉકેલ.',verification={'source':f'book/{62 if n<=2 else 63 if n<=13 else 64}.webp','printedPage':48 if n<=2 else 49 if n<=13 else 50,'checkedOn':'2026-11-03','passes':['Question and all subparts visually matched to uploaded Gujarati textbook pages 48–50.','Independently recomputed exact matrix entries, substituted solutions, or checked algebraic proof; verification/content-generators/exercise32.py.']})
 assert len(steps)>=3
 for v in [prompt,*steps,answer,*explain]:assert v.count('$')%2==0
 out.append(q)
A=M([[2,4],[3,2]]);B=M([[1,3],[-2,5]]);C=M([[-2,5],[3,4]])
st=[f('A+B='+tex(M([[2+1,4+3],[3-2,2+5]]))),f('A-B='+tex(M([[2-1,4-3],[3+2,2-5]]))),f('3A='+tex(3*A)),f('3A-C='+tex(3*A)+'-'+tex(C)+'='+tex(3*A-C))]
a,ab=product(A,B,'AB');b,ba=product(B,A,'BA');st+=a+b
add(1,'જો '+f('A='+tex(A))+', '+f('B='+tex(B))+', '+f('C='+tex(C))+' હોય તો (i) A+B (ii) A−B (iii) 3A−C (iv) AB (v) BA શોધો.',st,'; '.join(f(v+'='+tex(x)) for v,x in [('A+B',A+B),('A-B',A-B),('3A-C',3*A-C),('AB',ab),('BA',ba)]),['સરવાળા અને બાદબાકીમાં સમાન સ્થાનના ઘટકો પર ક્રિયા કરીએ. અદિશ ગુણાકારમાં દરેક ઘટકને તે સંખ્યાથી ગુણીએ.','ABના (i,j) સ્થાને Aની iમી હાર અને Bના jમા સ્તંભનાં અનુરૂપ ઘટકોના ગુણનફળો ઉમેરીએ. BA અલગથી ગણવો પડે; સામાન્ય રીતે AB અને BA સમાન નથી.'])
a,b,c,x=s.symbols('a b c x',real=True)
pairs=[(M([[a,b],[-b,a]]),M([[a,b],[b,a]])),(M([[a*a+b*b,b*b+c*c],[a*a+c*c,a*a+b*b]]),M([[2*a*b,2*b*c],[-2*a*c,-2*a*b]])),(M([[-1,4,-6],[8,5,16],[2,8,5]]),M([[12,7,6],[8,0,5],[3,2,4]])),(M([[s.cos(x)**2,s.sin(x)**2],[s.sin(x)**2,s.cos(x)**2]]),M([[s.sin(x)**2,s.cos(x)**2],[s.cos(x)**2,s.sin(x)**2]]))]
ans=[M([[2*a,2*b],[0,2*a]]),M([[(a+b)**2,(b+c)**2],[(a-c)**2,(a-b)**2]]),M([[11,11,0],[16,5,21],[5,10,9]]),s.ones(2)]
st=[]
for k,((A,B),C) in enumerate(zip(pairs,ans),1):
 assert s.simplify(A+B-C)==s.zeros(A.rows,A.cols)
 st += [f'({k}) '+f(tex(A)+'+'+tex(B)),f('='+tex((A+B).applyfunc(s.expand))),f('='+tex(C))]
add(2,'ગણતરી કરો: '+'; '.join(f'({i}) '+f(tex(A)+'+'+tex(B)) for i,(A,B) in enumerate(pairs,1)),st,'; '.join(f'({i}) '+mat(C) for i,C in enumerate(ans,1)),['અનુરૂપ ઘટકો ઉમેરવાના છે. બીજા ભાગમાં પૂર્ણવર્ગનાં સૂત્રો વાપરીએ: '+f('u^2+2uv+v^2=(u+v)^2')+' અને '+f('u^2-2uv+v^2=(u-v)^2')+'.','ચોથા ભાગમાં દરેક સ્થાને '+f(r'\sin^2x+\cos^2x=1')+' મળે છે; પરિણામ સર્વ ઘટક 1 ધરાવતો શ્રેણિક છે.'])
pairs=[(M([[a,b],[-b,a]]),M([[a,-b],[b,a]])),(M([1,2,3]),M([[2,3,4]])),(M([[1,-2],[2,3]]),M([[1,2,3],[2,3,1]])),(M([[2,3,4],[3,4,5],[4,5,6]]),M([[1,-3,5],[0,2,4],[3,0,5]])),(M([[2,1],[3,2],[-1,1]]),M([[1,0,1],[-1,2,1]])),(M([[3,-1,3],[-1,0,2]]),M([[2,-3],[1,0],[3,1]]))]
st=[];ans=[]
for k,(A,B) in enumerate(pairs,1):
 st.append(f'({k}) '+f(str(A.rows)+r'\times'+str(A.cols)+r'\;\cdot\;'+str(B.rows)+r'\times'+str(B.cols)+r'\Rightarrow'+str(A.rows)+r'\times'+str(B.cols)))
 t,C=product(A,B,'P');st+=t;ans.append(C)
add(3,'ગુણાકાર કરો: '+'; '.join(f'({i}) '+f(tex(A)+tex(B)) for i,(A,B) in enumerate(pairs,1)),st,'; '.join(f'({i}) '+mat(C) for i,C in enumerate(ans,1)),['ગુણાકાર માટે પ્રથમ શ્રેણિકના સ્તંભોની સંખ્યા બીજા શ્રેણિકની હારોની સંખ્યાના બરાબર હોવી જોઈએ.','દરેક ભાગમાં P ગુણાકાર દર્શાવે છે. દરેક '+f(r'p_{ij}=\sum_{k=1}^{r}a_{ik}b_{kj}')+' માટે હાર અને સ્તંભની સંપૂર્ણ ગણતરી મુખ્ય ઉકેલમાં આપી છે.'])
A=M([[1,2,-3],[5,0,2],[1,-1,1]]);B=M([[3,-1,2],[4,2,5],[2,0,3]]);C=M([[4,1,2],[0,3,2],[1,-2,3]])
assert A+(B-C)==(A+B)-C
add(4,'જો '+f('A='+tex(A))+', '+f('B='+tex(B))+', '+f('C='+tex(C))+' હોય તો A+B, B−C શોધો અને '+f('A+(B-C)=(A+B)-C')+' ચકાસો.',[f('A+B='+tex(A)+'+'+tex(B)+'='+tex(A+B)),f('B-C='+tex(B)+'-'+tex(C)+'='+tex(B-C)),f('A+(B-C)='+tex(A)+'+'+tex(B-C)+'='+tex(A+B-C)),f('(A+B)-C='+tex(A+B)+'-'+tex(C)+'='+tex(A+B-C)),f('A+(B-C)=(A+B)-C')],f('A+B='+tex(A+B))+'; '+f('B-C='+tex(B-C))+'; '+f('A+(B-C)=(A+B)-C='+tex(A+B-C)),['દરેક ક્રિયામાં સમાન સ્થાનના ઘટકો જ ઉમેરવા કે બાદ કરવાના છે. બંને બાજુ અલગથી ગણતાં સમાન શ્રેણિક મળે છે, તેથી સમાનતા ચકાસાય છે.'])
D=M([[2,3,5],[1,2,4],[7,6,2]]);A=D/3;B=D/5
add(5,'જો '+f('A='+tex(A))+', '+f('B='+tex(B))+' હોય તો '+f('3A-5B')+' શોધો.',[f('3A=3'+tex(A)+'='+tex(D)),f('5B=5'+tex(B)+'='+tex(D)),f('3A-5B='+tex(D)+'-'+tex(D)+'='+tex(s.zeros(3))+'=O')],f('3A-5B=O'),['પહેલા અદિશ ગુણાકાર કરીને અપૂર્ણાંકો દૂર કરીએ. 3A અને 5Bના દરેક અનુરૂપ ઘટક સમાન હોવાથી તફાવત શૂન્ય શ્રેણિક છે.'])
t=s.symbols('theta',real=True);co=s.cos(t);si=s.sin(t);A=M([[co,si],[-si,co]]);B=M([[si,-co],[co,si]])
assert s.simplify(co*A+si*B)==s.eye(2)
add(6,'સાદું રૂપ આપો: '+f(r'\cos\theta'+tex(A)+r'+\sin\theta'+tex(B)),[f('= '+tex(co*A)+'+'+tex(si*B)),f('='+r'\begin{bmatrix}\cos^2\theta+\sin^2\theta&\cos\theta\sin\theta-\sin\theta\cos\theta\\-\cos\theta\sin\theta+\sin\theta\cos\theta&\cos^2\theta+\sin^2\theta\end{bmatrix}'),f('='+tex(s.eye(2))+'=I')],f('I'),['વિકર્ણ પર '+f(r'\cos^2\theta+\sin^2\theta=1')+' વાપરવું. બાકીનાં બે ઘટકો સમાન ગુણાકારોના તફાવત હોવાથી શૂન્ય થાય છે.'])
C=M([[7,0],[2,5]]);D=M([[3,0],[0,3]]);X=(C+D)/2;Y=(C-D)/2
E=M([[2,3],[4,0]]);F=M([[2,-2],[-1,5]]);U=(3*F-2*E)/5;V=(3*E-2*F)/5
assert X+Y==C and X-Y==D and 2*U+3*V==E and 3*U+2*V==F
add(7,'X,Y શોધો: (i) '+f('X+Y='+tex(C))+', '+f('X-Y='+tex(D))+'; (ii) '+f('2X+3Y='+tex(E))+', '+f('3X+2Y='+tex(F)),['(i) '+f('2X='+tex(C)+'+'+tex(D)+'='+tex(2*X)),f('X='+tex(X)),f('2Y='+tex(C)+'-'+tex(D)+'='+tex(2*Y)),f('Y='+tex(Y)),'(ii) '+f('4X+6Y='+tex(2*E))+', '+f('9X+6Y='+tex(3*F)),f('5X='+tex(3*F)+'-'+tex(2*E)+'='+tex(5*U)),f('X='+tex(U)),f('6X+9Y='+tex(3*E))+', '+f('6X+4Y='+tex(2*F)),f('5Y='+tex(3*E)+'-'+tex(2*F)+'='+tex(5*V)),f('Y='+tex(V))],'(i) '+f('X='+tex(X))+', '+f('Y='+tex(Y))+'; (ii) '+f('X='+tex(U))+', '+f('Y='+tex(V)),['પહેલા ભાગમાં સરવાળા–તફાવતથી X અને Y અલગ પડે છે. બીજા ભાગમાં Yના ગુણાંક સમાન કરીને બાદ કરીએ તો X મળે છે; પછી Xના ગુણાંક સમાન કરીને Y મેળવીએ.','બંને ભાગમાં મેળવેલા X,Y મૂળ બંને સમીકરણોમાં મૂકીને ચકાસ્યા છે.'])
Y=M([[3,2],[1,4]]);D=M([[1,0],[-3,2]]);X=(D-Y)/2;assert 2*X+Y==D
add(8,'જો '+f('Y='+tex(Y))+' અને '+f('2X+Y='+tex(D))+' હોય તો X શોધો.',[f('2X='+tex(D)+'-'+tex(Y)),f('2X='+tex(2*X)),f(r'X=\frac{1}{2}'+tex(2*X)+'='+tex(X)),f('2'+tex(X)+'+'+tex(Y)+'='+tex(D))],f('X='+tex(X)),['બંને બાજુથી Y બાદ કરીને 2X મેળવો અને દરેક ઘટકને 2થી ભાગો. છેલ્લે મૂળ સમીકરણમાં મૂકીને ચકાસ્યું છે.'])
add(9,f(r'2\begin{bmatrix}1&3\\0&x\end{bmatrix}+\begin{bmatrix}y&0\\1&2\end{bmatrix}=\begin{bmatrix}5&6\\1&8\end{bmatrix}')+' હોય તો x,y શોધો.',[f(r'\begin{bmatrix}2+y&6\\1&2x+2\end{bmatrix}=\begin{bmatrix}5&6\\1&8\end{bmatrix}'),f(r'2+y=5\Rightarrow y=3'),f(r'2x+2=8\Rightarrow2x=6\Rightarrow x=3'),f(r'2\begin{bmatrix}1&3\\0&3\end{bmatrix}+\begin{bmatrix}3&0\\1&2\end{bmatrix}=\begin{bmatrix}5&6\\1&8\end{bmatrix}')],f(r'x=3,\ y=3'),['બે સમાન શ્રેણિકના દરેક અનુરૂપ ઘટક સમાન હોય છે. (1,1) અને (2,2) ઘટકથી અજ્ઞાતો મળે છે; બાકીના બે ઘટક પણ સંતોષાય છે.'])
add(10,f(r'2\begin{bmatrix}x&z\\y&t\end{bmatrix}+3\begin{bmatrix}1&-1\\0&2\end{bmatrix}=3\begin{bmatrix}3&5\\4&6\end{bmatrix}')+' માંથી x,y,z,t શોધો.',[f(r'\begin{bmatrix}2x+3&2z-3\\2y&2t+6\end{bmatrix}=\begin{bmatrix}9&15\\12&18\end{bmatrix}'),f(r'2x+3=9\Rightarrow x=3'),f(r'2z-3=15\Rightarrow z=9'),f(r'2y=12\Rightarrow y=6'),f(r'2t+6=18\Rightarrow t=6'),f(r'2\begin{bmatrix}3&9\\6&6\end{bmatrix}+\begin{bmatrix}3&-3\\0&6\end{bmatrix}=\begin{bmatrix}9&15\\12&18\end{bmatrix}')],f(r'x=3,\ y=6,\ z=9,\ t=6'),['અદિશ ગુણાકાર કર્યા પછી ચાર અનુરૂપ ઘટકો સરખાવવાથી ચાર સ્વતંત્ર સમીકરણ મળે છે. દરેક અજ્ઞાતનું સ્થાન ધ્યાનમાં રાખવું: z ઉપર જમણે છે અને y નીચે ડાબે છે.'])
add(11,f(r'x\begin{bmatrix}2\\3\end{bmatrix}+y\begin{bmatrix}-1\\1\end{bmatrix}=\begin{bmatrix}10\\5\end{bmatrix}')+' માંથી x,y શોધો.',[f(r'2x-y=10,\quad3x+y=5'),f(r'(2x-y)+(3x+y)=10+5\Rightarrow5x=15'),f('x=3'),f(r'3(3)+y=5\Rightarrow y=-4'),f(r'2(3)-(-4)=10,\quad3(3)+(-4)=5')],f(r'x=3,\ y=-4'),['બંને સમીકરણ ઉમેરવાથી y રદ થાય છે. x મેળવીને બીજા સમીકરણમાં મૂકવાથી y મળે છે; બંને મૂળ સમીકરણ સંતોષાય છે.'])
add(12,f(r'3\begin{bmatrix}x&y\\z&w\end{bmatrix}=\begin{bmatrix}x&6\\-1&2w\end{bmatrix}+\begin{bmatrix}4&x+y\\z+w&3\end{bmatrix}')+' માંથી x,y,z,w શોધો.',[f(r'\begin{bmatrix}3x&3y\\3z&3w\end{bmatrix}=\begin{bmatrix}x+4&6+x+y\\-1+z+w&2w+3\end{bmatrix}'),f(r'3x=x+4\Rightarrow2x=4\Rightarrow x=2'),f(r'3w=2w+3\Rightarrow w=3'),f(r'3y=6+2+y\Rightarrow2y=8\Rightarrow y=4'),f(r'3z=-1+z+3\Rightarrow2z=2\Rightarrow z=1'),f(r'3\begin{bmatrix}2&4\\1&3\end{bmatrix}=\begin{bmatrix}6&12\\3&9\end{bmatrix}')],f(r'x=2,\ y=4,\ z=1,\ w=3'),['પહેલા અને છેલ્લા ઘટકથી x અને w સીધા મળે છે. પછી તે મૂલ્યો બાકીનાં બે સમીકરણમાં મૂકીને y અને z શોધીએ. ચારેય ઘટકો મૂળ સમીકરણમાં ચકાસ્યા છે.'])
rot=lambda v:M([[s.cos(v),-s.sin(v),0],[s.sin(v),s.cos(v),0],[0,0,1]])
y=s.symbols('y',real=True);A=rot(x);B=rot(y);C=checked(A,B);assert s.trigsimp(C-rot(x+y))==s.zeros(3)
add(13,'જો '+f('F(x)='+tex(A))+' હોય તો '+f('F(x)F(y)=F(x+y)')+' દર્શાવો.',[f('F(y)='+tex(B)),f('F(x)F(y)='+tex(A)+tex(B)),f('='+tex(C)),f(r'\cos x\cos y-\sin x\sin y=\cos(x+y)'),f(r'\sin x\cos y+\cos x\sin y=\sin(x+y)'),f(r'-\cos x\sin y-\sin x\cos y=-\sin(x+y)'),f('F(x)F(y)='+tex(rot(x+y))+'=F(x+y)')],f('F(x)F(y)=F(x+y)'),['હાર–સ્તંભના ગુણાકાર પછી પ્રથમ ચાર ઘટકોને ત્રિકોણમિતિનાં યોગનાં સૂત્રોથી સાદા કરીએ. છેલ્લી હાર અને સ્તંભના વિકર્ણ સિવાયના ઘટકો 0 અને (3,3) ઘટક 1 રહે છે.'])
pairs=[(M([[5,-1],[6,7]]),M([[2,1],[3,4]])),(M([[1,2,3],[0,1,0],[1,1,0]]),M([[-1,1,0],[0,-1,1],[2,3,4]]))];st=[];ans=[]
for k,(A,B) in enumerate(pairs,1):
 st.append(f'({k})');t,C=product(A,B,'AB');u,D=product(B,A,'BA');st+=t+u+[f('(AB)_{11}='+tex(C[0,0])+r'\ne'+tex(D[0,0])+'=(BA)_{11}'),f(r'AB\ne BA')];ans.append((C,D))
add(14,'સાબિત કરો કે AB ≠ BA: '+'; '.join(f'({i}) '+f('A='+tex(A))+', '+f('B='+tex(B)) for i,(A,B) in enumerate(pairs,1)),st,'; '.join(f'({i}) '+f('AB='+tex(C))+', '+f('BA='+tex(D)) for i,(C,D) in enumerate(ans,1)),['બંને ક્રમના ગુણાકાર અલગથી કરવા જરૂરી છે. એક અનુરૂપ ઘટક પણ જુદો મળે તો આખા શ્રેણિકો અસમાન છે; અહીં દરેક ગુણાકારનો દરેક ઘટક દર્શાવ્યો છે.'])
A=M([[2,0,1],[2,1,3],[1,-1,0]]);st,C=product(A,A,'A^2');D=C-5*A+6*s.eye(3)
st += [f('5A='+tex(5*A)),f('6I='+tex(6*s.eye(3))),f('A^2-5A+6I='+tex(C)+'-'+tex(5*A)+'+'+tex(6*s.eye(3))),f('='+tex(D))]
add(15,'જો '+f('A='+tex(A))+' હોય તો '+f('A^2-5A+6I')+' શોધો.',st,mat(D),['A² એ Aનો પોતે સાથેનો શ્રેણિક ગુણાકાર છે; દરેક ઘટકનો વર્ગ નથી. Iમાં માત્ર વિકર્ણ પર 1 હોય છે, તેથી 6I ફક્ત વિકર્ણમાં 6 ઉમેરે છે.'])
A=M([[1,0,2],[0,2,1],[2,0,3]]);st,C=product(A,A,'A^2');u,D=product(C,A,'A^3');st+=u;assert D-6*C+7*A+2*s.eye(3)==s.zeros(3)
st += [f('6A^2='+tex(6*C)),f('7A='+tex(7*A)),f('2I='+tex(2*s.eye(3))),f('A^3-6A^2+7A+2I='+tex(D)+'-'+tex(6*C)+'+'+tex(7*A)+'+'+tex(2*s.eye(3)))]
for i in range(3):
 for j in range(3):st.append(f(tex(D[i,j])+'-('+tex(6*C[i,j])+')+'+tex(7*A[i,j])+'+'+tex(2*s.eye(3)[i,j])+'=0'))
st.append(f('A^3-6A^2+7A+2I='+tex(s.zeros(3))+'=O'))
add(16,'જો '+f('A='+tex(A))+' હોય તો '+f('A^3-6A^2+7A+2I=O')+' સાબિત કરો.',st,f('A^3-6A^2+7A+2I=O'),['પહેલા A² અને પછી A²Aથી A³ ગણીએ. ત્રણ અદિશ ગુણાકાર મેળવ્યા પછી દરેક અનુરૂપ ઘટકનો સરવાળો કરીએ. નવેય ઘટક શૂન્ય થતાં આપેલ ઓળખ સાબિત થાય છે.'])
A=M([[3,-2],[4,-2]]);st,C=product(A,A,'A^2');assert C==A-2*s.eye(2)
st +=[f(r'kA-2I=\begin{bmatrix}3k-2&-2k\\4k&-2k-2\end{bmatrix}'),f(r'-2k=-2\Rightarrow k=1'),f('1A-2I='+tex(A)+'-'+tex(2*s.eye(2))+'='+tex(C)+'=A^2')]
add(17,'જો '+f('A='+tex(A))+' અને '+f('I='+tex(s.eye(2)))+' હોય તો '+f('A^2=kA-2I')+' થાય એવો k શોધો.',st,f('k=1'),['(1,2) ઘટક સરખાવવાથી k મળે છે. મળેલા k માટે ચારેય ઘટક ફરી તપાસવાથી એક જ મૂલ્ય આખી સમાનતા સંતોષે છે.'])
t=s.symbols('t',real=True);ct=(1-t*t)/(1+t*t);sn=2*t/(1+t*t);P=M([[1,t],[-t,1]]);Q=M([[ct,-sn],[sn,ct]]);assert s.simplify(checked(P,Q))==M([[1,-t],[t,1]])
add(18,'જો '+f(r'A=\begin{bmatrix}0&-\tan\frac{\alpha}{2}\\\tan\frac{\alpha}{2}&0\end{bmatrix}')+' અને I એ 2 કક્ષાનો એકમ શ્રેણિક હોય તો '+f(r'I+A=(I-A)\begin{bmatrix}\cos\alpha&-\sin\alpha\\\sin\alpha&\cos\alpha\end{bmatrix}')+' સાબિત કરો.',[f(r't=\tan\frac{\alpha}{2}')+' (વ્યાખ્યાયિત હોય ત્યારે)',f(r'I-A=\begin{bmatrix}1&t\\-t&1\end{bmatrix}'),f(r'(I-A)\begin{bmatrix}\cos\alpha&-\sin\alpha\\\sin\alpha&\cos\alpha\end{bmatrix}=\begin{bmatrix}\cos\alpha+t\sin\alpha&-\sin\alpha+t\cos\alpha\\\sin\alpha-t\cos\alpha&t\sin\alpha+\cos\alpha\end{bmatrix}'),f(r'\sin\alpha=\frac{2t}{1+t^2},\quad\cos\alpha=\frac{1-t^2}{1+t^2}'),f(r'\cos\alpha+t\sin\alpha=\frac{1-t^2+2t^2}{1+t^2}=1'),f(r'-\sin\alpha+t\cos\alpha=\frac{-2t+t-t^3}{1+t^2}=-t'),f(r'\sin\alpha-t\cos\alpha=\frac{2t-t+t^3}{1+t^2}=t'),f(r'\text{RHS}=\begin{bmatrix}1&-t\\t&1\end{bmatrix}=I+A=\text{LHS}')],f(r'\text{LHS}=\text{RHS}'),['અર્ધકોણના tથી sinα અને cosα વ્યક્ત કરવાથી બધા ઘટકો પરિમેય સ્વરૂપે આવે છે. બે વિકર્ણ ઘટક સમાન છે અને બંને 1 થાય છે. ઓળખ જ્યાં મૂળ tan(α/2) વ્યાખ્યાયિત છે ત્યાં લાગુ પડે છે.'])
add(19,'એક ટ્રસ્ટ પાસે ₹30000 છે. પ્રથમ બૉન્ડનું વાર્ષિક વ્યાજ 5% અને બીજાનું 7% છે. વાર્ષિક વ્યાજ (a) ₹1800 (b) ₹2000 મળે તે માટે બંનેમાં કેટલી મૂડી રોકવી તે શ્રેણિક ગુણાકારથી શોધો.',[f('x+y=30000'),f(r'\begin{bmatrix}\frac{5}{100}&\frac{7}{100}\end{bmatrix}\begin{bmatrix}x\\y\end{bmatrix}=r'),f(r'0.05x+0.07y=r,\quad y=30000-x'),f(r'0.05x+0.07(30000-x)=r\Rightarrow2100-0.02x=r'),'(a) '+f(r'r=1800\Rightarrow0.02x=300\Rightarrow x=15000'),f('y=30000-15000=15000'),f('0.05(15000)+0.07(15000)=750+1050=1800'),'(b) '+f(r'r=2000\Rightarrow0.02x=100\Rightarrow x=5000'),f('y=30000-5000=25000'),f('0.05(5000)+0.07(25000)=250+1750=2000')],'(a) પ્રથમ ₹15000, બીજો ₹15000; (b) પ્રથમ ₹5000, બીજો ₹25000.',['x અને y અનુક્રમે 5% અને 7%વાળા બૉન્ડની મૂડી છે. મૂડીનો સરવાળો ₹30000 રાખીને વ્યાજના હાર શ્રેણિક અને મૂડીના સ્તંભનો ગુણાકાર કરીએ. બંને જવાબ માટે મૂડી અને વ્યાજ બંને શરતો ચકાસી છે.'])
add(20,'પુસ્તકભંડારમાં 10 ડઝન રસાયણવિજ્ઞાનનાં, 8 ડઝન ભૌતિકવિજ્ઞાનનાં અને 10 ડઝન અર્થશાસ્ત્રનાં પુસ્તકો છે. નંગદીઠ ભાવ અનુક્રમે ₹80, ₹60, ₹40 છે. બધાં વેચાય તો શ્રેણિક બીજગણિતથી કુલ આવક શોધો.',[f(r'Q=\begin{bmatrix}10\cdot12&8\cdot12&10\cdot12\end{bmatrix}=\begin{bmatrix}120&96&120\end{bmatrix}'),f(r'P=\begin{bmatrix}80\\60\\40\end{bmatrix}'),f(r'QP=\begin{bmatrix}120&96&120\end{bmatrix}\begin{bmatrix}80\\60\\40\end{bmatrix}'),f('=120(80)+96(60)+120(40)'),f('=9600+5760+4800=20160')],'કુલ આવક ₹20160.',['એક ડઝન એટલે 12 નંગ. ભાવ નંગદીઠ આપ્યો છે એટલે ડઝનને પહેલાં નંગમાં ફેરવવું જરૂરી છે. દરેક વિષયની સંખ્યા અને ભાવ સમાન ક્રમમાં રાખીને હાર–સ્તંભનો ગુણાકાર કરીએ.'])
add(21,'X,Y,Z,W,P અનુક્રમે '+f(r'2\times n,3\times k,2\times p,n\times3,p\times k')+' કક્ષાના છે. '+f('PY+WY')+' વ્યાખ્યાયિત થવા કયો પ્રતિબંધ જરૂરી? (A) '+f('k=3,p=n')+' (B) k સ્વૈર, p=2 (C) p સ્વૈર, k=3 (D) k=2,p=3.',[f(r'PY:(p\times k)(3\times k)\Rightarrow k=3'),f(r'\text{order}(PY)=p\times k=p\times3'),f(r'WY:(n\times3)(3\times k)\Rightarrow\text{order}(WY)=n\times k=n\times3'),f(r'PY+WY\Rightarrow p\times3=n\times3\Rightarrow p=n'),f(r'k=3,\quad p=n')],'વિકલ્પ A: '+f('k=3,p=n'),['PY માટે અંદરની કક્ષાઓ k અને 3 સમાન હોવી જોઈએ. WY માટે તે પહેલેથી 3 છે. બંને ગુણાકાર ઉમેરવા તેમની બહારની કક્ષાઓ પણ સમાન જોઈએ, તેથી p=n.'])
add(22,'X અને Zની કક્ષા અનુક્રમે '+f(r'2\times n')+' અને '+f(r'2\times p')+' છે. n=p હોય તો '+f('7X-5Z')+'ની કક્ષા પસંદ કરો: (A) '+f(r'p\times2')+' (B) '+f(r'2\times n')+' (C) '+f(r'n\times3')+' (D) '+f(r'p\times n')+'.',[f(r'n=p\Rightarrow\text{order}(X)=\text{order}(Z)=2\times n'),f(r'\text{order}(7X)=\text{order}(5Z)=2\times n'),f(r'\text{order}(7X-5Z)=2\times n')],'વિકલ્પ B: '+f(r'2\times n'),['અદિશ સંખ્યાથી ગુણવાથી શ્રેણિકની કક્ષા બદલાતી નથી. સમાન કક્ષાના બે શ્રેણિકનો તફાવત પણ તે જ કક્ષાનો હોય છે.'])
# Independent original-equation substitutions, separate from the solution derivations.
assert 2*M([[1,3],[0,3]])+M([[3,0],[1,2]])==M([[5,6],[1,8]])
assert 2*M([[3,9],[6,6]])+3*M([[1,-1],[0,2]])==3*M([[3,5],[4,6]])
assert 3*M([2,3])-4*M([-1,1])==M([10,5])
assert 3*M([[2,4],[1,3]])==M([[2,6],[-1,6]])+M([[4,6],[4,3]])
for a,b,r in [(15000,15000,1800),(5000,25000,2000)]:assert a+b==30000 and s.Rational(5,100)*a+s.Rational(7,100)*b==r
assert checked(M([[120,96,120]]),M([80,60,40]))[0]==20160
assert len(out)==22
(R/'content-additions/chapter3-exercise32.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print('Exercise 3.2: all 22 questions; source pass and independent calculation pass complete;',len(checks),'entrywise matrix product checks; all substitutions and symbolic identities pass.')
