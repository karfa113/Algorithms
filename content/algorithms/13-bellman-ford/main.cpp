#include <iostream>
#include <vector>
#include <climits>
using namespace std;

struct Edge { int u, v, w; };

int main() {
    int n, e, src;
    cout << "Vertices: "; cin >> n;
    cout << "Edges: ";    cin >> e;
    vector<Edge> edges(e);
    cout << "u v w:\n";
    for (auto& x : edges) cin >> x.u >> x.v >> x.w;
    cout << "Source: "; cin >> src;

    vector<long long> dist(n, LLONG_MAX);
    dist[src] = 0;

    for (int i = 0; i < n - 1; i++)
        for (auto& x : edges)
            if (dist[x.u] != LLONG_MAX && dist[x.u] + x.w < dist[x.v])
                dist[x.v] = dist[x.u] + x.w;

    for (auto& x : edges)
        if (dist[x.u] != LLONG_MAX && dist[x.u] + x.w < dist[x.v]) {
            cout << "Negative-weight cycle detected." << endl;
            return 0;
        }

    cout << "Vertex\tDistance\n";
    for (int i = 0; i < n; i++) {
        if (dist[i] == LLONG_MAX) cout << i << "\tINF\n";
        else                       cout << i << "\t" << dist[i] << "\n";
    }
    return 0;
}
