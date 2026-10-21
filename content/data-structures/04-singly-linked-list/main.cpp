#include <iostream>
using namespace std;

struct Node {
    int data;
    Node *next;
    Node(int v) : data(v), next(nullptr) {}
};

class LinkedList {
    Node *head = nullptr;
public:
    ~LinkedList() {   // free all nodes
        while (head) { Node *t = head; head = head->next; delete t; }
    }

    int length() {
        int c = 0;
        for (Node *p = head; p; p = p->next) c++;
        return c;
    }

    void insertBegin(int val) {
        Node *n = new Node(val);
        n->next = head;   // new node points to the old first node
        head = n;
        cout << "Inserted " << val << " at beginning\n";
    }

    void insertEnd(int val) {
        Node *n = new Node(val);
        if (!head) head = n;
        else {
            Node *p = head;
            while (p->next) p = p->next;   // walk to the last node
            p->next = n;
        }
        cout << "Inserted " << val << " at end\n";
    }

    void insertPos(int val, int pos) {
        if (pos < 1 || pos > length() + 1) { cout << "Invalid position\n"; return; }
        if (pos == 1) { insertBegin(val); return; }
        Node *p = head;
        for (int i = 1; i < pos - 1; i++) p = p->next;   // stop at node before pos
        Node *n = new Node(val);
        n->next = p->next;
        p->next = n;
        cout << "Inserted " << val << " at position " << pos << "\n";
    }

    void deleteValue(int val) {
        Node *prev = nullptr, *cur = head;
        while (cur && cur->data != val) { prev = cur; cur = cur->next; }
        if (!cur) { cout << val << " not found\n"; return; }
        if (prev) prev->next = cur->next; else head = cur->next;
        delete cur;
        cout << "Deleted " << val << "\n";
    }

    void deletePos(int pos) {
        if (!head) { cout << "List is empty (underflow)\n"; return; }
        if (pos < 1 || pos > length()) { cout << "Invalid position\n"; return; }
        Node *cur = head, *prev = nullptr;
        for (int i = 1; i < pos; i++) { prev = cur; cur = cur->next; }
        if (prev) prev->next = cur->next; else head = cur->next;
        cout << "Deleted " << cur->data << " from position " << pos << "\n";
        delete cur;
    }

    void search(int val) {
        int pos = 1;
        for (Node *p = head; p; p = p->next, pos++) {
            if (p->data == val) { cout << val << " found at position " << pos << "\n"; return; }
        }
        cout << val << " not found\n";
    }

    void reverse() {
        if (!head) { cout << "List is empty\n"; return; }
        Node *prev = nullptr, *cur = head, *next;
        while (cur) {
            next = cur->next;   // remember the rest of the list
            cur->next = prev;   // flip the link
            prev = cur;
            cur = next;
        }
        head = prev;
        cout << "List reversed\n";
    }

    void display() {
        if (!head) { cout << "List is empty\n"; return; }
        cout << "List: ";
        for (Node *p = head; p; p = p->next) cout << p->data << " -> ";
        cout << "NULL\n";
    }
};

int main() {
    LinkedList list;
    int choice, val, pos;
    while (true) {
        cout << "\n--- Singly Linked List ---\n";
        cout << "1. Insert at beginning\n2. Insert at end\n3. Insert at position\n";
        cout << "4. Delete by value\n5. Delete by position\n6. Search\n7. Reverse\n8. Display\n0. Exit\n";
        cout << "Enter choice: ";
        if (!(cin >> choice)) break;
        if (choice == 0) break;
        switch (choice) {
            case 1: cout << "Enter value: "; cin >> val; list.insertBegin(val); break;
            case 2: cout << "Enter value: "; cin >> val; list.insertEnd(val); break;
            case 3:
                cout << "Enter position (1-" << list.length() + 1 << "): "; cin >> pos;
                cout << "Enter value: "; cin >> val;
                list.insertPos(val, pos); break;
            case 4: cout << "Enter value to delete: "; cin >> val; list.deleteValue(val); break;
            case 5:
                cout << "Enter position (1-" << list.length() << "): "; cin >> pos;
                list.deletePos(pos); break;
            case 6: cout << "Enter value to search: "; cin >> val; list.search(val); break;
            case 7: list.reverse(); break;
            case 8: list.display(); break;
            default: cout << "Invalid choice\n";
        }
    }
    cout << "Exiting.\n";
    return 0;
}
