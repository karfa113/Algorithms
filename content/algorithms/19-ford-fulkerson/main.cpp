#include <iostream>
#include <vector>
#include <queue>
#include <climits>
#include <cstring>
using namespace std;

int n;
vector<vector<int>> rGraph;

bool bfs(int s, int t, vector<int>& parent) {
    vector<bool> visited(n, false);
    queue<int> q;
    q.push(s);
    visited[s] = true;
    parent[s] = -1;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v = 0; v < n; v++) {
            if (!visited[v] && rGraph[u][v] > 0) {
                parent[v] = u;
                visited[v] = true;
                if (v == t) return true;
                q.push(v);
            }
        }
    }
    return false;
}

int fordFulkerson(int s, int t) {
    vector<int> parent(n);
    int maxFlow = 0;
    while (bfs(s, t, parent)) {
        int pathFlow = INT_MAX;
        for (int v = t; v != s; v = parent[v]) {
            int u = parent[v];
            pathFlow = min(pathFlow, rGraph[u][v]);
        }
        for (int v = t; v != s; v = parent[v]) {
            int u = parent[v];
            rGraph[u][v] -= pathFlow;
            rGraph[v][u] += pathFlow;
        }
        maxFlow += pathFlow;
    }
    return maxFlow;
}

int main() {
    int s, t;
    cout << "Vertices: "; cin >> n;
    rGraph.assign(n, vector<int>(n, 0));
    cout << "Capacity matrix:\n";
    for (auto& r : rGraph) for (auto& x : r) cin >> x;
    cout << "Source: "; cin >> s;
    cout << "Sink: ";   cin >> t;
    cout << "Maximum flow = " << fordFulkerson(s, t) << endl;
    return 0;
}
