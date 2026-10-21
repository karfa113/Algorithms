#include <iostream>
using namespace std;
#define MAX 100

int adj[MAX][MAX], visited[MAX], n;

void dfsRec(int u) {
    visited[u] = 1;
    cout << u << " ";
    for (int v = 0; v < n; v++)
        if (adj[u][v] && !visited[v])
            dfsRec(v);
}

void dfsIter(int start) {
    int stack_[MAX], top = -1;
    int seen[MAX] = {0};
    stack_[++top] = start;
    while (top >= 0) {
        int u = stack_[top--];
        if (seen[u]) continue;
        seen[u] = 1;
        cout << u << " ";
        for (int v = n - 1; v >= 0; v--)
            if (adj[u][v] && !seen[v])
                stack_[++top] = v;
    }
}

int main() {
    int e, u, v, src;
    cout << "Vertices: "; cin >> n;
    cout << "Edges: ";    cin >> e;
    cout << "Edges (u v):\n";
    while (e--) { cin >> u >> v; adj[u][v] = adj[v][u] = 1; }
    cout << "Source: "; cin >> src;

    cout << "Recursive DFS: "; dfsRec(src);
    cout << "\nIterative DFS: "; dfsIter(src);
    cout << endl;
    return 0;
}
