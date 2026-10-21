#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

struct Edge { int u, v, w; };
int parent[100], rnk[100];

int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
void unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return;
    if (rnk[a] < rnk[b]) parent[a] = b;
    else if (rnk[a] > rnk[b]) parent[b] = a;
    else { parent[b] = a; rnk[a]++; }
}

int main() {
    int n, e;
    cout << "Vertices: "; cin >> n;
    cout << "Edges: ";    cin >> e;
    vector<Edge> edges(e);
    cout << "u v w:\n";
    for (auto& x : edges) cin >> x.u >> x.v >> x.w;

    sort(edges.begin(), edges.end(),
         [](Edge a, Edge b){ return a.w < b.w; });
    for (int i = 0; i < n; i++) { parent[i] = i; rnk[i] = 0; }

    int total = 0, taken = 0;
    cout << "MST edges:\n";
    for (auto& x : edges) {
        if (taken == n - 1) break;
        if (find(x.u) != find(x.v)) {
            unite(x.u, x.v);
            cout << x.u << " - " << x.v << " : " << x.w << "\n";
            total += x.w; taken++;
        }
    }
    cout << "Total cost = " << total << endl;
    return 0;
}
