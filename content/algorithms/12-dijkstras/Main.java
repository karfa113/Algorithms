import java.util.*;

public class Main {
    static void dijkstra(int[][] g, int src) {
        int n = g.length;
        int[] dist = new int[n];
        boolean[] visited = new boolean[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        for (int count = 0; count < n - 1; count++) {
            int u = -1, min_ = Integer.MAX_VALUE;
            for (int v = 0; v < n; v++)
                if (!visited[v] && dist[v] < min_) { min_ = dist[v]; u = v; }
            if (u == -1) break;
            visited[u] = true;
            for (int v = 0; v < n; v++)
                if (!visited[v] && g[u][v] != 0 && dist[u] != Integer.MAX_VALUE
                    && dist[u] + g[u][v] < dist[v])
                        dist[v] = dist[u] + g[u][v];
        }

        System.out.print("Vertex\tDistance\n");
        for (int i = 0; i < n; i++) System.out.print(i + "\t" + dist[i] + "\n");
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Vertices: ");
        int n = sc.nextInt();
        int[][] g = new int[n][n];
        System.out.print("Adjacency matrix:\n");
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) g[i][j] = sc.nextInt();
        System.out.print("Source: ");
        int src = sc.nextInt();
        dijkstra(g, src);
    }
}
