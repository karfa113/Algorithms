import java.util.Scanner;

public class Main {
    static final int MAX = 100;

    static int[][] adj = new int[MAX][MAX];
    static int[] visited = new int[MAX];
    static int[] q = new int[MAX];
    static int front_ = 0, rear_ = 0;

    static void enqueue(int x) { q[rear_++] = x; }
    static int dequeue()       { return q[front_++]; }
    static boolean empty_()    { return front_ == rear_; }

    static void bfs(int start, int n) {
        enqueue(start);
        visited[start] = 1;
        while (!empty_()) {
            int u = dequeue();
            System.out.print(u + " ");
            for (int v = 0; v < n; v++)
                if (adj[u][v] != 0 && visited[v] == 0) {
                    visited[v] = 1;
                    enqueue(v);
                }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Vertices: ");
        int n = sc.nextInt();
        System.out.print("Edges: ");
        int e = sc.nextInt();
        System.out.print("Edges (u v):\n");
        while (e-- > 0) {
            int u = sc.nextInt(), v = sc.nextInt();
            adj[u][v] = adj[v][u] = 1;
        }
        System.out.print("Source: ");
        int src = sc.nextInt();
        System.out.print("BFS: ");
        bfs(src, n);
        System.out.println();
    }
}
