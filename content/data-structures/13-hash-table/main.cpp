#include <iostream>
using namespace std;

const int SIZE = 10;
enum { EMPTY, OCCUPIED, DELETED };   // slot states for linear probing

struct Node {
    int key; Node* next;
    Node(int k) : key(k), next(nullptr) {}
};

int mode;                       // 1 = chaining, 2 = linear probing
Node* bucket[SIZE];             // used by chaining (zero-initialised globals)
int slot[SIZE], state[SIZE];    // used by linear probing

int hashOf(int k) { return ((k % SIZE) + SIZE) % SIZE; }   // safe for negatives

// ---- chaining ----
void insertChain(int k) {
    int h = hashOf(k);
    Node *p = bucket[h], *last = nullptr;
    for (; p; last = p, p = p->next)
        if (p->key == k) { cout << k << " already exists. Duplicates are not allowed.\n"; return; }
    Node* n = new Node(k);
    if (last) last->next = n; else bucket[h] = n;     // append at tail
    cout << "Inserted " << k << " in bucket " << h << ".\n";
}
void searchChain(int k) {
    int h = hashOf(k);
    for (Node* p = bucket[h]; p; p = p->next)
        if (p->key == k) { cout << "Found " << k << " in bucket " << h << ".\n"; return; }
    cout << k << " not found.\n";
}
void deleteChain(int k) {
    int h = hashOf(k);
    Node *p = bucket[h], *prev = nullptr;
    for (; p; prev = p, p = p->next)
        if (p->key == k) {
            if (prev) prev->next = p->next; else bucket[h] = p->next;
            delete p;
            cout << "Deleted " << k << " from bucket " << h << ".\n";
            return;
        }
    cout << k << " not found.\n";
}
void displayChain() {
    for (int i = 0; i < SIZE; i++) {
        cout << "[" << i << "] ";
        if (!bucket[i]) cout << "-";
        for (Node* p = bucket[i]; p; p = p->next) cout << p->key << (p->next ? " -> " : "");
        cout << "\n";
    }
}

// ---- linear probing ----
int findProbe(int k) {          // index of k, or -1
    int h = hashOf(k);
    for (int i = 0; i < SIZE; i++) {
        int p = (h + i) % SIZE;
        if (state[p] == EMPTY) return -1;             // chain of probes ends here
        if (state[p] == OCCUPIED && slot[p] == k) return p;
    }
    return -1;
}
void insertProbe(int k) {
    if (findProbe(k) >= 0) { cout << k << " already exists. Duplicates are not allowed.\n"; return; }
    int h = hashOf(k);
    for (int i = 0; i < SIZE; i++) {
        int p = (h + i) % SIZE;
        if (state[p] != OCCUPIED) {                   // EMPTY or DELETED slot is reusable
            slot[p] = k; state[p] = OCCUPIED;
            cout << "Inserted " << k << " at index " << p << ".\n";
            return;
        }
    }
    cout << "Table is full. Cannot insert " << k << ".\n";
}
void searchProbe(int k) {
    int p = findProbe(k);
    if (p >= 0) cout << "Found " << k << " at index " << p << ".\n"; else cout << k << " not found.\n";
}
void deleteProbe(int k) {
    int p = findProbe(k);
    if (p < 0) { cout << k << " not found.\n"; return; }
    state[p] = DELETED;                               // tombstone keeps probe chains intact
    cout << "Deleted " << k << " from index " << p << ".\n";
}
void displayProbe() {
    for (int i = 0; i < SIZE; i++) {
        if (state[i] == OCCUPIED) cout << "[" << i << "] " << slot[i] << "\n";
        else if (state[i] == DELETED) cout << "[" << i << "] <deleted>\n";
        else cout << "[" << i << "] -\n";
    }
}

int main() {
    cout << "Collision handling:\n1. Chaining\n2. Linear probing\nEnter choice: ";
    if (!(cin >> mode)) return 0;
    if (mode != 1 && mode != 2) mode = 1;
    cout << "Using " << (mode == 1 ? "chaining" : "linear probing") << " (table size " << SIZE << ", h(k) = k mod " << SIZE << ").\n";
    int choice, k = 0;
    while (true) {
        cout << "\n--- Hash Table ---\n1. Insert\n2. Search\n3. Delete\n4. Display\n0. Exit\nEnter choice: ";
        if (!(cin >> choice)) break;
        if (choice == 0) { cout << "Goodbye!\n"; break; }
        if (choice >= 1 && choice <= 3) { cout << "Enter key: "; cin >> k; }
        switch (choice) {
        case 1: mode == 1 ? insertChain(k) : insertProbe(k); break;
        case 2: mode == 1 ? searchChain(k) : searchProbe(k); break;
        case 3: mode == 1 ? deleteChain(k) : deleteProbe(k); break;
        case 4: mode == 1 ? displayChain() : displayProbe(); break;
        default: cout << "Invalid choice.\n";
        }
    }
    return 0;
}
