#include <stdio.h>
#include <string.h>
#include <limits.h>
#define V 100

int rGraph[V][V], n;

int bfs(int s, int t, int parent[]) {
    int visited[V] = {0};
    int queue_[V], front = 0, rear = 0;
    queue_[rear++] = s;
    visited[s] = 1;
    parent[s] = -1;
    while (front < rear) {
        int u = queue_[front++];
        for (int v = 0; v < n; v++) {
            if (!visited[v] && rGraph[u][v] > 0) {
                parent[v] = u;
                visited[v] = 1;
                if (v == t) return 1;
                queue_[rear++] = v;
            }
        }
    }
    return 0;
}

int fordFulkerson(int s, int t) {
    int parent[V], maxFlow = 0;
    while (bfs(s, t, parent)) {
        int pathFlow = INT_MAX;
        for (int v = t; v != s; v = parent[v]) {
            int u = parent[v];
            if (rGraph[u][v] < pathFlow) pathFlow = rGraph[u][v];
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

int main(void) {
    int s, t;
    printf("Vertices: "); scanf("%d", &n);
    printf("Capacity matrix:\n");
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) scanf("%d", &rGraph[i][j]);
    printf("Source: "); scanf("%d", &s);
    printf("Sink: ");   scanf("%d", &t);
    printf("Maximum flow = %d\n", fordFulkerson(s, t));
    return 0;
}
