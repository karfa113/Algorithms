import java.util.Scanner;

public class Main {
    static final int MAX = 100;

    static int[][] adj = new int[MAX][MAX];
    static int[] visited = new int[MAX];
    static int n;

    // Recursive DFS
    static void dfsRec(int u) {
        visited[u] = 1;
        System.out.print(u + " ");
        for (int v = 0; v < n; v++)
            if (adj[u][v] != 0 && visited[v] == 0)
                dfsRec(v);
    }

    // Iterative DFS using an explicit stack
    static void dfsIter(int start) {
        int[] stack_ = new int[MAX];
        int top = -1;
        int[] seen = new int[MAX];
        stack_[++top] = start;
        while (top >= 0) {
            int u = stack_[top--];
            if (seen[u] != 0) continue;
            seen[u] = 1;
            System.out.print(u + " ");
            for (int v = n - 1; v >= 0; v--)
                if (adj[u][v] != 0 && seen[v] == 0)
                    stack_[++top] = v;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Vertices: ");
        n = sc.nextInt();
        System.out.print("Edges: ");
        int e = sc.nextInt();
        System.out.print("Edges (u v):\n");
        while (e-- > 0) {
            int u = sc.nextInt(), v = sc.nextInt();
            adj[u][v] = adj[v][u] = 1;
        }
        System.out.print("Source: ");
        int src = sc.nextInt();

        System.out.print("Recursive DFS: "); dfsRec(src);
        System.out.print("\nIterative DFS: "); dfsIter(src);
        System.out.println();
    }
}
