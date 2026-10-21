import java.util.*;

public class Main {
    static int N;
    static int[][] board;

    static boolean isSafe(int row, int col) {
        for (int i = 0; i < col; i++) if (board[row][i] != 0) return false;
        for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) if (board[i][j] != 0) return false;
        for (int i = row, j = col; i < N && j >= 0; i++, j--) if (board[i][j] != 0) return false;
        return true;
    }

    static boolean solve(int col) {
        if (col >= N) return true;
        for (int i = 0; i < N; i++) {
            if (isSafe(i, col)) {
                board[i][col] = 1;
                if (solve(col + 1)) return true;
                board[i][col] = 0;   // backtrack
            }
        }
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("N: ");
        N = sc.nextInt();
        board = new int[N][N];
        if (solve(0)) {
            for (int[] r : board) {
                for (int x : r) System.out.print((x != 0 ? 'Q' : '.') + " ");
                System.out.print("\n");
            }
        } else System.out.print("No solution.\n");
    }
}
