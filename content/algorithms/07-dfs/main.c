#include <stdio.h>
#define MAX 100

int adj[MAX][MAX], visited[MAX], n;

/* ---- Recursive DFS ---- */
void dfsRec(int u) {
    visited[u] = 1;
    printf("%d ", u);
    for (int v = 0; v < n; v++)
        if (adj[u][v] && !visited[v])
            dfsRec(v);
}

/* ---- Iterative DFS ---- */
void dfsIter(int start) {
    int stack[MAX], top = -1;
    int seen[MAX] = {0};
    stack[++top] = start;
    while (top >= 0) {
        int u = stack[top--];
        if (seen[u]) continue;
        seen[u] = 1;
        printf("%d ", u);
        for (int v = n - 1; v >= 0; v--)         /* reverse to keep order */
            if (adj[u][v] && !seen[v])
                stack[++top] = v;
    }
}

int main(void) {
    int e, u, v, src;
    printf("Vertices: "); scanf("%d", &n);
    printf("Edges: ");    scanf("%d", &e);
    printf("Edges (u v):\n");
    for (int i = 0; i < e; i++) {
        scanf("%d %d", &u, &v);
        adj[u][v] = adj[v][u] = 1;
    }
    printf("Source: "); scanf("%d", &src);

    printf("Recursive DFS: ");
    dfsRec(src);
    printf("\nIterative DFS: ");
    dfsIter(src);
    printf("\n");
    return 0;
}
