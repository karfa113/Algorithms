import java.util.*;

public class Main {
    static int matrixChainOrder(int[] p) {
        int n = p.length;
        int[][] m = new int[n][n];
        for (int L = 2; L < n; L++)
            for (int i = 1; i < n - L + 1; i++) {
                int j = i + L - 1;
                m[i][j] = Integer.MAX_VALUE;
                for (int k = i; k < j; k++) {
                    int q = m[i][k] + m[k+1][j] + p[i-1] * p[k] * p[j];
                    if (q < m[i][j]) m[i][j] = q;
                }
            }
        return m[1][n-1];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Matrices: ");
        int n = sc.nextInt();
        int[] p = new int[n + 1];
        System.out.print("Dimensions (p0 .. pn): ");
        for (int i = 0; i < p.length; i++) p[i] = sc.nextInt();
        System.out.println("Min multiplications = " + matrixChainOrder(p));
    }
}
