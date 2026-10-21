#include <iostream>
using namespace std;

struct Node {
    int key, height;
    Node *left, *right;
    Node(int k) : key(k), height(1), left(nullptr), right(nullptr) {}
};

int height(Node* n) { return n ? n->height : 0; }
int maxi(int a, int b) { return a > b ? a : b; }
int balance(Node* n) { return n ? height(n->left) - height(n->right) : 0; }
void update(Node* n) { n->height = 1 + maxi(height(n->left), height(n->right)); }

Node* rotateRight(Node* y) {      // y's left child x becomes the new root
    Node* x = y->left;
    y->left = x->right;
    x->right = y;
    update(y); update(x);
    return x;
}

Node* rotateLeft(Node* x) {       // x's right child y becomes the new root
    Node* y = x->right;
    x->right = y->left;
    y->left = x;
    update(x); update(y);
    return y;
}

// Restore the AVL property at n (children are already balanced).
Node* rebalance(Node* n) {
    update(n);
    int bf = balance(n);
    if (bf > 1) {
        if (balance(n->left) >= 0) {
            cout << "Rotation: LL case at " << n->key << " (right rotation)\n";
        } else {
            cout << "Rotation: LR case at " << n->key << " (left-right rotation)\n";
            n->left = rotateLeft(n->left);
        }
        return rotateRight(n);
    }
    if (bf < -1) {
        if (balance(n->right) <= 0) {
            cout << "Rotation: RR case at " << n->key << " (left rotation)\n";
        } else {
            cout << "Rotation: RL case at " << n->key << " (right-left rotation)\n";
            n->right = rotateRight(n->right);
        }
        return rotateLeft(n);
    }
    return n;
}

bool found;   // set by insert/remove to report the outcome

Node* insert(Node* n, int key) {
    if (!n) { found = false; return new Node(key); }
    if (key < n->key) n->left = insert(n->left, key);
    else if (key > n->key) n->right = insert(n->right, key);
    else { found = true; return n; }       // duplicate
    return rebalance(n);
}

Node* minNode(Node* n) { while (n->left) n = n->left; return n; }

Node* remove(Node* n, int key) {
    if (!n) { found = false; return nullptr; }
    if (key < n->key) n->left = remove(n->left, key);
    else if (key > n->key) n->right = remove(n->right, key);
    else {
        found = true;
        if (!n->left || !n->right) {       // 0 or 1 child
            Node* child = n->left ? n->left : n->right;
            delete n;
            return child;
        }
        Node* s = minNode(n->right);       // inorder successor
        n->key = s->key;
        n->right = remove(n->right, s->key);
    }
    return rebalance(n);
}

bool search(Node* n, int key) {
    while (n) {
        if (key == n->key) return true;
        n = key < n->key ? n->left : n->right;
    }
    return false;
}

void inorder(Node* n) { if (n) { inorder(n->left); cout << n->key << " "; inorder(n->right); } }
void preorder(Node* n) { if (n) { cout << n->key << " "; preorder(n->left); preorder(n->right); } }
void showBalance(Node* n) {
    if (n) {
        showBalance(n->left);
        cout << "Node " << n->key << ": height = " << n->height << ", balance factor = " << balance(n) << "\n";
        showBalance(n->right);
    }
}

int main() {
    Node* root = nullptr;
    int choice, x;
    while (true) {
        cout << "\n--- AVL Tree ---\n1. Insert\n2. Delete\n3. Search\n4. Inorder\n5. Preorder\n6. Height and balance factors\n0. Exit\nEnter choice: ";
        if (!(cin >> choice)) break;
        if (choice == 0) { cout << "Goodbye!\n"; break; }
        switch (choice) {
        case 1:
            cout << "Enter value: "; cin >> x;
            root = insert(root, x);
            if (found) cout << x << " already exists. Duplicates are not allowed.\n";
            else cout << x << " inserted.\n";
            break;
        case 2:
            cout << "Enter value: "; cin >> x;
            root = remove(root, x);
            if (found) cout << x << " deleted.\n";
            else cout << x << " not found.\n";
            break;
        case 3:
            cout << "Enter value: "; cin >> x;
            cout << x << (search(root, x) ? " found.\n" : " not found.\n");
            break;
        case 4:
            if (!root) { cout << "Tree is empty.\n"; break; }
            cout << "Inorder: "; inorder(root); cout << "\n"; break;
        case 5:
            if (!root) { cout << "Tree is empty.\n"; break; }
            cout << "Preorder: "; preorder(root); cout << "\n"; break;
        case 6:
            if (!root) { cout << "Tree is empty.\n"; break; }
            showBalance(root);
            cout << "Tree height = " << height(root) << "\n";
            break;
        default: cout << "Invalid choice.\n";
        }
    }
    return 0;
}
