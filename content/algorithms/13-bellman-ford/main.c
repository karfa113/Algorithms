#include <stdio.h>
#include <limits.h>
#define MAX 100

struct Edge { int u, v, w; };

int main(void) {
    int n, e, src;
    struct Edge edges[MAX];
    printf("Vertices: "); scanf("%d", &n);
    printf("Edges: ");    scanf("%d", &e);
    printf("u v w:\n");
    for (int i = 0; i < e; i++) scanf("%d %d %d", &edges[i].u, &edges[i].v, &edges[i].w);
    printf("Source: "); scanf("%d", &src);

    long long dist[MAX];
    for (int i = 0; i < n; i++) dist[i] = LLONG_MAX;
    dist[src] = 0;

    for (int i = 0; i < n - 1; i++)
        for (int j = 0; j < e; j++)
            if (dist[edges[j].u] != LLONG_MAX && dist[edges[j].u] + edges[j].w < dist[edges[j].v])
                dist[edges[j].v] = dist[edges[j].u] + edges[j].w;

    for (int j = 0; j < e; j++)
        if (dist[edges[j].u] != LLONG_MAX && dist[edges[j].u] + edges[j].w < dist[edges[j].v]) {
            printf("Negative-weight cycle detected.\n");
            return 0;
        }

    printf("Vertex\tDistance\n");
    for (int i = 0; i < n; i++) {
        if (dist[i] == LLONG_MAX) printf("%d\tINF\n", i);
        else                      printf("%d\t%lld\n", i, dist[i]);
    }
    return 0;
}
