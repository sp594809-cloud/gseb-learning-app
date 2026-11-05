"""Independent numeric equality check using Python AST and fractions, not SymPy."""
import ast,json,re,math
from fractions import Fraction as Q
from pathlib import Path
R=Path(__file__).resolve().parents[1]
def value(t):
 t=t.replace(r'\left','').replace(r'\right','').strip()
 def arg(i):
  if t[i]=='{':
   depth=1;j=i+1
   while depth:
    if t[j]=='{':depth+=1
    if t[j]=='}':depth-=1
    j+=1
   return t[i+1:j-1],j
  return t[i],i+1
 while r'\frac' in t:
  i=t.rfind(r'\frac');a,j=arg(i+5);b,k=arg(j);t=t[:i]+'(('+a+')/('+b+'))'+t[k:]
 while r'\sqrt' in t:
  i=t.rfind(r'\sqrt');a,j=arg(i+5);t=t[:i]+'sqrt('+a+')'+t[j:]
 t=t.replace(r'\cdot','*').replace(r'\times','*').replace('^','**').replace('{','(').replace('}',')')
 if not re.fullmatch(r'[0-9.+*/()\s-]+|[0-9.+*/()\s-]*sqrt[0-9.+*/()\s-]*',t):raise ValueError(t)
 t=re.sub(r'(?<=[0-9)])(?=\()', '*',t)
 def walk(n):
  if isinstance(n,ast.Constant) and isinstance(n.value,(int,float)):return Q(str(n.value))
  if isinstance(n,ast.UnaryOp):
   v=walk(n.operand)
   if isinstance(n.op,ast.USub):return -v
   if isinstance(n.op,ast.UAdd):return v
  if isinstance(n,ast.BinOp):
   a,b=walk(n.left),walk(n.right)
   if isinstance(n.op,ast.Add):return a+b
   if isinstance(n.op,ast.Sub):return a-b
   if isinstance(n.op,ast.Mult):return a*b
   if isinstance(n.op,ast.Div):return a/b
   if isinstance(n.op,ast.Pow) and abs(b)<=20:return a**b
  raise ValueError(t)
 return walk(ast.parse(t,mode='eval').body)
checks=0
for q in json.loads((R/'chapter3-expanded-steps.json').read_text()):
 for step in q['steps']:
  for text in re.findall(r'\$([^$]+)\$',step):
   for line in re.split(r',\\quad|,\\;|\\Rightarrow',text):
    prev=None
    for part in line.split('='):
     try:current=value(part)
     except (ValueError,SyntaxError,IndexError,ZeroDivisionError):prev=None;continue
     if prev is not None:
      assert math.isclose(float(prev),float(current),rel_tol=1e-12,abs_tol=1e-12),(q['id'],text,prev,current)
      checks+=1
     prev=current
assert checks>500,checks
print('Independent Fraction/AST evaluation:',checks,'numeric equalities passed.')
