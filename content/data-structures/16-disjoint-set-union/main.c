#include <stdio.h>

#define MAX 50

int parent[MAX], rnk[MAX];
int n = 0;

// Find the representative of x; compress the path on the way back.
int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]);
    return parent[x];
}

// Union by rank: attach the shorter tree under the taller one.
int unite(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return 0;
    if (rnk[ra] < rnk[rb]) { int t = ra; ra = rb; rb = t; }
    parent[rb] = ra;
    if (rnk[ra] == rnk[rb]) rnk[ra]++;
    return 1;
}

int main(void) {
    int choice, a, b;
    do {
        printf("\n--- Disjoint Set Union ---\n");
        printf("1. Make sets\n2. Union\n3. Find\n4. Connected?\n5. Display\n0. Exit\n");
        printf("Enter choice: ");
        if (scanf("%d", &choice) != 1) break;
        if (choice >= 2 && choice <= 5 && n == 0) { printf("Make sets first.\n"); continue; }
        switch (choice) {
            case 1:
                printf("Enter number of elements: "); scanf("%d", &a);
                if (a < 1 || a > MAX) { printf("Number of elements must be between 1 and %d.\n", MAX); break; }
                n = a;
                for (int i = 0; i < n; i++) { parent[i] = i; rnk[i] = 0; }
                printf("Created %d singleton sets (0 to %d).\n", n, n - 1);
                break;
            case 2:
                printf("Enter two elements: "); scanf("%d %d", &a, &b);
                if (a < 0 || a >= n || b < 0 || b >= n) { printf("Invalid element. Elements are 0 to %d.\n", n - 1); break; }
                if (unite(a, b)) printf("Merged the sets of %d and %d.\n", a, b);
                else printf("%d and %d are already in the same set.\n", a, b);
                break;
            case 3:
                printf("Enter element: "); scanf("%d", &a);
                if (a < 0 || a >= n) { printf("Invalid element. Elements are 0 to %d.\n", n - 1); break; }
                printf("Representative of %d is %d\n", a, find(a));
                break;
            case 4:
                printf("Enter two elements: "); scanf("%d %d", &a, &b);
                if (a < 0 || a >= n || b < 0 || b >= n) { printf("Invalid element. Elements are 0 to %d.\n", n - 1); break; }
                printf("%d and %d are %s.\n", a, b, find(a) == find(b) ? "connected" : "not connected");
                break;
            case 5:
                printf("Element: ");
                for (int i = 0; i < n; i++) printf("%3d", i);
                printf("\nParent : ");
                for (int i = 0; i < n; i++) printf("%3d", parent[i]);
                printf("\nRank   : ");
                for (int i = 0; i < n; i++) printf("%3d", rnk[i]);
                printf("\n");
                break;
            case 0: printf("Goodbye!\n"); break;
            default: printf("Invalid choice.\n");
        }
    } while (choice != 0);
    return 0;
}
