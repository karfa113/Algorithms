import java.util.*;

public class Main {
    static final int INF = 99999;

    static void floydWarshall(int[][] d) {
        int n = d.length;
        for (int k = 0; k < n; k++)
            for (int i = 0; i < n; i++)
                for (int j = 0; j < n; j++)
                    if (d[i][k] + d[k][j] < d[i][j])
                        d[i][j] = d[i][k] + d[k][j];

        System.out.print("Shortest distances:\n");
        for (int[] row : d) {
            for (int x : row) {
                if (x >= INF) System.out.print("INF\t");
                else          System.out.print(x + "\t");
            }
            System.out.print("\n");
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Vertices: ");
        int n = sc.nextInt();
        int[][] d = new int[n][n];
        System.out.print("Adjacency matrix (use " + INF + " for no edge):\n");
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) d[i][j] = sc.nextInt();
        floydWarshall(d);
    }
}
