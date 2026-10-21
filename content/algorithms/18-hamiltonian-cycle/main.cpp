#include <iostream>
#include <vector>
using namespace std;

int n;
vector<vector<int>> graph;
vector<int> path_;

bool isSafe(int v, int pos) {
    if (!graph[path_[pos - 1]][v]) return false;
    for (int i = 0; i < pos; i++) if (path_[i] == v) return false;
    return true;
}

bool hamCycle(int pos) {
    if (pos == n)
        return graph[path_[pos - 1]][path_[0]] == 1;
    for (int v = 1; v < n; v++) {
        if (isSafe(v, pos)) {
            path_[pos] = v;
            if (hamCycle(pos + 1)) return true;
            path_[pos] = -1;
        }
    }
    return false;
}

int main() {
    int e, u, v;
    cout << "Vertices: "; cin >> n;
    cout << "Edges: ";    cin >> e;
    graph.assign(n, vector<int>(n, 0));
    path_.assign(n, -1);
    cout << "Edges (u v):\n";
    while (e--) { cin >> u >> v; graph[u][v] = graph[v][u] = 1; }
    path_[0] = 0;

    if (hamCycle(1)) {
        cout << "Hamiltonian Cycle: ";
        for (int i = 0; i < n; i++) cout << path_[i] << " -> ";
        cout << path_[0] << endl;
    } else {
        cout << "No Hamiltonian Cycle exists." << endl;
    }
    return 0;
}
