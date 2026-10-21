#include <stdio.h>
#define MAX 100

int adj[MAX][MAX], visited[MAX];
int queue_[MAX], front = 0, rear = 0;

void enqueue(int x) { queue_[rear++] = x; }
int  dequeue(void)  { return queue_[front++]; }
int  isEmpty(void)  { return front == rear; }

void bfs(int start, int n) {
    enqueue(start);
    visited[start] = 1;
    while (!isEmpty()) {
        int u = dequeue();
        printf("%d ", u);
        for (int v = 0; v < n; v++)
            if (adj[u][v] && !visited[v]) {
                visited[v] = 1;
                enqueue(v);
            }
    }
}

int main(void) {
    int n, e, u, v, src;
    printf("Vertices: "); scanf("%d", &n);
    printf("Edges: ");    scanf("%d", &e);
    printf("Edges (u v):\n");
    for (int i = 0; i < e; i++) {
        scanf("%d %d", &u, &v);
        adj[u][v] = adj[v][u] = 1;
    }
    printf("Source: "); scanf("%d", &src);
    printf("BFS: ");
    bfs(src, n);
    printf("\n");
    return 0;
}
