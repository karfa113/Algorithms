#include <stdio.h>
#define INF 99999
#define V 100

int n;
int dist[V][V];

void floydWarshall() {
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];

    printf("Shortest distances:\n");
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (dist[i][j] == INF) printf("INF\t");
            else                   printf("%d\t", dist[i][j]);
        }
        printf("\n");
    }
}

int main(void) {
    printf("Vertices: "); scanf("%d", &n);
    printf("Adjacency matrix (use %d for no edge):\n", INF);
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) scanf("%d", &dist[i][j]);
    floydWarshall();
    return 0;
}
