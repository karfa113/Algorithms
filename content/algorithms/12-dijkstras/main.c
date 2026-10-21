#include <stdio.h>
#include <limits.h>
#define MAX 20

int g[MAX][MAX], n;

void dijkstra(int src) {
    int dist[MAX], visited[MAX];
    for (int i = 0; i < n; i++) { dist[i] = INT_MAX; visited[i] = 0; }
    dist[src] = 0;

    for (int count = 0; count < n - 1; count++) {
        int u = -1, min_ = INT_MAX;
        for (int v = 0; v < n; v++)
            if (!visited[v] && dist[v] < min_) { min_ = dist[v]; u = v; }
        if (u == -1) break;
        visited[u] = 1;
        for (int v = 0; v < n; v++)
            if (!visited[v] && g[u][v] && dist[u] != INT_MAX
                && dist[u] + g[u][v] < dist[v])
                    dist[v] = dist[u] + g[u][v];
    }

    printf("Vertex\tDistance\n");
    for (int i = 0; i < n; i++) printf("%d\t%d\n", i, dist[i]);
}

int main(void) {
    int src;
    printf("Vertices: "); scanf("%d", &n);
    printf("Adjacency matrix:\n");
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) scanf("%d", &g[i][j]);
    printf("Source: "); scanf("%d", &src);
    dijkstra(src);
    return 0;
}
