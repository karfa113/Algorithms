#include <iostream>
using namespace std;

const int MAX = 100;

class MinHeap {
    int heap[MAX];
    int size = 0;

    // Move the element at index i up until its parent is not larger.
    void heapifyUp(int i) {
        while (i > 0 && heap[(i - 1) / 2] > heap[i]) {
            swap(heap[(i - 1) / 2], heap[i]);
            i = (i - 1) / 2;
        }
    }

    // Move the element at index i down until both children are not smaller.
    void heapifyDown(int i) {
        while (true) {
            int l = 2 * i + 1, r = 2 * i + 2, smallest = i;
            if (l < size && heap[l] < heap[smallest]) smallest = l;
            if (r < size && heap[r] < heap[smallest]) smallest = r;
            if (smallest == i) break;
            swap(heap[i], heap[smallest]);
            i = smallest;
        }
    }

public:
    bool isEmpty() { return size == 0; }
    bool isFull()  { return size == MAX; }

    void insert(int v) {
        heap[size++] = v;
        heapifyUp(size - 1);
    }

    int extractMin() {
        int v = heap[0];
        heap[0] = heap[--size];     // move last element to the root
        heapifyDown(0);
        return v;
    }

    int peek() { return heap[0]; }

    void display() {
        cout << "Heap array: ";
        for (int i = 0; i < size; i++) cout << heap[i] << " ";
        cout << "\n";
    }
};

int main() {
    MinHeap h;
    int choice, v;
    do {
        cout << "\n--- Priority Queue (Min Heap) ---\n";
        cout << "1. Insert\n2. Extract Min\n3. Peek\n4. Display\n0. Exit\n";
        cout << "Enter choice: ";
        if (!(cin >> choice)) break;
        switch (choice) {
            case 1:
                if (h.isFull()) { cout << "Heap is full\n"; break; }
                cout << "Enter value: "; cin >> v;
                h.insert(v);
                cout << "Inserted " << v << "\n";
                break;
            case 2:
                if (h.isEmpty()) { cout << "Heap is empty\n"; break; }
                cout << "Extracted " << h.extractMin() << "\n";
                break;
            case 3:
                if (h.isEmpty()) cout << "Heap is empty\n";
                else cout << "Minimum = " << h.peek() << "\n";
                break;
            case 4:
                if (h.isEmpty()) cout << "Heap is empty\n";
                else h.display();
                break;
            case 0: cout << "Goodbye!\n"; break;
            default: cout << "Invalid choice.\n";
        }
    } while (choice != 0);
    return 0;
}
