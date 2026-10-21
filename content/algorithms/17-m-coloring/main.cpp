#include <iostream>
#include <vector>
using namespace std;

int n, m;
vector<vector<int>> graph;
vector<int> color;

bool isSafe(int v, int c) {
    for (int i = 0; i < n; i++)
        if (graph[v][i] && color[i] == c) return false;
    return true;
}

bool graphColoring(int v) {
    if (v == n) return true;
    for (int c = 1; c <= m; c++) {
        if (isSafe(v, c)) {
            color[v] = c;
            if (graphColoring(v + 1)) return true;
            color[v] = 0;
        }
    }
    return false;
}

int main() {
    int e, u, v;
    cout << "Vertices: "; cin >> n;
    cout << "Edges: ";    cin >> e;
    graph.assign(n, vector<int>(n, 0));
    color.assign(n, 0);
    cout << "Edges (u v):\n";
    while (e--) { cin >> u >> v; graph[u][v] = graph[v][u] = 1; }
    cout << "Colors m: "; cin >> m;

    if (graphColoring(0)) {
        cout << "Coloring: ";
        for (int i = 0; i < n; i++) cout << "V" << i << "=" << color[i] << " ";
        cout << endl;
    } else cout << "Not possible with " << m << " colors.\n";
    return 0;
}
