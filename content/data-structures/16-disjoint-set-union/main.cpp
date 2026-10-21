#include <iostream>
#include <iomanip>
using namespace std;

const int MAX = 50;

class DSU {
    int parent[MAX], rnk[MAX];
public:
    int n = 0;

    void make(int count) {
        n = count;
        for (int i = 0; i < n; i++) { parent[i] = i; rnk[i] = 0; }
    }

    // Find the representative of x; compress the path on the way back.
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    // Union by rank: attach the shorter tree under the taller one.
    bool unite(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (rnk[ra] < rnk[rb]) swap(ra, rb);
        parent[rb] = ra;
        if (rnk[ra] == rnk[rb]) rnk[ra]++;
        return true;
    }

    void display() {
        cout << "Element: ";
        for (int i = 0; i < n; i++) cout << setw(3) << i;
        cout << "\nParent : ";
        for (int i = 0; i < n; i++) cout << setw(3) << parent[i];
        cout << "\nRank   : ";
        for (int i = 0; i < n; i++) cout << setw(3) << rnk[i];
        cout << "\n";
    }
};

int main() {
    DSU d;
    int choice, a, b;
    do {
        cout << "\n--- Disjoint Set Union ---\n";
        cout << "1. Make sets\n2. Union\n3. Find\n4. Connected?\n5. Display\n0. Exit\n";
        cout << "Enter choice: ";
        if (!(cin >> choice)) break;
        if (choice >= 2 && choice <= 5 && d.n == 0) { cout << "Make sets first.\n"; continue; }
        switch (choice) {
            case 1:
                cout << "Enter number of elements: "; cin >> a;
                if (a < 1 || a > MAX) { cout << "Number of elements must be between 1 and " << MAX << ".\n"; break; }
                d.make(a);
                cout << "Created " << a << " singleton sets (0 to " << a - 1 << ").\n";
                break;
            case 2:
                cout << "Enter two elements: "; cin >> a >> b;
                if (a < 0 || a >= d.n || b < 0 || b >= d.n) { cout << "Invalid element. Elements are 0 to " << d.n - 1 << ".\n"; break; }
                if (d.unite(a, b)) cout << "Merged the sets of " << a << " and " << b << ".\n";
                else cout << a << " and " << b << " are already in the same set.\n";
                break;
            case 3:
                cout << "Enter element: "; cin >> a;
                if (a < 0 || a >= d.n) { cout << "Invalid element. Elements are 0 to " << d.n - 1 << ".\n"; break; }
                cout << "Representative of " << a << " is " << d.find(a) << "\n";
                break;
            case 4:
                cout << "Enter two elements: "; cin >> a >> b;
                if (a < 0 || a >= d.n || b < 0 || b >= d.n) { cout << "Invalid element. Elements are 0 to " << d.n - 1 << ".\n"; break; }
                cout << a << " and " << b << " are " << (d.find(a) == d.find(b) ? "connected" : "not connected") << ".\n";
                break;
            case 5: d.display(); break;
            case 0: cout << "Goodbye!\n"; break;
            default: cout << "Invalid choice.\n";
        }
    } while (choice != 0);
    return 0;
}
