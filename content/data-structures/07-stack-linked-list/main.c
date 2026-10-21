#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node *top = NULL;   /* top of stack = head of the list */

int isEmpty(void) { return top == NULL; }

void push(int v) {
    Node *n = malloc(sizeof(Node));
    n->data = v;
    n->next = top;      /* new node points to the old top */
    top = n;            /* and becomes the new top */
}

int pop(int *out) {
    if (isEmpty()) return 0;     /* underflow */
    Node *t = top;
    *out = t->data;
    top = t->next;
    free(t);
    return 1;
}

void display(void) {
    if (isEmpty()) { printf("Stack is empty\n"); return; }
    printf("Stack (top to bottom): ");
    for (Node *c = top; c != NULL; c = c->next) printf("%d ", c->data);
    printf("\n");
}

int main(void) {
    int choice, v;
    do {
        printf("\n--- Stack using Linked List ---\n");
        printf("1. Push\n2. Pop\n3. Peek\n4. Display\n5. Is Empty\n0. Exit\n");
        printf("Enter choice: ");
        if (scanf("%d", &choice) != 1) break;
        switch (choice) {
            case 1: printf("Enter value: "); scanf("%d", &v); push(v);
                    printf("Pushed %d\n", v); break;
            case 2: if (pop(&v)) printf("Popped %d\n", v);
                    else printf("Stack underflow: stack is empty\n"); break;
            case 3: if (isEmpty()) printf("Stack is empty\n");
                    else printf("Top element is %d\n", top->data); break;
            case 4: display(); break;
            case 5: printf(isEmpty() ? "Stack is empty\n" : "Stack is not empty\n"); break;
            case 0: printf("Bye!\n"); break;
            default: printf("Invalid choice\n");
        }
    } while (choice != 0);
    while (pop(&v)) ;   /* free all nodes */
    return 0;
}
