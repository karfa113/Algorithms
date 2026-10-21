#include <stdio.h>

#define MAX 5   /* capacity of the circular queue */

int queue[MAX];
int front = 0;   /* index of the first element */
int count = 0;   /* number of elements; distinguishes full from empty */

int isEmpty(void) { return count == 0; }
int isFull(void)  { return count == MAX; }

void enqueue(int val) {
    if (isFull()) { printf("Queue overflow! Cannot enqueue %d\n", val); return; }
    int rear = (front + count) % MAX;   /* next free slot, wraps around */
    queue[rear] = val;
    count++;
    printf("Enqueued %d\n", val);
}

void dequeue(void) {
    if (isEmpty()) { printf("Queue underflow! Nothing to dequeue\n"); return; }
    printf("Dequeued %d\n", queue[front]);
    front = (front + 1) % MAX;   /* move front forward, wrapping */
    count--;
}

void showFront(void) {
    if (isEmpty()) { printf("Queue is empty\n"); return; }
    printf("Front element: %d\n", queue[front]);
}

void display(void) {
    if (isEmpty()) { printf("Queue is empty\n"); return; }
    printf("Queue (front to rear):");
    for (int i = 0; i < count; i++) printf(" %d", queue[(front + i) % MAX]);
    printf("\n");
}

int main(void) {
    int choice, val;
    while (1) {
        printf("\n--- Circular Queue ---\n");
        printf("1. Enqueue\n2. Dequeue\n3. Front\n4. Check empty/full\n5. Display\n0. Exit\n");
        printf("Enter choice: ");
        if (scanf("%d", &choice) != 1) break;
        if (choice == 0) { printf("Exiting.\n"); break; }
        switch (choice) {
            case 1: printf("Enter value: "); scanf("%d", &val); enqueue(val); break;
            case 2: dequeue(); break;
            case 3: showFront(); break;
            case 4:
                printf("Queue is empty: %s\n", isEmpty() ? "yes" : "no");
                printf("Queue is full: %s\n", isFull() ? "yes" : "no");
                break;
            case 5: display(); break;
            default: printf("Invalid choice\n");
        }
    }
    return 0;
}
