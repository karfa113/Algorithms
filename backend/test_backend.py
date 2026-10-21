"""
End-to-end backend test. Start the server first, then:

    python test_backend.py                 # ws://127.0.0.1:8765/ws/run
    python test_backend.py ws://host:port/ws/run

Needs:  pip install websockets
"""
import asyncio, json, sys
import websockets

URI = sys.argv[1] if len(sys.argv) > 1 else "ws://127.0.0.1:8765/ws/run"

C = r'''#include <stdio.h>
int main(void){int n,s=0,x;printf("Enter n: ");scanf("%d",&n);
for(int i=0;i<n;i++){printf("num %d: ",i+1);scanf("%d",&x);s+=x;}
printf("Sum = %d\n",s);return 0;}'''
CPP = r'''#include <iostream>
using namespace std;
int main(){int n,s=0,x;cout<<"Enter n: ";cin>>n;
for(int i=0;i<n;i++){cout<<"num "<<i+1<<": ";cin>>x;s+=x;}
cout<<"Sum = "<<s<<endl;}'''
JAVA = r'''import java.util.Scanner;
public class Main { public static void main(String[] a){ Scanner sc=new Scanner(System.in);
int n,s=0; System.out.print("Enter n: "); n=sc.nextInt();
for(int i=0;i<n;i++){ System.out.print("num "+(i+1)+": "); s+=sc.nextInt(); }
System.out.println("Sum = "+s); } }'''
# public class with a different name + a helper class declared first
JAVA_OTHER = r'''class Helper { static int twice(int x){ return 2*x; } }
public class Calculator { public static void main(String[] a){
 System.out.print("x? "); int x = new java.util.Scanner(System.in).nextInt();
 System.out.println("twice = " + Helper.twice(x)); } }'''
JAVA_BAD = 'public class Main { public static void main(String[] a){ int x = "s"; } }'
JAVA_LOOP = 'public class Main { public static void main(String[] a){ while(true){} } }'
JAVA_EXC = 'public class Main { public static void main(String[] a){ int[] x=new int[1]; x[3]=1; } }'

async def run(lang, code, inputs=(), expect_phase_running=True):
    out, errs, kinds, exit_code = "", "", [], None
    async with websockets.connect(URI) as ws:
        await ws.send(json.dumps({"type": "run", "lang": lang, "code": code}))
        pending = list(inputs)
        while True:
            m = json.loads(await asyncio.wait_for(ws.recv(), timeout=60))
            kinds.append(m["type"])
            t = m["type"]
            if t == "stdout":
                out += m["data"]
                if pending and (out.rstrip().endswith(":") or out.rstrip().endswith("?")):
                    await ws.send(json.dumps({"type": "input", "data": pending.pop(0)}))
            elif t == "stderr": errs += m["data"]
            elif t in ("compile_error", "error"): errs += m.get("data") or m.get("message", "")
            elif t == "exit": exit_code = m["code"]; break
            if t in ("compile_error",): break
    return out, errs, kinds, exit_code

fails = 0
def check(name, cond, info=""):
    global fails
    print(("PASS " if cond else "FAIL ") + name + ("" if cond else f"  -> {info}"))
    if not cond: fails += 1

async def main():
    for lang, code in (("c", C), ("cpp", CPP), ("java", JAVA)):
        out, err, kinds, rc = await run(lang, code, ["3", "10", "20", "30"])
        check(f"{lang}: interactive prompts + sum", "Enter n:" in out and "Sum = 60" in out and rc == 0, (out, err))
    out, err, _, rc = await run("java", JAVA_OTHER, ["21"])
    check("java: public class not named Main (+ helper class)", "twice = 42" in out and rc == 0, (out, err))
    out, err, kinds, rc = await run("java", JAVA_BAD)
    check("java: compile error is reported", "compile_error" in kinds and "incompatible types" in err, (kinds, err))
    out, err, kinds, rc = await run("java", JAVA_EXC)
    check("java: uncaught exception -> stderr + nonzero exit", rc not in (0, None) and "ArrayIndexOutOfBounds" in err, (rc, err))
    out, err, kinds, rc = await run("c", "int main( {")
    check("c: compile error is reported", "compile_error" in kinds, kinds)
    out, err, kinds, rc = await run("python", "print(1)")
    check("unsupported language rejected", "error" in kinds and "Unsupported" in err, (kinds, err))
    print("\n%s" % ("ALL PASSED" if not fails else f"{fails} FAILED"))
    sys.exit(1 if fails else 0)

asyncio.run(main())
