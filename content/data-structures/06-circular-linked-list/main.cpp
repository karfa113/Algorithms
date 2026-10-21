#include <iostream>
using namespace std;

struct Node {
    int data;
    Node *next;
    Node(int v) : data(v), next(this) {}   // a lone node points to itself
};

class CircularList {
    Node *tail = nullptr;   // only the tail is stored; tail->next is the head
public:
    ~CircularList() { while (tail) deleteValue(tail->data); }

    void insertBegin(int v) {
        Node *n = new Node(v);
        if (!tail) tail = n;
        else { n->next = tail->next; tail->next = n; }   // tail stays the same
    }

    void insertEnd(int v) {
        insertBegin(v);
        tail = tail->next;                 // the new node becomes the tail
    }

    int deleteValue(int v) {
        if (!tail) return -1;                       // empty
        Node *prev = tail, *cur = tail->next;       // cur starts at head
        do {
            if (cur->data == v) {
                if (cur == prev) tail = nullptr;    // only node
                else {
                    prev->next = cur->next;
                    if (cur == tail) tail = prev;   // removed the tail
                }
                delete cur;
                return 1;
            }
            prev = cur; cur = cur->next;
        } while (prev != tail);                     // one full lap
        return 0;
    }

    int search(int v) {
        if (!tail) return -1;
        Node *cur = tail->next;
        int pos = 1;
        do {
            if (cur->data == v) return pos;
            cur = cur->next; pos++;
        } while (cur != tail->next);
        return 0;
    }

    void display() {
        if (!tail) { cout << "List is empty\n"; return; }
        Node *cur = tail->next;
        cout << "List: ";
        do {
            cout << cur->data << " -> ";
            cur = cur->next;
        } while (cur != tail->next);
        cout << "(back to " << tail->next->data << ")\n";
    }
};

int main() {
    CircularList list;
    int choice, v;
    do {
        cout << "\n--- Circular Linked List ---\n";
        cout << "1. Insert at beginning\n2. Insert at end\n3. Delete a value\n";
        cout << "4. Search\n5. Display\n0. Exit\n";
        cout << "Enter choice: ";
        if (!(cin >> choice)) break;
        switch (choice) {
            case 1: cout << "Enter value: "; cin >> v; list.insertBegin(v);
                    cout << "Inserted " << v << " at beginning\n"; break;
            case 2: cout << "Enter value: "; cin >> v; list.insertEnd(v);
                    cout << "Inserted " << v << " at end\n"; break;
            case 3: { cout << "Enter value: "; cin >> v;
                      int r = list.deleteValue(v);
                      if (r == -1) cout << "List is empty (underflow)\n";
                      else if (r == 0) cout << v << " not found\n";
                      else cout << "Deleted " << v << "\n"; }
                    break;
            case 4: { cout << "Enter value: "; cin >> v;
                      int p = list.search(v);
                      if (p == -1) cout << "List is empty\n";
                      else if (p == 0) cout << v << " not found\n";
                      else cout << v << " found at position " << p << "\n"; }
                    break;
            case 5: list.display(); break;
            case 0: cout << "Bye!\n"; break;
            default: cout << "Invalid choice\n";
        }
    } while (choice != 0);
    return 0;
}
