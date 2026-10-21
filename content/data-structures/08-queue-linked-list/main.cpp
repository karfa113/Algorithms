#include <iostream>
using namespace std;

struct Node {
    int data;
    Node *next;
    Node(int v) : data(v), next(nullptr) {}
};

class Queue {
    Node *front = nullptr, *rear = nullptr;   // dequeue at front, enqueue at rear
public:
    ~Queue() { int x; while (dequeue(x)) {} }

    bool isEmpty() { return front == nullptr; }

    void enqueue(int v) {
        Node *n = new Node(v);
        if (rear == nullptr) front = rear = n;   // first element
        else { rear->next = n; rear = n; }
    }

    bool dequeue(int &out) {
        if (isEmpty()) return false;             // underflow
        Node *t = front;
        out = t->data;
        front = t->next;
        if (front == nullptr) rear = nullptr;    // queue became empty
        delete t;
        return true;
    }

    int peekFront() { return front->data; }

    void display() {
        if (isEmpty()) { cout << "Queue is empty\n"; return; }
        cout << "Queue (front to rear): ";
        for (Node *c = front; c != nullptr; c = c->next) cout << c->data << " ";
        cout << "\n";
    }
};

int main() {
    Queue q;
    int choice, v;
    do {
        cout << "\n--- Queue using Linked List ---\n";
        cout << "1. Enqueue\n2. Dequeue\n3. Front\n4. Display\n5. Is Empty\n0. Exit\n";
        cout << "Enter choice: ";
        if (!(cin >> choice)) break;
        switch (choice) {
            case 1: cout << "Enter value: "; cin >> v; q.enqueue(v);
                    cout << "Enqueued " << v << "\n"; break;
            case 2: if (q.dequeue(v)) cout << "Dequeued " << v << "\n";
                    else cout << "Queue underflow: queue is empty\n"; break;
            case 3: if (q.isEmpty()) cout << "Queue is empty\n";
                    else cout << "Front element is " << q.peekFront() << "\n"; break;
            case 4: q.display(); break;
            case 5: cout << (q.isEmpty() ? "Queue is empty\n" : "Queue is not empty\n"); break;
            case 0: cout << "Bye!\n"; break;
            default: cout << "Invalid choice\n";
        }
    } while (choice != 0);
    return 0;
}
