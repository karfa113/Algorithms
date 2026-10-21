#include <iostream>
#include <vector>
using namespace std;

int N;
vector<vector<int>> board;

bool isSafe(int row, int col) {
    for (int i = 0; i < col; i++) if (board[row][i]) return false;
    for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j]) return false;
    for (int i = row, j = col; i < N && j >= 0; i++, j--) if (board[i][j]) return false;
    return true;
}

bool solve(int col) {
    if (col >= N) return true;
    for (int i = 0; i < N; i++) {
        if (isSafe(i, col)) {
            board[i][col] = 1;
            if (solve(col + 1)) return true;
            board[i][col] = 0;
        }
    }
    return false;
}

int main() {
    cout << "N: "; cin >> N;
    board.assign(N, vector<int>(N, 0));
    if (solve(0)) {
        for (auto& r : board) {
            for (int x : r) cout << (x ? 'Q' : '.') << " ";
            cout << "\n";
        }
    } else cout << "No solution.\n";
    return 0;
}
