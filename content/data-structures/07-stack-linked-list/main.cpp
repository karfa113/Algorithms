#include <iostream>
using namespace std;

struct Node {
    int data;
    Node *next;
    Node(int v, Node *n) : data(v), next(n) {}
};

class Stack {
    Node *top = nullptr;   // top of stack = head of the list
public:
    ~Stack() { int x; while (pop(x)) {} }

    bool isEmpty() { return top == nullptr; }

    void push(int v) {
        top = new Node(v, top);    // new node points to the old top and becomes top
    }

    bool pop(int &out) {
        if (isEmpty()) return false;     // underflow
        Node *t = top;
        out = t->data;
        top = t->next;
        delete t;
        return true;
    }

    int peek() { return top->data; }

    void display() {
        if (isEmpty()) { cout << "Stack is empty\n"; return; }
        cout << "Stack (top to bottom): ";
        for (Node *c = top; c != nullptr; c = c->next) cout << c->data << " ";
        cout << "\n";
    }
};

int main() {
    Stack s;
    int choice, v;
    do {
        cout << "\n--- Stack using Linked List ---\n";
        cout << "1. Push\n2. Pop\n3. Peek\n4. Display\n5. Is Empty\n0. Exit\n";
        cout << "Enter choice: ";
        if (!(cin >> choice)) break;
        switch (choice) {
            case 1: cout << "Enter value: "; cin >> v; s.push(v);
                    cout << "Pushed " << v << "\n"; break;
            case 2: if (s.pop(v)) cout << "Popped " << v << "\n";
                    else cout << "Stack underflow: stack is empty\n"; break;
            case 3: if (s.isEmpty()) cout << "Stack is empty\n";
                    else cout << "Top element is " << s.peek() << "\n"; break;
            case 4: s.display(); break;
            case 5: cout << (s.isEmpty() ? "Stack is empty\n" : "Stack is not empty\n"); break;
            case 0: cout << "Bye!\n"; break;
            default: cout << "Invalid choice\n";
        }
    } while (choice != 0);
    return 0;
}
