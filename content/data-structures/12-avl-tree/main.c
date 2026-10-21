#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int key, height;
    struct Node *left, *right;
} Node;

int height(Node *n) { return n ? n->height : 0; }
int maxi(int a, int b) { return a > b ? a : b; }
int balance(Node *n) { return n ? height(n->left) - height(n->right) : 0; }
void update(Node *n) { n->height = 1 + maxi(height(n->left), height(n->right)); }

Node *newNode(int key) {
    Node *n = malloc(sizeof(Node));
    n->key = key; n->height = 1; n->left = n->right = NULL;
    return n;
}

Node *rotateRight(Node *y) {      /* y's left child x becomes the new root */
    Node *x = y->left;
    y->left = x->right;
    x->right = y;
    update(y); update(x);
    return x;
}

Node *rotateLeft(Node *x) {       /* x's right child y becomes the new root */
    Node *y = x->right;
    x->right = y->left;
    y->left = x;
    update(x); update(y);
    return y;
}

/* Restore the AVL property at n (children are already balanced). */
Node *rebalance(Node *n) {
    update(n);
    int bf = balance(n);
    if (bf > 1) {
        if (balance(n->left) >= 0) {
            printf("Rotation: LL case at %d (right rotation)\n", n->key);
        } else {
            printf("Rotation: LR case at %d (left-right rotation)\n", n->key);
            n->left = rotateLeft(n->left);
        }
        return rotateRight(n);
    }
    if (bf < -1) {
        if (balance(n->right) <= 0) {
            printf("Rotation: RR case at %d (left rotation)\n", n->key);
        } else {
            printf("Rotation: RL case at %d (right-left rotation)\n", n->key);
            n->right = rotateRight(n->right);
        }
        return rotateLeft(n);
    }
    return n;
}

int found;   /* set by insert/delete to report the outcome */

Node *insert(Node *n, int key) {
    if (!n) { found = 0; return newNode(key); }
    if (key < n->key) n->left = insert(n->left, key);
    else if (key > n->key) n->right = insert(n->right, key);
    else { found = 1; return n; }          /* duplicate */
    return rebalance(n);
}

Node *minNode(Node *n) { while (n->left) n = n->left; return n; }

Node *delete(Node *n, int key) {
    if (!n) { found = 0; return NULL; }
    if (key < n->key) n->left = delete(n->left, key);
    else if (key > n->key) n->right = delete(n->right, key);
    else {
        found = 1;
        if (!n->left || !n->right) {       /* 0 or 1 child */
            Node *child = n->left ? n->left : n->right;
            free(n);
            return child;
        }
        Node *s = minNode(n->right);       /* inorder successor */
        n->key = s->key;
        n->right = delete(n->right, s->key);
    }
    return rebalance(n);
}

int search(Node *n, int key) {
    while (n) {
        if (key == n->key) return 1;
        n = key < n->key ? n->left : n->right;
    }
    return 0;
}

void inorder(Node *n) { if (n) { inorder(n->left); printf("%d ", n->key); inorder(n->right); } }
void preorder(Node *n) { if (n) { printf("%d ", n->key); preorder(n->left); preorder(n->right); } }
void showBalance(Node *n) {
    if (n) {
        showBalance(n->left);
        printf("Node %d: height = %d, balance factor = %d\n", n->key, n->height, balance(n));
        showBalance(n->right);
    }
}

int main() {
    Node *root = NULL;
    int choice, x;
    while (1) {
        printf("\n--- AVL Tree ---\n1. Insert\n2. Delete\n3. Search\n4. Inorder\n5. Preorder\n6. Height and balance factors\n0. Exit\nEnter choice: ");
        if (scanf("%d", &choice) != 1) break;
        if (choice == 0) { printf("Goodbye!\n"); break; }
        switch (choice) {
        case 1:
            printf("Enter value: "); scanf("%d", &x);
            root = insert(root, x);
            if (found) printf("%d already exists. Duplicates are not allowed.\n", x);
            else printf("%d inserted.\n", x);
            break;
        case 2:
            printf("Enter value: "); scanf("%d", &x);
            root = delete(root, x);
            if (found) printf("%d deleted.\n", x);
            else printf("%d not found.\n", x);
            break;
        case 3:
            printf("Enter value: "); scanf("%d", &x);
            printf(search(root, x) ? "%d found.\n" : "%d not found.\n", x);
            break;
        case 4:
            if (!root) { printf("Tree is empty.\n"); break; }
            printf("Inorder: "); inorder(root); printf("\n"); break;
        case 5:
            if (!root) { printf("Tree is empty.\n"); break; }
            printf("Preorder: "); preorder(root); printf("\n"); break;
        case 6:
            if (!root) { printf("Tree is empty.\n"); break; }
            showBalance(root);
            printf("Tree height = %d\n", height(root));
            break;
        default: printf("Invalid choice.\n");
        }
    }
    return 0;
}
