#include <stdio.h>
#define V 20

int graph[V][V], path[V], n;

int isSafe(int v, int pos) {
    if (!graph[path[pos - 1]][v]) return 0;
    for (int i = 0; i < pos; i++) if (path[i] == v) return 0;
    return 1;
}

int hamCycle(int pos) {
    if (pos == n)
        return graph[path[pos - 1]][path[0]] == 1;
    for (int v = 1; v < n; v++) {
        if (isSafe(v, pos)) {
            path[pos] = v;
            if (hamCycle(pos + 1)) return 1;
            path[pos] = -1;    /* backtrack */
        }
    }
    return 0;
}

int main(void) {
    int e, u, v;
    printf("Vertices: "); scanf("%d", &n);
    printf("Edges: ");    scanf("%d", &e);
    printf("Edges (u v):\n");
    for (int i = 0; i < e; i++) {
        scanf("%d %d", &u, &v);
        graph[u][v] = graph[v][u] = 1;
    }

    for (int i = 0; i < n; i++) path[i] = -1;
    path[0] = 0;

    if (hamCycle(1)) {
        printf("Hamiltonian Cycle: ");
        for (int i = 0; i < n; i++) printf("%d -> ", path[i]);
        printf("%d\n", path[0]);
    } else {
        printf("No Hamiltonian Cycle exists.\n");
    }
    return 0;
}
