import java.util.*;

public class Main {
    static void primMST(int[][] g, int n) {
        int[] key = new int[n], parent = new int[n];
        boolean[] inMST = new boolean[n];
        Arrays.fill(key, Integer.MAX_VALUE);
        Arrays.fill(parent, -1);
        key[0] = 0;

        for (int count = 0; count < n - 1; count++) {
            int u = -1, min_ = Integer.MAX_VALUE;
            for (int v = 0; v < n; v++)
                if (!inMST[v] && key[v] < min_) { min_ = key[v]; u = v; }

            inMST[u] = true;
            for (int v = 0; v < n; v++)
                if (g[u][v] != 0 && !inMST[v] && g[u][v] < key[v]) {
                    parent[v] = u;
                    key[v]    = g[u][v];
                }
        }

        int total = 0;
        System.out.print("Edge\tWeight\n");
        for (int i = 1; i < n; i++) {
            System.out.print(parent[i] + " - " + i + "\t" + g[i][parent[i]] + "\n");
            total += g[i][parent[i]];
        }
        System.out.println("Total cost = " + total);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Vertices: ");
        int n = sc.nextInt();
        int[][] g = new int[n][n];
        System.out.print("Adjacency matrix (0 if no edge):\n");
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) g[i][j] = sc.nextInt();
        primMST(g, n);
    }
}
