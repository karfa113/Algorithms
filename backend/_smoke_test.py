"""Smoke test: connect to /ws/run, run a C program with interactive stdin."""
import asyncio
import json
import websockets

C_CODE = r"""
#include <stdio.h>
int main(void) {
    int n;
    printf("Enter n: ");
    fflush(stdout);
    scanf("%d", &n);
    int sum = 0;
    for (int i = 1; i <= n; i++) {
        printf("Enter num %d: ", i);
        fflush(stdout);
        int x;
        scanf("%d", &x);
        sum += x;
    }
    printf("Sum = %d\n", sum);
    return 0;
}
"""

async def main():
    uri = "ws://127.0.0.1:8765/ws/run"
    async with websockets.connect(uri) as ws:
        await ws.send(json.dumps({"type": "run", "lang": "c", "code": C_CODE}))

        # Test plan: program prints "Enter n: ", we send "3"
        # Then for i=1..3, program prints "Enter num i: ", we send the number
        inputs_to_send = ["3", "10", "20", "30"]
        sent_idx = 0

        while True:
            raw = await asyncio.wait_for(ws.recv(), timeout=20)
            msg = json.loads(raw)
            t = msg.get("type")
            if t == "stdout":
                print(f"[STDOUT] {msg['data']!r}")
                # If the output ends with "? " or ": " or a digit-prompt, send next input
                data = msg["data"]
                if (data.endswith(": ") or data.endswith("? ")) and sent_idx < len(inputs_to_send):
                    nxt = inputs_to_send[sent_idx]
                    print(f"[SEND ]  {nxt!r}")
                    await ws.send(json.dumps({"type": "input", "data": nxt}))
                    sent_idx += 1
            elif t == "stderr":
                print(f"[STDERR] {msg['data']!r}")
            elif t == "status":
                print(f"[STATUS] {msg['phase']}")
            elif t == "compile_error":
                print(f"[COMPILE FAIL]\n{msg['data']}")
                return 1
            elif t == "error":
                print(f"[ERROR ] {msg['message']}")
                return 1
            elif t == "exit":
                print(f"[EXIT  ] code={msg['code']} time={msg['time_ms']}ms")
                return 0

if __name__ == "__main__":
    asyncio.run(main())
