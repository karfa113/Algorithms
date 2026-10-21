#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int matrixChainOrder(vector<int>& p) {
    int n = p.size();
    vector<vector<int>> m(n, vector<int>(n, 0));
    for (int L = 2; L < n; L++)
        for (int i = 1; i < n - L + 1; i++) {
            int j = i + L - 1;
            m[i][j] = INT_MAX;
            for (int k = i; k < j; k++) {
                int q = m[i][k] + m[k+1][j] + p[i-1] * p[k] * p[j];
                if (q < m[i][j]) m[i][j] = q;
            }
        }
    return m[1][n-1];
}

int main() {
    int n; cout << "Matrices: "; cin >> n;
    vector<int> p(n + 1);
    cout << "Dimensions (p0 .. pn): ";
    for (auto& x : p) cin >> x;
    cout << "Min multiplications = " << matrixChainOrder(p) << endl;
    return 0;
}
