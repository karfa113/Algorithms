#include <iostream>
using namespace std;

struct Node {
    int key;
    Node *left, *right;
    Node(int k) : key(k), left(nullptr), right(nullptr) {}
};

bool found;   // set by insert/remove to report the outcome

Node* insert(Node* n, int key) {
    if (!n) { found = false; return new Node(key); }
    if (key < n->key) n->left = insert(n->left, key);
    else if (key > n->key) n->right = insert(n->right, key);
    else found = true;                   // duplicate
    return n;
}

Node* minNode(Node* n) { while (n->left) n = n->left; return n; }
Node* maxNode(Node* n) { while (n->right) n = n->right; return n; }

Node* remove(Node* n, int key) {
    if (!n) { found = false; return nullptr; }
    if (key < n->key) n->left = remove(n->left, key);
    else if (key > n->key) n->right = remove(n->right, key);
    else {
        found = true;
        if (!n->left && !n->right) {                 // case 1: leaf
            cout << "Case 1: leaf node\n";
            delete n;
            return nullptr;
        }
        if (!n->left || !n->right) {                 // case 2: one child
            cout << "Case 2: node with one child\n";
            Node* child = n->left ? n->left : n->right;
            delete n;
            return child;
        }
        cout << "Case 3: node with two children\n";  // case 3: two children
        Node* s = minNode(n->right);                 // inorder successor
        n->key = s->key;
        n->right = remove(n->right, s->key);
        found = true;
    }
    return n;
}

bool search(Node* n, int key) {
    while (n) {
        if (key == n->key) return true;
        n = key < n->key ? n->left : n->right;
    }
    return false;
}

int height(Node* n) {
    if (!n) return 0;
    int l = height(n->left), r = height(n->right);
    return 1 + (l > r ? l : r);
}

void inorder(Node* n) { if (n) { inorder(n->left); cout << n->key << " "; inorder(n->right); } }
void preorder(Node* n) { if (n) { cout << n->key << " "; preorder(n->left); preorder(n->right); } }
void postorder(Node* n) { if (n) { postorder(n->left); postorder(n->right); cout << n->key << " "; } }

void freeTree(Node* n) { if (n) { freeTree(n->left); freeTree(n->right); delete n; } }

int main() {
    Node* root = nullptr;
    int choice, x;
    while (true) {
        cout << "\n--- Binary Search Tree ---\n1. Insert\n2. Delete\n3. Search\n4. Inorder\n5. Preorder\n6. Postorder\n7. Height\n8. Minimum and Maximum\n0. Exit\nEnter choice: ";
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
            cout << "Postorder: "; postorder(root); cout << "\n"; break;
        case 7:
            cout << "Tree height = " << height(root) << "\n"; break;
        case 8:
            if (!root) { cout << "Tree is empty.\n"; break; }
            cout << "Minimum = " << minNode(root)->key << "\nMaximum = " << maxNode(root)->key << "\n";
            break;
        default: cout << "Invalid choice.\n";
        }
    }
    freeTree(root);
    return 0;
}
