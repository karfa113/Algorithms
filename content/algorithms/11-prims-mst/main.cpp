#include <iostream>
#include <climits>
#include <vector>
using namespace std;

void primMST(vector<vector<int>>& g, int n) {
    vector<int> key(n, INT_MAX), parent(n, -1);
    vector<bool> inMST(n, false);
    key[0] = 0;

    for (int count = 0; count < n - 1; count++) {
        int u = -1, min_ = INT_MAX;
        for (int v = 0; v < n; v++)
            if (!inMST[v] && key[v] < min_) { min_ = key[v]; u = v; }

        inMST[u] = true;
        for (int v = 0; v < n; v++)
            if (g[u][v] && !inMST[v] && g[u][v] < key[v]) {
                parent[v] = u;
                key[v]    = g[u][v];
            }
    }

    int total = 0;
    cout << "Edge\tWeight\n";
    for (int i = 1; i < n; i++) {
        cout << parent[i] << " - " << i << "\t" << g[i][parent[i]] << "\n";
        total += g[i][parent[i]];
    }
    cout << "Total cost = " << total << endl;
}

int main() {
    int n; cout << "Vertices: "; cin >> n;
    vector<vector<int>> g(n, vector<int>(n));
    cout << "Adjacency matrix (0 if no edge):\n";
    for (auto& r : g) for (auto& x : r) cin >> x;
    primMST(g, n);
    return 0;
}
