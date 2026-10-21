#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

/* We keep only a pointer to the TAIL; tail->next is the head. */
Node *tail = NULL;

Node *newNode(int v) {
    Node *n = malloc(sizeof(Node));
    n->data = v;
    n->next = n;               /* a lone node points to itself */
    return n;
}

void insertBegin(int v) {
    Node *n = newNode(v);
    if (tail == NULL) tail = n;
    else { n->next = tail->next; tail->next = n; }   /* tail stays the same */
}

void insertEnd(int v) {
    insertBegin(v);
    tail = tail->next;         /* the new node becomes the tail */
}

int deleteValue(int v) {
    if (tail == NULL) return -1;                 /* empty */
    Node *prev = tail, *cur = tail->next;        /* cur starts at head */
    do {
        if (cur->data == v) {
            if (cur == prev) tail = NULL;        /* only node */
            else {
                prev->next = cur->next;
                if (cur == tail) tail = prev;    /* removed the tail */
            }
            free(cur);
            return 1;
        }
        prev = cur; cur = cur->next;
    } while (prev != tail);                      /* one full lap */
    return 0;
}

int search(int v) {
    if (tail == NULL) return -1;
    Node *cur = tail->next;
    int pos = 1;
    do {
        if (cur->data == v) return pos;
        cur = cur->next; pos++;
    } while (cur != tail->next);
    return 0;
}

void display(void) {
    if (tail == NULL) { printf("List is empty\n"); return; }
    Node *cur = tail->next;
    printf("List: ");
    do {
        printf("%d -> ", cur->data);
        cur = cur->next;
    } while (cur != tail->next);
    printf("(back to %d)\n", tail->next->data);
}

int main(void) {
    int choice, v;
    do {
        printf("\n--- Circular Linked List ---\n");
        printf("1. Insert at beginning\n2. Insert at end\n3. Delete a value\n");
        printf("4. Search\n5. Display\n0. Exit\n");
        printf("Enter choice: ");
        if (scanf("%d", &choice) != 1) break;
        switch (choice) {
            case 1: printf("Enter value: "); scanf("%d", &v); insertBegin(v);
                    printf("Inserted %d at beginning\n", v); break;
            case 2: printf("Enter value: "); scanf("%d", &v); insertEnd(v);
                    printf("Inserted %d at end\n", v); break;
            case 3: printf("Enter value: "); scanf("%d", &v);
                    { int r = deleteValue(v);
                      if (r == -1) printf("List is empty (underflow)\n");
                      else if (r == 0) printf("%d not found\n", v);
                      else printf("Deleted %d\n", v); }
                    break;
            case 4: printf("Enter value: "); scanf("%d", &v);
                    { int p = search(v);
                      if (p == -1) printf("List is empty\n");
                      else if (p == 0) printf("%d not found\n", v);
                      else printf("%d found at position %d\n", v, p); }
                    break;
            case 5: display(); break;
            case 0: printf("Bye!\n"); break;
            default: printf("Invalid choice\n");
        }
    } while (choice != 0);
    while (tail != NULL) deleteValue(tail->data);   /* free everything */
    return 0;
}
