#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node *front = NULL, *rear = NULL;   /* dequeue at front, enqueue at rear */

int isEmpty(void) { return front == NULL; }

void enqueue(int v) {
    Node *n = malloc(sizeof(Node));
    n->data = v;
    n->next = NULL;
    if (rear == NULL) front = rear = n;   /* first element */
    else { rear->next = n; rear = n; }
}

int dequeue(int *out) {
    if (isEmpty()) return 0;              /* underflow */
    Node *t = front;
    *out = t->data;
    front = t->next;
    if (front == NULL) rear = NULL;       /* queue became empty */
    free(t);
    return 1;
}

void display(void) {
    if (isEmpty()) { printf("Queue is empty\n"); return; }
    printf("Queue (front to rear): ");
    for (Node *c = front; c != NULL; c = c->next) printf("%d ", c->data);
    printf("\n");
}

int main(void) {
    int choice, v;
    do {
        printf("\n--- Queue using Linked List ---\n");
        printf("1. Enqueue\n2. Dequeue\n3. Front\n4. Display\n5. Is Empty\n0. Exit\n");
        printf("Enter choice: ");
        if (scanf("%d", &choice) != 1) break;
        switch (choice) {
            case 1: printf("Enter value: "); scanf("%d", &v); enqueue(v);
                    printf("Enqueued %d\n", v); break;
            case 2: if (dequeue(&v)) printf("Dequeued %d\n", v);
                    else printf("Queue underflow: queue is empty\n"); break;
            case 3: if (isEmpty()) printf("Queue is empty\n");
                    else printf("Front element is %d\n", front->data); break;
            case 4: display(); break;
            case 5: printf(isEmpty() ? "Queue is empty\n" : "Queue is not empty\n"); break;
            case 0: printf("Bye!\n"); break;
            default: printf("Invalid choice\n");
        }
    } while (choice != 0);
    while (dequeue(&v)) ;   /* free all nodes */
    return 0;
}
