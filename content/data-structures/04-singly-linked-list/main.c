#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node *head = NULL;

Node *newNode(int val) {
    Node *n = (Node *)malloc(sizeof(Node));
    n->data = val;
    n->next = NULL;
    return n;
}

int length(void) {
    int c = 0;
    for (Node *p = head; p; p = p->next) c++;
    return c;
}

void insertBegin(int val) {
    Node *n = newNode(val);
    n->next = head;   /* new node points to the old first node */
    head = n;
    printf("Inserted %d at beginning\n", val);
}

void insertEnd(int val) {
    Node *n = newNode(val);
    if (!head) head = n;
    else {
        Node *p = head;
        while (p->next) p = p->next;   /* walk to the last node */
        p->next = n;
    }
    printf("Inserted %d at end\n", val);
}

void insertPos(int val, int pos) {
    if (pos < 1 || pos > length() + 1) { printf("Invalid position\n"); return; }
    if (pos == 1) { insertBegin(val); return; }
    Node *p = head;
    for (int i = 1; i < pos - 1; i++) p = p->next;   /* stop at node before pos */
    Node *n = newNode(val);
    n->next = p->next;
    p->next = n;
    printf("Inserted %d at position %d\n", val, pos);
}

void deleteValue(int val) {
    Node *prev = NULL, *cur = head;
    while (cur && cur->data != val) { prev = cur; cur = cur->next; }
    if (!cur) { printf("%d not found\n", val); return; }
    if (prev) prev->next = cur->next; else head = cur->next;
    free(cur);
    printf("Deleted %d\n", val);
}

void deletePos(int pos) {
    if (!head) { printf("List is empty (underflow)\n"); return; }
    if (pos < 1 || pos > length()) { printf("Invalid position\n"); return; }
    Node *cur = head, *prev = NULL;
    for (int i = 1; i < pos; i++) { prev = cur; cur = cur->next; }
    if (prev) prev->next = cur->next; else head = cur->next;
    printf("Deleted %d from position %d\n", cur->data, pos);
    free(cur);
}

void search(int val) {
    int pos = 1;
    for (Node *p = head; p; p = p->next, pos++) {
        if (p->data == val) { printf("%d found at position %d\n", val, pos); return; }
    }
    printf("%d not found\n", val);
}

void reverse(void) {
    if (!head) { printf("List is empty\n"); return; }
    Node *prev = NULL, *cur = head, *next;
    while (cur) {
        next = cur->next;   /* remember the rest of the list */
        cur->next = prev;   /* flip the link */
        prev = cur;
        cur = next;
    }
    head = prev;
    printf("List reversed\n");
}

void display(void) {
    if (!head) { printf("List is empty\n"); return; }
    printf("List: ");
    for (Node *p = head; p; p = p->next) printf("%d -> ", p->data);
    printf("NULL\n");
}

int main(void) {
    int choice, val, pos;
    while (1) {
        printf("\n--- Singly Linked List ---\n");
        printf("1. Insert at beginning\n2. Insert at end\n3. Insert at position\n");
        printf("4. Delete by value\n5. Delete by position\n6. Search\n7. Reverse\n8. Display\n0. Exit\n");
        printf("Enter choice: ");
        if (scanf("%d", &choice) != 1) break;
        if (choice == 0) break;
        switch (choice) {
            case 1: printf("Enter value: "); scanf("%d", &val); insertBegin(val); break;
            case 2: printf("Enter value: "); scanf("%d", &val); insertEnd(val); break;
            case 3:
                printf("Enter position (1-%d): ", length() + 1); scanf("%d", &pos);
                printf("Enter value: "); scanf("%d", &val);
                insertPos(val, pos); break;
            case 4: printf("Enter value to delete: "); scanf("%d", &val); deleteValue(val); break;
            case 5:
                printf("Enter position (1-%d): ", length()); scanf("%d", &pos);
                deletePos(pos); break;
            case 6: printf("Enter value to search: "); scanf("%d", &val); search(val); break;
            case 7: reverse(); break;
            case 8: display(); break;
            default: printf("Invalid choice\n");
        }
    }
    while (head) { Node *t = head; head = head->next; free(t); }   /* free all nodes */
    printf("Exiting.\n");
    return 0;
}
