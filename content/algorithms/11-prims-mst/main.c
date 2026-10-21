#include <stdio.h>
#include <limits.h>
#define MAX 20

int g[MAX][MAX], n;

void primMST(void) {
    int key[MAX], parent[MAX], inMST[MAX];
    for (int i = 0; i < n; i++) { key[i] = INT_MAX; parent[i] = -1; inMST[i] = 0; }
    key[0] = 0;

    for (int count = 0; count < n - 1; count++) {
        int u = -1, min_ = INT_MAX;
        for (int v = 0; v < n; v++)
            if (!inMST[v] && key[v] < min_) { min_ = key[v]; u = v; }

        inMST[u] = 1;
        for (int v = 0; v < n; v++)
            if (g[u][v] && !inMST[v] && g[u][v] < key[v]) {
                parent[v] = u;
                key[v]    = g[u][v];
            }
    }

    int total = 0;
    printf("Edge\tWeight\n");
    for (int i = 1; i < n; i++) {
        printf("%d - %d\t%d\n", parent[i], i, g[i][parent[i]]);
        total += g[i][parent[i]];
    }
    printf("Total cost = %d\n", total);
}

int main(void) {
    printf("Vertices: "); scanf("%d", &n);
    printf("Adjacency matrix (0 if no edge):\n");
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) scanf("%d", &g[i][j]);
    primMST();
    return 0;
}
