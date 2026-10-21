import java.util.Arrays;
import java.util.Scanner;

public class Main {
    static class Edge { int u, v, w; }

    static int[] parent = new int[100];
    static int[] rnk = new int[100];

    // Find with path compression
    static int find(int x) {
        return parent[x] == x ? x : (parent[x] = find(parent[x]));
    }

    // Union by rank
    static void unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return;
        if (rnk[a] < rnk[b]) parent[a] = b;
        else if (rnk[a] > rnk[b]) parent[b] = a;
        else { parent[b] = a; rnk[a]++; }
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

        // Sort edges by weight (smallest first)
        Arrays.sort(edges, (a, b) -> Integer.compare(a.w, b.w));
        for (int i = 0; i < n; i++) { parent[i] = i; rnk[i] = 0; }

        int total = 0, taken = 0;
        System.out.print("MST edges:\n");
        for (Edge x : edges) {
            if (taken == n - 1) break;
            if (find(x.u) != find(x.v)) {
                unite(x.u, x.v);
                System.out.print(x.u + " - " + x.v + " : " + x.w + "\n");
                total += x.w; taken++;
            }
        }
        System.out.println("Total cost = " + total);
    }
}
