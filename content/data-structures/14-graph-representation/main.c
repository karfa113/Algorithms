#include <stdio.h>
#include <stdlib.h>

#define MAX 50

typedef struct Node {
    int v;
    struct Node *next;
} Node;

int n = 0, directed = 0, created = 0;
int matrix[MAX][MAX];          /* adjacency matrix */
Node *head[MAX], *tail[MAX];   /* adjacency list: one linked list per vertex */

const char *arrow(void) { return directed ? "->" : "-"; }

void clearGraph(void) {
    for (int i = 0; i < n; i++) {
        for (Node *c = head[i]; c != NULL; ) { Node *t = c; c = c->next; free(t); }
        head[i] = tail[i] = NULL;
        for (int j = 0; j < n; j++) matrix[i][j] = 0;
    }
}

void appendList(int u, int v) {          /* add v at the end of u's list */
    Node *nd = malloc(sizeof(Node));
    nd->v = v; nd->next = NULL;
    if (tail[u]) tail[u]->next = nd; else head[u] = nd;
    tail[u] = nd;
}

void addEdge(int u, int v) {
    if (u < 0 || u >= n || v < 0 || v >= n) { printf("Invalid vertex. Vertices are 0 to %d.\n", n - 1); return; }
    if (u == v) { printf("Self loops are not allowed.\n"); return; }
    if (matrix[u][v]) { printf("Edge %d %s %d already exists.\n", u, arrow(), v); return; }
    matrix[u][v] = 1;
    appendList(u, v);
    if (!directed) { matrix[v][u] = 1; appendList(v, u); }
    printf("Edge %d %s %d added.\n", u, arrow(), v);
}

void showMatrix(void) {
    printf("Adjacency matrix:\n    ");
    for (int j = 0; j < n; j++) printf("%3d", j);
    printf("\n");
    for (int i = 0; i < n; i++) {
        printf("%3d:", i);
        for (int j = 0; j < n; j++) printf("%3d", matrix[i][j]);
        printf("\n");
    }
}

void showList(void) {
    printf("Adjacency list:\n");
    for (int i = 0; i < n; i++) {
        printf("%d", i);
        for (Node *c = head[i]; c != NULL; c = c->next) printf(" -> %d", c->v);
        printf(" -> NULL\n");
    }
}

void showDegrees(void) {
    for (int i = 0; i < n; i++) {
        int out = 0, in = 0;
        for (int j = 0; j < n; j++) { out += matrix[i][j]; in += matrix[j][i]; }
        if (directed) printf("Vertex %d: in-degree = %d, out-degree = %d, total = %d\n", i, in, out, in + out);
        else printf("Vertex %d: degree = %d\n", i, out);
    }
}

int main(void) {
    int choice, u, v, e;
    do {
        printf("\n--- Graph Representation ---\n");
        printf("1. Create graph\n2. Add edge\n3. Display adjacency matrix\n4. Display adjacency list\n5. Degree of vertices\n6. Check if edge exists\n0. Exit\n");
        printf("Enter choice: ");
        if (scanf("%d", &choice) != 1) break;
        if (choice >= 2 && choice <= 6 && !created) { printf("Create a graph first.\n"); continue; }
        switch (choice) {
        case 1:
            printf("Enter number of vertices: "); scanf("%d", &v);
            if (v < 1 || v > MAX) { printf("Number of vertices must be between 1 and %d.\n", MAX); break; }
            printf("Enter graph type (1 = Directed, 2 = Undirected): "); scanf("%d", &u);
            if (u != 1 && u != 2) { printf("Invalid graph type.\n"); break; }
            clearGraph();
            n = v; directed = (u == 1); created = 1;
            for (int i = 0; i < n; i++) { head[i] = tail[i] = NULL; for (int j = 0; j < n; j++) matrix[i][j] = 0; }
            printf("Enter number of edges: "); scanf("%d", &e);
            for (int i = 0; i < e; i++) {
                printf("Enter edge %d (u v): ", i + 1); scanf("%d %d", &u, &v);
                addEdge(u, v);
            }
            printf("%s graph with %d vertices created.\n", directed ? "Directed" : "Undirected", n);
            break;
        case 2:
            printf("Enter edge (u v): "); scanf("%d %d", &u, &v);
            addEdge(u, v); break;
        case 3: showMatrix(); break;
        case 4: showList(); break;
        case 5: showDegrees(); break;
        case 6:
            printf("Enter edge (u v): "); scanf("%d %d", &u, &v);
            if (u < 0 || u >= n || v < 0 || v >= n) { printf("Invalid vertex. Vertices are 0 to %d.\n", n - 1); break; }
            printf("Edge %d %s %d %s.\n", u, arrow(), v, matrix[u][v] ? "exists" : "does not exist");
            break;
        case 0: printf("Goodbye!\n"); break;
        default: printf("Invalid choice.\n");
        }
    } while (choice != 0);
    clearGraph();
    return 0;
}
