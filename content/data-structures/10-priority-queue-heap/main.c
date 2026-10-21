#include <stdio.h>

#define MAX 100

int heap[MAX];
int size = 0;

void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

// Move the element at index i up until its parent is not larger.
void heapifyUp(int i) {
    while (i > 0 && heap[(i - 1) / 2] > heap[i]) {
        swap(&heap[(i - 1) / 2], &heap[i]);
        i = (i - 1) / 2;
    }
}

// Move the element at index i down until both children are not smaller.
void heapifyDown(int i) {
    while (1) {
        int l = 2 * i + 1, r = 2 * i + 2, smallest = i;
        if (l < size && heap[l] < heap[smallest]) smallest = l;
        if (r < size && heap[r] < heap[smallest]) smallest = r;
        if (smallest == i) break;
        swap(&heap[i], &heap[smallest]);
        i = smallest;
    }
}

int main(void) {
    int choice, v;
    do {
        printf("\n--- Priority Queue (Min Heap) ---\n");
        printf("1. Insert\n2. Extract Min\n3. Peek\n4. Display\n0. Exit\n");
        printf("Enter choice: ");
        if (scanf("%d", &choice) != 1) break;
        switch (choice) {
            case 1:
                if (size == MAX) { printf("Heap is full\n"); break; }
                printf("Enter value: "); scanf("%d", &v);
                heap[size++] = v;
                heapifyUp(size - 1);
                printf("Inserted %d\n", v);
                break;
            case 2:
                if (size == 0) { printf("Heap is empty\n"); break; }
                v = heap[0];
                heap[0] = heap[--size];     // move last element to the root
                heapifyDown(0);
                printf("Extracted %d\n", v);
                break;
            case 3:
                if (size == 0) printf("Heap is empty\n");
                else printf("Minimum = %d\n", heap[0]);
                break;
            case 4:
                if (size == 0) { printf("Heap is empty\n"); break; }
                printf("Heap array: ");
                for (int i = 0; i < size; i++) printf("%d ", heap[i]);
                printf("\n");
                break;
            case 0: printf("Goodbye!\n"); break;
            default: printf("Invalid choice.\n");
        }
    } while (choice != 0);
    return 0;
}
