#include <stdio.h>
#include <stdlib.h>

#define SIZE 10
enum { EMPTY, OCCUPIED, DELETED };   /* slot states for linear probing */

typedef struct Node { int key; struct Node *next; } Node;

int mode;                       /* 1 = chaining, 2 = linear probing */
Node *bucket[SIZE];             /* used by chaining */
int slot[SIZE], state[SIZE];    /* used by linear probing */

int hash(int k) { return ((k % SIZE) + SIZE) % SIZE; }   /* safe for negatives */

/* ---- chaining ---- */
void insertChain(int k) {
    int h = hash(k);
    Node *p = bucket[h], *last = NULL;
    for (; p; last = p, p = p->next)
        if (p->key == k) { printf("%d already exists. Duplicates are not allowed.\n", k); return; }
    Node *n = malloc(sizeof(Node));
    n->key = k; n->next = NULL;
    if (last) last->next = n; else bucket[h] = n;     /* append at tail */
    printf("Inserted %d in bucket %d.\n", k, h);
}
void searchChain(int k) {
    int h = hash(k);
    for (Node *p = bucket[h]; p; p = p->next)
        if (p->key == k) { printf("Found %d in bucket %d.\n", k, h); return; }
    printf("%d not found.\n", k);
}
void deleteChain(int k) {
    int h = hash(k);
    Node *p = bucket[h], *prev = NULL;
    for (; p; prev = p, p = p->next)
        if (p->key == k) {
            if (prev) prev->next = p->next; else bucket[h] = p->next;
            free(p);
            printf("Deleted %d from bucket %d.\n", k, h);
            return;
        }
    printf("%d not found.\n", k);
}
void displayChain() {
    for (int i = 0; i < SIZE; i++) {
        printf("[%d] ", i);
        if (!bucket[i]) printf("-");
        for (Node *p = bucket[i]; p; p = p->next) printf("%d%s", p->key, p->next ? " -> " : "");
        printf("\n");
    }
}

/* ---- linear probing ---- */
int findProbe(int k) {          /* index of k, or -1 */
    int h = hash(k);
    for (int i = 0; i < SIZE; i++) {
        int p = (h + i) % SIZE;
        if (state[p] == EMPTY) return -1;             /* chain of probes ends here */
        if (state[p] == OCCUPIED && slot[p] == k) return p;
    }
    return -1;
}
void insertProbe(int k) {
    if (findProbe(k) >= 0) { printf("%d already exists. Duplicates are not allowed.\n", k); return; }
    int h = hash(k);
    for (int i = 0; i < SIZE; i++) {
        int p = (h + i) % SIZE;
        if (state[p] != OCCUPIED) {                   /* EMPTY or DELETED slot is reusable */
            slot[p] = k; state[p] = OCCUPIED;
            printf("Inserted %d at index %d.\n", k, p);
            return;
        }
    }
    printf("Table is full. Cannot insert %d.\n", k);
}
void searchProbe(int k) {
    int p = findProbe(k);
    if (p >= 0) printf("Found %d at index %d.\n", k, p); else printf("%d not found.\n", k);
}
void deleteProbe(int k) {
    int p = findProbe(k);
    if (p < 0) { printf("%d not found.\n", k); return; }
    state[p] = DELETED;                               /* tombstone keeps probe chains intact */
    printf("Deleted %d from index %d.\n", k, p);
}
void displayProbe() {
    for (int i = 0; i < SIZE; i++) {
        if (state[i] == OCCUPIED) printf("[%d] %d\n", i, slot[i]);
        else if (state[i] == DELETED) printf("[%d] <deleted>\n", i);
        else printf("[%d] -\n", i);
    }
}

int main() {
    printf("Collision handling:\n1. Chaining\n2. Linear probing\nEnter choice: ");
    if (scanf("%d", &mode) != 1) return 0;
    if (mode != 1 && mode != 2) mode = 1;
    printf("Using %s (table size %d, h(k) = k mod %d).\n", mode == 1 ? "chaining" : "linear probing", SIZE, SIZE);
    int choice, k;
    while (1) {
        printf("\n--- Hash Table ---\n1. Insert\n2. Search\n3. Delete\n4. Display\n0. Exit\nEnter choice: ");
        if (scanf("%d", &choice) != 1) break;
        if (choice == 0) { printf("Goodbye!\n"); break; }
        if (choice >= 1 && choice <= 3) { printf("Enter key: "); scanf("%d", &k); }
        switch (choice) {
        case 1: mode == 1 ? insertChain(k) : insertProbe(k); break;
        case 2: mode == 1 ? searchChain(k) : searchProbe(k); break;
        case 3: mode == 1 ? deleteChain(k) : deleteProbe(k); break;
        case 4: mode == 1 ? displayChain() : displayProbe(); break;
        default: printf("Invalid choice.\n");
        }
    }
    return 0;
}
