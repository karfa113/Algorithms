#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *prev, *next;
} Node;

Node *head = NULL, *tail = NULL;
int count = 0;

Node *newNode(int val) {
    Node *n = (Node *)malloc(sizeof(Node));
    n->data = val;
    n->prev = n->next = NULL;
    return n;
}

void insertBegin(int val) {
    Node *n = newNode(val);
    n->next = head;
    if (head) head->prev = n; else tail = n;   /* first node is also the tail */
    head = n;
    count++;
    printf("Inserted %d at beginning\n", val);
}

void insertEnd(int val) {
    Node *n = newNode(val);
    n->prev = tail;
    if (tail) tail->next = n; else head = n;
    tail = n;
    count++;
    printf("Inserted %d at end\n", val);
}

void insertPos(int val, int pos) {
    if (pos < 1 || pos > count + 1) { printf("Invalid position\n"); return; }
    if (pos == 1) { insertBegin(val); return; }
    if (pos == count + 1) { insertEnd(val); return; }
    Node *p = head;
    for (int i = 1; i < pos - 1; i++) p = p->next;   /* node before pos */
    Node *n = newNode(val);
    n->next = p->next;
    n->prev = p;
    p->next->prev = n;
    p->next = n;
    count++;
    printf("Inserted %d at position %d\n", val, pos);
}

/* unlink a node from both neighbours and free it */
void removeNode(Node *cur) {
    if (cur->prev) cur->prev->next = cur->next; else head = cur->next;
    if (cur->next) cur->next->prev = cur->prev; else tail = cur->prev;
    free(cur);
    count--;
}

void deleteValue(int val) {
    Node *cur = head;
    while (cur && cur->data != val) cur = cur->next;
    if (!cur) { printf("%d not found\n", val); return; }
    removeNode(cur);
    printf("Deleted %d\n", val);
}

void deletePos(int pos) {
    if (!head) { printf("List is empty (underflow)\n"); return; }
    if (pos < 1 || pos > count) { printf("Invalid position\n"); return; }
    Node *cur = head;
    for (int i = 1; i < pos; i++) cur = cur->next;
    int v = cur->data;
    removeNode(cur);
    printf("Deleted %d from position %d\n", v, pos);
}

void search(int val) {
    int pos = 1;
    for (Node *p = head; p; p = p->next, pos++) {
        if (p->data == val) { printf("%d found at position %d\n", val, pos); return; }
    }
    printf("%d not found\n", val);
}

void displayForward(void) {
    if (!head) { printf("List is empty\n"); return; }
    printf("Forward: NULL <-> ");
    for (Node *p = head; p; p = p->next) printf("%d <-> ", p->data);
    printf("NULL\n");
}

void displayBackward(void) {
    if (!tail) { printf("List is empty\n"); return; }
    printf("Backward: NULL <-> ");
    for (Node *p = tail; p; p = p->prev) printf("%d <-> ", p->data);
    printf("NULL\n");
}

int main(void) {
    int choice, val, pos;
    while (1) {
        printf("\n--- Doubly Linked List ---\n");
        printf("1. Insert at beginning\n2. Insert at end\n3. Insert at position\n");
        printf("4. Delete by value\n5. Delete by position\n6. Search\n");
        printf("7. Display forward\n8. Display backward\n0. Exit\n");
        printf("Enter choice: ");
        if (scanf("%d", &choice) != 1) break;
        if (choice == 0) break;
        switch (choice) {
            case 1: printf("Enter value: "); scanf("%d", &val); insertBegin(val); break;
            case 2: printf("Enter value: "); scanf("%d", &val); insertEnd(val); break;
            case 3:
                printf("Enter position (1-%d): ", count + 1); scanf("%d", &pos);
                printf("Enter value: "); scanf("%d", &val);
                insertPos(val, pos); break;
            case 4: printf("Enter value to delete: "); scanf("%d", &val); deleteValue(val); break;
            case 5:
                printf("Enter position (1-%d): ", count); scanf("%d", &pos);
                deletePos(pos); break;
            case 6: printf("Enter value to search: "); scanf("%d", &val); search(val); break;
            case 7: displayForward(); break;
            case 8: displayBackward(); break;
            default: printf("Invalid choice\n");
        }
    }
    while (head) { Node *t = head; head = head->next; free(t); }
    printf("Exiting.\n");
    return 0;
}
