#include <iostream>
#include <vector>
#include <climits>
using namespace std;

void dijkstra(vector<vector<int>>& g, int src) {
    int n = g.size();
    vector<int> dist(n, INT_MAX);
    vector<bool> visited(n, false);
    dist[src] = 0;

    for (int count = 0; count < n - 1; count++) {
        int u = -1, min_ = INT_MAX;
        for (int v = 0; v < n; v++)
            if (!visited[v] && dist[v] < min_) { min_ = dist[v]; u = v; }
        if (u == -1) break;
        visited[u] = true;
        for (int v = 0; v < n; v++)
            if (!visited[v] && g[u][v] && dist[u] != INT_MAX
                && dist[u] + g[u][v] < dist[v])
                    dist[v] = dist[u] + g[u][v];
    }

    cout << "Vertex\tDistance\n";
    for (int i = 0; i < n; i++) cout << i << "\t" << dist[i] << "\n";
}

int main() {
    int n, src;
    cout << "Vertices: "; cin >> n;
    vector<vector<int>> g(n, vector<int>(n));
    cout << "Adjacency matrix:\n";
    for (auto& r : g) for (auto& x : r) cin >> x;
    cout << "Source: "; cin >> src;
    dijkstra(g, src);
    return 0;
}
