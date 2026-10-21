#include <iostream>
#include <string>
using namespace std;

struct Node {
    Node* child[26];
    bool isEnd;                      // true if a word ends at this node
    Node() : isEnd(false) { for (int i = 0; i < 26; i++) child[i] = nullptr; }
};

bool validWord(const string& s) {    // only lowercase a-z allowed
    for (char ch : s)
        if (ch < 'a' || ch > 'z') return false;
    return true;
}

bool insert(Node* root, const string& w) {   // true if new, false if already present
    Node* cur = root;
    for (char ch : w) {
        int c = ch - 'a';
        if (!cur->child[c]) cur->child[c] = new Node();
        cur = cur->child[c];
    }
    bool isNew = !cur->isEnd;
    cur->isEnd = true;
    return isNew;
}

Node* walk(Node* root, const string& s) {    // node reached by s, or nullptr
    Node* cur = root;
    for (size_t i = 0; i < s.size() && cur; i++) cur = cur->child[s[i] - 'a'];
    return cur;
}

bool hasChild(Node* n) {
    for (int i = 0; i < 26; i++) if (n->child[i]) return true;
    return false;
}

// Unmark the word and free nodes that are no longer needed.
// Returns true if node n itself can be freed by its parent.
bool removeWord(Node* n, const string& w, size_t depth) {
    if (depth == w.size()) {
        n->isEnd = false;
    } else {
        int c = w[depth] - 'a';
        if (removeWord(n->child[c], w, depth + 1)) {
            delete n->child[c];
            n->child[c] = nullptr;
        }
    }
    return !n->isEnd && !hasChild(n);
}

// DFS in a..z order gives words in lexicographic order.
int collect(Node* n, string& buf) {
    int count = 0;
    if (n->isEnd) { cout << buf << " "; count++; }
    for (int i = 0; i < 26; i++)
        if (n->child[i]) {
            buf.push_back('a' + i);
            count += collect(n->child[i], buf);
            buf.pop_back();
        }
    return count;
}

int main() {
    Node* root = new Node();
    int choice;
    string w;
    while (true) {
        cout << "\n--- Trie ---\n1. Insert word\n2. Search word\n3. Starts with prefix\n4. Delete word\n5. List all words\n0. Exit\nEnter choice: ";
        if (!(cin >> choice)) break;
        if (choice == 0) { cout << "Goodbye!\n"; break; }
        switch (choice) {
        case 1:
            cout << "Enter word: "; cin >> w;
            if (!validWord(w)) { cout << "Invalid input. Use lowercase letters a-z only.\n"; break; }
            if (insert(root, w)) cout << w << " inserted.\n";
            else cout << w << " already exists.\n";
            break;
        case 2: {
            cout << "Enter word: "; cin >> w;
            if (!validWord(w)) { cout << "Invalid input. Use lowercase letters a-z only.\n"; break; }
            Node* n = walk(root, w);
            cout << w << ((n && n->isEnd) ? " found.\n" : " not found.\n");
            break;
        }
        case 3: {
            cout << "Enter prefix: "; cin >> w;
            if (!validWord(w)) { cout << "Invalid input. Use lowercase letters a-z only.\n"; break; }
            Node* n = walk(root, w);
            if (!n) { cout << "No word starts with " << w << ".\n"; break; }
            string buf = w;
            cout << "Words starting with " << w << ": ";
            collect(n, buf);
            cout << "\n";
            break;
        }
        case 4: {
            cout << "Enter word: "; cin >> w;
            if (!validWord(w)) { cout << "Invalid input. Use lowercase letters a-z only.\n"; break; }
            Node* n = walk(root, w);
            if (n && n->isEnd) { removeWord(root, w, 0); cout << w << " deleted.\n"; }
            else cout << w << " not found.\n";
            break;
        }
        case 5: {
            if (!hasChild(root)) { cout << "Trie is empty.\n"; break; }
            cout << "Words in lexicographic order: ";
            string buf;
            int total = collect(root, buf);
            cout << "\nTotal words = " << total << "\n";
            break;
        }
        default: cout << "Invalid choice.\n";
        }
    }
    return 0;
}
