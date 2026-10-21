#include <iostream>
using namespace std;

struct Node {
    int data;
    Node *prev = nullptr, *next = nullptr;
    Node(int v) : data(v) {}
};

class DoublyLinkedList {
    Node *head = nullptr, *tail = nullptr;
    int count = 0;

    // unlink a node from both neighbours and delete it
    void removeNode(Node *cur) {
        if (cur->prev) cur->prev->next = cur->next; else head = cur->next;
        if (cur->next) cur->next->prev = cur->prev; else tail = cur->prev;
        delete cur;
        count--;
    }

public:
    ~DoublyLinkedList() {
        while (head) { Node *t = head; head = head->next; delete t; }
    }

    int size() const { return count; }

    void insertBegin(int val) {
        Node *n = new Node(val);
        n->next = head;
        if (head) head->prev = n; else tail = n;
        head = n;
        count++;
        cout << "Inserted " << val << " at beginning\n";
    }

    void insertEnd(int val) {
        Node *n = new Node(val);
        n->prev = tail;
        if (tail) tail->next = n; else head = n;
        tail = n;
        count++;
        cout << "Inserted " << val << " at end\n";
    }

    void insertPos(int val, int pos) {
        if (pos < 1 || pos > count + 1) { cout << "Invalid position\n"; return; }
        if (pos == 1) { insertBegin(val); return; }
        if (pos == count + 1) { insertEnd(val); return; }
        Node *p = head;
        for (int i = 1; i < pos - 1; i++) p = p->next;   // node before pos
        Node *n = new Node(val);
        n->next = p->next;
        n->prev = p;
        p->next->prev = n;
        p->next = n;
        count++;
        cout << "Inserted " << val << " at position " << pos << "\n";
    }

    void deleteValue(int val) {
        Node *cur = head;
        while (cur && cur->data != val) cur = cur->next;
        if (!cur) { cout << val << " not found\n"; return; }
        removeNode(cur);
        cout << "Deleted " << val << "\n";
    }

    void deletePos(int pos) {
        if (!head) { cout << "List is empty (underflow)\n"; return; }
        if (pos < 1 || pos > count) { cout << "Invalid position\n"; return; }
        Node *cur = head;
        for (int i = 1; i < pos; i++) cur = cur->next;
        int v = cur->data;
        removeNode(cur);
        cout << "Deleted " << v << " from position " << pos << "\n";
    }

    void search(int val) const {
        int pos = 1;
        for (Node *p = head; p; p = p->next, pos++) {
            if (p->data == val) { cout << val << " found at position " << pos << "\n"; return; }
        }
        cout << val << " not found\n";
    }

    void displayForward() const {
        if (!head) { cout << "List is empty\n"; return; }
        cout << "Forward: NULL <-> ";
        for (Node *p = head; p; p = p->next) cout << p->data << " <-> ";
        cout << "NULL\n";
    }

    void displayBackward() const {
        if (!tail) { cout << "List is empty\n"; return; }
        cout << "Backward: NULL <-> ";
        for (Node *p = tail; p; p = p->prev) cout << p->data << " <-> ";
        cout << "NULL\n";
    }
};

int main() {
    DoublyLinkedList list;
    int choice, val, pos;
    while (true) {
        cout << "\n--- Doubly Linked List ---\n";
        cout << "1. Insert at beginning\n2. Insert at end\n3. Insert at position\n";
        cout << "4. Delete by value\n5. Delete by position\n6. Search\n";
        cout << "7. Display forward\n8. Display backward\n0. Exit\n";
        cout << "Enter choice: ";
        if (!(cin >> choice)) break;
        if (choice == 0) break;
        switch (choice) {
            case 1: cout << "Enter value: "; cin >> val; list.insertBegin(val); break;
            case 2: cout << "Enter value: "; cin >> val; list.insertEnd(val); break;
            case 3:
                cout << "Enter position (1-" << list.size() + 1 << "): "; cin >> pos;
                cout << "Enter value: "; cin >> val;
                list.insertPos(val, pos); break;
            case 4: cout << "Enter value to delete: "; cin >> val; list.deleteValue(val); break;
            case 5:
                cout << "Enter position (1-" << list.size() << "): "; cin >> pos;
                list.deletePos(pos); break;
            case 6: cout << "Enter value to search: "; cin >> val; list.search(val); break;
            case 7: list.displayForward(); break;
            case 8: list.displayBackward(); break;
            default: cout << "Invalid choice\n";
        }
    }
    cout << "Exiting.\n";
    return 0;
}
