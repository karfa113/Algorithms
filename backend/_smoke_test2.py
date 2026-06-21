"""Smoke test 2: exact same pattern as the real algorithms in data.js —
printf without fflush, then scanf. Was failing on Windows pre-preamble.
Also runs the C++ tab to confirm cout works the same way."""
import asyncio
import json
import websockets

C_CODE = r"""
#include <stdio.h>

int main(void) {
    int n;
    printf("Enter n: ");        /* no fflush, no \n */
    scanf("%d", &n);
    printf("doubled = %d\n", n * 2);
    return 0;
}
"""

CPP_CODE = r"""
#include <iostream>
using namespace std;
int main() {
    int n;
    cout << "Enter n: ";        // no flush, no endl
    cin >> n;
    cout << "tripled = " << n * 3 << endl;
    return 0;
}
"""

async def run_one(lang, code, input_value):
    print(f"\n=== {lang.upper()} ===")
    uri = "ws://127.0.0.1:8765/ws/run"
    async with websockets.connect(uri) as ws:
        await ws.send(json.dumps({"type": "run", "lang": lang, "code": code}))
        sent = False
        while True:
            raw = await asyncio.wait_for(ws.recv(), timeout=35)
            msg = json.loads(raw)
            t = msg.get("type")
            if t == "stdout":
                print(f"[OUT] {msg['data']!r}")
                # If prompt arrived (ends with ": ") and we haven't sent input yet, send it.
                if not sent and (msg["data"].endswith(": ") or msg["data"].endswith("? ")):
                    print(f"[SND] {input_value!r}")
                    await ws.send(json.dumps({"type": "input", "data": input_value}))
                    sent = True
            elif t == "stderr":
                print(f"[ERR] {msg['data']!r}")
            elif t == "status":
                print(f"[ST ] {msg['phase']}")
            elif t == "compile_error":
                print(f"[CE!] {msg['data']}")
                return False
            elif t == "error":
                print(f"[!!!] {msg['message']}")
                return False
            elif t == "exit":
                print(f"[XIT] code={msg['code']} time={msg['time_ms']}ms")
                return msg["code"] == 0 and sent

async def main():
    ok_c   = await run_one("c",   C_CODE,   "5")
    ok_cpp = await run_one("cpp", CPP_CODE, "7")
    print("\n----")
    print("C   :", "PASS" if ok_c   else "FAIL")
    print("C++ :", "PASS" if ok_cpp else "FAIL")

asyncio.run(main())
