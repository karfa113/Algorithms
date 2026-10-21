#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int key;
    struct Node *left, *right;
} Node;

int found;   /* set by insert/removeKey to report the outcome */

Node *newNode(int k) {
    Node *n = malloc(sizeof(Node));
    n->key = k;
    n->left = n->right = NULL;
    return n;
}

Node *insert(Node *n, int key) {
    if (!n) { found = 0; return newNode(key); }
    if (key < n->key) n->left = insert(n->left, key);
    else if (key > n->key) n->right = insert(n->right, key);
    else found = 1;                      /* duplicate */
    return n;
}

Node *minNode(Node *n) { while (n->left) n = n->left; return n; }
Node *maxNode(Node *n) { while (n->right) n = n->right; return n; }

Node *removeKey(Node *n, int key) {
    if (!n) { found = 0; return NULL; }
    if (key < n->key) n->left = removeKey(n->left, key);
    else if (key > n->key) n->right = removeKey(n->right, key);
    else {
        found = 1;
        if (!n->left && !n->right) {                 /* case 1: leaf */
            printf("Case 1: leaf node\n");
            free(n);
            return NULL;
        }
        if (!n->left || !n->right) {                 /* case 2: one child */
            printf("Case 2: node with one child\n");
            Node *child = n->left ? n->left : n->right;
            free(n);
            return child;
        }
        printf("Case 3: node with two children\n");  /* case 3: two children */
        Node *s = minNode(n->right);                 /* inorder successor */
        n->key = s->key;
        n->right = removeKey(n->right, s->key);
        found = 1;
    }
    return n;
}

int search(Node *n, int key) {
    while (n) {
        if (key == n->key) return 1;
        n = key < n->key ? n->left : n->right;
    }
    return 0;
}

int height(Node *n) {
    if (!n) return 0;
    int l = height(n->left), r = height(n->right);
    return 1 + (l > r ? l : r);
}

void inorder(Node *n) { if (n) { inorder(n->left); printf("%d ", n->key); inorder(n->right); } }
void preorder(Node *n) { if (n) { printf("%d ", n->key); preorder(n->left); preorder(n->right); } }
void postorder(Node *n) { if (n) { postorder(n->left); postorder(n->right); printf("%d ", n->key); } }

void freeTree(Node *n) { if (n) { freeTree(n->left); freeTree(n->right); free(n); } }

int main(void) {
    Node *root = NULL;
    int choice, x;
    do {
        printf("\n--- Binary Search Tree ---\n1. Insert\n2. Delete\n3. Search\n4. Inorder\n5. Preorder\n6. Postorder\n7. Height\n8. Minimum and Maximum\n0. Exit\n");
        printf("Enter choice: ");
        if (scanf("%d", &choice) != 1) break;
        switch (choice) {
        case 1:
            printf("Enter value: "); scanf("%d", &x);
            root = insert(root, x);
            if (found) printf("%d already exists. Duplicates are not allowed.\n", x);
            else printf("%d inserted.\n", x);
            break;
        case 2:
            printf("Enter value: "); scanf("%d", &x);
            root = removeKey(root, x);
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
            printf("Postorder: "); postorder(root); printf("\n"); break;
        case 7:
            printf("Tree height = %d\n", height(root)); break;
        case 8:
            if (!root) { printf("Tree is empty.\n"); break; }
            printf("Minimum = %d\nMaximum = %d\n", minNode(root)->key, maxNode(root)->key);
            break;
        case 0: printf("Goodbye!\n"); break;
        default: printf("Invalid choice.\n");
        }
    } while (choice != 0);
    freeTree(root);
    return 0;
}
