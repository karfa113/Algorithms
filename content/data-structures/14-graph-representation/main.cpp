#include <iostream>
#include <iomanip>
#include <vector>
#include <string>
using namespace std;

const int MAX = 50;

int n = 0;
bool directed = false, created = false;
vector<vector<int>> matrix;   // adjacency matrix
vector<vector<int>> adj;      // adjacency list: one vector per vertex

string arrow() { return directed ? "->" : "-"; }

void addEdge(int u, int v) {
    if (u < 0 || u >= n || v < 0 || v >= n) { cout << "Invalid vertex. Vertices are 0 to " << n - 1 << ".\n"; return; }
    if (u == v) { cout << "Self loops are not allowed.\n"; return; }
    if (matrix[u][v]) { cout << "Edge " << u << " " << arrow() << " " << v << " already exists.\n"; return; }
    matrix[u][v] = 1;
    adj[u].push_back(v);
    if (!directed) { matrix[v][u] = 1; adj[v].push_back(u); }
    cout << "Edge " << u << " " << arrow() << " " << v << " added.\n";
}

void showMatrix() {
    cout << "Adjacency matrix:\n    ";
    for (int j = 0; j < n; j++) cout << setw(3) << j;
    cout << "\n";
    for (int i = 0; i < n; i++) {
        cout << setw(3) << i << ":";
        for (int j = 0; j < n; j++) cout << setw(3) << matrix[i][j];
        cout << "\n";
    }
}

void showList() {
    cout << "Adjacency list:\n";
    for (int i = 0; i < n; i++) {
        cout << i;
        for (int v : adj[i]) cout << " -> " << v;
        cout << " -> NULL\n";
    }
}

void showDegrees() {
    for (int i = 0; i < n; i++) {
        int out = 0, in = 0;
        for (int j = 0; j < n; j++) { out += matrix[i][j]; in += matrix[j][i]; }
        if (directed) cout << "Vertex " << i << ": in-degree = " << in << ", out-degree = " << out << ", total = " << in + out << "\n";
        else cout << "Vertex " << i << ": degree = " << out << "\n";
    }
}

int main() {
    int choice, u, v, e;
    while (true) {
        cout << "\n--- Graph Representation ---\n1. Create graph\n2. Add edge\n3. Display adjacency matrix\n4. Display adjacency list\n5. Degree of vertices\n6. Check if edge exists\n0. Exit\nEnter choice: ";
        if (!(cin >> choice)) break;
        if (choice == 0) { cout << "Goodbye!\n"; break; }
        if (choice >= 2 && choice <= 6 && !created) { cout << "Create a graph first.\n"; continue; }
        switch (choice) {
        case 1:
            cout << "Enter number of vertices: "; cin >> v;
            if (v < 1 || v > MAX) { cout << "Number of vertices must be between 1 and " << MAX << ".\n"; break; }
            cout << "Enter graph type (1 = Directed, 2 = Undirected): "; cin >> u;
            if (u != 1 && u != 2) { cout << "Invalid graph type.\n"; break; }
            n = v; directed = (u == 1); created = true;
            matrix.assign(n, vector<int>(n, 0));
            adj.assign(n, vector<int>());
            cout << "Enter number of edges: "; cin >> e;
            for (int i = 0; i < e; i++) {
                cout << "Enter edge " << i + 1 << " (u v): "; cin >> u >> v;
                addEdge(u, v);
            }
            cout << (directed ? "Directed" : "Undirected") << " graph with " << n << " vertices created.\n";
            break;
        case 2:
            cout << "Enter edge (u v): "; cin >> u >> v;
            addEdge(u, v); break;
        case 3: showMatrix(); break;
        case 4: showList(); break;
        case 5: showDegrees(); break;
        case 6:
            cout << "Enter edge (u v): "; cin >> u >> v;
            if (u < 0 || u >= n || v < 0 || v >= n) { cout << "Invalid vertex. Vertices are 0 to " << n - 1 << ".\n"; break; }
            cout << "Edge " << u << " " << arrow() << " " << v << (matrix[u][v] ? " exists.\n" : " does not exist.\n");
            break;
        default: cout << "Invalid choice.\n";
        }
    }
    return 0;
}
