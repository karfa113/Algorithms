#include <stdio.h>

#define MAX 5   /* capacity of the stack */

int stack[MAX];
int top = -1;   /* index of the top element; -1 means empty */

int isEmpty(void) { return top == -1; }
int isFull(void)  { return top == MAX - 1; }

void push(int val) {
    if (isFull()) { printf("Stack overflow! Cannot push %d\n", val); return; }
    stack[++top] = val;   /* increment top first, then store */
    printf("Pushed %d\n", val);
}

void pop(void) {
    if (isEmpty()) { printf("Stack underflow! Nothing to pop\n"); return; }
    printf("Popped %d\n", stack[top--]);   /* read, then decrement top */
}

void peek(void) {
    if (isEmpty()) { printf("Stack is empty\n"); return; }
    printf("Top element: %d\n", stack[top]);
}

void display(void) {
    if (isEmpty()) { printf("Stack is empty\n"); return; }
    printf("Stack (top to bottom):");
    for (int i = top; i >= 0; i--) printf(" %d", stack[i]);
    printf("\n");
}

int main(void) {
    int choice, val;
    while (1) {
        printf("\n--- Stack (Array) ---\n");
        printf("1. Push\n2. Pop\n3. Peek\n4. Check empty/full\n5. Display\n0. Exit\n");
        printf("Enter choice: ");
        if (scanf("%d", &choice) != 1) break;
        if (choice == 0) { printf("Exiting.\n"); break; }
        switch (choice) {
            case 1: printf("Enter value: "); scanf("%d", &val); push(val); break;
            case 2: pop(); break;
            case 3: peek(); break;
            case 4:
                printf("Stack is empty: %s\n", isEmpty() ? "yes" : "no");
                printf("Stack is full: %s\n", isFull() ? "yes" : "no");
                break;
            case 5: display(); break;
            default: printf("Invalid choice\n");
        }
    }
    return 0;
}
