import java.util.*;

public class Main {
    static class Edge {
        int u, v, w;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Vertices: ");
        int n = sc.nextInt();
        System.out.print("Edges: ");
        int e = sc.nextInt();
        Edge[] edges = new Edge[e];
        System.out.print("u v w:\n");
        for (int i = 0; i < e; i++) {
            edges[i] = new Edge();
            edges[i].u = sc.nextInt();
            edges[i].v = sc.nextInt();
            edges[i].w = sc.nextInt();
        }
        System.out.print("Source: ");
        int src = sc.nextInt();

        long[] dist = new long[n];
        Arrays.fill(dist, Long.MAX_VALUE);
        dist[src] = 0;

        for (int i = 0; i < n - 1; i++)
            for (Edge x : edges)
                if (dist[x.u] != Long.MAX_VALUE && dist[x.u] + x.w < dist[x.v])
                    dist[x.v] = dist[x.u] + x.w;

        for (Edge x : edges)
            if (dist[x.u] != Long.MAX_VALUE && dist[x.u] + x.w < dist[x.v]) {
                System.out.println("Negative-weight cycle detected.");
                return;
            }

        System.out.print("Vertex\tDistance\n");
        for (int i = 0; i < n; i++) {
            if (dist[i] == Long.MAX_VALUE) System.out.print(i + "\tINF\n");
            else                           System.out.print(i + "\t" + dist[i] + "\n");
        }
    }
}
