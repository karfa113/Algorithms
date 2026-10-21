import java.util.*;

public class Main {
    static int n;
    static int[][] rGraph;

    // BFS to find an augmenting path in the residual graph
    static boolean bfs(int s, int t, int[] parent) {
        boolean[] visited = new boolean[n];
        Queue<Integer> q = new LinkedList<>();
        q.add(s);
        visited[s] = true;
        parent[s] = -1;
        while (!q.isEmpty()) {
            int u = q.poll();
            for (int v = 0; v < n; v++) {
                if (!visited[v] && rGraph[u][v] > 0) {
                    parent[v] = u;
                    visited[v] = true;
                    if (v == t) return true;
                    q.add(v);
                }
            }
        }
        return false;
    }

    static int fordFulkerson(int s, int t) {
        int[] parent = new int[n];
        int maxFlow = 0;
        while (bfs(s, t, parent)) {
            int pathFlow = Integer.MAX_VALUE;
            for (int v = t; v != s; v = parent[v]) {
                int u = parent[v];
                pathFlow = Math.min(pathFlow, rGraph[u][v]);
            }
            for (int v = t; v != s; v = parent[v]) {
                int u = parent[v];
                rGraph[u][v] -= pathFlow;
                rGraph[v][u] += pathFlow;
            }
            maxFlow += pathFlow;
        }
        return maxFlow;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int s, t;
        System.out.print("Vertices: ");
        n = sc.nextInt();
        rGraph = new int[n][n];
        System.out.print("Capacity matrix:\n");
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) rGraph[i][j] = sc.nextInt();
        System.out.print("Source: ");
        s = sc.nextInt();
        System.out.print("Sink: ");
        t = sc.nextInt();
        System.out.println("Maximum flow = " + fordFulkerson(s, t));
    }
}
