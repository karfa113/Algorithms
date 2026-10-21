#include <stdio.h>

struct Edge { int u, v, w; };
int parent[100], rnk[100];

// Find with path compression
int find(int x) { return parent[x] == x ? x : (parent[x] = find(parent[x])); }

// Union by rank
void unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return;
    if (rnk[a] < rnk[b]) parent[a] = b;
    else if (rnk[a] > rnk[b]) parent[b] = a;
    else { parent[b] = a; rnk[a]++; }
}

// Stable insertion sort by weight (smallest first)
void sortEdges(struct Edge e[], int n) {
    for (int i = 1; i < n; i++) {
        struct Edge key = e[i];
        int j = i - 1;
        while (j >= 0 && e[j].w > key.w) { e[j+1] = e[j]; j--; }
        e[j+1] = key;
    }
}

int main() {
    int n, e;
    printf("Vertices: "); scanf("%d", &n);
    printf("Edges: ");    scanf("%d", &e);
    struct Edge edges[e > 0 ? e : 1];
    printf("u v w:\n");
    for (int i = 0; i < e; i++) scanf("%d %d %d", &edges[i].u, &edges[i].v, &edges[i].w);

    sortEdges(edges, e);
    for (int i = 0; i < n; i++) { parent[i] = i; rnk[i] = 0; }

    int total = 0, taken = 0;
    printf("MST edges:\n");
    for (int i = 0; i < e; i++) {
        if (taken == n - 1) break;
        if (find(edges[i].u) != find(edges[i].v)) {
            unite(edges[i].u, edges[i].v);
            printf("%d - %d : %d\n", edges[i].u, edges[i].v, edges[i].w);
            total += edges[i].w; taken++;
        }
    }
    printf("Total cost = %d\n", total);
    return 0;
}
