import java.util.*;

public class Main {
    static int n, m;
    static int[][] graph;
    static int[] color;

    static boolean isSafe(int v, int c) {
        for (int i = 0; i < n; i++)
            if (graph[v][i] != 0 && color[i] == c) return false;
        return true;
    }

    static boolean graphColoring(int v) {
        if (v == n) return true;
        for (int c = 1; c <= m; c++) {
            if (isSafe(v, c)) {
                color[v] = c;
                if (graphColoring(v + 1)) return true;
                color[v] = 0;   // backtrack
            }
        }
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int e, u, v;
        System.out.print("Vertices: ");
        n = sc.nextInt();
        System.out.print("Edges: ");
        e = sc.nextInt();
        graph = new int[n][n];
        color = new int[n];
        System.out.print("Edges (u v):\n");
        while (e-- > 0) { u = sc.nextInt(); v = sc.nextInt(); graph[u][v] = graph[v][u] = 1; }
        System.out.print("Colors m: ");
        m = sc.nextInt();

        if (graphColoring(0)) {
            System.out.print("Coloring: ");
            for (int i = 0; i < n; i++) System.out.print("V" + i + "=" + color[i] + " ");
            System.out.println();
        } else System.out.print("Not possible with " + m + " colors.\n");
    }
}
