#include <iostream>
using namespace std;
#define MAX 100

int adj[MAX][MAX], visited[MAX];
int q[MAX], front_ = 0, rear_ = 0;

void enqueue(int x) { q[rear_++] = x; }
int  dequeue()      { return q[front_++]; }
bool empty_()       { return front_ == rear_; }

void bfs(int start, int n) {
    enqueue(start);
    visited[start] = 1;
    while (!empty_()) {
        int u = dequeue();
        cout << u << " ";
        for (int v = 0; v < n; v++)
            if (adj[u][v] && !visited[v]) {
                visited[v] = 1;
                enqueue(v);
            }
    }
}

int main() {
    int n, e, u, v, src;
    cout << "Vertices: "; cin >> n;
    cout << "Edges: ";    cin >> e;
    cout << "Edges (u v):\n";
    while (e--) { cin >> u >> v; adj[u][v] = adj[v][u] = 1; }
    cout << "Source: "; cin >> src;
    cout << "BFS: ";
    bfs(src, n);
    cout << endl;
    return 0;
}
