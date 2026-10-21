#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int n;
vector<vector<int>> cost_;
vector<int> finalPath;
vector<bool> visited;
int finalRes = INT_MAX;

void copyToFinal(vector<int>& currPath) {
    for (int i = 0; i < n; i++) finalPath[i] = currPath[i];
    finalPath[n] = currPath[0];
}

int firstMin(int i) {
    int mn = INT_MAX;
    for (int k = 0; k < n; k++)
        if (cost_[i][k] < mn && i != k) mn = cost_[i][k];
    return mn;
}

int secondMin(int i) {
    int first = INT_MAX, second = INT_MAX;
    for (int j = 0; j < n; j++) {
        if (i == j) continue;
        if (cost_[i][j] <= first) { second = first; first = cost_[i][j]; }
        else if (cost_[i][j] <= second && cost_[i][j] != first) second = cost_[i][j];
    }
    return second;
}

void TSPRec(int currBound, int currWeight, int level, vector<int>& currPath) {
    if (level == n) {
        if (cost_[currPath[level - 1]][currPath[0]] != 0) {
            int currRes = currWeight + cost_[currPath[level - 1]][currPath[0]];
            if (currRes < finalRes) {
                copyToFinal(currPath);
                finalRes = currRes;
            }
        }
        return;
    }
    for (int i = 0; i < n; i++) {
        if (cost_[currPath[level - 1]][i] != 0 && !visited[i]) {
            int temp = currBound;
            currWeight += cost_[currPath[level - 1]][i];

            if (level == 1)
                currBound -= ((firstMin(currPath[level - 1]) + firstMin(i)) / 2);
            else
                currBound -= ((secondMin(currPath[level - 1]) + firstMin(i)) / 2);

            if (currBound + currWeight < finalRes) {
                currPath[level] = i;
                visited[i] = true;
                TSPRec(currBound, currWeight, level + 1, currPath);
            }
            currWeight -= cost_[currPath[level - 1]][i];
            currBound = temp;
            fill(visited.begin(), visited.end(), false);
            for (int j = 0; j <= level - 1; j++) visited[currPath[j]] = true;
        }
    }
}

void TSP() {
    vector<int> currPath(n + 1, -1);
    visited.assign(n, false);
    finalPath.assign(n + 1, -1);

    int currBound = 0;
    for (int i = 0; i < n; i++) currBound += (firstMin(i) + secondMin(i));
    currBound = (currBound & 1) ? currBound / 2 + 1 : currBound / 2;

    visited[0] = true;
    currPath[0] = 0;
    TSPRec(currBound, 0, 1, currPath);
}

int main() {
    cout << "Number of cities: "; cin >> n;
    cost_.assign(n, vector<int>(n, 0));
    cout << "Cost matrix (0 if no edge):\n";
    for (auto& r : cost_) for (auto& x : r) cin >> x;

    TSP();
    cout << "Minimum cost = " << finalRes << endl;
    cout << "Path: ";
    for (int x : finalPath) cout << x << " ";
    cout << endl;
    return 0;
}
