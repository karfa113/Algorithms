#include <iostream>
using namespace std;

const int MAX = 5;   // capacity of the stack

class Stack {
    int data[MAX];
    int top = -1;   // index of the top element; -1 means empty
public:
    bool isEmpty() { return top == -1; }
    bool isFull() { return top == MAX - 1; }

    void push(int val) {
        if (isFull()) { cout << "Stack overflow! Cannot push " << val << "\n"; return; }
        data[++top] = val;   // increment top first, then store
        cout << "Pushed " << val << "\n";
    }

    void pop() {
        if (isEmpty()) { cout << "Stack underflow! Nothing to pop\n"; return; }
        cout << "Popped " << data[top--] << "\n";   // read, then decrement top
    }

    void peek() {
        if (isEmpty()) { cout << "Stack is empty\n"; return; }
        cout << "Top element: " << data[top] << "\n";
    }

    void display() {
        if (isEmpty()) { cout << "Stack is empty\n"; return; }
        cout << "Stack (top to bottom):";
        for (int i = top; i >= 0; i--) cout << " " << data[i];
        cout << "\n";
    }
};

int main() {
    Stack s;
    int choice, val;
    while (true) {
        cout << "\n--- Stack (Array) ---\n";
        cout << "1. Push\n2. Pop\n3. Peek\n4. Check empty/full\n5. Display\n0. Exit\n";
        cout << "Enter choice: ";
        if (!(cin >> choice)) break;
        if (choice == 0) { cout << "Exiting.\n"; break; }
        switch (choice) {
            case 1: cout << "Enter value: "; cin >> val; s.push(val); break;
            case 2: s.pop(); break;
            case 3: s.peek(); break;
            case 4:
                cout << "Stack is empty: " << (s.isEmpty() ? "yes" : "no") << "\n";
                cout << "Stack is full: " << (s.isFull() ? "yes" : "no") << "\n";
                break;
            case 5: s.display(); break;
            default: cout << "Invalid choice\n";
        }
    }
    return 0;
}
