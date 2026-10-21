#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    struct Node *child[26];
    int isEnd;                       /* 1 if a word ends at this node */
} Node;

Node *newNode(void) {
    return calloc(1, sizeof(Node));  /* all children NULL, isEnd 0 */
}

int validWord(const char *s) {       /* only lowercase a-z allowed */
    for (int i = 0; s[i]; i++)
        if (s[i] < 'a' || s[i] > 'z') return 0;
    return 1;
}

int insert(Node *root, const char *w) {   /* returns 1 if new, 0 if already present */
    Node *cur = root;
    for (int i = 0; w[i]; i++) {
        int c = w[i] - 'a';
        if (!cur->child[c]) cur->child[c] = newNode();
        cur = cur->child[c];
    }
    int isNew = !cur->isEnd;
    cur->isEnd = 1;
    return isNew;
}

Node *walk(Node *root, const char *s) {   /* node reached by s, or NULL */
    Node *cur = root;
    for (int i = 0; s[i] && cur; i++) cur = cur->child[s[i] - 'a'];
    return cur;
}

int hasChild(Node *n) {
    for (int i = 0; i < 26; i++) if (n->child[i]) return 1;
    return 0;
}

/* Unmark the word and free nodes that are no longer needed.
   Returns 1 if node n itself can be freed by its parent. */
int removeWord(Node *n, const char *w, int depth) {
    if (w[depth] == '\0') {
        n->isEnd = 0;
    } else {
        int c = w[depth] - 'a';
        if (removeWord(n->child[c], w, depth + 1)) {
            free(n->child[c]);
            n->child[c] = NULL;
        }
    }
    return !n->isEnd && !hasChild(n);
}

/* DFS in a..z order gives words in lexicographic order. */
int collect(Node *n, char *buf, int len) {
    int count = 0;
    if (n->isEnd) { buf[len] = '\0'; printf("%s ", buf); count++; }
    for (int i = 0; i < 26; i++)
        if (n->child[i]) {
            buf[len] = 'a' + i;
            count += collect(n->child[i], buf, len + 1);
        }
    return count;
}

int main() {
    Node *root = newNode();
    int choice;
    char w[100], buf[128];
    while (1) {
        printf("\n--- Trie ---\n1. Insert word\n2. Search word\n3. Starts with prefix\n4. Delete word\n5. List all words\n0. Exit\nEnter choice: ");
        if (scanf("%d", &choice) != 1) break;
        if (choice == 0) { printf("Goodbye!\n"); break; }
        switch (choice) {
        case 1:
            printf("Enter word: "); scanf("%99s", w);
            if (!validWord(w)) { printf("Invalid input. Use lowercase letters a-z only.\n"); break; }
            if (insert(root, w)) printf("%s inserted.\n", w);
            else printf("%s already exists.\n", w);
            break;
        case 2: {
            printf("Enter word: "); scanf("%99s", w);
            if (!validWord(w)) { printf("Invalid input. Use lowercase letters a-z only.\n"); break; }
            Node *n = walk(root, w);
            printf((n && n->isEnd) ? "%s found.\n" : "%s not found.\n", w);
            break;
        }
        case 3: {
            printf("Enter prefix: "); scanf("%99s", w);
            if (!validWord(w)) { printf("Invalid input. Use lowercase letters a-z only.\n"); break; }
            Node *n = walk(root, w);
            if (!n) { printf("No word starts with %s.\n", w); break; }
            strcpy(buf, w);
            printf("Words starting with %s: ", w);
            collect(n, buf, (int)strlen(w));
            printf("\n");
            break;
        }
        case 4: {
            printf("Enter word: "); scanf("%99s", w);
            if (!validWord(w)) { printf("Invalid input. Use lowercase letters a-z only.\n"); break; }
            Node *n = walk(root, w);
            if (n && n->isEnd) { removeWord(root, w, 0); printf("%s deleted.\n", w); }
            else printf("%s not found.\n", w);
            break;
        }
        case 5:
            if (!hasChild(root)) { printf("Trie is empty.\n"); break; }
            printf("Words in lexicographic order: ");
            int total = collect(root, buf, 0);
            printf("\nTotal words = %d\n", total);
            break;
        default: printf("Invalid choice.\n");
        }
    }
    return 0;
}
