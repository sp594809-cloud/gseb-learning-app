"""Exercise 3.3 and 3.4: source pass pp54–55,57; exact algebra pass before upload."""
import runpy,json
from pathlib import Path
h=runpy.run_path(str(Path(__file__).with_name('exercise32.py')))
s=h['s'];M=s.Matrix;tex=h['tex'];f=h['f'];mat=h['mat'];product=h['product'];checked=h['checked'];R=h['R'];out=[]
def add(sec,n,page,prompt,steps,answer,explain):
 out.append(dict(id=f'tb3-{sec.replace(".","")}-{n}',chapter=3,section=sec,number=str(n),page=page,prompt=prompt,steps=steps,answer=answer,explanation=explain,kind='Textbook',graph=None,gu='મૂળ ગુજરાતી પાઠ્યપુસ્તકનો ચકાસેલો પ્રશ્ન.',verification={'source':f'book/{page+14}.webp','printedPage':page,'checkedOn':'2026-11-03','passes':['Visually matched every matrix and subpart to uploaded Gujarati textbook.','Independent entrywise multiplication, exact transpose/sum checks or general algebraic proof; exercise33.py.']}))
As=[M([5,s.Rational(1,2),-1]),M([[1,-1],[2,3]]),M([[-1,5,6],[s.sqrt(3),5,6],[2,3,-1]])];st=[]
for k,A in enumerate(As,1):
 assert all(A.T[j,i]==A[i,j] for i in range(A.rows) for j in range(A.cols))
 st += [f'({k}) '+f('A='+tex(A)),f('(A^T)_{ij}=a_{ji}'),f('A^T='+tex(A.T))]
add('3.3',1,54,'દરેક શ્રેણિકનો પરિવર્ત મેળવો: '+'; '.join(f'({i}) '+mat(A) for i,A in enumerate(As,1)),st,'; '.join(f'({i}) '+mat(A.T) for i,A in enumerate(As,1)),['મૂળ શ્રેણિકની પહેલી હાર પરિવર્તનો પહેલો સ્તંભ બને છે. આમ દરેક હારને તે જ ક્રમના સ્તંભમાં ફેરવો. m×n શ્રેણિકનો પરિવર્ત n×m થાય છે.'])
for n,A,B in [(2,M([[-1,2,3],[5,7,9],[-2,1,1]]),M([[-4,1,-5],[1,2,0],[1,3,1]])),(3,M([[3,-1,0],[4,2,1]]),M([[-1,2,1],[1,2,3]]))]:
 st=[f('A='+tex(A)),f('A^T='+tex(A.T))+', '+f('B^T='+tex(B.T))]
 for k,sign in enumerate([1,-1],1):
  op='+' if sign==1 else '-';C=A+sign*B;assert C.T==A.T+sign*B.T
  st += [f'({k}) '+f('A'+op+'B='+tex(A)+op+tex(B)+'='+tex(C)),f('(A'+op+'B)^T='+tex(C.T)),f('A^T'+op+'B^T='+tex(A.T)+op+tex(B.T)+'='+tex(A.T+sign*B.T)),f('(A'+op+'B)^T=A^T'+op+'B^T')]
 add('3.3',n,54,'જો '+f(('A^T=' if n==3 else 'A=')+tex(A.T if n==3 else A))+', '+f('B='+tex(B))+' હોય તો (i) '+f('(A+B)^T=A^T+B^T')+' (ii) '+f('(A-B)^T=A^T-B^T')+' ચકાસો.',st,f('(A+B)^T=A^T+B^T')+'; '+f('(A-B)^T=A^T-B^T'),['પહેલા સરવાળો કે તફાવત કરીને તેનો પરિવર્ત મેળવીએ. પછી બંનેના પરિવર્તનો સરવાળો કે તફાવત અલગથી ગણીએ. સમાન પરિણામથી ગુણધર્મ ચકાસાય છે.']+(['આ પ્રશ્નમાં A નહીં, તેનો પરિવર્ત આપ્યો છે. તેથી પહેલું પગલું આપેલા Aᵀનો ફરી પરિવર્ત લઈને મૂળ A મેળવવાનું છે.'] if n==3 else []))
At=M([[-2,3],[1,2]]);B=M([[-1,0],[1,2]]);A=At.T;C=(A+2*B).T;assert C==At+2*B.T
add('3.3',4,54,'જો '+f('A^T='+tex(At))+', '+f('B='+tex(B))+' હોય તો '+f('(A+2B)^T')+' શોધો.',[f('(A+2B)^T=A^T+2B^T'),f('B^T='+tex(B.T)),f('2B^T='+tex(2*B.T)),f('(A+2B)^T='+tex(At)+'+'+tex(2*B.T)+'='+tex(C))],mat(C),['પરિવર્ત સરવાળા અને અદિશ ગુણાકાર પર વહેંચી શકાય છે. અહીં Aᵀ આપેલો હોવાથી ફક્ત Bᵀ શોધીને બમણો કરવાનો છે. મૂળ Aથી સીધી ગણતરી કરીને પણ જવાબ ચકાસ્યો છે.'])
pairs=[(M([1,-4,3]),M([[-1,2,1]])),(M([0,1,2]),M([[1,5,7]]))];st=[];ans=[]
for k,(A,B) in enumerate(pairs,1):
 st += [f'({k})'];t,C=product(A,B,'AB');st+=t+[f('(AB)^T='+tex(C.T)),f('B^T='+tex(B.T))+', '+f('A^T='+tex(A.T))];u,D=product(B.T,A.T,'B^TA^T');st+=u+[f('(AB)^T=B^TA^T')];assert C.T==D;ans.append(D)
add('3.3',5,54,'દરેક માટે '+f('(AB)^T=B^TA^T')+' ચકાસો: '+'; '.join(f'({i}) '+f('A='+tex(A))+', '+f('B='+tex(B)) for i,(A,B) in enumerate(pairs,1)),st,'; '.join(f'({i}) '+f('(AB)^T=B^TA^T='+tex(C)) for i,C in enumerate(ans,1)),['ગુણાકારના પરિવર્તમાં ક્રમ ઊલટાય છે. પહેલા AB કરીને તેનો પરિવર્ત લઈએ, અને અલગથી BᵀAᵀ ગણીએ. બંને ભાગના નવેય ઘટક દરેક બાજુ દર્શાવ્યા છે.'])
a=s.symbols('alpha',real=True);c=s.cos(a);t=s.sin(a);As=[M([[c,t],[-t,c]]),M([[t,c],[-c,t]])];st=[]
for k,A in enumerate(As,1):
 st += [f'({k}) '+f('A^T='+tex(A.T))];u,C=product(A.T,A,'A^TA');st+=u+[f(r'\sin^2\alpha+\cos^2\alpha=1'),f('A^TA='+tex(s.eye(2))+'=I')];assert s.trigsimp(C)==s.eye(2)
add('3.3',6,55,'દરેક માટે '+f('A^TA=I')+' ચકાસો: '+'; '.join(f'({i}) '+f('A='+tex(A)) for i,A in enumerate(As,1)),st,f('A^TA=I')+' (બંને ભાગ)', ['હાર–સ્તંભથી AᵀA ગણીએ. વિકર્ણ પર sin²α+cos²α અને બાકીના સ્થાને રદ થતા ગુણાકાર મળે છે. તેથી બંને શ્રેણિક માટે એકમ શ્રેણિક મળે છે.'])
A=M([[1,-1,5],[-1,2,1],[5,1,3]]);B=M([[0,1,-1],[-1,0,1],[1,-1,0]]);assert A.T==A and B.T==-B
add('3.3',7,55,'સાબિત કરો: (i) '+f('A='+tex(A))+' સંમિત છે; (ii) '+f('B='+tex(B))+' વિસંમિત છે.', ['(i) '+f('A^T='+tex(A.T)),f(r'A^T=A\Rightarrow A')+' સંમિત.','(ii) '+f('B^T='+tex(B.T)),f('-B='+tex(-B)),f(r'B^T=-B\Rightarrow B')+' વિસંમિત.'],'(i) સંમિત; (ii) વિસંમિત.',['સંમિત માટે પરિવર્ત મૂળ શ્રેણિક જેટલો અને વિસંમિત માટે તેના ઋણ જેટલો હોવો જોઈએ. વિસંમિતના વિકર્ણના ઘટકો શૂન્ય હોવાની શરત પણ અહીં સંતોષાય છે.'])
A=M([[1,5],[6,7]]);S=A+A.T;K=A-A.T;assert S.T==S and K.T==-K
add('3.3',8,55,f('A='+tex(A))+' માટે (i) '+f('A+A^T')+' સંમિત (ii) '+f('A-A^T')+' વિસંમિત છે તે ચકાસો.',[f('A^T='+tex(A.T)),'(i) '+f('S=A+A^T='+tex(A)+'+'+tex(A.T)+'='+tex(S)),f('S^T='+tex(S.T)+'=S')+' ⇒ સંમિત.','(ii) '+f('K=A-A^T='+tex(A)+'-'+tex(A.T)+'='+tex(K)),f('K^T='+tex(K.T)+'=-K')+' ⇒ વિસંમિત.'],f('A+A^T='+tex(S))+' સંમિત; '+f('A-A^T='+tex(K))+' વિસંમિત.',['સરવાળા અને તફાવતનાં પરિણામને નવા શ્રેણિક S,K તરીકે લઈએ. તેમના પરિવર્તથી વ્યાખ્યા ચકાસવી જરૂરી છે; માત્ર આકાર પરથી પ્રકાર નક્કી ન કરવો.'])
a,b,c=s.symbols('a b c');A=M([[0,a,b],[-a,0,c],[-b,-c,0]]);assert A.T==-A
add('3.3',9,55,f('A='+tex(A))+' માટે '+f(r'\frac12(A+A^T)')+' અને '+f(r'\frac12(A-A^T)')+' શોધો.',[f('A^T='+tex(A.T)+'=-A'),f(r'\frac12(A+A^T)=\frac12(A-A)=\frac12O=O'),f(r'\frac12(A-A^T)=\frac12(A+A)=\frac12(2A)=A'),f(r'\frac12(A+A^T)='+tex(s.zeros(3))),f(r'\frac12(A-A^T)='+tex(A))],f(r'\frac12(A+A^T)=O')+'; '+f(r'\frac12(A-A^T)=A'),['આપેલ A પહેલેથી વિસંમિત છે. તેથી સંમિત ભાગ શૂન્ય અને વિસંમિત ભાગ મૂળ A જ મળે છે.'])
As=[M([[3,5],[1,-1]]),M([[6,-2,2],[-2,3,-1],[2,-1,3]]),M([[3,3,-1],[-2,-2,1],[-4,-5,2]]),M([[1,5],[-1,2]])];st=[f(r'S=\frac12(A+A^T),\quad K=\frac12(A-A^T),\quad A=S+K')];ans=[]
for k,A in enumerate(As,1):
 S=(A+A.T)/2;K=(A-A.T)/2;assert S.T==S and K.T==-K and S+K==A
 st += [f'({k}) '+f('A^T='+tex(A.T)),f(r'S=\frac12'+tex(A+A.T)+'='+tex(S)),f(r'K=\frac12'+tex(A-A.T)+'='+tex(K)),f('S^T='+tex(S.T)+'=S'),f('K^T='+tex(K.T)+'=-K'),f('S+K='+tex(S)+'+'+tex(K)+'='+tex(A)+'=A')];ans.append((S,K))
add('3.3',10,55,'દરેકને સંમિત અને વિસંમિત શ્રેણિકના સરવાળા તરીકે દર્શાવો: '+'; '.join(f'({i}) '+mat(A) for i,A in enumerate(As,1)),st,'; '.join(f'({i}) '+f('A='+tex(S)+'+'+tex(K)) for i,(S,K) in enumerate(ans,1)),['દરેક ચોરસ શ્રેણિક માટે અડધો સરવાળો સંમિત અને અડધો તફાવત વિસંમિત હોય છે. ચારેય ભાગમાં આ બંને પ્રકાર અને તેમનો સરવાળો મૂળ A થાય છે તે અલગથી ચકાસ્યું છે.','ભાગ (ii)માં A પોતે સંમિત છે, એટલે તેનો વિસંમિત ભાગ શૂન્ય શ્રેણિક મળે છે; શૂન્ય શ્રેણિક વિસંમિત પણ છે.'])
add('3.3',11,55,'A,B સમાન કક્ષાના સંમિત શ્રેણિક હોય તો AB−BA: (A) વિસંમિત (B) સંમિત (C) શૂન્ય (D) એકમ.',[f(r'A^T=A,\quad B^T=B'),f('C=AB-BA'),f('C^T=(AB-BA)^T=B^TA^T-A^TB^T'),f('=BA-AB=-(AB-BA)=-C'),f('C^T=-C')+' ⇒ વિસંમિત.'],'વિકલ્પ A: વિસંમિત.',['પરિવર્ત લેતાં ગુણાકારનો ક્રમ ઊલટાય છે. સંમિતતાના Aᵀ=A અને Bᵀ=B મૂકવાથી પરિણામ પોતાના ઋણ જેટલું મળે છે. AB=BA હોવાની શરત આપેલી નથી તેથી સામાન્ય રીતે શૂન્ય કહી શકાતું નથી.'])
A=M([[s.cos(a),-s.sin(a)],[s.sin(a),s.cos(a)]]);assert A+A.T==2*s.cos(a)*s.eye(2)
add('3.3',12,55,f(r'A=\begin{bmatrix}\cos\alpha&-\sin\alpha\\\sin\alpha&\cos\alpha\end{bmatrix}')+' માટે '+f('A+A^T=I')+' થાય તેવો વિકલ્પ પસંદ કરો: (A) '+f(r'\pi/6')+' (B) '+f(r'\pi/3')+' (C) '+f(r'\pi')+' (D) '+f(r'3\pi/2')+'.',[f(r'A^T=\begin{bmatrix}\cos\alpha&\sin\alpha\\-\sin\alpha&\cos\alpha\end{bmatrix}'),f(r'A+A^T=\begin{bmatrix}2\cos\alpha&0\\0&2\cos\alpha\end{bmatrix}=I'),f(r'2\cos\alpha=1\Rightarrow\cos\alpha=\frac12'),f(r'\cos\frac\pi3=\frac12\Rightarrow\alpha=\frac\pi3')],'વિકલ્પ B: '+f(r'\alpha=\pi/3'),['પ્રશ્ન આપેલા વિકલ્પોમાંથી એક મૂલ્ય પસંદ કરવાનું કહે છે. સામાન્ય ઉકેલ α=2kπ±π/3 છે, પરંતુ આપેલા વિકલ્પોમાં માત્ર π/3 છે.'])
add('3.4',1,57,'A અને B એકબીજાના વ્યસ્ત શ્રેણિક ક્યારે છે? (A) AB=BA (B) AB=BA=O (C) AB=O, BA=I (D) AB=BA=I.',[f(r'B=A^{-1}\Rightarrow AB=AA^{-1}=I'),f('BA=A^{-1}A=I'),f(r'AB=BA=I\Leftrightarrow B=A^{-1}')],'વિકલ્પ D: '+f('AB=BA=I'),['વ્યસ્તની વ્યાખ્યા પ્રમાણે બંને ક્રમનો ગુણાકાર એકમ શ્રેણિક છે. માત્ર AB=BA હોવું પૂરતું નથી; A=B=Oમાં બંને ગુણાકાર સમાન હોવા છતાં વ્યસ્ત મળતો નથી.'])
assert len(out)==13
(R/'content-additions/chapter3-exercise33-34.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print('Exercise 3.3 Q1–12 and 3.4 Q1: source pass and exact algebra pass complete.')
