#include <stdio.h>
#define V 20

int graph[V][V], color[V], n, m;

int isSafe(int v, int c) {
    for (int i = 0; i < n; i++)
        if (graph[v][i] && color[i] == c) return 0;
    return 1;
}

int graphColoring(int v) {
    if (v == n) return 1;
    for (int c = 1; c <= m; c++) {
        if (isSafe(v, c)) {
            color[v] = c;
            if (graphColoring(v + 1)) return 1;
            color[v] = 0;     /* backtrack */
        }
    }
    return 0;
}

int main(void) {
    int e, u, v;
    printf("Vertices: "); scanf("%d", &n);
    printf("Edges: ");    scanf("%d", &e);
    printf("Edges (u v):\n");
    for (int i = 0; i < e; i++) { scanf("%d %d", &u, &v); graph[u][v] = graph[v][u] = 1; }
    printf("Colors m: "); scanf("%d", &m);
    for (int i = 0; i < n; i++) color[i] = 0;

    if (graphColoring(0)) {
        printf("Coloring: ");
        for (int i = 0; i < n; i++) printf("V%d=%d ", i, color[i]);
        printf("\n");
    } else {
        printf("Not possible with %d colors.\n", m);
    }
    return 0;
}
