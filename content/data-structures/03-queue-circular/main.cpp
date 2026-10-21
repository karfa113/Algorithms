#include <iostream>
using namespace std;

const int MAX = 5;   // capacity of the circular queue

class CircularQueue {
    int data[MAX];
    int front = 0;   // index of the first element
    int count = 0;   // number of elements; distinguishes full from empty
public:
    bool isEmpty() { return count == 0; }
    bool isFull() { return count == MAX; }

    void enqueue(int val) {
        if (isFull()) { cout << "Queue overflow! Cannot enqueue " << val << "\n"; return; }
        int rear = (front + count) % MAX;   // next free slot, wraps around
        data[rear] = val;
        count++;
        cout << "Enqueued " << val << "\n";
    }

    void dequeue() {
        if (isEmpty()) { cout << "Queue underflow! Nothing to dequeue\n"; return; }
        cout << "Dequeued " << data[front] << "\n";
        front = (front + 1) % MAX;   // move front forward, wrapping
        count--;
    }

    void showFront() {
        if (isEmpty()) { cout << "Queue is empty\n"; return; }
        cout << "Front element: " << data[front] << "\n";
    }

    void display() {
        if (isEmpty()) { cout << "Queue is empty\n"; return; }
        cout << "Queue (front to rear):";
        for (int i = 0; i < count; i++) cout << " " << data[(front + i) % MAX];
        cout << "\n";
    }
};

int main() {
    CircularQueue q;
    int choice, val;
    while (true) {
        cout << "\n--- Circular Queue ---\n";
        cout << "1. Enqueue\n2. Dequeue\n3. Front\n4. Check empty/full\n5. Display\n0. Exit\n";
        cout << "Enter choice: ";
        if (!(cin >> choice)) break;
        if (choice == 0) { cout << "Exiting.\n"; break; }
        switch (choice) {
            case 1: cout << "Enter value: "; cin >> val; q.enqueue(val); break;
            case 2: q.dequeue(); break;
            case 3: q.showFront(); break;
            case 4:
                cout << "Queue is empty: " << (q.isEmpty() ? "yes" : "no") << "\n";
                cout << "Queue is full: " << (q.isFull() ? "yes" : "no") << "\n";
                break;
            case 5: q.display(); break;
            default: cout << "Invalid choice\n";
        }
    }
    return 0;
}
