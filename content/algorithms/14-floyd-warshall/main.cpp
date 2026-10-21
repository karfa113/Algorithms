#include <iostream>
#include <vector>
using namespace std;
const int INF = 99999;

void floydWarshall(vector<vector<int>>& d) {
    int n = d.size();
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (d[i][k] + d[k][j] < d[i][j])
                    d[i][j] = d[i][k] + d[k][j];

    cout << "Shortest distances:\n";
    for (auto& row : d) {
        for (int x : row) {
            if (x >= INF) cout << "INF\t";
            else          cout << x << "\t";
        }
        cout << "\n";
    }
}

int main() {
    int n; cout << "Vertices: "; cin >> n;
    vector<vector<int>> d(n, vector<int>(n));
    cout << "Adjacency matrix (use " << INF << " for no edge):\n";
    for (auto& r : d) for (auto& x : r) cin >> x;
    floydWarshall(d);
    return 0;
}
